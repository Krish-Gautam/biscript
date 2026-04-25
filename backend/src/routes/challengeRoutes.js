// routes/lessonRoutes.js
import express from "express";
import {
  getChallenges,
  getChallengeById,
  addChallenge,
  updateChallenge,
  deleteChallenge,
  getChallengeByUserID
} from "../controllers/challengeController.js";

import{ requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/type/:challengeType", getChallenges);
router.get("/user/:userId", getChallengeByUserID);
router.get("/:id", getChallengeById);

// Admin only
router.post("/", requireAdmin, addChallenge);
router.put("/:id", requireAdmin, updateChallenge);
router.delete("/:id",requireAdmin, deleteChallenge);

export default router;