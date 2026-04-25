// routes/lessonRoutes.js
import express from "express";
import {
  getLessonByLanguage,
  getLessonById,
  addLesson,
  updateLesson,
  deleteLesson,
} from "../controllers/lessonController.js";

import{ requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/language/:language", getLessonByLanguage);
router.get("/:id", getLessonById);

// Admin only
router.post("/", requireAdmin, addLesson);
router.put("/:id", requireAdmin, updateLesson);
router.delete("/:id",requireAdmin, deleteLesson);

export default router;