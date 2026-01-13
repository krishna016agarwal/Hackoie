import express from "express";
import authRoutes from "./routes/auth.routes.js";

import ticketRoutes from "./routes/ticket.routes.js";
import connectDB from "./config/db.js"
import dotenv from "dotenv"
import { inngest } from "./inngest/client.js";
import { functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import requestRouter from "./routes/application.routes.js"
import joinRequestRoutes from "./routes/joinRequest.routes.js";
dotenv.config();
// import { sendMail } from "./utils/sendEmail.js";
import cors from "cors"

const app = express();

app.use(express.json());
app.use(cors());
connectDB();

const PORT = process.env.PORT || 5000;




app.use("/api/auth", authRoutes);
app.use("/api/request",requestRouter);
app.use("/api/tickets", ticketRoutes);
app.use("/api/join-requests", joinRequestRoutes);
app.use(
  "/api/inngest",serve({
    client: inngest,
    functions: functions
  })
);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// sendMail("krishna016agarwal@gmail.com","Hackoie", `<h2>Hello </h2>
//      <p>Welcome to Hackoie. Start building now!</p>`);