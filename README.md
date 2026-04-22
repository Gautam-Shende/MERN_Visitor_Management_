# Visitor Management System (MERN Stack)

A complete visitor management system that I built to replace paper-based logbooks with a digital solution. Visitors can request appointments online, employees can schedule them, and security personnel can scan QR codes at the entrance. The whole system runs on the MERN stack.

**Live Demo:** [https://mern-visitor-management-frontend.onrender.com](https://mern-visitor-management-frontend.onrender.com)

**Backend API:** [https://mern-visitor-managment-backend.onrender.com](https://mern-visitor-managment-backend.onrender.com)

**GitHub Repo:** [https://github.com/Gautam-Shende/MERN_Visitor_Management_](https://github.com/Gautam-Shende/MERN_Visitor_Management_)

---

## 📌 What This Project Does

I started this project because I saw how messy manual visitor registers can be. This system handles everything digitally - from the moment a visitor requests an appointment until they check out after their visit.

**The main workflow goes like this:**

A visitor registers online and requests an appointment with a preferred date. An employee reviews the request, schedules a specific time, and assigns a host. The admin approves it, and the system automatically generates a digital pass with a QR code. When the visitor arrives, security scans the QR code to check them in, and again when they leave.

No paperwork, no confusion, everything tracked automatically.

---

## ✨ Features

### For Visitors
- Self-registration with profile photo upload
- Request appointments with preferred date and time
- Track appointment status (requested → pending → approved → rejected)
- Download digital passes with QR codes
- View complete visit history

### For Employees
- View all pending appointment requests
- Schedule appointments with specific dates and hosts
- Convert visitor requests into confirmed appointments
- Manage visitors and generate passes after approval

### For Admin
- Complete dashboard with charts and statistics
- View all visitors, appointments, and passes
- Approve or reject any appointment
- Generate and export reports (CSV/Excel)
- Monitor check-in and check-out activity

### For Security
- Scan QR codes using device camera
- Record check-in and check-out times automatically
- Validate passes in real-time
- View pass details instantly

---

## 🛠️ Tech Stack

### Frontend
- React 18 with Vite (fast build times)
- Tailwind CSS for styling (no separate CSS files to manage)
- Axios for API calls with interceptors
- React Router DOM for navigation and protected routes
- Recharts for dashboard analytics
- html5-qrcode for QR scanning
- React Hot Toast for notifications

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcryptjs for password hashing
- Cloudinary for storing photos, QR codes, and PDFs
- Multer for handling file uploads
- Nodemailer for email notifications
- QRCode library for generating QR codes
- html-pdf for generating pass PDFs
- ExcelJS and json2csv for exports

---

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
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

**Frontend (`.env`)**  

VITE_API_URL=https://mern-visitor-managment-backend.onrender.com/api


## API Documentation

Detailed API documentation is available inside the `backend` folder.

## 🌱 Database Seeding

### Default Users

The system comes with 3 default user accounts for testing:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | `admin@mail.com` | `admin123` | Full system access |
| Employee | `employee@mail.com` | `employee123` | Visitor & appointment management |
| Security | `security@mail.com` | `security123` | QR scanning & check-in/out |

### Seed File Location


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
POST http://localhost:4000/api/auth/login 
  - "Content-Type: application/json" \
  - '{"email":"admin@mail.com","password":"admin123"}'

## Get All Visitors
GET http://localhost:4000/api/visitors  \
Authorization - Bearer Token
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

