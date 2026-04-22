
import jwt from "jsonwebtoken"
import Visitor from "../models/Visitor.js"
import { HTTP_STATUS, MESSAGES } from "../../constants.js";

export const protectVisitor = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: MESSAGES.UNAUTHORIZED,
      })
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const visitor = await Visitor.findById(decoded.id).select("-password");

    if (!visitor) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: MESSAGES.VISITOR_NOT_FOUND,
      })
    }

    req.visitor = visitor;

    next();

  } catch (err) {
    console.error("Visitor auth error:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: MESSAGES.TOKEN_SESSION_EXPIRED,
      })
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: MESSAGES.TOKEN_INVALID,
      });
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong during authentication" || MESSAGES.SERVER_ERROR,
    });
  }
};