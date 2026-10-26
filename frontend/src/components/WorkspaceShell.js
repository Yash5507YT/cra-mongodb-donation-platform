import { FiBarChart2, FiCompass, FiHeart, FiHome, FiLogOut, FiMenu, FiSettings, FiUsers, FiX } from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const navigation = {
  donor: [{ to: "/dashboard", label: "Overview", icon: FiHome }, { to: "/", label: "Discover causes", icon: FiCompass }],
  ngo: [{ to: "/ngo", label: "Campaigns", icon: FiBarChart2 }, { to: "/", label: "Discover causes", icon: FiCompass }],
  admin: [{ to: "/admin", label: "Platform overview", icon: FiHome }, { to: "/admin?section=users", label: "Users & roles", icon: FiUsers }, { to: "/", label: "Public site", icon: FiCompass }],
};

export default function WorkspaceShell({ title, subtitle, children }) {
  const { user, signOut } = useAuth(); const navigate = useNavigate(); const [open, setOpen] = useState(false);
  const items = navigation[user.role] || navigation.donor;
  return <div className="workspace"><aside className={open ? "workspace-sidebar open" : "workspace-sidebar"}><Link to="/" className="brand workspace-brand"><span className="brand-mark"><FiHeart /></span><span>Sahyog</span></Link><button className="sidebar-close" onClick={() => setOpen(false)}><FiX /></button><nav>{items.map((item) => { const Icon = item.icon; return <NavLink key={item.to} to={item.to} end={item.to === "/dashboard" || item.to === "/ngo" || item.to === "/admin"} className="workspace-nav-item" onClick={() => setOpen(false)}><Icon />{item.label}</NavLink>; })}</nav><div className="workspace-user"><div className="avatar">{user.name?.charAt(0)}</div><div><strong>{user.name}</strong><span>{user.role === "ngo" ? user.organizationName || "Organization" : `${user.role} workspace`}</span></div></div><button className="workspace-logout" onClick={() => { signOut(); navigate("/"); }}><FiLogOut /> Sign out</button></aside><main className="workspace-main"><header className="workspace-top"><button className="sidebar-toggle" onClick={() => setOpen(true)} aria-label="Open workspace navigation"><FiMenu /></button><div><p className="eyebrow">{user.role} workspace</p><h1>{title}</h1><p>{subtitle}</p></div><Link className="top-profile" to="/profile"><FiSettings /> Profile</Link></header>{children}</main></div>;
}
