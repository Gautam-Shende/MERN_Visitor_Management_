// import { ROLES } from "../../constants.js"

import { HTTP_STATUS } from "../../constants.js";

export const authorizeRoles = (...allowedRoles) => {

  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "User role not found" })
    }
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(HTTP_STATUS.CONFLICT).json({ 
        error: `Access denied. ${userRole} role is not allowed.`,
        allowedRoles: allowedRoles
      })
    }
    
    next()
  }
}
