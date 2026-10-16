/** CHECK FOR UPDATES ----------------------- */

import Customer from "../models/Customer.js";
import { generateCustomId } from "../services/idService.js";

export async function listCustomers(req, res, next) {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json({ customers });
  } catch (error) {
    next(error);
  }
}

export async function createCustomer(req, res, next) {
  try {
    const customer = await Customer.create({
      ...req.validatedBody,
      customerId: await generateCustomId("customer"),
    });

    res.status(201).json({ customer });
  } catch (error) {
    next(error);
  }
}