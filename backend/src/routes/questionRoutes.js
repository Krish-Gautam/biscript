// routes/questionRoutes.js

import express from "express";
import {
  getQuestionsByLesson,
  getQuestionById,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";

import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/lesson/:lessonId", getQuestionsByLesson);
router.get("/:id", getQuestionById);

// Admin
router.post("/", requireAdmin, addQuestion);
router.put("/:id", requireAdmin, updateQuestion);
router.delete("/:id", requireAdmin, deleteQuestion);

export default router;