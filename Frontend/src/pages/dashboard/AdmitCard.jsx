import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const AUTHORITY_META = {
  UPSC: { icon: "🏛️", bg: "linear-gradient(135deg, #7c3aed, #a855f7)" },
  TNPSC: { icon: "🛕", bg: "linear-gradient(135deg, #f59e0b, #fbbf24)" },
  SSC: { icon: "🏢", bg: "linear-gradient(135deg, #64748b, #94a3b8)" },
  Railways: { icon: "🚆", bg: "linear-gradient(135deg, #16a34a, #22c55e)" },
  Banking: { icon: "🏦", bg: "linear-gradient(135deg, #0891b2, #06b6d4)" },
};

function getAuthorityMeta(authority) {
  return AUTHORITY_META[authority] || { icon: "🪪", bg: "linear-gradient(135deg, #64748b, #94a3b8)" };
}

function formatDate(dateStr, fallback = "TBA") {
  if (!dateStr) return fallback;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function getStatus(releasedAt) {
  if (releasedAt) return { label: "Released", bg: "#ecfdf5", color: "#16a34a", icon: "✓" };
  return { label: "Not Yet Released", bg: "#f1f5f9", color: "#64748b", icon: "⏱" };
}

function AdmitCard() {
  const [admitCards, setAdmitCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admit-cards/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load admit cards");
        return res.json();
      })
      .then((data) => {
        setAdmitCards(data);
        if (data.length > 0) setSelectedId(data[0].id);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="wrap" style={{ padding: "60px 32px" }}><p className="section-head center">Loading admit cards...</p></div>;
  if (error) return <div className="wrap" style={{ padding: "60px 32px" }}><p className="section-head center" style={{ color: "#dc2626" }}>{error}</p></div>;

  const selected = admitCards.find((a) => a.id === selectedId);
  const docsList = selected?.required_documents ? selected.required_documents.split(",").map((s) => s.trim()).filter(Boolean) : [];

  return (
    <section style={{ background: "#f8fafc", minHeight: "100vh", padding: "32px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "linear-gradient(135deg, #7c3aed, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🪪</div>
          <div>
            <h2 style={{ fontSize: "26px", fontWeight: 900 }}>Admit Cards</h2>
            <p style={{ fontSize: "13.5px", color: "var(--ink-mute)" }}>Download and review your exam admit cards.</p>
          </div>
        </div>

        {admitCards.length === 0 ? (
          <p className="section-head center">No admit cards have been released yet.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "20px", alignItems: "start" }}>
            {/* Left list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {admitCards.map((ac) => {
                const meta = getAuthorityMeta(ac.exam_authority);
                const status = getStatus(ac.released_at);
                const isSelected = ac.id === selectedId;
                return (
                  <div
                    key={ac.id}
                    onClick={() => setSelectedId(ac.id)}
                    style={{
                      background: status.label === "Released" && isSelected ? "#f0fdf4" : "#fff",
                      borderRadius: "14px", padding: "16px",
                      border: isSelected ? "2px solid #16a34a" : "1px solid var(--line)",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: status.color, background: status.bg, padding: "4px 10px", borderRadius: "999px" }}>
                        {status.icon} {status.label}
                      </span>
                      <span style={{ fontSize: "16px" }}>⬇️</span>
                    </div>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                        {meta.icon}
                      </div>
                      <div>
                        <h4 style={{ fontSize: "14.5px", fontWeight: 700 }}>{ac.exam_name}</h4>
                        <p style={{ fontSize: "12px", color: "var(--ink-mute)" }}>📅 {formatDate(ac.released_at, "Date TBA")}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right detail */}
            {selected && (
              <div style={{ background: "#fff", borderRadius: "18px", padding: "28px", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                  <div>
                    <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "6px" }}>{selected.exam_name}</h2>
                    <p style={{ fontSize: "13px", color: "var(--ink-mute)" }}>{selected.exam_authority}</p>
                  </div>
                  {selected.released_at && selected.admit_card_file ? (
                    <a href={selected.admit_card_file} target="_blank" rel="noopener noreferrer" download>
                      <button style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 20px", fontWeight: 700, fontSize: "13.5px", cursor: "pointer" }}>
                        ⬇ Download Admit Card
                      </button>
                    </a>
                  ) : (
                    <button disabled style={{ background: "#e5e7eb", color: "#94a3b8", border: "none", borderRadius: "10px", padding: "12px 20px", fontWeight: 700, fontSize: "13.5px" }}>
                      Not Yet Available
                    </button>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  <div>
                    <h4 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "16px" }}>📅 Exam Schedule</h4>
                    {selected.reporting_time && (
                      <div style={{ marginBottom: "16px" }}>
                        <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--ink-mute)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Reporting Time</p>
                        <p style={{ fontSize: "14.5px", fontWeight: 700 }}>{selected.reporting_time}</p>
                      </div>
                    )}
                    {selected.exam_centre_info && (
                      <div>
                        <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--ink-mute)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Exam Centre</p>
                        <p style={{ fontSize: "13.5px", color: "var(--ink)" }}>{selected.exam_centre_info}</p>
                      </div>
                    )}
                    {!selected.reporting_time && !selected.exam_centre_info && (
                      <p style={{ fontSize: "13px", color: "var(--ink-mute)" }}>Schedule details will be added once the admit card is released.</p>
                    )}
                  </div>

                  <div>
                    <h4 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "16px" }}>📋 Guidelines</h4>
                    {docsList.length > 0 && (
                      <div style={{ marginBottom: "14px" }}>
                        <p style={{ fontSize: "12px", fontWeight: 700, color: "#16a34a", marginBottom: "6px" }}>✓ REQUIRED DOCUMENTS</p>
                        {docsList.map((doc) => (
                          <p key={doc} style={{ fontSize: "13px", color: "var(--ink)", marginBottom: "4px" }}>• {doc}</p>
                        ))}
                      </div>
                    )}
                    {selected.allowed_items && (
                      <p style={{ fontSize: "13px", color: "#16a34a", marginBottom: "8px" }}><strong>Allowed:</strong> {selected.allowed_items}</p>
                    )}
                    {selected.restricted_items && (
                      <p style={{ fontSize: "13px", color: "#dc2626" }}><strong>Not allowed:</strong> {selected.restricted_items}</p>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--line)" }}>
                  <span style={{ color: "#16a34a", fontSize: "18px" }}>✅</span>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 700 }}>Verified. Transparent. Trusted.</p>
                    <p style={{ fontSize: "11.5px", color: "var(--ink-mute)" }}>We ensure authenticity of all admit cards.</p>
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

export default AdmitCard;