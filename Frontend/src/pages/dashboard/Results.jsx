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

const GRIEVANCE_FAQS = [
  {
    q: "How do I apply for revaluation or recheck?",
    a: "Revaluation/recheck requests must be submitted through the official notification's process — usually within a few days of the result being declared. Check the \"View Official Result\" link above for the exact process and deadline for this exam.",
  },
  {
    q: "My roll number isn't showing in the result. What do I do?",
    a: "First confirm you're checking the correct exam and result date. If your roll number still doesn't appear, contact the conducting authority's official helpline — we only display verified summary information, not individual candidate records.",
  },
  {
    q: "Who do I contact for result-related issues?",
    a: "For issues specific to your result (marks, scorecard errors, name mismatches), reach out to the conducting authority directly via their official notification. For anything about this website, use the Contact Us link in our footer.",
  },
];

// Mobile responsive rules for Results.
// Same approach as the other pages: responsive-critical properties (grids,
// padding, font sizes) live in classes since inline styles beat plain CSS specificity.
const RESULTS_RESPONSIVE_CSS = `
.res-section { padding: 32px; }
.res-header-icon { width: 52px; height: 52px; font-size: 24px; }
.res-title { font-size: 26px; }
.res-master-grid { display: grid; grid-template-columns: 360px 1fr; gap: 20px; align-items: start; }
.res-detail-card { padding: 28px; }
.res-detail-title { font-size: 26px; }
.res-detail-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.res-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.res-footer-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.res-check-row { display: flex; gap: 10px; }

@media (max-width: 768px) {
  .res-section { padding: 16px; }
  .res-header-icon { width: 42px; height: 42px; font-size: 19px; }
  .res-title { font-size: 21px; }
  .res-master-grid { grid-template-columns: 1fr; }
  .res-detail-card { padding: 18px; }
  .res-detail-title { font-size: 20px; }
  .res-info-grid { grid-template-columns: 1fr; }
  .res-check-row { flex-direction: column; }
}

@media (max-width: 375px) {
  .res-section { padding: 12px; }
  .res-header-icon { width: 38px; height: 38px; font-size: 17px; }
  .res-title { font-size: 18px; }
  .res-detail-card { padding: 14px; }
  .res-detail-title { font-size: 17px; }
  .res-detail-header { flex-wrap: wrap; }
}
`;

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // "Check your result" widget state
  const [rollNumber, setRollNumber] = useState("");
  const [checkMessage, setCheckMessage] = useState("");

  // Grievance/recheck accordion state
  const [openFaq, setOpenFaq] = useState(null);

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

  const handleCheckResult = (e) => {
    e.preventDefault();
    if (!rollNumber.trim()) return;

    if (selected?.official_link) {
      window.open(selected.official_link, "_blank", "noopener,noreferrer");
    } else {
      setCheckMessage(
        `Official result link isn't available for this exam yet. Please check the ${selected?.exam_authority || "conducting authority's"} website directly.`
      );
    }
  };

  return (
    <section className="res-section" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <style>{RESULTS_RESPONSIVE_CSS}</style>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
          <div className="res-header-icon" style={{ borderRadius: "16px", background: "linear-gradient(135deg, #7c3aed, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center" }}>🏆</div>
          <div>
            <h2 className="res-title" style={{ fontWeight: 900 }}>Results</h2>
            <p style={{ fontSize: "13.5px", color: "var(--ink-mute)" }}>Stay updated on your exam results.</p>
          </div>
        </div>

        {results.length === 0 ? (
          <p className="section-head center">No results have been released yet.</p>
        ) : (
          <div className="res-master-grid">
            {/* Left list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {results.map((r) => {
                const meta = getAuthorityMeta(r.exam_authority);
                const isSelected = r.id === selectedId;
                return (
                  <div
                    key={r.id}
                    onClick={() => {
                      setSelectedId(r.id);
                      setCheckMessage("");
                      setRollNumber("");
                    }}
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
              <div className="res-detail-card" style={{ background: "#fff", borderRadius: "18px", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
                <div className="res-detail-header" style={{ marginBottom: "12px" }}>
                  <h2 className="res-detail-title" style={{ fontWeight: 900 }}>{selected.exam_name}</h2>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", background: "#f3e8ff", padding: "5px 12px", borderRadius: "999px", whiteSpace: "nowrap" }}>{selected.exam_authority}</span>
                </div>
                <p style={{ fontSize: "14px", color: "var(--ink-mute)", marginBottom: "20px" }}>
                  📅 Result Date: <strong style={{ color: "#7c3aed" }}>{formatDate(selected.released_at)}</strong>
                </p>

                {/* Check your result */}
                <div style={{ background: "#f8fafc", border: "1px solid var(--line)", borderRadius: "14px", padding: "18px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 800, margin: 0 }}>🔍 Check Your Result</h4>
                  {selected?.official_link ? (
                    <a href={selected.official_link} target="_blank" rel="noopener noreferrer">
                      <button className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
                        View Official Result ↗
                      </button>
                    </a>
                  ) : (
                    <button disabled style={{ background: "#e5e7eb", color: "#94a3b8", border: "none", borderRadius: "10px", padding: "11px 20px", fontWeight: 700, fontSize: "14px" }}>
                      Official Link Unavailable
                    </button>
                  )}
                </div>

                <div className="res-info-grid" style={{ marginBottom: "24px" }}>
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

               

                {/* Grievance / recheck info */}
                <div style={{ borderTop: "1px solid var(--line)", paddingTop: "20px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 800, marginBottom: "12px" }}>❓ Grievance & Recheck Help</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {GRIEVANCE_FAQS.map((faq, idx) => (
                      <div
                        key={faq.q}
                        style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "12px 14px", cursor: "pointer" }}
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700 }}>{faq.q}</span>
                          <span style={{ fontSize: "11px", transform: openFaq === idx ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</span>
                        </div>
                        {openFaq === idx && (
                          <p style={{ fontSize: "12.5px", color: "var(--ink-mute)", marginTop: "8px", lineHeight: 1.6 }}>{faq.a}</p>
                        )}
                      </div>
                    ))}
                  </div>
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