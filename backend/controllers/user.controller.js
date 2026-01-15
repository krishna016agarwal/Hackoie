import User from "../models/user.js";
import Ticket from "../models/ticket.js";


const REQUIRED_PROFILE_FIELDS = [
  "name",
  "phone",
  "college",
  "branch",
  "year",
  "github",
  "linkedin"
];

export const updateProfile = async (req, res) => {
  try {
    // 1️⃣ Update only allowed fields
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
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