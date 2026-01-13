import mongoose from "mongoose";

const hackathonSchema = new mongoose.Schema({
  hackathonKey: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
  canonicalLink: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  organization: String,
  date: Date,
  location: String,
  source: {
    type: String,
    enum: ["SCRAPED", "MANUAL"],
    required: true,
    default: "SCRAPED",
  },
}, { timestamps: true });

export default mongoose.model("Hackathon", hackathonSchema);
