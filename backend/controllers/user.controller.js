import User from "../models/user.js";
import Ticket from "../models/ticket.js";
import { analyzeGithubSkillSignal } from "../utils/githubSkillProofread.js";


const REQUIRED_PROFILE_FIELDS = [
  "name",
  "phone",
  "college",
  "branch",
  "year",
  "github",
  "linkedin"
];

const ALLOWED_PROFILE_FIELDS = [
  "name",
  "phone",
  "age",
  "college",
  "branch",
  "year",
  "skills",
  "github",
  "linkedin",
  "devfolio",
  "about",
  "gender"
];

const sanitizeProfilePayload = (payload = {}) => {
  const safePayload = {};

  ALLOWED_PROFILE_FIELDS.forEach((field) => {
    if (payload[field] !== undefined) {
      safePayload[field] = payload[field];
    }
  });

  return safePayload;
};

export const updateProfile = async (req, res) => {
  try {
    const safePayload = sanitizeProfilePayload(req.body);

    // 1️⃣ Update only allowed fields
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: safePayload },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Check profile completeness
    const isComplete = REQUIRED_PROFILE_FIELDS.every(field => {
      const value = updatedUser[field];
      return value && value.toString().trim().length > 0;
    });

    // 3️⃣ Update completion flag if needed
    if (updatedUser.isProfileComplete !== isComplete) {
      updatedUser.isProfileComplete = isComplete;
      await updatedUser.save();
    }

    return res.json({
      message: isComplete
        ? "Profile updated & completed"
        : "Profile updated (incomplete)",
      isProfileComplete: isComplete,
      user: updatedUser
    });

  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
};


export const getMembersProfile = async (req, res) => {
  const { TicketId } = req.params;
  const ticket = await Ticket.findById(TicketId).populate("members", "-password  -isProfileComplete -isVerified -createdAt -updatedAt -__v");

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }
  res.json({ status:true,members: ticket.members });
};

export const syncMyGithubProofread = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const verification = await analyzeGithubSkillSignal(user.github);

    user.githubVerification = verification;
    await user.save();

    return res.json({
      status: true,
      message: "GitHub verification updated",
      githubVerification: user.githubVerification,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to sync GitHub verification",
    });
  }
};

export const getUserGithubProofread = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("name github githubVerification");

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    let verification = user.githubVerification;

    const shouldAutoRefresh =
      !verification?.analyzedAt ||
      Date.now() - new Date(verification.analyzedAt).getTime() > 1000 * 60 * 60 * 24;

    if (shouldAutoRefresh) {
      verification = await analyzeGithubSkillSignal(user.github);
      user.githubVerification = verification;
      await user.save();
    }

    return res.json({
      status: true,
      userId: user._id,
      name: user.name,
      github: user.github,
      githubVerification: verification,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to fetch GitHub proofread",
    });
  }
};