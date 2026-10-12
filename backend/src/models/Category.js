/** Database model
 * NOTE:
 * ***name: "index" = will check later if will apply index to name too.
 * 
 * why not  isActive: {
      type: Boolean,
      default: true,
    },
    in Category model like Food Item model?
 * 
 * 
 */

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
      unique: true,
      index: true, // ???????? why categoryId not "required" //  is this "categoryId" mongoDb's or Custom. if custom id, wont it crash with "Fooditem" Model's referece "categoryId"  ??????
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);