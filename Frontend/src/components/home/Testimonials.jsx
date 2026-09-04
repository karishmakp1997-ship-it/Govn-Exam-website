import { useState, useEffect, useRef } from 'react';

function Testimonials() {
  const testimonials = [
    {
      text: 'Vetri AI Coach helped me crack bank exams with confidence. The AI mentorship and mock tests are simply outstanding!',
      name: 'Arun K.',
      exam: 'IBPS PO',
      initials: 'AK',
      photo: 'https://i.pravatar.cc/150?img=12',
      topRated: false,
    },
    {
      text: 'The personalized study plan and instant doubt solving made my preparation 10x better. Highly recommended!',
      name: 'Priya S.',
      exam: 'SBI Clerk',
      initials: 'PS',
      photo: 'https://i.pravatar.cc/150?img=47',
      topRated: true,
    },
    {
      text: 'Concept clarity, smart analytics, and 24/7 AI support — everything I needed in one platform. Thank you Vetri AI Coach!',
      name: 'Vignesh R.',
      exam: 'RRB NTPC',
      initials: 'VR',
      photo: 'https://i.pravatar.cc/150?img=33',
      topRated: false,
    },
    {
      text: 'The eligibility checker saved me hours of confusion. Mock tests feel exactly like the real exam interface.',
      name: 'Divya M.',
      exam: 'TNPSC Group 2',
      initials: 'DM',
      photo: 'https://i.pravatar.cc/150?img=25',
      topRated: false,
    },
    {
      text: 'Deadline tracker is a lifesaver — I never missed an application window since I started using Vetri AI Coach.',
      name: 'Karthik S.',
      exam: 'SSC CGL',
      initials: 'KS',
      photo: 'https://i.pravatar.cc/150?img=51',
      topRated: true,
    },
    {
      text: 'From eligibility to interview prep, everything is in one place. My UPSC prelims score improved drastically.',
      name: 'Meena R.',
      exam: 'UPSC CSE',
      initials: 'MR',
      photo: 'https://i.pravatar.cc/150?img=44',
      topRated: false,
    },
  ];

  const [liked, setLiked] = useState({ 1: true, 4: true });
  const [page, setPage] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const CARDS_PER_PAGE = 3;
  const totalPages = Math.ceil(testimonials.length / CARDS_PER_PAGE);

  const toggleLike = (i) => {
    setLiked((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  // Trigger the staggered entrance animation once the section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="testi-section" ref={sectionRef}>
      <style>{`
        .testi-section {
          position: relative;
          padding: 80px 0;
          overflow: hidden;
          background:
            radial-gradient(circle at 12% 15%, rgba(124, 58, 237, 0.08), transparent 30%),
            radial-gradient(circle at 88% 80%, rgba(37, 99, 235, 0.07), transparent 32%),
            #f8fafc;
        }

        .testi-section .wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .testi-head {
          text-align: center;
          margin-bottom: 44px;
        }

        .testi-pill {
          display: inline-block;
          padding: 6px 16px;
          margin-bottom: 14px;
          border-radius: 999px;
          background: rgba(124, 58, 237, 0.1);
          color: #7c3aed;
          font-size: 12.5px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .testi-head h2 {
          margin: 0 0 10px;
          font-size: 38px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -1px;
        }

        .testi-gradient {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .testi-head p {
          color: #64748b;
          font-size: 15.5px;
        }

        /* =====================================================
           CAROUSEL TRACK
        ===================================================== */

        .testi-viewport {
          overflow-x: hidden;
          overflow-y: visible;
          padding-top: 18px;
          margin-bottom: 30px;
        }

        .testi-track {
          display: flex;
          transition: transform 0.55s cubic-bezier(.16,1,.3,1);
        }

        .testi-page {
          flex: 0 0 100%;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 26px;
        }

        /* =====================================================
           CARD — PREMIUM LOOK
        ===================================================== */

        .testi-card {
          position: relative;
          background: #ffffff;
          border-radius: 20px;
          padding: 28px 26px 24px;
          border: 1px solid rgba(148, 163, 184, 0.16);
          box-shadow: 0 4px 18px rgba(15, 23, 42, 0.05);

          opacity: 0;
          transform: translateX(90px);
          transition: opacity 0.6s cubic-bezier(.16,1,.3,1), transform 0.6s cubic-bezier(.16,1,.3,1), box-shadow 0.3s ease;
        }

        .testi-card.in-view {
          opacity: 1;
          transform: translateX(0);
        }

        .testi-card:hover {
          box-shadow: 0 16px 34px -10px rgba(15, 23, 42, 0.16);
        }

        .testi-card.featured {
          border: 1.5px solid rgba(124, 58, 237, 0.35);
          box-shadow: 0 10px 28px -8px rgba(124, 58, 237, 0.22);
        }

        .testi-badge {
          position: absolute;
          top: -13px;
          right: 22px;
          padding: 5px 14px;
          border-radius: 999px;
          background: linear-gradient(135deg, #c026d3, #db2777);
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.3px;
          box-shadow: 0 6px 14px -4px rgba(219, 39, 119, 0.5);
        }

        .testi-text {
          color: #334155;
          font-size: 14.5px;
          line-height: 1.65;
          min-height: 95px;
          margin-top: 4px;
        }

        .testi-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 18px 0 16px;
        }

        .testi-footer {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .testi-avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          flex: 0 0 46px;
          overflow: hidden;
          border: 2px solid #fff;
          box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.18);
        }

        .testi-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .testi-person {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }

        .testi-person b {
          font-size: 14px;
          color: #0f172a;
        }

        .testi-person span {
          font-size: 12px;
          color: #7c3aed;
          font-weight: 600;
        }

        .testi-stars {
          color: #f59e0b;
          font-size: 11px;
          margin-top: 2px;
        }

        .testi-heart {
          appearance: none;
          border: none;
          background: none;
          font-size: 20px;
          color: #c4b5fd;
          cursor: pointer;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .testi-heart:hover {
          transform: scale(1.15);
        }

        .testi-heart.liked {
          color: #db2777;
        }

        /* =====================================================
           PAGINATION DOTS
        ===================================================== */

        .testi-pagination {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .pg-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #cbd5e1;
          cursor: pointer;
          border: none;
          padding: 0;
          transition: all 0.25s ease;
        }

        .pg-dot:hover {
          background: #a78bfa;
        }

        .pg-dot.active {
          width: 26px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
        }

        @media (max-width: 900px) {
          .testi-page {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 620px) {
          .testi-page {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .testi-card {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .testi-track {
            transition: none !important;
          }
        }
      `}</style>

      <div className="wrap">
        <div className="testi-head">
          <span className="testi-pill">★ Success Stories</span>
          <h2>Aspirants trust <span className="testi-gradient">Vetri AI Coach</span></h2>
          <p>Real results. Real people. Real transformation.</p>
        </div>

        <div className="testi-viewport">
          <div
            className="testi-track"
            style={{ transform: `translateX(-${page * 100}%)` }}
          >
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <div className="testi-page" key={pageIndex}>
                {testimonials
                  .slice(pageIndex * CARDS_PER_PAGE, pageIndex * CARDS_PER_PAGE + CARDS_PER_PAGE)
                  .map((t, localIndex) => {
                    const globalIndex = pageIndex * CARDS_PER_PAGE + localIndex;
                    return (
                      <div
                        className={
                          (t.topRated ? 'testi-card featured' : 'testi-card') +
                          (visible ? ' in-view' : '')
                        }
                        key={globalIndex}
                        style={{
                          transitionDelay: visible ? `${localIndex * 0.15}s` : '0s',
                        }}
                      >
                        {t.topRated && <span className="testi-badge">♛ Top Rated</span>}

                        <p className="testi-text">{t.text}</p>

                        <div className="testi-divider"></div>

                        <div className="testi-footer">
                          <div className="testi-avatar">
                            <img src={t.photo} alt={t.name} loading="lazy" />
                          </div>
                          <div className="testi-person">
                            <b>{t.name}</b>
                            <span>{t.exam}</span>
                            <div className="testi-stars">★★★★★</div>
                          </div>
                          <button
                            className={liked[globalIndex] ? 'testi-heart liked' : 'testi-heart'}
                            onClick={() => toggleLike(globalIndex)}
                            aria-label="Like this testimonial"
                          >
                            {liked[globalIndex] ? '♥' : '♡'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>

        <div className="testi-pagination">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={i === page ? 'pg-dot active' : 'pg-dot'}
              onClick={() => setPage(i)}
              aria-label={`Go to testimonials page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;