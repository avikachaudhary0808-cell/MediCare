import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let useMock = true;
let app, auth, db;

const isConfigured = Object.values(firebaseConfig).every(v => v && typeof v === 'string' && !v.startsWith('YOUR_') && v.length > 0);

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    useMock = false;
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.error("Firebase initialization failed, falling back to mock services:", error);
    useMock = true;
  }
} else {
  console.log("Using Mock Firebase authentication and database services (Local Storage fallback).");
}

// Mock auth state listeners
const mockAuthListeners = new Set();
let mockCurrentUser = JSON.parse(localStorage.getItem('medicare_user')) || null;

const notifyAuthListeners = () => {
  mockAuthListeners.forEach(listener => listener(mockCurrentUser));
};

// Interface exports wrapping real or mock firebase methods
export const authService = {
  isMock: () => useMock,

  signUp: async (email, password, displayName) => {
    if (!useMock) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      return { ...userCredential.user, displayName };
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const users = JSON.parse(localStorage.getItem('medicare_users') || '[]');
          if (users.some(u => u.email === email)) {
            reject(new Error("Email already registered."));
            return;
          }
          const newUser = { id: 'user_' + Date.now(), email, displayName };
          users.push({ ...newUser, password });
          localStorage.setItem('medicare_users', JSON.stringify(users));
          
          mockCurrentUser = newUser;
          localStorage.setItem('medicare_user', JSON.stringify(newUser));
          notifyAuthListeners();
          resolve(newUser);
        }, 800);
      });
    }
  },

  login: async (email, password) => {
    if (!useMock) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const users = JSON.parse(localStorage.getItem('medicare_users') || '[]');
          const user = users.find(u => u.email === email && u.password === password);
          if (user) {
            const loggedInUser = { id: user.id, email: user.email, displayName: user.displayName };
            mockCurrentUser = loggedInUser;
            localStorage.setItem('medicare_user', JSON.stringify(loggedInUser));
            notifyAuthListeners();
            resolve(loggedInUser);
          } else {
            reject(new Error("Invalid email or password."));
          }
        }, 800);
      });
    }
  },

  logout: async () => {
    if (!useMock) {
      await signOut(auth);
    } else {
      mockCurrentUser = null;
      localStorage.removeItem('medicare_user');
      notifyAuthListeners();
    }
  },

  onAuthStateChanged: (callback) => {
    if (!useMock) {
      return onAuthStateChanged(auth, callback);
    } else {
      mockAuthListeners.add(callback);
      callback(mockCurrentUser);
      return () => {
        mockAuthListeners.delete(callback);
      };
    }
  },

  getCurrentUser: () => {
    return useMock ? mockCurrentUser : auth.currentUser;
  }
};
