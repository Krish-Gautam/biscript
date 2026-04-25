// routes/questionRoutes.js

import express from "express";
import {
    runCode,
    submitCode,
} from "../controllers/runCodeController.js";

import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", runCode);
router.post("/submit", submitCode);

export default router;