import mongoose from "mongoose";
import dns from "node:dns";

const sanitizeMongoUri = (value = "") => {
  const trimmed = String(value).trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
};

const configureMongoDns = () => {
  const rawServers = process.env.MONGO_DNS_SERVERS || "8.8.8.8,1.1.1.1";
  const servers = rawServers
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (!servers.length) return;

  try {
    dns.setServers(servers);
    console.log(`Mongo DNS resolvers set: ${servers.join(", ")}`);
  } catch (error) {
    console.warn("Could not set custom Mongo DNS resolvers:", error.message);
  }
};

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      console.error("Missing MONGODB_URL in environment variables");
      process.exit(1);
    }

    const mongoUri = sanitizeMongoUri(process.env.MONGODB_URL);

    if (!mongoUri) {
      console.error("MONGODB_URL is empty after sanitization");
      process.exit(1);
    }

    if (mongoUri.startsWith("mongodb+srv://")) {
      configureMongoDns();
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
