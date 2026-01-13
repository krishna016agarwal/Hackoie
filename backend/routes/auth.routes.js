import express from "express";
import { register, login,logout, verifyOtpAndRegister} from "../controllers/auth.controller.js";
import { getMembersProfile } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/user.controller.js";
const router = express.Router();

router.post("/register", register);
router.post("/register/otp",verifyOtpAndRegister)
router.post("/login", login);
router.post("/logout", protect, logout); // 🔐 optional protect
router.put("/profile", protect, updateProfile);
router.get("/ticket/:TicketId/members", protect, getMembersProfile);    // 🔐 protected
export default router;
