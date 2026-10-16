/** NOTE: OLD VERSION before correcting pending email verification START -----------------------------------------
 * owner registration, login, and email verification.
 * 
 * The resulting endpoints are:
    - POST /api/auth/register
    - POST /api/auth/login
    - GET /api/auth/verify-email?token=...
 * 
 */


// import { Router } from "express";

// import {
//   register,
//   login,
//   verifyEmail,
// } from "../controllers/authController.js";

// import { validate } from "../middleware/validate.js";

// import {
//   registerSchema,
//   loginSchema,
// } from "../schemas/authSchemas.js";

// const router = Router();

// // Create an owner account.
// router.post(
//   "/register",
//   validate(registerSchema),
//   register
// );

// // Log in to the dashboard.
// router.post(
//   "/login",
//   validate(loginSchema),
//   login
// );

// // Verify the owner's email using the token in the URL.
// router.get("/verify-email", verifyEmail);

// export default router;

/**NOTE: OLD VERSION before correcting pending email verification END ----------------------------------------- 
 * ==============================================================
*/


/**NOTE: UPDATED VERSION before correcting pending email verification START ----------------------------------------- 
*/


import { Router } from "express";

import {
  register,
  login,
  verifyEmail,
  resendVerificationEmailController,
} from "../controllers/authController.js";

import { validate } from "../middleware/validate.js";

import {
  registerSchema,
  loginSchema,
  resendVerificationSchema,
} from "../schemas/authSchemas.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  register
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

router.get(
  "/verify-email",
  verifyEmail
);

// resend verification
router.post(
  "/resend-verification",
  validate(resendVerificationSchema),
  resendVerificationEmailController
);

export default router;

