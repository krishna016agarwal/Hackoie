import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "../routes/auth.routes.js";
import ticketRoutes from "../routes/ticket.routes.js";
import requestRouter from "../routes/application.routes.js";
import joinRequestRoutes from "../routes/joinRequest.routes.js";
import connectDB from "../config/db.js";

import { inngest } from "../inngest/client.js";
import { functions } from "../inngest/index.js";
import { serve } from "inngest/express";

dotenv.config();

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());


app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "https://hackoie.vercel.app",
      /\.vercel\.app$/   
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* -------------------- DB -------------------- */
connectDB();

/* -------------------- ROUTES -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/request", requestRouter);
app.use("/api/tickets", ticketRoutes);
app.use("/api/join-requests", joinRequestRoutes);

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  })
);
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
/* -------------------- EXPORT -------------------- */
export default app;
