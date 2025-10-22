import { useState, useEffect } from "react";
import {
  FiUsers,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "../style/AdminDashboard.module.css";
import { issueService } from "../services/issueService";

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingReports: 0,
    inProgressReports: 0,
    resolvedReports: 0,
  });

  // Fetch data from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 AdminDashboard: Fetching dashboard stats...");
      // Fetch dashboard stats
      const statsData = await issueService.getDashboardStats();
      console.log("✅ AdminDashboard: Stats received:", statsData);

      setStats({
        totalUsers: statsData.totalUsers || 0,
        pendingReports: statsData.pendingIssues || 0,
        inProgressReports: statsData.inProgressIssues || 0,
        resolvedReports: statsData.resolvedIssues || 0,
      });

      console.log("🔄 AdminDashboard: Fetching all issues...");
      // Fetch all issues for admin
      const issues = await issueService.getAllIssues({
        sortBy: "createdAt",
        order: "desc",
      });
      console.log(
        "✅ AdminDashboard: Issues received:",
        issues.length,
        "issues"
      );

      // Transform backend data to match frontend format
      const transformedReports = issues.map((issue) => ({
        id: issue._id,
        title: issue.title,
        category: issue.category,
        location:
          issue.location?.address || issue.location || "Unknown Location",
        status: issue.status,
        date: new Date(issue.createdAt).toISOString().slice(0, 10),
        description: issue.description,
        images: issue.media?.images?.map((img) => img.url) || [],
        videos: issue.media?.videos?.map((vid) => vid.url) || [],
        coords: issue.location?.coordinates || null,
        urgency: issue.urgency,
      }));

      setReports(transformedReports);
      console.log("✅ AdminDashboard: Data loaded successfully -", {
        totalUsers: statsData.totalUsers,
        pendingReports: statsData.pendingIssues,
        inProgressReports: statsData.inProgressIssues,
        resolvedReports: statsData.resolvedIssues,
        totalReports: transformedReports.length,
      });
    } catch (err) {
      console.error("Error fetching admin dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");

      // Fallback to localStorage if backend fails
      try {
        const raw = localStorage.getItem("citycare_reports");
        if (raw) {
          setReports(JSON.parse(raw));
        }
      } catch {
        setReports([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // derive categories from reports
  const derivedCategories = Array.from(
    new Set(reports.map((r) => r.category).filter(Boolean))
  );
  const [checkedCategories, setCheckedCategories] = useState({});

  // Update checked categories when reports change
  useEffect(() => {
    const map = {};
    derivedCategories.forEach((c) => (map[c] = true));
    setCheckedCategories(map);
  }, [reports.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleCategory = (cat) => {
    setCheckedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // (viewed/checked features removed per request)

  // prepare displayed reports: only include reports from currently checked categories
  // then sort newest-first
  // apply any local overrides saved by admin actions (localStorage)
  const overridesRaw =
    typeof window !== "undefined"
      ? localStorage.getItem("citycare_report_overrides")
      : null;
  let overrides = {};
  try {
    overrides = overridesRaw ? JSON.parse(overridesRaw) : {};
  } catch {
    overrides = {};
  }

  const displayedReports = [...reports]
    .map((r) => (overrides[r.id] ? { ...r, ...overrides[r.id] } : r))
    .filter((r) => (isMobile ? true : !!checkedCategories[r.category])) // Show all on mobile, filter on desktop
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-xs md:text-sm text-gray-600">
              Overview of city reports and quick actions
            </p>
          </div>
          {/* Category filters - hidden on mobile */}
          <div className="hidden md:block">
            <div className={styles.filterContainer}>
              {derivedCategories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 text-xs md:text-sm"
                >
                  <input
                    type="checkbox"
                    checked={!!checkedCategories[cat]}
                    onChange={() => toggleCategory(cat)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 mb-2">{error}</p>
            <button
              onClick={fetchData}
              className="text-red-600 hover:text-red-800 underline text-sm"
            >
              Try again
            </button>
          </div>
        )}

        {/* Stats Grid */}
        {!loading && !error && (
          <div className={styles.statGrid}>
            <div
              className={
                "bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center " +
                styles.cardGap +
                " " +
                styles.cardPadding
              }
            >
              <div className="bg-green-50 p-3 rounded-lg">
                <FiUsers className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-lg md:text-xl font-bold text-gray-800">
                  {stats.totalUsers.toLocaleString()}
                </p>
              </div>
            </div>

            <div
              className={
                "bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center " +
                styles.cardGap +
                " " +
                styles.cardPadding
              }
            >
              <div className="bg-yellow-50 p-3 rounded-lg">
                <FiClock className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Reports</p>
                <p className="text-lg md:text-xl font-bold text-yellow-600">
                  {stats.pendingReports}
                </p>
              </div>
            </div>

            <div
              className={
                "bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center " +
                styles.cardGap +
                " " +
                styles.cardPadding
              }
            >
              <div className="bg-blue-50 p-3 rounded-lg">
                <FiAlertCircle className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-lg md:text-xl font-bold text-blue-600">
                  {stats.inProgressReports}
                </p>
              </div>
            </div>

            <div
              className={
                "bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center " +
                styles.cardGap +
                " " +
                styles.cardPadding
              }
            >
              <div className="bg-green-50 p-3 rounded-lg">
                <FiCheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Resolved</p>
                <p className="text-lg md:text-xl font-bold text-green-600">
                  {stats.resolvedReports}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reports Table */}
        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={styles.tablePadding + " border-b border-gray-100"}>
              <h3 className="font-semibold text-gray-800 text-base md:text-lg">
                Recent Reports
              </h3>
            </div>
            <div className={styles.tableWrapper}>
              <div className={styles.tablePadding}>
                {displayedReports.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-2">No reports found</p>
                    <p className="text-sm text-gray-400">
                      {reports.length === 0
                        ? "No reports have been submitted yet"
                        : "Try selecting different category filters"}
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs md:text-sm text-gray-500">
                        <th className={styles.cellY}>Issue ID</th>
                        <th className={styles.cellY}>Title</th>
                        <th
                          className={`${styles.cellY} ${styles.hideOnMobile}`}
                        >
                          Location
                        </th>
                        <th className={styles.cellY}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedReports.map((r, idx) => (
                        <tr
                          key={r.id}
                          className={`border-t border-gray-100 ${
                            idx === 0 ? "bg-green-50" : ""
                          }`}
                        >
                          <td
                            className={
                              styles.cellY + " text-gray-800 font-mono text-xs"
                            }
                            title={r.id}
                          >
                            <span className="bg-gray-100 border border-gray-200 rounded px-2 py-1">
                              #{(r.id || "").slice(-8)}
                            </span>
                          </td>
                          <td
                            className={
                              styles.cellY +
                              " font-medium text-gray-700 text-sm"
                            }
                            title={r.title}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="truncate"
                                style={{ maxWidth: "200px" }}
                              >
                                <Link
                                  to={`/admin/report/${r.id}`}
                                  state={{ report: r }}
                                  className="text-blue-600 hover:underline"
                                  title={r.title}
                                >
                                  {r.title}
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td
                            className={`${styles.cellY} ${styles.hideOnMobile} text-gray-600 text-sm`}
                            title={r.location}
                          >
                            <div
                              className="truncate"
                              style={{ maxWidth: "200px" }}
                              title={r.location}
                            >
                              {r.location}
                            </div>
                          </td>
                          <td
                            className={
                              styles.cellY + " text-gray-600 text-xs md:text-sm"
                            }
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "8px",
                              }}
                            >
                              <div style={{ whiteSpace: "nowrap" }}>
                                {r.date}
                              </div>
                              <Link
                                to={`/admin/report/${r.id}`}
                                state={{ report: r }}
                                className="text-xs text-blue-600 hover:underline view"
                                style={{
                                  marginLeft: "auto",
                                  textDecoration: "underline",
                                  color: "#2563eb",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                View
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
