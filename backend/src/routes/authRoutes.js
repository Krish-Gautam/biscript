import express from "express";
import {
  register,
  login,
  refreshToken,
  getProfile,
  updateProfile,
  setupAdmin,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  resendResetLink,
} from "../controllers/authController.js";
import verifyUser, { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/setup-admin", setupAdmin);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/resend-reset-link", resendResetLink);
router.get("/verify-reset-token", verifyResetToken);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/profile/:id", verifyUser, getProfile);
router.put("/profile/:id", verifyUser, updateProfile);



export default router;