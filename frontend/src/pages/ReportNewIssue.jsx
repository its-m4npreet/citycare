import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiCamera,
  FiMapPin,
  FiAlertCircle,
  FiSend,
  FiMapPin as FiMapPinAlias,
  FiVideo,
  FiFolder,
  FiInfo,
  FiX,
} from "react-icons/fi";
import { issueService } from "../services/issueService";
import { useUser } from "../hooks/useUser";

export default function ReportNewIssue() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clerkUser: user, dbUser, loading: userLoading } = useUser();
  const updateReport = location.state?.updateReport;
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    coordinates: null,
    urgency: "medium",
    images: [],
    videos: [],
  });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const loadGoogleMaps = () => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
        return;
      }
      const existing = document.querySelector('script[data-google-maps]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.google.maps));
        existing.addEventListener('error', reject);
        return;
      }
      if (!GOOGLE_MAPS_API_KEY) {
        reject(new Error('Missing Google Maps API key'));
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.setAttribute('data-google-maps', 'true');
      script.onload = () => resolve(window.google.maps);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    let isCancelled = false;
    loadGoogleMaps()
      .then((maps) => {
        if (isCancelled || !mapRef.current) return;
        const defaultCenter = { lat: 28.6139, lng: 77.2090 };
        const startCenter = formData.coordinates
          ? { lat: Number(formData.coordinates.lat), lng: Number(formData.coordinates.lng) }
          : defaultCenter;
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new maps.Map(mapRef.current, {
            center: startCenter,
            zoom: formData.coordinates ? 16 : 12,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });
        }
        // place existing marker
        if (formData.coordinates && Number.isFinite(Number(formData.coordinates.lat)) && Number.isFinite(Number(formData.coordinates.lng))) {
          markerRef.current = new maps.Marker({
            position: startCenter,
            map: mapInstanceRef.current,
          });
        }
        // click to select
        mapInstanceRef.current.addListener('click', async (e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          if (markerRef.current) markerRef.current.setMap(null);
          markerRef.current = new maps.Marker({ position: { lat, lng }, map: mapInstanceRef.current });
          // try reverse geocode
          try {
            const geocoder = new maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              const address = status === 'OK' && results && results[0] ? results[0].formatted_address : `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
              setFormData((prev) => ({ ...prev, coordinates: { lat, lng }, location: address }));
            });
          } catch (err) {
            setFormData((prev) => ({ ...prev, coordinates: { lat, lng }, location: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}` }));
            console.error('Geocode error:', err);
          }
        });
      })
      .catch(() => {});
    return () => { isCancelled = true; };
  }, [GOOGLE_MAPS_API_KEY]);

  // Pre-fill form if updating an existing report, otherwise reset to empty
  useEffect(() => {
    if (updateReport) {
      setFormData({
        title: updateReport.title,
        category: updateReport.category,
        description: updateReport.description,
        location: updateReport.location,
        coordinates: null,
        urgency: updateReport.urgency,
        images: updateReport.images || [],
        videos: updateReport.videos || [],
      });
    } else {
      // Reset form to empty when no update report
      setFormData({
        title: "",
        category: "",
        description: "",
        location: "",
        coordinates: null,
        urgency: "medium",
        images: [],
        videos: [],
      });
    }
  }, [updateReport]);

  // Clear location state after form is loaded to prevent data persistence
  useEffect(() => {
    if (location.state?.updateReport) {
      // Clear the state after a brief moment to allow form to populate
      const timer = setTimeout(() => {
        window.history.replaceState({}, document.title);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const categories = [
    "Potholes",
    "Street Lights",
    "Garbage Collection",
    "Water Supply",
    "Drainage",
    "Public Property Damage",
    "Other",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please sign in to report an issue');
      return;
    }

    if (userLoading) {
      alert('Please wait while we sync your account...');
      return;
    }

    if (!dbUser) {
      const retry = window.confirm(
        'Unable to sync your account with the database.\n\n' +
        'This could be because:\n' +
        '- Backend server is not running\n' +
        '- Network connection issue\n' +
        '- Database connection problem\n\n' +
        'Click OK to reload the page and try again, or Cancel to continue anyway.'
      );
      
      if (retry) {
        window.location.reload();
        return;
      }
      
      // If user chooses to continue, log a warning but allow submission
      console.warn('⚠️ Proceeding without database user sync');
    }

    setSubmitting(true);

    try {
      // Prepare issue data
      const issueData = {
        clerkId: user.id,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        urgency: formData.urgency,
        coordinates: formData.coordinates,
      };

      console.log('📝 Submitting issue data:', issueData);

      // Prepare files
      const files = {};
      if (formData.images.length > 0) {
        files.image = formData.images[0].file;
        console.log('📸 Image file:', files.image.name);
      }
      if (formData.videos.length > 0) {
        files.video = formData.videos[0].file;
        console.log('🎥 Video file:', files.video.name);
      }

      // Submit to backend
      console.log('🚀 Sending request to backend...');
      const response = await issueService.createIssue(issueData, files);
      console.log('✅ Backend response:', response);
      
      console.log('Issue created successfully:', response);
      
      // Show success message with Issue ID
      const issueId = response._id || response.id || 'Unknown';
      alert(
        updateReport 
          ? `Report updated successfully!\nIssue ID: ${issueId}` 
          : `Issue reported successfully!\nIssue ID: ${issueId}\n\nYou can view it in My Reports page.`
      );
      navigate('/my-reports');
    } catch (error) {
      console.error('Error submitting issue:', error);
      alert(`Error: ${error.message || 'Failed to submit issue. Please try again.'}`);
    } finally {
      setSubmitting(false);
    }
    
    // Fallback: Also persist to localStorage for offline access
    try {
      const existingRaw = localStorage.getItem("citycare_reports") || "[]";
      const existing = JSON.parse(existingRaw);
      const id = Date.now();
      const reportToSave = {
        id,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        coords: formData.coordinates,
        urgency: formData.urgency,
        images: formData.images.map((f) => f.url || ''),
        videos: formData.videos.map((f) => f.url || ''),
        date: new Date().toISOString().slice(0, 10),
        status: "pending",
      };
      existing.unshift(reportToSave);
      localStorage.setItem("citycare_reports", JSON.stringify(existing));
      alert(
        updateReport
          ? "Report updated successfully!"
          : "Issue reported successfully!"
      );
      navigate("/my-reports");
    } catch (err) {
      console.error("failed to save report", err);
      alert("Failed to save report locally. See console for details.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Store coordinates
        setFormData((prev) => ({
          ...prev,
          coordinates: { lat: latitude, lng: longitude },
        }));

        // Try to get address from coordinates using Google Maps Geocoding API
        try {
          const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

          if (apiKey && apiKey !== "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
            );
            const data = await response.json();

            if (data.status === "OK" && data.results[0]) {
              setFormData((prev) => ({
                ...prev,
                location: data.results[0].formatted_address,
              }));
            } else {
              // Fallback to coordinates if geocoding fails
              setFormData((prev) => ({
                ...prev,
                location: `Lat: ${latitude.toFixed(
                  6
                )}, Lng: ${longitude.toFixed(6)}`,
              }));
            }
          } else {
            // If no API key, just show coordinates
            setFormData((prev) => ({
              ...prev,
              location: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(
                6
              )}`,
            }));
          }
        } catch (error) {
          console.error("Error getting address:", error);
          // Fallback to coordinates
          setFormData((prev) => ({
            ...prev,
            location: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(
              6
            )}`,
          }));
        }

        setLoadingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please enter it manually.");
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen" style={{ padding: "40px" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            className="text-3xl font-bold text-gray-800"
            style={{ marginBottom: "8px" }}
          >
            {updateReport ? "Update Report" : "Report New Issue"}
          </h1>
          <p className="text-gray-600">
            {updateReport
              ? "Update your existing civic issue report"
              : "Help improve your community by reporting civic problems"}
          </p>
        </div>

        {/* Form Card */}
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-100"
          style={{ padding: "32px" }}
        >
          <form onSubmit={handleSubmit}>
            {/* Issue Title */}
            <div style={{ marginBottom: "24px" }}>
              <label
                className="block text-sm font-semibold text-gray-700"
                style={{ marginBottom: "8px" }}
              >
                Issue Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief description of the issue"
                required
                className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                style={{ padding: "12px 16px" }}
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: "24px" }}>
              <label
                className="block text-sm font-semibold text-gray-700"
                style={{ marginBottom: "8px" }}
              >
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                style={{ padding: "12px 16px" }}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "24px" }}>
              <label
                className="block text-sm font-semibold text-gray-700"
                style={{ marginBottom: "8px" }}
              >
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed information about the issue"
                required
                rows={5}
                className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                style={{ padding: "12px 16px" }}
              />
            </div>

            {/* Location */}
            <div style={{ marginBottom: "24px" }}>
              <label
                className="block text-sm font-semibold text-gray-700"
                style={{ marginBottom: "8px" }}
              >
                Location *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location or use current location"
                  required
                  className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  style={{ padding: "12px 16px 12px 44px" }}
                />
                <FiMapPin
                  className="absolute text-gray-400"
                  style={{ left: "16px", top: "16px" }}
                  size={20}
                />
              </div>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={loadingLocation}
                className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                  loadingLocation
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-green-600 hover:text-green-700"
                }`}
                style={{ marginTop: "8px" }}
              >
                {loadingLocation ? (
                  "Getting location..."
                ) : (
                  <>
                    <FiMapPinAlias size={14} /> Use my current location
                  </>
                )}
              </button>
              {formData.coordinates && (
                <p
                  className="text-xs text-gray-500"
                  style={{ marginTop: "4px" }}
                >
                  Coordinates: {formData.coordinates.lat.toFixed(6)},{" "}
                  {formData.coordinates.lng.toFixed(6)}
                </p>
              )}
              {/* Inline Map Picker */}
              <div style={{ marginTop: "12px" }}>
                <div
                  ref={mapRef}
                  style={{ width: "100%", height: "300px", borderRadius: "8px" }}
                  className="border border-gray-200"
                />
                <p className="text-xs text-gray-500" style={{ marginTop: "6px" }}>
                  Click on the map to set the exact location.
                </p>
              </div>
            </div>

            {/* Urgency Level */}
            <div className="mb-4 sm:mb-6">
              <label
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Urgency Level
              </label>
              <div className="flex flex-wrap gap-3 sm:gap-4" 
              style={{margin:"10px"}}>
                {["low", "medium", "high", "critical"].map((level) => (
                  <label
                    key={level}
                    className="flex items-center cursor-pointer gap-2"
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={level}
                      checked={formData.urgency === level}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <span
                      className={`capitalize text-xs sm:text-sm font-medium ${
                        level === "critical"
                          ? "text-red-600"
                          : level === "high"
                          ? "text-orange-600"
                          : level === "medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Photo and Video Upload */}
            <div style={{ marginBottom: "32px" }}>
              <label
                className="block text-sm font-semibold text-gray-700"
                style={{ marginBottom: "8px" }}
              >
                Upload Media (Optional)
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-green-500 transition-colors"
                style={{ padding: "48px 32px" }}
              >
                <div
                  className="flex justify-center items-center"
                  style={{ gap: "12px", marginBottom: "12px" }}
                >
                  <FiCamera className="text-gray-400" size={36} />
                  <FiVideo className="text-gray-400" size={36} />
                </div>
                <p
                  className="text-sm text-gray-600"
                  style={{ marginBottom: "8px" }}
                >
                  Upload photos and/or videos
                </p>
                <p
                  className="text-xs text-gray-500"
                  style={{ marginBottom: "16px" }}
                >
                  Images: PNG, JPG (max 10MB) | Videos: MP4, MOV, AVI (max 50MB)
                </p>

                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    files.forEach((file) => {
                      const isImage = file.type.startsWith("image/");
                      const isVideo = file.type.startsWith("video/");

                      if (isImage) {
                        if (file.size > 10 * 1024 * 1024) {
                          alert(
                            `Image ${file.name} is too large. Maximum size is 10MB`
                          );
                          return;
                        }
                        const url = URL.createObjectURL(file);
                        setFormData((prev) => ({
                          ...prev,
                          images: [
                            ...prev.images,
                            { name: file.name, url, size: file.size, file },
                          ],
                        }));
                      } else if (isVideo) {
                        if (file.size > 50 * 1024 * 1024) {
                          alert(
                            `Video ${file.name} is too large. Maximum size is 50MB`
                          );
                          return;
                        }
                        const url = URL.createObjectURL(file);
                        setFormData((prev) => ({
                          ...prev,
                          videos: [
                            ...prev.videos,
                            { name: file.name, url, size: file.size, file },
                          ],
                        }));
                      }
                    });
                    // reset input so the same file can be reselected later
                    e.target.value = null;
                  }}
                  className="hidden"
                  id="media-upload"
                />
                <label
                  htmlFor="media-upload"
                  className="bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition-colors font-semibold text-sm inline-flex items-center gap-2 mx-auto"
                  style={{ padding: "8px 16px", maxWidth: "220px" }}
                >
                  <FiFolder />
                  <span className="truncate">Choose Files</span>
                </label>

                {/* Display selected files */}
                {(formData.images.length > 0 || formData.videos.length > 0) && (
                  <div
                    style={{
                      marginTop: "16px",
                      gap: "12px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Display Images */}
                    {formData.images.map((img, index) => (
                      <div
                        key={`image-${index}`}
                        className="text-sm text-green-700 font-medium"
                        style={{
                          padding: "12px",
                          backgroundColor: "#f0fdf4",
                          borderRadius: "8px",
                          border: "1px solid #bbf7d0",
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="flex items-center"
                            style={{ gap: "8px" }}
                          >
                            <FiCamera size={16} />
                            Photo: {img.name} ({(img.size / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              URL.revokeObjectURL(img.url);
                              setFormData((prev) => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== index),
                              }));
                            }}
                            className="text-red-500 hover:text-red-700 font-bold"
                            style={{ fontSize: "18px" }}
                          >
                            <FiX />
                          </button>
                        </div>
                        {/* Image Preview */}
                        <img
                          src={img.url}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: "100%",
                            maxHeight: "200px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            border: "1px solid #bbf7d0",
                          }}
                        />
                      </div>
                    ))}

                    {/* Display Videos */}
                    {formData.videos.map((vid, index) => (
                      <div
                        key={`video-${index}`}
                        className="text-sm text-blue-700 font-medium"
                        style={{
                          padding: "12px",
                          backgroundColor: "#eff6ff",
                          borderRadius: "8px",
                          border: "1px solid #bfdbfe",
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="flex items-center"
                            style={{ gap: "8px" }}
                          >
                            <FiVideo size={16} />
                            Video: {vid.name} ({(vid.size / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              URL.revokeObjectURL(vid.url);
                              setFormData((prev) => ({
                                ...prev,
                                videos: prev.videos.filter((_, i) => i !== index),
                              }));
                            }}
                            className="text-red-500 hover:text-red-700 font-bold"
                            style={{ fontSize: "18px" }}
                          >
                            <FiX />
                          </button>
                        </div>
                        {/* Video Preview */}
                        <video
                          controls
                          style={{
                            width: "100%",
                            maxHeight: "200px",
                            borderRadius: "6px",
                            border: "1px solid #bfdbfe",
                          }}
                        >
                          <source src={vid.url} type={vid.file?.type} />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex" style={{ gap: "16px", paddingTop: "16px" }}>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                style={{ padding: "14px 24px", gap: "8px" }}
              >
                <FiSend size={20} />
                {submitting ? "Submitting..." : (updateReport ? "Update Report" : "Submit Report")}
              </button>
              <button
                type="button"
                onClick={() => navigate(updateReport ? "/my-reports" : "/")}
                className="border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                style={{ padding: "14px 32px" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div
          className="bg-blue-50 border border-blue-200 rounded-lg"
          style={{ marginTop: "24px", padding: "20px" }}
        >
          <div className="flex" style={{ gap: "16px" }}>
            <FiInfo className="text-2xl text-blue-600" />
            <div>
              <h3
                className="font-semibold text-blue-900"
                style={{ marginBottom: "4px" }}
              >
                What happens next?
              </h3>
              <p className="text-sm text-blue-700">
                Your report will be reviewed by authorities within 24-48 hours.
                You'll receive updates via notifications and can track the
                status in "My Reports".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
