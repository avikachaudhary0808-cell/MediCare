import React from 'react';

export default function Contact() {
  return (
    <div className="page contact-page glass-panel" style={{ padding: '2rem' }}>
      <h1 style={{ color: 'var(--primary)' }}>Contact Us</h1>
      <p style={{ marginTop: '1rem', color: 'var(--text-primary)' }}>
        Have questions or need support? Reach out to our team.
      </p>
      <form className="contact-form" style={{ marginTop: '2rem' }}>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Name</label>
          <input type="text" className="form-input" placeholder="Your Name" required />
        </div>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input type="email" className="form-input" placeholder="you@example.com" required />
        </div>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Message</label>
          <textarea className="form-input" rows={4} placeholder="Your message" required />
        </div>
        <button type="submit" className="btn-primary">Send Message</button>
      </form>
    </div>
  );
}
