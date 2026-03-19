import express from "express";
import { register, login,logout, verifyOtpAndRegister} from "../controllers/auth.controller.js";
import { getMembersProfile, getUserGithubProofread, syncMyGithubProofread } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/user.controller.js";
const router = express.Router();

router.post("/register", register);
router.post("/register/otp",verifyOtpAndRegister)
router.post("/login", login);
router.post("/logout", protect, logout);
router.put("/profile", protect, updateProfile);
router.post("/profile/github-proofread", protect, syncMyGithubProofread);
router.get("/users/:userId/github-proofread", protect, getUserGithubProofread);
router.get("/ticket/:TicketId/members", protect, getMembersProfile);
export default router;
