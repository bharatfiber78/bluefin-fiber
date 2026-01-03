const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Plan = require('../models/Plan');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const SupportTicket = require('../models/SupportTicket');
    
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalPlans = await Plan.countDocuments();
    const pendingPayments = await Payment.countDocuments({ status: 'pending' });
    const activeUsers = await User.countDocuments({ 'activePlan.status': 'active' });
    const openTickets = await SupportTicket.countDocuments({ status: 'open' });
    const urgentTickets = await SupportTicket.countDocuments({ priority: 'urgent', status: { $ne: 'closed' } });

    const recentPayments = await Payment.find()
      .populate('userId', 'name email')
      .populate('planId', 'name price')
      .sort({ submittedAt: -1 })
      .limit(10);

    res.json({
      stats: {
        totalUsers,
        totalPlans,
        pendingPayments,
        activeUsers,
        openTickets,
        urgentTickets,
      },
      recentPayments,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .populate('activePlan.planId')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single user
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('activePlan.planId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const payments = await Payment.find({ userId: user._id })
      .populate('planId')
      .sort({ submittedAt: -1 });

    res.json({ user, payments });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create plan
router.post(
  '/plans',
  [
    body('name').trim().notEmpty().withMessage('Plan name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('speed').trim().notEmpty().withMessage('Speed is required'),
    body('validity').isInt({ min: 1 }).withMessage('Validity must be a positive number'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description, speed, validity, price, features } = req.body;

      const plan = new Plan({
        name,
        description,
        speed,
        validity,
        price,
        features: features || [],
      });

      await plan.save();
      res.status(201).json(plan);
    } catch (error) {
      console.error('Create plan error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update plan
router.put('/plans/:id', async (req, res) => {
  try {
    const { name, description, speed, validity, price, features, isActive } = req.body;

    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        speed,
        validity,
        price,
        features: features || [],
        isActive,
      },
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json(plan);
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete plan
router.delete('/plans/:id', async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all payments
router.get('/payments', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const payments = await Payment.find(query)
      .populate('userId', 'name email phone address')
      .populate('planId', 'name price speed validity')
      .populate('reviewedBy', 'name')
      .sort({ submittedAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify payment
router.put('/payments/:id/verify', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const payment = await Payment.findById(req.params.id).populate('planId');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = status;
    payment.adminNotes = adminNotes || '';
    payment.reviewedAt = new Date();
    payment.reviewedBy = req.user._id;

    await payment.save();

    // If approved, activate the plan for the user
    if (status === 'approved') {
      const user = await User.findById(payment.userId);
      const plan = payment.planId;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.validity);

      user.activePlan = {
        planId: plan._id,
        startDate,
        endDate,
        status: 'active',
      };

      await user.save();

      // Create success notification for user
      const notification = new Notification({
        userId: payment.userId,
        title: 'Payment Approved',
        message: `Your payment for ${plan.name} has been approved. Your plan is now active!`,
        type: 'success',
        link: '/dashboard',
      });
      await notification.save();
    } else {
      // Create error notification for rejected payment
      const notification = new Notification({
        userId: payment.userId,
        title: 'Payment Rejected',
        message: `Your payment has been rejected. ${adminNotes ? `Reason: ${adminNotes}` : 'Please contact support for more information.'}`,
        type: 'error',
        link: '/dashboard',
      });
      await notification.save();
    }

    res.json({
      message: `Payment ${status} successfully`,
      payment,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

