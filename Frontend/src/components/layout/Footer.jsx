import { useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function ContactModal({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus('sending');
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: '18px',
          padding: '32px',
          width: '420px',
          maxWidth: '92vw',
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: '14px', right: '14px',
            width: '30px', height: '30px', borderRadius: '50%',
            border: 'none', background: '#f1f4f9', color: '#7c8398',
            fontSize: '15px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ✕
        </button>

        <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>Contact Us</h2>
        <p style={{ fontSize: '13px', color: '#7c8398', marginBottom: '20px' }}>
          Have a question or feedback? We'd love to hear from you.
        </p>

        {status === 'sent' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#16a34a', marginBottom: '6px' }}>
              Message sent!
            </p>
            <p style={{ fontSize: '13px', color: '#7c8398' }}>
              We'll get back to you as soon as possible.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              style={{ padding: '10px 14px', border: '1px solid #e6e9f2', borderRadius: '10px', fontSize: '14px' }}
            />
            <input
              name="email"
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={handleChange}
              style={{ padding: '10px 14px', border: '1px solid #e6e9f2', borderRadius: '10px', fontSize: '14px' }}
            />
            <textarea
              name="message"
              placeholder="Your message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              style={{ padding: '10px 14px', border: '1px solid #e6e9f2', borderRadius: '10px', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit' }}
            />

            {status === 'error' && (
              <p style={{ color: '#c23a3a', fontSize: '12.5px' }}>
                Something went wrong. Please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn btn-primary"
              style={{ justifyContent: 'center', padding: '11px' }}
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Footer() {
  const [contactOpen, setContactOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle'); // idle | sending | sent | error

  const columns = [
    {
      title: 'Explore',
      links: [
        { label: 'Exams', to: '/exams' },
        { label: 'Eligibility', to: '/eligibility' },
        { label: 'Mock Tests', to: '/mock-tests' },
        { label: 'Study Plan', to: '/ai-coach' },
        { label: 'Blog', to: '/current-affairs' },
      ],
    },
    {
      title: 'Practice',
      links: [
        { label: 'All India Tests', to: '/mock-tests' },
        { label: 'Topic Tests', to: '/mock-tests' },
        { label: 'Previous Year Papers', to: '/study-materials' },
        { label: 'Performance', to: '/performance' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', to: '/about' },
        { label: 'Resources', to: '/current-affairs' },
        { label: 'Contact Us', action: 'contact' },
        { label: 'Feedback', action: 'contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', to: '/about' },
        { label: 'Terms of Service', to: '/about' },
        { label: 'Refund Policy', to: '/pricing' },
      ],
    },
  ];

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterStatus('sending');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}/api/newsletter/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      if (!res.ok) throw new Error('Failed');
      setNewsletterStatus('sent');
      setNewsletterEmail('');
    } catch {
      setNewsletterStatus('error');
    }
  };

  return (
    <>
      <div className="cta-wave">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,110 C220,190 420,40 720,90 C1020,140 1240,60 1440,110 L1440,200 L0,200 Z" fill="#1e1b4b" />
          <path d="M0,130 C240,200 440,60 740,105 C1040,150 1250,80 1440,125" fill="none" stroke="rgba(167,139,250,.35)" strokeWidth="1.5" />
          <path d="M0,142 C240,210 440,72 740,117 C1040,162 1250,92 1440,137" fill="none" stroke="rgba(167,139,250,.25)" strokeWidth="1.5" />
          <path d="M0,154 C240,222 440,84 740,129 C1040,174 1250,104 1440,149" fill="none" stroke="rgba(167,139,250,.18)" strokeWidth="1.5" />
        </svg>
      </div>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="fb-logo">
                <img
                  src="/images/logo.png"
                  alt="Vetri AI Coach"
                  className="fb-mark"
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    objectFit: 'contain',
                    display: 'block',
                    background: 'transparent',
                    padding: 0,
                    boxShadow: 'none',
                    border: 'none',
                  }}
                />
                <span className="fb-name">Vetri <span className="fb-accent">AI Coach</span></span>
              </div>
              <p>AI powered preparation for<br />real world achievers.</p>
              <div className="fb-line"></div>
              <div className="fb-socials">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◉</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">▶</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              </div>
            </div>

            {columns.map((col) => (
              <div className="footer-col" key={col.title}>
                <h4>{col.title}</h4>
                <div className="fc-line"></div>
                {col.links.map((link) =>
                  link.action === 'contact' ? (
                    <a
                      href="#"
                      key={link.label}
                      onClick={(e) => { e.preventDefault(); setContactOpen(true); }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.to} key={link.label}>{link.label}</Link>
                  )
                )}
              </div>
            ))}

            <div className="footer-news">
              <div className="fn-icon">✉</div>
              <b>Stay updated</b>
              <p>Get the latest exam updates, tips &amp; important notifications.</p>

              {newsletterStatus === 'sent' ? (
                <p style={{ fontSize: '13px', color: '#4ade80', marginTop: '10px' }}>
                  Subscribed! Thanks for joining.
                </p>
              ) : (
                <form className="fn-form" onSubmit={handleNewsletterSubmit}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                  />
                  <button type="submit" aria-label="Subscribe" disabled={newsletterStatus === 'sending'}>
                    {newsletterStatus === 'sending' ? '…' : '➤'}
                  </button>
                </form>
              )}
              {newsletterStatus === 'error' && (
                <p style={{ fontSize: '12px', color: '#f87171', marginTop: '8px' }}>
                  Couldn't subscribe. Please try again.
                </p>
              )}
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Vetri AI Coach. All rights reserved.</span>
            <span className="fb-made">
              <span className="fb-heart">♥</span> Made with &nbsp;for aspirants
            </span>
          </div>
        </div>
      </footer>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </>
  );
}

export default Footer;