import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const QUALIFICATION_OPTIONS = ["10th Pass", "12th Pass", "Diploma", "B.Sc", "Any Graduate", "Postgraduate"];

function formatDate(dateStr) {
  if (!dateStr) return "TBA";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function EligibilityChecker() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [qualification, setQualification] = useState("");
  const [age, setAge] = useState("");
  const [checked, setChecked] = useState(false);
  const [bestMatch, setBestMatch] = useState(null);
  const [otherMatches, setOtherMatches] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/exams/`)
      .then((res) => res.json())
      .then((data) => {
        setExams(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const evaluateEligibility = (exam) => {
    const ageOk =
      !age ||
      ((!exam.age_limit_min || Number(age) >= exam.age_limit_min) &&
        (!exam.age_limit_max || Number(age) <= exam.age_limit_max));
    const qualOk =
      !qualification ||
      !exam.qualification_required ||
      exam.qualification_required.toLowerCase().includes(qualification.toLowerCase()) ||
      exam.qualification_required.toLowerCase().includes("any graduate");
    return ageOk && qualOk;
  };

  const handleCheck = (e) => {
    e.preventDefault();
    const eligible = exams.filter(evaluateEligibility);
    setBestMatch(eligible[0] || null);
    setOtherMatches(eligible.slice(1));
    setChecked(true);
  };

  return (
    <section className="match-section" style={{ padding: "60px 0" }}>
      <div className="wrap">
        <div className="section-head center" style={{ marginBottom: "36px" }}>
          <h2 style={{ fontSize: "32px" }}>Check Your Eligibility</h2>
          <p>Find the right exams based on your qualifications in seconds.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "24px", alignItems: "start" }}>
          {/* Left: form */}
          <form onSubmit={handleCheck} className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink-mute)", display: "block", marginBottom: "6px" }}>
                Highest Qualification
              </label>
              <select
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="exam-search-input"
                style={{ margin: 0, maxWidth: "100%" }}
                required
              >
                <option value="">Select qualification</option>
                {QUALIFICATION_OPTIONS.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink-mute)", display: "block", marginBottom: "6px" }}>
                Age
              </label>
              <input
                type="number"
                placeholder="e.g. 24"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="exam-search-input"
                style={{ margin: 0, maxWidth: "100%" }}
                required
              />
            </div>

            {/* Category & State — collected for future use, not yet applied to filtering
                since the Exam model doesn't have reservation-category or state fields. */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink-mute)", display: "block", marginBottom: "6px" }}>
                Category
              </label>
              <select className="exam-search-input" style={{ margin: 0, maxWidth: "100%" }} defaultValue="General">
                <option>General</option>
                <option>OBC</option>
                <option>SC</option>
                <option>ST</option>
                <option>EWS</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink-mute)", display: "block", marginBottom: "6px" }}>
                State / Location
              </label>
              <select className="exam-search-input" style={{ margin: 0, maxWidth: "100%" }} defaultValue="Tamil Nadu">
                <option>Tamil Nadu</option>
                <option>All India</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Check Eligibility
            </button>
          </form>

          {/* Right: result */}
          <div>
            {!checked && (
              <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
                <p className="meta">Fill in your details and click "Check Eligibility" to see your results.</p>
              </div>
            )}

            {checked && loading && <p className="section-head center">Loading...</p>}

            {checked && !loading && !bestMatch && (
              <div className="card" style={{ textAlign: "center", padding: "40px 24px" }}>
                <p style={{ fontSize: "16px", fontWeight: 700, marginBottom: "6px" }}>No matching exams found</p>
                <p className="meta">Try adjusting your qualification or age — or explore all exams below.</p>
                <Link to="/exams" style={{ display: "inline-block", marginTop: "16px" }}>
                  <button className="btn btn-outline">Browse All Exams</button>
                </Link>
              </div>
            )}

            {checked && !loading && bestMatch && (
              <>
                <div className="card" style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                    <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#22c55e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>✓</span>
                    <div>
                      <p style={{ fontSize: "15px", fontWeight: 700 }}>
                        <span style={{ color: "#16a34a" }}>Eligible</span> for {bestMatch.name}
                      </p>
                      <p className="meta" style={{ marginBottom: 0 }}>Based on your provided details</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "12px", alignItems: "center", padding: "10px 0", borderTop: "1px solid var(--line)" }}>
                      <div>
                        <p style={{ fontSize: "11px", color: "var(--ink-mute)" }}>Required qualification</p>
                        <p style={{ fontSize: "13px", fontWeight: 600 }}>{bestMatch.qualification_required || "Any"}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: "11px", color: "var(--ink-mute)" }}>Your qualification</p>
                        <p style={{ fontSize: "13px", fontWeight: 600 }}>{qualification}</p>
                      </div>
                      <span style={{ background: "var(--green-bg)", color: "#16a34a", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px", whiteSpace: "nowrap" }}>
                        Meets requirement
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "12px", alignItems: "center", padding: "10px 0", borderTop: "1px solid var(--line)" }}>
                      <div>
                        <p style={{ fontSize: "11px", color: "var(--ink-mute)" }}>Required age</p>
                        <p style={{ fontSize: "13px", fontWeight: 600 }}>{bestMatch.age_limit_min}-{bestMatch.age_limit_max}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: "11px", color: "var(--ink-mute)" }}>Your age</p>
                        <p style={{ fontSize: "13px", fontWeight: 600 }}>{age}</p>
                      </div>
                      <span style={{ background: "var(--green-bg)", color: "#16a34a", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px", whiteSpace: "nowrap" }}>
                        Meets requirement
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: "11px", color: "var(--ink-mute)" }}>
                    📄 Checked against: {bestMatch.conducting_authority} Official Notification, last verified {formatDate(bestMatch.last_verified_at)}.
                  </p>
                </div>

                <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <p style={{ fontSize: "14.5px", fontWeight: 700, marginBottom: "2px" }}>
                      Explore exams matching your profile
                    </p>
                    <p className="meta" style={{ marginBottom: 0 }}>
                      {otherMatches.length > 0
                        ? `${otherMatches.length} more exam${otherMatches.length !== 1 ? "s" : ""} you're eligible for.`
                        : "Discover more opportunities tailored to your qualifications."}
                    </p>
                  </div>
                  <Link to="/exams">
                    <button className="btn btn-primary">Exam Discovery →</button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EligibilityChecker;