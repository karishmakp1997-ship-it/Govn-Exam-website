import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function MockTestTaking() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const [visited, setVisited] = useState({ 0: true });
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/mock-tests/${testId}/`, { headers: getAuthHeaders() })
      .then((res) => {
        if (res.status === 401) throw new Error("Please log in to take this test.");
        if (!res.ok) throw new Error("Failed to load test");
        return res.json();
      })
      .then((data) => {
        setTest(data);
        setAttemptId(data.attempt_id);
        setSecondsLeft(data.duration_minutes * 60);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [testId]);

  const handleSubmit = useCallback(async () => {
    if (submitting || result || !attemptId) return;
    setSubmitting(true);
    clearInterval(timerRef.current);
    try {
      const res = await fetch(`${API_BASE_URL}/api/mock-tests/${testId}/submit/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ attempt_id: attemptId, answers }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, testId, attemptId, submitting, result]);

  useEffect(() => {
    if (secondsLeft === null || result) return;
    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }
    timerRef.current = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [secondsLeft, result, handleSubmit]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const goTo = (idx) => {
    setCurrentIndex(idx);
    setVisited((p) => ({ ...p, [idx]: true }));
  };

  const selectAnswer = (questionId, option) => setAnswers((p) => ({ ...p, [questionId]: option }));
  const toggleMark = (questionId) => setMarked((p) => ({ ...p, [questionId]: !p[questionId] }));

  const saveAndNext = () => {
    if (!test) return;
    if (currentIndex < test.questions.length - 1) goTo(currentIndex + 1);
  };

  const markAndNext = () => {
    if (!test) return;
    toggleMark(test.questions[currentIndex].id);
    if (currentIndex < test.questions.length - 1) goTo(currentIndex + 1);
  };

  const sharedStyle = (
    <style>{`
      .mtt-page {
        background: linear-gradient(135deg, #ede9fe 0%, #e0e7ff 35%, #dbeafe 65%, #f0f9ff 100%);
        min-height: 100vh;
      }

      .mtt-topbar {
        background: linear-gradient(90deg, #ffffff, #f5f3ff);
        border-bottom: 1px solid #ede9fe;
        padding: 14px 24px;
        position: sticky;
        top: 0;
        z-index: 20;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 12px rgba(124, 58, 237, 0.05);
      }

      .mtt-topbar h2 {
        font-size: 16px;
        font-weight: 800;
        color: #1e1b4b;
        margin: 0;
      }

      .mtt-timer {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 9px 18px;
        border-radius: 999px;
        font-weight: 800;
        font-size: 16px;
        transition: background 0.3s ease, color 0.3s ease;
      }

      .mtt-body {
        max-width: 1150px;
        margin: 0 auto;
        padding: 24px;
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 22px;
        align-items: start;
      }

      .mtt-question-panel {
        background: #ffffff;
        border-radius: 20px;
        padding: 28px;
        box-shadow: 0 8px 26px rgba(124, 58, 237, 0.08);
        border: 1px solid rgba(124, 58, 237, 0.08);
      }

      .mtt-q-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 18px;
      }

      .mtt-q-title {
        font-size: 18px;
        font-weight: 800;
        color: #1e1b4b;
        margin: 0;
      }

      .mtt-q-meta {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .mtt-marks-badge {
        font-size: 11.5px;
        font-weight: 700;
        color: #7c3aed;
        background: #f5f3ff;
        padding: 5px 12px;
        border-radius: 999px;
      }

      .mtt-flag-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
      }

      .mtt-subject-tag {
        display: inline-block;
        font-size: 11.5px;
        color: #7c3aed;
        font-weight: 700;
        background: #ede9fe;
        padding: 4px 12px;
        border-radius: 999px;
        margin-bottom: 14px;
      }

      .mtt-q-text {
        font-size: 16px;
        font-weight: 500;
        color: #1e293b;
        margin-bottom: 24px;
        line-height: 1.6;
      }

      .mtt-options {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 26px;
      }

      .mtt-option {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 18px;
        border-radius: 14px;
        cursor: pointer;
        border: 1.5px solid #e2e8f0;
        background: #fafafa;
        transition: border-color 0.2s ease, background 0.2s ease, transform 0.15s ease;
      }

      .mtt-option:hover {
        transform: translateX(3px);
        border-color: #c4b5fd;
      }

      .mtt-option.selected {
        border-color: #7c3aed;
        background: linear-gradient(135deg, #f5f3ff, #eff6ff);
        box-shadow: 0 4px 14px rgba(124, 58, 237, 0.12);
      }

      .mtt-radio {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid #cbd5e1;
        flex-shrink: 0;
        box-sizing: border-box;
        transition: all 0.2s ease;
      }

      .mtt-option.selected .mtt-radio {
        border: 6px solid #7c3aed;
      }

      .mtt-option-letter {
        font-size: 13.5px;
        font-weight: 800;
        color: #94a3b8;
      }

      .mtt-option.selected .mtt-option-letter {
        color: #7c3aed;
      }

      .mtt-option-text {
        font-size: 14.5px;
        color: #334155;
      }

      .mtt-nav-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        padding-top: 20px;
        border-top: 1px solid #f1f5f9;
      }

      .mtt-btn-outline {
        padding: 11px 20px;
        border-radius: 10px;
        border: 1.5px solid #cbd5e1;
        background: #fff;
        color: #475569;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
      }

      .mtt-btn-outline:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .mtt-btn-mark {
        background: linear-gradient(135deg, #a78bfa, #7c3aed);
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 11px 18px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
      }

      .mtt-btn-primary {
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 11px 20px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 8px 18px -6px rgba(124, 58, 237, 0.4);
      }

      .mtt-btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .mtt-palette {
        background: #ffffff;
        border-radius: 20px;
        padding: 22px;
        box-shadow: 0 8px 26px rgba(124, 58, 237, 0.08);
        border: 1px solid rgba(124, 58, 237, 0.08);
        position: sticky;
        top: 86px;
      }

      .mtt-palette h4 {
        margin: 0 0 4px;
        font-size: 14.5px;
        font-weight: 800;
        color: #1e1b4b;
      }

      .mtt-palette-sub {
        font-size: 12px;
        color: #94a3b8;
        margin-bottom: 16px;
      }

      .mtt-legend {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px 10px;
        font-size: 11px;
        color: #64748b;
        margin-bottom: 18px;
        padding: 12px;
        background: #f8fafc;
        border-radius: 12px;
      }

      .mtt-legend-dot {
        display: inline-block;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        margin-right: 6px;
      }

      .mtt-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        margin-bottom: 20px;
      }

      .mtt-qbtn {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
        transition: transform 0.15s ease;
      }

      .mtt-qbtn:hover {
        transform: scale(1.08);
      }

      .mtt-submit-btn {
        width: 100%;
        justify-content: center;
        display: flex;
        align-items: center;
        background: linear-gradient(135deg, #16a34a, #15803d);
        color: #fff;
        border: none;
        border-radius: 12px;
        padding: 13px;
        font-size: 14px;
        font-weight: 800;
        cursor: pointer;
        box-shadow: 0 10px 22px -8px rgba(22, 163, 74, 0.4);
      }

      .mtt-submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .mtt-results-wrap {
        background: linear-gradient(135deg, #ede9fe 0%, #e0e7ff 35%, #dbeafe 65%, #f0f9ff 100%);
        min-height: 100vh;
        padding: 40px 20px;
      }

      .mtt-results-inner {
        max-width: 800px;
        margin: 0 auto;
      }

      .mtt-score-card {
        background: linear-gradient(135deg, #2563eb 0%, #7c3aed 55%, #c026d3 100%);
        border-radius: 24px;
        padding: 40px;
        text-align: center;
        color: #fff;
        margin-bottom: 26px;
        box-shadow: 0 20px 44px -12px rgba(124, 58, 237, 0.4);
      }

      .mtt-stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
        margin-bottom: 30px;
      }

      .mtt-stat-card {
        background: #fff;
        border-radius: 16px;
        padding: 20px;
        text-align: center;
        box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
      }

      .mtt-review-item {
        background: #fff;
        border-radius: 14px;
        padding: 18px;
        box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
        margin-bottom: 10px;
      }
    `}</style>
  );

  if (loading) {
    return (
      <>
        {sharedStyle}
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#7c3aed", fontWeight: 600 }}>Loading test...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {sharedStyle}
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#dc2626" }}>{error}</p>
        </div>
      </>
    );
  }

  if (result) {
    return (
      <>
        {sharedStyle}
        <div className="mtt-results-wrap">
          <div className="mtt-results-inner">
            <div className="mtt-score-card">
              <p style={{ fontSize: "13px", opacity: 0.85, letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: "6px" }}>{result.test_series}</p>
              <p style={{ fontSize: "48px", fontWeight: 900, margin: "8px 0" }}>{result.score} <span style={{ fontSize: "20px", fontWeight: 500, opacity: 0.85 }}>marks</span></p>
              <p style={{ fontSize: "14px", opacity: 0.9 }}>{result.accuracy}% accuracy</p>
            </div>

            <div className="mtt-stats-grid">
              <div className="mtt-stat-card">
                <p style={{ fontSize: "26px", fontWeight: 800, color: "#16a34a" }}>{result.correct_count}</p>
                <p style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>Correct</p>
              </div>
              <div className="mtt-stat-card">
                <p style={{ fontSize: "26px", fontWeight: 800, color: "#dc2626" }}>{result.wrong_count}</p>
                <p style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>Wrong</p>
              </div>
              <div className="mtt-stat-card">
                <p style={{ fontSize: "26px", fontWeight: 800, color: "#7c3aed" }}>{result.unattempted_count}</p>
                <p style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>Unattempted</p>
              </div>
            </div>

            <h3 style={{ fontSize: "17px", marginBottom: "14px", fontWeight: 800, color: "#1e1b4b" }}>Answer Review</h3>
            <div style={{ marginBottom: "28px" }}>
              {test.questions.map((q, idx) => {
                const b = result.breakdown.find((item) => item.question_id === q.id);
                const s = b?.status === "correct" ? { bg: "#ecfdf5", color: "#16a34a", label: "Correct" }
                  : b?.status === "wrong" ? { bg: "#fef2f2", color: "#dc2626", label: "Wrong" }
                  : { bg: "#f1f5f9", color: "#64748b", label: "Skipped" };
                return (
                  <div key={q.id} className="mtt-review-item">
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                      <p style={{ fontSize: "14px", fontWeight: 600, flex: 1 }}><span style={{ color: "#94a3b8", fontWeight: 700 }}>Q{idx + 1}.</span> {q.text}</p>
                      <span style={{ background: s.bg, color: s.color, fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px", whiteSpace: "nowrap" }}>{s.label}</span>
                    </div>
                    {b?.explanation && <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #f1f5f9" }}><strong style={{ color: "#334155" }}>Explanation:</strong> {b.explanation}</p>}
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "center" }}>
              <button className="mtt-btn-primary" onClick={() => navigate("/mock-tests")}>Back to Mock Tests</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const question = test.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isLast = currentIndex === test.questions.length - 1;

  const getQuestionStatus = (idx, q) => {
    if (marked[q.id]) return "marked";
    if (answers[q.id] !== undefined) return "answered";
    if (visited[idx]) return "not-answered";
    return "not-visited";
  };

  const statusStyles = {
    marked: { bg: "linear-gradient(135deg, #a78bfa, #7c3aed)", color: "#fff", border: "none" },
    answered: { bg: "linear-gradient(135deg, #4ade80, #16a34a)", color: "#fff", border: "none" },
    "not-answered": { bg: "#fff", color: "#334155", border: "1.5px solid #e2e8f0" },
    "not-visited": { bg: "#f1f5f9", color: "#94a3b8", border: "none" },
  };

  return (
    <>
      {sharedStyle}
      <div className="mtt-page">
        <div className="mtt-topbar">
          <h2>{test.title}</h2>
          <div
            className="mtt-timer"
            style={
              secondsLeft < 60
                ? { background: "#fef2f2", color: "#dc2626" }
                : { background: "#ede9fe", color: "#7c3aed" }
            }
          >
            ⏱ {formatTime(secondsLeft)}
          </div>
        </div>

        <div className="mtt-body">
          <div className="mtt-question-panel">
            <div className="mtt-q-header">
              <h3 className="mtt-q-title">Question {currentIndex + 1}</h3>
              <div className="mtt-q-meta">
                <span className="mtt-marks-badge">+1.0 / -{test.negative_mark_value}</span>
                <button className="mtt-flag-btn" onClick={() => toggleMark(question.id)} title="Flag question">
                  {marked[question.id] ? "🚩" : "🏳️"}
                </button>
              </div>
            </div>

            <span className="mtt-subject-tag">
              {question.subject}{question.topic ? ` · ${question.topic}` : ""}
            </span>
            <p className="mtt-q-text">{question.text}</p>

            <div className="mtt-options">
              {["a", "b", "c", "d"].map((opt) => {
                const isSelected = answers[question.id] === opt;
                return (
                  <label
                    key={opt}
                    onClick={() => selectAnswer(question.id, opt)}
                    className={isSelected ? "mtt-option selected" : "mtt-option"}
                  >
                    <span className="mtt-radio" />
                    <span className="mtt-option-letter">{opt.toUpperCase()}.</span>
                    <span className="mtt-option-text">{question[`option_${opt}`]}</span>
                  </label>
                );
              })}
            </div>

            <div className="mtt-nav-row">
              <button className="mtt-btn-outline" disabled={currentIndex === 0} onClick={() => goTo(currentIndex - 1)}>
                ← Previous
              </button>
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="mtt-btn-mark" onClick={markAndNext}>
                  🚩 Mark for Review &amp; Next
                </button>
                {!isLast ? (
                  <button className="mtt-btn-primary" onClick={saveAndNext}>Save &amp; Next</button>
                ) : (
                  <button className="mtt-btn-primary" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Test"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mtt-palette">
            <h4>Question Palette</h4>
            <p className="mtt-palette-sub">{answeredCount} of {test.questions.length} Answered</p>

            <div className="mtt-legend">
              <span><span className="mtt-legend-dot" style={{ background: "#16a34a" }}></span>Answered</span>
              <span><span className="mtt-legend-dot" style={{ background: "#fff", border: "1.5px solid #cbd5e1" }}></span>Not Answered</span>
              <span><span className="mtt-legend-dot" style={{ background: "#7c3aed" }}></span>Marked</span>
              <span><span className="mtt-legend-dot" style={{ background: "#cbd5e1" }}></span>Not Visited</span>
            </div>

            <div className="mtt-grid">
              {test.questions.map((q, idx) => {
                const status = getQuestionStatus(idx, q);
                const s = statusStyles[status];
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => goTo(idx)}
                    className="mtt-qbtn"
                    style={{
                      background: s.bg,
                      color: s.color,
                      border: s.border,
                      outline: isCurrent ? "2.5px solid #2563eb" : "none",
                      outlineOffset: "2px",
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <button className="mtt-submit-btn" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Test"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MockTestTaking;