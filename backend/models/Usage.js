const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  dataUsed: {
    type: Number, // in GB
    default: 0,
  },
  uploadSpeed: {
    type: Number, // in Mbps
  },
  downloadSpeed: {
    type: Number, // in Mbps
  },
  ping: {
    type: Number, // in ms
  },
  testType: {
    type: String,
    enum: ['automatic', 'manual'],
    default: 'manual',
  },
});

module.exports = mongoose.model('Usage', usageSchema);

