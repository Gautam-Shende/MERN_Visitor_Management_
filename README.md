
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
- React Scanner
- React Charts

**Backend**  
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JSON Web Tokens (JWT)
- EmailJs
- Cloudinary

## Project Structure

MERN_Visitor_Management/
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

## 🧪 Postman API Testing

### Quick Import
[![Run in Postman](https://run.pstmn.io/button.svg)](./MERN_Visitor_Managment.postman_collection.json)

### Download Collection
- [JSON Collection](./MERN_Visitor_Managment.postman_collection.json)

### Import Instructions
1. Download the JSON file
2. Open Postman → **Import** → **Upload Files**
3. Select the downloaded file
4. Start testing!

### Sample API Request (cURL)
## Admin Login
POST http://localhost:5000/api/auth/login \
  - "Content-Type: application/json" \
  - '{"email":"admin@mail.com","password":"admin123"}'

## Get All Visitors
GET http://localhost:5000/api/visitors \
  - "Authorization: Bearer YOUR_TOKEN"

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
