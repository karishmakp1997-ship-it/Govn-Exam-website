import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const AUTHORITY_META = {
  UPSC: { icon: "🏛️", bg: "linear-gradient(135deg, #7c3aed, #a855f7)" },
  TNPSC: { icon: "📄", bg: "linear-gradient(135deg, #2563eb, #3b82f6)" },
  SSC: { icon: "🎖️", bg: "linear-gradient(135deg, #f97316, #fb923c)" },
  Railways: { icon: "🚆", bg: "linear-gradient(135deg, #16a34a, #22c55e)" },
  Banking: { icon: "🏦", bg: "linear-gradient(135deg, #0891b2, #06b6d4)" },
};

function getAuthorityMeta(authority) {
  return AUTHORITY_META[authority] || { icon: "📋", bg: "linear-gradient(135deg, #64748b, #94a3b8)" };
}

function formatDate(dateStr, fallback = "TBA") {
  if (!dateStr) return fallback;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/results/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load results");
        return res.json();
      })
      .then((data) => {
        setResults(data);
        if (data.length > 0) setSelectedId(data[0].id);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="wrap" style={{ padding: "60px 32px" }}><p className="section-head center">Loading results...</p></div>;
  if (error) return <div className="wrap" style={{ padding: "60px 32px" }}><p className="section-head center" style={{ color: "#dc2626" }}>{error}</p></div>;

  const selected = results.find((r) => r.id === selectedId);

  return (
    <section style={{ background: "#f8fafc", minHeight: "100vh", padding: "32px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "linear-gradient(135deg, #7c3aed, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🏆</div>
          <div>
            <h2 style={{ fontSize: "26px", fontWeight: 900 }}>Results</h2>
            <p style={{ fontSize: "13.5px", color: "var(--ink-mute)" }}>Stay updated on your exam results.</p>
          </div>
        </div>

        {results.length === 0 ? (
          <p className="section-head center">No results have been released yet.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "20px", alignItems: "start" }}>
            {/* Left list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {results.map((r) => {
                const meta = getAuthorityMeta(r.exam_authority);
                const isSelected = r.id === selectedId;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedId(r.id)}
                    style={{
                      background: "#fff", borderRadius: "14px", padding: "16px",
                      border: isSelected ? "2px solid #7c3aed" : "1px solid var(--line)",
                      cursor: "pointer", display: "flex", gap: "12px", alignItems: "flex-start",
                    }}
                  >
                    <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                      {meta.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#7c3aed", background: "#f3e8ff", padding: "2px 8px", borderRadius: "999px" }}>{r.exam_authority}</span>
                        <span style={{ fontSize: "11px", color: "var(--ink-mute)" }}>{formatDate(r.released_at)}</span>
                      </div>
                      <h4 style={{ fontSize: "14.5px", fontWeight: 700, marginBottom: "2px" }}>{r.exam_name}</h4>
                      <p style={{ fontSize: "12px", color: "var(--ink-mute)", marginBottom: "8px" }}>Result declared. Check your status.</p>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#16a34a", background: "#ecfdf5", padding: "3px 10px", borderRadius: "999px" }}>✓ Result Declared</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right detail */}
            {selected && (
              <div style={{ background: "#fff", borderRadius: "18px", padding: "28px", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <h2 style={{ fontSize: "26px", fontWeight: 900 }}>{selected.exam_name}</h2>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", background: "#f3e8ff", padding: "5px 12px", borderRadius: "999px" }}>{selected.exam_authority}</span>
                </div>
                <p style={{ fontSize: "14px", color: "var(--ink-mute)", marginBottom: "24px" }}>
                  📅 Result Date: <strong style={{ color: "#7c3aed" }}>{formatDate(selected.released_at)}</strong>
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  <div style={{ background: "#f5f3ff", borderRadius: "14px", padding: "20px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#7c3aed", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", marginBottom: "12px" }}>🎯</div>
                    <h4 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "6px" }}>Next Stage</h4>
                    <p style={{ fontSize: "13.5px", color: "var(--ink-mute)" }}>{selected.next_stage_info || "No further stage information available yet."}</p>
                  </div>
                  <div style={{ background: "#fff7ed", borderRadius: "14px", padding: "20px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f97316", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", marginBottom: "12px" }}>📊</div>
                    <h4 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "6px" }}>Cut-off</h4>
                    <p style={{ fontSize: "13.5px", color: "var(--ink-mute)" }}>{selected.cutoff_info || "Cut-off not yet released."}</p>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", paddingTop: "20px", borderTop: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#16a34a", fontSize: "18px" }}>✅</span>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 700 }}>Verified. Transparent. Trusted.</p>
                      <p style={{ fontSize: "11.5px", color: "var(--ink-mute)" }}>Last verified: {formatDate(selected.released_at)}</p>
                    </div>
                  </div>
                  {selected.official_link ? (
                    <a href={selected.official_link} target="_blank" rel="noopener noreferrer">
                      <button style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 22px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
                        View Official Result ↗
                      </button>
                    </a>
                  ) : (
                    <button disabled style={{ background: "#e5e7eb", color: "#94a3b8", border: "none", borderRadius: "10px", padding: "12px 22px", fontWeight: 700, fontSize: "14px" }}>
                      Official Link Unavailable
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Results;