const express = require('express');
const Usage = require('../models/Usage');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user's usage history
router.get('/history', auth, async (req, res) => {
  try {
    const usage = await Usage.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(30);

    res.json(usage);
  } catch (error) {
    console.error('Get usage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Record speed test
router.post('/speed-test', auth, async (req, res) => {
  try {
    const { downloadSpeed, uploadSpeed, ping } = req.body;

    const usage = new Usage({
      userId: req.user._id,
      downloadSpeed,
      uploadSpeed,
      ping,
      testType: 'manual',
    });

    await usage.save();
    res.status(201).json(usage);
  } catch (error) {
    console.error('Speed test error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get usage statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const usage = await Usage.find({
      userId: req.user._id,
      date: { $gte: thirtyDaysAgo },
    });

    const totalDataUsed = usage.reduce((sum, u) => sum + (u.dataUsed || 0), 0);
    const avgDownloadSpeed =
      usage.length > 0
        ? usage.reduce((sum, u) => sum + (u.downloadSpeed || 0), 0) / usage.length
        : 0;
    const avgUploadSpeed =
      usage.length > 0
        ? usage.reduce((sum, u) => sum + (u.uploadSpeed || 0), 0) / usage.length
        : 0;
    const avgPing =
      usage.length > 0
        ? usage.reduce((sum, u) => sum + (u.ping || 0), 0) / usage.length
        : 0;

    res.json({
      totalDataUsed: totalDataUsed.toFixed(2),
      avgDownloadSpeed: avgDownloadSpeed.toFixed(2),
      avgUploadSpeed: avgUploadSpeed.toFixed(2),
      avgPing: avgPing.toFixed(2),
      testCount: usage.length,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

