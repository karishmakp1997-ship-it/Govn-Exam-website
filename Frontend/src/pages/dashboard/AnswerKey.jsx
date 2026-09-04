import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const AUTHORITY_META = {
  UPSC: { icon: "🏛️", bg: "linear-gradient(135deg, #7c3aed, #a855f7)" },
  TNPSC: { icon: "🚆", bg: "linear-gradient(135deg, #16a34a, #22c55e)" },
  SSC: { icon: "🎖️", bg: "linear-gradient(135deg, #2563eb, #3b82f6)" },
  Railways: { icon: "🚆", bg: "linear-gradient(135deg, #16a34a, #22c55e)" },
  Banking: { icon: "🏦", bg: "linear-gradient(135deg, #0891b2, #06b6d4)" },
};

function getAuthorityMeta(authority) {
  return AUTHORITY_META[authority] || { icon: "🔑", bg: "linear-gradient(135deg, #64748b, #94a3b8)" };
}

function formatDate(dateStr, fallback = "TBA") {
  if (!dateStr) return fallback;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function getObjectionStatus(startStr, endStr) {
  if (!startStr || !endStr) return { label: "Released", bg: "#ecfdf5", color: "#16a34a" };
  const now = new Date();
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (now < start) return { label: "Released", bg: "#ecfdf5", color: "#16a34a" };
  if (now >= start && now <= end) return { label: "Objection Window Open", bg: "#fff7ed", color: "#d97706" };
  return { label: "Review Window Closed", bg: "#f1f5f9", color: "#64748b" };
}

function daysLeft(endStr) {
  if (!endStr) return null;
  const diff = Math.ceil((new Date(endStr) - new Date()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : null;
}

function AnswerKey() {
  const [answerKeys, setAnswerKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/answer-keys/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load answer keys");
        return res.json();
      })
      .then((data) => {
        setAnswerKeys(data);
        if (data.length > 0) setSelectedId(data[0].id);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="wrap" style={{ padding: "60px 32px" }}><p className="section-head center">Loading answer keys...</p></div>;
  if (error) return <div className="wrap" style={{ padding: "60px 32px" }}><p className="section-head center" style={{ color: "#dc2626" }}>{error}</p></div>;

  const selected = answerKeys.find((a) => a.id === selectedId);
  const selectedStatus = selected ? getObjectionStatus(selected.objection_window_start, selected.objection_window_end) : null;
  const remaining = selected ? daysLeft(selected.objection_window_end) : null;

  return (
    <section style={{ background: "#f8fafc", minHeight: "100vh", padding: "32px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "linear-gradient(135deg, #7c3aed, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🔑</div>
          <div>
            <h2 style={{ fontSize: "26px", fontWeight: 900 }}>Answer Keys</h2>
            <p style={{ fontSize: "13.5px", color: "var(--ink-mute)" }}>Check released answer keys and raise objections if needed.</p>
          </div>
        </div>

        {answerKeys.length === 0 ? (
          <p className="section-head center">No answer keys have been released yet.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "20px", alignItems: "start" }}>
            {/* Left list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {answerKeys.map((a) => {
                const meta = getAuthorityMeta(a.exam_authority);
                const status = getObjectionStatus(a.objection_window_start, a.objection_window_end);
                const isSelected = a.id === selectedId;
                return (
                  <div
                    key={a.id}
                    onClick={() => setSelectedId(a.id)}
                    style={{
                      background: "#fff", borderRadius: "14px", padding: "16px",
                      border: isSelected ? "2px solid #7c3aed" : "1px solid var(--line)",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: status.color, background: status.bg, padding: "4px 10px", borderRadius: "999px" }}>
                        ⏱ {status.label}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--ink-mute)" }}>{formatDate(a.released_at)}</span>
                    </div>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "10px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                        {meta.icon}
                      </div>
                      <h4 style={{ fontSize: "14.5px", fontWeight: 700 }}>{a.exam_name}</h4>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: status.label === "Objection Window Open" ? "#7c3aed" : "var(--ink-mute)" }}>
                      {status.label === "Objection Window Open" ? "✎ Raise Objection" : "👁 View Answer Key"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right detail */}
            {selected && (
              <div style={{ background: "#fff", borderRadius: "18px", padding: "28px", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "24px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: getAuthorityMeta(selected.exam_authority).bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                    {getAuthorityMeta(selected.exam_authority).icon}
                  </div>
                  <div>
                    <h2 style={{ fontSize: "22px", fontWeight: 900 }}>{selected.exam_name}</h2>
                    <p style={{ fontSize: "13px", color: "var(--ink-mute)" }}>{selected.exam_authority}</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  <div style={{ background: "#f5f3ff", borderRadius: "14px", padding: "18px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "6px" }}>Release Date</p>
                    <p style={{ fontSize: "17px", fontWeight: 800 }}>{formatDate(selected.released_at)}</p>
                  </div>
                  <div style={{ background: "#fff7ed", borderRadius: "14px", padding: "18px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#d97706", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "6px" }}>Objection Deadline</p>
                    <p style={{ fontSize: "17px", fontWeight: 800 }}>{formatDate(selected.objection_window_end)}</p>
                    {remaining !== null && selectedStatus.label === "Objection Window Open" && (
                      <p style={{ fontSize: "12px", color: "#dc2626", fontWeight: 700, marginTop: "4px" }}>Ends in {remaining} day{remaining !== 1 ? "s" : ""}</p>
                    )}
                  </div>
                </div>

                <h4 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "14px" }}>ℹ️ Instructions for Raising Objections</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                  {[
                    "Review the official provisional answer key thoroughly before submitting any objections.",
                    "Ensure you have valid, authoritative documentary evidence to support your claim.",
                    "A non-refundable fee may apply per objection raised through the official portal.",
                    "Objections without proper justification or evidence will not be considered.",
                  ].map((tip) => (
                    <div key={tip} style={{ background: "#f0fdf4", borderRadius: "10px", padding: "12px 14px", fontSize: "13px", color: "var(--ink)" }}>
                      {tip}
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", paddingTop: "20px", borderTop: "1px solid var(--line)" }}>
                  {selected.official_link ? (
                    <a href={selected.official_link} target="_blank" rel="noopener noreferrer">
                      <button style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 22px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
                        View Official Answer Key ↗
                      </button>
                    </a>
                  ) : (
                    <button disabled style={{ background: "#e5e7eb", color: "#94a3b8", border: "none", borderRadius: "10px", padding: "12px 22px", fontWeight: 700, fontSize: "14px" }}>
                      Official Link Unavailable
                    </button>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#16a34a", fontSize: "16px" }}>✅</span>
                    <div>
                      <p style={{ fontSize: "12.5px", fontWeight: 700 }}>Verified. Transparent. Trusted.</p>
                      <p style={{ fontSize: "11px", color: "var(--ink-mute)" }}>Last updated: {formatDate(selected.released_at)}</p>
                    </div>
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

export default AnswerKey;