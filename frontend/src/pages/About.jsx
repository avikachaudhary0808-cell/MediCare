import React from 'react';

export default function About() {
  return (
    <div className="page about-page glass-panel" style={{ padding: '2rem' }}>
      <h1 style={{ color: 'var(--primary)' }}>About MediCare</h1>
      <p style={{ marginTop: '1rem', color: 'var(--text-primary)' }}>
        MediCare is an advanced health management platform offering personalized dashboards, AI-driven symptom analysis, reminder management, and seamless doctor bookings. Our mission is to empower users with insights and tools for better health outcomes.
      </p>
    </div>
  );
}
