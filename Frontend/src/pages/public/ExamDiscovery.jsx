import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useScrollReveal } from "../../hooks/useScrollReveal";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const STATUS_META = {
  upcoming: { label: "Upcoming", badge: "upcoming" },
  notification_released: { label: "Notification Released", badge: "released" },
  application_open: { label: "Application Open", badge: "open" },
  application_closed: { label: "Application Closed", badge: "closed" },
  exam_scheduled: { label: "Exam Scheduled", badge: "scheduled" },
  result_released: { label: "Result Released", badge: "result" },
};

const STATUS_THEME = {
  result_released: {
    label: "Result Released",
    icon: "🏆",
    from: "#16a34a",
    to: "#166534",
    badgeBg: "#dcfce7",
    badgeText: "#16a34a",
    image: "/images/card1-green.png",
  },
  exam_scheduled: {
    label: "Exam Scheduled",
    icon: "📅",
    from: "#f97316",
    to: "#c2410c",
    badgeBg: "#fef3c7",
    badgeText: "#d97706",
    image: "/images/card2-orange.png",
  },
  application_open: {
    label: "Application Open",
    icon: "🚀",
    from: "#2563eb",
    to: "#1e3a8a",
    badgeBg: "#dbeafe",
    badgeText: "#2563eb",
    image: "/images/card3-blue.png",
  },
  upcoming: {
    label: "Upcoming",
    icon: "🕐",
    from: "#7c3aed",
    to: "#4c1d95",
    badgeBg: "#ede9fe",
    badgeText: "#7c3aed",
    image: "/images/card4-purple.png",
  },
  notification_released: {
    label: "Notification Released",
    icon: "📄",
    from: "#db2777",
    to: "#831843",
    badgeBg: "#fce7f3",
    badgeText: "#db2777",
    image: "/images/card5-pink.png",
  },
  application_closed: {
    label: "Application Closed",
    icon: "🔒",
    from: "#64748b",
    to: "#334155",
    badgeBg: "#f1f5f9",
    badgeText: "#64748b",
    image: null,
  },
};

// Maps the nav dropdown's broad categories to actual conducting_authority values in the DB.
// Adjust this as you add more exams/authorities.
const CATEGORY_MAP = {
  central: ["UPSC", "SSC", "Railways"],
  state: ["TNPSC"],
  banking: ["Banking"],
  defence: ["SSC"],
};

