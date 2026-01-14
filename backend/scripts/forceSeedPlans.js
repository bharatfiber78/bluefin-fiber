const mongoose = require('mongoose');
const Plan = require('../models/Plan');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://bharatfiber78_db_user:xEtQH0DJDem6ttf7@cluster0.sibdy0u.mongodb.net/bluefin_isp?retryWrites=true&w=majority';

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

const forceSeedPlans = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete all existing plans first
    await Plan.deleteMany({});
    console.log('Deleted existing plans');

    // Create new plans
    for (const planData of plans) {
      const plan = new Plan(planData);
      await plan.save();
      console.log(`✅ Plan created: ${planData.name}`);
    }

    // Verify
    const count = await Plan.countDocuments({ isActive: true });
    console.log(`\n✅ Total active plans: ${count}`);

    const allPlans = await Plan.find({ isActive: true });
    console.log('\nPlans in database:');
    allPlans.forEach(plan => {
      console.log(`  - ${plan.name}: ${plan.speed} - ₹${plan.price}`);
    });

    console.log('\n✅ Plans seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding plans:', error);
    process.exit(1);
  }
};

forceSeedPlans();

