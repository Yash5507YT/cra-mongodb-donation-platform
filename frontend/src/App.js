import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AuthPage from "./pages/AuthPage";
import CampaignDetail from "./pages/CampaignDetail";
import DonationCertificate from "./pages/DonationCertificate";
import DonorDashboard from "./pages/DonorDashboard";
import Home from "./pages/Home";
import NGODashboard from "./pages/NGODashboard";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/campaigns/:id" element={<CampaignDetail />} />
    <Route path="/certificates/:id" element={<ProtectedRoute roles={["donor"]}><DonationCertificate /></ProtectedRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute roles={["donor"]}><DonorDashboard /></ProtectedRoute>} />
    <Route path="/ngo" element={<ProtectedRoute roles={["ngo"]}><NGODashboard /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute roles={["donor", "ngo", "admin"]}><ProfilePage /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
