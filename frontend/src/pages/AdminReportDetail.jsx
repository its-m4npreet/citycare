import { useLocation, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import styles from "../style/AdminDashboard.module.css";
import { issueService } from "../services/issueService";
import { API_BASE_URL } from "../services/api";

export default function AdminReportDetail() {
  const { id } = useParams();
  const location = useLocation();
  
  // State management
  const [mutableReport, setMutableReport] = useState(location.state?.report || null);
  const [loading, setLoading] = useState(!location.state?.report);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Resolve media URL helper similar to MyReportDetail
  const SERVER_BASE = String(API_BASE_URL).replace(/\/$/, "").replace(/\/api$/, "");
  const toAbsoluteUrl = (entry) => {
    const raw = typeof entry === "string" ? entry : entry?.url || entry?.path || "";
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    const path = raw.startsWith("/") ? raw : `/${raw}`;
    return `${SERVER_BASE}${path}`;
  };

  // Fetch report from backend if not provided via state
  useEffect(() => {
    if (!mutableReport && id) {
      fetchReport();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 AdminReportDetail: Fetching report:', id);
      
      const issue = await issueService.getIssueById(id);
      console.log('✅ AdminReportDetail: Report received:', issue);
      
      // Transform backend data to match frontend format
      const transformedReport = {
        id: issue._id,
        title: issue.title,
        category: issue.category,
        location: issue.location?.address || issue.location || 'Unknown Location',
        status: issue.status,
        date: new Date(issue.createdAt).toISOString().slice(0, 10),
        description: issue.description,
        images: issue.media?.images || [],
        videos: issue.media?.videos || [],
        coords: issue.location?.coordinates || null,
        urgency: issue.urgency,
      };
      
      setMutableReport(transformedReport);
    } catch (err) {
      console.error('❌ AdminReportDetail: Error fetching report:', err);
      setError(err.message || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  // Update status via backend API
  const updateStatus = async (newStatus) => {
    if (!mutableReport) return;
    
    try {
      setUpdating(true);
      console.log('🔄 AdminReportDetail: Updating status to:', newStatus);
      
      await issueService.updateIssue(mutableReport.id, { status: newStatus });
      
      const updated = { ...mutableReport, status: newStatus };
      setMutableReport(updated);
      console.log('✅ AdminReportDetail: Status updated successfully');

      // Persist local override so AdminDashboard reflects immediately
      try {
        const key = 'citycare_report_overrides';
        const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
        const overrides = raw ? JSON.parse(raw) : {};
        overrides[mutableReport.id] = { ...(overrides[mutableReport.id] || {}), status: newStatus };
        localStorage.setItem(key, JSON.stringify(overrides));
      } catch {}
    } catch (err) {
      console.error('❌ AdminReportDetail: Error updating status:', err);
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 mb-2">{error}</p>
            <button
              onClick={fetchReport}
              className="text-red-600 hover:text-red-800 underline text-sm mr-4"
            >
              Try again
            </button>
            <Link
              to="/admin"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Back to Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No report found
  if (!mutableReport) {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <h2 className="text-xl font-semibold">Report Not Found</h2>
          <p style={{ marginTop: 16 }} className="text-gray-600">
            No report found with id: {id}
          </p>
          <Link
            to="/admin"
            style={{ marginTop: 16, display: "inline-block" }}
            className="text-blue-600 hover:underline"
          >
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div style={{ marginBottom: 16 }}>
          <Link
            to="/admin"
            aria-label="Back to Admin"
            className="inline-flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
            style={{ padding: '8px 12px', textDecoration: 'none' }}
          >
            <FiArrowLeft />
            <span>Back to Admin</span>
          </Link>
        </div>

        <div className="flex items-start justify-between" style={{ marginBottom: 8 }}>
          <div>
            <h2 className="text-2xl font-bold text-gray-800" title={mutableReport.title}>
              {mutableReport.title}
            </h2>
            <div className="flex items-center" style={{ gap: 12, marginTop: 6 }}>
              <span className="text-xs text-gray-700 font-mono bg-gray-100 border border-gray-200 rounded px-2 py-1" title={mutableReport.id}>
                {mutableReport.id}
              </span>
              <span className={`rounded-full text-xs font-semibold border ${mutableReport.status === 'resolved' ? 'bg-green-50 text-green-700 border-green-200' : mutableReport.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`} style={{ padding: '6px 12px' }}>
                {mutableReport.status === 'in-progress' ? 'In Progress' : mutableReport.status}
              </span>
              {mutableReport.urgency && (
                <span className={`text-xs font-semibold ${mutableReport.urgency === 'critical' ? 'text-red-600' : mutableReport.urgency === 'high' ? 'text-orange-600' : mutableReport.urgency === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                  {String(mutableReport.urgency || '').toUpperCase()} PRIORITY
                </span>
              )}
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 20,
            background: 'white',
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            padding: 24,
            border: '1px solid #f3f4f6',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg border border-gray-100" style={{ padding: 12 }}>
              <p className="text-xs text-gray-500" style={{ marginBottom: 4 }}>Category</p>
              <p className="text-sm text-gray-800 font-medium">{mutableReport.category || '—'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg border border-gray-100" style={{ padding: 12 }}>
              <p className="text-xs text-gray-500" style={{ marginBottom: 4 }}>Date</p>
              <p className="text-sm text-gray-800 font-medium">{mutableReport.date}</p>
            </div>
            <div className="bg-gray-50 rounded-lg border border-gray-100 md:col-span-2" style={{ padding: 12 }}>
              <p className="text-xs text-gray-500" style={{ marginBottom: 4 }}>Location</p>
              <p className="text-sm text-gray-800">{mutableReport.location}</p>
            </div>
          </div>

          {mutableReport.description && (
            <div style={{ marginTop: 16 }}>
              <h3 className="text-sm font-semibold text-gray-700" style={{ marginBottom: 6 }}>Details</h3>
              <div className="bg-white border border-gray-200 rounded-lg" style={{ padding: 12 }}>
                <p className="text-gray-700">{mutableReport.description}</p>
              </div>
            </div>
          )}

          {/* Images gallery */}
          {mutableReport.images && mutableReport.images.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h3 className="text-sm font-semibold text-gray-700">Images</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 18,
                  marginTop: 12,
                }}
              >
                {mutableReport.images.map((src, i) => (
                  <img
                    key={i}
                    src={toAbsoluteUrl(src)}
                    alt={`report-${mutableReport.id}-${i}`}
                    style={{
                      width: "100%",
                      borderRadius: 10,
                      border: "1px solid #e5e7eb",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {mutableReport.videos && mutableReport.videos.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h3 className="text-sm font-semibold text-gray-700">Videos</h3>
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                }}
              >
                {mutableReport.videos.map((src, i) => (
                  <video
                    key={i}
                    controls
                    style={{
                      width: "100%",
                      borderRadius: 10,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <source src={toAbsoluteUrl(src)} />
                    Your browser does not support the video tag.
                  </video>
                ))}
              </div>
            </div>
          )}

          {/* Location / Map link */}
          {mutableReport.coords && mutableReport.coords.lat && mutableReport.coords.lng && (
            <div style={{ marginTop: 16 }}>
              <strong>Location on map</strong>
              <div style={{ marginTop: 8 }}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mutableReport.coords.lat},${mutableReport.coords.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Admin status update buttons */}
        {mutableReport && (
          <div
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
            }}
          >
            <button
              onClick={() => updateStatus("in-progress")}
              disabled={updating || mutableReport.status === "in-progress"}
              aria-label="Mark in progress by admin"
              style={{
                padding: "10px 16px",
                background:
                  mutableReport.status === "in-progress" ? "#1e40af" : "#3b82f6",
                color: "white",
                borderRadius: 8,
                border: "none",
                cursor:
                  updating || mutableReport.status === "in-progress"
                    ? "not-allowed"
                    : "pointer",
                opacity: updating || mutableReport.status === "in-progress" ? 0.6 : 1,
              }}
            >
              {updating ? "Updating..." : mutableReport.status === "in-progress" ? "In Progress" : "Mark In Progress"}
            </button>
            <button
              onClick={() => updateStatus("resolved")}
              disabled={updating || mutableReport.status === "resolved"}
              aria-label="Mark resolved by admin"
              style={{
                padding: "10px 16px",
                background:
                  mutableReport.status === "resolved" ? "#047857" : "#059669",
                color: "white",
                borderRadius: 8,
                border: "none",
                cursor:
                  updating || mutableReport.status === "resolved"
                    ? "not-allowed"
                    : "pointer",
                opacity: updating || mutableReport.status === "resolved" ? 0.6 : 1,
                boxShadow:
                  mutableReport.status === "resolved"
                    ? "0 1px 0 rgba(0,0,0,0.05) inset"
                    : "0 6px 18px rgba(5,150,105,0.18)",
              }}
            >
              {updating ? "Updating..." : mutableReport.status === "resolved" ? "Resolved" : "Mark Resolved"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
