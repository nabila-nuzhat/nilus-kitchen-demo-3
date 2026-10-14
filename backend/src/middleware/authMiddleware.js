/** CHECK for ANY UPDATE------------- */

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireOwner(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Login required" });
    }

    const token = header.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.sub);

    if (!user || !user.isEmailVerified) {
      return res.status(401).json({ message: "Authentication required" });
    }

    req.owner = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}