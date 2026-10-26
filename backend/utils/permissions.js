function canManageCampaign(user, campaign) {
  return user.role === "admin" || campaign.createdBy.toString() === user.id.toString();
}

function canUpdateDonation(user, donation, campaign) {
  if (user.role === "admin") return true;
  return user.role === "ngo" && campaign.createdBy.toString() === user.id.toString();
}

module.exports = { canManageCampaign, canUpdateDonation };
