// routes/badgeRoutes.js
import express from "express";
import {
  getBadges
} from "../controllers/badgeController.js";

const router = express.Router();

// Public
router.get("/", getBadges);


export default router;