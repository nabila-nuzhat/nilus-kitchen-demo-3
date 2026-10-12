/** Database model
 * NOTE:
 * ***name: "index" = will check later if will apply index to name too.
 * 
 * *****"categoryId" here stores a MongoDB ObjectId reference, not the human-readable category code. That makes relationships straightforward. You can use populate() to display category information. 
 * 
 * **** The price is a JavaScript number. For a more advanced financial system, consider storing monetary values as integer minor units or using MongoDB's Decimal128 type. For this beginner project, calculate totals carefully and format them as BDT when displaying them.
 */


import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema(
  {
    foodId: {
      type: String,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number, // // "consider storing monetary values as integer minor units or using MongoDB's Decimal128 type." ?????????? why not now in this project ??????
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ["kg", "box", "packet", "piece", "liter"], // ??? how to update "unit" of "amount" of Fooditem model to dynamic entry later in Fooditem.js  ??? // how to dynamically turn it to plural nouns with increasing amount ??????????
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("FoodItem", foodItemSchema);