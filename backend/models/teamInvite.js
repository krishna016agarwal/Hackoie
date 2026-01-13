import mongoose from "mongoose";

const teamInviteSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    invitedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    hackathonKey: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

// ❗ Prevent duplicate invites
teamInviteSchema.index(
  { ticket: 1, invitedUser: 1 },
  { unique: true }
);

export default mongoose.model("TeamInvite", teamInviteSchema);