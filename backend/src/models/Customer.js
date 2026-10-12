/** Database model
 * 
 * NOTE: 
 * Why "addresses" is an array? One customer can have a home address and a second delivery address without needing a second customer record.
 * 
 */

import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    bkashNumber: {
      type: String,
      trim: true,
      default: "",
    },
    addresses: [
      {
        label: { type: String, default: "Home" }, // ??? how the default "Home" value will change in 2nd address label???
        address: { type: String, required: true },
        isDefault: { type: Boolean, default: false }, // ?????? what does it refer to?????
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);