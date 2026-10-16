/**
 * 
 * "authSchema" validates the incoming request body. They do not replace checking whether the email is already registered or whether the password matches.
 * 
 * // .email() deprecated in  Zod4. Replaced by .pipe(z.email({ error: "Invalid email format" }))
 */

// // ----------------------------------------- older version before, account deletion issue: (account got deleted if email verification not confirmed )
// import { z } from "zod";

// export const registerSchema = z.object({
//   name: z.string().trim().min(2).max(100),
// // email: z.string().trim().email().max(254), // // .email() deprecated in  Zod4. Replaced by .pipe(z.email({ error: "Invalid email format" }))
//   email: z.string().trim().pipe(z.email({ error: "Invalid email format" })).max(254),
//   password: z.string().min(8).max(128),
// });

// export const loginSchema = z.object({
// // email: z.string().trim().email().max(254), // // .email() deprecated in  Zod4. Replaced by .pipe(z.email({ error: "Invalid email format" }))
//   email: z.string().trim().pipe(z.email({ error: "Invalid email format" })).max(254),
//   password: z.string().min(1).max(128),
// });


/** NEW version after updating pending email verification -------------------------------------------------------------------------
 * 
 * What the corrected flow should do
1. Owner registers
The backend creates a pending account, hashes the password, and stores a hashed verification token with an expiry time.



2. Nodemailer attempts to send the email
If sending fails, the account remains in MongoDB. The API reports that registration is pending and that the verification email could not be sent.



3. Owner requests another verification email
A resend endpoint generates a fresh token and expiry time, then tries to send a new email. The previous token becomes invalid.



4. Owner verifies and logs in
The backend validates the token, marks the email verified, removes the temporary token fields, and permits login.



One additional point for your single-owner dashboard: preserving pending accounts is not the same as allowing anyone to become the owner. Registration still needs to be restricted to your intended owner before deployment.
 * 
 * 
*/

import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),

  email: z.string().trim().pipe(z.email()).max(254), // .email() deprecated in  Zod4.

  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().pipe(z.email()).max(254), // .email() deprecated in  Zod4.

  password: z.string().min(1).max(128),
});


// What changed? resendVerificationSchema validates the email address submitted when the owner requests another verification email. It does not send the email itself.
export const resendVerificationSchema = z.object({
  email: z.string().trim().pipe(z.email()).max(254), // .email() deprecated in  Zod4.
});
