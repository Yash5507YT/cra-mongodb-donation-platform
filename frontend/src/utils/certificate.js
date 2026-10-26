import { currency } from "../components/CampaignCard";

export function formatDonationDetail(donation) {
  const campaignName = donation.campaignId?.title || "Sahyog campaign";
  if (donation.type === "Money" || !donation.type) {
    return `Monetary contribution of ${currency(donation.amount)} to ${campaignName}`;
  }
  const quantity = donation.quantity ? ` · Quantity: ${donation.quantity}` : "";
  return `${donation.type} donation to ${campaignName}${quantity}`;
}

export function certificateDate(date) {
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}
