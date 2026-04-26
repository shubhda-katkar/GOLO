const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/golo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schema
const userReportSchema = new mongoose.Schema({
  reportId: String,
  reportedUserId: String,
  reportedBy: String,
  reason: String,
  description: String,
  status: String,
  priority: Number,
  evidenceUrls: [String],
  adminNotes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserReport = mongoose.model("UserReport", userReportSchema);

async function seedData() {
  try {
    // Clear existing reports
    await UserReport.deleteMany({});
    console.log("Cleared existing reports");

    // Create sample reports
    const reports = [
      {
        reportId: "UP-001",
        reportedUserId: "user-john-123456",
        reportedBy: "user-sarah-098765",
        reason: "harassment",
        description: "This user repeatedly sent offensive messages and threatened to find my personal address after I declined their low-ball offer.",
        status: "under_investigation",
        priority: 1,
        evidenceUrls: ["https://example.com/evidence1.jpg"],
        adminNotes: "Verified multiple incidents from chat history",
      },
      {
        reportId: "UP-002",
        reportedUserId: "user-alex-234567",
        reportedBy: "user-david-876543",
        reason: "fraud",
        description: "Seller claimed item is authentic but it arrived as counterfeit. Multiple other buyers reported the same issue.",
        status: "pending",
        priority: 1,
        evidenceUrls: ["https://example.com/evidence2.jpg", "https://example.com/evidence3.jpg"],
      },
      {
        reportId: "UP-003",
        reportedUserId: "user-mike-345678",
        reportedBy: "user-emma-765432",
        reason: "fake_account",
        description: "This profile appears to be a bot/fake account created for spamming promotional links.",
        status: "resolved",
        priority: 0,
        adminNotes: "Account suspended",
      },
      {
        reportId: "UP-004",
        reportedUserId: "user-chris-456789",
        reportedBy: "user-jane-654321",
        reason: "spam",
        description: "User is posting the same promotional message across all categories.",
        status: "under_investigation",
        priority: 0,
      },
      {
        reportId: "UP-005",
        reportedUserId: "user-rob-567890",
        reportedBy: "user-lisa-543210",
        reason: "scam",
        description: "User promised to deliver item but disappeared after payment was made.",
        status: "pending",
        priority: 1,
        adminNotes: "Payment reversal initiated",
      },
      {
        reportId: "UP-006",
        reportedUserId: "user-sophia-678901",
        reportedBy: "user-tom-432109",
        reason: "abuse",
        description: "Abusive language and harassment in reviews/comments.",
        status: "resolved",
        priority: 1,
        adminNotes: "Warning issued to user",
      },
      {
        reportId: "UP-007",
        reportedUserId: "user-kate-789012",
        reportedBy: "user-james-321098",
        reason: "harassment",
        description: "Persistent stalking behavior and unwanted personal contact attempts.",
        status: "under_investigation",
        priority: 1,
      },
    ];

    const inserted = await UserReport.insertMany(reports);
    console.log(`✅ Successfully seeded ${inserted.length} user reports`);

    // Show summary
    const counts = {
      total: await UserReport.countDocuments(),
      pending: await UserReport.countDocuments({ status: "pending" }),
      investigating: await UserReport.countDocuments({ status: "under_investigation" }),
      resolved: await UserReport.countDocuments({ status: "resolved" }),
    };

    console.log("\n📊 Report Summary:");
    console.log(`   Total: ${counts.total}`);
    console.log(`   Pending: ${counts.pending}`);
    console.log(`   Under Investigation: ${counts.investigating}`);
    console.log(`   Resolved: ${counts.resolved}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
