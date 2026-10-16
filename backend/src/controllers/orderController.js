/** CHECK FOR UPDATES ----------------------- */

import Order from "../models/Order.js";
import { createDraftOrder } from "../services/orderService.js";

export async function createOrder(req, res, next) {
  try {
    const order = await createDraftOrder(req.validatedBody);

    res.status(201).json({
      message: "Draft order created. Review before confirming.",
      order,
    });
  } catch (error) {
    next(error);
  }
}

export async function listOrders(req, res, next) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    next(error);
  }
}

export async function confirmOrder(req, res, next) {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      status: "DRAFT",
    });

    if (!order) {
      return res.status(404).json({
        message: "Draft order not found",
      });
    }

    order.status = "CONFIRMED";
    order.confirmedAt = new Date();

    await order.save();

    res.json({
      message: "Order confirmed",
      order,
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "DRAFT" && order.status !== "CONFIRMED") {
      return res.status(409).json({
        message: "This order cannot be cancelled",
      });
    }

    order.status = "CANCELLED";
    await order.save();

    res.json({ message: "Order cancelled", order });
  } catch (error) {
    next(error);
  }
}