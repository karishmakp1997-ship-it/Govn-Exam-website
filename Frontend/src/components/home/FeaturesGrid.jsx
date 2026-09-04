import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const THEME = {
  purple: { accent: '#7c3aed', from: '#a78bfa', to: '#7c3aed', bg: 'linear-gradient(160deg, #f5f3ff 0%, #ede9fe 100%)', iconBg: '#ede9fe' },
  violet: { accent: '#6d28d9', from: '#8b5cf6', to: '#6d28d9', bg: 'linear-gradient(160deg, #f5f3ff 0%, #e9e2ff 100%)', iconBg: '#ede9fe' },
  pink: { accent: '#db2777', from: '#f472b6', to: '#db2777', bg: 'linear-gradient(160deg, #fdf2f8 0%, #fce7f3 100%)', iconBg: '#fce7f3' },
  blue: { accent: '#2563eb', from: '#60a5fa', to: '#2563eb', bg: 'linear-gradient(160deg, #eff6ff 0%, #dbeafe 100%)', iconBg: '#dbeafe' },
  green: { accent: '#16a34a', from: '#4ade80', to: '#16a34a', bg: 'linear-gradient(160deg, #f0fdf4 0%, #dcfce7 100%)', iconBg: '#dcfce7' },
  cyan: { accent: '#0891b2', from: '#22d3ee', to: '#0891b2', bg: 'linear-gradient(160deg, #ecfeff 0%, #cffafe 100%)', iconBg: '#cffafe' },
  orange: { accent: '#ea580c', from: '#fb923c', to: '#ea580c', bg: 'linear-gradient(160deg, #fff7ed 0%, #ffedd5 100%)', iconBg: '#ffedd5' },
  amber: { accent: '#d97706', from: '#fbbf24', to: '#d97706', bg: 'linear-gradient(160deg, #fffbeb 0%, #fef3c7 100%)', iconBg: '#fef3c7' },
};

const FEATURES = [
  { icon: '/images/icon (1).png', type: 'purple', title: 'Eligibility Checker', desc: 'Check your eligibility instantly with accurate results.', to: '/eligibility' },
  { icon: '/images/icon (2).png', type: 'violet', title: 'Application Guidance', desc: 'Step-by-step guidance for every exam application.', popular: true, to: '/exams' },
  { icon: '/images/icon (3).png', type: 'pink', title: 'Deadline Tracker', desc: 'Never miss important exam dates and deadlines.', to: '/my-exams' },
  { icon: '/images/icon (4).png', type: 'blue', title: 'AI Tutor', desc: 'Get your doubts cleared with our AI-powered tutor.', to: '/ai-coach' },
  { icon: '/images/icon (5).png', type: 'green', title: 'Mock Tests', desc: 'Practice with real exam patterns and detailed analysis.', to: '/mock-tests' },
  { icon: '/images/icon (6).png', type: 'cyan', title: 'Performance Coach', desc: 'Identify weak areas and improve your performance.', to: '/performance' },
  { icon: '/images/icon (7).png', type: 'orange', title: 'Adaptive Study Plan', desc: 'A personalized plan that adapts to your progress.', to: '/study-materials' },
  { icon: '/images/icon (8).png', type: 'amber', title: 'Notification Center', desc: 'Get instant updates through app, email and WhatsApp.', to: '/my-exams' },
];

const PAIR_GAP_MS = 700;

