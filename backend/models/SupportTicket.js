const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['technical', 'billing', 'general', 'complaint'],
    default: 'general',
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  adminResponse: {
    type: String,
    default: '',
  },
  replies: [{
    message: String,
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    repliedAt: {
      type: Date,
      default: Date.now,
    },
    isAdmin: Boolean,
  }],
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SupportTicket', supportTicketSchema);

