import { useNavigate } from 'react-router-dom';

const EXAMS = [
  { name: 'UPSC', full: 'Union Public Service Commission', from: '#c8def8', to: '#cdbefa' },
  { name: 'TNPSC Group 1', full: 'Tamil Nadu PSC', from: '#b0cebb', to: '#dbf8fd' },
  { name: 'TNPSC Group 2', full: 'Tamil Nadu PSC', from: '#c2fbcf', to: '#ccdbed' },
  { name: 'TNPSC Group 3', full: 'Tamil Nadu PSC', from: '#c9e7dc', to: '#f0f1dc' },
  { name: 'TNPSC Group 4', full: 'Tamil Nadu PSC', from: '#95bfb8', to: '#dfe9f5' },
  { name: 'Railways (RRB)', full: 'Railway Recruitment Board', from: '#faf4e5', to: '#f5ccab' },
  { name: 'SSC', full: 'Staff Selection Commission', from: '#d9d5e4', to: '#ecdce4' },
  { name: 'Banking', full: 'IBPS · SBI · RBI', from: '#e1f1eb', to: '#e1ebe5' },
  { name: 'Defence', full: 'NDA · CDS · AFCAT', from: '#94a3b8', to: '#cbd5e1' },
  { name: 'Teaching', full: 'CTET · TET', from: '#f1c4db', to: '#f9dab8' },
];

// duplicated once for a seamless infinite loop
const LOOP_EXAMS = [...EXAMS, ...EXAMS];

function PreparationMaterials() {
  const navigate = useNavigate();

  const handleExamClick = (examName) => {
    navigate('/study-materials', { state: { category: examName } });
  };

  return (
    <>
      <style>{`

        .prep-section {
          position: relative;
          padding: 72px 0;
          background:
            radial-gradient(circle at 10% 10%, rgba(124, 58, 237, 0.08), transparent 30%),
            radial-gradient(circle at 90% 85%, rgba(37, 99, 235, 0.06), transparent 32%),
            #f8fafc;
          overflow: hidden;
        }

        .prep-section .wrap {
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }

        .prep-section .section-head {
          text-align: center;
          margin: 0 0 40px;
        }

        .prep-section .eyebrow {
          display: block;
          margin: 0 0 10px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #7c3aed;
        }

        .prep-section .section-head h2 {
          margin: 0 0 14px;
          color: #0f172a;
          font-size: 42px;
          font-weight: 800;
          letter-spacing: -1.3px;
        }

        .prep-section .section-head h2::after {
          content: "";
          display: block;
          width: 70px;
          height: 5px;
          margin: 12px auto 0;
          border-radius: 999px;
          background: linear-gradient(90deg, #2563eb, #7c3aed);
        }

        .prep-section .section-head p {
          max-width: 620px;
          margin: 0 auto;
          color: #64748b;
          font-size: 16px;
          line-height: 1.6;
        }

        /* =========================================================
           MARQUEE TRACK
        ========================================================= */

        .prep-marquee-outer {
          position: relative;
          width: 100%;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent 0%,
            #000 6%,
            #000 94%,
            transparent 100%
          );
          mask-image: linear-gradient(
            90deg,
            transparent 0%,
            #000 6%,
            #000 94%,
            transparent 100%
          );
        }

        .prep-marquee-track {
          display: flex;
          width: max-content;
          gap: 20px;
          animation: prepMarqueeScroll 32s linear infinite;
        }

        .prep-marquee-outer:hover .prep-marquee-track {
          animation-play-state: paused;
        }

        @keyframes prepMarqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        .prep-exam-chip {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
          min-width: 190px;
          padding: 18px 26px;
          border-radius: 18px;
          cursor: pointer;
          color: #1e293b;
          box-shadow: 0 8px 18px -8px rgba(15, 23, 42, 0.16);
          transition: transform 0.25s cubic-bezier(.16,1,.3,1), box-shadow 0.25s ease;
        }

        .prep-exam-chip:hover {
          transform: translateY(-6px) scale(1.035);
          box-shadow: 0 14px 26px -10px rgba(15, 23, 42, 0.24);
        }

        .prep-exam-chip .chip-name {
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.2px;
          color: #1e293b;
        }

        .prep-exam-chip .chip-full {
          font-size: 11px;
          font-weight: 600;
          opacity: 0.75;
          letter-spacing: 0.2px;
          color: #334155;
        }

        .prep-marquee-row {
          margin-bottom: 18px;
        }

        .prep-marquee-row.reverse .prep-marquee-track {
          animation-direction: reverse;
        }

        /* =========================================================
           FOOTER
        ========================================================= */

        .prep-footer {
          display: flex;
          justify-content: center;
          margin-top: 36px;
        }

        .prep-view-all {
          padding: 12px 30px;
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 12px 26px -8px rgba(124, 58, 237, 0.45);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .prep-view-all:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 32px -8px rgba(124, 58, 237, 0.55);
        }

        @media (prefers-reduced-motion: reduce) {
          .prep-marquee-track {
            animation: none !important;
          }
        }

        @media (max-width: 640px) {
          .prep-section .section-head h2 { font-size: 30px; }
          .prep-exam-chip { min-width: 150px; padding: 14px 18px; }
          .prep-exam-chip .chip-name { font-size: 14px; }
        }

      `}</style>

      <section className="prep-section">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Preparation Materials</div>
            <h2>Study by category</h2>
            <p>Verified notes, videos, and flashcards — curated for every exam. Tap any exam to explore its materials.</p>
          </div>

          <div className="prep-marquee-row">
            <div className="prep-marquee-outer">
              <div className="prep-marquee-track">
                {LOOP_EXAMS.map((exam, i) => (
                  <div
                    key={`${exam.name}-${i}`}
                    className="prep-exam-chip"
                    style={{ background: `linear-gradient(135deg, ${exam.from}, ${exam.to})` }}
                    onClick={() => handleExamClick(exam.name)}
                  >
                    <span className="chip-name">{exam.name}</span>
                    <span className="chip-full">{exam.full}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="prep-marquee-row reverse">
            <div className="prep-marquee-outer">
              <div className="prep-marquee-track">
                {[...LOOP_EXAMS].reverse().map((exam, i) => (
                  <div
                    key={`rev-${exam.name}-${i}`}
                    className="prep-exam-chip"
                    style={{ background: `linear-gradient(135deg, ${exam.to}, ${exam.from})` }}
                    onClick={() => handleExamClick(exam.name)}
                  >
                    <span className="chip-name">{exam.name}</span>
                    <span className="chip-full">{exam.full}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="prep-footer">
            <button type="button" className="prep-view-all" onClick={() => navigate('/study-materials')}>
              Browse all study materials →
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default PreparationMaterials;