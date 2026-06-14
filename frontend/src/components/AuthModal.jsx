// AuthModal — The login / register overlay that appears before the user logs in
// This is a modal dialog that collects email and password, then authenticates with Firebase
// Props:
//   - onClose: called when user clicks outside the modal or presses cancel
//   - onAuth: called with (email, password, name, mode) after successful login/signup
//   - initialMode: 'login' or 'signup' — which form to show first
import React, { useState } from 'react';
import { AlertTriangle, BriefcaseMedical } from 'lucide-react';

export default function AuthModal({ onClose, onAuth, initialMode = 'login' }) {
  // 'login' shows email+password form
  // 'signup' adds a Full Name field on top
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // This function runs when user clicks "Sign In" or "Register Account"
  // It prevents the form from refreshing the page, then sends auth data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onAuth(email, password, name, mode);
    } catch (err) {
      // Show error message in the UI if Firebase rejects the credentials
      setError(err.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay-backdrop" onClick={onClose}>
      {/* Clicking the dark backdrop closes the modal */}
      <div className="auth-card glass-panel fade-in-entry auth-overlay-card" onClick={(e) => e.stopPropagation()}>
        {/* Prevent clicks inside the card from bubbling to the backdrop */}
        <div className="auth-logo">
          <div className="logo-icon-container">
            <BriefcaseMedical className="logo-icon" />
          </div>
          <h2>MediCare Assistant</h2>
          <p>Your Intelligent Health &amp; Wellness Companion</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-alert">
              <AlertTriangle size={18} /> {error}
            </div>
          )}

          {/* Only show name input in signup mode */}
          {mode === 'signup' && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter at least 6 characters"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? 'Verifying...' : mode === 'login' ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <span onClick={() => setMode('signup')}>Register now</span>
            </p>
          ) : (
            <p>
              Already have an account? <span onClick={() => setMode('login')}>Sign In</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
