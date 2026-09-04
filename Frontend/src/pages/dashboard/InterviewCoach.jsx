import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const QUESTION_SETS = {
  hr: [
    "Tell me about yourself and why you're preparing for this exam.",
    "What are your key strengths and weaknesses?",
    "Why do you want to work in this government service specifically?",
    "Describe a situation where you had to handle pressure or a difficult decision.",
    "Where do you see yourself in five years?",
  ],
  subject: [
    "Explain a core concept from your optional/subject area in simple terms.",
    "How would you apply your subject knowledge to public administration?",
    "What recent development in your field of study interests you most?",
    "How do you stay updated with developments in your subject area?",
    "Can you explain a topic from your subject that you find most challenging?",
  ],
  current_affairs: [
    "Discuss a recent national event and its significance.",
    "What's your view on a recent international development affecting India?",
    "Discuss a recent government scheme and its expected impact.",
    "What recent economic development do you think is most important right now?",
    "How do you stay updated with current affairs on a daily basis?",
  ],
};

const CATEGORY_META = {
  hr: { title: "HR & Personal Questions", desc: "Master the self-intro and behavioral questions.", icon: "👤", color: "#7c3aed", bg: "#f5f3ff", image: "/images/test2.png" },
  subject: { title: "Subject-Specific Questions", desc: "Dive deep into your optional and core subjects.", icon: "🎓", color: "#2563eb", bg: "#eff6ff", image: "/images/test3.png" },
  current_affairs: { title: "Current Affairs Questions", desc: "Discuss recent national and international events.", icon: "🌍", color: "#16a34a", bg: "#ecfdf5", image: "/images/test4.png" },
};

const STEPS = [
  { num: 1, icon: "🤖", title: "AI Interviewer", desc: "Your AI interviewer", color: "#7c3aed" },
  { num: 2, icon: "❓", title: "Question", desc: "AI asks you questions", color: "#2563eb" },
  { num: 3, icon: "🎤", title: "Your Answer", desc: "You respond", color: "#16a34a" },
  { num: 4, icon: "📊", title: "AI Evaluation", desc: "AI evaluates your answer", color: "#d97706" },
  { num: 5, icon: "⏭️", title: "Next Question", desc: "Continue the interview", color: "#db2777" },
];

const SCORE_LABELS = [
  { key: "knowledge_score", label: "Knowledge", icon: "💡", color: "#7c3aed" },
  { key: "communication_score", label: "Communication", icon: "💬", color: "var(--blue)" },
  { key: "relevance_score", label: "Relevance", icon: "🎯", color: "#16a34a" },
  { key: "confidence_score", label: "Confidence", icon: "⚡", color: "#d97706" },
];

