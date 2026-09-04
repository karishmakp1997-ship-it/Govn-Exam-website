import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const TEST_TYPES = [
  { type: "topic", icon: "📖", title: "Topic Test", desc: "10-15 questions, focus on specific concepts.", from: "#7c3aed", to: "#4c1d95", bg: "#f5f3ff" },
  { type: "subject", icon: "📄", title: "Subject Test", desc: "30-40 questions, full subject coverage.", from: "#2563eb", to: "#1e3a8a", bg: "#eff6ff" },
  { type: "sectional", icon: "◐", title: "Sectional Test", desc: "Mimics one exam section perfectly.", from: "#f97316", to: "#c2410c", bg: "#fff7ed" },
  { type: "full_mock", icon: "⏱", title: "Full Mock Test", desc: "Complete exam simulation, timed.", from: "#16a34a", to: "#166534", bg: "#f0fdf4" },
];

const FEATURES = [
  { icon: "⊖", title: "Negative Marking", desc: "Realistic scoring logic applied.", color: "#dc2626", bg: "#fef2f2" },
  { icon: "◷", title: "Section-wise Timer", desc: "Manage your time effectively.", color: "#2563eb", bg: "#eff6ff" },
  { icon: "🚩", title: "Mark for Review", desc: "Revisit tough questions later.", color: "#7c3aed", bg: "#f5f3ff" },
  { icon: "✓", title: "Auto-Submit", desc: "Secure test completion when time ends.", color: "#16a34a", bg: "#f0fdf4" },
];

