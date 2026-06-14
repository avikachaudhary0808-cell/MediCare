// App.jsx — The main application component (now only ~120 lines!)
// This file just wires everything together. All feature logic lives in separate component files.
// For interviews, you can explain:
//   "App.jsx is the root component. It manages global auth state and navigation,
//    then renders the correct component for each tab."
import React, { useState, useEffect } from 'react';
import { authService } from './services/firebase';
import { apiService } from './services/api';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import SymptomChecker from './components/SymptomChecker';
import Reminders from './components/Reminders';
import DoctorBooking from './components/DoctorBooking';
import './App.css';

export default function App() {
  // --- Auth State ---
  // Firebase user object (null when not logged in)
  const [user, setUser] = useState(null);
  // Whether the auth modal is visible on the landing page
  const [showAuth, setShowAuth] = useState(false);

  // --- Navigation State ---
  // Which tab is currently active: home, dashboard, symptoms, reminders, doctors, contact
  const [activeTab, setActiveTab] = useState('home');

  // --- Data State ---
  // Fetched from the Spring Boot backend (with local-storage fallback in api.js)
  const [dashboardData, setDashboardData] = useState({
    todayProgress: 0,
    totalTasks: 0,
    completedTasks: 0,
    weeklyTrends: [],
    recoveryStatus: 'Loading...',
  });
  const [reminders, setReminders] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // --- Symptom Checker State ---
  // Doctor specialty selected based on AI analysis result (used in DoctorBooking)
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  // --- Auth listener ---
  // Firebase keeps us updated when user logs in or out
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((currUser) => {
      setUser(currUser);
    });
    // Cleanup: unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  // --- Data loading ---
  // Fetch all data from backend when user logs in OR when tab changes
  // (so each tab always has fresh data)
  useEffect(() => {
    if (!user) return;
    loadAllData();
  }, [user, activeTab]);

  const loadAllData = async () => {
    try {
      // Run all API calls in parallel for better performance
      const [dash, rems, docs, books] = await Promise.all([
        apiService.getDashboardData(),
        apiService.getReminders(),
        apiService.getDoctors(selectedSpecialty),
        apiService.getBookings(),
      ]);
      setDashboardData(dash);
      setReminders(rems);
      setDoctors(docs);
      setAppointments(books);
    } catch (e) {
      console.error('Failed to load data:', e);
    }
  };

  // --- Auth Handlers ---
  // Called by AuthModal after Firebase login/signup succeeds
  const handleAuth = async (email, password, name, mode) => {
    if (mode === 'login') {
      await authService.login(email, password);
    } else {
      await authService.signUp(email, password, name);
    }
    // Close the auth modal once logged in
    setShowAuth(false);
  };

  // Called when user clicks the logout button in the Navbar
  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setActiveTab('home');
  };

  // --- Reminder Handlers ---
  const handleToggleReminder = async (id) => {
    await apiService.toggleReminder(id);
    loadAllData();
  };

  const handleDeleteReminder = async (id) => {
    await apiService.deleteReminder(id);
    loadAllData();
  };

  const handleCreateReminder = async (reminderData) => {
    await apiService.addReminder(reminderData);
    loadAllData();
  };

  // --- Doctor Booking Handler ---
  const handleBookAppointment = async (bookingData) => {
    await apiService.createBooking(bookingData);
    loadAllData();
    setActiveTab('dashboard'); // Jump to dashboard to show the new appointment
  };

  // --- Render logic ---

  // If user is NOT logged in, show the public landing page
  if (!user) {
    return (
      <div className="app-layout guest-layout">
        <main className="app-main-content guest-main">
          <Home onGetStarted={() => setShowAuth(true)} />
        </main>
        {showAuth && (
          <AuthModal
            onClose={() => setShowAuth(false)}
            onAuth={handleAuth}
          />
        )}
      </div>
    );
  }

  // Once logged in, show the full app with Navbar and content
  return (
    <div className="app-layout">
      <Navbar
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="app-main-content">
        {activeTab === 'home' && <Home />}
        {activeTab === 'contact' && <Contact />}
        {activeTab === 'dashboard' && (
          <Dashboard
            dashboardData={dashboardData}
            reminders={reminders}
            appointments={appointments}
            onViewReminders={() => setActiveTab('reminders')}
            onViewDoctors={() => setActiveTab('doctors')}
          />
        )}
        {activeTab === 'symptoms' && (
          <SymptomChecker
            apiService={apiService}
            selectedSpecialty={selectedSpecialty}
            onSpecialtyChange={setSelectedSpecialty}
            onNavigateToDoctors={() => setActiveTab('doctors')}
          />
        )}
        {activeTab === 'reminders' && (
          <Reminders
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            onDeleteReminder={handleDeleteReminder}
            onCreateReminder={handleCreateReminder}
          />
        )}
        {activeTab === 'doctors' && (
          <DoctorBooking
            doctors={doctors}
            appointments={appointments}
            selectedSpecialty={selectedSpecialty}
            onSpecialtyChange={setSelectedSpecialty}
            onBook={handleBookAppointment}
            apiService={apiService}
          />
        )}
      </main>
    </div>
  );
}
