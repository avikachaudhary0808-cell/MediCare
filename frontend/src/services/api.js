const BASE_URL = 'http://localhost:8080/api';

// Helper to make fetch calls, falling back to local storage simulation on network failure
const fetchJson = async (endpoint, options = {}) => {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Connection to Spring Boot backend failed at ${endpoint}. Using client-side simulation.`, error.message);
    throw error; // Let the caller catch and fall back
  }
};

// Client-side simulation state stored in LocalStorage for fallback
const getLocalData = (key, defaultVal) => JSON.parse(localStorage.getItem(key)) || defaultVal;
const setLocalData = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// Seed local fallback reminders
const initLocalReminders = () => {
  const list = getLocalData('mc_reminders', null);
  if (!list) {
    const today = new Date().toISOString().split('T')[0];
    const initial = [
      { id: "rem1", title: "Amoxicillin (Antibiotic)", type: "medication", time: "08:00 AM", dosage: "500mg, 1 tablet after food", completed: false, date: today },
      { id: "rem2", title: "Check Blood Pressure", type: "task", time: "09:00 AM", dosage: null, completed: true, date: today },
      { id: "rem3", title: "Multivitamin Capsule", type: "medication", time: "01:00 PM", dosage: "1 capsule daily", completed: false, date: today },
      { id: "rem4", title: "Evening Walk", type: "task", time: "06:00 PM", dosage: "30 mins brisk walking", completed: false, date: today },
      { id: "rem5", title: "Drink 8 glasses of water", type: "task", time: "08:00 PM", dosage: "Track daily hydration", completed: false, date: today }
    ];
    setLocalData('mc_reminders', initial);
    return initial;
  }
  return list;
};

// Seed local fallback bookings
const initLocalBookings = () => {
  const list = getLocalData('mc_bookings', null);
  if (!list) {
    setLocalData('mc_bookings', []);
    return [];
  }
  return list;
};

const MOCK_DOCTORS = [
  { id: "doc1", name: "Dr. Sarah Jenkins", specialty: "Cardiologist", experience: 15, rating: 4.9, availability: ["09:00 AM", "11:00 AM", "02:00 PM"], hospital: "Metro Heart Institute" },
  { id: "doc2", name: "Dr. Amit Patel", specialty: "General Physician", experience: 10, rating: 4.7, availability: ["10:00 AM", "12:00 PM", "03:00 PM", "04:00 PM"], hospital: "City Care Clinic" },
  { id: "doc3", name: "Dr. Lisa Wong", specialty: "Pediatrician", experience: 12, rating: 4.8, availability: ["09:30 AM", "11:30 AM", "01:30 PM"], hospital: "Children's Health Center" },
  { id: "doc4", name: "Dr. Robert Carter", specialty: "Neurologist", experience: 18, rating: 4.9, availability: ["10:30 AM", "02:30 PM", "03:30 PM"], hospital: "Neuroscience Hospital" },
  { id: "doc5", name: "Dr. Elena Rostova", specialty: "Dermatologist", experience: 8, rating: 4.6, availability: ["08:00 AM", "10:00 AM", "01:00 PM", "05:00 PM"], hospital: "Skin & Laser Center" },
  { id: "doc6", name: "Dr. James O'Connor", specialty: "Orthopedist", experience: 14, rating: 4.8, availability: ["11:00 AM", "03:00 PM", "04:30 PM"], hospital: "Bone & Joint Clinic" }
];

export const apiService = {
  // 0. AI Chatbot Assistant
  chat: async (chatHistory, message) => {
    try {
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatHistory, message }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.warn("Connection to Spring Boot chat endpoint failed. Using client-side simulation.", error.message);
      return new Promise((resolve) => {
        setTimeout(() => {
          const msg = message.toLowerCase();
          if (msg.includes("hello") || msg.includes("hi ") || msg.trim() === "hi" || msg.includes("hey")) {
            resolve("Hello! I am your MediCare AI Assistant. How can I help you today? Please tell me what physical symptoms you are experiencing.");
          } else if (msg.includes("chest") || msg.includes("breathing") || msg.includes("shortness") || msg.includes("heart")) {
            resolve("⚠️ **CRITICAL ADVICE**: Your symptoms suggest a potentially severe medical situation. Please go to the nearest emergency room or call ambulance services immediately. \n\n*DISCLAIMER: I am an AI, not a doctor. This does not replace professional medical triage.*");
          } else if (msg.includes("fever") || msg.includes("temperature")) {
            resolve("A fever indicates your body is fighting off an infection. Are you also experiencing symptoms like chills, body aches, a sore throat, or cough? Knowing this helps narrow down possibilities.\n\n*DISCLAIMER: This is for educational purposes only and does not replace professional medical advice.*");
          } else if (msg.includes("cough") || msg.includes("throat") || msg.includes("flu")) {
            resolve("Cough and sore throat are common respiratory signs. It could be a common cold, influenza, or allergies. Rest, stay hydrated, and consider warm liquids. Do you have a fever or difficulty breathing?\n\n*DISCLAIMER: Educational information only. Consult a doctor if symptoms worsen.*");
          } else if (msg.includes("thank") || msg.includes("thanks")) {
            resolve("You're very welcome! Feel free to track your medications and schedules in the 'Reminders' tab to maintain your recovery score. Stay healthy!");
          } else {
            resolve("I understand you are experiencing discomfort. Could you describe your symptoms in more detail, such as when they started, their severity, or any other signs you notice?\n\n*DISCLAIMER: This information is for educational purposes and is not a substitute for professional medical advice.*");
          }
        }, 1000);
      });
    }
  },

  // 1. Symptom Checker
  checkSymptoms: async (symptoms) => {
    try {
      return await fetchJson('/symptom-check', {
        method: 'POST',
        body: JSON.stringify({ symptoms })
      });
    } catch {
      // Simulation fallback
      return new Promise((resolve) => {
        setTimeout(() => {
          const list = symptoms.map(s => s.toLowerCase());
          let conditions = ["Common Cold (75%)", "Allergic Rhinitis (50%)"];
          let riskLevel = "Low";
          let guidance = "Rest, stay hydrated by drinking plenty of water, and monitor your temperature. Consider over-the-counter decongestants.";
          
          const hasSevere = list.some(s => s.includes("chest") || s.includes("shortness") || s.includes("breathing") || s.includes("heart"));
          const hasModerate = list.some(s => s.includes("fever") || s.includes("vomit") || s.includes("headache") || s.includes("stomach"));
          
          if (hasSevere) {
            conditions = ["Cardiovascular Issues (40%)", "Severe Respiratory Infection (35%)"];
            riskLevel = "High";
            guidance = "WARNING: Your symptoms suggest a potentially serious medical condition. Please seek immediate professional medical attention or go to the nearest emergency room.";
          } else if (hasModerate) {
            conditions = ["Influenza (70%)", "Gastroenteritis (60%)", "Migraine (50%)"];
            riskLevel = "Medium";
            guidance = "Track your symptoms closely. If they worsen, or if your fever remains high for more than 48 hours, please schedule an appointment with a doctor.";
          }
          
          resolve({
            conditions,
            riskLevel,
            guidance,
            disclaimer: "DISCLAIMER: This information is for educational purposes and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician."
          });
        }, 1000);
      });
    }
  },

  // 2. Doctor list and simulation
  getDoctors: async (specialty) => {
    try {
      let endpoint = '/doctors';
      if (specialty) endpoint += `?specialty=${encodeURIComponent(specialty)}`;
      return await fetchJson(endpoint);
    } catch {
      if (!specialty) return MOCK_DOCTORS;
      return MOCK_DOCTORS.filter(d => d.specialty.toLowerCase() === specialty.toLowerCase());
    }
  },

  getBookings: async () => {
    try {
      return await fetchJson('/bookings');
    } catch {
      return initLocalBookings();
    }
  },

  createBooking: async (booking) => {
    try {
      return await fetchJson('/bookings', {
        method: 'POST',
        body: JSON.stringify(booking)
      });
    } catch {
      const bookings = initLocalBookings();
      const doc = MOCK_DOCTORS.find(d => d.id === booking.doctorId) || { name: "Dr. Unknown", specialty: "General" };
      const newBooking = {
        ...booking,
        id: "book_" + Date.now(),
        doctorName: doc.name,
        specialty: doc.specialty,
        status: "Confirmed"
      };
      bookings.push(newBooking);
      setLocalData('mc_bookings', bookings);
      return newBooking;
    }
  },

  // 3. Reminders Management
  getReminders: async (date) => {
    try {
      let endpoint = '/reminders';
      if (date) endpoint += `?date=${date}`;
      return await fetchJson(endpoint);
    } catch {
      const today = new Date().toISOString().split('T')[0];
      const targetDate = date || today;
      const list = initLocalReminders();
      return list.filter(r => r.date === targetDate);
    }
  },

  addReminder: async (reminder) => {
    try {
      return await fetchJson('/reminders', {
        method: 'POST',
        body: JSON.stringify(reminder)
      });
    } catch {
      const list = initLocalReminders();
      const today = new Date().toISOString().split('T')[0];
      const newReminder = {
        ...reminder,
        id: "rem_" + Date.now(),
        completed: false,
        date: reminder.date || today
      };
      list.push(newReminder);
      setLocalData('mc_reminders', list);
      return newReminder;
    }
  },

  toggleReminder: async (id) => {
    try {
      return await fetchJson(`/reminders/${id}/toggle`, { method: 'PUT' });
    } catch {
      const list = initLocalReminders();
      const item = list.find(r => r.id === id);
      if (item) {
        item.completed = !item.completed;
        setLocalData('mc_reminders', list);
      }
      return item;
    }
  },

  deleteReminder: async (id) => {
    try {
      return await fetchJson(`/reminders/${id}`, { method: 'DELETE' });
    } catch {
      const list = initLocalReminders();
      const filtered = list.filter(r => r.id !== id);
      setLocalData('mc_reminders', filtered);
      return { success: true };
    }
  },

  // 4. Dashboard analytics
  getDashboardData: async () => {
    try {
      return await fetchJson('/dashboard/progress');
    } catch {
      const list = initLocalReminders();
      const today = new Date().toISOString().split('T')[0];
      
      // Calculate today
      const todayTasks = list.filter(r => r.date === today);
      const totalToday = todayTasks.length;
      const completedToday = todayTasks.filter(r => r.completed).length;
      const todayProgress = totalToday === 0 ? 0 : Math.round((completedToday / totalToday) * 100);
      
      // Calculate past 7 days
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const weeklyTrends = [];
      const defaultTrends = [65, 70, 55, 80, 90, 75];
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = days[d.getDay()];
        
        const tasksForDay = list.filter(r => r.date === dateStr);
        let progress = 0;
        if (tasksForDay.length > 0) {
          progress = Math.round((tasksForDay.filter(r => r.completed).length / tasksForDay.length) * 100);
        } else if (i > 0) {
          progress = defaultTrends[6 - i] || 60;
        } else {
          progress = todayProgress;
        }
        
        weeklyTrends.push({
          day: dayName,
          date: dateStr,
          progress: progress
        });
      }
      
      let recoveryStatus = "Moderate (Recovering)";
      if (todayProgress >= 90) recoveryStatus = "Excellent (Highly Active)";
      else if (todayProgress >= 70) recoveryStatus = "Good (On Track)";
      else if (todayProgress >= 50) recoveryStatus = "Moderate (Recovering)";
      else recoveryStatus = "Critical (Needs Attention)";
      
      return {
        todayProgress,
        totalTasks: totalToday,
        completedTasks: completedToday,
        weeklyTrends,
        recoveryStatus
      };
    }
  }
};
