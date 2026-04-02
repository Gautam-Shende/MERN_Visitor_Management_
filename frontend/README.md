# Visitor Management System - Frontend

This is the frontend of the Visitor Management System built using React (Vite). It provides a clean and responsive user interface for managing visitors and handling role-based workflows.

---

## Features

* User Authentication (Login / Register)
* Role-based Dashboard (Admin, Employee, Visitor)
* Add & Manage Visitors
* Search Visitors
* Update Visitor Status
* Responsive UI Design
* API Integration with Backend

---

## Tech Stack

* React.js (Vite)
* Tailwind CSS
* Axios
* React Router DOM
* React Icons
* React Toast Notifications
* React Charts
* React QR Reader

---

## Project Structure

src/
│── components/      # Reusable UI components
│── pages/           # Application pages
│── context/         # Global state
│── services/        # API calls
│── App.jsx
│── main.jsx

---

## Setup Instructions

1. Clone the repository
   git clone <your-repo-link>

2. Navigate to frontend folder
   cd frontend

3. Install dependencies
   npm install

4. Create a `.env` file

5. Start development server
   npm run dev

---

## Environment Variables

VITE_API_URL=https://mern-visitor-managment-backend.onrender.com/api

## API Integration

The frontend communicates with backend APIs using Axios.

Example:

GET /api/visitors → Fetch all visitors
POST /api/auth/login → Login user


## Pages Overview

* Login Page → User authentication
* Register Page → Create account
* Dashboard → Role-based UI
* Visitor List → View visitors
* Add Visitor → Create new visitor
* Search → Filter visitors

## Deployment

Frontend is deployed on Netlify.

Live URL:https://mern-visitor-management-frontend.onrender.com

## 📸 Screenshots

### 1. Visitor Registration
![Registration](./screenshots/1-register.png)

### 2. Appointment Booking
![Appointment](./screenshots/2-appointment.png)

### 3. QR Code Generation
![QR Code](./screenshots/3-qr-code.png)

### 4. QR Scanning
![Scanning](./screenshots/4-scanning.png)

### 5. PDF Badge
![PDF Badge](./screenshots/5-pdf.png)

### 6. Admin Dashboard
![Dashboard](./screenshots/6-dashboard.png)

### 7. Check-in Successful
![Check-in](./screenshots/7-checkin.png)

### 8. Email Notification
![Email](./screenshots/8-email.png)