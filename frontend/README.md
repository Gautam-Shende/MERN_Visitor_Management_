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

---

## Project Structure

src/
│── components/      # Reusable UI components
│── pages/           # Application pages
│── context/         # Global state
│── services/        # API calls
│── hooks/           # Custom hooks
│── utils/           # Utility functions
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

VITE_API_URL=http://localhost:5000/api

(Replace with deployed backend URL in production)

---

## API Integration

The frontend communicates with backend APIs using Axios.

Example:

GET /api/visitors → Fetch all visitors
POST /api/auth/login → Login user

---

## Pages Overview

* Login Page → User authentication
* Register Page → Create account
* Dashboard → Role-based UI
* Visitor List → View visitors
* Add Visitor → Create new visitor
* Search → Filter visitors

---

## Build for Production

To create production build:

npm run build

---

## Deployment

Frontend is deployed on Netlify.

Live URL:
https://your-frontend-url.netlify.app

---

## Notes

* Backend must be running for frontend to work
* Update API base URL in `.env` for production
* Keep code clean and remove unused files

---

## Author

Gautam
