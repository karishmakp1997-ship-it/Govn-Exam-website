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

// Mobile responsive rules for AICoach.
// Inline styles beat plain CSS specificity, so the responsive-critical
// properties (grid columns, padding, bubble width, etc.) live here as
// classes instead of inline, and everything else stays inline as before.
const AI_COACH_RESPONSIVE_CSS = `
.aicoach-page { padding: 20px; }
.aicoach-tabs-wrap { margin: 0 auto 16px; }
.aicoach-tab-btn { padding: 9px 20px; font-size: 13.5px; }
.aicoach-header { padding: 18px 24px; }
.aicoach-header-title { font-size: 18px; }
.aicoach-header-sub { font-size: 12.5px; }
.aicoach-grid { display: grid; grid-template-columns: 1fr 320px; gap: 16px; }
.aicoach-chat-panel { height: 70vh; }
.aicoach-welcome-banner { padding: 24px; gap: 18px; }
.aicoach-welcome-title { font-size: 18px; }
.aicoach-welcome-sub { font-size: 13.5px; }
.aicoach-welcome-emoji { font-size: 40px; }
.aicoach-quick-prompts { padding: 16px 24px; }
.aicoach-quick-prompt-btn { padding: 8px 14px; font-size: 12.5px; }
.aicoach-messages { padding: 8px 24px; gap: 16px; }
.aicoach-bubble { max-width: 70%; padding: 12px 16px; font-size: 14px; }
.aicoach-input-form { padding: 16px 24px; gap: 10px; }
.aicoach-input-field { padding: 12px 16px; font-size: 14px; }
.aicoach-send-btn { width: 44px; height: 44px; font-size: 16px; }
.aicoach-sidebar { gap: 16px; }

@media (max-width: 768px) {
  .aicoach-page { padding: 14px; }
  .aicoach-header { padding: 14px 16px; flex-wrap: wrap; }
  .aicoach-header-title { font-size: 16px; }
  .aicoach-grid { grid-template-columns: 1fr; }
  .aicoach-chat-panel { height: 60vh; }
  .aicoach-welcome-banner { padding: 16px; gap: 12px; }
  .aicoach-welcome-title { font-size: 15.5px; }
  .aicoach-welcome-sub { font-size: 12.5px; }
  .aicoach-welcome-emoji { display: none; }
  .aicoach-quick-prompts { padding: 12px 16px; }
  .aicoach-messages { padding: 8px 16px; }
  .aicoach-bubble { max-width: 85%; }
  .aicoach-input-form { padding: 12px 16px; }
}

@media (max-width: 375px) {
  .aicoach-page { padding: 10px; }
  .aicoach-tab-btn { padding: 8px 14px; font-size: 12px; }
  .aicoach-header { padding: 12px; }
  .aicoach-header-title { font-size: 14.5px; }
  .aicoach-header-sub { font-size: 11px; }
  .aicoach-chat-panel { height: 65vh; }
  .aicoach-welcome-banner { padding: 12px; }
  .aicoach-welcome-title { font-size: 14px; }
  .aicoach-welcome-sub { font-size: 11.5px; }
  .aicoach-quick-prompt-btn { padding: 6px 10px; font-size: 11.5px; }
  .aicoach-bubble { max-width: 90%; font-size: 13px; padding: 10px 12px; }
  .aicoach-input-field { padding: 10px 12px; font-size: 13px; }
  .aicoach-send-btn { width: 38px; height: 38px; font-size: 14px; }
}
`;

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
    <div className="aicoach-page" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <style>{AI_COACH_RESPONSIVE_CSS}</style>

      <div className="aicoach-tabs-wrap" style={{ maxWidth: "1200px" }}>
        <div style={{ display: "inline-flex", gap: "6px", background: "#fff", borderRadius: "12px", padding: "5px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <button
            onClick={() => setActiveTab("chat")}
            className="aicoach-tab-btn"
            style={{
              borderRadius: "9px", border: "none", fontWeight: 700, cursor: "pointer",
              background: activeTab === "chat" ? "linear-gradient(135deg, var(--blue), var(--violet))" : "transparent",
              color: activeTab === "chat" ? "#fff" : "var(--ink-mute)",
            }}
          >
            💬 AI Chat
          </button>
          <button
            onClick={() => setActiveTab("interview")}
            className="aicoach-tab-btn"
            style={{
              borderRadius: "9px", border: "none", fontWeight: 700, cursor: "pointer",
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
          <div
            className="aicoach-header"
            style={{ background: "linear-gradient(135deg, var(--blue), var(--violet))", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <RobotAvatar size={44} />
              <div>
                <h2 className="aicoach-header-title" style={{ color: "#fff", fontWeight: 800 }}>Vetri AI Coach</h2>
                <p className="aicoach-header-sub" style={{ color: "rgba(255,255,255,0.85)" }}>Always here to help</p>
              </div>
            </div>
          </div>

          <div className="aicoach-grid" style={{ alignItems: "start" }}>
            {/* Chat panel */}
            <div className="aicoach-chat-panel" style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 4px 14px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
              {/* Welcome banner */}
              <div className="aicoach-welcome-banner" style={{ background: "linear-gradient(135deg, #eff6ff, #f5f3ff)", borderRadius: "16px 16px 0 0", display: "flex", alignItems: "center" }}>
                <RobotAvatar size={56} />
                <div>
                  <h3 className="aicoach-welcome-title" style={{ fontWeight: 800, color: "var(--ink)" }}>Hi! I'm your Vetri AI Coach.</h3>
                  <p className="aicoach-welcome-sub" style={{ color: "var(--ink-mute)" }}>Ask me about exams, eligibility, deadlines, or your study plan.</p>
                </div>
                <span className="aicoach-welcome-emoji" style={{ marginLeft: "auto" }}>📚</span>
              </div>

              {/* Quick prompts */}
              <div className="aicoach-quick-prompts" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p.text}
                    onClick={() => sendMessage(p.text)}
                    className="aicoach-quick-prompt-btn"
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      background: "#fff", border: "1px solid var(--line)", borderRadius: "999px",
                      fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    <span>{p.icon}</span> {p.text}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="aicoach-messages" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                {messages.map((m, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: "10px" }}>
                    {m.role === "assistant" && <RobotAvatar size={32} />}
                    <div
                      className="aicoach-bubble"
                      style={{
                        borderRadius: "14px",
                        background: m.role === "user" ? "var(--violet)" : "#f1f5f9",
                        color: m.role === "user" ? "#fff" : "var(--ink)",
                        lineHeight: 1.5,
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
              <form onSubmit={handleSubmit} className="aicoach-input-form" style={{ display: "flex", borderTop: "1px solid var(--line)" }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message Vetri AI Coach..."
                  className="aicoach-input-field"
                  style={{ flex: 1, borderRadius: "999px", border: "1px solid var(--line)" }}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="aicoach-send-btn"
                  style={{
                    borderRadius: "50%",
                    background: "var(--violet)", color: "#fff", border: "none",
                    cursor: "pointer", flexShrink: 0,
                  }}
                >
                  ➤
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="aicoach-sidebar" style={{ display: "flex", flexDirection: "column" }}>
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