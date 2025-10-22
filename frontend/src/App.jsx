import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useUser,
} from "@clerk/clerk-react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReportDetail from "./pages/AdminReportDetail";
import ReportNewIssue from "./pages/ReportNewIssue";
import MyReportDetail from "./pages/MyReportDetail";
import MyReports from "./pages/MyReports";
import Map from "./pages/Map";
import Profile from "./pages/Profile";

// Protected Route Component
function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

// Admin-only route wrapper: checks Clerk user for admin role in publicMetadata
function AdminRoute({ children }) {
  return (
    <ProtectedRoute>
      <SignedIn>
        <AdminRoleChecker>{children}</AdminRoleChecker>
      </SignedIn>
    </ProtectedRoute>
  );
}

function AdminRoleChecker({ children }) {
  const { user } = useUser();
  // If user object isn't available yet, fall back to not authorized UI
  if (!user) return <div className="p-6">Not authorized</div>;

  // Clerk exposes publicMetadata where we can store simple role flags like { role: 'admin' }
  const role = user.publicMetadata?.role || user?.unsafeMetadata?.role;
  if (role === "admin") return children;

  // Also allow a small set of emails to be admins (useful for quick setup)
  // Default admin email: workgd06@gmail.com. You can override/add via VITE_ADMIN_EMAILS (comma-separated).
  const envList =
    import.meta.env.VITE_ADMIN_EMAILS ||
    "workgd06@gmail.com,manish.business.com@gmail.com";
  const adminEmails = new Set(
    envList
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  );

  const primaryEmail =
    user.primaryEmailAddress?.emailAddress ||
    (user.emailAddresses && user.emailAddresses[0]?.emailAddress) ||
    user.email;

  if (primaryEmail && adminEmails.has(String(primaryEmail).toLowerCase())) {
    return children;
  }

  return (
    <div style={{ padding: 24 }}>
      <h3 className="text-lg font-semibold">Not authorized</h3>
      <p className="text-sm text-gray-600" style={{ marginTop: 8 }}>
        This area is restricted to admin users only.
      </p>
    </div>
  );
}

// Component to handle landing page with authentication check
function LandingPageWithAuth() {
  return (
    <>
      <SignedIn>
        <Navigate to="/dashboard" replace />
      </SignedIn>
      <SignedOut>
        <LandingPage />
      </SignedOut>
    </>
  );
}

function AppContent() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return (
      <div style={{ minHeight: '100vh', overflow: 'auto' }}>
        <Routes>
          <Route path="/" element={<LandingPageWithAuth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <Map />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/report/:id"
            element={
              <AdminRoute>
                <AdminReportDetail />
              </AdminRoute>
            }
          />
          <Route
            path="/report-new-issue"
            element={
              <ProtectedRoute>
                <ReportNewIssue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-reports"
            element={
              <ProtectedRoute>
                <MyReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-reports/:id"
            element={
              <ProtectedRoute>
                <MyReportDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col" style={{ overflow: 'auto' }}>
      {/* Navbar - Full Width */}
      <Navbar
        onMenuClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        mobileSidebarOpen={mobileSidebarOpen}
      />

      {/* Sidebar and Main Content */}
      <div className="flex flex-1" style={{ overflow: 'auto' }}>
        <SignedIn>
          <Sidebar
            mobileOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
          />
        </SignedIn>

        <main className="flex-1" style={{ overflow: 'auto' }}>
          <Routes>
            <Route path="/" element={<LandingPageWithAuth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <Map />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/report/:id"
              element={
                <AdminRoute>
                  <AdminReportDetail />
                </AdminRoute>
              }
            />
            <Route
              path="/report-new-issue"
              element={
                <ProtectedRoute>
                  <ReportNewIssue />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-reports"
              element={
                <ProtectedRoute>
                  <MyReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-reports/:id"
              element={
                <ProtectedRoute>
                  <MyReportDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
