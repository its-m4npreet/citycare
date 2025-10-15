import { useLocation, useParams, Link } from "react-router-dom";
import { useState } from "react";
import styles from "../style/AdminDashboard.module.css";

export default function AdminReportDetail() {
  const { id } = useParams();
  const location = useLocation();
  // Try to read report from location.state first (passed from dashboard link)
  const report = location.state?.report;

  // if we have report data, keep a mutable copy for local updates
  const [mutableReport, setMutableReport] = useState(
    report ? { ...report } : null
  );

  const saveOverride = (id, patch) => {
    try {
      const raw = localStorage.getItem("citycare_report_overrides") || "{}";
      const map = JSON.parse(raw);
      map[id] = { ...(map[id] || {}), ...patch };
      localStorage.setItem("citycare_report_overrides", JSON.stringify(map));
    } catch (e) {
      console.error("failed to save override", e);
    }
  };

  const updateStatus = (newStatus) => {
    if (!mutableReport) return;
    const updated = { ...mutableReport, status: newStatus };
    setMutableReport(updated);
    saveOverride(mutableReport.id, { status: newStatus });
  };

  // If not provided via state, show a fallback message (could be extended to fetch by id)
  if (!report) {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <h2 className="text-xl font-semibold">Report Details</h2>
          <p style={{ marginTop: 16 }} className="text-gray-600">
            No report data was provided for id: {id}.
          </p>
          <p style={{ marginTop: 8 }} className="text-sm text-gray-500">
            You can extend this page to fetch the report by id from the backend.
          </p>
          <Link
            to="/admin"
            style={{ marginTop: 16, display: "inline-block" }}
            className="text-blue-600 hover:underline"
          >
            Back to admin
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
            className="text-sm text-blue-600 hover:underline"
            style={{ textDecoration: "none" }}
          >
            ← Back to Admin
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
          {mutableReport ? mutableReport.title : report.title}
        </h2>
        <p className="text-sm text-gray-600">
          Category: {mutableReport ? mutableReport.category : report.category}
        </p>
        <div
          style={{
            marginTop: 20,
            background: "white",
            borderRadius: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            padding: 24,
            border: "1px solid #f3f4f6",
          }}
        >
          <p
            className="text-sm text-gray-700"
            style={{ padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}
          >
            <strong>Location:</strong>{" "}
            {mutableReport ? mutableReport.location : report.location}
          </p>
          <p
            className="text-sm text-gray-700"
            style={{ padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}
          >
            <strong>Status:</strong>{" "}
            {mutableReport ? mutableReport.status : report.status}
          </p>
          <p className="text-sm text-gray-700" style={{ padding: "8px 0" }}>
            <strong>Date:</strong> {report.date}
          </p>

          {report.description && (
            <div style={{ marginTop: 12 }} className="text-gray-700">
              <strong>Details:</strong>
              <p style={{ marginTop: 4 }}>
                {mutableReport ? mutableReport.description : report.description}
              </p>
            </div>
          )}

          {/* Images gallery */}
          {report.images && report.images.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <strong>Images</strong>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 18,
                  marginTop: 12,
                }}
              >
                {report.images.map((src, i) => (
                  <img
                    key={i}
                    src={src }
                    alt={`report-${report.id}-${i}`}
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
          {report.videos && report.videos.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <strong>Videos</strong>
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                }}
              >
                {report.videos.map((src, i) => (
                  <video
                    key={i}
                    controls
                    style={{
                      width: "100%",
                      borderRadius: 10,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <source src={src} />
                    Your browser does not support the video tag.
                  </video>
                ))}
              </div>
            </div>
          )}

          {/* Location / Map link */}
          {report.coords && report.coords.lat && report.coords.lon && (
            <div style={{ marginTop: 16 }}>
              <strong>Location on map</strong>
              <div style={{ marginTop: 8 }}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${report.coords.lat},${report.coords.lon}`}
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

        {/* Admin resolved CTA at the end of the page */}
        {mutableReport && (
          <div
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={() => updateStatus("resolved")}
              disabled={mutableReport.status === "resolved"}
              aria-label="Mark resolved by admin"
              style={{
                padding: "10px 16px",
                background:
                  mutableReport.status === "resolved" ? "#047857" : "#059669",
                color: "white",
                borderRadius: 8,
                border: "none",
                cursor:
                  mutableReport.status === "resolved"
                    ? "not-allowed"
                    : "pointer",
                boxShadow:
                  mutableReport.status === "resolved"
                    ? "0 1px 0 rgba(0,0,0,0.05) inset"
                    : "0 6px 18px rgba(5,150,105,0.18)",
              }}
            >
              {mutableReport.status === "resolved"
                ? // show a clear check label when resolved
                  "Resolved"
                : "Mark Resolved "}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
