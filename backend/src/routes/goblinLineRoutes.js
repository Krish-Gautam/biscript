// routes/goblinRoutes.js

import express from "express";
import {
  getGoblinScript,
  addGoblinScript,
  updateGoblinScript,
  deleteGoblinScript,
} from "../controllers/goblinLineController.js";

import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/:lessonId/", getGoblinScript);


// Admin
router.post("/:lessonId/", requireAdmin, addGoblinScript);
router.put("/:lessonId/", requireAdmin, updateGoblinScript);
router.delete("/:lessonId/", requireAdmin, deleteGoblinScript);

export default router;