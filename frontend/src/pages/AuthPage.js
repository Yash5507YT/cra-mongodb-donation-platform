import { useState } from "react";
import { FiArrowLeft, FiArrowRight, FiBriefcase, FiHeart, FiLock, FiMail, FiUser } from "react-icons/fi";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { roleDashboardPath } from "../components/Shell";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get("mode") === "signup" ? "signup" : "login");
  const [role, setRole] = useState("donor");
  const [form, setForm] = useState({ name: "", email: "", password: "", organizationName: "", organizationMission: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function submit(event) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const user = mode === "login" ? await signIn({ email: form.email, password: form.password }) : await signUp({ ...form, role });
      navigate(location.state?.from || roleDashboardPath(user.role));
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  return <div className="auth-page"><div className="auth-side"><Link to="/" className="auth-back"><FiArrowLeft /> Back to Sahyog</Link><div className="auth-side-content"><span className="brand-mark"><FiHeart /></span><p className="eyebrow eyebrow--light">A clearer giving journey</p><h1>Good intentions deserve a <em>clear path</em>.</h1><p>Sign in to contribute, manage campaigns, or guide the platform with confidence.</p><div className="auth-principles"><span><FiLock /> Role-protected access</span><span><FiHeart /> Donation history</span><span><FiBriefcase /> NGO campaign tools</span></div></div></div><main className="auth-card-wrap"><div className="auth-card"><div className="auth-card-head"><p className="eyebrow">{mode === "login" ? "Welcome back" : "Join Sahyog"}</p><h2>{mode === "login" ? "Continue your impact." : "Start with one good action."}</h2><p>{mode === "login" ? "Use your secure workspace credentials." : "Create a donor or organization account."}</p></div><div className="auth-toggle"><button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Sign in</button><button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Create account</button></div><form onSubmit={submit}>{error && <div className="form-alert">{error}</div>}{mode === "signup" && <><div className="field"><label>Full name</label><div className="input-wrap"><FiUser /><input required name="name" value={form.name} onChange={update} placeholder="Your name" /></div></div><div className="role-picker"><button type="button" onClick={() => setRole("donor")} className={role === "donor" ? "selected" : ""}><FiHeart /><span><strong>Donor</strong><small>I want to support causes</small></span></button><button type="button" onClick={() => setRole("ngo")} className={role === "ngo" ? "selected" : ""}><FiBriefcase /><span><strong>Organization</strong><small>I want to run campaigns</small></span></button></div>{role === "ngo" && <><div className="field"><label>Organization name</label><div className="input-wrap"><FiBriefcase /><input required name="organizationName" value={form.organizationName} onChange={update} placeholder="Organization name" /></div></div><div className="field"><label>Organization mission</label><textarea required name="organizationMission" value={form.organizationMission} onChange={update} placeholder="A short description of your work" rows="3" /></div></>}</>}<div className="field"><label>Email address</label><div className="input-wrap"><FiMail /><input required type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" /></div></div><div className="field"><label>Password</label><div className="input-wrap"><FiLock /><input required type="password" minLength="8" name="password" value={form.password} onChange={update} placeholder="At least 8 characters" /></div></div><button disabled={busy} className="button button--full" type="submit">{busy ? "Please wait…" : mode === "login" ? "Sign in securely" : "Create secure account"}<FiArrowRight /></button></form><p className="auth-switch">{mode === "login" ? "New to Sahyog?" : "Already have an account?"}<button onClick={() => setMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? "Create one" : "Sign in"}</button></p></div></main></div>;
}
