/** Database model
 * NOTE:
 * login account for the business owner
 * password is saved as a hash produced by bcryptjs, never as the original password
 * 
 * ???????????For your first single-business version, you can allow one owner account and disable public registration after setting it up. A registration endpoint that stays publicly accessible indefinitely would allow strangers to create accounts. Before public deployment, restrict registration to an invitation or an owner-controlled setup process.???????????
 * 
 * LATER IMPLEMENT ????????????? where to apply rejection so that, white space/blank space in an email is rejected without removing it from developers end?
 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    
    passwordHash: { 
      type: String, 
      required: true,
      select: false, // It’s a safety measure. If later do something like res.json(user), the hash won’t accidentally leak to the client because it was never loaded.
   },
    isEmailVerified: { 
      type: Boolean, 
      default: false 
    },

    emailVerificationTokenHash:{
      type: String,
      select: false, // updated
      // default: null, // : omit default: null.
              // Why?
              // - These fields are temporary verification data, not required user information.
              // - They only need values while verification is pending.
              // - After successful verification, the token hash and expiry date can be removed.
              // - Your code already checks whether a valid, unexpired token exists.
          
    },

    emailVerificationExpiresAt: {
      type: Date,
      select: false, // updated 
      // default: null, // : omit default: null.
              // Why?
              // - These fields are temporary verification data, not required user information.
              // - They only need values while verification is pending.
              // - After successful verification, the token hash and expiry date can be removed.
              // - Your code already checks whether a valid, unexpired token exists.
          
      
    },
  },

  { timestamps: true }
);

export default mongoose.model("User", userSchema);