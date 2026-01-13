import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createApplication,
  updateApplicationStatus,
  getIncomingRequests,
  deleteApplication
  ,getSentApplications
} from "../controllers/application.controller.js";

const router = express.Router();

router.post("/", protect, createApplication);
router.put("/:applicationId", protect, updateApplicationStatus);
router.get("/incoming", protect, getIncomingRequests);
router.delete("/:applicationId",protect,deleteApplication)
router.get("/sent",protect,getSentApplications);
export default router;
