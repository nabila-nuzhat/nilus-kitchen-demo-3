import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}

/** code pattern used in version 2 ----------------???? why different (breakdown later)??
 * 
 * import mongoose from "mongoose";

    const connectDB = async () => {
      try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
      } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        // process.exit(1);
        throw error;
      }
    };

export default connectDB;
 */

