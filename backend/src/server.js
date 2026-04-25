// server.js
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB }from "./config/mongodb.js";
import { startCleanupJob, stopCleanupJob } from "./utils/cleanup.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    startCleanupJob();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // ── Graceful shutdown ────────────────────
    const shutdown = async (signal) => {
      console.log(`${signal} received. Shutting down...`);
      stopCleanupJob();

      server.close(async () => {
        await closeDB(); // make sure you export this
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();