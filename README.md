# 🏥 MediCare – AI-Powered Health Management System

## Overview

MediCare is a modern full-stack healthcare web application designed to help users manage their daily health activities through an intuitive dashboard, AI-assisted symptom analysis, medication reminders, and doctor appointment booking.

The project demonstrates full-stack development using React and Spring Boot while integrating authentication and AI capabilities.

---

## Features

* 📊 Health Dashboard with progress tracking
* 🤖 AI Symptom Checker powered by Google Gemini
* 💊 Medication Reminder Management
* 👨‍⚕️ Doctor Appointment Booking System
* 🔐 Secure User Authentication using Firebase
* 📈 Interactive Charts and Analytics
* 📱 Responsive and Modern Glassmorphism UI

---

## Tech Stack

| Category       | Technology                  |
| -------------- | --------------------------- |
| Frontend       | React.js, Vite              |
| Backend        | Spring Boot (Java 17)       |
| Database       | H2 Database                 |
| Authentication | Firebase Authentication     |
| AI Integration | Google Gemini API           |
| Charts         | Recharts                    |
| Styling        | CSS3 (Glassmorphism Design) |

---

## Project Structure

```
MediCare/
├── backend/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   └── application.properties
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── package.json
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/MediCare.git
cd MediCare
```

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

Runs on:

```
http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

## REST API Endpoints

| Method | Endpoint                   |
| ------ | -------------------------- |
| GET    | /api/health                |
| GET    | /api/dashboard/progress    |
| GET    | /api/reminders             |
| POST   | /api/reminders             |
| PUT    | /api/reminders/{id}/toggle |
| DELETE | /api/reminders/{id}        |
| GET    | /api/doctors               |
| GET    | /api/bookings              |
| POST   | /api/bookings              |
| POST   | /api/symptom-check         |
| POST   | /api/chat                  |

---

## Skills Demonstrated

* Full-Stack Development
* REST API Design
* React Component Architecture
* Spring Boot Backend Development
* Firebase Authentication
* Database Management with JPA/Hibernate
* AI API Integration
* Responsive UI Design

---

## Future Enhancements

* Real appointment scheduling
* Email/SMS reminders
* Doctor dashboard
* Patient history management
* Cloud database deployment

---

## Disclaimer

This project is intended for educational and portfolio purposes only. The AI symptom checker provides informational responses and should not be considered professional medical advice.
