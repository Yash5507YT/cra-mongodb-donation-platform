const User = require("../models/User");
const Campaign = require("../models/Campaign");
const Donation = require("../models/Donation");
const ActivityLog = require("../models/ActivityLog");
const { recordActivity } = require("../utils/activity");

async function dashboard(req, res, next) {
  try {
    const [donors, ngos, donations, pendingDonations, amount] = await Promise.all([
      User.countDocuments({ role: "donor" }),
      User.countDocuments({ role: "ngo" }),
      Donation.countDocuments(),
      Donation.countDocuments({ status: "Pending" }),
      Donation.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    ]);
    const donationsByType = await Donation.aggregate([{ $group: { _id: "$type", value: { $sum: "$amount" } } }]);
    return res.json({ stats: { donors, ngos, donations, pendingDonations, totalAmount: amount[0]?.total || 0 }, donationsByType });
  } catch (error) {
    return next(error);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
}

async function listNGOs(req, res, next) {
  try {
    const ngos = await User.find({ role: "ngo" }).select("-password").sort({ createdAt: -1 });
    return res.json({ ngos });
  } catch (error) {
    return next(error);
  }
}

async function listDonations(req, res, next) {
  try {
    const donations = await Donation.find()
      .populate("donorId", "name email")
      .populate("campaignId", "title createdBy")
      .sort({ createdAt: -1 });
    return res.json({ donations });
  } catch (error) {
    return next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    if (req.body.role && ["donor", "ngo", "admin"].includes(req.body.role)) user.role = req.body.role;
    if (typeof req.body.isActive === "boolean") user.isActive = req.body.isActive;
    await user.save();
    await recordActivity({ action: "User account updated", actorId: req.user._id, targetType: "User", targetId: user._id, details: `${user.email} role/status changed` });
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
}

async function recentActivity(req, res, next) {
  try {
    const activity = await ActivityLog.find().populate("actorId", "name email role").sort({ createdAt: -1 }).limit(30);
    return res.json({ activity });
  } catch (error) {
    return next(error);
  }
}

module.exports = { dashboard, listUsers, listNGOs, listDonations, updateUser, recentActivity };
