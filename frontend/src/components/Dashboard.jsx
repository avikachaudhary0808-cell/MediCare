// Dashboard — Shows the user's health progress overview
// Displays: circular progress card, weekly trend chart, remaining reminders, and booked appointments
// Props:
//   - dashboardData: object with todayProgress, totalTasks, completedTasks, weeklyTrends, recoveryStatus
//   - reminders: list of all reminders (to show upcoming ones)
//   - appointments: list of booked appointments
//   - onViewReminders: navigation callback
//   - onViewDoctors: navigation callback
import React from 'react';
import {
  CheckCircle2,
  Clock,
  Calendar,
  Stethoscope,
  Shield,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Dashboard({
  dashboardData,
  reminders,
  appointments,
  onViewReminders,
  onViewDoctors,
}) {
  return (
    <div className="tab-content fade-in-entry">
      {/* Welcome banner at the top */}
      <div className="welcome-banner glass-panel">
        <div>
          <h2>Dashboard</h2>
          <p>Your daily health overview and activity progress.</p>
        </div>
        <div className="header-status-badge">
          <Shield size={16} /> Secure Portal
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Card 1: Circular progress showing daily completion */}
        <div className="progress-circular-card glass-panel">
          <h3>Daily Activity Score</h3>
          <div className="circular-progress-wrapper">
            <div
              className="circular-progress"
              style={{
                background: `conic-gradient(var(--primary) ${dashboardData.todayProgress * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
              }}
            >
              <div className="circular-progress-inner">
                <span className="percentage-number">{dashboardData.todayProgress}%</span>
                <span className="percentage-label">Completed</span>
              </div>
            </div>
          </div>
          <div className="progress-card-footer">
            <p>
              <strong>
                {dashboardData.completedTasks} of {dashboardData.totalTasks}
              </strong>{' '}
              tasks done today
            </p>
            <span
              className={`status-pill ${dashboardData.todayProgress >= 70 ? 'pill-success' : 'pill-warning'}`}
            >
              {dashboardData.recoveryStatus}
            </span>
          </div>
        </div>

        {/* Card 2: Weekly line chart using Recharts library */}
        <div className="progress-chart-card glass-panel">
          <h3>Health Activity Trends</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={dashboardData.weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="var(--text-secondary)" tickLine={false} />
                <YAxis stroke="var(--text-secondary)" domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(18, 30, 36, 0.9)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="progress"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="chart-description">
            Shows your overall task adherence completion percentage (%) for the past 7 days.
          </p>
        </div>
      </div>

      <div className="dashboard-sections-grid">
        {/* Card 3: Upcoming reminders summary */}
        <div className="reminders-summary-card glass-panel">
          <div className="card-header-flex">
            <h3>Remaining Reminders</h3>
            <button className="text-btn" onClick={onViewReminders}>
              View All
            </button>
          </div>
          <div className="summary-list">
            {reminders.filter((r) => !r.completed).length === 0 ? (
              <div className="empty-state-small">
                <CheckCircle2 size={32} className="success-icon" />
                <p>All reminders completed for today!</p>
              </div>
            ) : (
              reminders
                .filter((r) => !r.completed)
                .map((rem) => (
                  <div key={rem.id} className="summary-item">
                    <div className="summary-item-left">
                      <Clock size={16} className="text-secondary" />
                      <div>
                        <p className="summary-item-title">{rem.title}</p>
                        {rem.dosage && <p className="summary-item-sub">{rem.dosage}</p>}
                      </div>
                    </div>
                    <span className="summary-item-time">{rem.time}</span>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Card 4: Booked appointments summary */}
        <div className="appointments-summary-card glass-panel">
          <div className="card-header-flex">
            <h3>Booked Appointments</h3>
            <button className="text-btn" onClick={onViewDoctors}>
              Book Doctor
            </button>
          </div>
          <div className="summary-list">
            {appointments.length === 0 ? (
              <div className="empty-state-small">
                <Calendar size={32} className="text-secondary" />
                <p>No appointments booked yet.</p>
              </div>
            ) : (
              appointments.map((app) => (
                <div key={app.id} className="summary-item appointment-item">
                  <div className="summary-item-left">
                    <Stethoscope size={18} className="text-primary" />
                    <div>
                      <p className="summary-item-title">{app.doctorName}</p>
                      <p className="summary-item-sub">
                        {app.specialty} • {app.appointmentDate}
                      </p>
                    </div>
                  </div>
                  <span className="status-badge pulse">{app.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
