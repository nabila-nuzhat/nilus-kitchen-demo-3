/** Database model
 * NOTE:
 * login account for the business owner
 * password is saved as a hash produced by bcryptjs, never as the original password
 * 
 * ???????????For your first single-business version, you can allow one owner account and disable public registration after setting it up. A registration endpoint that stays publicly accessible indefinitely would allow strangers to create accounts. Before public deployment, restrict registration to an invitation or an owner-controlled setup process.???????????
 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationTokenHash: { type: String, default: null },
    emailVerificationExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);