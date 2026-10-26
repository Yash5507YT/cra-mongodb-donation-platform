import { useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiAward, FiCheckCircle, FiClipboard, FiCompass, FiFileText, FiHeart, FiShield, FiTrendingUp, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../api/client";
import CampaignCard from "../components/CampaignCard";
import { Footer, Header } from "../components/Shell";

const categories = ["All", "Education", "Health", "Environment", "Community", "Emergency"];

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/campaigns?status=Active").then(({ data }) => setCampaigns(data.campaigns)).catch(() => setCampaigns([])).finally(() => setLoading(false));
  }, []);

  const visibleCampaigns = useMemo(() => category === "All" ? campaigns : campaigns.filter((item) => item.category === category), [campaigns, category]);

  return <div className="app-shell">
    <section className="hero-section">
      <Header dark />
      <div className="hero-grid page-width">
        <div className="hero-copy reveal-up">
          <p className="eyebrow eyebrow--light"><span /> Direct support. Clear outcomes.</p>
          <h1>Give where <em>change</em> can be seen.</h1>
          <p className="hero-description">Sahyog is a Donation & NGO Support Platform where donors, organizations, and administrators work through a clear, secure, and trackable giving journey.</p>
          <div className="hero-actions"><a className="button button--gold" href="#campaigns">Explore campaigns <FiArrowRight /></a><Link className="hero-secondary" to="/auth?mode=signup">Register as an NGO <FiCompass /></Link></div>
          <div className="trust-line"><FiShield /><span>Role-protected workspaces and trackable donation records</span></div>
        </div>
        <div className="hero-art reveal-up reveal-delay">
          <div className="hero-sun" /><div className="hero-arch hero-arch--back" /><div className="hero-arch hero-arch--front" />
          <div className="impact-note impact-note--top"><FiHeart /><span>Care in action</span></div>
          <div className="impact-note impact-note--bottom"><FiTrendingUp /><span>Progress, visible</span></div>
          <div className="hero-plant"><span /><span /><span /></div>
        </div>
      </div>
      <div className="hero-bottom-line" />
    </section>

    <main>
      <section className="master-overview page-width" aria-label="Sahyog platform overview"><div className="master-overview-copy"><p className="eyebrow">Master page · project overview</p><h2>One platform for every meaningful contribution.</h2><p>Sahyog connects three protected roles in one workflow. Donors support campaigns and keep their receipts; NGOs manage causes and donation fulfilment; administrators oversee access, campaigns, and records.</p><div className="master-actions"><Link className="button" to="/auth?mode=login">Login to your workspace <FiArrowRight /></Link><Link className="button button--ghost" to="/auth?mode=signup">Create an account</Link></div></div><div className="master-role-grid"><article><span className="master-icon"><FiHeart /></span><h3>Donor</h3><p>Donate, track status, and print a formal contribution certificate.</p></article><article><span className="master-icon"><FiClipboard /></span><h3>NGO</h3><p>Create campaigns, view donor records, and manage donation status.</p></article><article><span className="master-icon"><FiUsers /></span><h3>Admin</h3><p>Control user access and supervise campaigns, donations, and activity.</p></article></div></section>
      <section className="certificate-promise"><div className="page-width certificate-promise-grid"><div className="certificate-coin"><FiAward /><span>SAHYOG</span><small>VERIFIED</small></div><div><p className="eyebrow eyebrow--light">Formal donation record</p><h2>Every contribution can carry its own printable certificate.</h2><p>After a donation is recorded, the donor can print a certificate showing their name, receipt number, date, campaign or item donated, and the Sahyog verification seal.</p></div><FiFileText className="certificate-promise-icon" /></div></section>
      <section className="intro-section page-width"><div className="intro-label"><FiCheckCircle /> Designed for trust</div><p>Every campaign has a clear goal, an accountable organization, and a visible path from contribution to progress.</p><Link to="/auth?mode=signup" className="inline-link">Create an account <FiArrowRight /></Link></section>
      <section id="campaigns" className="campaign-section page-width">
        <div className="section-heading"><div><p className="eyebrow">Current causes</p><h2>Meaningful work, ready for your support.</h2></div><p>Explore active initiatives created by organizations on the platform.</p></div>
        <div className="filter-row" role="tablist" aria-label="Campaign categories">{categories.map((item) => <button key={item} role="tab" aria-selected={category === item} className={category === item ? "filter-button active" : "filter-button"} onClick={() => setCategory(item)}>{item}</button>)}</div>
        {loading ? <div className="loading-grid"><span className="skeleton" /><span className="skeleton" /><span className="skeleton" /></div> : visibleCampaigns.length ? <div className="campaign-grid">{visibleCampaigns.map((campaign) => <CampaignCard key={campaign._id} campaign={campaign} />)}</div> : <div className="empty-state"><FiHeart /><h3>No active campaigns yet</h3><p>Seed the backend data or let an NGO publish the platform’s first campaign.</p></div>}
      </section>
      <section id="how-it-works" className="process-section"><div className="page-width"><div className="section-heading section-heading--light"><div><p className="eyebrow eyebrow--light">How Sahyog works</p><h2>Three clear steps. One shared purpose.</h2></div></div><div className="process-grid"><article><span>01</span><FiCompass /><h3>Find a cause</h3><p>Discover transparent campaigns with a defined goal and organization context.</p></article><article><span>02</span><FiHeart /><h3>Make a contribution</h3><p>Donate securely from your personal dashboard and keep a receipt history.</p></article><article><span>03</span><FiTrendingUp /><h3>Follow the progress</h3><p>See campaign status and donation tracking through your protected workspace.</p></article></div></div></section>
      <section className="closing-section page-width"><div><p className="eyebrow">A better way to back local work</p><h2>Bring generosity into focus.</h2><p>Whether you are giving, organizing, or overseeing, Sahyog keeps the next meaningful action close at hand.</p></div><Link className="button" to="/auth?mode=signup">Register on Sahyog <FiArrowRight /></Link></section>
    </main>
    <Footer />
  </div>;
}
