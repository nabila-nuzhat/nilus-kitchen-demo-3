/**
 * handles order creation, 
 * viewing, confirmation, cancellation, and PDF receipt downloads
 */
import { Router } from "express";

import {
  getOrders,
  getOrderById,
  createOrder,
  confirmOrder,
  cancelOrder,
  downloadReceipt,
} from "../controllers/orderController.js";

//import { protect } from "../middleware/authMiddleware.js"; // // "protect" replaced by "requireOwner" in authMiddleware
import { requireOwner } from "../middleware/authMiddleware.js";


const router = Router();

//router.use(protect); // // "protect" replaced by "requireOwner" in authMiddleware
router.use(requireOwner);


// View orders.
router.get("/", getOrders);
router.get("/:id", getOrderById);

// Create a draft order.
router.post("/", createOrder);

// Confirm or cancel an order.
router.patch("/:id/confirm", confirmOrder);
router.patch("/:id/cancel", cancelOrder);

// Download a PDF receipt for a confirmed order.
router.get("/:id/receipt", downloadReceipt);

export default router;
