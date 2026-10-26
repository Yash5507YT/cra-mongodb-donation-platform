const { validationResult } = require("express-validator");
const Campaign = require("../models/Campaign");
const Donation = require("../models/Donation");
const { canUpdateDonation } = require("../utils/permissions");
const { recordActivity } = require("../utils/activity");

function invalid(res, req) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return false;
  res.status(422).json({ message: "Please correct the donation details.", errors: errors.array() });
  return true;
}

function receiptNumber() {
  return `SAH-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
}

async function createDonation(req, res, next) {
  try {
    if (invalid(res, req)) return;
    const { campaignId, amount, type = "Money", quantity, note, isAnonymous = false } = req.body;
    const campaign = await Campaign.findById(campaignId);
    if (!campaign || campaign.status !== "Active") return res.status(400).json({ message: "This campaign is not accepting donations." });
    const donation = await Donation.create({ donorId: req.user._id, campaignId, amount, type, quantity, note, isAnonymous, receiptNumber: receiptNumber() });
    campaign.raisedAmount += Number(amount);
    campaign.donorCount += 1;
    if (campaign.raisedAmount >= campaign.targetAmount) campaign.status = "Completed";
    await campaign.save();
    await recordActivity({ action: "Donation pledged", actorId: req.user._id, targetType: "Donation", targetId: donation._id, details: `${amount} contributed to ${campaign.title}` });
    return res.status(201).json({ donation, message: "Your donation has been recorded. Thank you for supporting this cause." });
  } catch (error) {
    return next(error);
  }
}

async function getMyDonations(req, res, next) {
  try {
    const donations = await Donation.find({ donorId: req.user._id }).populate("campaignId", "title category coverImage targetAmount raisedAmount status").sort({ createdAt: -1 });
    return res.json({ donations });
  } catch (error) {
    return next(error);
  }
}

async function getCampaignDonations(req, res, next) {
  try {
    const campaign = await Campaign.findById(req.params.campaignId);
    if (!campaign) return res.status(404).json({ message: "Campaign not found." });
    if (!canUpdateDonation(req.user, { campaignId: campaign._id }, campaign)) return res.status(403).json({ message: "You cannot view these donations." });
    const donations = await Donation.find({ campaignId: campaign._id }).populate("donorId", "name email").sort({ createdAt: -1 });
    return res.json({ donations });
  } catch (error) {
    return next(error);
  }
}

async function updateDonationStatus(req, res, next) {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: "Donation not found." });
    const campaign = await Campaign.findById(donation.campaignId);
    if (!canUpdateDonation(req.user, donation, campaign)) return res.status(403).json({ message: "You cannot update this donation." });
    const previousStatus = donation.status;
    donation.status = req.body.status;
    await donation.save();
    await recordActivity({ action: "Donation status updated", actorId: req.user._id, targetType: "Donation", targetId: donation._id, details: `${previousStatus} → ${donation.status}` });
    return res.json({ donation });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createDonation, getMyDonations, getCampaignDonations, updateDonationStatus };
