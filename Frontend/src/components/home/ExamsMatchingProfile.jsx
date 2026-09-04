import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

function AnimatedMatch({ target, start }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    const duration = 700;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [start, target]);

  return <>✦ {value}% Match</>;
}

function ExamsMatchingProfile() {
  const gridRef = useRef(null);
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const exams = [
    {
      name: 'UPSC CSE 2024',
      authority: 'Union Public Service Commission',
      icon: '🏛️',
      matchPercent: 95,
      status: 'Application Open',
      statusIcon: '✓',
      statusColor: '#16a34a',
      statusBg: '#dcfce7',
      prelims: 'May 26, 2024',
      lastDate: 'Mar 5, 2024',
      lastDateUrgent: false,
      color: '#16a34a',
      iconBg: '#dcfce7',
      bgImage: '/images/pp.png',
    },
    {
      name: 'SSC CGL 2024',
      authority: 'Staff Selection Commission',
      icon: '👥',
      matchPercent: 90,
      status: 'Upcoming',
      statusIcon: '🔔',
      statusColor: '#7c3aed',
      statusBg: '#ede9fe',
      prelims: 'Sep–Oct 2024',
      lastDate: 'Notification expected Jun 2024',
      lastDateUrgent: false,
      color: '#7c3aed',
      iconBg: '#ede9fe',
      bgImage: '/images/pp1.png',
    },
    {
      name: 'IBPS PO',
      authority: 'Institute of Banking Personnel Selection',
      icon: '🏦',
      matchPercent: 88,
      status: 'Closing Soon',
      statusIcon: '🕐',
      statusColor: '#c2410c',
      statusBg: '#ffedd5',
      prelims: 'Oct 2024',
      lastDate: 'Tomorrow',
      lastDateUrgent: true,
      color: '#f59e0b',
      iconBg: '#ffedd5',
      bgImage: '/images/pp2.png',
    },
  ];

  return (
    <section className="match-section">
      <div className="wrap">
        <div className="match-header match-fade-up">
          <div>
            <span className="match-pill match-pill-glow">✦ AI Matched to You</span>
            <h2>Exams matching <span className="match-gradient">your profile</span></h2>
            <p>Based on your educational background and interests.</p>
          </div>
          <Link to="/exams" className="subhead-link">
            View all matches <span className="subhead-arrow">→</span>
          </Link>
        </div>

        <div className="match-grid" ref={gridRef}>
          {exams.map((exam, i) => (
            <div
              className="match-card match-card-reveal"
              key={i}
              style={{ '--card-delay': `${i * 220}ms` }}
            >
              <div className="mc-bg-image" style={{ backgroundImage: `url('${exam.bgImage}')` }}></div>

              <span className="mc-stripe" style={{ background: exam.color }}></span>

              <div className="mc-content">
                <div className="mc-top">
                  <div className="mc-icon" style={{ background: exam.iconBg }}>{exam.icon}</div>
                  <span className="mc-match">
                    <AnimatedMatch target={exam.matchPercent} start={cardsVisible} />
                  </span>
                </div>

                <h3>{exam.name}</h3>
                <p className="mc-authority">{exam.authority}</p>

                <span className="mc-status-pill" style={{ background: exam.statusBg, color: exam.statusColor }}>
                  {exam.statusIcon} {exam.status}
                </span>

                <div className="mc-meta-rows">
                  <p><span className="mc-meta-icon">📅</span> <strong>Prelims:</strong> {exam.prelims}</p>
                  <p>
                    <span className="mc-meta-icon">⚠️</span> <strong>Last date:</strong>{' '}
                    <span style={{ color: exam.lastDateUrgent ? '#ea580c' : 'inherit', fontWeight: exam.lastDateUrgent ? 700 : 400 }}>
                      {exam.lastDate}
                    </span>
                  </p>
                </div>

                <Link to="/eligibility" className="mc-check-btn">Check eligibility</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExamsMatchingProfile;