const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Plan = require('../models/Plan');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Submit payment
router.post('/submit', auth, upload.single('screenshot'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Payment screenshot is required' });
    }

    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ message: 'Plan ID is required' });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Check if user already has a pending payment for this plan
    const existingPayment = await Payment.findOne({
      userId: req.user._id,
      planId,
      status: 'pending',
    });

    if (existingPayment) {
      // Delete the new file if payment already exists
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'You already have a pending payment for this plan' });
    }

    const payment = new Payment({
      userId: req.user._id,
      planId,
      amount: plan.price,
      screenshot: `/uploads/${req.file.filename}`,
      status: 'pending',
    });

    await payment.save();

    res.status(201).json({
      message: 'Payment submitted successfully',
      payment,
    });
  } catch (error) {
    console.error('Submit payment error:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's payment history
router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate('planId')
      .sort({ submittedAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single payment
router.get('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('planId')
      .populate('userId', 'name email phone');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // User can only see their own payments unless admin
    if (req.user.role !== 'admin' && payment.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

