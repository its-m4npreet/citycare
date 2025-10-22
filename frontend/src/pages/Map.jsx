import { useEffect, useRef, useState } from "react";
import { issueService } from "../services/issueService";
import "../style/MapPage.css";
import { FiMapPin, FiFilter, FiSearch } from "react-icons/fi";
import { MdPendingActions, MdCheckCircle } from "react-icons/md";

export default function Map() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const loadGoogleMaps = () => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
        return;
      }
      const existing = document.querySelector("script[data-google-maps]");
      if (existing) {
        existing.addEventListener("load", () => resolve(window.google.maps));
        existing.addEventListener("error", reject);
        return;
      }
      if (!GOOGLE_MAPS_API_KEY) {
        reject(new Error("Missing Google Maps API key"));
        return;
      }
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.setAttribute("data-google-maps", "true");
      script.onload = () => resolve(window.google.maps);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const getColorByStatus = (status) => {
    const normalized = String(status).toLowerCase();
    if (normalized === "resolved") return "#22c55e"; // green-500
    if (normalized === "in-progress" || normalized === "in progress")
      return "#3b82f6"; // blue-500
    return "#eab308"; // yellow-500 for pending/others
  };

  const createMarkerSvgDataUrl = (color) => {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="rgba(0,0,0,0.25)"/>
    </filter>
  </defs>
  <g filter="url(#shadow)">
    <circle cx="14" cy="14" r="9" fill="${color}" stroke="white" stroke-width="2"/>
  </g>
  <circle cx="14" cy="14" r="2" fill="white" opacity="0.9"/>
</svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  // Fetch issues from backend (lightweight locations endpoint)
  useEffect(() => {
    let isCancelled = false;
    const fetchIssues = async () => {
      try {
        setIsLoading(true);
        setError("");
        let data;
        try {
          data = await issueService.getIssueLocations({ limit: 1000 });
        } catch (err) {
          // fallback if lightweight endpoint fails
          const all = await issueService.getAllIssues({ limit: 1000 });
          data = all;
        }
        if (isCancelled) return;
        // Normalize to a lightweight array with coordinates (coerce to numbers)
        let normalized = (Array.isArray(data) ? data : data?.data || [])
          .map((it) => {
            const rawLat =
              it?.location?.coordinates?.latitude ??
              it?.location?.coordinates?.lat;
            const rawLng =
              it?.location?.coordinates?.longitude ??
              it?.location?.coordinates?.lng;
            const lat = typeof rawLat === "string" ? Number(rawLat) : rawLat;
            const lng = typeof rawLng === "string" ? Number(rawLng) : rawLng;
            return {
              id: it._id,
              title: it.title,
              locationText: it?.location?.address || "",
              lat,
              lng,
              status: it.status,
              category: it.category,
              severity: it.urgency || "medium",
            };
          })
          .filter((it) => Number.isFinite(it.lat) && Number.isFinite(it.lng));

        // Fallback to full issues endpoint if nothing returned
        if (!normalized.length) {
          const all = await issueService.getAllIssues({ limit: 1000 });
          const arr = Array.isArray(all) ? all : all?.data || [];
          normalized = arr
            .map((it) => {
              const rawLat =
                it?.location?.coordinates?.latitude ??
                it?.location?.coordinates?.lat;
              const rawLng =
                it?.location?.coordinates?.longitude ??
                it?.location?.coordinates?.lng;
              const lat = typeof rawLat === "string" ? Number(rawLat) : rawLat;
              const lng = typeof rawLng === "string" ? Number(rawLng) : rawLng;
              return {
                id: it._id,
                title: it.title,
                locationText: it?.location?.address || "",
                lat,
                lng,
                status: it.status,
                category: it.category,
                severity: it.urgency || "medium",
              };
            })
            .filter((it) => Number.isFinite(it.lat) && Number.isFinite(it.lng));
        }

        setIssues(normalized);
      } catch (e) {
        if (!isCancelled) setError(e?.message || "Failed to load issues");
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };
    fetchIssues();
    return () => {
      isCancelled = true;
    };
  }, []);

  const categories = [
    "All",
    "Potholes",
    "Street Lights",
    "Garbage Collection",
    "Water Supply",
    "Drainage",
    "Public Property Damage",
    "Other",
  ];
  // Status filter removed

  // Map UI value to server enum for category (Title Case)
  const toServerCategory = (uiValue) => {
    if (!uiValue || uiValue.toLowerCase() === "all") return undefined;
    return uiValue
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  };

  // Status filter removed

  // Refetch when category changes (server-side filter to reduce payload)
  useEffect(() => {
    let isCancelled = false;
    const fetchIssues = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await issueService.getIssueLocations({
          limit: 1000,
          category: toServerCategory(selectedCategory),
        });
        if (isCancelled) return;
        const normalized = (Array.isArray(data) ? data : data?.data || [])
          .map((it) => {
            const rawLat =
              it?.location?.coordinates?.latitude ??
              it?.location?.coordinates?.lat;
            const rawLng =
              it?.location?.coordinates?.longitude ??
              it?.location?.coordinates?.lng;
            const lat = typeof rawLat === "string" ? Number(rawLat) : rawLat;
            const lng = typeof rawLng === "string" ? Number(rawLng) : rawLng;
            return {
              id: it._id,
              title: it.title,
              locationText: it?.location?.address || "",
              lat,
              lng,
              status: it.status,
              category: it.category,
              severity: it.urgency || "medium",
            };
          })
          .filter((it) => Number.isFinite(it.lat) && Number.isFinite(it.lng));
        setIssues(normalized);
      } catch (e) {
        if (!isCancelled) setError(e?.message || "Failed to load issues");
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };
    fetchIssues();
    return () => {
      isCancelled = true;
    };
  }, [selectedCategory]);

  // Filter issues
  const filteredIssues = issues.filter((issue) => {
    const matchesCategory =
      selectedCategory === "all" ||
      String(issue.category).toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      String(issue.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(issue.locationText)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const hasCoords = Number.isFinite(issue.lat) && Number.isFinite(issue.lng);
    return matchesCategory && matchesSearch && hasCoords;
  });

  useEffect(() => {
    let isCancelled = false;
    loadGoogleMaps()
      .then((maps) => {
        if (isCancelled) return;
        const center = { lat: 28.6139, lng: 77.209 };
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new maps.Map(mapRef.current, {
            center,
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });
        }

        // Clear old markers
        markersRef.current.forEach((m) => m.setMap && m.setMap(null));
        markersRef.current = [];

        // Fit bounds to filtered issues
        const bounds = new maps.LatLngBounds();
        filteredIssues.forEach((issue) => {
          const position = { lat: issue.lat, lng: issue.lng };
          const color = getColorByStatus(issue.status);
          const icon = {
            url: createMarkerSvgDataUrl(color),
            scaledSize: new maps.Size(28, 28),
            anchor: new maps.Point(14, 14),
          };
          const marker = new maps.Marker({
            position,
            map: mapInstanceRef.current,
            title: issue.title,
            icon,
          });
          const info = new maps.InfoWindow({
            content: `<div style="font-family: Inter, Arial; max-width:220px">
                        <div style=\"font-weight:600; color:#111827; margin-bottom:4px\">${
                          issue.title
                        }</div>
                        <div style=\"font-size:12px; color:#4b5563; margin-bottom:6px\">${
                          issue.locationText
                        }</div>
                        <div style="font-size:12px; color:#6b7280">Status: ${issue.status.replace(
                          "-",
                          " "
                        )}</div>
                      </div>`,
          });
          marker.addListener("click", () => {
            info.open({ anchor: marker, map: mapInstanceRef.current });
          });
          markersRef.current.push(marker);
          bounds.extend(position);
        });
        if (!bounds.isEmpty()) {
          mapInstanceRef.current.fitBounds(bounds);
        }
      })
      .catch(() => {});
    return () => {
      isCancelled = true;
    };
  }, [selectedCategory, searchQuery, issues]);

  return (
    <div className="map-page">
      <div className="map-container">
        {/* Page Title */}
        <div className="mb-4 md:mb-6">
          <h1 className="page-title">Issue Map</h1>
          <p className="page-subtitle">
            View all reported civic issues on the map
          </p>
        </div>

        {/* Filters and Search */}
        <div className="filters-card">
          <div className="filters-grid">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search issues or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <FiSearch className="search-icon" size={20} />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="select-input"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            {/* <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                style={{ padding: '12px 16px' }}
              >
                {statuses.map(status => (
                  <option key={status} value={status.toLowerCase()}>{status}</option>
                ))}
              </select>
            </div> */}
          </div>
        </div>

        <div className="content-grid">
          {/* Map Container */}
          <div>
            <div className="card">
              {/* Map Header */}
              <div className="card-header">
                <h2 className="card-title">Map View</h2>
              </div>

              {/* Google Map */}
              <div ref={mapRef} className="map-canvas" />

              {/* Map Legend */}
              <div className="legend">
                <div className="legend-items">
                  <div className="legend-item">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="legend-text">Pending</span>
                  </div>
                  <div className="legend-item">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="legend-text">In Progress</span>
                  </div>
                  <div className="legend-item">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="legend-text">Resolved</span>
                  </div>
                </div>
                <span className="legend-count">
                  Showing {filteredIssues.length} issue
                  {filteredIssues.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Issues List Sidebar */}
          <div>
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Issues List</h2>
                <p className="text-sm text-gray-500">
                  {filteredIssues.length} total
                </p>
              </div>

              <div className="list-scroll">
                {filteredIssues.length === 0 ? (
                  <div className="text-center" style={{ padding: "32px 24px" }}>
                    <p className="text-gray-500">
                      No issues found matching your filters
                    </p>
                  </div>
                ) : (
                  filteredIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="list-item hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className="flex items-start justify-between gap-2"
                        style={{ marginBottom: "8px" }}
                      >
                        <h3 className="list-title flex-1">{issue.title}</h3>
                        <span
                          className={`status-badge ${
                            issue.status === "resolved"
                              ? "bg-green-50 text-green-700"
                              : issue.status === "in-progress"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {issue.status === "resolved" ? (
                            <MdCheckCircle
                              size={10}
                              className="md:w-3 md:h-3"
                            />
                          ) : (
                            <MdPendingActions
                              size={10}
                              className="md:w-3 md:h-3"
                            />
                          )}
                          <span className="hidden sm:inline">
                            {issue.status.replace("-", " ")}
                          </span>
                        </span>
                      </div>
                      <div className="list-meta">
                        <FiMapPin size={12} className="flex-shrink-0" />
                        <span className="truncate">{issue.locationText}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="list-coords truncate">
                          {issue.lat.toFixed(4)}, {issue.lng.toFixed(4)}
                        </span>
                        <span
                          className={`text-xs font-medium flex-shrink-0 ${
                            issue.severity === "critical"
                              ? "text-red-600"
                              : issue.severity === "high"
                              ? "text-orange-600"
                              : issue.severity === "medium"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {issue.severity}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
