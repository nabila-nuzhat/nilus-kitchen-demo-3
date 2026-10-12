import express from "express";
import cors from "cors";
// // // // not yet created ---------------------
// import authRoutes from "./routes/authRoutes.js";
// import catalogRoutes from "./routes/catalogRoutes.js";
// import customerRoutes from "./routes/customerRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";
// import { errorMiddleware } from "./middleware/errorMiddleware.js";
// // not yet created -------------------------
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "100kb" })); //???????? why required ? 100kb???

app.get("/api/health", (req, res) => {
  res.json({ message: "Nilus Kitchen dashboard v3.0 API is running" });
});

// // // // not yet created ---------------------
// app.use("/api/auth", authRoutes);
// app.use("/api/catalog", catalogRoutes);
// app.use("/api/customers", customerRoutes);
// app.use("/api/orders", orderRoutes);

// app.use(errorMiddleware);
// // not yet created ---------------------
export default app;