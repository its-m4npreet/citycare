import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useUser,
} from "@clerk/clerk-react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReportDetail from "./pages/AdminReportDetail";
import ReportNewIssue from "./pages/ReportNewIssue";
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

export default function App() {
  return (
    <BrowserRouter>
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        {/* Navbar - Full Width */}
        <Navbar />

        {/* Sidebar and Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <SignedIn>
            <Sidebar />
          </SignedIn>

          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
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
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
