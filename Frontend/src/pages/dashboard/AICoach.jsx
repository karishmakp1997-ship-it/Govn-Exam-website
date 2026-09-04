import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import InterviewCoach from "./InterviewCoach";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const QUICK_PROMPTS = [
  { icon: "👤", text: "Am I eligible for TNPSC?" },
  { icon: "📅", text: "When does SSC CGL close?" },
  { icon: "📄", text: "How do mock tests work?" },
  { icon: "⭐", text: "What's included in Premium?" },
];

// Placeholder — no real study-plan tracking backend exists yet.
// Replace with real data once Performance / study-plan tracking is built.
const PLACEHOLDER_TODAY_PLAN = [
  { label: "Mock Test", done: false },
  { label: "Revision", done: true },
  { label: "Practice", done: true },
  { label: "Notes", done: false },
];
const PLACEHOLDER_STUDY_PLAN = [
  { week: "Week 1-2", subject: "Polity", percent: 75, color: "var(--violet)" },
  { week: "Week 3-4", subject: "History", percent: 40, color: "#16a34a" },
];

function RobotAvatar({ size = 44 }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: "linear-gradient(135deg, #e0e7ff, #f3e8ff)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.5, flexShrink: 0,
      }}
    >
      🤖
    </div>
  );
}

function AICoach() {
  const [activeTab, setActiveTab] = useState("chat"); // 'chat' | 'interview'
  const { isLoggedIn, requireAuth } = useAuth();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me about exams, eligibility, deadlines, or your study plan." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    if (!isLoggedIn) {
      requireAuth("signup");
      return;
    }

    const newMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setSending(true);

    try {
      const history = newMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch(`${API_BASE_URL}/api/ai-coach/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ message: trimmed, history }),
      });

      if (res.status === 401) {
        requireAuth("login");
        setSending(false);
        return;
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto 16px" }}>
        <div style={{ display: "inline-flex", gap: "6px", background: "#fff", borderRadius: "12px", padding: "5px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <button
            onClick={() => setActiveTab("chat")}
            style={{
              padding: "9px 20px", borderRadius: "9px", border: "none", fontSize: "13.5px", fontWeight: 700, cursor: "pointer",
              background: activeTab === "chat" ? "linear-gradient(135deg, var(--blue), var(--violet))" : "transparent",
              color: activeTab === "chat" ? "#fff" : "var(--ink-mute)",
            }}
          >
            💬 AI Chat
          </button>
          <button
            onClick={() => setActiveTab("interview")}
            style={{
              padding: "9px 20px", borderRadius: "9px", border: "none", fontSize: "13.5px", fontWeight: 700, cursor: "pointer",
              background: activeTab === "interview" ? "linear-gradient(135deg, var(--blue), var(--violet))" : "transparent",
              color: activeTab === "interview" ? "#fff" : "var(--ink-mute)",
            }}
          >
            🎙️ Interview Coach
          </button>
        </div>
      </div>

      {activeTab === "interview" ? (
        <InterviewCoach />
      ) : (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, var(--blue), var(--violet))", borderRadius: "16px", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <RobotAvatar size={44} />
              <div>
                <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 800 }}>Vetri AI Coach</h2>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "12.5px" }}>Always here to help</p>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "16px", alignItems: "start" }}>
            {/* Chat panel */}
            <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 4px 14px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", height: "70vh" }}>
              {/* Welcome banner */}
              <div style={{ background: "linear-gradient(135deg, #eff6ff, #f5f3ff)", borderRadius: "16px 16px 0 0", padding: "24px", display: "flex", alignItems: "center", gap: "18px" }}>
                <RobotAvatar size={56} />
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--ink)" }}>Hi! I'm your Vetri AI Coach.</h3>
                  <p style={{ fontSize: "13.5px", color: "var(--ink-mute)" }}>Ask me about exams, eligibility, deadlines, or your study plan.</p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: "40px" }}>📚</span>
              </div>

              {/* Quick prompts */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", padding: "16px 24px" }}>
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p.text}
                    onClick={() => sendMessage(p.text)}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      background: "#fff", border: "1px solid var(--line)", borderRadius: "999px",
                      padding: "8px 14px", fontSize: "12.5px", fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    <span>{p.icon}</span> {p.text}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "8px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {messages.map((m, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: "10px" }}>
                    {m.role === "assistant" && <RobotAvatar size={32} />}
                    <div
                      style={{
                        maxWidth: "70%", padding: "12px 16px", borderRadius: "14px",
                        background: m.role === "user" ? "var(--violet)" : "#f1f5f9",
                        color: m.role === "user" ? "#fff" : "var(--ink)",
                        fontSize: "14px", lineHeight: 1.5,
                      }}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <RobotAvatar size={32} />
                    <div style={{ padding: "12px 16px", borderRadius: "14px", background: "#f1f5f9", color: "var(--ink-mute)", fontSize: "13px" }}>
                      Typing...
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", padding: "16px 24px", borderTop: "1px solid var(--line)" }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message Vetri AI Coach..."
                  style={{ flex: 1, padding: "12px 16px", borderRadius: "999px", border: "1px solid var(--line)", fontSize: "14px" }}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  style={{
                    width: "44px", height: "44px", borderRadius: "50%",
                    background: "var(--violet)", color: "#fff", border: "none",
                    fontSize: "16px", cursor: "pointer", flexShrink: 0,
                  }}
                >
                  ➤
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="card">
                <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px", color: "var(--violet)" }}>📅 Today's Plan</h4>
                {PLACEHOLDER_TODAY_PLAN.map((item) => (
                  <label key={item.label} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 0", cursor: "pointer" }}>
                    <input type="checkbox" defaultChecked={item.done} style={{ width: "16px", height: "16px", accentColor: "var(--violet)" }} readOnly />
                    <span style={{ fontSize: "13.5px" }}>{item.label}</span>
                  </label>
                ))}
              </div>

              <div className="card">
                <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "14px", color: "var(--violet)" }}>📈 Adaptive Study Plan</h4>
                {PLACEHOLDER_STUDY_PLAN.map((p) => (
                  <div key={p.subject} style={{ marginBottom: "14px" }}>
                    <p style={{ fontSize: "10.5px", color: "var(--ink-mute)", textTransform: "uppercase", letterSpacing: "0.4px" }}>{p.week}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "13.5px", fontWeight: 700 }}>{p.subject}</span>
                      <span style={{ fontSize: "12px", fontWeight: 700 }}>{p.percent}%</span>
                    </div>
                    <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ width: `${p.percent}%`, height: "100%", background: p.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "linear-gradient(135deg, var(--blue), var(--violet))", borderRadius: "14px", padding: "20px", color: "#fff" }}>
                <p style={{ fontSize: "22px", marginBottom: "6px" }}>👑</p>
                <h4 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "4px" }}>Upgrade to Premium</h4>
                <p style={{ fontSize: "12.5px", opacity: 0.9, marginBottom: "14px" }}>Unlock advanced features, exclusive mock tests & more.</p>
                <Link to="/pricing" style={{ textDecoration: "none" }}>
                  <button style={{ width: "100%", background: "#fff", color: "var(--violet)", border: "none", borderRadius: "10px", padding: "10px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
                    Explore Premium →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AICoach;