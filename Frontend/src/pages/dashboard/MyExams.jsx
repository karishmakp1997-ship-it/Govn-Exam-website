import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const STATUS_META = {
  not_applied: { label: "Not Applied", color: "#64748b", bg: "#f1f5f9", dot: "#94a3b8" },
  planning: { label: "Planning to Apply", color: "#7c3aed", bg: "#ede9fe", dot: "#7c3aed" },
  applied: { label: "Applied", color: "#2563eb", bg: "#dbeafe", dot: "#2563eb" },
  admit_card_awaited: { label: "Admit Card Awaited", color: "#d97706", bg: "#fef3c7", dot: "#d97706" },
  exam_completed: { label: "Exam Completed", color: "#0891b2", bg: "#ecfeff", dot: "#0891b2" },
  result_awaited: { label: "Result Awaited", color: "#d97706", bg: "#fef3c7", dot: "#d97706" },
  qualified: { label: "Qualified", color: "#16a34a", bg: "#dcfce7", dot: "#16a34a" },
  not_qualified: { label: "Not Qualified", color: "#dc2626", bg: "#fef2f2", dot: "#dc2626" },
};

function formatDate(dateStr) {
  if (!dateStr) return "TBA";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function initials(name) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

const AUTHORITY_THEME = {
  UPSC: { from: "#2563eb", to: "#7c3aed" },
  TNPSC: { from: "#16a34a", to: "#0891b2" },
  Railways: { from: "#d97706", to: "#dc2626" },
  SSC: { from: "#7c3aed", to: "#db2777" },
  Banking: { from: "#059669", to: "#16a34a" },
  Defence: { from: "#334155", to: "#475569" },
};

function MyExams() {
  const [trackedExams, setTrackedExams] = useState([]);
  const [reminders, setReminders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadTrackedExams = () => {
    fetch(`${API_BASE_URL}/api/my-exams/`, { headers: getAuthHeaders() })
      .then((res) => {
        if (res.status === 401) throw new Error("Please log in to view your tracked exams.");
        if (!res.ok) throw new Error("Failed to load your exams");
        return res.json();
      })
      .then((data) => {
        setTrackedExams(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTrackedExams();
    fetch(`${API_BASE_URL}/api/reminders/`, { headers: getAuthHeaders() })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setReminders(data))
      .catch(() => setReminders(null));
  }, []);

  const updateStatus = async (trackedExamId, newStatus) => {
    setUpdatingId(trackedExamId);
    try {
      await fetch(`${API_BASE_URL}/api/my-exams/${trackedExamId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ status: newStatus }),
      });
      setTrackedExams((prev) =>
        prev.map((t) => (t.id === trackedExamId ? { ...t, status: newStatus } : t))
      );
    } catch {
      // silently ignore for now
    } finally {
      setUpdatingId(null);
    }
  };

  const removeTracked = async (trackedExamId) => {
    if (!window.confirm("Remove this exam from your tracked list?")) return;
    try {
      await fetch(`${API_BASE_URL}/api/my-exams/${trackedExamId}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      setTrackedExams((prev) => prev.filter((t) => t.id !== trackedExamId));
    } catch {
      // ignore for now
    }
  };

  const toggleReminder = async (field) => {
    if (!reminders) return;
    const updated = { ...reminders, [field]: !reminders[field] };
    setReminders(updated); // optimistic
    try {
      await fetch(`${API_BASE_URL}/api/reminders/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ [field]: updated[field] }),
      });
    } catch {
      setReminders((prev) => ({ ...prev, [field]: !updated[field] }));
    }
  };

  const styleBlock = (
    <style>{`
      .myexams-section {
        position: relative;
        padding: 56px 0 80px;
        background:
          radial-gradient(circle at 8% 8%, rgba(124, 58, 237, 0.06), transparent 28%),
          radial-gradient(circle at 92% 78%, rgba(37, 99, 235, 0.05), transparent 30%),
          #f8fafc;
        min-height: 60vh;
      }

      .myexams-wrap {
        max-width: 980px;
        margin: 0 auto;
        padding: 0 24px;
      }

      .myexams-header {
        margin-bottom: 32px;
      }

      .myexams-eyebrow {
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

      .myexams-header h2 {
        margin: 0 0 8px;
        font-size: 32px;
        font-weight: 800;
        color: #0f172a;
        letter-spacing: -0.8px;
      }

      .myexams-header p {
        margin: 0;
        color: #64748b;
        font-size: 14.5px;
      }

      /* Exam cards */

      .myexams-list {
        display: flex;
        flex-direction: column;
        gap: 14px;
        margin-bottom: 36px;
      }

      .myexam-card {
        display: flex;
        align-items: center;
        gap: 16px;
        background: #ffffff;
        border: 1px solid rgba(148, 163, 184, 0.16);
        border-radius: 16px;
        padding: 18px 20px;
        box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        flex-wrap: wrap;
      }

      .myexam-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
      }

      .myexam-avatar {
        flex: 0 0 48px;
        width: 48px;
        height: 48px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 13px;
        font-weight: 800;
        box-shadow: 0 6px 14px rgba(0,0,0,0.12);
      }

      .myexam-info {
        flex: 1;
        min-width: 200px;
      }

      .myexam-info h3 {
        margin: 0 0 2px;
        font-size: 15.5px;
        font-weight: 800;
        color: #0f172a;
      }

      .myexam-authority {
        margin: 0 0 4px;
        font-size: 12.5px;
        color: #94a3b8;
        font-weight: 600;
      }

      .myexam-dates {
        margin: 0;
        font-size: 12.5px;
        color: #475569;
      }

      .myexam-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .myexam-status-select {
        appearance: none;
        padding: 9px 32px 9px 14px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        border: 1.5px solid;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394a3b8' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
      }

      .myexam-status-dot {
        display: inline-block;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        margin-right: 5px;
      }

      .myexam-btn-view {
        padding: 9px 16px;
        border-radius: 999px;
        border: 1.5px solid #2563eb;
        background: #ffffff;
        color: #2563eb;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        text-decoration: none;
        transition: background 0.2s ease, color 0.2s ease;
      }

      .myexam-btn-view:hover {
        background: #2563eb;
        color: #fff;
      }

      .myexam-btn-remove {
        padding: 9px 12px;
        border-radius: 999px;
        border: none;
        background: transparent;
        color: #dc2626;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
      }

      .myexam-btn-remove:hover {
        background: #fef2f2;
      }

      /* Empty state */

      .myexams-empty {
        text-align: center;
        padding: 56px 24px;
        background: #ffffff;
        border: 1.5px dashed #cbd5e1;
        border-radius: 20px;
      }

      .myexams-empty-icon {
        font-size: 40px;
        margin-bottom: 12px;
      }

      .myexams-empty h3 {
        margin: 0 0 6px;
        font-size: 16px;
        color: #334155;
      }

      .myexams-empty p {
        margin: 0 0 20px;
        color: #94a3b8;
        font-size: 13.5px;
      }

      .myexams-empty .btn-browse {
        display: inline-block;
        padding: 12px 28px;
        border-radius: 999px;
        border: none;
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        color: #fff;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        text-decoration: none;
        box-shadow: 0 10px 24px -8px rgba(124, 58, 237, 0.4);
      }

      /* Reminder preferences */

      .reminder-card {
        max-width: 520px;
        background: #ffffff;
        border: 1px solid rgba(148, 163, 184, 0.16);
        border-radius: 18px;
        padding: 24px;
        box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
      }

      .reminder-card h3 {
        margin: 0 0 4px;
        font-size: 16px;
        font-weight: 800;
        color: #0f172a;
      }

      .reminder-card > p {
        margin: 0 0 18px;
        font-size: 13px;
        color: #94a3b8;
      }

      .reminder-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid #f1f5f9;
      }

      .reminder-row:last-child {
        border-bottom: none;
      }

      .reminder-row span {
        font-size: 13.5px;
        color: #334155;
        font-weight: 600;
      }

      .toggle-switch {
        position: relative;
        width: 42px;
        height: 24px;
        flex: 0 0 42px;
        cursor: pointer;
      }

      .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .toggle-track {
        position: absolute;
        inset: 0;
        background: #e2e8f0;
        border-radius: 999px;
        transition: background 0.25s ease;
      }

      .toggle-track::after {
        content: "";
        position: absolute;
        top: 3px;
        left: 3px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: transform 0.25s ease;
      }

      .toggle-switch input:checked + .toggle-track {
        background: linear-gradient(135deg, #2563eb, #7c3aed);
      }

      .toggle-switch input:checked + .toggle-track::after {
        transform: translateX(18px);
      }

      @media (max-width: 640px) {
        .myexam-card {
          flex-direction: column;
          align-items: flex-start;
        }
        .myexam-actions {
          width: 100%;
          justify-content: space-between;
        }
      }
    `}</style>
  );

  if (loading) {
    return (
      <>
        {styleBlock}
        <section className="myexams-section">
          <div className="myexams-wrap">
            <p style={{ textAlign: "center", color: "#64748b" }}>Loading your exams...</p>
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        {styleBlock}
        <section className="myexams-section">
          <div className="myexams-wrap">
            <p style={{ textAlign: "center", color: "#dc2626" }}>{error}</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {styleBlock}
      <section className="myexams-section">
        <div className="myexams-wrap">
          <div className="myexams-header">
            <span className="myexams-eyebrow">Dashboard</span>
            <h2>My Exams</h2>
            <p>Track your application progress across every exam you're preparing for.</p>
          </div>

          {trackedExams.length === 0 ? (
            <div className="myexams-empty">
              <div className="myexams-empty-icon">🎯</div>
              <h3>You haven't added any exams yet</h3>
              <p>Browse exams and tap "Add to My Exams" to start tracking your progress.</p>
              <Link to="/exams" className="btn-browse">Browse Exams</Link>
            </div>
          ) : (
            <div className="myexams-list">
              {trackedExams.map((t) => {
                const meta = STATUS_META[t.status] || STATUS_META.not_applied;
                const exam = t.exam_detail;
                const theme = AUTHORITY_THEME[exam?.conducting_authority] || { from: "#2563eb", to: "#7c3aed" };

                return (
                  <div key={t.id} className="myexam-card">
                    <div
                      className="myexam-avatar"
                      style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
                    >
                      {initials(exam?.conducting_authority || exam?.name)}
                    </div>

                    <div className="myexam-info">
                      <h3>{exam?.name}</h3>
                      <p className="myexam-authority">{exam?.conducting_authority}</p>
                      <p className="myexam-dates">
                        Apply by <b>{formatDate(exam?.application_end_date)}</b> · Exam on <b>{formatDate(exam?.exam_date)}</b>
                      </p>
                    </div>

                    <div className="myexam-actions">
                      <select
                        className="myexam-status-select"
                        value={t.status}
                        onChange={(e) => updateStatus(t.id, e.target.value)}
                        disabled={updatingId === t.id}
                        style={{ borderColor: meta.color, background: meta.bg, color: meta.color }}
                      >
                        {Object.entries(STATUS_META).map(([value, m]) => (
                          <option key={value} value={value}>{m.label}</option>
                        ))}
                      </select>

                      {exam?.id && (
                        <Link to={`/exams/${exam.id}`} className="myexam-btn-view">View</Link>
                      )}

                      <button className="myexam-btn-remove" onClick={() => removeTracked(t.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {reminders && (
            <div className="reminder-card">
              <h3>Reminder Preferences</h3>
              <p>Get notified before deadlines for your tracked exams.</p>

              {[
                { field: "remind_14_days", label: "14 days before deadline" },
                { field: "remind_7_days", label: "7 days before deadline" },
                { field: "remind_3_days", label: "3 days before deadline" },
                { field: "remind_1_day", label: "1 day before deadline" },
              ].map((r) => (
                <div className="reminder-row" key={r.field}>
                  <span>{r.label}</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={reminders[r.field]}
                      onChange={() => toggleReminder(r.field)}
                    />
                    <span className="toggle-track"></span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default MyExams;