
# Visitor Management System (MERN Stack)

A full‑stack Visitor Management System built with the MERN stack (MongoDB, Express, React, Node.js).  
Visitors can register, employees manage requests, and admins approve or reject access. The backend follows a clean, layered architecture (Controller → Service → Model) for maintainability and scalability.

## Features

- 🔐 JWT authentication (login / register)
- 🎭 Role‑based access control (Admin, Employee, Visitor)
- 📝 Visitor registration & self‑management
- 🔍 Dedicated search API for visitors
- 🔄 Separate endpoint to update visitor status
- ✅ Input validation & error handling
- 📱 Responsive UI with Tailwind CSS

## Tech Stack

**Frontend**  
- React (Vite)  
- Tailwind CSS  
- Axios  
- React Router DOM  

**Backend**  
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JSON Web Tokens (JWT)

## Project Structure

assignment-9/
├── backend/      # API and server logic
└── frontend/     # React frontend

## Local Setup

### 1. Clone the repository
git clone <your-repo-link>

### 2. Backend setup

cd backend
npm install
npm run dev

### 3. Frontend setup

cd frontend
npm install
npm run dev

### Environment Variables

**Backend (`.env`)**  
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

**Frontend (`.env`)**  

VITE_API_URL=http://localhost:5000/api

## API Documentation

Detailed API documentation is available inside the `backend` folder.

## Testing

- All APIs tested with Postman (both success & error cases)  
- Postman collection included in the repository

## Deployment

- **Frontend** (Render): [https://mern-visitor-management-frontend.onrender.com](https://mern-visitor-management-frontend.onrender.com)  
- **Backend** (Render): [https://mern-visitor-managment-backend.onrender.com](https://mern-visitor-managment-backend.onrender.com)

## Architecture

The backend follows a layered pattern:

**Route → Controller → Service → Model**

- **Route** backend Routing API's  
- **Controllers** handle request/response  
- **Services** contain business logic  
- **Models** interact with the database  

This separation keeps the code clean, testable, and easy to maintain.

## Author

**Gautam**
