/** NOTE: 
 * This middleware protects private routes after login. It does not send verification emails or validate email-verification tokens.
 * 
 * A middleware function is a function that runs between the incoming request and your route handler. Its job here is to answer one question: “Is this request coming from a logged-in, verified user?”
 * 
 * Headers are sent by the client (browser, Postman, your React app, etc.) as part of the HTTP request. Node.js reads them off the network connection, parses them, and Express hands them to you as req.headers. only read what the client already sent.
 * 
 * 
*/


import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireOwner(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Login required",
      });
    }

    const token = header.slice(7); // .slice(7) is a String method that returns a new string starting from index 7."Bearer " is exactly 7 characters

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(payload.sub);

    if (!user || !user.isEmailVerified) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    req.owner = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