function MockTestLanding() {
  const [testsByType, setTestsByType] = useState({});
  const [recentAttempts, setRecentAttempts] = useState([]);

  useEffect(() => {
    Promise.all(
      TEST_TYPES.map((t) =>
        fetch(`${API_BASE_URL}/api/mock-tests/?test_type=${t.type}`)
          .then((res) => res.json())
          .then((data) => ({ type: t.type, tests: data }))
          .catch(() => ({ type: t.type, tests: [] }))
      )
    ).then((results) => {
      const map = {};
      results.forEach((r) => { map[r.type] = r.tests; });
      setTestsByType(map);
    });

    fetch(`${API_BASE_URL}/api/mock-tests/attempts/`, { headers: getAuthHeaders() })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setRecentAttempts(data))
      .catch(() => setRecentAttempts([]));
  }, []);

  return (
    <section className="mocktest-section">
      <style>{`
        .mocktest-section {
          position: relative;
          padding: 56px 0 80px;
          background:
            radial-gradient(circle at 8% 8%, rgba(124, 58, 237, 0.06), transparent 28%),
            radial-gradient(circle at 92% 78%, rgba(37, 99, 235, 0.05), transparent 30%),
            #f8fafc;
        }

        .mt-wrap {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .mt-header {
          margin-bottom: 28px;
        }

        .mt-eyebrow {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.1);
          color: #2563eb;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .mt-header h2 {
          margin: 0 0 8px;
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.8px;
        }

        .mt-header p {
          margin: 0;
          color: #64748b;
          font-size: 14.5px;
        }

        /* Recommended banner */

        .mt-recommend {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          padding: 22px 26px;
          border-radius: 20px;
          margin-bottom: 28px;
          background: linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%);
          border: 1px solid rgba(124, 58, 237, 0.15);
        }

        .mt-recommend-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .mt-recommend-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #7c3aed, #2563eb);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #fff;
          flex: 0 0 48px;
          box-shadow: 0 8px 20px -6px rgba(124, 58, 237, 0.4);
        }

        .mt-recommend-tag {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: #7c3aed;
          text-transform: uppercase;
          margin-bottom: 3px;
        }

        .mt-recommend-text {
          font-size: 14px;
          color: #1e1b4b;
          font-weight: 600;
        }

        .mt-btn-primary {
          padding: 12px 26px;
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: #fff;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          box-shadow: 0 10px 22px -8px rgba(124, 58, 237, 0.45);
          transition: transform 0.2s ease;
        }

        .mt-btn-primary:hover {
          transform: translateY(-2px);
        }

        .mt-btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        /* Test type cards */

        .mt-type-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 18px;
          margin-bottom: 36px;
        }

        .mt-type-card {
          position: relative;
          overflow: hidden;
          border-radius: 18px;
          padding: 22px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          box-shadow: 0 6px 20px rgba(15, 23, 42, 0.05);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .mt-type-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 32px rgba(15, 23, 42, 0.1);
        }

        .mt-type-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
          color: #fff;
          margin-bottom: 14px;
          box-shadow: 0 6px 14px rgba(0,0,0,0.12);
        }

        .mt-type-card h3 {
          margin: 0 0 4px;
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
        }

        .mt-type-card p {
          margin: 0 0 18px;
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.5;
        }

        .mt-type-btn {
          display: block;
          width: 100%;
          text-align: center;
          padding: 11px;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s ease;
        }

        .mt-type-btn:hover {
          transform: translateY(-2px);
        }

        .mt-type-btn.disabled {
          background: #e2e8f0 !important;
          color: #94a3b8;
          cursor: not-allowed;
        }

        .mt-type-btn.disabled:hover {
          transform: none;
        }

        /* Bottom grid */

        .mt-bottom-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          align-items: start;
        }

        .mt-panel {
          background: #ffffff;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 18px;
          padding: 22px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
        }

        .mt-panel h3 {
          margin: 0 0 16px;
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
        }

        .mt-empty-text {
          color: #94a3b8;
          font-size: 13px;
        }

        .mt-table-head {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          font-size: 11px;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 0 6px 10px;
        }

        .mt-table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          align-items: center;
          padding: 12px 6px;
          border-radius: 10px;
          font-size: 13px;
          transition: background 0.2s ease;
        }

        .mt-table-row:hover {
          background: #f8fafc;
        }

        .mt-tag {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #475569;
          font-size: 11.5px;
          font-weight: 700;
          width: fit-content;
        }

        .mt-feature-row {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .mt-feature-row:last-child {
          border-bottom: none;
        }

        .mt-feature-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          flex: 0 0 34px;
        }

        .mt-feature-title {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 2px;
        }

        .mt-feature-desc {
          font-size: 12px;
          color: #94a3b8;
          margin: 0;
        }

        @media (max-width: 820px) {
          .mt-bottom-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="mt-wrap">
        <div className="mt-header">
          <span className="mt-eyebrow">Practice</span>
          <h2>Mock Tests</h2>
          <p>Practice like it's exam day — timed, scored, and analyzed instantly.</p>
        </div>

        <div className="mt-recommend">
          <div className="mt-recommend-left">
            <div className="mt-recommend-icon">✦</div>
            <div>
              <p className="mt-recommend-tag">Recommended for you</p>
              <p className="mt-recommend-text">Based on your recent activity — try a Topic Test to sharpen weak areas.</p>
            </div>
          </div>
          {testsByType.topic?.[0] ? (
            <Link to={`/mock-tests/${testsByType.topic[0].id}`} className="mt-btn-primary">Start Now</Link>
          ) : (
            <button className="mt-btn-primary" disabled>Start Now</button>
          )}
        </div>

        <div className="mt-type-grid">
          {TEST_TYPES.map((t) => {
            const firstTest = testsByType[t.type]?.[0];
            return (
              <div className="mt-type-card" key={t.type} style={{ background: t.bg }}>
                <div className="mt-type-icon" style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}>
                  {t.icon}
                </div>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
                {firstTest ? (
                  <Link
                    to={`/mock-tests/${firstTest.id}`}
                    className="mt-type-btn"
                    style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
                  >
                    Start
                  </Link>
                ) : (
                  <button className="mt-type-btn disabled" disabled>Coming soon</button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-bottom-grid">
          <div className="mt-panel">
            <h3>Recent Mock Tests</h3>
            {recentAttempts.length === 0 ? (
              <p className="mt-empty-text">No attempts yet — take a test to see your history here.</p>
            ) : (
              <div>
                <div className="mt-table-head">
                  <span>Name</span><span>Date</span><span>Score</span><span>Accuracy</span>
                </div>
                {recentAttempts.map((a) => (
                  <div key={a.id} className="mt-table-row">
                    <span>{a.test_series_title}</span>
                    <span className="mt-tag">{new Date(a.submitted_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    <span className="mt-tag">{a.score}</span>
                    <span
                      className="mt-tag"
                      style={
                        a.accuracy >= 60
                          ? { background: "#dcfce7", color: "#16a34a" }
                          : { background: "#fef3c7", color: "#d97706" }
                      }
                    >
                      {a.accuracy}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-panel">
            <h3>Engine Features</h3>
            <div>
              {FEATURES.map((f) => (
                <div className="mt-feature-row" key={f.title}>
                  <div className="mt-feature-icon" style={{ background: f.bg, color: f.color }}>{f.icon}</div>
                  <div>
                    <p className="mt-feature-title">{f.title}</p>
                    <p className="mt-feature-desc">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MockTestLanding;