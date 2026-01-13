import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  passwordHash: String,
  otpHash: String,
  otpExpiresAt: Date,

    otpSendCount: {
    type: Number,
    default: 0
  },
  otpSendDate: Date,
  otpVerifyAttempts: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model("PendingUser", pendingUserSchema);
