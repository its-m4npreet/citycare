import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin,
  FiCalendar,
  FiBarChart2,
  FiRefreshCw,
  FiFileText,
  FiInbox,
  FiX,
} from "react-icons/fi";
import { HiDocumentReport } from "react-icons/hi";
import { MdAccessTime } from "react-icons/md";
import { issueService } from "../services/issueService";

export default function MyReports() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await issueService.getUserIssues(user.id);
        
        // Transform backend data to match frontend format
        const transformedReports = data.map((issue) => ({
          id: issue._id,
          title: issue.title,
          category: issue.category,
          location: issue.location?.address || issue.location || 'Unknown Location',
          status: issue.status,
          date: new Date(issue.createdAt).toISOString().slice(0, 10),
          urgency: issue.urgency,
          description: issue.description,
          images: issue.media?.images || [],
          videos: issue.media?.videos || [],
          updates: issue.updates || [],
        }));
        
        setReports(transformedReports);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(err.message || "Failed to load reports");
        
        // Fallback to localStorage if backend fails
        try {
          const localReports = JSON.parse(localStorage.getItem("citycare_reports") || "[]");
          setReports(localReports);
        } catch {
          setReports([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user]);

  const filteredReports =
    filter === "all" ? reports : reports.filter((r) => r.status === filter);

  // Sort the filtered reports
  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.date) - new Date(a.date);
      case "oldest":
        return new Date(a.date) - new Date(b.date);
      case "urgency": {
        const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      }
      default:
        return 0;
    }
  });

  const statusCounts = {
    all: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    "in-progress": reports.filter((r) => r.status === "in-progress").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-50 text-green-700 border-green-200";
      case "in-progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "critical":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  // Show sign-in message if user is not authenticated
  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center" style={{ padding: "40px" }}>
        <div className="text-center">
          <FiAlertCircle
            className="text-green-600 mx-auto"
            size={64}
            style={{ marginBottom: "24px" }}
          />
          <h2 className="text-2xl font-bold text-gray-800" style={{ marginBottom: "12px" }}>
            Sign in to view your reports
          </h2>
          <p className="text-gray-600" style={{ marginBottom: "24px" }}>
            Please sign in to access your submitted civic issues.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            style={{ padding: "12px 32px" }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen" style={{ padding: "40px" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            className="text-3xl font-bold text-gray-800"
            style={{ marginBottom: "8px" }}
          >
            My Reports
          </h1>
          <p className="text-gray-600">
            Track and manage your submitted civic issues
          </p>
        </div>

        {/* Status Filters */}
        <div
          className="grid grid-cols-1 md:grid-cols-4"
          style={{ gap: "16px", marginBottom: "32px" }}
        >
          {[
            {
              key: "all",
              label: "All Reports",
              Icon: FiBarChart2,
              bgColor: "bg-gray-50",
              borderColor: "border-gray-500",
              textColor: "text-gray-700",
            },
            {
              key: "pending",
              label: "Pending",
              Icon: FiClock,
              bgColor: "bg-yellow-50",
              borderColor: "border-yellow-500",
              textColor: "text-yellow-700",
            },
            {
              key: "in-progress",
              label: "In Progress",
              Icon: FiRefreshCw,
              bgColor: "bg-blue-50",
              borderColor: "border-blue-500",
              textColor: "text-blue-700",
            },
            {
              key: "resolved",
              label: "Resolved",
              Icon: FiCheckCircle,
              bgColor: "bg-green-50",
              borderColor: "border-green-500",
              textColor: "text-green-700",
            },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`bg-white rounded-2xl border-2 transition-all duration-300 ${
                filter === item.key
                  ? `${item.borderColor} ${item.bgColor} shadow-sm`
                  : "border-gray-200 hover:border-gray-300"
              }`}
              style={{ padding: "20px" }}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p
                    className="text-sm text-gray-600 font-medium"
                    style={{ marginBottom: "4px" }}
                  >
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {statusCounts[item.key]}
                  </p>
                </div>
                <item.Icon className={item.textColor} size={32} />
              </div>
            </button>
          ))}
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div
            className="border-b border-gray-100"
            style={{ padding: "24px 32px" }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {filter === "all"
                  ? "All Reports"
                  : `${
                      filter.charAt(0).toUpperCase() + filter.slice(1)
                    } Reports`}
              </h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-gray-700"
                style={{ padding: "10px 16px" }}
              >
                <option value="recent">Sort by: Most Recent</option>
                <option value="oldest">Sort by: Oldest</option>
                <option value="urgency">Sort by: Urgency</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="text-center" style={{ padding: "80px 48px" }}>
                <FiRefreshCw
                  className="text-green-600 mx-auto animate-spin"
                  size={48}
                  style={{ marginBottom: "16px" }}
                />
                <h3
                  className="text-lg font-semibold text-gray-800"
                  style={{ marginBottom: "8px" }}
                >
                  Loading your reports...
                </h3>
                <p className="text-gray-600">
                  Please wait while we fetch your data.
                </p>
              </div>
            ) : error ? (
              <div className="text-center" style={{ padding: "80px 48px" }}>
                <FiAlertCircle
                  className="text-red-500 mx-auto"
                  size={48}
                  style={{ marginBottom: "16px" }}
                />
                <h3
                  className="text-lg font-semibold text-gray-800"
                  style={{ marginBottom: "8px" }}
                >
                  Error loading reports
                </h3>
                <p className="text-gray-600" style={{ marginBottom: "16px" }}>
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                  style={{ padding: "10px 24px" }}
                >
                  Try Again
                </button>
              </div>
            ) : sortedReports.length === 0 ? (
              <div className="text-center" style={{ padding: "80px 48px" }}>
                <FiInbox
                  className="text-gray-400 mx-auto"
                  size={80}
                  style={{ marginBottom: "16px" }}
                />
                <h3
                  className="text-lg font-semibold text-gray-800"
                  style={{ marginBottom: "8px" }}
                >
                  No reports found
                </h3>
                <p className="text-gray-600">
                  You haven't submitted any reports in this category yet.
                </p>
              </div>
            ) : (
              sortedReports.map((report) => (
                <div
                  key={report.id}
                  className="hover:bg-gray-50 transition-colors"
                  style={{ padding: "24px 32px" }}
                >
                  <div className="flex" style={{ gap: "24px" }}>
                    {/* Left side - Main content */}
                    <div className="flex-1">
                      <div
                        className="flex items-start justify-between"
                        style={{ marginBottom: "12px" }}
                      >
                        <div>
                          <h3
                            className="text-lg font-semibold text-gray-800"
                            style={{ marginBottom: "4px" }}
                          >
                            {report.title}
                          </h3>
                          <p className="text-xs text-gray-500 font-mono" style={{ marginBottom: "8px" }}>
                            Issue ID: {report.id}
                          </p>
                          <div
                            className="flex items-center text-sm text-gray-600"
                            style={{ gap: "16px" }}
                          >
                            <span
                              className="flex items-center"
                              style={{ gap: "6px" }}
                            >
                              <FiMapPin size={14} />
                              {report.location}
                            </span>
                            <span
                              className="flex items-center"
                              style={{ gap: "6px" }}
                            >
                              <FiCalendar size={14} />
                              {new Date(report.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`rounded-full text-xs font-semibold border ${getStatusColor(
                            report.status
                          )}`}
                          style={{ padding: "6px 16px" }}
                        >
                          {report.status === "in-progress"
                            ? "In Progress"
                            : report.status}
                        </span>
                      </div>

                      <p
                        className="text-gray-700"
                        style={{ marginBottom: "12px" }}
                      >
                        {report.description}
                      </p>

                      <div
                        className="flex items-center"
                        style={{ gap: "12px" }}
                      >
                        <span
                          className="text-xs bg-gray-100 text-gray-700 rounded-full font-medium"
                          style={{ padding: "6px 16px" }}
                        >
                          {report.category}
                        </span>
                        <span
                          className={`text-xs font-semibold ${getUrgencyColor(
                            report.urgency
                          )}`}
                        >
                          {report.urgency.toUpperCase()} PRIORITY
                        </span>
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex flex-col" style={{ gap: "8px" }}>
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setShowDetailsModal(true);
                        }}
                        className="text-sm font-semibold text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        style={{ padding: "10px 20px" }}
                      >
                        View Details
                      </button>
                      {report.status !== "resolved" && (
                        <button
                          onClick={() => {
                            // Navigate to report update page with report data
                            navigate("/report-new-issue", {
                              state: { updateReport: report },
                            });
                          }}
                          className="text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          style={{ padding: "10px 20px" }}
                        >
                          Update
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress indicator for in-progress items
                  {report.status === 'in-progress' && (
                    <div className="border-t border-gray-200" style={{ marginTop: '16px', paddingTop: '16px' }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                        <span className="text-sm text-gray-600 font-medium">Progress</span>
                        <span className="text-sm font-bold text-blue-600">60%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full" style={{ height: '8px' }}>
                        <div className="bg-blue-600 rounded-full" style={{ width: '60%', height: '8px' }}></div>
                      </div>
                    </div>
                  )} */}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {showDetailsModal && selectedReport && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowDetailsModal(false)}
          style={{ padding: "20px" }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: "32px" }}
          >
            <div
              className="flex justify-between items-start"
              style={{ marginBottom: "24px" }}
            >
              <div>
                <h2
                  className="text-2xl font-bold text-gray-800"
                  style={{ marginBottom: "4px" }}
                >
                  {selectedReport.title}
                </h2>
                <p className="text-xs text-gray-500 font-mono" style={{ marginBottom: "8px" }}>
                  Issue ID: {selectedReport.id}
                </p>
                <span
                  className={`inline-block rounded-full text-xs font-semibold border ${getStatusColor(
                    selectedReport.status
                  )}`}
                  style={{ padding: "6px 16px" }}
                >
                  {selectedReport.status === "in-progress"
                    ? "In Progress"
                    : selectedReport.status}
                </span>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                <FiX />
              </button>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <h3
                className="text-sm font-semibold text-gray-700"
                style={{ marginBottom: "8px" }}
              >
                Description
              </h3>
              <p className="text-gray-700">{selectedReport.description}</p>
            </div>

            <div
              className="grid grid-cols-2 gap-4"
              style={{ marginBottom: "24px" }}
            >
              <div>
                <h3
                  className="text-sm font-semibold text-gray-700"
                  style={{ marginBottom: "8px" }}
                >
                  Category
                </h3>
                <p className="text-gray-700">{selectedReport.category}</p>
              </div>
              <div>
                <h3
                  className="text-sm font-semibold text-gray-700"
                  style={{ marginBottom: "8px" }}
                >
                  Urgency
                </h3>
                <p
                  className={`font-semibold ${getUrgencyColor(
                    selectedReport.urgency
                  )}`}
                >
                  {selectedReport.urgency.toUpperCase()}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <h3
                className="text-sm font-semibold text-gray-700"
                style={{ marginBottom: "8px" }}
              >
                Location
              </h3>
              <div
                className="flex items-center text-gray-700"
                style={{ gap: "8px" }}
              >
                <FiMapPin size={16} />
                {selectedReport.location}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <h3
                className="text-sm font-semibold text-gray-700"
                style={{ marginBottom: "8px" }}
              >
                Reported Date
              </h3>
              <div
                className="flex items-center text-gray-700"
                style={{ gap: "8px" }}
              >
                <FiCalendar size={16} />
                {new Date(selectedReport.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            <div
              className="border-t border-gray-200"
              style={{ paddingTop: "24px" }}
            >
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                style={{ padding: "12px 24px" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
