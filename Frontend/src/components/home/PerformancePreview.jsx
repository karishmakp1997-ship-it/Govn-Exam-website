function PerformancePreview() {
  const radialData = [
    { label: 'Overall', value: 78, color: '#16a34a', radius: 78, width: 12 },
    { label: 'Polity', value: 48, color: '#7c3aed', radius: 62, width: 12 },
    { label: 'Economy', value: 63, color: '#d97706', radius: 46, width: 12 },
    { label: 'History', value: 91, color: '#2563eb', radius: 30, width: 12 },
  ];

  const subjectBars = [
    { label: 'History', value: 91, color: '#16a34a' },
    { label: 'Geography', value: 84, color: '#16a34a' },
    { label: 'Economy', value: 63, color: '#d97706' },
    { label: 'Polity', value: 48, color: '#dc2626' },
    { label: 'Science', value: 72, color: '#2563eb' },
    { label: 'Current Affairs', value: 58, color: '#d97706' },
  ];

  const testScores = [
    { label: 'Test 1', value: 62 },
    { label: 'Test 2', value: 68 },
    { label: 'Test 3', value: 71 },
    { label: 'Test 4', value: 74 },
    { label: 'Test 5', value: 78 },
  ];

  const circumference = (r) => 2 * Math.PI * r;

  return (
    <section className="perf-section">
      <div className="wrap">
        <div className="section-head center reveal">
          <div className="eyebrow">Your Performance</div>
          <h2>Track your progress</h2>
          <p>See exactly where you stand — and what to work on next.</p>
        </div>

        <div className="perf-layout">
          <div className="perf-radial-card reveal-zoom">
            <h5>Subject mastery</h5>
            <div className="radial-wrap">
              <svg viewBox="0 0 200 200" className="radial-svg">
                {radialData.map((d, i) => (
                  <g key={i}>
                    <circle
                      cx="100" cy="100" r={d.radius}
                      fill="none" stroke="#eef2f7" strokeWidth={d.width}
                    />
                    <circle
                      cx="100" cy="100" r={d.radius}
                      fill="none" stroke={d.color} strokeWidth={d.width}
                      strokeLinecap="round"
                      strokeDasharray={circumference(d.radius)}
                      strokeDashoffset={circumference(d.radius) * (1 - d.value / 100)}
                      transform="rotate(-90 100 100)"
                      className="radial-ring"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  </g>
                ))}
              </svg>
              <div className="radial-center">
                <b>78%</b>
                <span>Overall</span>
              </div>
            </div>
            <div className="radial-legend">
              {radialData.map((d, i) => (
                <div className="legend-item" key={i}>
                  <span className="legend-dot" style={{ background: d.color }}></span>
                  <span className="legend-label">{d.label}</span>
                  <span className="legend-value">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="perf-right">
            <div className="perf-bars-card reveal-right">
              <h5>Accuracy by subject</h5>
              {subjectBars.map((s, i) => (
                <div className="pbar-row" key={i}>
                  <span className="pbar-label">{s.label}</span>
                  <div className="pbar-track">
                    <div
                      className="pbar-fill"
                      style={{
                        width: `${s.value}%`,
                        background: `linear-gradient(90deg, ${s.color}cc, ${s.color})`,
                        animationDelay: `${i * 0.09}s`,
                      }}
                    ></div>
                  </div>
                  <span className="pbar-value" style={{ color: s.color }}>{s.value}%</span>
                </div>
              ))}
            </div>

            <div className="perf-trend-card reveal-right">
              <h5>Score trend — last 5 tests</h5>
              <div className="trend-bars">
                {testScores.map((t, i) => (
                  <div className="trend-col" key={i}>
                    <div className="trend-value">{t.value}</div>
                    <div
                      className="trend-bar"
                      style={{ height: `${t.value}%`, animationDelay: `${i * 0.1}s` }}
                    ></div>
                    <div className="trend-label">{t.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="perf-insight reveal">
          <span className="insight-icon">✦</span>
          <div>
            <b>AI Performance Coach</b>
            <p>Your Polity accuracy dropped to 48% over the last 3 tests. Revisit Fundamental Rights and take a focused quiz before your next mock.</p>
          </div>
          <button className="insight-btn">Start revision →</button>
        </div>
      </div>
    </section>
  );
}

export default PerformancePreview;