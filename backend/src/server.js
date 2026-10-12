import "dotenv/config";
import app from "./app.js";
import {connectDB} from "./config/connectDB.js";

const PORT = process.env.PORT || 5000;

try {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Nilus kitchen Dashboard Demo v3.0 Server running on port ${PORT}`);
  });
} catch {
  console.error("Server could not start");
  process.exit(1);
}