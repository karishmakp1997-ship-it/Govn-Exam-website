import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const [lampOn, setLampOn] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="hero">
      <style>{`
        @media (max-width: 850px) {
          .hero-banner-full {
            min-height: 0 !important;
            background-image: none !important;
          }

          .hero-banner-full .reveal-left {
            max-width: 100% !important;
            padding: 32px 22px !important;
          }

          .hero-banner-full .reveal-left h1 {
            font-size: 30px !important;
          }

          .hero-banner-mobile-image {
            display: block;
            width: 100%;
            border-radius: 16px;
            margin-bottom: 18px;
          }

          .hero-lamp-decoration,
          .hero-bubble-decoration {
            display: none !important;
          }

          .hero-badges {
            width: 100%;
            justify-content: center;
            padding: 14px;
            gap: 12px;
          }

          .hb-item {
            flex: 1 1 45%;
            justify-content: center;
          }

          .hero-cta {
            width: 100%;
          }

          .hero-cta .btn {
            flex: 1;
            justify-content: center;
          }
        }

        @media (min-width: 851px) {
          .hero-banner-mobile-image {
            display: none;
          }
        }
      `}</style>

      <div className="wrap">
        <div className="hero-badges">
          <div className="hb-item">
            <div className="hb-icon" style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>✓</div>
            <div><b>Verified. Transparent. Trusted.</b><span>Information from Official Sources</span></div>
          </div>
          <div className="hb-item">
            <div className="hb-icon" style={{ background: 'var(--blue-light)', color: 'var(--blue)' }}>◎</div>
            <div><b>Personalized</b><span>Exam Guidance</span></div>
          </div>
          <div className="hb-item">
            <div className="hb-icon" style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>✔</div>
            <div><b>Instant</b><span>Eligibility Check</span></div>
          </div>
          <div className="hb-item">
            <div className="hb-icon" style={{ background: 'var(--violet-bg)', color: 'var(--violet)' }}>✦</div>
            <div><b>AI-Powered</b><span>Study Plans</span></div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 20px' }}>
        <div
          className="hero-banner-full"
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            minHeight: '640px',
            backgroundImage: 'url(/images/banner.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
          }}
        >

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.92) 30%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 65%)',
            }}
            className="hero-overlay-gradient"
          ></div>

          <div
            className={`lamp hero-lamp-decoration ${lampOn ? 'on' : ''}`}
            onClick={() => setLampOn(!lampOn)}
            title="Click to toggle the lamp"
            style={{ position: 'absolute', top: '20px', right: '60px', zIndex: 3 }}
          >
            <div className="lamp-glow"></div>
          </div>

          <div className="bubble-cycle hero-bubble-decoration" style={{ position: 'absolute', top: '150px', right: '160px', zIndex: 3 }}>
            <div className="bubble" style={{ position: 'static' }}>Let's make your preparation smarter!</div>
          </div>


          <div className="reveal-left" style={{ position: 'relative', zIndex: 2, padding: '60px 50px', maxWidth: '560px' }}>
            <img src="/images/banner.png" alt="" className="hero-banner-mobile-image" />

            <h1 style={{ fontSize: '44px', lineHeight: '1.14', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Your AI companion for every <span className="accent">government exam.</span>
            </h1>

            <p className="sub" style={{ marginTop: '16px', fontSize: '15.5px', color: 'var(--ink-soft)', lineHeight: '1.65' }}>
              Discover exams matched to your profile, check eligibility instantly, and prepare with an AI tutor built for your syllabus — never miss a deadline again.
            </p>
            <div className="hero-cta" style={{ marginTop: '26px' }}>
              <button className="btn btn-primary" onClick={() => navigate('/exams')}>
                Explore Exams →
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/ai-coach')}>
                Try AI Coach ✦
              </button>
            </div>
            <div className="deadline-note" style={{ marginTop: '16px' }}>📅 Deadline Reminders Included</div>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="stats-card reveal-zoom">
          <div className="stat"><div className="stat-icon" style={{ background: 'var(--blue)' }}>👥</div><div><b>Growing daily</b><span>Aspirants Empowered</span></div></div>
          <div className="stat"><div className="stat-icon" style={{ background: 'var(--green)' }}>📋</div><div><b>200+</b><span>Exams Covered</span></div></div>
          <div className="stat"><div className="stat-icon" style={{ background: 'var(--amber)' }}>📄</div><div><b>1000+</b><span>Verified Updates</span></div></div>
          <div className="stat"><div className="stat-icon" style={{ background: 'var(--violet)' }}>🏆</div><div><b>Your Success</b><span>Our Commitment</span></div></div>
        </div>

        <div className="trust-line">🛡️ Verified information from official sources · ✅ No fake promises, only real guidance · 🔒 Your privacy is our priority</div>
      </div>
    </section>
  );
}

export default Hero;