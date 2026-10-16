/**
 * for saved customer records
 */
import { Router } from "express";

import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";

//import { protect } from "../middleware/authMiddleware.js";  // // "protect" replaced by "requireOwner" in authMiddleware
import { requireOwner } from "../middleware/authMiddleware.js";


const router = Router();

//router.use(protect);  // // "protect" replaced by "requireOwner" in authMiddleware
router.use(requireOwner);

router.get("/", getCustomers);
router.get("/:id", getCustomerById);
router.post("/", createCustomer);
router.patch("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
