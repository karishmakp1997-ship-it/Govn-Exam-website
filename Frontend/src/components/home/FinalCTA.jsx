import { Link } from 'react-router-dom';

function FinalCTA() {
  return (
    <section className="cta-section">
      <div className="cta-rings cta-rings-left"></div>
      <div className="cta-rings cta-rings-right"></div>

      <div className="wrap">
        <div className="cta-content reveal">
          <span className="cta-pill">✦ Your Success Starts Here</span>
          <h2>Ready to start your <span className="cta-gradient">journey?</span></h2>
          <p>Join thousands of aspirants preparing smarter<br />every day with Vetri AI Coach.</p>

          <div className="cta-checks">
            <span><i className="cta-check">✓</i> Free to start</span>
            <span><i className="cta-check">✓</i> No credit card required</span>
            <span><i className="cta-check">✓</i> Upgrade anytime</span>
          </div>

          <Link to="/signup">
            <button className="cta-main-btn">
              Get started free <span className="cta-arrow">→</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;