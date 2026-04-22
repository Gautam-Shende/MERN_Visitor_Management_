# Visitor Management System - server side response....

This is the backend of the Visitor Management System built using Node.js, Express, and MongoDB. It provides RESTful APIs for managing visitors, appointments, passes, QR scanning, and sending email notifications.

---

## Features

- User Authentication (JWT-based login for staff and visitors)
- Role-based Access Control (Admin, Employee, Security, Visitor)
- Visitor Registration & Management
- Appointment Request, Approval & Scheduling
- Digital Pass Generation with QR Code
- QR Code Scanning for Check-in/Check-out
- Check-in/Check-out Logging
- Email Notifications (Approval, Rejection, Pass, Check-in/out)
- Dashboard Statistics
- Report Generation (CSV/Excel Export)
- Cloudinary Integration for Image/PDF/QR Uploads
- Database Seeding for Default Users

---

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcryptjs (Password Hashing)
- Cloudinary (File Uploads)
- Multer (File Handling)
- Nodemailer (Email Service)
- QRCode (QR Generation)
- html-pdf (PDF Generation)
- ExcelJS (Excel Export)
- json2csv (CSV Export)

---

## Project Structure

backend/
│── src/
│ ├── config/
│ │ ├── database/
│ │ │ └── db.js
│ │ └── Cloudinary/
│ │ └── cloudinary.js
│ ├── controllers/
│ │ ├── admin/
│ │ │ ├── adminDashboardController.js
│ │ │ ├── adminExportController.js
│ │ │ └── adminReportController.js
│ │ ├── appointment/
│ │ │ ├── appointmentController.js
│ │ │ └── visitorAppointmentController.js
│ │ ├── auth/
│ │ │ ├── authController.js
│ │ │ ├── visitorAuthController.js
│ │ │ └── visitorController.js
│ │ └── security/
│ │ └── passController.js
│ ├── middleware/
│ │ ├── authMiddleware.js
│ │ ├── roleMiddleware.js
│ │ ├── uploadMiddleware.js
│ │ └── visitorAuthMiddleware.js
│ ├── models/
│ │ ├── User.js
│ │ ├── Visitor.js
│ │ ├── Appointment.js
│ │ ├── Pass.js
│ │ └── CheckLog.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── visitorAuthRoutes.js
│ │ ├── appointmentRoutes.js
│ │ ├── dashboardRoutes.js
│ │ ├── passRoutes.js
│ │ ├── reportRoutes.js
│ │ ├── exportRoutes.js
│ │ ├── userRoutes.js
│ │ └── visitorRoutes.js
│ ├── services/
│ │ ├── admin/
│ │ │ ├── adminDashboardService.js
│ │ │ ├── adminExportService.js
│ │ │ └── adminReportService.js
│ │ ├── appointment/
│ │ │ ├── appointmentService.js
│ │ │ └── visitorAppointmentService.js
│ │ ├── auth/
│ │ │ ├── authService.js
│ │ │ ├── visitorAuthService.js
│ │ │ └── visitorService.js
│ │ └── security/
│ │ └── passService.js
│ ├── utils/
│ │ ├── emailService.js
│ │ ├── pdfGenerator.js
│ │ ├── qrGenerator.js
│ │ └── emailTemplates/
│ └── templates/
│ └── pass-template.html
├── seed.js
├── server.js
├── constants.js
├── .env
└── package.json

## Setup Instructions

1. Clone the repository
   git clone <repo-link>

2. Navigate to backend
   cd backend

3. Install dependencies
   npm install

4. Create .env file

5. Run the server
   npm run dev


## Environment Variables

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

## MongoDB Connection Format

mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname

## API Endpoints

### Auth Routes

| Method | Endpoint          | Description |
|--------|-------------------|-------------|
| POST   | `/api/auth/login` | Staff login | (admin/employee/security) |

### Visitor Auth Routes

| Method | Endpoint               | Description          |
|--------|------------------------|----------------------|
| POST   | `/api/visitor/register`| Register new visitor |
| POST   | `/api/visitor/login`   | Visitor login        |
| GET    | `/api/visitor/profile` | Get visitor profile  |

### Appointment Routes

| Method | Endpoint                       | Description                    | Access          |
|--------|--------------------------------|--------------------------------|-----------------|
| GET    | `/api/appointments`            | Get all appointments           | Admin, Employee |
| GET    | `/api/appointments/:id`        | Get appointment by ID          | Admin, Employee |
| GET    | `/api/appointments/requested`  | Get pending requests           | Admin, Employee |
| PUT    | `/api/appointments/approve/:id`| Approve appointment            | Admin, Employee |
| PUT    | `/api/appointments/reject/:id` | Reject appointment             | Admin, Employee |
| PUT    | `/api/appointments/:id/convert`| Convert request to appointment | Admin, Employee |

### Visitor Appointment Routes

| Method | Endpoint                           | Description             | Access  |
|--------|------------------------------------|-------------------------|---------|
| GET    | `/api/visitor/dashboard`           | Visitor dashboard stats | Visitor |
| GET    | `/api/visitor/appointments`        | Get my appointments     | Visitor |
| POST   | `/api/visitor/appointments/request`| Request new appointment | Visitor |
| GET    | `/api/visitor/passes`              | Get my passes           | Visitor |
| GET    | `/api/visitor/pass/:appointmentId` | Get pass by appointment | Visitor |

### Pass Routes

| Method | Endpoint                      | Description           | Access                    |
|--------|-------------------------------|-----------------------|---------------------------|
| GET    | `/api/pass`                   | Get all passes        | Admin, Employee, Security |
| GET    | `/api/pass/:id`               | Get pass by ID        | Admin, Employee, Security |
| POST   | `/api/pass/:id`               | Generate new pass     | Admin, Employee           |
| POST   | `/api/pass/scan`              | Scan QR code          | Security                  |
| GET    | `/api/pass/:passId/checklogs` | Get check-in/out logs | Admin, Employee, Security |

### Visitor Routes

| Method | Endpoint            | Description       | Access          |
|--------|---------------------|-------------------|-----------------|
| GET    | `/api/visitors`     | Get all visitors  | Admin, Employee |
| GET    | `/api/visitors/:id` | Get visitor by ID | Admin, Employee |

### Dashboard & Report Routes

| Method | Endpoint                       | Description                  | Access |
|--------|--------------------------------|------------------------------|--------|
| GET    | `/api/dashboard`               | Get dashboard statistics     | Admin  |
| GET    | `/api/reports/visitors`        | Generate visitor report      | Admin  |
| GET    | `/api/export/csv/:visitorId`   | Export visitor data as CSV   | Admin  |
| GET    | `/api/export/excel/:visitorId` | Export visitor data as Excel | Admin  |

### User Routes

| Method | Endpoint     | Description         | Access          |
|--------|--------------|---------------------|-----------------|
| GET    | `/api/users` | Get all staff users | Admin, Employee |

---

## Example Requests

**POST /api/visitor/register**

```json
{ 
  "name": "Rahul Sharma",
  "email": "rahul@test.com",
  "phone": "9876543210",
  "purpose": "Meeting with HR",
  "password": "123456"
}

## example of visitor appoinment request.

** POST /api/visitor/appointment/request

{
  "preferredDate": "2024-12-25T10:30:00.000Z",
  "purpose": "Job Interview",
  "message": "I would like to meet the HR manager"
}