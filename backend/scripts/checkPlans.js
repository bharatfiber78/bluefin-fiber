const mongoose = require('mongoose');
const Plan = require('../models/Plan');

// Use the same MongoDB URI format
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://bharatfiber78_db_user:xEtQH0DJDem6ttf7@cluster0.sibdy0u.mongodb.net/bluefin_isp?retryWrites=true&w=majority';

const checkPlans = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check database name
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📊 Database: ${dbName}`);

    // Count all plans
    const totalPlans = await Plan.countDocuments({});
    console.log(`📦 Total plans in database: ${totalPlans}`);

    // Count active plans
    const activePlans = await Plan.countDocuments({ isActive: true });
    console.log(`✅ Active plans: ${activePlans}`);

    // Get all plans
    const allPlans = await Plan.find({});
    console.log('\n📋 All plans:');
    allPlans.forEach(plan => {
      console.log(`  - ${plan.name}: ${plan.speed} - ₹${plan.price} - Active: ${plan.isActive}`);
    });

    // Get active plans (what API returns)
    const activePlansList = await Plan.find({ isActive: true }).sort({ price: 1 });
    console.log('\n✅ Active plans (API query):');
    activePlansList.forEach(plan => {
      console.log(`  - ${plan.name}: ${plan.speed} - ₹${plan.price}`);
    });

    console.log(`\n📊 Summary:`);
    console.log(`   Database: ${dbName}`);
    console.log(`   Total plans: ${totalPlans}`);
    console.log(`   Active plans: ${activePlans}`);
    console.log(`   Plans returned by API query: ${activePlansList.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkPlans();

