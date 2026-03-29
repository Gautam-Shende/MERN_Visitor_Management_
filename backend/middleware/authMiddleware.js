import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
      // console.log("Please Login First, Token not found..., Status (401) unauthorized")
      return res.status(401).json({ message: "Please Login First, Token not Found.." })
    }

    let decoded ; 

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("Decoded:", decoded);
    } 
    catch (err) {
      // console.log("Token expired..., (401) Unauthorized status")
      return res.status(401).json({ message: "Token expired..." })
      
    }

    // const ThisUser = User.findById(User.id).select("-password")
    const currentUser = await User.findById(decoded.id).select("-password")

    if (!currentUser) {
      // console.log("user not exist.., Unauthorized (401)")
      return res.status(401).json({ message: "User not exist...." })
    }

    req.user = currentUser;
    // console.log(currentUser)
    next();
  } 
  catch (err) {
    // console.error("error:", err.message);
    return res.status(500).json({ message: "server error...." })
  }
}
