const express = require('express');
const { body, validationResult } = require('express-validator');
const SupportTicket = require('../models/SupportTicket');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Create support ticket
router.post(
  '/tickets',
  auth,
  [
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { subject, message, category, priority } = req.body;

      const ticket = new SupportTicket({
        userId: req.user._id,
        subject,
        message,
        category: category || 'general',
        priority: priority || 'medium',
      });

      await ticket.save();

      // Create notification for admin
      const adminNotification = new Notification({
        userId: req.user._id,
        title: 'New Support Ticket',
        message: `New ticket: ${subject}`,
        type: 'info',
        link: `/admin/support/${ticket._id}`,
      });
      await adminNotification.save();

      res.status(201).json(ticket);
    } catch (error) {
      console.error('Create ticket error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get user's tickets
router.get('/tickets', auth, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user._id })
      .populate('replies.repliedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single ticket
router.get('/tickets/:id', auth, async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('replies.repliedBy', 'name email role')
      .populate('resolvedBy', 'name');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (req.user.role !== 'admin' && ticket.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User: Reply to ticket
router.post('/tickets/:id/reply', auth, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Reply message is required' });
    }

    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user owns the ticket
    if (ticket.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Add reply
    ticket.replies = ticket.replies || [];
    ticket.replies.push({
      message: message.trim(),
      repliedBy: req.user._id,
      isAdmin: false,
    });

    // If ticket was resolved/closed, reopen it
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      ticket.status = 'open';
    }

    await ticket.save();

    // Create notification for admin
    const adminUsers = await User.find({ role: 'admin' });
    for (const admin of adminUsers) {
      const notification = new Notification({
        userId: admin._id,
        title: 'New Reply on Ticket',
        message: `User replied to ticket: "${ticket.subject}"`,
        type: 'info',
        link: `/admin/support`,
      });
      await notification.save();
    }

    const updatedTicket = await SupportTicket.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('replies.repliedBy', 'name email role');

    res.json(updatedTicket);
  } catch (error) {
    console.error('User reply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all tickets with filters
router.get('/admin/tickets', adminAuth, async (req, res) => {
  try {
    const { status, priority, category, search } = req.query;
    const query = {};

    // Only add filters if they're not "all" or empty
    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;
    if (category && category !== 'all') query.category = category;
    if (search && search.trim()) {
      query.$or = [
        { subject: { $regex: search.trim(), $options: 'i' } },
        { message: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const tickets = await SupportTicket.find(query)
      .populate('userId', 'name email phone')
      .populate('replies.repliedBy', 'name email')
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error('Get all tickets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get ticket statistics
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const total = await SupportTicket.countDocuments();
    const open = await SupportTicket.countDocuments({ status: 'open' });
    const inProgress = await SupportTicket.countDocuments({ status: 'in-progress' });
    const resolved = await SupportTicket.countDocuments({ status: 'resolved' });
    const closed = await SupportTicket.countDocuments({ status: 'closed' });
    const urgent = await SupportTicket.countDocuments({ priority: 'urgent', status: { $ne: 'closed' } });

    res.json({
      total,
      open,
      inProgress,
      resolved,
      closed,
      urgent,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Reply to ticket
router.post('/admin/tickets/:id/reply', adminAuth, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Reply message is required' });
    }

    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Add reply
    ticket.replies = ticket.replies || [];
    ticket.replies.push({
      message: message.trim(),
      repliedBy: req.user._id,
      isAdmin: true,
    });

    // Update status to in-progress if it was open
    if (ticket.status === 'open') {
      ticket.status = 'in-progress';
    }

    await ticket.save();

    // Create notification for user
    const notification = new Notification({
      userId: ticket.userId,
      title: 'New Reply on Your Ticket',
      message: `Admin replied to: "${ticket.subject}"`,
      type: 'info',
      link: `/support`,
    });
    await notification.save();

    const updatedTicket = await SupportTicket.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('replies.repliedBy', 'name email');

    res.json(updatedTicket);
  } catch (error) {
    console.error('Reply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update ticket status (only resolved/closed after reply)
router.put('/admin/tickets/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Only allow resolved/closed if there's at least one admin reply
    if ((status === 'resolved' || status === 'closed') && (!ticket.replies || ticket.replies.length === 0)) {
      return res.status(400).json({ 
        message: 'Cannot mark as resolved/closed without replying to the ticket first' 
      });
    }

    ticket.status = status;

    if (status === 'resolved' || status === 'closed') {
      ticket.resolvedAt = new Date();
      ticket.resolvedBy = req.user._id;
    }

    await ticket.save();

    // Create notification for user
    const notification = new Notification({
      userId: ticket.userId,
      title: 'Ticket Status Updated',
      message: `Your ticket "${ticket.subject}" has been marked as ${status}`,
      type: status === 'resolved' || status === 'closed' ? 'success' : 'info',
      link: `/support`,
    });
    await notification.save();

    res.json(ticket);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update ticket priority
router.put('/admin/tickets/:id/priority', adminAuth, async (req, res) => {
  try {
    const { priority } = req.body;

    if (!['low', 'medium', 'high', 'urgent'].includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority' });
    }

    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.priority = priority;
    await ticket.save();

    res.json(ticket);
  } catch (error) {
    console.error('Update priority error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update ticket (general update)
router.put('/admin/tickets/:id', adminAuth, async (req, res) => {
  try {
    const { priority, category } = req.body;

    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (priority) ticket.priority = priority;
    if (category) ticket.category = category;

    await ticket.save();

    const updatedTicket = await SupportTicket.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('replies.repliedBy', 'name email');

    res.json(updatedTicket);
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

