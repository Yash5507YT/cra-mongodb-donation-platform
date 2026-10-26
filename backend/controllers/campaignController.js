const { validationResult } = require("express-validator");
const Campaign = require("../models/Campaign");
const Donation = require("../models/Donation");
const { canManageCampaign } = require("../utils/permissions");
const { recordActivity } = require("../utils/activity");

function invalid(res, req) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return false;
  res.status(422).json({ message: "Please correct the campaign information.", errors: errors.array() });
  return true;
}

async function listCampaigns(req, res, next) {
  try {
    const { category, status = "Active", search } = req.query;
    const filter = {};
    if (status !== "all") filter.status = status;
    if (category) filter.category = category;
    if (search) filter.$or = [{ title: new RegExp(search, "i") }, { summary: new RegExp(search, "i") }];
    const campaigns = await Campaign.find(filter).populate("createdBy", "name organizationName organizationMission").sort({ createdAt: -1 });
    return res.json({ campaigns });
  } catch (error) {
    return next(error);
  }
}

async function getCampaign(req, res, next) {
  try {
    const campaign = await Campaign.findById(req.params.id).populate("createdBy", "name organizationName organizationMission email");
    if (!campaign) return res.status(404).json({ message: "Campaign not found." });
    const recentDonations = await Donation.find({ campaignId: campaign._id, status: { $in: ["Accepted", "Delivered"] } })
      .populate("donorId", "name")
      .sort({ createdAt: -1 })
      .limit(5);
    return res.json({ campaign, recentDonations });
  } catch (error) {
    return next(error);
  }
}

async function createCampaign(req, res, next) {
  try {
    if (invalid(res, req)) return;
    const campaign = await Campaign.create({ ...req.body, createdBy: req.user._id, status: req.body.status || "Draft" });
    await recordActivity({ action: "Campaign created", actorId: req.user._id, targetType: "Campaign", targetId: campaign._id, details: campaign.title });
    return res.status(201).json({ campaign });
  } catch (error) {
    return next(error);
  }
}

async function updateCampaign(req, res, next) {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found." });
    if (!canManageCampaign(req.user, campaign)) return res.status(403).json({ message: "You cannot update this campaign." });
    const allowed = ["title", "summary", "story", "category", "targetAmount", "coverImage", "location", "status", "endDate"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) campaign[field] = req.body[field];
    });
    await campaign.save();
    await recordActivity({ action: "Campaign updated", actorId: req.user._id, targetType: "Campaign", targetId: campaign._id, details: campaign.title });
    return res.json({ campaign });
  } catch (error) {
    return next(error);
  }
}

async function myCampaigns(req, res, next) {
  try {
    const filter = req.user.role === "admin" ? {} : { createdBy: req.user._id };
    const campaigns = await Campaign.find(filter).sort({ updatedAt: -1 });
    return res.json({ campaigns });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listCampaigns, getCampaign, createCampaign, updateCampaign, myCampaigns };
