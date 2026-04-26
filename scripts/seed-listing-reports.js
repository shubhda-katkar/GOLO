const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/golo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Report schema (for listing reports)
const reportSchema = new mongoose.Schema({
  reportId: String,
  adId: String,
  reportedBy: String,
  reason: String,
  description: String,
  status: String,
  priority: Number,
  reportType: String,
  evidenceUrls: [String],
  adminNotes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", reportSchema);

async function seedListingReports() {
  try {
    // Clear existing reports
    await Report.deleteMany({});
    console.log("Cleared existing listing reports");

    // Create sample listing reports
    const reports = [
      {
        reportId: "REP-001",
        adId: "ad-rolex-123456",
        reportedBy: "user-buyer-001",
        reason: "fake_listing",
        reportType: "Fake Listing",
        description: "This Rolex watch is a counterfeit. The seller claims it's authentic but the quality doesn't match original specifications.",
        status: "under_investigation",
        priority: 1,
        evidenceUrls: ["https://example.com/fake-rolex-1.jpg"],
        adminNotes: "Verified authenticity issues",
      },
      {
        reportId: "REP-002",
        adId: "ad-iphone-789012",
        reportedBy: "user-buyer-002",
        reason: "spam",
        reportType: "Spam",
        description: "This listing appears multiple times with slight variations. Looks like spam/bulk upload.",
        status: "pending",
        priority: 0,
      },
      {
        reportId: "REP-003",
        adId: "ad-bag-234567",
        reportedBy: "user-buyer-003",
        reason: "prohibited_item",
        reportType: "Prohibited Item",
        description: "Item appears to violate community guidelines. Suspicious materials used.",
        status: "resolved",
        priority: 1,
        adminNotes: "Listing removed",
      },
      {
        reportId: "REP-004",
        adId: "ad-shoes-456789",
        reportedBy: "user-buyer-004",
        reason: "suspicious_pricing",
        reportType: "Suspicious Pricing",
        description: "Item priced significantly below market value. Likely stolen goods.",
        status: "under_investigation",
        priority: 1,
      },
      {
        reportId: "REP-005",
        adId: "ad-generic-567890",
        reportedBy: "user-buyer-005",
        reason: "misleading_description",
        reportType: "Misleading Description",
        description: "Photos don't match the actual condition described. Item is worse than advertised.",
        status: "pending",
        priority: 0,
        adminNotes: "Awaiting seller response",
      },
      {
        reportId: "REP-006",
        adId: "ad-luxury-678901",
        reportedBy: "user-buyer-006",
        reason: "fake_listing",
        reportType: "Fake Listing",
        description: "Designer bag authenticated as counterfeit by verification service.",
        status: "resolved",
        priority: 1,
        adminNotes: "Seller account suspended",
      },
      {
        reportId: "REP-007",
        adId: "ad-bulk-789012",
        reportedBy: "user-buyer-007",
        reason: "spam",
        reportType: "Spam",
        description: "Bulk posting of identical items with different listing IDs. Clear spam pattern.",
        status: "under_investigation",
        priority: 0,
      },
    ];

    const inserted = await Report.insertMany(reports);
    console.log(`✅ Successfully seeded ${inserted.length} listing reports`);

    // Show summary
    const counts = {
      total: await Report.countDocuments(),
      pending: await Report.countDocuments({ status: "pending" }),
      investigating: await Report.countDocuments({ status: "under_investigation" }),
      resolved: await Report.countDocuments({ status: "resolved" }),
    };

    console.log("\n📊 Listing Report Summary:");
    console.log(`   Total: ${counts.total}`);
    console.log(`   Pending: ${counts.pending}`);
    console.log(`   Under Investigation: ${counts.investigating}`);
    console.log(`   Resolved: ${counts.resolved}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding listing reports:", error);
    process.exit(1);
  }
}

seedListingReports();
