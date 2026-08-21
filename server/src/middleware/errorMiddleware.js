// Centralized Error Handling Middleware

export const errorHandler = (err, req, res, next) => {
  console.error("Server Error:", err.message || err)

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : (err.statusCode || 500)
  
  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong on the server...",
  })
}
