import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getBarColor(accuracy) {
  if (accuracy >= 80) return "#16a34a";
  if (accuracy >= 60) return "#f59e0b";
  return "#dc2626";
}

function daysAgo(dateStr) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return "Today";
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

function Performance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/performance/summary/`, { headers: getAuthHeaders() })
      .then((res) => {
        if (res.status === 401) throw new Error("Please log in to view your performance.");
        if (!res.ok) throw new Error("Failed to load performance data");
        return res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const markRevisionDone = async (id) => {
    setData((prev) => ({
      ...prev,
      revision_suggestions: prev.revision_suggestions.filter((r) => r.id !== id),
    }));
    try {
      await fetch(`${API_BASE_URL}/api/performance/revisions/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ is_completed: true }),
      });
    } catch {
      // optimistic update already applied; ignore failure for now
    }
  };

  if (loading) return <div className="wrap" style={{ padding: "60px 32px" }}><p className="section-head center">Loading your performance...</p></div>;
  if (error) return <div className="wrap" style={{ padding: "60px 32px" }}><p className="section-head center" style={{ color: "#dc2626" }}>{error}</p></div>;

  if (data.overall_stats.tests_completed === 0) {
    return (
      <div className="wrap" style={{ padding: "60px 32px", textAlign: "center" }}>
        <h2 style={{ marginBottom: "10px" }}>No performance data yet</h2>
        <p className="meta">Complete a mock test to start tracking your progress here.</p>
      </div>
    );
  }

  const { overall_stats, accuracy_over_time, subject_mastery, ai_insight, revision_suggestions } = data;

  return (
    <section style={{ background: "#f8fafc", minHeight: "100vh", padding: "32px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "26px", fontWeight: 900, marginBottom: "6px" }}>Performance Analysis</h2>
          <p style={{ fontSize: "14px", color: "var(--ink-mute)" }}>Understand your strengths, close your gaps, prepare smarter.</p>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px", background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🎯</div>
            <div>
              <p style={{ fontSize: "11px", color: "var(--ink-mute)" }}>Score</p>
              <p style={{ fontSize: "19px", fontWeight: 800 }}>{overall_stats.score}/100</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", borderLeft: "1px solid var(--line)", paddingLeft: "16px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>✅</div>
            <div>
              <p style={{ fontSize: "11px", color: "var(--ink-mute)" }}>Accuracy</p>
              <p style={{ fontSize: "19px", fontWeight: 800 }}>{overall_stats.accuracy}%</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", borderLeft: "1px solid var(--line)", paddingLeft: "16px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>📝</div>
            <div>
              <p style={{ fontSize: "11px", color: "var(--ink-mute)" }}>Attempt Rate</p>
              <p style={{ fontSize: "19px", fontWeight: 800 }}>{overall_stats.attempt_rate}%</p>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          {/* Accuracy over time */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "22px", boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}>
            <h4 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "16px" }}>Accuracy Over Time</h4>
            {accuracy_over_time.length === 0 ? (
              <p className="meta">Not enough data yet.</p>
            ) : (
              <svg viewBox="0 0 320 140" style={{ width: "100%", height: "140px" }}>
                <polyline
                  fill="none"
                  stroke="var(--blue)"
                  strokeWidth="2.5"
                  points={accuracy_over_time.map((p, i) => {
                    const x = (i / (accuracy_over_time.length - 1 || 1)) * 300 + 10;
                    const y = 130 - (p.accuracy / 100) * 120;
                    return `${x},${y}`;
                  }).join(" ")}
                />
                {accuracy_over_time.map((p, i) => {
                  const x = (i / (accuracy_over_time.length - 1 || 1)) * 300 + 10;
                  const y = 130 - (p.accuracy / 100) * 120;
                  return <circle key={i} cx={x} cy={y} r="3.5" fill="var(--blue)" />;
                })}
              </svg>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", color: "var(--ink-mute)", marginTop: "4px" }}>
              {accuracy_over_time.map((p, i) => <span key={i}>Test {i + 1}</span>)}
            </div>
          </div>

          {/* Weak vs Strong Topics */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "22px", boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}>
            <h4 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "16px" }}>Weak vs Strong Topics</h4>
            {subject_mastery.slice().sort((a, b) => a.accuracy - b.accuracy).map((s) => (
              <div key={s.subject} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12.5px", fontWeight: 600 }}>{s.subject}</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: getBarColor(s.accuracy) }}>{s.accuracy}%</span>
                </div>
                <div style={{ height: "10px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: `${s.accuracy}%`, height: "100%", background: getBarColor(s.accuracy) }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "20px" }}>
          {/* AI Performance Coach */}
          <div style={{ background: "linear-gradient(135deg, #ede9fe, #f3e8ff)", borderRadius: "16px", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span style={{ fontSize: "20px" }}>✦</span>
              <h4 style={{ fontSize: "16px", fontWeight: 800 }}>AI Performance Coach</h4>
            </div>
            <p style={{ fontSize: "13.5px", color: "var(--ink)", lineHeight: 1.6, marginBottom: "16px" }}>{ai_insight}</p>
            <button
              className="btn btn-primary"
              style={{ background: "linear-gradient(135deg, var(--violet), #a855f7)" }}
              onClick={() => (window.location.href = "/mock-tests")}
            >
              ▶ Start Revision
            </button>
          </div>

          {/* Suggested Revision Plan */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}>
            <h4 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "14px" }}>📅 Suggested Revision Plan</h4>
            {revision_suggestions.length === 0 ? (
              <p className="meta">No pending revisions — great job!</p>
            ) : (
              revision_suggestions.map((r) => (
                <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 700 }}>{r.topic}</p>
                    <p style={{ fontSize: "11px", color: "var(--ink-mute)" }}>{daysAgo(r.suggested_at)}</p>
                  </div>
                  <button
                    onClick={() => markRevisionDone(r.id)}
                    style={{ background: "none", border: "1px solid var(--blue)", color: "var(--blue)", borderRadius: "8px", padding: "6px 12px", fontSize: "11.5px", fontWeight: 700, cursor: "pointer" }}
                  >
                    Revise Now
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Performance;