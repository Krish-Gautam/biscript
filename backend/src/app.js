// app.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import goblinLineRoutes from "./routes/goblinLineRoutes.js";
import runCodeRoutes from "./routes/runCodeRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";
import badgeRoutes from "./routes/badgeRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";


const app = express();

// ── CORS ─────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// ── Middleware ───────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────
app.get("/api/health", (_, res) =>
  res.json({ ok: true, ts: new Date().toISOString() })
);

app.use("/api/auth", authRoutes);
app.use("/api/lessons", lessonRoutes);   
app.use("/api/questions", questionRoutes);
app.use("/api/goblin", goblinLineRoutes);
app.use("/api/runCode", runCodeRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/upload", uploadRoutes);
// ── 404 ─────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.path}`,
  });
});

// ── Error handler ───────────────────────────
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({
    error: err.message || "Internal server error",
  });
});

export default app;