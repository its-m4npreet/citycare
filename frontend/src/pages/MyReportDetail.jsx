import { useLocation, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { FiMapPin, FiCalendar, FiX } from "react-icons/fi";
import { issueService } from "../services/issueService";
import { API_BASE_URL } from "../services/api";

export default function MyReportDetail() {
  const { id } = useParams();
  const location = useLocation();

  const [report, setReport] = useState(location.state?.report || null);
  const [loading, setLoading] = useState(!location.state?.report);
  const [error, setError] = useState(null);

  // Resolve media URL helper: supports absolute URLs and server-relative paths
  const SERVER_BASE = String(API_BASE_URL).replace(/\/$/, "").replace(/\/api$/, "");
  const toAbsoluteUrl = (entry) => {
    const raw = typeof entry === "string" ? entry : entry?.url || entry?.path || "";
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    const path = raw.startsWith("/") ? raw : `/${raw}`;
    return `${SERVER_BASE}${path}`;
  };

  useEffect(() => {
    if (!report && id) {
      fetchReport();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const issue = await issueService.getIssueById(id);
      const transformed = {
        id: issue._id,
        title: issue.title,
        category: issue.category,
        location: issue.location?.address || issue.location || "Unknown Location",
        status: issue.status,
        date: new Date(issue.createdAt).toISOString().slice(0, 10),
        description: issue.description,
        images: issue.media?.images || [],
        videos: issue.media?.videos || [],
        coords: issue.location?.coordinates || null,
        urgency: issue.urgency,
      };
      setReport(transformed);
    } catch (err) {
      setError(err.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen" style={{ padding: "40px" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen" style={{ padding: "40px" }}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 mb-2">{error}</p>
            <button onClick={fetchReport} className="text-red-600 hover:text-red-800 underline text-sm">
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-gray-50 min-h-screen" style={{ padding: "40px" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold">Report Not Found</h2>
          <p style={{ marginTop: 16 }} className="text-gray-600">
            No report found with id: {id}
          </p>
          <Link to="/my-reports" style={{ marginTop: 16, display: "inline-block" }} className="text-blue-600 hover:underline">
            Back to My Reports
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen" style={{ padding: "40px" }}>
      <div className="max-w-4xl mx-auto">
        <div style={{ marginBottom: 16 }}>
          <Link
            to="/my-reports"
            aria-label="Back to My Reports"
            className="inline-flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
            style={{ padding: '8px 12px', textDecoration: 'none' }}
          >
            <FiArrowLeft />
            <span>Back to My Reports</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100" style={{ padding: 24 }}>
          <div className="flex justify-between items-start" style={{ marginBottom: 16 }}>
            <div>
              <h1 className="text-2xl font-bold text-gray-800" style={{ marginBottom: 4 }} title={report.title}>
                {report.title}
              </h1>
              <p className="text-xs text-gray-700 font-mono" style={{ marginBottom: 8, wordBreak: 'break-all' }} title={report.id}>
                <span className="bg-gray-100 border border-gray-200 rounded px-2 py-1">{report.id}</span>
              </p>
              <span className={`inline-block rounded-full text-xs font-semibold border ${getStatusColor(report.status)}`} style={{ padding: "6px 16px" }}>
                {report.status === "in-progress" ? "In Progress" : report.status}
              </span>
            </div>
            <span className={`text-xs font-semibold ${getUrgencyColor(report.urgency)}`}>
              {String(report.urgency || '').toUpperCase()} PRIORITY
            </span>
          </div>

          <div style={{ marginBottom: 16 }}>
            <h3 className="text-sm font-semibold text-gray-700" style={{ marginBottom: 8 }}>Description</h3>
            <p className="text-gray-700">{report.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4" style={{ marginBottom: 16 }}>
            <div>
              <h3 className="text-sm font-semibold text-gray-700" style={{ marginBottom: 8 }}>Location</h3>
              <div className="flex items-center text-gray-700" style={{ gap: 8 }}>
                <FiMapPin size={16} />
                {report.location}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700" style={{ marginBottom: 8 }}>Reported Date</h3>
              <div className="flex items-center text-gray-700" style={{ gap: 8 }}>
                <FiCalendar size={16} />
                {new Date(report.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {Array.isArray(report.images) && report.images.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h3 className="text-sm font-semibold text-gray-700" style={{ marginBottom: 8 }}>Images</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {report.images.map((src, i) => (
                  <img key={i} src={toAbsoluteUrl(src)} alt={`report-${report.id}-${i}`} style={{ width: "100%", borderRadius: 10, border: "1px solid #e5e7eb" }} />
                ))}
              </div>
            </div>
          )}

          {Array.isArray(report.videos) && report.videos.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h3 className="text-sm font-semibold text-gray-700" style={{ marginBottom: 8 }}>Videos</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {report.videos.map((src, i) => (
                  <video key={i} controls style={{ width: "100%", borderRadius: 10, border: "1px solid #e5e7eb" }}>
                    <source src={toAbsoluteUrl(src)} />
                    Your browser does not support the video tag.
                  </video>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


