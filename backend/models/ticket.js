import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },

  description: { type: String },

  requirements: {
    type: [String],
    set: (values) => {
      if (!Array.isArray(values)) return [];

      return [...new Set(
        values
          .filter(Boolean)
          .map(v => v.toLowerCase().trim())
      )];
    }
  }

  ,

  requirementsText: String,

  teamSize: { type: Number, required: true },

  hackathonLink: String,

  hackathonName: { type: String, required: true },

  organization: { type: String, required: true },

  date: { type: Date },

  location: { type: String, required: true },

  hackathonKey: {
    type: String,
    required: true,
    index: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],

  status: {
    type: String,
    enum: ["OPEN", "CLOSED", "EXPIRED"],
    default: "OPEN"
  },

  expiredAt: {
    type: Date,
    default: null
  },

  closedAt: {
    type: Date,
    default: null
  }

}, { timestamps: true });

/**
 * ❗ Prevent same user creating 2 tickets for same hackathon
 */
ticketSchema.index(
  { hackathonKey: 1, createdBy: 1 },
  { unique: true }
);

export default mongoose.model("Ticket", ticketSchema);
