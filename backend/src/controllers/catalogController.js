/** CHECK FOR UPDATES ----------------------- */

import Category from "../models/Category.js";
import FoodItem from "../models/FoodItem.js";
import { generateCustomId } from "../services/idService.js";

export async function listCategories(req, res, next) {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ categories });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const category = await Category.create({
      ...req.validatedBody,
      categoryId: await generateCustomId("category"),
    });

    res.status(201).json({ category });
  } catch (error) {
    next(error);
  }
}

export async function listFoodItems(req, res, next) {
  try {
    const foodItems = await FoodItem.find({ isActive: true })
      .populate("categoryId", "name");

    res.json({ foodItems });
  } catch (error) {
    next(error);
  }
}

export async function createFoodItem(req, res, next) {
  try {
    const foodItem = await FoodItem.create({
      ...req.validatedBody,
      foodId: await generateCustomId("food"),
    });

    res.status(201).json({ foodItem });
  } catch (error) {
    next(error);
  }
}