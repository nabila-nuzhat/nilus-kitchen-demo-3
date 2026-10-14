/**
 * 
 * "authSchema" validates the incoming request body. They do not replace checking whether the email is already registered or whether the password matches.
 * 
 * // .email() deprecated in  Zod4. Replaced by .pipe(z.email({ error: "Invalid email format" }))
 */
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
// email: z.string().trim().email().max(254), // // .email() deprecated in  Zod4. Replaced by .pipe(z.email({ error: "Invalid email format" }))
  email: z.string().trim().pipe(z.email({ error: "Invalid email format" })).max(254),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
// email: z.string().trim().email().max(254), // // .email() deprecated in  Zod4. Replaced by .pipe(z.email({ error: "Invalid email format" }))
  email: z.string().trim().pipe(z.email({ error: "Invalid email format" })).max(254),
  password: z.string().min(1).max(128),
});
