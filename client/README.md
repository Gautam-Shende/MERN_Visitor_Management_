# Visitor Management System - Client side Response.

This is the frontend of the Visitor Management System built using React (Vite). It provides a clean and responsive user interface for managing visitors and handling role-based workflows.

---

## Features

- User Authentication (Login / Register)
- Role-based Dashboard (Admin, Employee, Security, Visitor)
- Appointment Request & Scheduling
- Digital Pass Generation with QR Code
- QR Code Scanning for Check-in/Check-out
- Visitor Management (Add, View, Search, Update Status)
- Pass Management (Active, Inside, Expired)
- Reports Generation (CSV/Excel Export)
- Responsive UI Design
- API Integration with Backend

---

## Tech Stack

- React.js (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- React Icons
- Recharts (Dashboard Charts)
- html5-qrcode (QR Scanning)
- React Hot Toast (Notifications)

---

## Project Structure

src/
│── components/
│ ├── common/ # Reusable UI components
│ └── layout/ # Navbar, Sidebar, ProtectedRoute
│── pages/
│ ├── auth/ # Login pages
│ ├── admin/ # Dashboard, Reports, Scan
│ ├── appointments/ # Appointments, Pending Requests
│ ├── visitors/ # Visitors, VisitorDetails
│ ├── passes/ # Passes, PassDetails
│ ├── profile/ # User Profile
│ └── visitorFlow/ # Visitor Dashboard, Appointments,Passes
│── context/ # AuthContext (Global state)
│── services/ # API calls
│── utils/ # Constants & Helper functions
│── App.jsx
│── main.jsx 


## Machine Installation

npm install vite@latest


## .env root directory
.env 

## Frotend URL