function formatDate(dateStr) {
  if (!dateStr) return "TBA";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ExamDiscovery() {
  useScrollReveal();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category"); // e.g. "central", "state", "banking", "defence"

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAuthority, setSelectedAuthority] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/exams/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load exams");
        return res.json();
      })
      .then((data) => {
        setExams(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Reset the manual authority/status pills whenever the nav category changes,
  // so the two filtering mechanisms don't conflict.
  useEffect(() => {
    setSelectedAuthority("All");
    setSelectedStatus("All");
  }, [categoryParam]);

  const authorities = useMemo(() => {
    const unique = [...new Set(exams.map((e) => e.conducting_authority).filter(Boolean))];
    return unique.sort();
  }, [exams]);

  const filteredExams = useMemo(() => {
    const categoryAuthorities = categoryParam ? CATEGORY_MAP[categoryParam] || [] : null;

    return exams
      .filter((e) => e.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((e) => selectedAuthority === "All" || e.conducting_authority === selectedAuthority)
      .filter((e) => selectedStatus === "All" || e.status === selectedStatus)
      .filter((e) => !categoryAuthorities || categoryAuthorities.includes(e.conducting_authority))
      .sort((a, b) => {
        if (!a.application_end_date) return 1;
        if (!b.application_end_date) return -1;
        return new Date(a.application_end_date) - new Date(b.application_end_date);
      });
  }, [exams, searchTerm, selectedAuthority, selectedStatus, categoryParam]);

  const categoryLabel = {
    central: "Central Govt. Exams",
    state: "State Govt. Exams",
    banking: "Banking & Insurance",
    defence: "Defence Exams",
  }[categoryParam];

  return (
    <section className="exam-discovery-section">
      <style>{`
        .exam-search-row {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .exam-search-input {
          width: 100%;
          max-width: 480px;
          padding: 12px 20px;
          border-radius: 999px;
          border: 1.5px solid #dbe2ea;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .exam-search-input:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
        }

        .status-filter-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
        }

        .status-pill {
          appearance: none;
          padding: 9px 18px;
          border: 1.5px solid #dbe2ea;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.75);
          color: #475569;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .status-pill:hover {
          transform: translateY(-2px);
          background: #ffffff;
          border-color: #b9c2cf;
        }

        .status-pill.active {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          border-color: transparent;
          color: #ffffff;
          box-shadow: 0 8px 18px -6px rgba(124, 58, 237, 0.4);
        }

        @media (max-width: 640px) {
          .status-filter-row {
            gap: 8px;
          }

          .status-pill {
            padding: 7px 14px;
            font-size: 12px;
          }
        }

        /* =====================================================
           CARD GRID — image banner top, content below
        ===================================================== */

        .ed-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 22px;
        }

        .ed-card {
          position: relative;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid rgba(148, 163, 184, 0.16);
          border-radius: 20px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .ed-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 36px rgba(15, 23, 42, 0.12);
        }

        .ed-card-banner {
          width: 100%;
          height: 150px;
          background-size: cover;
          background-position: top center;
          background-repeat: no-repeat;
        }

        .ed-card-banner.no-image {
          background: linear-gradient(135deg, #94a3b8, #475569);
        }

        .ed-card-body {
          padding: 18px 20px 20px;
        }

        .ed-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .ed-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 800;
        }

        .ed-vacancy {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }

        .ed-title {
          margin: 0 0 2px;
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.25;
        }

        .ed-authority {
          margin: 0 0 12px;
          font-size: 12.5px;
          color: #94a3b8;
          font-weight: 600;
        }

        .ed-meta-row {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          font-size: 12.5px;
          color: #334155;
          margin-bottom: 6px;
        }

        .ed-meta-row b {
          color: #0f172a;
        }

        .ed-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          margin-top: 16px;
          padding: 12px;
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .ed-btn:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 620px) {
          .ed-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="wrap">
        <div className="section-head center reveal">
          <div className="eyebrow">Explore Exams</div>
          <h2>{categoryLabel || "Find your next government exam"}</h2>
          <p>Verified, transparent, and always up to date.</p>
        </div>

        <div className="exam-search-row reveal">
          <input
            type="text"
            placeholder="Search exams by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="exam-search-input"
          />
        </div>

        <div className="status-filter-row reveal">
          <button
            type="button"
            className={selectedStatus === "All" ? "status-pill active" : "status-pill"}
            onClick={() => setSelectedStatus("All")}
          >
            All Statuses
          </button>
          {Object.entries(STATUS_META).map(([value, meta]) => (
            <button
              type="button"
              key={value}
              className={selectedStatus === value ? "status-pill active" : "status-pill"}
              onClick={() => setSelectedStatus(value)}
            >
              {meta.label}
            </button>
          ))}
        </div>

        {loading && <p className="section-head center">Loading exams...</p>}
        {error && <p className="section-head center" style={{ color: "#dc2626" }}>{error}</p>}
        {!loading && !error && filteredExams.length === 0 && (
          <p className="section-head center">No exams match your filters.</p>
        )}

        {!loading && !error && filteredExams.length > 0 && (
          <div className="ed-grid">
            {filteredExams.map((exam) => {
              const theme = STATUS_THEME[exam.status] || STATUS_THEME.upcoming;

              return (
                <div className="ed-card" key={exam.id}>
                  <div
                    className={theme.image ? "ed-card-banner" : "ed-card-banner no-image"}
                    style={theme.image ? { backgroundImage: `url(${theme.image})` } : {}}
                  ></div>

                  <div className="ed-card-body">
                    <div className="ed-card-top">
                      <span className="ed-badge" style={{ background: theme.badgeBg, color: theme.badgeText }}>
                        {theme.icon} {theme.label}
                      </span>
                      {exam.vacancy_count ? (
                        <span className="ed-vacancy">👥 {exam.vacancy_count} vacancies</span>
                      ) : null}
                    </div>

                    <h3 className="ed-title">{exam.name}</h3>
                    <p className="ed-authority">{exam.conducting_authority}</p>

                    {exam.qualification_required && (
                      <div className="ed-meta-row">
                        🎓 <span><b>Eligibility:</b> {exam.qualification_required}</span>
                      </div>
                    )}

                    <div className="ed-meta-row">
                      📅 <span>Apply by <b>{formatDate(exam.application_end_date)}</b> · Exam on <b>{formatDate(exam.exam_date)}</b></span>
                    </div>

                    <Link
                      to={`/exams/${exam.id}`}
                      className="ed-btn"
                      style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default ExamDiscovery;