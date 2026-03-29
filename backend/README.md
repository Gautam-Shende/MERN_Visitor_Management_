# Visitor Management System - Backend

This is the backend of the Visitor Management System built using Node.js, Express, and MongoDB. It provides RESTful APIs for managing visitors, authentication, and role-based access control.

## Features

- User Authentication (JWT-based login/register)
- Role-based Access Control (Admin, Employee, Visitor)
- Visitor CRUD Operations
- Search Visitors API
- Update Visitor Status API
- Service Layer Architecture (Controller → Service → Model)
- Input Validation
- Proper Error Handling (HTTP status codes)


## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Postman (for API testing)

## Project Structure

backend/
│── controllers/
│── services/
│── models/
│── routes/
│── middlewares/
│── config/
│── utils/
│── server.js
│── app.js

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
| Method | Endpoint | Description |
|--------|---------|------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |

### Visitor Routes
| Method | Endpoint | Description |
|--------|---------|------------|
| GET | /api/visitors | Get all visitors |
| GET | /api/visitors/:id | Get visitor by ID |
| POST | /api/visitors | Create visitor |
| PATCH | /api/visitors/:id | Update visitor |
| DELETE | /api/visitors/:id | Delete visitor |

### Special Routes
| Method | Endpoint | Description |
|--------|---------|------------|
| GET | /api/visitors/search?q=name | Search visitors |
| PATCH | /api/visitors/:id/status | Update visitor status |


## Example Request

POST /api/auth/register

{
  "name": "Rahul",
  "email": "rahul@test.com",
  "password": "123456"
}

## Example Response

{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "123abc",
    "name": "Rahul",
    "email": "rahul@test.com"
  }
}

---

## Error Handling

The API uses standard HTTP status codes:

- 400 → Bad Request (Validation errors)
- 401 → Unauthorized (Invalid token or not logged in)
- 403 → Forbidden (No permission)
- 404 → Resource Not Found
- 500 → Internal Server Error

Example Error Response:

{
  "success": false,
  "message": "Invalid email or password"
}

---

## API Testing

All API endpoints have been tested using Postman.

- Each endpoint is tested for:
  - Success response
  - Validation errors
  - Unauthorized access
  - Edge cases

Postman collection is included in the repository for easy testing.

---

## Deployment

The backend is deployed on Render.

### Live API Base URL:
https://your-backend-url.onrender.com

You can use this base URL to test all APIs.

---

## Architecture

This project follows a layered architecture:

Route → Controller → Service → Model

- Routes handle API endpoints
- Controllers manage request and response
- Services contain business logic
- Models interact with the database

This structure ensures clean, maintainable, and scalable code.

---

## Author

Gautam