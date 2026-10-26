import { useState } from "react";
import { FiCheckCircle, FiSave } from "react-icons/fi";
import api, { getApiError } from "../api/client";
import WorkspaceShell from "../components/WorkspaceShell";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, setUser } = useAuth(); const [form, setForm] = useState({ name: user.name || "", phone: user.phone || "", address: user.address || "", organizationName: user.organizationName || "", organizationMission: user.organizationMission || "" }); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  async function save(event) { event.preventDefault(); setError(""); try { const { data } = await api.put("/auth/me", form); setUser(data.user); localStorage.setItem("sahyog_user", JSON.stringify(data.user)); setMessage("Profile updated successfully."); } catch (err) { setError(getApiError(err)); } }
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  return <WorkspaceShell title="Your profile." subtitle="Keep your personal or organization contact information current."><section className="workspace-content profile-content"><form className="profile-card" onSubmit={save}><div><p className="eyebrow">Account settings</p><h2>Profile details</h2><p>Your role is controlled by the platform and cannot be changed from this page.</p></div>{message && <div className="success-box"><FiCheckCircle /> {message}</div>}{error && <div className="form-alert">{error}</div>}<div className="two-fields"><div className="field"><label>Name</label><input required name="name" value={form.name} onChange={update} /></div><div className="field"><label>Phone</label><input name="phone" value={form.phone} onChange={update} placeholder="Optional" /></div></div><div className="field"><label>Address</label><textarea name="address" value={form.address} onChange={update} rows="2" placeholder="Optional" /></div>{user.role === "ngo" && <><div className="field"><label>Organization name</label><input name="organizationName" value={form.organizationName} onChange={update} /></div><div className="field"><label>Organization mission</label><textarea name="organizationMission" value={form.organizationMission} onChange={update} rows="4" /></div></>}<button className="button" type="submit"><FiSave /> Save changes</button></form></section></WorkspaceShell>;
}

