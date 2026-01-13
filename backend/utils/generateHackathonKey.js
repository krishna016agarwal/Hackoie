import crypto from "crypto";

export const generateHackathonKey = (normalizedUrl) => {
  if (!normalizedUrl || typeof normalizedUrl !== "string") {
    throw new Error("normalizedUrl is required to generate hackathon key");
  }

  return crypto
    .createHash("sha256")
    .update(normalizedUrl.trim().toLowerCase())
    .digest("hex");
};
