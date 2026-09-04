import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Demo data for the homepage teaser. The real Results / Answer Keys pages
// fetch live data from the backend — this section is a showcase.
const RESULTS = [
  { exam: 'RRB NTPC', title: 'RRB NTPC Result', type: 'Result declared', date: '1 day ago' },
  { exam: 'IBPS PO', title: 'IBPS PO Prelim Result', type: 'Result declared', date: '3 days ago' },
];

const ANSWER_KEYS = [
  { exam: 'SSC CGL', title: 'SSC CGL Tier 1 Answer Key', type: 'Objection window', date: '3 days left', urgent: true },
  { exam: 'UPSC CSE', title: 'UPSC CSE Prelim Answer Key', type: 'Released', date: '2 days ago' },
];

function LatestUpdates() {
  const gridRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="updates-section">
      <div className="updates-glow updates-glow-left"></div>
      <div className="updates-glow updates-glow-right"></div>

      <div className="wrap">

        {/* HEADER */}
        <div className="updates-heading reveal">
          <div className="updates-eyebrow">
            <span>✦</span>
            EXAM UPDATES
          </div>

          <h2>
            Stay updated.
            <span> Never miss what matters.</span>
          </h2>

          <p>
            Latest results and answer keys from major competitive exams,
            all in one place.
          </p>
        </div>


        {/* UPDATE PANELS */}
        <div className={`updates-grid${inView ? ' updates-in-view' : ''}`} ref={gridRef}>

          {/* RESULTS */}
          <div className="updates-panel results-panel">

            <div className="updates-panel-header">
              <div className="updates-heading-icon results-icon">✓</div>
              <div>
                <h3>Latest Results</h3>
                <p>Recently announced results</p>
              </div>
              <div className="updates-count">02</div>
            </div>

            <div className="updates-list">
              {RESULTS.map((item, index) => (
                <Link
                  to="/results"
                  className="update-row"
                  key={item.title}
                  style={{ '--row-delay': `${index * 130}ms` }}
                >
                  <div className="update-main">
                    <div className="exam-mini-icon">📄</div>
                    <div>
                      <h4>{item.title}</h4>
                      <div className="update-meta">
                        <span>{item.exam}</span>
                        <i>•</i>
                        <span>{item.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="update-right">
                    <span>{item.date}</span>
                    <strong>→</strong>
                  </div>
                </Link>
              ))}
            </div>

            <Link to="/results" className="updates-link results-link">
              View all results
              <span>→</span>
            </Link>

          </div>


          {/* ANSWER KEYS */}
          <div className="updates-panel keys-panel">

            <div className="updates-panel-header">
              <div className="updates-heading-icon keys-icon">⚿</div>
              <div>
                <h3>Latest Answer Keys</h3>
                <p>Recently released answer keys</p>
              </div>
              <div className="updates-count">02</div>
            </div>

            <div className="updates-list">
              {ANSWER_KEYS.map((item, index) => (
                <Link
                  to="/answer-key"
                  className={`update-row ${item.urgent ? 'urgent-row' : ''}`}
                  key={item.title}
                  style={{ '--row-delay': `${index * 130}ms` }}
                >
                  <div className="update-main">
                    <div className="exam-mini-icon key-mini-icon">🔑</div>
                    <div>
                      <h4>{item.title}</h4>
                      <div className="update-meta">
                        <span>{item.exam}</span>
                        <i>•</i>
                        <span>{item.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="update-right">
                    <span className={item.urgent ? 'urgent-text' : ''}>
                      {item.date}
                    </span>
                    <strong>→</strong>
                  </div>
                </Link>
              ))}
            </div>

            <Link to="/answer-key" className="updates-link keys-link">
              View all answer keys
              <span>→</span>
            </Link>

          </div>

        </div>


        {/* BOTTOM INFO */}
        <div className="updates-info reveal">
          <div className="updates-info-icon">🔔</div>

          <div className="updates-info-content">
            <strong>Get notified when important updates are released.</strong>
            <p>Never miss results, answer keys, objection deadlines or exam notifications.</p>
          </div>

          <Link to="/my-exams" className="notification-btn">
            Manage notifications
            <span>→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}

export default LatestUpdates;