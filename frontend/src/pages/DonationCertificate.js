import { useEffect, useState } from "react";
import { FiArrowLeft, FiAward, FiCheckCircle, FiHeart, FiPrinter, FiShield } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import api, { getApiError } from "../api/client";
import { certificateDate, formatDonationDetail } from "../utils/certificate";
import { useAuth } from "../context/AuthContext";

export default function DonationCertificate() {
  const { id } = useParams();
  const { user } = useAuth();
  const [donation, setDonation] = useState(null);
  const [error, setError] = useState("");
  const [printPreview, setPrintPreview] = useState(false);

  useEffect(() => {
    api.get("/donations/mine").then(({ data }) => {
      const record = data.donations.find((item) => item._id === id);
      if (!record) setError("This donation certificate is unavailable in your account.");
      else setDonation(record);
    }).catch((err) => setError(getApiError(err)));
  }, [id]);

  if (error) return <main className="certificate-route-state"><h1>Certificate unavailable</h1><p>{error}</p><Link className="button" to="/dashboard">Back to donations</Link></main>;
  if (!donation) return <div className="route-loader"><span className="spinner" /> Preparing certificate…</div>;

  return <main className={`certificate-page ${printPreview ? "print-preview-mode" : ""}`}><div className="certificate-tools no-print"><Link to="/dashboard" className="back-link"><FiArrowLeft /> Donation history</Link><div className="certificate-tool-actions"><button className="button button--ghost" onClick={() => setPrintPreview(true)}>Preview print layout</button><button className="button" onClick={() => window.print()}><FiPrinter /> Print certificate</button></div></div><article className="certificate-sheet"><div className="certificate-corner certificate-corner--top" /><div className="certificate-corner certificate-corner--bottom" /><div className="certificate-watermark"><FiHeart /></div><header className="certificate-header"><div className="certificate-brand"><span className="brand-mark"><FiHeart /></span><span>Sahyog</span></div><p>DONATION & NGO SUPPORT PLATFORM</p></header><section className="certificate-body"><p className="certificate-kicker">Certificate of Contribution</p><h1>With gratitude, we recognize</h1><h2>{user.name}</h2><div className="certificate-rule" /><p className="certificate-text">for the valued contribution recorded through the Sahyog Donation & NGO Support Platform. Your generosity supports meaningful, accountable work in the community.</p><div className="certificate-detail"><span>Contribution recorded</span><strong>{formatDonationDetail(donation)}</strong></div><div className="certificate-record-grid"><div><span>Receipt number</span><strong>{donation.receiptNumber}</strong></div><div><span>Date of contribution</span><strong>{certificateDate(donation.createdAt)}</strong></div><div><span>Donation status</span><strong>{donation.status}</strong></div></div><div className="certificate-foot"><div className="certificate-sign"><span>Sahyog Platform</span><strong>Authorized digital record</strong></div><div className="certificate-seal"><FiAward /><span>SAHYOG</span><small>VERIFIED</small></div><div className="certificate-verified"><FiCheckCircle /><span>Recorded with a unique receipt number</span></div></div></section><footer className="certificate-footer"><FiShield /> This certificate is generated from the donor's protected Sahyog account.</footer></article></main>;
}
