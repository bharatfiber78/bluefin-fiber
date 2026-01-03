const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  speed: {
    type: String,
    required: true, // e.g., "100 Mbps", "200 Mbps"
  },
  validity: {
    type: Number,
    required: true, // in days
  },
  price: {
    type: Number,
    required: true,
  },
  features: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Plan', planSchema);

