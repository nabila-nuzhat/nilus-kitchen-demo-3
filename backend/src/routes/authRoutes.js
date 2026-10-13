/** 
 * owner registration, login, and email verification.
 */
import { Router } from "express";

import {
  register,
  login,
  verifyEmail,
} from "../controllers/authController.js";

import { validate } from "../middleware/validate.js";

import {
  registerSchema,
  loginSchema,
} from "../schemas/authSchemas.js";

const router = Router();

// Create an owner account.
router.post("/register", validate(registerSchema), register);

// Log in to the dashboard.
router.post("/login", validate(loginSchema), login);

// Verify the owner's email using the token in the URL.
router.get("/verify-email", verifyEmail);

export default router;
