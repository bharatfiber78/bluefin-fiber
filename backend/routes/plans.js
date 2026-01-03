const express = require('express');
const Plan = require('../models/Plan');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all active plans (public)
router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single plan
router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.json(plan);
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

