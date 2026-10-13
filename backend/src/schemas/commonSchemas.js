import { z } from "zod";

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i);

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(80),
});

export const foodItemSchema = z.object({
  name: z.string().trim().min(2).max(100),
  categoryId: objectIdSchema,
// price: z.number().finite().min(0), // // .finite() deprecated
  price: z.number().min(0),
  unit: z.enum(["kg", "box", "packet", "piece", "liter"]),
});

export const customerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20),
  email: z.email().optional().or(z.literal("")),
  bkashNumber: z.string().trim().max(20).optional(),
  addresses: z.array(
    z.object({
      label: z.string().trim().max(30).optional(),
      address: z.string().trim().min(5).max(300),
      isDefault: z.boolean().optional(),
    })
  ).min(1),
});

export const orderSchema = z.object({
  customerObjectId: objectIdSchema,
  addressIndex: z.number().int().min(0),
  items: z.array(
    z.object({
      foodItemObjectId: objectIdSchema,
    //   quantity: z.number().finite().positive(), // // .finite() deprecated
      quantity: z.number().positive(),
    })
  ).min(1),
//   deliveryCharge: z.number().finite().min(0), 
  deliveryCharge: z.number().min(0), // // .finite() deprecated
  paymentMethod: z.enum(["COD", "BKASH"]),
  bkashNumber: z.string().trim().max(20).optional(),
});