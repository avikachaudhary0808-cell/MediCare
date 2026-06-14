# MediCare - Full-Stack Health Management App

A modern, full-stack healthcare web application built with **React + Vite** on the frontend and **Spring Boot (Java)** on the backend. Features include an AI-powered symptom checker, medication reminders, and doctor appointment booking.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Backend | Spring Boot (Java 17) |
| Database | H2 (embedded, file-based) |
| AI | Google Gemini API |
| Auth | Firebase Auth |
| UI | Custom CSS with glassmorphism design |
| Charts | Recharts |

## Features

- **Dashboard** — Daily progress tracking with circular score and weekly trend charts
- **AI Symptom Checker** — Chat with a virtual AI doctor and run diagnostic analysis
- **Reminders** — Manage medication schedules and health tasks with checkboxes
- **Doctor Booking** — Browse specialists and book simulated appointments
- **Firebase Auth** — Email/password login and registration

## Project Structure

```
MediCare/
├── backend/                     # Spring Boot REST API
│   ├── src/main/java/com/example/demo/
│   │   ├── controller/          # REST endpoints
│   │   ├── model/               # JPA entities
│   │   ├── repository/          # Data access layer
│   │   └── service/             # Business logic + AI
│   └── src/main/resources/
│       └── application.properties
├── frontend/                    # React + Vite app
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SymptomChecker.jsx
│   │   │   ├── Reminders.jsx
│   │   │   ├── DoctorBooking.jsx
│   │   │   └── AuthModal.jsx
│   │   ├── pages/               # Static page views
│   │   ├── services/            # API + Firebase config
│   │   ├── App.jsx              # Root component (wires everything)
│   │   └── App.css / index.css
│   └── package.json
└── README.md
```

## How to Run

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.x
- Firebase project credentials

### Start the Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs at **http://localhost:8080**

### Start the Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

## Backend Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/dashboard/progress` | Dashboard progress data |
| GET | `/api/reminders` | List reminders (optional `?date=`) |
| POST | `/api/reminders` | Create a new reminder |
| PUT | `/api/reminders/{id}/toggle` | Toggle reminder completion |
| DELETE | `/api/reminders/{id}` | Delete a reminder |
| GET | `/api/doctors` | List doctors (optional `?specialty=`) |
| GET | `/api/bookings` | List appointments |
| POST | `/api/bookings` | Create an appointment |
| POST | `/api/symptom-check` | Analyze symptoms |
| POST | `/api/chat` | AI chat with history |

## Interview Talking Points

> **"I built a full-stack healthcare web app called MediCare."**
>
> - Frontend: **React.js** with component-based architecture
> - Backend: **Spring Boot REST API** (Java)
> - Database: **H2 with JPA/Hibernate**
> - AI: **Google Gemini API** for symptom analysis and chat
> - Authentication: **Firebase Auth**
> - UI: Custom **CSS glassmorphism** design

Each feature lives in its own small component file (50-150 lines), making the codebase easy to explain and maintain.

## Portfolio Tips

1. Push this repo to GitHub with this README at the root
2. Take screenshots of each tab (Dashboard, Symptom Checker, Reminders, Doctors)
3. Add screenshots section to this README
4. Link the live demo (Vercel/Netlify) if deployed

---

> *Note: This is an educational project. The symptom checker and AI chat provide informational insights only, not medical advice.*
