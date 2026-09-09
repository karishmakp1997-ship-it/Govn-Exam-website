// Mobile responsive rules for About.
// Same approach as the other pages: responsive-critical properties (grids,
// padding, image heights, font sizes) live in classes since inline styles
// beat plain CSS specificity.
const ABOUT_RESPONSIVE_CSS = `
.about-hero-img { height: 330px; }
.about-content { padding: 40px 24px; }
.about-story-card { display: grid; grid-template-columns: 260px 1fr; gap: 32px; align-items: center; padding: 32px; margin-bottom: 48px; }
.about-story-img { height: 220px; }
.about-story-title { font-size: 26px; }
.about-section-title { font-size: 26px; }
.about-verify-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 56px; }
.about-privacy-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-bottom: 18px; }
.about-privacy-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; margin-bottom: 56px; }
.about-bottom-img { height: 370px; }

@media (max-width: 768px) {
  .about-hero-img { height: 180px; }
  .about-content { padding: 24px 16px; }
  .about-story-card { grid-template-columns: 1fr; padding: 20px; gap: 18px; margin-bottom: 32px; }
  .about-story-img { height: 180px; }
  .about-story-title { font-size: 21px; }
  .about-section-title { font-size: 20px; }
  .about-verify-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 36px; }
  .about-privacy-grid-3 { grid-template-columns: 1fr; gap: 14px; }
  .about-privacy-grid-2 { grid-template-columns: 1fr; gap: 14px; margin-bottom: 36px; }
  .about-bottom-img { height: 200px; }
}

@media (max-width: 375px) {
  .about-hero-img { height: 140px; }
  .about-content { padding: 18px 12px; }
  .about-story-title { font-size: 18px; }
  .about-section-title { font-size: 17px; }
  .about-verify-grid { grid-template-columns: 1fr; }
  .about-bottom-img { height: 150px; }
}
`;

function About() {
  const verifySteps = [
    { num: "01", icon: "🛡️", title: "Official Sources", color: "#2563eb", bg: "#eff6ff", desc: "We collect information from trusted government portals, official websites & reliable publications." },
    { num: "02", icon: "📋", title: "Cross-Verification", color: "#16a34a", bg: "#ecfdf5", desc: "Our team cross-checks the facts with multiple sources to ensure accuracy and consistency." },
    { num: "03", icon: "🏅", title: "Expert Review", color: "#7c3aed", bg: "#f5f3ff", desc: "Subject matter experts review and validate the content for exam relevance and correctness." },
    { num: "04", icon: "✅", title: "Published with Trust", color: "#d97706", bg: "#fff7ed", desc: "Only verified and accurate content is published for your confident preparation." },
  ];

  const privacyCards = [
    { icon: "🛡️", title: "Your Data is Encrypted", color: "#2563eb", bg: "#eff6ff", desc: "We use industry-standard encryption to protect your personal information and ensure safe storage." },
    { icon: "🙈", title: "We Never Sell Your Information", color: "#d97706", bg: "#fff7ed", desc: "Your data will never be shared or sold to third parties. Ever." },
    { icon: "🔐", title: "Role-based Access for Admin Data", color: "#7c3aed", bg: "#f5f3ff", desc: "Only authorized personnel have access to admin data with strict role controls." },
    { icon: "🔔", title: "You Control Your Notification Preferences", color: "#0891b2", bg: "#ecfeff", desc: "Choose what you want to receive and how you want to receive it. You're in control." },
    { icon: "🧠", title: "Transparent About AI Capabilities", color: "#db2777", bg: "#fdf2f8", desc: "We're open about how our AI works and how it helps you learn better." },
  ];

  return (
    <div style={{ background: "#f8fafc" }}> <br />
      <style>{ABOUT_RESPONSIVE_CSS}</style>
      {/* Hero banner image */}
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <img src="/images/about.png" alt="About Vetri AI Coach" className="about-hero-img" style={{ width: "100%", objectFit: "cover", display: "block" }} />
      </div>

      <div className="about-content" style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Our Story */}
        <div className="card about-story-card">
          <div className="about-story-img" style={{ width: "100%", borderRadius: "16px", background: "linear-gradient(135deg, #ede9fe, #ddd6fe)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img src="/images/veedu.png" alt="Our Story" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <p style={{ fontSize: "12px", fontWeight: 800, color: "var(--violet)", letterSpacing: "0.5px", marginBottom: "8px" }}>📖 OUR STORY</p>
            <h2 className="about-story-title" style={{ fontWeight: 900, marginBottom: "16px" }}>Education. Innovation. Impact.</h2>
            <p style={{ fontSize: "14.5px", color: "var(--ink-mute)", lineHeight: 1.7, marginBottom: "14px" }}>
              Born out of the transformation of information overload, Vetri AI was created by a team of education experts and AI technologists. We realized that aspirants have incredible potential – they just need the right guidance at the right time.
            </p>
            <p style={{ fontSize: "14.5px", color: "var(--ink-mute)", lineHeight: 1.7 }}>
              We bring reliable content, smart AI, and a human touch together in one platform to make exam preparation <strong style={{ color: "var(--ink)" }}>simple, smarter</strong> and <strong style={{ color: "var(--ink)" }}>more effective.</strong>
            </p>
          </div>
        </div>

        {/* How We Verify Information */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 className="about-section-title" style={{ fontWeight: 900, marginBottom: "10px" }}>🛡️ How We Verify Information</h2>
          <p style={{ fontSize: "14px", color: "var(--ink-mute)", maxWidth: "560px", margin: "0 auto" }}>
            Every piece of content we share goes through a strict verification process to ensure accuracy, reliability, and authenticity.
          </p>
        </div>

        <div className="about-verify-grid">
          {verifySteps.map((step) => (
            <div key={step.num} className="card" style={{ textAlign: "center" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: step.bg, color: step.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", margin: "0 auto 14px" }}>
                {step.icon}
              </div>
              <p style={{ fontSize: "13px", fontWeight: 800, color: step.color, marginBottom: "6px" }}>{step.num}</p>
              <h4 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "10px" }}>{step.title}</h4>
              <p style={{ fontSize: "12.5px", color: "var(--ink-mute)", lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Security & Privacy */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 className="about-section-title" style={{ fontWeight: 900 }}>🔒 Security &amp; Privacy Commitments</h2>
        </div>

        <div className="about-privacy-grid-3">
          {privacyCards.slice(0, 3).map((c) => (
            <div key={c.title} className="card" style={{ display: "flex", gap: "14px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: c.bg, color: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                {c.icon}
              </div>
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 800, color: c.color, marginBottom: "6px" }}>{c.title}</h4>
                <p style={{ fontSize: "12.5px", color: "var(--ink-mute)", lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="about-privacy-grid-2">
          {privacyCards.slice(3).map((c) => (
            <div key={c.title} className="card" style={{ display: "flex", gap: "14px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: c.bg, color: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                {c.icon}
              </div>
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 800, color: c.color, marginBottom: "6px" }}>{c.title}</h4>
                <p style={{ fontSize: "12.5px", color: "var(--ink-mute)", lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom verified banner image */}
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <img src="/images/bottom.png" alt="Verified. Transparent. Trusted." className="about-bottom-img" style={{ width: "100%", objectFit: "cover", display: "block" }} />
      </div>
    </div>
  );
}

export default About;