

export const ROLES = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
  SECURITY: "security",
};

export const APPOINTMENT_STATUS = {
  REQUESTED: "requested",
  PENDING: "pending",
  SCHEDULED: "scheduled",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const PASS_STATUS = {
  ACTIVE: "active",
  INSIDE: "inside",
  EXPIRED: "expired",
};

export const VISITOR_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  REQUESTED: "requested"
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const MESSAGES = {

  LOGIN_SUCCESS: "Login successful...",
  LOGIN_FAILED: "Invalid email or password...",
  REGISTER_SUCCESS: "Registration successful...",
  EMAIL_EXISTS: "Email already exists...",
  UNAUTHORIZED: "Unauthorized access...",

  LOGIN_ERROR: "Email and Password required....",
  USER_NOT_FOUND: "User not Found.....",

  TOKEN_MISSING: "Authentication token is missing...",
  TOKEN_INVALID: "Invalid or expired token...",
  TOKEN_SESSION_EXPIRED: "Token session expired...",

  // APPOINTMENT SUCESS MESSAGES
  APPOINTMENT_CREATED: "Appointment created successfully...",
  APPOINTMENT_REQUEST_SUCCESS: "Appointment request sent successfully",
  APPOINTMENT_APPROVED: "Appointment approved successfully...",
  APPOINTMENT_REJECTED: "Appointment rejected...",
  APPOINTMENT_CONFIRMED: "Appointment confirmed successfully...",
  
  // APPOINTMENT ERRORS
  APPOINTMENT_ID_ERROR: "Appointment ID Required...",
  APPOINTMENT_NOT_FOUND: "Appointment not found....",
  APPOINTMENT_NOT_CREATED: "Failed to create appointment...",
  APPOINTMENT_NOT_APPROVED: "Failed to approve appointment....",
  APPOINTMENT_NOT_REJECTED: "Failed to reject appointment....",
  APPOINTMENT_NOT_CONFIRMED: "Failed to Confirm appointment....",
  APPOINTMENT_NOT_REQUESTED: "Failed to request for appointment....",
  APPOINTMENT_NOT_FETCHED: "Failed to fetch appointment...",

  PASS_GENERATED: "Visitor pass generated successfully...",
  PASS_ID_REQUIRED: "Pass ID required....",
  PASS_ALREADY_EXISTS: "Pass already exists...",
  PASS_NOT_FOUND: "Pass not found...",
  PASS_EXPIRED: "Pass has expired....",
  PASS_QR_REQUIRED: "QR data required",
  PASS_QR_INVALID: "Invalid qr CODE...",
  PASS_NOT_FETCHED: "Failed to fetch pass...",

  CHECKIN_SUCCESS: "Visitor checked in successfully....",
  CHECKOUT_SUCCESS: "Visitor checked out successfully...",
  ALREADY_CHECKED_IN: "Visitor is already checked in...",
  NOT_CHECKED_IN: "Visitor has not checked in...",

  VISITOR_CREATED: "Visitor created successfully....",
  VISITOR_REGISTER_ERROR: "All fields are required....",
  VISITOR_NOT_FOUND: "Visitor not found....",
  VISITOR_ID_REQUIRED: "Visitor id required...",

  SERVER_ERROR: "Something went wrong on the server...",
  DB_CONNECTED: "Database connected successfully....",
  DB_ERROR: "Database connection failed...",

  DASHBOARD_ERROR: "Failed to Load Dashboard...",
  REPORT_ERROR: "Failed to Get Reports....",
  EXPORT_ERROR: "Failed to export..."
};

export const FILE_UPLOAD = {
  MAX_SIZE: 2 * 1024 * 1024,
  ALLOWED_FORMATS: ["jpg", "jpeg", "png"],
};

export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: "7d",
  REFRESH_TOKEN: "30d",
};