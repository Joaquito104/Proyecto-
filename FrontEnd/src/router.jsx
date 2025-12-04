import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CertificatesUpload from "./pages/CertificatesUpload";
import TaxManagement from "./pages/TaxManagement";
import AuditPanel from "./pages/AuditPanel";
import SystemSettings from "./pages/SystemSettings";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ThemeToggle from "./components/common/ThemeToggle";

const LayoutWrapper = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <ThemeToggle />
    <Navbar />
    <div style={{ flex: 1 }}>{children}</div>
    <Footer />
  </div>
);

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LayoutWrapper><Login /></LayoutWrapper>} />
      <Route path="/dashboard" element={<LayoutWrapper><AuditPanel /></LayoutWrapper>} />
      <Route path="/certificates-upload" element={<LayoutWrapper><CertificatesUpload /></LayoutWrapper>} />
      <Route path="/tax-management" element={<LayoutWrapper><TaxManagement /></LayoutWrapper>} />
      <Route path="/audit-panel" element={<LayoutWrapper><AuditPanel /></LayoutWrapper>} />
      <Route path="/system-settings" element={<LayoutWrapper><SystemSettings /></LayoutWrapper>} />
    </Routes>
  );
}
