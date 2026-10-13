/**
 * This file handles both categories and food items. Keeping them in one router makes the catalog easier to use from the dashboard.
 * 
 * For food items, :id is the MongoDB _id used to locate the record. Your backend should generate the separate readable ID, such as NK-FOOD-000001.
 * 
 * ********* ???????Important: Before implementing deletion, ensure a category cannot be deleted while food items still reference it. For food items already used in orders, prefer marking them inactive instead of permanently deleting them. ????????????????
 */
import { Router } from "express";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getFoodItems,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} from "../controllers/catalogController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// All catalog endpoints require owner login.
router.use(protect);

// Categories
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.patch("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Food items
router.get("/food-items", getFoodItems);
router.post("/food-items", createFoodItem);
router.patch("/food-items/:id", updateFoodItem);
router.delete("/food-items/:id", deleteFoodItem);

export default router;
