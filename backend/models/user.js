import mongoose from "mongoose";

const normalize = (v) =>
  typeof v === "string" ? v.toLowerCase().trim() : v;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    set: normalize
  },

  email: {
    type: String,
    required: true,
    unique: true,
    set: normalize
  },

  password: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    set: normalize
  },

  age: Number,

  college: {
    type: String,
    set: normalize
  },

  branch: {
    type: String,
    set: normalize
  },

  year: String,

  skills: {
    type: [String],
    set: (skills) =>
      Array.isArray(skills)
        ? [...new Set(skills.map(s => s.toLowerCase().trim()))]
        : []
  },

  github: {
    type: String,
    //required: true,
    set: normalize
  },

  linkedin: {
    type: String,
    // required: true,
    set: normalize
  },

  devfolio: {
    type: String,
    set: normalize
  },

  about: {
    type: String,
    set: normalize
  },

  gender: {
    type: String,
    enum: ["male", "female", "other"],
    set: normalize
  },

  isProfileComplete: {
    type: Boolean,
    default: false
  },
  // otp: String,
  // otpExpiry: Date,
  // otpRequestCount: {
  //   type: Number,
  //   default: 0
  // },
  // otpRequestDate: Date,
  isVerified: {
    type: Boolean,
    default: false
  },

  githubVerification: {
    status: {
      type: String,
      enum: ["not_provided", "verified", "error"],
      default: "not_provided"
    },
    score: {
      type: Number,
      default: 0
    },
    confidence: {
      type: String,
      default: "low"
    },
    summary: {
      type: String,
      default: "No verification run yet."
    },
    username: String,
    inferredSkills: {
      type: [String],
      default: []
    },
    profile: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    analyzedAt: Date
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);


