const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Plan = require('../models/Plan');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bluefin_isp');

    console.log('Connected to MongoDB');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@bluefin.com' });
    if (!adminExists) {
      // Pass plain password - pre-save hook will hash it
      const admin = new User({
        name: 'Admin User',
        email: 'admin@bluefin.com',
        password: 'admin123', // Plain password - will be hashed by pre-save hook
        phone: '1234567890',
        address: 'Admin Address',
        role: 'admin',
      });
      await admin.save();
      console.log('Admin user created: admin@bluefin.com / admin123');
    } else {
      // Update existing admin password if needed
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.updateOne(
        { email: 'admin@bluefin.com' },
        { $set: { password: hashedPassword } },
        { bypassDocumentValidation: true }
      );
      console.log('Admin user password updated');
    }

    // Create sample plans
    const plans = [
      {
        name: 'Basic Plan',
        description: 'Perfect for light users and small families',
        speed: '50 Mbps',
        validity: 30,
        price: 499,
        features: [
          'Unlimited data',
          '24/7 customer support',
          'Free installation',
          'WiFi router included',
        ],
        isActive: true,
      },
      {
        name: 'Standard Plan',
        description: 'Ideal for medium usage households',
        speed: '100 Mbps',
        validity: 30,
        price: 799,
        features: [
          'Unlimited data',
          '24/7 priority support',
          'Free installation',
          'Premium WiFi router',
          'No data caps',
        ],
        isActive: true,
      },
      {
        name: 'Premium Plan',
        description: 'For heavy users and large families',
        speed: '200 Mbps',
        validity: 30,
        price: 1299,
        features: [
          'Unlimited data',
          '24/7 priority support',
          'Free installation',
          'High-end WiFi router',
          'No data caps',
          'Gaming optimized',
        ],
        isActive: true,
      },
      {
        name: 'Ultra Plan',
        description: 'Maximum speed for power users',
        speed: '500 Mbps',
        validity: 30,
        price: 1999,
        features: [
          'Unlimited data',
          '24/7 dedicated support',
          'Free installation',
          'Enterprise-grade router',
          'No data caps',
          'Gaming optimized',
          '4K streaming ready',
        ],
        isActive: true,
      },
    ];

    for (const planData of plans) {
      const existingPlan = await Plan.findOne({ name: planData.name });
      if (!existingPlan) {
        const plan = new Plan(planData);
        await plan.save();
        console.log(`Plan created: ${planData.name}`);
      } else {
        console.log(`Plan already exists: ${planData.name}`);
      }
    }

    console.log('Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

