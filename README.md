# Visitor Management System (MERN Stack)

A complete visitor management system that I built to replace paper-based logbooks with a digital solution. Visitors can request appointments online, employees can schedule them, and security personnel can scan QR codes at the entrance. The whole system runs on the MERN stack.

**Live Demo:** [https://mern-visitor-management-frontend.onrender.com](https://mern-visitor-management-client-frontend.onrender.com)

**Backend API:** [https://mern-visitor-managment-backend.onrender.com](https://mern-visitor-management-client-frontend.onrender.com)

**GitHub Repo:** [https://github.com/Gautam-Shende/MERN_Visitor_Management_](https://github.com/Gautam-Shende/MERN_Visitor_Management_.git)

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
├── server/      # API and server logic
└── client/     # React frontend

## Local Setup

### 1. Clone the repository
git clone https://github.com/Gautam-Shende/MERN_Visitor_Management_.git

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

VITE_API_URL=https:https://mern-visitor-management-client-frontend.onrender.com

## 🚢 Deployment

### Backend (Render)

1. Push code to GitHub
2. On Render → New Web Service → Connect GitHub repo
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables (PORT, MONGO_URI, JWT_SECRET, Cloudinary keys, Email credentials)
6. Click "Create Web Service"

### Frontend (Render)

1. On Render → New Static Site → Connect same GitHub repo
2. Root Directory: `client`
3. Build Command: `npm run build`
4. Publish Directory: `dist`
5. Add env variable: `VITE_API_URL` = `https://mern-visitor-management-client-frontend.onrender.com/api`
6. Click "Create Static Site"

### Live URLs

| Service | URL |
|---------|-----|
| Frontend | https://mern-visitor-management-client-frontend.onrender.com |
| Backend | https://mern-visitor-management-client-frontend.onrender.com |

## API Documentation

Detailed API documentation is available inside the `backend` folder.

### Default Users

The system comes with 3 default user accounts for testing:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | `admin@mail.com` | `admin123` | Full system access |
| Employee | `employee@mail.com` | `employee123` | Visitor & appointment management |
| Security | `security@mail.com` | `security123` | QR scanning & check-in/out |

### database seeding, and file location
**server/src/seed/seed.js**
**visitors**
const visitors = [
  {
    name: "Rahul Sharma",
    email: "rahul@mail.com",
    phone: "9876543210",
    password: "rahul123",
  },
  {
    name: "Priya Patel",
    email: "priya@mail.com",
    phone: "9876543211",
    password: "priya123",
  },
];

**staffs users**
const users = [
  {
    name: "Admin User",
    email: "admin@mail.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Employee User",
    email: "employee@mail.com",
    password: "employee123",
    role: "employee",
  },
  {
    name: "Security User",
    email: "security@mail.com",
    password: "security123",
    role: "security",
  },
];


## 📧 Email Notifications
The system automatically sends emails for:

Event	Sent To
Visitor registration	        Visitor
Appointment request submitted	Visitor
Appointment approved	        Visitor
Appointment rejected	        Visitor
Pass generated	              Visitor
Check-in successful	          Visitor
Check-out successful	        Visitor

## Postman API Testing
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


## Architecture

The backend follows a layered pattern:

**Route → Middleware → Controller → utils → Service → Model**

- **Route** backend Routing API's
- **Middleware** role, auth, uploads logic
- **Controllers** handle request/response
- **utils** emailservice, logic, qr genrator, pdf genrator
- **Services** contain business logic  
- **Models** interact with the database  

## Problems Faced & Solutions

### 1. The Uploads Folder That Never Got Used

**What happened:**  
When I first set up the backend, I added a line in server.js to serve static files from an "uploads" folder. I thought I would save visitor photos locally. But later I switched to Cloudinary for file storage. The folder never got created because all files were going directly to Cloudinary. That static file line was just sitting there doing nothing.

**How I fixed it:**  
I simply removed that line from server.js. No more useless code. All files still go to Cloudinary and everything works fine.

---

### 2. PDF Generation Broke on Render

**What happened:**  
I was using html-pdf to generate visitor passes. Locally it worked perfectly. But when I deployed to Render, the PDF generation failed. Turns out Render doesn't allow writing files to disk. The library was trying to save the PDF locally and couldn't.

**How I fixed it:**  
Instead of saving the PDF to disk, I generated it as a buffer in memory. Then I uploaded that buffer directly to Cloudinary. Now the PDF lives in the cloud and I just store the URL in my database.

---

### 3. Visitors Were Checking In Multiple Times

**What happened:**  
The security guard scanned the same QR code three times and the system created three separate check-in records for the same visitor. That made no sense. A person cannot be inside the building multiple times simultaneously.

**How I fixed it:**  
I changed the logic in the scan endpoint. First I check if there is an active session (checked in but not checked out). If yes, I process a check-out. If no, I process a check-in. One person, one active session at a time.

---

### 4. Gmail Would Not Send Emails

**What happened:**  
I spent two hours trying to figure out why nodemailer wasn't working. I kept getting "invalid login" errors. I was using my regular Gmail password. Nothing worked.

**How I fixed it:**  
I learned that Google disabled "less secure apps" access. The solution was to enable 2-factor authentication on my Gmail account and generate an "App Password". That special password worked immediately. Emails started flowing.

---

### 5. CORS Errors Blocking Everything

**What happened:**  
My frontend was running on port 5173 and my backend on port 4000. Every time the frontend tried to call an API, the browser blocked it with a CORS error. Nothing worked.

**How I fixed it:**  
I added the cors middleware to my Express app and configured it properly. I set the origin to my frontend URL (localhost in development, the live URL in production). I also added credentials: true so that authentication tokens would be sent correctly.

---

### 6. Users Had to Login Every Week

**What happened:**  
The JWT token expired after 7 days. Users would come back to the website and find themselves logged out. They had to enter their email and password again. It was annoying.

**How I fixed it:**  
I kept the 7-day expiry for security reasons. But I added an interceptor in the frontend that listens for 401 errors. When the token expires, the user gets automatically redirected to the login page. Not a perfect solution but at least they know what happened.

---

### 7. Dashboard Was Getting Slower Every Day

**What happened:**  
When I first built the dashboard, I had about 20 visitors and 10 appointments. Everything was fast. As the data grew to hundreds of records, the dashboard started taking 3-4 seconds to load. I was running 8-10 separate database queries one after another.

**How I fixed it:**  
I wrapped all the database count queries in Promise.all(). This made them run in parallel instead of sequentially. The dashboard now loads in under 1 second even with thousands of records.

---

### 8. Camera Permission Denied Showed a Blank Screen

**What happened:**  
A security guard clicked the scan button and the browser asked for camera permission. He clicked "Block" by mistake. The scanner page went completely blank. No message, no instructions, just a white screen. He had no idea what to do.

**How I fixed it:**  
I added proper error handling in the scanner component. Now when camera permission is denied, a friendly message appears: "Camera access denied. Please allow camera permissions in your browser settings and refresh the page." I also added a button to retry.

---

### 9. Admins Were Generating Duplicate Passes

**What happened:**  
An admin approved an appointment and clicked the "Generate Pass" button. Nothing seemed to happen immediately (the PDF generation took a few seconds). So he clicked again. And again. The system created three identical passes for the same appointment.

**How I fixed it:**  
Before generating a new pass, I added a check to see if a pass already exists for that appointment. If yes, I return an error message saying "Pass already generated for this appointment." I also disabled the button while generating to prevent double clicks.

---

### 10. Database Connection Kept Timing Out on Render

**What happened:**  
After deploying to Render, the backend would sometimes fail to connect to MongoDB Atlas. The error message said "server selection timeout". Local development never had this issue.

**How I fixed it:**  
I added a timeout option to my mongoose.connect() call. I set serverSelectionTimeoutMS to 5000 milliseconds. This gave the connection enough time to establish. The timeout errors stopped completely.

---

### 11. Large Photo Uploads Were Crashing the Server

**What happened:**  
A visitor uploaded a 10MB photo from their phone. The server tried to process it and ran out of memory. The entire backend crashed and had to be restarted. This happened three times before I figured out the cause.

**How I fixed it:**  
I added a file size limit in my multer configuration. I set max file size to 2MB. Now when someone tries to upload a larger file, they get a clear error message: "File too large. Maximum size is 2MB." The server stays stable.

---

### 12. Visitors Were Confused About the Host Field

**What happened:**  
The visitor registration form had a required field called "Host". Visitors had no idea who their host would be. They were a visitor coming to meet someone. How would they know the host's database ID? Many people abandoned the registration.

**How I fixed it:**  
I realized the host should be assigned by the employee during appointment scheduling, not by the visitor during registration. I removed the "required" validation from the host field in the Visitor model. Now visitors can register without selecting a host. The employee assigns one later.

---

## What I Learned From These Problems

Looking back, most of these issues came from two things - assumptions I made without testing, and differences between local development and production environments.

**My biggest takeaways:**

- Always test file upload limits. Users will upload huge files.
- Never assume production works like local. Deploy early and test often.
- Add proper error messages everywhere. A blank screen helps no one.
- Think about duplicate actions. Users click buttons multiple times.
- Database queries get slower as data grows. Optimize before it becomes a problem.

These problems made the project better. Every bug fixed taught me something new.
