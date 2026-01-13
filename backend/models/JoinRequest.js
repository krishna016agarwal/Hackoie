import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true
    },

    hackathonKey: {
      type: String,
      required: true
    },

    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    requestedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

   

   

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

// 🔐 Prevent duplicate requests
joinRequestSchema.index(
  { ticket: 1, requestedTo: 1 },
  { unique: true }
);

export default mongoose.model("JoinRequest", joinRequestSchema);
