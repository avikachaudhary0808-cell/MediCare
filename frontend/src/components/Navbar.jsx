// Top navigation bar — this is the main menu at the top of the app
// It shows the MediCare logo, navigation links, user info, and logout button
// Props:
//   - user: the logged in Firebase user object
//   - activeTab: which page is currently shown
//   - onTabChange: called when user clicks a nav link
//   - onLogout: called when user clicks the logout button
import React from 'react';
import {
  Heart,
  TrendingUp,
  Stethoscope,
  Clock,
  Calendar,
  MapPin,
  User,
  LogOut,
  BriefcaseMedical,
} from 'lucide-react';

export default function Navbar({ user, activeTab, onTabChange, onLogout }) {
  return (
    <nav className="top-navbar glass-panel">
      <div className="navbar-left">
        {/* Left side: Logo + navigation links */}
        <div className="navbar-logo">
          <BriefcaseMedical className="logo-icon active-glow" />
          <h1>MediCare</h1>
        </div>
        <div className="navbar-links">
          <button
            className={`navbar-link-btn ${activeTab === 'home' ? 'navbar-active' : ''}`}
            onClick={() => onTabChange('home')}
          >
            <Heart size={16} />
            <span>Home</span>
          </button>
          <button
            className={`navbar-link-btn ${activeTab === 'dashboard' ? 'navbar-active' : ''}`}
            onClick={() => onTabChange('dashboard')}
          >
            <TrendingUp size={16} />
            <span>Dashboard</span>
          </button>
          <button
            className={`navbar-link-btn ${activeTab === 'symptoms' ? 'navbar-active' : ''}`}
            onClick={() => onTabChange('symptoms')}
          >
            <Stethoscope size={16} />
            <span>Symptom Checker</span>
          </button>
          <button
            className={`navbar-link-btn ${activeTab === 'reminders' ? 'navbar-active' : ''}`}
            onClick={() => onTabChange('reminders')}
          >
            <Clock size={16} />
            <span>Reminders</span>
          </button>
          <button
            className={`navbar-link-btn ${activeTab === 'doctors' ? 'navbar-active' : ''}`}
            onClick={() => onTabChange('doctors')}
          >
            <Calendar size={16} />
            <span>Consult Doctor</span>
          </button>
          <button
            className={`navbar-link-btn ${activeTab === 'contact' ? 'navbar-active' : ''}`}
            onClick={() => onTabChange('contact')}
          >
            <MapPin size={16} />
            <span>Contact</span>
          </button>
        </div>
      </div>

      <div className="navbar-right">
        {/* Right side: user info + logout button */}
        <div className="navbar-user">
          <div className="user-avatar">
            <User size={14} />
          </div>
          <span className="navbar-user-name">
            {user?.displayName || 'User'}
          </span>
        </div>
        <button onClick={onLogout} className="navbar-logout-btn">
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
}
