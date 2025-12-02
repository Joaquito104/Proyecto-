import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/layout/Navbar";
import ThemeToggle from "./components/common/ThemeToggle";

const LayoutWrapper = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <ThemeToggle />
    <Navbar />
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LayoutWrapper><Login /></LayoutWrapper>} />
      <Route path="/dashboard" element={<LayoutWrapper><Dashboard /></LayoutWrapper>} />
    </Routes>
  );
}
