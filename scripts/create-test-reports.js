/**
 * Test Script: Create Sample Reports for Testing Admin Dashboard
 * Run with: node scripts/create-test-reports.js
 * 
 * This creates:
 * 1. A test ad
 * 2. Multiple reports on that ad with different reasons
 * 3. Sample data for admin dashboard testing
 */

require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

// Connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

// Schemas
const ReportSchema = new mongoose.Schema({
  reportId: { type: String, unique: true, required: true },
  adId: { type: String, required: true, index: true },
  reportedBy: { type: String, required: true, index: true },
  reason: { type: String, enum: ['spam', 'inappropriate', 'fraud', 'duplicate', 'other'], default: 'other' },
  description: { type: String, maxlength: 500 },
  status: { type: String, enum: ['pending', 'reviewed', 'action_taken'], default: 'pending', index: true },
  adminNotes: { type: String, default: '' },
  reviewedAt: { type: Date },
  reviewedBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const AdSchema = new mongoose.Schema({
  adId: { type: String, unique: true, required: true },
  title: String,
  description: String,
  status: { type: String, default: 'active' },
  reportCount: { type: Number, default: 0 },
  isUnderReview: { type: Boolean, default: false },
  userId: String,
  createdAt: { type: Date, default: Date.now },
});

async function createTestData() {
  try {
    const Report = mongoose.model('Report', ReportSchema, 'reports');
    const Ad = mongoose.model('Ad', AdSchema, 'ads');

    // Clear existing test data
    await Report.deleteMany({ description: { $regex: 'TEST' } });
    console.log('🧹 Cleared existing test reports');

    // Create test ad
    const testAdId = 'test-ad-' + Date.now();
    const testAd = await Ad.create({
      adId: testAdId,
      title: '🏡 TEST: Beautiful 2BHK Apartment',
      description: 'TEST: Premium apartment in city center',
      status: 'active',
      reportCount: 0,
      userId: 'test-user-123',
    });
    console.log('✅ Created test ad:', testAdId);

    // Create multiple test reports
    const reasons = ['spam', 'inappropriate', 'fraud', 'duplicate', 'other'];
    const reports = [];

    for (let i = 0; i < 5; i++) {
      const report = await Report.create({
        reportId: `test-report-${Date.now()}-${i}`,
        adId: testAdId,
        reportedBy: `user-${i}@example.com`,
        reason: reasons[i],
        description: `TEST: This is a test report with reason: ${reasons[i]}`,
        status: i % 2 === 0 ? 'pending' : 'reviewed',
        adminNotes: i % 2 === 0 ? '' : 'TEST: Admin reviewed this',
      });
      reports.push(report);
      console.log(`  ✅ Created report ${i + 1}/${5}: ${reasons[i]}`);
    }

    // Update ad report count
    await Ad.findOneAndUpdate({ adId: testAdId }, { reportCount: reports.length });
    console.log(`✅ Updated ad report count: ${reports.length}`);

    console.log('\n✨ Test data created successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`  - Test Ad ID: ${testAdId}`);
    console.log(`  - Total Reports: ${reports.length}`);
    console.log(`  - Reasons: ${reasons.join(', ')}`);
    console.log(`\n🔗 Visit: http://localhost:3000/admin/reports`);
    console.log(`   You should see ${reports.length} new reports in the admin queue`);

  } catch (error) {
    console.error('❌ Error creating test data:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

// Run
connectDB().then(createTestData);
