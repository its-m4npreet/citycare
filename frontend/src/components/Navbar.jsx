import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";


export default function Navbar({ onMenuClick, mobileSidebarOpen }) {
  const { user } = useUser();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <nav
      className="bg-white border-b border-gray-200 sticky top-0 z-50"
      style={{
        padding: "12px 32px",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div className="flex justify-between items-center">
        {/* Left side - CityCare Logo */}
        <Link
          to={isLandingPage ? "/" : "/dashboard"}
          className="flex items-center"
          style={{ textDecoration: "none" }}
        >
          <img
            src="/logo1.png"
            alt="CityCare Logo"
            style={{ height: "50px", width: "auto", objectFit: "cover" }}
          />
          <span
            className="ml-3 text-2xl font-extrabold tracking-tight"
            style={{
              fontFamily: "Poppins, Inter, Arial, sans-serif",
              color: "#0e8af8",
              letterSpacing: "0.5px",
              textShadow: "0 2px 8px rgba(14,138,248,0.08)",
            }}
          >
            City
            <span
              className="text-green-600"
              style={{
                fontFamily: "Poppins, Inter, Arial, sans-serif",
                fontWeight: 900,
                marginLeft: "2px",
                textShadow: "0 2px 8px rgba(16,185,129,0.10)",
              }}
            >
              Care
            </span>
          </span>
        </Link>

        {/* Right side - Auth Buttons / User Profile */}
        <div className="hidden md:flex items-center" style={{ gap: "12px" }}>
          {/* When User is NOT Logged In - Show Login and Register buttons */}
          <SignedOut>
            <SignInButton
              mode="modal"
              appearance={{
                variables: {
                  colorPrimary: "#10b981",
                  colorBackground: "#ffffff",
                },
                elements: {
                  formButtonPrimary: "bg-green-600 hover:bg-green-700",
                  card: "shadow-2xl bg-white",
                  modalContent: "bg-white",
                },
              }}
            >
              <button
                className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold rounded-lg transition-colors"
                style={{ padding: "10px 24px" }}
              >
                Login
              </button>
            </SignInButton>

            <SignUpButton
              mode="modal"
              appearance={{
                variables: {
                  colorPrimary: "#10b981",
                  colorBackground: "#ffffff",
                },
                elements: {
                  formButtonPrimary: "bg-green-600 hover:bg-green-700",
                  card: "shadow-2xl bg-white",
                  modalContent: "bg-white",
                },
              }}
            >
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                style={{ padding: "10px 24px" }}
              >
                Register
              </button>
            </SignUpButton>
          </SignedOut>

          {/* When User IS Logged In - Show Notifications + User Profile */}
          <SignedIn>
            {!isLandingPage && (
              <>
                {/* Notification button */}
                <button
                  aria-label="Notifications"
                  className="relative rounded-md hover:bg-green-100 border border-gray-400 hover:border-green-600  cursor-pointer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3px' }}
                >
                 <IoMdNotificationsOutline className="h-6 w-6 text-gray-700" />

                  {/* unread badge (static for now) */}
                  <span
                    className="absolute top-0 right-0 inline-flex items-center justify-center w-2 h-2 text-xs font-semibold text-white bg-red-600 rounded-full"
                    style={{ transform: 'translate(50%,-30%)' }}
                  >
                  </span>
                </button>

                <Link
                  to="/profile"
                  aria-label="Open profile"
                  className="flex items-center"
                  style={{ gap: "12px", textDecoration: "none", cursor: "pointer" }}
                >
                  <img
                    src={user?.imageUrl}
                    alt={user?.firstName || "User"}
                    className="rounded-full border-2 border-green-500"
                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                  />
                  <div className="flex flex-col">
                    <span
                      className="text-sm font-semibold text-gray-800"
                      style={{ fontSize: "14px", fontWeight: "600" }}
                    >
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span
                      className="text-xs text-green-600"
                      style={{ fontSize: "12px" }}
                    >
                      Active
                    </span>
                  </div>
                </Link>
              </>
            )}
          </SignedIn>
        </div>

        {/* Mobile: Hamburger Menu - Only show when signed in and not on landing page */}
        <SignedIn>
          {!isLandingPage && (
            <div className="md:hidden flex items-center">
            <button
              aria-label="Toggle menu"
              onClick={onMenuClick}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              {mobileSidebarOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
          )}
        </SignedIn>
      </div>
    </nav>
  );
}
