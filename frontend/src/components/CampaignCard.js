import { FiArrowUpRight, FiMapPin, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";

export function currency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);
}

export default function CampaignCard({ campaign, compact = false }) {
  const progress = campaign.progressPercentage ?? Math.min(100, Math.round(((campaign.raisedAmount || 0) / (campaign.targetAmount || 1)) * 100));
  return <article className={`campaign-card ${compact ? "campaign-card--compact" : ""}`}>
    <div className={`campaign-visual campaign-visual--${campaign.category?.toLowerCase() || "other"}`}><span>{campaign.category}</span><div className="visual-orbit visual-orbit--one" /><div className="visual-orbit visual-orbit--two" /></div>
    <div className="campaign-body">
      <div className="campaign-meta"><span><FiMapPin /> {campaign.location || "India"}</span><span><FiUsers /> {campaign.donorCount || 0} supporters</span></div>
      <h3>{campaign.title}</h3><p>{campaign.summary}</p>
      <div className="progress-row"><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><strong>{progress}%</strong></div>
      <div className="funding-row"><div><strong>{currency(campaign.raisedAmount)}</strong><span> raised</span></div><span>of {currency(campaign.targetAmount)}</span></div>
      <Link to={`/campaigns/${campaign._id}`} className="card-link">View campaign <FiArrowUpRight /></Link>
    </div>
  </article>;
}

