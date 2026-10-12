/** Database model
 * NOTE:
 * The order stores a snapshot of the food name, unit, price, customer ID, and customer details. If you change a food item's price next week, an older receipt should still show the price used when that order was made
 * 
 * The customerObjectId and foodItemObjectId are database references. 
 * 
 * The customerId, foodId, and orderId are readable business IDs for receipts and reports.
 */


import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    foodItemObjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodItem",
      required: true,
    },
    foodId: { type: String, required: true },
    name: { type: String, required: true },
    unit: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0.001 }, // ???? why quantuty minimum 0.001 ???????
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, index: true },
    customerObjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryCharge: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ["COD", "BKASH"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID"],
      default: "UNPAID",
    },
    bkashNumber: { type: String, default: "" },
    status: {
      type: String,
      enum: ["DRAFT", "CONFIRMED", "CANCELLED"],
      default: "DRAFT", // ?????? what is the Draft for ??????
    },
    confirmedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);