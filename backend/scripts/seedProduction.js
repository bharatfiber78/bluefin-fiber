const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Plan = require('../models/Plan');

dotenv.config();

// Strong production admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@bluefin.isp';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'B1ueF!n@2024#Secure$Admin';

const seedProduction = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    console.log('Connected to MongoDB');

    // Create or update admin user with strong password
    const adminExists = await User.findOne({ email: ADMIN_EMAIL });
    
    if (adminExists) {
      // Update existing admin password
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
      await User.updateOne(
        { email: ADMIN_EMAIL },
        { 
          $set: { 
            password: hashedPassword,
            role: 'admin',
            name: 'System Administrator'
          } 
        },
        { bypassDocumentValidation: true }
      );
      console.log(`✅ Admin user updated: ${ADMIN_EMAIL}`);
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
      const admin = new User({
        name: 'System Administrator',
        email: ADMIN_EMAIL,
        password: hashedPassword,
        phone: '+1234567890',
        address: 'System Administration',
        role: 'admin',
      });
      await admin.save();
      console.log(`✅ Admin user created: ${ADMIN_EMAIL}`);
    }

    console.log(`\n🔐 Admin Credentials:`);
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`\n⚠️  IMPORTANT: Save these credentials securely!\n`);

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

    let plansCreated = 0;
    let plansUpdated = 0;

    for (const planData of plans) {
      const existingPlan = await Plan.findOne({ name: planData.name });
      if (!existingPlan) {
        const plan = new Plan(planData);
        await plan.save();
        console.log(`✅ Plan created: ${planData.name}`);
        plansCreated++;
      } else {
        // Update existing plan to ensure it's active
        await Plan.updateOne(
          { name: planData.name },
          { $set: { ...planData } }
        );
        console.log(`✅ Plan updated: ${planData.name}`);
        plansUpdated++;
      }
    }

    console.log(`\n📦 Plans: ${plansCreated} created, ${plansUpdated} updated`);
    console.log('\n✅ Production seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding production data:', error);
    process.exit(1);
  }
};

seedProduction();