function InterviewCoach() {
  const { isLoggedIn, requireAuth } = useAuth();
  const [stage, setStage] = useState("intro"); // intro | interviewing | analyzing | results
  const [category, setCategory] = useState("hr");
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [transcript, setTranscript] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const questions = QUESTION_SETS[category];

  const startInterview = (cat) => {
    if (!isLoggedIn) {
      requireAuth("signup");
      return;
    }
    setCategory(cat);
    setStage("interviewing");
    setCurrentQ(0);
    setTranscript([]);
  };

  const handleNext = () => {
    if (!answer.trim()) return;
    const newTranscript = [...transcript, { question: questions[currentQ], answer: answer.trim() }];
    setTranscript(newTranscript);
    setAnswer("");

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      submitForAnalysis(newTranscript);
    }
  };

  const submitForAnalysis = async (finalTranscript) => {
    setStage("analyzing");
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/interview-coach/analyze/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ transcript: finalTranscript }),
      });
      if (!res.ok) throw new Error("Failed to analyze interview");
      const data = await res.json();
      setResult(data);
      setStage("results");
    } catch {
      setError("Something went wrong analyzing your interview. Please try again.");
      setStage("interviewing");
    }
  };

  const restart = () => {
    setStage("intro");
    setResult(null);
    setTranscript([]);
    setCurrentQ(0);
  };

  // ---- Interviewing / Analyzing screen ----
  if (stage === "interviewing" || stage === "analyzing") {
    return (
      <section style={{ background: "#f8fafc", minHeight: "100vh", padding: "60px 24px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "12.5px", fontWeight: 700, color: CATEGORY_META[category].color }}>
              {CATEGORY_META[category].title} — Question {currentQ + 1} of {questions.length}
            </span>
            <div style={{ display: "flex", gap: "4px" }}>
              {questions.map((_, i) => (
                <span key={i} style={{ width: "24px", height: "4px", borderRadius: "999px", background: i <= currentQ ? CATEGORY_META[category].color : "#e5e7eb" }} />
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: "28px", marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "20px" }}>
              <span style={{ fontSize: "22px" }}>🎙️</span>
              <p style={{ fontSize: "17px", fontWeight: 600, lineHeight: 1.5 }}>{questions[currentQ]}</p>
            </div>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
              disabled={stage === "analyzing"}
              style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid var(--line)", fontSize: "14px", resize: "vertical", fontFamily: "inherit" }}
            />

            {error && <p style={{ color: "#dc2626", fontSize: "13px", marginTop: "10px" }}>{error}</p>}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={!answer.trim() || stage === "analyzing"}
                style={{ background: "linear-gradient(135deg, var(--violet), #a855f7)" }}
              >
                {stage === "analyzing" ? "Analyzing your interview..." : currentQ < questions.length - 1 ? "Next Question →" : "Finish & Get Feedback"}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ---- Results screen ----
  if (stage === "results") {
    return (
      <section style={{ background: "#f8fafc", minHeight: "100vh", padding: "48px 24px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "6px" }}>Interview Complete!</h2>
            <p style={{ fontSize: "14px", color: "var(--ink-mute)" }}>Here's how you did, with AI-generated feedback.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
            {SCORE_LABELS.map((s) => (
              <div key={s.key} className="card" style={{ textAlign: "center", padding: "18px 12px" }}>
                <p style={{ fontSize: "18px", marginBottom: "6px" }}>{s.icon}</p>
                <p style={{ fontSize: "22px", fontWeight: 900, color: s.color }}>{result?.[s.key] ?? 0}</p>
                <p style={{ fontSize: "11px", color: "var(--ink-mute)", fontWeight: 600 }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div className="card" style={{ background: "linear-gradient(135deg, #ede9fe, #f3e8ff)", padding: "22px", marginBottom: "24px" }}>
            <h4 style={{ fontSize: "14.5px", fontWeight: 800, marginBottom: "10px" }}>✦ Improvement Areas</h4>
            <p style={{ fontSize: "13.5px", lineHeight: 1.7 }}>{result?.improvement_areas}</p>
          </div>

          <div style={{ textAlign: "center" }}>
            <button className="btn btn-primary" style={{ background: "linear-gradient(135deg, var(--violet), #a855f7)" }} onClick={restart}>
              Take Another Mock Interview
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ---- Intro / landing screen ----
  return (
    <section style={{ background: "#f8fafc", minHeight: "100vh", padding: "32px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <h2 style={{ fontSize: "34px", fontWeight: 900 }}>Interview <span style={{ color: "var(--violet)" }}>Coach</span></h2>
            <p style={{ fontSize: "14px", color: "var(--ink-mute)" }}>Practice with AI-simulated interviews for exams with a personality test stage.</p>
          </div>
          <img src="/images/test.png" alt="AI Interviewer" style={{ height: "160px", objectFit: "contain" }} />
        </div>

        {/* 5-step process */}
        <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "24px", marginBottom: "24px", flexWrap: "wrap", gap: "10px" }}>
          {STEPS.map((s, i) => (
            <div key={s.num} style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "140px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: s.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", margin: "0 auto 8px", position: "relative" }}>
                  {s.icon}
                  <span style={{ position: "absolute", top: "-4px", right: "-4px", background: "#fff", border: `2px solid ${s.color}`, color: s.color, borderRadius: "50%", width: "18px", height: "18px", fontSize: "10px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.num}</span>
                </div>
                <p style={{ fontSize: "13px", fontWeight: 800 }}>{s.title}</p>
                <p style={{ fontSize: "10.5px", color: "var(--ink-mute)" }}>{s.desc}</p>
              </div>
              {i < STEPS.length - 1 && <span style={{ color: "#cbd5e1", fontSize: "18px" }}>→</span>}
            </div>
          ))}
        </div>

        {/* Mock Interview Simulation banner */}
        <div style={{ background: "linear-gradient(135deg, #1e1b4b, #4c1d95)", borderRadius: "18px", padding: "28px", marginBottom: "24px", display: "grid", gridTemplateColumns: "220px 1fr auto", gap: "24px", alignItems: "center" }}>
          <img src="/images/test1.png" alt="Mock Interview" style={{ width: "100%", borderRadius: "12px" }} />
          <div>
            <h3 style={{ color: "#fff", fontSize: "22px", fontWeight: 800, marginBottom: "6px" }}>Mock Interview Simulation</h3>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "13.5px", marginBottom: "16px" }}>A full simulated interview experience just like the real one.</p>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              <span style={{ color: "#fff", fontSize: "12.5px" }}>⏱ <strong>15-20</strong> Minutes</span>
              <span style={{ color: "#fff", fontSize: "12.5px" }}>🎯 <strong>Real-time</strong> AI Evaluation</span>
              <span style={{ color: "#fff", fontSize: "12.5px" }}>✅ <strong>Instant</strong> Feedback</span>
            </div>
          </div>
          <button
            onClick={() => startInterview("hr")}
            style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)", color: "#fff", border: "none", borderRadius: "12px", padding: "14px 26px", fontWeight: 700, fontSize: "14px", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            ▶ Start Mock Interview
          </button>
        </div>

        {/* 3 category cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px", marginBottom: "24px" }}>
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <div key={key} className="card" style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: meta.bg, color: meta.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px", marginBottom: "12px" }}>
                  {meta.icon}
                </div>
                <h4 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "6px" }}>{meta.title}</h4>
                <p style={{ fontSize: "12.5px", color: "var(--ink-mute)", marginBottom: "14px" }}>{meta.desc}</p>
                <button
                  onClick={() => startInterview(key)}
                  style={{ background: "none", border: `1.5px solid ${meta.color}`, color: meta.color, borderRadius: "8px", padding: "9px 16px", fontSize: "12.5px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  Practice This →
                </button>
              </div>
              <img src={meta.image} alt={meta.title} style={{ width: "90px", height: "90px", objectFit: "contain", flexShrink: 0 }} />
            </div>
          ))}
        </div>

        {/* Sample Evaluation Report + Improvement Areas */}
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "18px" }}>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h4 style={{ fontSize: "15px", fontWeight: 800 }}>📊 Sample Evaluation Report</h4>
            </div>
            {[
              { label: "Knowledge", value: 85, color: "#7c3aed" },
              { label: "Communication", value: 72, color: "var(--blue)" },
              { label: "Relevance", value: 91, color: "#16a34a" },
              { label: "Confidence", value: 65, color: "#d97706" },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ fontSize: "12.5px", width: "110px", fontWeight: 600 }}>{s.label}</span>
                <div style={{ flex: 1, height: "8px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: `${s.value}%`, height: "100%", background: s.color }} />
                </div>
                <span style={{ fontSize: "12px", fontWeight: 700, width: "34px", textAlign: "right" }}>{s.value}%</span>
              </div>
            ))}
            <p style={{ fontSize: "11px", color: "var(--ink-mute)", marginTop: "10px" }}>* Sample report — your actual scores appear after completing a mock interview.</p>
          </div>

          <div className="card" style={{ position: "relative", overflow: "hidden", minHeight: "260px" }}>
            <h4 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "16px", position: "relative", zIndex: 2 }}>📈 Improvement Areas</h4>
            <div style={{ maxWidth: "60%", position: "relative", zIndex: 2 }}>
              <div style={{ background: "#fff7ed", borderRadius: "10px", padding: "12px", display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}>
                <span>✏️</span>
                <p style={{ fontSize: "12.5px" }}>Elaborate more on current affairs answers</p>
              </div>
              <div style={{ background: "#fef2f2", borderRadius: "10px", padding: "12px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span>📝</span>
                <p style={{ fontSize: "12.5px" }}>Reduce filler words (um, uh, like)</p>
              </div>
            </div>
            <img
              src="/images/test5.png"
              alt="Improvement"
              style={{ position: "absolute", right: "-10px", bottom: "-10px", width: "62%", objectFit: "contain", zIndex: 1 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default InterviewCoach;