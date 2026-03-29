
import jwt from "jsonwebtoken"

// import {visitorAuthController} from "../controllers/visitorAuthController.js"

import Visitor from "../models/Visitor.js"



export const protectVisitor = async (req, res, next) => {
  try {
    let token;
    //
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

      // token = req.headers;
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {

      // console.log(token)
      return res.status(401).json({ message: "Not authorized, no token" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // const visitor = Visitor.findById(decoded.id)
    const visitor = await Visitor.findById(decoded.id).select("-password")

    if (!visitor) {

      // console.log(visitor)
      return res.status(401).json({ message: "Visitor not found" });
    }

    req.visitor = visitor;
    next();


  } catch (err) {

    // console.error("Visitor auth error:", err.message);
    // console.log("not authorize token , status 401 unauthorized")
    res.status(401).json({ message: "Not authorized, token failed" });
  }
}