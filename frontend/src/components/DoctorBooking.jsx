// DoctorBooking — Doctor cards listing + appointment booking modal
// Allows users to browse doctors by specialty and book simulated appointments
// Props:
//   - doctors: list of doctor objects (fetched from API)
//   - appointments: list of already booked appointments
//   - selectedSpecialty: currently selected specialty filter string
//   - onSpecialtyChange: callback(specialty) to update the filter
//   - onBook: callback(bookingData) to create a new appointment
//   - apiService: API service for fetching doctors by specialty
import React, { useState } from 'react';
import {
  User,
  Star,
  MapPin,
  Stethoscope,
  Calendar,
} from 'lucide-react';

export default function DoctorBooking({
  doctors,
  appointments,
  selectedSpecialty,
  onSpecialtyChange,
  onBook,
  apiService,
}) {
  // State for the booking modal (null means modal is closed)
  const [showBookingModal, setShowBookingModal] = useState(null);
  const [bookingTime, setBookingTime] = useState('');
  const [patientName, setPatientName] = useState('');
  const [bookingDate, setBookingDate] = useState('');

  // Open booking modal when user clicks "Schedule Appointment" on a doctor card
  const openBookingModal = (doc) => {
    setShowBookingModal(doc);
    // Default to the doctor's first available time slot
    setBookingTime(doc.availability[0] || '10:00 AM');
    setPatientName('Patient');
    setBookingDate(new Date().toISOString().split('T')[0]);
  };

  // Close the booking modal
  const closeBookingModal = () => {
    setShowBookingModal(null);
  };

  // Called when user submits the booking form
  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!showBookingModal) return;

    onBook({
      doctorId: showBookingModal.id,
      patientName,
      appointmentDate: bookingDate,
      appointmentTime: bookingTime,
    });

    // Close modal after successful booking
    setShowBookingModal(null);
  };

  // List of all available doctor specialties for filtering
  const allSpecialties = [
    'General Physician',
    'Cardiologist',
    'Pediatrician',
    'Neurologist',
    'Dermatologist',
    'Orthopedist',
  ];

  return (
    <div className="tab-content fade-in-entry">
      {/* Page header */}
      <div className="welcome-banner glass-panel">
        <div>
          <h2>Doctor Recommendation &amp; Booking</h2>
          <p>
            Browse specialists and book simulated clinical appointments based on your
            health profile.
          </p>
        </div>
      </div>

      {/* Specialty filter chips */}
      <div className="specialty-selector-panel glass-panel">
        <span>Filter by Specialty:</span>
        <div className="specialty-chips-flex">
          <button
            className={`specialty-chip-btn ${selectedSpecialty === '' ? 'specialty-chip-active' : ''}`}
            onClick={() => {
              onSpecialtyChange('');
              apiService.getDoctors('').then(setDoctors);
            }}
          >
            All Specialists
          </button>
          {allSpecialties.map((spec) => (
            <button
              key={spec}
              className={`specialty-chip-btn ${selectedSpecialty === spec ? 'specialty-chip-active' : ''}`}
              onClick={() => {
                onSpecialtyChange(spec);
                apiService.getDoctors(spec).then(setDoctors);
              }}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor cards grid */}
      <div className="doctors-directory-grid">
        {doctors.length === 0 ? (
          <div className="glass-panel no-doctors-card">
            <p>No specialists found for the selected department filter.</p>
          </div>
        ) : (
          doctors.map((doc) => (
            <div key={doc.id} className="doctor-profile-card glass-panel">
              {/* Top: avatar + name + specialty + rating */}
              <div className="doctor-card-top">
                <div className="doctor-avatar-fallback">
                  <User size={30} className="text-secondary" />
                </div>
                <div className="doctor-meta">
                  <h4>{doc.name}</h4>
                  <span className="doctor-specialty">{doc.specialty}</span>
                  <div className="doctor-rating">
                    <Star size={14} className="star-filled" />
                    <span>
                      {doc.rating} ({doc.experience} yrs exp)
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle: hospital location */}
              <div className="doctor-card-mid">
                <div className="meta-row">
                  <MapPin size={14} className="text-secondary" />
                  <span>{doc.hospital}</span>
                </div>
              </div>

              {/* Bottom: availability slots + book button */}
              <div className="doctor-card-bottom">
                <h5>Available slots:</h5>
                <div className="avail-slots-list">
                  {doc.availability.map((time, idx) => (
                    <span key={idx} className="slot-pill">
                      {time}
                    </span>
                  ))}
                </div>
                <button className="btn-primary book-slot-btn" onClick={() => openBookingModal(doc)}>
                  Schedule Appointment
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===== Booking Modal ===== */}
      {showBookingModal && (
        <div className="modal-backdrop">
          <div className="modal-content glass-panel fade-in-entry">
            <h3>Schedule Clinical Slot</h3>
            <p className="booking-doctor-label">
              Booking with: <strong>{showBookingModal.name}</strong> ({showBookingModal.specialty})
            </p>

            <form onSubmit={handleConfirmBooking} className="reminder-form">
              <div className="form-group">
                <label>Patient Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Select Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Select Time Slot</label>
                <select
                  className="form-input"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                >
                  {showBookingModal.availability.map((time, idx) => (
                    <option key={idx} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions-flex">
                <button type="button" className="btn-secondary" onClick={closeBookingModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Simulated Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
