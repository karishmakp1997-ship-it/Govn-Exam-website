import { Link } from 'react-router-dom';

function PricingPreview() {
  const freeFeatures = [
    'Notifications & reminders',
    'Basic eligibility checker',
    'Limited AI assistance',
    'Access to free mock tests (limited)',
    'Study resources (limited)',
  ];

  const premiumFeatures = [
    'Unlimited AI coach & doubt solving',
    'Full mock test library with analytics',
    'Personalized study plan',
    'Interview coach & expert tips',
    'Priority support',
  ];

  return (
    <section className="pricing-section">
      <div className="pricing-orb pricing-orb-1"></div>
      <div className="pricing-orb pricing-orb-2"></div>
      <div className="pricing-dots pricing-dots-left"></div>
      <div className="pricing-dots pricing-dots-right"></div>

      <div className="wrap">
        <div className="pricing-head reveal">
          <span className="pricing-pill">★ Flexible &amp; Affordable</span>
          <h2>Start free, <span className="pricing-gradient">upgrade anytime</span></h2>
          <p>Choose the plan that fits your preparation journey.</p>
        </div>

        <div className="pricing-grid">
          <div className="plan-card reveal-left">
            <div className="plan-icon free">🎁</div>
            <h3>Free</h3>
            <span className="plan-tag">Perfect to get you started</span>
            <div className="plan-divider"></div>
            <ul className="plan-list">
              {freeFeatures.map((f, i) => (
                <li key={i} style={{ animationDelay: `${i * 0.07}s` }}>
                  <span className="plan-check">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="plan-cta-wrap">
              <button className="plan-btn free-btn">Get started</button>
            </Link>
            <p className="plan-note">No credit card required</p>
          </div>

          <div className="plan-card premium reveal-right">
            <span className="plan-badge">♛ Most Popular</span>
            <div className="plan-sparkle plan-sparkle-1">✦</div>
            <div className="plan-sparkle plan-sparkle-2">✦</div>
            <div className="plan-crown">👑</div>

            <div className="plan-icon prem">💎</div>
            <h3>Premium</h3>
            <span className="plan-tag prem-tag">Everything you need to crack it</span>
            <div className="plan-divider"></div>
            <ul className="plan-list">
              {premiumFeatures.map((f, i) => (
                <li key={i} style={{ animationDelay: `${i * 0.07}s` }}>
                  <span className="plan-check prem-check">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/pricing" className="plan-cta-wrap">
              <button className="plan-btn prem-btn">Upgrade to Premium <span className="btn-arrow">→</span></button>
            </Link>
            <p className="plan-note">🛡️ Cancel anytime. No hidden charges.</p>
          </div>
        </div>

        <div className="pricing-trust reveal">
          <div className="trust-item">
            <div className="trust-icon">🛡️</div>
            <div>
              <b>Secure &amp; Trusted</b>
              <span>Your data is 100% safe</span>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">🔄</div>
            <div>
              <b>Cancel Anytime</b>
              <span>No commitment</span>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">🎧</div>
            <div>
              <b>Always Here to Help</b>
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingPreview;