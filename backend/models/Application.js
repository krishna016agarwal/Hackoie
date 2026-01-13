import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true
  },

  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  hackathonKey: {
    type: String,
    required: true,
    index: true
  },

  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "REJECTED","REMOVED"],
    default: "PENDING"
  }

}, { timestamps: true });

/**
 * ❗ Only ONE accepted application per user per hackathon
 */
applicationSchema.index(
  { applicant: 1, hackathonKey: 1,status :1 },
  {
    unique: true,
    partialFilterExpression: { status: "ACCEPTED" }
  }
);
/**
 * ✅ Prevent duplicate PENDING requests for same ticket
 */
applicationSchema.index(
  { applicant: 1, ticket: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "PENDING" }
  }
);
export default mongoose.model("Application", applicationSchema);
