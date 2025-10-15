import { useState } from "react";
import { FiUsers, FiAlertCircle, FiCheckCircle, FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "../style/AdminDashboard.module.css";

export default function AdminDashboard() {
  const [reports, _setReports] = useState(() => {
    try {
      const raw = localStorage.getItem("citycare_reports");
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore parse errors and fallback to sample data
    }
    return [
      {
        id: 1,
        title: "Pothole on MG Road",
        category: "Potholes",
        location: "MG Road",
        status: "pending",
        date: "2025-10-12",
        description:
          "Large pothole forming near the center of the road causing vehicles to swerve.",
        images: [
          "https://imgs.search.brave.com/6NBxsBN3h08NEwB9wpIjnepZs54_gYZ6gx9PWFohV-A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9i/bGFjay1iYWdzLXRy/YXNoLWdhcmJhZ2Ut/YmluLWRheXRpbWVf/MTgxNjI0LTEzMTUy/LmpwZz9zZW10PWFp/c19oeWJyaWQmdz03/NDAmcT04MA",
          "https://via.placeholder.com/800x450.png?text=Pothole+2",
        ],
        videos: [],
        coords: { lat: 28.6139, lon: 77.209 },
      },
      {
        id: 2,
        title: "Broken Street Light",
        category: "Street Lights",
        location: "Park Street",
        status: "in-progress",
        date: "2025-10-11",
        description: "Street light flickers at night, leaving the area dark.",
        images: [
          "https://imgs.search.brave.com/6NBxsBN3h08NEwB9wpIjnepZs54_gYZ6gx9PWFohV-A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9i/bGFjay1iYWdzLXRy/YXNoLWdhcmJhZ2Ut/YmluLWRheXRpbWVf/MTgxNjI0LTEzMTUy/LmpwZz9zZW10PWFp/c19oeWJyaWQmdz03/NDAmcT04MA",
        ],
        videos: [],
        coords: { lat: 28.6145, lon: 77.2085 },
      },
      {
        id: 3,
        title: "Overflowing Garbage Bin",
        category: "Garbage Collection",
        location: "Market Area",
        status: "resolved",
        date: "2025-10-10",
        description:
          "Garbage bin not emptied for days, causing unpleasant smell.",
        images: [
          "https://imgs.search.brave.com/6NBxsBN3h08NEwB9wpIjnepZs54_gYZ6gx9PWFohV-A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9i/bGFjay1iYWdzLXRy/YXNoLWdhcmJhZ2Ut/YmluLWRheXRpbWVf/MTgxNjI0LTEzMTUy/LmpwZz9zZW10PWFp/c19oeWJyaWQmdz03/NDAmcT04MA",
        ],
        videos: [],
        coords: null,
      },
    ];
  });

  // derive categories from reports
  const derivedCategories = Array.from(
    new Set(reports.map((r) => r.category).filter(Boolean))
  );
  const [checkedCategories, setCheckedCategories] = useState(() => {
    const map = {};
    derivedCategories.forEach((c) => (map[c] = true));
    return map;
  });

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
    .filter((r) => !!checkedCategories[r.category])
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              Overview of city reports and quick actions
            </p>
          </div>
          <div>
            {/* Category filters and export buttons */}
            <div className="flex gap-3 items-center">
              {derivedCategories.map((cat) => (
                <label key={cat} className="flex items-center gap-2 text-sm">
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
              <p className="text-xl font-bold text-gray-800">12,342</p>
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
              <p className="text-xl font-bold text-yellow-600">45</p>
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
              <p className="text-xl font-bold text-blue-600">18</p>
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
              <p className="text-xl font-bold text-green-600">312</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className={styles.tablePadding + " border-b border-gray-100"}>
            <h3 className="font-semibold text-gray-800">Recent Reports</h3>
          </div>
          <div className={styles.tablePadding}>
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className={styles.cellY}>Title</th>
                  <th className={styles.cellY}>Location</th>
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
                    <td className={styles.cellY + " font-medium text-gray-700"}>
                      <div className="flex items-center gap-3">
                        <div>
                          <Link
                            to={`/admin/report/${r.id}`}
                            state={{ report: r }}
                            className="text-blue-600 hover:underline"
                          >
                            {r.title}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className={styles.cellY + " text-gray-600"}>
                      {r.location}
                    </td>
                    <td className={styles.cellY + " text-gray-600"}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ marginRight: 12 }}>{r.date}</div>
                        <Link
                          to={`/admin/report/${r.id}`}
                          state={{ report: r }}
                          className="text-sm text-blue-600 hover:underline view"
                          style={{
                            marginLeft: "auto",
                            textDecoration: "underline",
                            color: "#2563eb",
                            fontSize: 12,
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
          </div>
        </div>
      </div>
    </div>
  );
}