function FeaturesGrid() {
  const listRef = useRef(null);
  const [revealedPairs, setRevealedPairs] = useState(0);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const totalPairs = Math.ceil(FEATURES.length / 2);
    const timers = [];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        for (let p = 1; p <= totalPairs; p++) {
          timers.push(setTimeout(() => setRevealedPairs(p), (p - 1) * PAIR_GAP_MS));
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="features-section">
      <style>{`
        .features-section {
          position: relative;
          padding: 76px 0 60px;
          overflow: hidden;
          background:
            radial-gradient(circle at 10% 10%, rgba(124, 58, 237, 0.06), transparent 30%),
            radial-gradient(circle at 90% 20%, rgba(37, 99, 235, 0.05), transparent 32%),
            #f8fafc;
        }

        .features-wrap {
          max-width: 1220px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .features-heading-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 44px;
          flex-wrap: wrap;
        }

        .features-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          border-radius: 999px;
          background: rgba(124, 58, 237, 0.1);
          color: #7c3aed;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 14px;
        }

        .features-title-row {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .features-title-accent {
          width: 5px;
          border-radius: 999px;
          background: linear-gradient(180deg, #2563eb, #7c3aed);
          align-self: stretch;
          min-height: 60px;
        }

        .features-title-row h1 {
          margin: 0 0 8px;
          font-size: 36px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -1px;
          line-height: 1.15;
        }

        .features-title-row h1 span {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .features-title-row p {
          margin: 0;
          color: #64748b;
          font-size: 15px;
        }

        .features-heading-img {
          max-width: 180px;
          opacity: 0.9;
        }

        .features-list {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
          margin-bottom: 44px;
        }

        .premium-feature-card {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          padding: 24px;
          min-height: 250px;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 8px 26px rgba(15, 23, 42, 0.06);
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.55s cubic-bezier(.16,1,.3,1), transform 0.55s cubic-bezier(.16,1,.3,1), box-shadow 0.25s ease;
        }

        .premium-feature-card.is-revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .premium-feature-card:hover {
          box-shadow: 0 18px 40px -8px rgba(15, 23, 42, 0.16);
          transform: translateY(-6px);
        }

        .feature-popular {
          position: absolute;
          top: 18px;
          right: 18px;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 5px 12px;
          border-radius: 999px;
          background: linear-gradient(135deg, #fbbf24, #f97316);
          color: #fff;
          font-size: 10.5px;
          font-weight: 800;
          box-shadow: 0 6px 14px -4px rgba(249, 115, 22, 0.5);
          z-index: 3;
        }

        .feature-dots {
          position: absolute;
          top: 22px;
          right: 20px;
          display: flex;
          gap: 4px;
          z-index: 3;
        }

        .feature-dots i {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.45;
          font-style: normal;
        }

        .feature-watermark {
          position: absolute;
          right: -18px;
          bottom: -10px;
          width: 150px;
          height: 150px;
          object-fit: contain;
          opacity: 0.14;
          pointer-events: none;
          transform: rotate(-6deg);
        }

        .premium-feature-icon {
          position: relative;
          z-index: 2;
          width: 60px;
          height: 60px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .premium-feature-icon img {
          width: 34px;
          height: 34px;
          object-fit: contain;
        }

        .feature-underline {
          position: relative;
          z-index: 2;
          width: 34px;
          height: 4px;
          border-radius: 999px;
          margin-bottom: 14px;
        }

        .premium-feature-content {
          position: relative;
          z-index: 2;
          flex: 1;
        }

        .premium-feature-content h3 {
          margin: 0 0 6px;
          font-size: 15.5px;
          font-weight: 800;
          color: #0f172a;
        }

        .premium-feature-content p {
          margin: 0;
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.55;
        }

        .feature-action {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          align-self: flex-start;
          margin-top: 18px;
          padding: 10px 10px 10px 20px;
          border-radius: 999px;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 10px 20px -8px rgba(0,0,0,0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .feature-action:hover {
          transform: translateY(-2px);
        }

        .feature-arrow {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255,255,255,0.28);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          flex-shrink: 0;
        }

        ${Object.entries(THEME).map(([type, t]) => `
        .feature-${type} { background: ${t.bg}; color: ${t.accent}; }
        .feature-${type} .premium-feature-icon { background: ${t.iconBg}; }
        .feature-${type} .feature-underline { background: ${t.accent}; }
        .feature-${type} .feature-action { background: linear-gradient(135deg, ${t.from}, ${t.to}); }
        `).join('')}

        .features-bottom-note {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
          padding: 26px 30px;
          border-radius: 20px;
          background: linear-gradient(135deg, #ede9fe, #dbeafe);
          border: 1px solid rgba(124, 58, 237, 0.15);
        }

        .bottom-note-icon {
          width: 44px;
          height: 44px;
          flex: 0 0 44px;
          border-radius: 14px;
          background: linear-gradient(135deg, #7c3aed, #2563eb);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 8px 18px -6px rgba(124, 58, 237, 0.4);
        }

        .features-bottom-note strong {
          display: block;
          font-size: 15px;
          color: #1e1b4b;
          margin-bottom: 3px;
        }

        .features-bottom-note p {
          margin: 0;
          font-size: 13px;
          color: #4c4a6e;
        }

        .features-bottom-note > div {
          flex: 1;
          min-width: 200px;
        }

        .features-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: #fff;
          font-size: 13.5px;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          box-shadow: 0 10px 22px -8px rgba(124, 58, 237, 0.45);
          transition: transform 0.2s ease;
        }

        .features-view-btn:hover {
          transform: translateY(-2px);
        }

        .features-wave, .features-decoration {
          display: none;
        }

        @media (max-width: 900px) {
          .features-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 620px) {
          .features-list {
            grid-template-columns: 1fr;
          }
          .features-title-row h1 {
            font-size: 28px;
          }
          .features-heading-img {
            display: none;
          }
        }
      `}</style>

      <div className="wrap features-wrap">

        <div className="features-heading-row">
          <div className="features-heading reveal">
            <div className="features-eyebrow">
              <span className="eyebrow-star">✦</span>
              ALL-IN-ONE PLATFORM
            </div>

            <div className="features-title-row">
              <div className="features-title-accent"></div>
              <div>
                <h1>
                  Everything you need,
                  <br />
                  in <span>one place</span>
                </h1>
                <p>Comprehensive tools designed for exam aspirants</p>
              </div>
            </div>
          </div>

          <img src="/images/std.png" alt="" className="features-heading-img" />
        </div>

        <div className="features-list" ref={listRef}>
          {FEATURES.map((feature, index) => {
            const pairIndex = Math.floor(index / 2);
            const isRevealed = pairIndex < revealedPairs;
            return (
              <article
                className={`premium-feature-card feature-${feature.type}${isRevealed ? ' is-revealed' : ''}`}
                key={feature.title}
                style={{ transitionDelay: isRevealed ? `${(index % 3) * 0.1}s` : '0s' }}
              >
                {feature.popular ? (
                  <div className="feature-popular">
                    <span>★</span>
                    Popular
                  </div>
                ) : (
                  <div className="feature-dots">
                    <i></i><i></i><i></i>
                  </div>
                )}

                <img src={feature.icon} alt="" className="feature-watermark" />

                <div className="premium-feature-icon">
                  <img src={feature.icon} alt="" />
                </div>

                <div className="feature-underline"></div>

                <div className="premium-feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>

                <Link to={feature.to} className="feature-action">
                  <span>Explore</span>
                  <span className="feature-arrow">→</span>
                </Link>
              </article>
            );
          })}
        </div>

        <div className="features-bottom-note">
          <div className="bottom-note-icon">✦</div>
          <div>
            <strong>Everything you need to prepare smarter.</strong>
            <p>One platform. Smarter preparation. Better results.</p>
          </div>
          <Link to="/exams" className="features-view-btn">
            Explore all features
            <span>→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}

export default FeaturesGrid;