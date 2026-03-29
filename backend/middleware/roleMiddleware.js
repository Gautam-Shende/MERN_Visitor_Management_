

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {

    // const userRole = req.user.role;
    const userRole = req.user?.role;

    if (!userRole) {
      // console.log("User Role not found..., unauthorized (401)")
      return res.status(401).json({ message: "User Role Not Found...." })
    }

    // if (userRoles.includes(userRole)) {
    if (!allowedRoles.includes(userRole)) {

//       console.log("User:", req.user)
// console.log("Role:", req.user?.role)
// console.log("Allowed:", allowedRoles)

      // console.log("Access denied..., status (401) Unauthorized..", userRole)
     return res.status(403).json({ message: `Access denied. Role '${userRole}' is not allowed` })
    }

    next();
  }
}
