import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./ExamDetail.css";

const AUTHORITY_BANNERS = {
  Railways: "/images/rrb.png",
  UPSC: "/images/upsc.png",
  Banking: "/images/banking.png",
  TNPSC: "/images/tnpsc.png",
  SSC: "/images/ssc.png",
};

function getExamBannerUrl(authority) {
  return AUTHORITY_BANNERS[authority] || AUTHORITY_BANNERS.UPSC; // fallback if authority not matched
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const STATUS_META = {
  upcoming: { label: "Upcoming", color: "#7c3aed", bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.2)" },
  notification_released: { label: "Notification Released", color: "#2563eb", bg: "rgba(37,99,235,0.1)", border: "rgba(37,99,235,0.2)" },
  application_open: { label: "Application Open", color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)" },
  application_closed: { label: "Application Closed", color: "#64748b", bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.2)" },
  exam_scheduled: { label: "Exam Scheduled", color: "#d97706", bg: "rgba(217,119,6,0.1)", border: "rgba(217,119,6,0.2)" },
  result_released: { label: "Result Released", color: "#0f9d58", bg: "rgba(15,157,88,0.1)", border: "rgba(15,157,88,0.2)" },
};

// Generic syllabus stages — not exam-specific data yet, shown as a standard 3-stage structure.
// Replace with real per-exam syllabus data once that's modeled on the backend.
const SYLLABUS_STAGES = [
  { title: "Preliminary Exam (Objective)", items: ["Objective type, multiple choice questions.", "Penalty for wrong answers (negative marking)."] },
  { title: "Main Exam (Written)", items: [] },
  { title: "Interview (Personality Test)", items: [] },
];

// Generic checklist — same caveat as above, not exam-specific yet.
const DOCUMENT_CHECKLIST = [
  "ID proof (Aadhar/Voter ID)",
  "Photograph (Passport size)",
  "Signature (Scanned)",
  "Educational Certificates",
  "Category Certificate (if applicable)",
];

function formatDate(dateStr, fallback = "TBA") {
  if (!dateStr) return fallback;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function ExamDetail() {
  const { examSlug } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(0);
  const [openItems, setOpenItems] = useState({});

  // Inline eligibility widget state
  const [eduLevel, setEduLevel] = useState("");
  const [checkAge, setCheckAge] = useState("");
  const [eligResult, setEligResult] = useState(null);

  // Add to My Exams state
  const [addingToMyExams, setAddingToMyExams] = useState(false);
  const [addedToMyExams, setAddedToMyExams] = useState(false);
  const [addError, setAddError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/exams/${examSlug}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Exam not found");
        return res.json();
      })
      .then((data) => {
        setExam(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [examSlug]);

  const toggleAccordion = (idx) => {
    setOpenItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCheckEligibility = () => {
    if (!eduLevel || !checkAge || !exam) {
      setEligResult({ ok: false, message: "Please fill in both fields." });
      return;
    }
    const age = Number(checkAge);
    const ageOk =
      (!exam.age_limit_min || age >= exam.age_limit_min) &&
      (!exam.age_limit_max || age <= exam.age_limit_max);
    setEligResult(
      ageOk
        ? { ok: true, message: "You appear to meet the age criteria for this exam." }
        : { ok: false, message: `Age must be between ${exam.age_limit_min ?? "—"} and ${exam.age_limit_max ?? "—"} years.` }
    );
  };

  const handleAddToMyExams = async () => {
    if (!exam) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      setAddError("Please log in to add this exam to your list.");
      return;
    }

    setAddingToMyExams(true);
    setAddError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/my-exams/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ exam: exam.id, status: "not_applied" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Could not add this exam.");
      }

      setAddedToMyExams(true);
      setTimeout(() => {
        navigate("/my-exams");
      }, 700);
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddingToMyExams(false);
    }
  };

  if (loading) {
    return (
      <div className="wrap" style={{ padding: "60px 32px" }}>
        <p className="section-head center">Loading exam details...</p>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="wrap" style={{ padding: "60px 32px" }}>
        <p className="section-head center" style={{ color: "#dc2626" }}>{error || "Exam not found"}</p>
        <div className="section-head center">
          <Link to="/exams" className="btn btn-outline">← Back to Exams</Link>
        </div>
      </div>
    );
  }

  const meta = STATUS_META[exam.status] || STATUS_META.upcoming;
  const ageRange = exam.age_limit_min && exam.age_limit_max ? `${exam.age_limit_min} - ${exam.age_limit_max} Years` : "Not specified";

  return (
    <div className="ed-canvas">
      {/* Breadcrumbs */}
      <div className="ed-breadcrumbs">
        <Link to="/">Home</Link>
        <span className="ed-crumb-sep">›</span>
        <Link to="/exams">Exams</Link>
        <span className="ed-crumb-sep">›</span>
        <span>{exam.conducting_authority}</span>
        <span className="ed-crumb-sep">›</span>
        <span className="ed-crumb-current">{exam.name}</span>
      </div>

      {/* Banner */}
      <img
        src={getExamBannerUrl(exam.conducting_authority)}
        alt={exam.name}
        style={{ width: "100%", height: "220px", objectFit: "cover", borderRadius: "12px" }}
      />

      {/* Title area */}
      <div className="ed-title-area">
        <div>
          <div className="ed-title-top">
            <h1 className="ed-title">{exam.name}</h1>
            <span
              className="ed-status-pill"
              style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}
            >
              ● {meta.label}
            </span>
          </div>
          <p className="ed-authority">{exam.conducting_authority}</p>
          <p className="ed-verified">🕓 Last verified: {formatDate(exam.last_verified_at, "—")}</p>
        </div>

        <div className="ed-actions">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
            <button
              className="ed-btn-primary"
              onClick={handleAddToMyExams}
              disabled={addingToMyExams || addedToMyExams}
              style={addedToMyExams ? { background: "#16a34a", cursor: "default" } : {}}
            >
              {addedToMyExams ? "✓ Added to My Exams" : addingToMyExams ? "Adding..." : "+ Add to My Exams"}
            </button>
            {addError && (
              <span style={{ fontSize: "12px", color: "#dc2626" }}>{addError}</span>
            )}
          </div>
          {exam.official_notification_url ? (
            <a href={exam.official_notification_url} target="_blank" rel="noopener noreferrer" className="ed-btn-outline">
              View Official Notification ↗
            </a>
          ) : (
            <span className="ed-btn-outline ed-btn-disabled">Official Link Unavailable</span>
          )}
        </div>
      </div>

      {/* Callout */}
      <div className="ed-callout">
        <span className="ed-callout-icon">ⓘ</span>
        <div>
          <p className="ed-callout-title">Always confirm details on the official notification.</p>
          <p className="ed-callout-sub">Source: {exam.conducting_authority}, verified {formatDate(exam.last_verified_at, "recently")}.</p>
        </div>
      </div>

      {/* Bento layout */}
      <div className="ed-bento">
        {/* Left column */}
        <div className="ed-left-col">
          {/* Key facts */}
          <div className="ed-key-facts">
            <div className="ed-fact-card">
              <div className="ed-fact-icon">🎓</div>
              <p className="ed-fact-label">Qualification</p>
              <p className="ed-fact-value">{exam.qualification_required || "Not specified"}</p>
            </div>
            <div className="ed-fact-card">
              <div className="ed-fact-icon">🎂</div>
              <p className="ed-fact-label">Age Limit</p>
              <p className="ed-fact-value">{ageRange}</p>
            </div>
            <div className="ed-fact-card">
              <div className="ed-fact-icon">💰</div>
              <p className="ed-fact-label">Application Fee</p>
              <p className="ed-fact-value">{exam.application_fee ? `₹${exam.application_fee}` : "Free"}</p>
            </div>
            <div className="ed-fact-card">
              <div className="ed-fact-icon">💼</div>
              <p className="ed-fact-label">Vacancies</p>
              <p className="ed-fact-value">{exam.vacancy_count ?? "TBA"}</p>
            </div>
          </div>

          {/* AI Eligibility Checker */}
          <div className="ed-elig-card">
            <div className="ed-elig-header">
              <span className="ed-elig-star">✦</span>
              <h2>Check if you're eligible</h2>
            </div>
            <p className="ed-elig-sub">
              Instantly check your eligibility based on this exam's current criteria.
            </p>
            <div className="ed-elig-row">
              <div className="ed-elig-field">
                <label>Highest Education</label>
                <select value={eduLevel} onChange={(e) => setEduLevel(e.target.value)}>
                  <option value="">Select Education Level</option>
                  <option value="10th">10th Pass</option>
                  <option value="12th">12th Pass</option>
                  <option value="diploma">Diploma</option>
                  <option value="graduate">Any Graduate</option>
                  <option value="postgraduate">Postgraduate</option>
                </select>
              </div>
              <div className="ed-elig-field">
                <label>Age</label>
                <input
                  type="number"
                  placeholder="e.g. 24"
                  value={checkAge}
                  onChange={(e) => setCheckAge(e.target.value)}
                />
              </div>
            </div>
            {eligResult && (
              <p className={eligResult.ok ? "ed-elig-result ed-elig-ok" : "ed-elig-result ed-elig-bad"}>
                {eligResult.message}
              </p>
            )}
            <button className="ed-elig-btn" onClick={handleCheckEligibility}>Check Now →</button>
          </div>

          {/* Syllabus accordion */}
          <div className="ed-syllabus">
            <h2 className="ed-section-title">📖 Syllabus & Exam Pattern</h2>
            <div className="ed-accordion-list">
              {SYLLABUS_STAGES.map((stage, idx) => (
                <div className="ed-accordion-item" key={stage.title}>
                  <button className="ed-accordion-header" onClick={() => toggleAccordion(idx)}>
                    <div className="ed-accordion-left">
                      <span className={idx === 0 ? "ed-accordion-num ed-accordion-num-active" : "ed-accordion-num"}>
                        {idx + 1}
                      </span>
                      <span className="ed-accordion-title">{stage.title}</span>
                    </div>
                    <span className={openItems[idx] ? "ed-accordion-chevron ed-chevron-open" : "ed-accordion-chevron"}>▾</span>
                  </button>
                  {openItems[idx] && stage.items.length > 0 && (
                    <div className="ed-accordion-body">
                      {stage.items.map((item) => (
                        <p key={item}>• {item}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="ed-right-col">
          {/* Important dates */}
          <div className="ed-dates-card">
            <h2 className="ed-section-title">📅 Important Dates</h2>
            <div className="ed-timeline">
              <div className="ed-timeline-item">
                <span className="ed-timeline-dot" />
                <h4>Application Start</h4>
                <p>{formatDate(exam.application_start_date)}</p>
              </div>
              <div className="ed-timeline-item">
                <span className="ed-timeline-dot" />
                <h4>Application End</h4>
                <p>{formatDate(exam.application_end_date)}</p>
              </div>
              <div className="ed-timeline-item">
                <span className="ed-timeline-dot" />
                <h4>Exam Date</h4>
                <p>{formatDate(exam.exam_date)}</p>
              </div>
            </div>
          </div>

          {/* Document checklist */}
          <div className="ed-checklist-card">
            <h2 className="ed-section-title">📋 Document Checklist</h2>
            <p className="ed-checklist-sub">Prepare these before applying.</p>
            <div className="ed-checklist">
              {DOCUMENT_CHECKLIST.map((doc) => (
                <label key={doc} className="ed-checklist-item">
                  <input type="checkbox" />
                  <span>{doc}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamDetail;