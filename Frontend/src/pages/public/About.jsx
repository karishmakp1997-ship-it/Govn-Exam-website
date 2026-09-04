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
      {/* Hero banner image */}
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <img src="/images/about.png" alt="About Vetri AI Coach" style={{ width: "100%", height: "330px", objectFit: "cover", display: "block" }} />
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Our Story */}
        <div className="card" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "32px", alignItems: "center", padding: "32px", marginBottom: "48px" }}>
          <div style={{ width: "100%", height: "220px", borderRadius: "16px", background: "linear-gradient(135deg, #ede9fe, #ddd6fe)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img src="/images/veedu.png" alt="Our Story" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <p style={{ fontSize: "12px", fontWeight: 800, color: "var(--violet)", letterSpacing: "0.5px", marginBottom: "8px" }}>📖 OUR STORY</p>
            <h2 style={{ fontSize: "26px", fontWeight: 900, marginBottom: "16px" }}>Education. Innovation. Impact.</h2>
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
          <h2 style={{ fontSize: "26px", fontWeight: 900, marginBottom: "10px" }}>🛡️ How We Verify Information</h2>
          <p style={{ fontSize: "14px", color: "var(--ink-mute)", maxWidth: "560px", margin: "0 auto" }}>
            Every piece of content we share goes through a strict verification process to ensure accuracy, reliability, and authenticity.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px", marginBottom: "56px" }}>
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
          <h2 style={{ fontSize: "26px", fontWeight: 900 }}>🔒 Security &amp; Privacy Commitments</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px", marginBottom: "18px" }}>
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "18px", marginBottom: "56px" }}>
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
        <img src="/images/bottom.png" alt="Verified. Transparent. Trusted." style={{ width: "100%", height: "370px", objectFit: "cover", display: "block" }} />
      </div>
    </div>
  );
}

export default About;