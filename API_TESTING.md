# API Testing Guide — MERN Visitor Management System

Base URL: `http://localhost:4000`

Use [Postman](https://www.postman.com/) to test all endpoints below.
Set `Authorization: Bearer <token>` header for protected routes.

---

## Auth Endpoints

### POST /api/auth/login 
Login as admin, employee, or security user.

**Body (JSON):**
```json
{
  "email": "admin@mail.com",
  "password": "admin123"
}
```
**Returns:** `{ token, user }`

---

## Visitor Auth Endpoints

### POST /api/visitor/register 
Register a new visitor with photo upload.

**Body (form-data):**
| Key      | Type | Value           |
|----------|------|-----------------|
| name     | Text | Rahul Sharma    |
| email    | Text | rahul@mail.com  |
| password | Text | rahul123        |
| phone    | Text | 9876543210      |
| purpose  | Text | Business Meeting|
| photo    | File | (choose image)  |

**Returns:** `{ token, visitor }`

---

### POST /api/visitor/login 
**Body (JSON):**
```json
{
  "email": "rahul@mail.com",
  "password": "rahul123"
}
```
**Returns:** `{ token, visitor }`

---

### GET /api/visitor/profile 
**Header:** `Authorization: Bearer <visitor_token>`

---

### GET /api/visitor/dashboard 
**Header:** `Authorization: Bearer <visitor_token>`

---

### POST /api/visitor/appointments/request 
Visitor submits an appointment request.

**Header:** `Authorization: Bearer <visitor_token>`

**Body (JSON):**
```json
{
  "preferredDate": "2025-06-15T10:00:00.000Z",
  "purpose": "Business Meeting",
  "message": "I would like to meet the sales team"
}
```

---

### GET /api/visitor/appointments 
**Header:** `Authorization: Bearer <visitor_token>`

---

### GET /api/visitor/passes 
**Header:** `Authorization: Bearer <visitor_token>`

---

## Appointment Endpoints (Admin/Employee)

### GET /api/appointments 
**Header:** `Authorization: Bearer <admin_or_employee_token>`

---

### GET /api/appointments/requested 
Get all visitor-submitted appointment requests.

**Header:** `Authorization: Bearer <admin_or_employee_token>`

---

### GET /api/appointments/:id 
**Header:** `Authorization: Bearer <token>`

---

### PUT /api/appointments/approve/:id 
Admin approves an appointment. Sends email to visitor.

**Header:** `Authorization: Bearer <admin_token>`

---

### PUT /api/appointments/reject/:id 
**Header:** `Authorization: Bearer <admin_token>`

**Body (JSON, optional):**
```json
{
  "reason": "Schedule conflict on that date"
}
```

---

### PUT /api/appointments/:id/convert 
Employee converts a visitor request into a scheduled appointment.

**Header:** `Authorization: Bearer <employee_token>`

**Body (JSON):**
```json
{
  "date": "2025-06-20T10:00:00.000Z",
  "hostId": "<employee_user_id>"
}
```

---

## Pass Endpoints (Admin/Security)

### POST /api/passes/generate/:appointmentId 
Generate a QR pass for an approved appointment.
Appointment must have status = "approved".

**Header:** `Authorization: Bearer <admin_token>`

---

### GET /api/passes 
**Header:** `Authorization: Bearer <admin_or_security_token>`

---

### GET /api/passes/:id 
**Header:** `Authorization: Bearer <token>`

---

### POST /api/passes/scan 
Security scans a visitor QR code. Handles check-in and check-out automatically.

**Header:** `Authorization: Bearer <security_token>`

**Body (JSON):**
```json
{
  "qrData": "PASS:<pass_id_here>"
}
```
First scan = check-in. Second scan = check-out and pass expires.

---

## Dashboard & Reports

### GET /api/admin/dashboard 
**Header:** `Authorization: Bearer <admin_token>`

---

## Complete End-to-End Test Flow

1. Run seed: `node server/src/seed/seed.js`
2. Login as visitor → POST /api/visitor/login → save visitor token
3. Request appointment → POST /api/visitor/appointments/request
4. Login as employee → POST /api/auth/login (role: employee)
5. View requested appointments → GET /api/appointments/requested
6. Convert request to appointment → PUT /api/appointments/:id/convert
7. Login as admin → POST /api/auth/login (role: admin)
8. Approve appointment → PUT /api/appointments/approve/:id
9. Generate pass → POST /api/passes/generate/:appointmentId
10. Login as security → POST /api/auth/login (role: security)
11. Scan QR (check-in) → POST /api/passes/scan `{ "qrData": "PASS:<id>" }`
12. Scan QR again (check-out) → POST /api/passes/scan same body
13. Verify check logs in MongoDB

---

## Test Credentials (after running seed.js)

| Role     | Email                | Password     |
|----------|----------------------|--------------|
| Admin    | admin@mail.com       | admin123     |
| Employee | employee@mail.com    | employee123  |
| Security | security@mail.com    | security123  |
| Visitor  | rahul@mail.com       | rahul123     |
| Visitor  | priya@mail.com       | priya123     |
