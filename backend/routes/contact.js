const express = require('express');
const Contact = require('../models/Contact');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get contact information (public)
router.get('/', async (req, res) => {
  try {
    const contact = await Contact.getContact();
    res.json(contact);
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update contact information
router.put('/', adminAuth, async (req, res) => {
  try {
    const contact = await Contact.getContact();
    
    Object.keys(req.body).forEach((key) => {
      if (contact.schema.paths[key]) {
        contact[key] = req.body[key];
      }
    });
    
    contact.updatedAt = new Date();
    await contact.save();
    
    res.json(contact);
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;





