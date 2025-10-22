import { UserProfile } from "@clerk/clerk-react";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Sidebar from "../components/Sidebar";

export default function Profile() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Menu Button - Only visible on mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          Profile Settings
        </h2>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Sidebar - Only rendered on mobile */}
      <div className="md:hidden">
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="pt-16 md:pt-0" style={{ padding: "40px" }}>
        <div className="max-w-4xl mx-auto">
          {/* Header - Hidden on mobile since it's in the top bar */}
          <div className="hidden md:block" style={{ marginBottom: "32px" }}>
            <h1
              className="text-3xl font-bold text-gray-800"
              style={{ marginBottom: "8px" }}
            >
              Profile Settings
            </h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Clerk User Profile Component */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <UserProfile
              appearance={{
                variables: {
                  colorPrimary: "#10b981",
                  colorBackground: "#ffffff",
                  colorText: "#1f2937",
                  colorInputBackground: "#ffffff",
                  colorInputText: "#1f2937",
                },
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 w-full",
                  navbar: "bg-white border-r border-gray-200",
                  navbarButton:
                    "text-gray-700 hover:bg-green-50 hover:text-green-600",
                  navbarButtonActive: "bg-green-50 text-green-600",
                  profileSection: "p-0",
                  profileSectionPrimaryButton:
                    "bg-green-600 hover:bg-green-700",
                  formButtonPrimary: "bg-green-600 hover:bg-green-700",
                  formFieldInput:
                    "border-gray-300 focus:border-green-500 focus:ring-green-500",
                  pageScrollBox: "p-8",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
