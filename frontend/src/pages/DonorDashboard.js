import { useEffect, useMemo, useState } from "react";
import { FiArrowUpRight, FiCheckCircle, FiClock, FiFileText, FiHeart, FiLayers } from "react-icons/fi";
import { Link } from "react-router-dom";
import api, { getApiError } from "../api/client";
import { currency } from "../components/CampaignCard";
import WorkspaceShell from "../components/WorkspaceShell";
import { useAuth } from "../context/AuthContext";

const statusClass = (status) => `status-pill status-pill--${status.toLowerCase()}`;

export default function DonorDashboard() {
  const { user } = useAuth(); const [donations, setDonations] = useState([]); const [error, setError] = useState("");
  useEffect(() => { api.get("/donations/mine").then(({ data }) => setDonations(data.donations)).catch((err) => setError(getApiError(err))); }, []);
  const stats = useMemo(() => ({ total: donations.reduce((sum, item) => sum + item.amount, 0), causes: new Set(donations.map((item) => item.campaignId?._id)).size, delivered: donations.filter((item) => item.status === "Delivered").length }), [donations]);
  return <WorkspaceShell title={`Hello, ${user.name?.split(" ")[0] || "Supporter"}.`} subtitle="Your contribution history, printable certificates, and campaign updates live here."><section className="workspace-content"><div className="stat-grid"><article className="stat-card"><span className="stat-icon"><FiHeart /></span><div><small>Total contributed</small><strong>{currency(stats.total)}</strong></div></article><article className="stat-card"><span className="stat-icon"><FiLayers /></span><div><small>Causes supported</small><strong>{stats.causes}</strong></div></article><article className="stat-card"><span className="stat-icon"><FiCheckCircle /></span><div><small>Delivered</small><strong>{stats.delivered}</strong></div></article></div><section className="dashboard-section"><div className="dashboard-section-head"><div><h2>Your donation history</h2><p>Each contribution includes a receipt number and printable certificate.</p></div><a className="mini-action" href="/#campaigns">Find a cause <FiArrowUpRight /></a></div>{error ? <div className="form-alert">{error}</div> : donations.length ? <div className="history-list">{donations.map((donation) => <article className="history-item" key={donation._id}><div className="history-icon"><FiHeart /></div><div className="history-main"><strong>{donation.campaignId?.title || "Campaign unavailable"}</strong><span>Receipt: {donation.receiptNumber} · {new Date(donation.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></div><div className="history-amount"><strong>{currency(donation.amount)}</strong><span className={statusClass(donation.status)}><FiClock /> {donation.status}</span></div><Link className="certificate-link" to={`/certificates/${donation._id}`}><FiFileText /> Certificate</Link></article>)}</div> : <div className="empty-state dashboard-empty"><FiHeart /><h3>Your giving story begins here.</h3><p>Explore an active campaign and make a first contribution to see your records here.</p><a className="button" href="/#campaigns">Discover campaigns</a></div>}</section></section></WorkspaceShell>;
}
