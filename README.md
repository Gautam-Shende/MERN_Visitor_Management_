
# Visitor Management System (MERN Stack)

This is a full-stack Visitor Management System built using the MERN stack. The application allows visitors to register, employees to manage visitor requests, and admins to approve or reject access.

This project follows industry-level backend architecture with a proper Service Layer, clean API design, and structured codebase.

---

## Features

* User Authentication (JWT-based login/register)
* Role-based Access Control (Admin, Employee, Visitor)
* Visitor Registration & Management
* Search Visitors (Dedicated API)
* Update Visitor Status (Separate Endpoint)
* Clean Architecture (Controller → Service → Model)
* Input Validation & Error Handling
* Responsive UI

---

## Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS
* Axios
* React Router DOM

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

---

## Project Structure

assignment-9/
│── backend/      # Backend APIs and logic
│── frontend/     # React frontend

---

## Setup Instructions

### 1. Clone Repository

git clone <your-repo-link>

---

### 2. Backend Setup

cd backend
npm install
npm run dev

---

### 3. Frontend Setup

cd frontend
npm install
npm run dev

---

## Environment Variables

### Backend (.env)

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

### Frontend (.env)

VITE_API_URL=http://localhost:5000/api

---

## API Documentation

Detailed API documentation is available inside the backend folder.

---

## Testing

* All APIs are tested using Postman
* Postman collection is included in the repository
* Includes testing for success and error cases

---

## Deployment

Frontend (Netlify):
https://your-frontend-url.netlify.app

Backend (Render):
https://your-backend-url.onrender.com

---

## Architecture

This project follows a layered architecture:

Route → Controller → Service → Model

* Controllers handle request/response
* Services contain business logic
* Models handle database operations

---

## Author

Gautam
