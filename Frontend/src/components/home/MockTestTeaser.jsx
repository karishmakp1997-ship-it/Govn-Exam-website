import { useState } from 'react';
import { Link } from 'react-router-dom';


const DEMO_QUESTIONS = [
  {
    number: 14,
    section: 'Quantitative Aptitude',
    sectionNo: 2,
    text: 'A train covers 360 km in 4 hours. What is its speed?',
    options: ['80 km/h', '90 km/h', '100 km/h', '120 km/h'],
  },
  {
    number: 15,
    section: 'Quantitative Aptitude',
    sectionNo: 2,
    text: 'What is 25% of 480?',
    options: ['100', '110', '120', '130'],
  },
  {
    number: 16,
    section: 'General Studies',
    sectionNo: 3,
    text: 'Which Article of the Indian Constitution abolishes untouchability?',
    options: ['Article 15', 'Article 17', 'Article 21', 'Article 32'],
  },
];

const TOTAL_QUESTIONS = 25;
const LETTERS = ['A', 'B', 'C', 'D'];

function MockTestTeaser() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});   // { questionNumber: optionIndex }
  const [marked, setMarked] = useState({});     // { questionNumber: true }

  const question = DEMO_QUESTIONS[index];
  const selected = answers[question.number];
  const isMarked = !!marked[question.number];
  const completed = Math.round((question.number / TOTAL_QUESTIONS) * 100);

  const selectOption = (optIndex) => {
    setAnswers((prev) => ({ ...prev, [question.number]: optIndex }));
  };

  const toggleMark = () => {
    setMarked((prev) => ({ ...prev, [question.number]: !prev[question.number] }));
  };

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(DEMO_QUESTIONS.length - 1, i + 1));

  return (
    <section className="mock-section">
      <style>{`
        .mock-section {
          position: relative;
          padding: 70px 0;
          background:
            radial-gradient(circle at 8% 15%, rgba(124, 58, 237, 0.06), transparent 30%),
            radial-gradient(circle at 92% 80%, rgba(37, 99, 235, 0.05), transparent 32%),
            #f8fafc;
        }

        .mock-section .wrap {
          max-width: 1220px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .mock-showcase {
          background: linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%);
          border-radius: 28px;
          padding: 44px;
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 40px;
          align-items: center;
        }

        /* LEFT CONTENT */

        .mock-content {
          position: relative;
        }

        .mock-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.7);
          color: #7c3aed;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 20px;
        }

        .mock-content h2 {
          margin: 0 0 16px;
          font-size: 40px;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.15;
          letter-spacing: -1px;
        }

        .mock-content h2 span {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .mock-description {
          font-size: 15px;
          color: #4c4a6e;
          line-height: 1.65;
          margin-bottom: 22px;
          max-width: 420px;
        }

        .mock-benefits {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 28px;
        }

        .mock-benefit {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13.5px;
          font-weight: 700;
          color: #1e293b;
        }

        .mock-benefit span {
          color: #16a34a;
          font-size: 15px;
        }

        .mock-start-btn {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          padding: 15px 12px 15px 26px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 14px 28px -10px rgba(124, 58, 237, 0.5);
          transition: transform 0.2s ease;
        }

        .mock-start-btn:hover {
          transform: translateY(-2px);
        }

        .mock-start-btn strong {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
        }

        .mock-note {
          margin-top: 14px;
          font-size: 12.5px;
          color: #64748b;
        }

        /* RIGHT — EXAM PREVIEW CARD */

        .exam-preview {
          background: #f5ede2;
          border-radius: 22px;
          padding: 26px;
          box-shadow: 0 20px 50px -14px rgba(76, 29, 149, 0.25);
        }

        .exam-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .exam-subject {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .subject-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #ffffff;
          color: #92643a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .exam-subject strong {
          display: inline-block;
          font-size: 13.5px;
          font-weight: 800;
          color: #7c5a3a;
          background: #ffffff;
          padding: 3px 10px;
          border-radius: 6px;
        }

        .exam-subject small {
          display: block;
          font-size: 11.5px;
          color: #94a3b8;
          margin-top: 4px;
        }

        .exam-timer {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 999px;
          background: #fef2f2;
          color: #dc2626;
          font-size: 13.5px;
          font-weight: 800;
        }

        .exam-progress {
          margin-bottom: 20px;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 11.5px;
          color: #94a3b8;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .progress-track {
          height: 7px;
          border-radius: 999px;
          background: #adb3aa;
          overflow: hidden;
        }

        .progress-value {
          height: 100%;
          border-radius: 999px;
          background: #377e2a;
          transition: width 0.3s ease;
        }

        .exam-question {
          margin-bottom: 18px;
        }

        .question-label {
          display: block;
          font-size: 11px;
          font-weight: 800;
          color: #7c3aed;
          letter-spacing: 0.6px;
          margin-bottom: 6px;
        }

        .exam-question h3 {
          margin: 0;
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.4;
        }

        .exam-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 22px;
        }

        .exam-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 14px;
          border-radius: 12px;
          border: 1.5px solid transparent;
          background: #ffffff;
          cursor: pointer;
          font-size: 13.5px;
          font-weight: 600;
          color: #334155;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.15s ease;
        }

        .exam-option:hover {
          border-color: #d6bfa3;
          transform: translateY(-1px);
        }

        .exam-option.active {
          background: #debc89;
          border-color: #6b4a2f;
          color: #ffffff;
        }

        .exam-option .option-letter {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: #f0e4d4;
          color: #7297ab;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          flex-shrink: 0;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .exam-option.active .option-letter {
          background: #ffffff;
          color: #d59929;
        }

        .exam-option.active strong {
          color: #4ade80;
        }

        .exam-option strong {
          margin-left: auto;
          color: #16a34a;
          font-size: 14px;
        }

        .exam-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          padding-top: 18px;
          border-top: 1px solid #e8dbc7;
        }

        .review-btn {
          background: #ffffff;
          border: 1.5px solid transparent;
          border-radius: 10px;
          padding: 9px 16px;
          font-size: 12.5px;
          font-weight: 700;
          color: #92643a;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }

        .review-btn.is-marked {
          background: #6b4a2f;
          border-color: #6b4a2f;
          color: #ffffff;
        }

        .question-nav {
          display: flex;
          gap: 10px;
        }

        .question-nav button:first-child {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          color: #475569;
          font-size: 15px;
          cursor: pointer;
        }

        .question-nav button:first-child:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .next-btn {
          display: inline-flex;
          align-items: center;
          padding: 10px 20px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
        }

        @media (max-width: 980px) {
          .mock-showcase {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .mock-showcase {
            padding: 26px;
          }
          .mock-content h2 {
            font-size: 30px;
          }
          .exam-options {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="wrap">

        <div className="mock-showcase">

          {/* LEFT CONTENT */}
          <div className="mock-content">

            <div className="mock-eyebrow">
              <span className="mock-eyebrow-icon">✦</span>
              MOCK TEST ENGINE
            </div>

            <h2>
              Practice like it's
              <br />
              <span>exam day.</span>
            </h2>

            <p className="mock-description">
              Timed sections, negative marking, mark-for-review,
              and instant scoring — everything designed to feel
              like the real exam.
            </p>

            {/* FEATURES */}
            <div className="mock-benefits">
              <div className="mock-benefit">
                <span>✓</span>
                Timed sections
              </div>
              <div className="mock-benefit">
                <span>✓</span>
                Negative marking
              </div>
              <div className="mock-benefit">
                <span>✓</span>
                Instant scoring
              </div>
            </div>

            <Link to="/mock-tests" className="mock-start-btn">
              <span>Start a free mock test</span>
              <strong>→</strong>
            </Link>

            <div className="mock-note">
              No credit card required
            </div>

          </div>


          {/* RIGHT — INTERACTIVE PREVIEW (demo data) */}
          <div className="exam-preview">

            {/* HEADER */}
            <div className="exam-header">
              <div className="exam-subject">
                <span className="subject-icon">∑</span>
                <div>
                  <strong>{question.section}</strong>
                  <small>Section {question.sectionNo} · Question {question.number}</small>
                </div>
              </div>

              <div className="exam-timer">
                <span>◷</span>
                18:24
              </div>
            </div>


            {/* PROGRESS */}
            <div className="exam-progress">
              <div className="progress-label">
                <span>Question {question.number} of {TOTAL_QUESTIONS}</span>
                <span>{completed}% completed</span>
              </div>

              <div className="progress-track">
                <div className="progress-value" style={{ width: `${completed}%` }}></div>
              </div>
            </div>


            {/* QUESTION */}
            <div className="exam-question">
              <span className="question-label">
                QUESTION {question.number}
              </span>
              <h3>{question.text}</h3>
            </div>


            {/* OPTIONS */}
            <div className="exam-options">
              {question.options.map((opt, i) => (
                <div
                  key={opt}
                  className={selected === i ? 'exam-option active' : 'exam-option'}
                  onClick={() => selectOption(i)}
                >
                  <span className="option-letter">{LETTERS[i]}</span>
                  <span>{opt}</span>
                  {selected === i && <strong>✓</strong>}
                </div>
              ))}
            </div>


            {/* FOOTER */}
            <div className="exam-footer">
              <button
                className={isMarked ? 'review-btn is-marked' : 'review-btn'}
                onClick={toggleMark}
              >
                ⚑ {isMarked ? 'Marked' : 'Mark for review'}
              </button>

              <div className="question-nav">
                <button onClick={goPrev} disabled={index === 0}>←</button>

                {index < DEMO_QUESTIONS.length - 1 ? (
                  <button className="next-btn" onClick={goNext}>
                    Next question →
                  </button>
                ) : (
                  <Link to="/mock-tests" className="next-btn">
                    Take full test →
                  </Link>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default MockTestTeaser;