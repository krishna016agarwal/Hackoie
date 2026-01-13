import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  sendJoinRequest,
  getReceivedJoinRequests,
  respondToJoinRequest
} from "../controllers/joinRequest.controller.js";

const router = express.Router();

router.post("/send", protect, sendJoinRequest);
router.get("/received", protect, getReceivedJoinRequests);
router.post("/respond", protect, respondToJoinRequest);

export default router;
