function HowItWorks() {
  const steps = [
    { icon: '🔍', label: 'Discover', bg: 'var(--blue)' },
    { icon: '✅', label: 'Eligibility', bg: 'var(--green)' },
    { icon: '📝', label: 'Apply', bg: 'var(--amber)' },
    { icon: '🧠', label: 'Prepare', bg: 'var(--violet)' },
    { icon: '🗂️', label: 'Mock Test', bg: 'var(--blue)' },
    { icon: '🏆', label: 'Result', bg: 'var(--green)' },
  ];

  return (
    <section className="sec-tint-violet">
      <div className="wrap">
        <div className="section-head center reveal">
          <h2>How it works</h2>
          <p>A streamlined path from discovery to success.</p>
        </div>
        <div className="steps stagger">
          {steps.map((step, i) => (
            <div className="step reveal-zoom" key={i}>
              <div className="step-icon" style={{ background: step.bg }}>{step.icon}</div>
              <p>{step.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;