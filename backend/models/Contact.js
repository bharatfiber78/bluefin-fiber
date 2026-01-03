const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: 'BlueFin ISP',
  },
  phone: {
    type: String,
    default: '+1 (555) 123-4567',
  },
  email: {
    type: String,
    default: 'support@bluefinisp.com',
  },
  address: {
    type: String,
    default: '123 Internet Street, City, State 12345',
  },
  website: {
    type: String,
    default: 'www.bluefinisp.com',
  },
  businessHours: {
    type: String,
    default: '24/7',
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Only allow one contact document
contactSchema.statics.getContact = async function () {
  let contact = await this.findOne();
  if (!contact) {
    contact = new this();
    await contact.save();
  }
  return contact;
};

module.exports = mongoose.model('Contact', contactSchema);

