import { useState } from "react";
import { FiArrowUpRight, FiHeart, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function roleDashboardPath(role) {
  return role === "admin" ? "/admin" : role === "ngo" ? "/ngo" : "/dashboard";
}

export function Header({ dark = false }) {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  function logout() { signOut(); navigate("/"); }
  return <header className={`site-header ${dark ? "site-header--dark" : ""}`}>
    <div className="nav-wrap">
      <Link className="brand" to="/"><span className="brand-mark"><FiHeart /></span><span>Sahyog</span></Link>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <FiX /> : <FiMenu />}</button>
      <nav className={open ? "nav-links nav-links--open" : "nav-links"}>
        <Link to="/#campaigns" onClick={() => setOpen(false)}>Discover causes</Link>
        <Link to="/#how-it-works" onClick={() => setOpen(false)}>How it works</Link>
        {user ? <>
          <Link to={roleDashboardPath(user.role)} onClick={() => setOpen(false)}>My workspace</Link>
          <button className="text-button" onClick={logout}><FiLogOut /> Sign out</button>
        </> : <Link className="nav-login" to="/auth?mode=login">Login</Link>}
        <Link className="button button--small" to={user?.role === "donor" ? "/dashboard" : "/auth?mode=signup"}>{user?.role === "donor" ? "Donate now" : <>Register <FiArrowUpRight /></>}</Link>
      </nav>
    </div>
  </header>;
}

export function Footer() {
  return <footer className="site-footer"><div className="footer-inner"><div><Link className="brand" to="/"><span className="brand-mark"><FiHeart /></span><span>Sahyog</span></Link><p>Clearer giving. Stronger communities.</p></div><p className="footer-note">Built for transparent local impact.</p></div></footer>;
}
