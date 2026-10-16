/** INITIAL written app.js code (during SERVER + DB SETUP) - start ========================================
 * 
 * check for compatibility LATER between INITIAL & NEW line of CODE block
 */
// import express from "express";
// import cors from "cors";
// // // // // not yet created ---------------------
// // import authRoutes from "./routes/authRoutes.js";
// // import catalogRoutes from "./routes/catalogRoutes.js";
// // import customerRoutes from "./routes/customerRoutes.js";
// // import orderRoutes from "./routes/orderRoutes.js";
// // import { errorMiddleware } from "./middleware/errorMiddleware.js";
// // // not yet created -------------------------
// const app = express();

// app.use(cors({
//   origin: process.env.CLIENT_URL,
//   methods: ["GET", "POST", "PATCH", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));

// app.use(express.json({ limit: "100kb" })); //???????? why required ? 100kb???

// app.get("/api/health", (req, res) => {
//   res.json({ message: "Nilus Kitchen dashboard v3.0 API is running" });
// });

// // // // // not yet created ---------------------
// // app.use("/api/auth", authRoutes);
// // app.use("/api/catalog", catalogRoutes);
// // app.use("/api/customers", customerRoutes);
// // app.use("/api/orders", orderRoutes);

// // app.use(errorMiddleware);
// // // not yet created ---------------------
// export default app;

/** INITIAL written app.js code (during SERVER + DB SETUP) - end ========================================
 * 
 */

/** NEW app.js code (after adding ROUTES Files) - start ======================================================
 * 
 * check for compatibility LATER between INITIAL & NEW line of CODE block
 * 
 * ????????? why ERROR Middleware ommited:
     app.use(errorMiddleware);
     in NEW app.js
 */

import express from "express";
import cors from "cors";


import authRoutes from "./routes/authRoutes.js";
import catalogRoutes from "./routes/catalogRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "100kb" }));

// Health check.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Nilus Kitchen API is running",
  });
});

// Register API routers.
app.use("/api/auth", authRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorMiddleware);
export default app;






