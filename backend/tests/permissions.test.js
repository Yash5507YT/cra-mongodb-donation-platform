const test = require("node:test");
const assert = require("node:assert/strict");
const { canManageCampaign, canUpdateDonation } = require("../utils/permissions");

test("campaign ownership is enforced for NGO users", () => {
  const campaign = { createdBy: "ngo-owner" };
  assert.equal(canManageCampaign({ id: "ngo-owner", role: "ngo" }, campaign), true);
  assert.equal(canManageCampaign({ id: "other-ngo", role: "ngo" }, campaign), false);
  assert.equal(canManageCampaign({ id: "platform-admin", role: "admin" }, campaign), true);
});

test("donation status can be updated only by campaign NGO or admin", () => {
  const campaign = { createdBy: "ngo-owner" };
  const donation = { campaignId: "campaign-1" };
  assert.equal(canUpdateDonation({ id: "ngo-owner", role: "ngo" }, donation, campaign), true);
  assert.equal(canUpdateDonation({ id: "donor-1", role: "donor" }, donation, campaign), false);
  assert.equal(canUpdateDonation({ id: "admin-1", role: "admin" }, donation, campaign), true);
});

