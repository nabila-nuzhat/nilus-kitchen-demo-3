import FoodItem from "../models/FoodItem.js";
import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import { generateCustomId } from "./idService.js";

export async function createDraftOrder(data) {
  const customer = await Customer.findById(data.customerObjectId);

  if (!customer) {
    throw new Error("Customer not found");
  }

  const address = customer.addresses[data.addressIndex];

  if (!address) {
    throw new Error("Customer delivery address not found");
  }

  const items = [];
  let subtotal = 0;

  for (const requestedItem of data.items) {
    const food = await FoodItem.findOne({
      _id: requestedItem.foodItemObjectId,
      isActive: true,
    });

    if (!food) {
      throw new Error("A selected food item is unavailable");
    }

    const lineTotal = Number(
      (requestedItem.quantity * food.price).toFixed(2)
    );

    subtotal = Number((subtotal + lineTotal).toFixed(2));

    items.push({
      foodItemObjectId: food._id,
      foodId: food.foodId,
      name: food.name,
      unit: food.unit,
      quantity: requestedItem.quantity,
      unitPrice: food.price,
      lineTotal,
    });
  }

  const deliveryCharge = data.deliveryCharge;
  const total = Number((subtotal + deliveryCharge).toFixed(2));

  const order = await Order.create({
    orderId: await generateCustomId("order"),
    customerObjectId: customer._id,
    customerId: customer.customerId,
    customerName: customer.name,
    customerPhone: customer.phone,
    deliveryAddress: address.address,
    items,
    subtotal,
    deliveryCharge,
    total,
    paymentMethod: data.paymentMethod,
    paymentStatus: "UNPAID",
    bkashNumber: data.bkashNumber || customer.bkashNumber || "",
    status: "DRAFT",
  });

  return order;
}