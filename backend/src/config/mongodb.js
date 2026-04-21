import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/biscript";
const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db = null;

export async function connectDB() {
  if (db) return db;

  try {
    await client.connect();
    db = client.db("test");

    // Create indexes
    const profiles = db.collection("profiles");
    const challenges = db.collection("challenges");
    const lessons = db.collection("lessons");

    await profiles.createIndex({ email: 1 }, { unique: true });
    await challenges.createIndex({ email: 1 });
    await lessons.createIndex({ date: 1 });


    console.log("✅ Connected to MongoDB: ", MONGODB_URI);
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}

export function getDB() {
  if (!db) {
    throw new Error("Database not connected. Call connectDB first.");
  }
  return db;
}

export async function closeDB() {
  if (client) {
    await client.close();
    console.log("✅ MongoDB connection closed");
  }
}

export default { connectDB, getDB, closeDB };