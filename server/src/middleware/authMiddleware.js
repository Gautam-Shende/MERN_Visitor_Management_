import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { HTTP_STATUS, MESSAGES } from "../../constants.js";

export const protect = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // console.log({error: "This is authmiddleware problem, for authorization..."})
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      // console.log("User Not Found.....")
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.USER_NOT_FOUND || MESSAGES.UNAUTHORIZED  });
    }

    req.user = user;

    next();
  } catch (err) {
    // return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "auth middleware error...." });
     
    console.error("Auth middleware error:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.TOKEN_SESSION_EXPIRED });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.TOKEN_MISSING });
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
  }
};