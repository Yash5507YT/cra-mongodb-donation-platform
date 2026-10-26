require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");
const Campaign = require("../models/Campaign");
const Donation = require("../models/Donation");
const ActivityLog = require("../models/ActivityLog");

async function seed() {
  await connectDB();
  await Promise.all([Donation.deleteMany(), Campaign.deleteMany(), ActivityLog.deleteMany(), User.deleteMany()]);

  const admin = await User.create({ name: "Platform Administrator", email: "admin@sahyog.local", password: "Admin123!", role: "admin" });
  const ngo = await User.create({ name: "Asha Foundation", email: "ngo@sahyog.local", password: "Ngo12345!", role: "ngo", organizationName: "Asha Foundation", organizationMission: "Supporting equitable access to education and essential community care." });
  const donor = await User.create({ name: "Demo Donor", email: "donor@sahyog.local", password: "Donor123!", role: "donor" });

  const campaigns = await Campaign.insertMany([
    { title: "Digital learning for rural classrooms", summary: "Equip village classrooms with shared learning technology and practical teacher training.", story: "This seed campaign demonstrates the complete platform workflow. It is designed for local development and should be replaced with verified NGO initiatives before public use.", category: "Education", targetAmount: 75000, raisedAmount: 42000, donorCount: 31, location: "Gujarat", status: "Active", createdBy: ngo._id },
    { title: "Community health access fund", summary: "Support basic screening, referral transport, and essential health supplies for families.", story: "This seed campaign demonstrates the dashboard and progress experience. It contains sample development data only, not a public fundraising claim.", category: "Health", targetAmount: 120000, raisedAmount: 66000, donorCount: 47, location: "Gujarat", status: "Active", createdBy: ngo._id },
  ]);

  await Donation.create({ donorId: donor._id, campaignId: campaigns[0]._id, amount: 1500, type: "Money", note: "Sample local development donation", status: "Accepted", receiptNumber: "SAH-SEED-001" });
  await ActivityLog.create({ action: "Seed data created", actorId: admin._id, targetType: "System", details: "Development-only records were generated" });
  console.log("Seed complete. Change the sample credentials before any public use.");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
