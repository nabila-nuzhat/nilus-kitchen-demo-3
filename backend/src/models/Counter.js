/** NOTE:
 * The _id of a counter document is the name of the sequence, such as customer or order. Its sequence is a number.
 * 
 */

import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  sequence: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Counter", counterSchema);