// Reminders — Displays and manages medication and health task reminders
// Split into two panes: medications on the left, general health tasks on the right
// Plus a modal form to add new reminders
// Props:
//   - reminders: list of all reminders (fetched from API)
//   - onToggleReminder: callback(id) to mark a reminder as done/undone
//   - onDeleteReminder: callback(id) to permanently delete a reminder
//   - onCreateReminder: callback(reminderData) to create a new reminder
import React, { useState } from 'react';
import {
  PlusCircle,
  BriefcaseMedical,
  CheckSquare,
  Clock,
  Trash2,
  Plus,
} from 'lucide-react';

export default function Reminders({ reminders, onToggleReminder, onDeleteReminder, onCreateReminder }) {
  // State for the "Add Reminder" modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('medication'); // 'medication' or 'task'
  const [time, setTime] = useState('08:00 AM');
  const [dosage, setDosage] = useState('');

  // Called when user submits the new reminder form
  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateReminder({
      title: title.trim(),
      type,
      time,
      dosage: type === 'medication' ? dosage.trim() : null,
      date: new Date().toISOString().split('T')[0],
    });

    // Reset form fields and close modal
    setTitle('');
    setDosage('');
    setType('medication');
    setTime('08:00 AM');
    setShowModal(false);
  };

  // Separate reminders into medication and task lists
  const medications = reminders.filter((r) => r.type === 'medication');
  const tasks = reminders.filter((r) => r.type === 'task');

  return (
    <div className="tab-content fade-in-entry">
      {/* Page header with title and "Add Reminder" button */}
      <div className="welcome-banner glass-panel flex-header-banner">
        <div>
          <h2>Medication and Daily Tasks</h2>
          <p>Plan, track and update your clinical doses and daily therapeutic health exercises.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <PlusCircle size={18} /> Add Reminder
        </button>
      </div>

      <div className="reminders-sections-grid">
        {/* ===== Left Pane: Medication Schedules ===== */}
        <div className="reminders-pane-card glass-panel">
          <div className="pane-header">
            <BriefcaseMedical size={20} className="text-primary" />
            <h3>Medication Schedules</h3>
          </div>
          <div className="reminders-list">
            {medications.length === 0 ? (
              <div className="empty-state-list">
                <p>No medication schedules added for today.</p>
              </div>
            ) : (
              medications.map((rem) => (
                <div
                  key={rem.id}
                  className={`reminder-row-item ${rem.completed ? 'row-completed' : ''}`}
                >
                  <div className="row-left">
                    {/* Checkbox to toggle completion */}
                    <input
                      type="checkbox"
                      checked={rem.completed}
                      onChange={() => onToggleReminder(rem.id)}
                      className="custom-checkbox"
                    />
                    <div className="reminder-details">
                      <p className="reminder-title">{rem.title}</p>
                      {rem.dosage && <p className="reminder-dosage">{rem.dosage}</p>}
                    </div>
                  </div>
                  <div className="row-right">
                    <span className="row-time">
                      <Clock size={12} /> {rem.time}
                    </span>
                    <button className="delete-row-btn" onClick={() => onDeleteReminder(rem.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ===== Right Pane: Health Exercises & Tasks ===== */}
        <div className="reminders-pane-card glass-panel">
          <div className="pane-header">
            <CheckSquare size={20} className="text-secondary" />
            <h3>Health Exercises &amp; Tasks</h3>
          </div>
          <div className="reminders-list">
            {tasks.length === 0 ? (
              <div className="empty-state-list">
                <p>No health exercises or tasks scheduled for today.</p>
              </div>
            ) : (
              tasks.map((rem) => (
                <div
                  key={rem.id}
                  className={`reminder-row-item ${rem.completed ? 'row-completed' : ''}`}
                >
                  <div className="row-left">
                    <input
                      type="checkbox"
                      checked={rem.completed}
                      onChange={() => onToggleReminder(rem.id)}
                      className="custom-checkbox"
                    />
                    <div className="reminder-details">
                      <p className="reminder-title">{rem.title}</p>
                    </div>
                  </div>
                  <div className="row-right">
                    <span className="row-time">
                      <Clock size={12} /> {rem.time}
                    </span>
                    <button className="delete-row-btn" onClick={() => onDeleteReminder(rem.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ===== "Add Reminder" Modal ===== */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content glass-panel fade-in-entry">
            <h3>Add New Health Reminder</h3>
            <form onSubmit={handleCreate} className="reminder-form">
              <div className="form-group">
                <label>Reminder Title / Medicine Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Vitamin D3, Blood pressure check"
                  required
                />
              </div>

              <div className="form-group">
                <label>Reminder Type</label>
                <select
                  className="form-input"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="medication">Medication Dose</option>
                  <option value="task">General Health Task</option>
                </select>
              </div>

              {/* Only show dosage field if type is medication */}
              {type === 'medication' && (
                <div className="form-group">
                  <label>Dosage Instructions</label>
                  <input
                    type="text"
                    className="form-input"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 1 tablet, 10ml after breakfast"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Scheduled Time</label>
                <input
                  type="text"
                  className="form-input"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 08:00 AM, 09:30 PM"
                  required
                />
              </div>

              <div className="modal-actions-flex">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
