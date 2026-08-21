// Reusable constants for roles, statuses, HTTP response codes, and messages

export const ROLES = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
  SECURITY: "security",
}

export const APPOINTMENT_STATUS = {
  REQUESTED: "requested",
  PENDING: "pending",
  SCHEDULED: "scheduled",
  APPROVED: "approved",
  REJECTED: "rejected",
}

export const PASS_STATUS = {
  ACTIVE: "active",
  INSIDE: "inside",
  EXPIRED: "expired",
}

export const VISITOR_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  REQUESTED: "requested",
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
}

export const MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  LOGIN_FAILED: "Invalid email or password",
  REGISTER_SUCCESS: "Registration successful",
  EMAIL_EXISTS: "Email already exists",
  UNAUTHORIZED: "Unauthorized access",

  LOGIN_ERROR: "Email and password are required",
  USER_NOT_FOUND: "User not found",

  TOKEN_MISSING: "Authentication token is missing",
  TOKEN_INVALID: "Invalid or expired token",
  TOKEN_SESSION_EXPIRED: "Session expired, please log in again",

  // Appointment Messages
  APPOINTMENT_CREATED: "Appointment created successfully",
  APPOINTMENT_REQUEST_SUCCESS: "Appointment request sent successfully",
  APPOINTMENT_APPROVED: "Appointment approved successfully",
  APPOINTMENT_REJECTED: "Appointment rejected",
  APPOINTMENT_CONFIRMED: "Appointment confirmed successfully",
  
  // Appointment Errors
  APPOINTMENT_ID_ERROR: "Appointment ID is required",
  APPOINTMENT_NOT_FOUND: "Appointment not found",
  APPOINTMENT_NOT_CREATED: "Failed to create appointment",
  APPOINTMENT_NOT_APPROVED: "Failed to approve appointment",
  APPOINTMENT_NOT_REJECTED: "Failed to reject appointment",
  APPOINTMENT_NOT_CONFIRMED: "Failed to confirm appointment",
  APPOINTMENT_NOT_REQUESTED: "Failed to request appointment",
  APPOINTMENT_NOT_FETCHED: "Failed to fetch appointment",

  // Pass Messages
  PASS_GENERATED: "Visitor pass generated successfully",
  PASS_ID_REQUIRED: "Pass ID is required",
  PASS_ALREADY_EXISTS: "Pass already exists",
  PASS_NOT_FOUND: "Pass not found",
  PASS_EXPIRED: "Pass has expired",
  PASS_QR_REQUIRED: "QR code data is required",
  PASS_QR_INVALID: "Invalid QR code",
  PASS_NOT_FETCHED: "Failed to fetch pass",

  // CheckLog Messages
  CHECKIN_SUCCESS: "Visitor checked in successfully",
  CHECKOUT_SUCCESS: "Visitor checked out successfully",
  ALREADY_CHECKED_IN: "Visitor is already checked in",
  NOT_CHECKED_IN: "Visitor has not checked in",

  // Visitor Messages
  VISITOR_CREATED: "Visitor created successfully",
  VISITOR_REGISTER_ERROR: "All required fields must be provided",
  VISITOR_NOT_FOUND: "Visitor not found",
  VISITOR_ID_REQUIRED: "Visitor ID is required",

  // System Messages
  SERVER_ERROR: "Something went wrong on the server",
  DB_CONNECTED: "Database connected successfully",
  DB_ERROR: "Database connection failed",

  DASHBOARD_ERROR: "Failed to load dashboard data",
  REPORT_ERROR: "Failed to generate report",
  EXPORT_ERROR: "Failed to export data",
}

export const FILE_UPLOAD = {
  MAX_SIZE: 2 * 1024 * 1024,
  ALLOWED_FORMATS: ["jpg", "jpeg", "png"],
}

export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: "7d",
  REFRESH_TOKEN: "30d",
}