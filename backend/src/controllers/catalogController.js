/** CHECK FOR UPDATES ----------------------- */
/** OLD UPDATE------------- ----------------------- */

// import Category from "../models/Category.js";
// import FoodItem from "../models/FoodItem.js";
// import { generateCustomId } from "../services/idService.js";

// export async function listCategories(req, res, next) {
//   try {
//     const categories = await Category.find().sort({ name: 1 });
//     res.json({ categories });
//   } catch (error) {
//     next(error);
//   }
// }

// export async function createCategory(req, res, next) {
//   try {
//     const category = await Category.create({
//       ...req.validatedBody,
//       categoryId: await generateCustomId("category"),
//     });

//     res.status(201).json({ category });
//   } catch (error) {
//     next(error);
//   }
// }

// export async function listFoodItems(req, res, next) {
//   try {
//     const foodItems = await FoodItem.find({ isActive: true })
//       .populate("categoryId", "name");

//     res.json({ foodItems });
//   } catch (error) {
//     next(error);
//   }
// }

// export async function createFoodItem(req, res, next) {
//   try {
//     const foodItem = await FoodItem.create({
//       ...req.validatedBody,
//       foodId: await generateCustomId("food"),
//     });

//     res.status(201).json({ foodItem });
//   } catch (error) {
//     next(error);
//   }
// }


/** NEW UPDATE-------------- ----------------------- */


import mongoose from "mongoose";

import Category from "../models/Category.js";
import FoodItem from "../models/FoodItem.js";
import { generateCustomId } from "../services/idService.js";

// GET /api/catalog/categories
export async function getCategories(req, res, next) {
  try {
    const categories = await Category.find().sort({ name: 1 });

    return res.status(200).json({ categories });
  } catch (error) {
    return next(error);
  }
}

// POST /api/catalog/categories
export async function createCategory(req, res, next) {
  try {
    const category = await Category.create({
      ...req.validatedBody,
      categoryId: await generateCustomId("category"),
    });

    return res.status(201).json({ category });
  } catch (error) {
    return next(error);
  }
}

// PATCH /api/catalog/categories/:id
export async function updateCategory(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.validatedBody },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ category });
  } catch (error) {
    return next(error);
  }
}

// DELETE /api/catalog/categories/:id
export async function deleteCategory(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Do not delete a category that still has food items.
    const linkedFoodItem = await FoodItem.exists({
      categoryId: category._id,
    });

    if (linkedFoodItem) {
      return res.status(409).json({
        message:
          "This category still has food items. Move or deactivate those items before deleting the category.",
      });
    }

    await category.deleteOne();

    return res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    return next(error);
  }
}

// GET /api/catalog/food-items
export async function getFoodItems(req, res, next) {
  try {
    const foodItems = await FoodItem.find({ isActive: true })
      .populate("categoryId", "name categoryId")
      .sort({ name: 1 });

    return res.status(200).json({ foodItems });
  } catch (error) {
    return next(error);
  }
}

// POST /api/catalog/food-items
export async function createFoodItem(req, res, next) {
  try {
    const category = await Category.findById(
      req.validatedBody.categoryId
    );

    if (!category) {
      return res.status(400).json({
        message: "The selected category does not exist",
      });
    }

    const foodItem = await FoodItem.create({
      ...req.validatedBody,
      foodId: await generateCustomId("food"),
    });

    return res.status(201).json({ foodItem });
  } catch (error) {
    return next(error);
  }
}

// PATCH /api/catalog/food-items/:id
export async function updateFoodItem(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid food item ID" });
    }

    if (req.validatedBody.categoryId) {
      const category = await Category.findById(
        req.validatedBody.categoryId
      );

      if (!category) {
        return res.status(400).json({
          message: "The selected category does not exist",
        });
      }
    }

    const foodItem = await FoodItem.findByIdAndUpdate(
      req.params.id,
      { $set: req.validatedBody },
      { new: true, runValidators: true }
    ).populate("categoryId", "name categoryId");

    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    return res.status(200).json({ foodItem });
  } catch (error) {
    return next(error);
  }
}

// DELETE /api/catalog/food-items/:id
// Soft delete: keep historical orders and hide the item from new orders.
export async function deleteFoodItem(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid food item ID" });
    }

    const foodItem = await FoodItem.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: false } },
      { new: true, runValidators: true }
    );

    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    return res.status(200).json({
      message: "Food item deactivated",
      foodItem,
    });
  } catch (error) {
    return next(error);
  }
}
