/** NOTE: 
 * The function returns the custom ID to the model or controller creating the document.
 * 
 * Atomic counter updates help prevent two simultaneous requests from receiving the same sequence number. Still, the final protection is a unique database index on each custom ID field. A failed operation may leave a gap in the sequence, which is normal
 * 
 * Special Note: ------------
 * ***For production, consider retrying duplicate-key errors and using a transaction where the ID allocation and document creation must succeed or fail together. Do not manually set a counter back to zero after orders have been created.
 * 
 */

import Counter from "../models/Counter.js";

const prefixes = { // prefixes is a JavaScript object mapping an ID type to its prefix.
  category: "NK-CAT",
  food: "NK-FOOD",
  customer: "NK-CUS",
  order: "NK-ORD",
};

export async function generateCustomId(type) {
  const prefix = prefixes[type];

  if (!prefix) {
    throw new Error("Unknown custom ID type");
  }

  const counter = await Counter.findOneAndUpdate( // finds the correct counter document and updates it.
    { _id: type },
    { $inc: { sequence: 1 } }, // atomically increases the counter.
    {
      new: true,
      upsert: true, // creates the counter document if it does not exist.
    }
  );

  return `${prefix}-${String(counter.sequence).padStart(6, "0")}`; // ???? MORE Breakdown //// padStart(6, "0") adds leading zeroes
}