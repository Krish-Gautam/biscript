import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import * as authModel from "../models/authModels.js";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/emailService.js";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
const EMAIL_VERIFICATION_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const EMAIL_SEND_TIMEOUT_MS = Number(
  process.env.EMAIL_SEND_TIMEOUT_MS || 30000
); // Increased from 15s to 30s
const RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds cooldown between resends
const PASSWORD_RESET_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const PASSWORD_RESET_COOLDOWN_MS = 30 * 1000; // 30 seconds cooldown between reset requests

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
  if (!password || password.length < 8) return false;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasLower && hasUpper && hasNumber;
}

function hashOpaqueToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function randomToken() {
  return crypto.randomBytes(32).toString("hex");
}

function safeUser(user) {
  return {
    id: user._id,
    email: user.email,
    username: user.username || user.name || "",
    role: user.role || "student",
    email_verified: Boolean(user.email_verified),
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Email service timeout"));
      }, timeoutMs);
    }),
  ]);
}

function getBackendPublicUrl() {
  return (
    process.env.BACKEND_PUBLIC_URL ||
    `http://localhost:${process.env.PORT || 5000}`
  );
}

function getFrontendUrl() {
  return process.env.FRONTEND_URL || "http://localhost:5173";
}


function createMailer() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}


function canResendFrom(generatedAt) {
  if (!generatedAt) return true;
  return Date.now() - new Date(generatedAt).getTime() >= RESEND_COOLDOWN_MS;
}

function tokenPair(user) {
  const base = {
    userId: user._id,
    email: user.email,
    role: user.role || "student",
  };

  return {
    accessToken: signAccessToken(base),
    refreshToken: signRefreshToken(base),
  };
}

// Register
export async function register(req, res) {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ error: "Email, password, and username are required" });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        error: "Only Gmail addresses are allowed",
      });
    }

    const user = await authModel.createUser(
      email,
      password,
      username,

    );

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    const verificationTokenExpiry = new Date(
      Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRY_MS
    );

    await authModel.saveEmailVerificationToken(
      user._id,
      verificationTokenHash,
      verificationTokenExpiry
    );

    const verificationLink = `${getBackendPublicUrl()}/api/auth/verify-email?token=${verificationToken}`;
    await withTimeout(
      sendVerificationEmail(user.email, user.username, verificationLink),
      EMAIL_SEND_TIMEOUT_MS
    );

    res.status(201).json({
      message:
        "Registration successful. Please verify your email from the link sent to your inbox.",
    });
  } catch (error) {
    console.error("Register error:", error);
    if (error.message === "Email service timeout") {
      return res.status(503).json({
        error:
          "Email server is taking too long. Please try registration again in a moment.",
      });
    }
    res.status(400).json({ error: error.message });
  }
}

export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    const frontendUrl = getFrontendUrl();

    if (!token) {
      return res.redirect(`${frontendUrl}/login?verified=0`);
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const updatedUser = await authModel.verifyEmailByTokenHash(tokenHash);

    if (!updatedUser) {
      return res.redirect(`${frontendUrl}/login?verified=0`);
    }

    return res.redirect(`${frontendUrl}/login?verified=1`);
  } catch (error) {
    console.error("Verify email error:", error);
    return res.redirect(`${getFrontendUrl()}/login?verified=0`);
  }
}

// Resend verification email
export async function resendVerificationEmail(req, res) {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        error: "Only Gmail addresses are allowed",
      });
    }

    // Check if user exists
    const user = await authModel.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        error: "No account found with this email. Please register first.",
      });
    }

    // Check if already verified
    if (user.email_verified) {
      return res.status(400).json({
        error: "Email is already verified. You can log in now.",
      });
    }

    // Check resend cooldown based on token generation time (30 seconds)
    if (user.verification_token_expires_at) {
      const now = new Date();
      let timeSinceGeneration;

      // NEW: Use explicit generation timestamp if available (backward compatible)
      if (user.verification_token_generated_at) {
        const generatedAt = new Date(user.verification_token_generated_at);
        timeSinceGeneration = now.getTime() - generatedAt.getTime();
      } else {
        // FALLBACK: Use old calculation for tokens without timestamp field
        const tokenExpiry = new Date(user.verification_token_expires_at);
        const timeUntilExpiry = tokenExpiry.getTime() - now.getTime();
        timeSinceGeneration =
          EMAIL_VERIFICATION_TOKEN_EXPIRY_MS - timeUntilExpiry;
      }

      // If token was generated less than 30 seconds ago, prevent resend
      if (timeSinceGeneration < RESEND_COOLDOWN_MS) {
        const remainingMs = RESEND_COOLDOWN_MS - timeSinceGeneration;
        const remainingSeconds = Math.ceil(remainingMs / 1000);
        const pluralS = remainingSeconds !== 1 ? "s" : "";

        return res.status(429).json({
          error: `Please wait ${remainingSeconds} second${pluralS} before requesting another verification email.`,
        });
      }
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    const verificationTokenExpiry = new Date(
      Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRY_MS
    );

    // Update token in database
    await authModel.saveEmailVerificationToken(
      user._id,
      verificationTokenHash,
      verificationTokenExpiry
    );

    // Send verification email
    const verificationLink = `${getBackendPublicUrl()}/api/auth/verify-email?token=${verificationToken}`;
    await withTimeout(
      sendVerificationEmail(user.email, user.username, verificationLink),
      EMAIL_SEND_TIMEOUT_MS
    );

    res.json({
      message: "Verification email sent successfully. Check your inbox.",
      expiresIn: "24 hours",
    });
  } catch (error) {
    console.error("Resend verification email error:", error);
    if (error.message === "Email service timeout") {
      return res.status(503).json({
        error: "Email server is taking too long. Please try again in a moment.",
      });
    }
    res.status(500).json({ error: "Failed to resend verification email" });
  }
}

// Login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await authModel.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await authModel.verifyPassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.email_verified) {
      return res.status(403).json({
        error: "Please verify your email before logging in",
      });
    }

    const accessToken = generateToken(user._id, user.email, user.role);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
}


// Refresh token
export async function refreshToken(req, res) {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    const payload = verifyRefreshToken(refresh_token);

    if (!payload) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const user = await authModel.getUserById(payload.userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const newAccessToken = generateToken(user._id, user.email, user.role);

    res.json({
      access_token: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ error: "Token refresh failed" });
  }
}

// Get user profile
export async function getProfile(req, res) {
  try {
    const userId = req.params.id;
    const user = await authModel.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      bio: user.bio || "",
      avatar_url: user.avatar_url || "",
      email_verified: user.email_verified === true,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
}
// Update user profile
export async function updateProfile(req, res) {
  try {
    const userId = req.params.id;
    const { username, bio, avatar_url } = req.body;


    const updates = {};

    if (username !== undefined) updates.username = username;
    if (bio !== undefined) updates.bio = bio;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;

    const updated = await authModel.updateUserProfile(userId, updates);

    if (!updated) {
      return res.status(400).json({ error: "No changes made" });
    }

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
}

export async function setupAdmin(req, res) {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");
    const username = String(req.body?.username || "Admin").trim();

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters with uppercase, lowercase and number",
      });
    }

    const adminExists = await checkAdminExists();
    if (adminExists) {
      return res.status(409).json({ error: "Admin already exists" });
    }

    const admin = await createAdmin(email, password, username);
    const tokens = tokenPair({ _id: admin.id, email: admin.email, role: "admin" });

    return res.status(201).json({
      message: "Admin created successfully",
      ...tokens,
      user: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("setupAdmin error:", error);
    if (error.message === "Email already exists") {
      return res.status(409).json({ error: "Email already exists" });
    }
    return res.status(500).json({ error: "Failed to setup admin" });
  }
}
//forgot-password
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!NITKKR_EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        error: "Only @nitkkr.ac.in email addresses are allowed",
      });
    }

    // Check if user exists
    const user = await authModel.getUserByEmail(email);
    if (!user) {
      // For security, don't reveal if email exists
      return res.json({
        message:
          "If an account exists with this email, you will receive a password reset link.",
      });
    }

    // Check reset cooldown based on token generation time (30 seconds)
    const tokenInfo = await authModel.getPasswordResetTokenInfo(user._id);
    if (tokenInfo) {
      const now = new Date();
      let timeSinceGeneration;

      // NEW: Use explicit generation timestamp if available (backward compatible)
      if (tokenInfo.generatedAt) {
        const generatedAt = new Date(tokenInfo.generatedAt);
        timeSinceGeneration = now.getTime() - generatedAt.getTime();
      } else {
        // FALLBACK: Use old calculation for tokens without timestamp field
        const tokenExpiry = new Date(tokenInfo.expiresAt);
        const timeUntilExpiry = tokenExpiry.getTime() - now.getTime();
        timeSinceGeneration = PASSWORD_RESET_TOKEN_EXPIRY_MS - timeUntilExpiry;
      }

      // If token was generated less than 30 seconds ago, prevent resend
      if (timeSinceGeneration < PASSWORD_RESET_COOLDOWN_MS) {
        const remainingMs = PASSWORD_RESET_COOLDOWN_MS - timeSinceGeneration;
        const remainingSeconds = Math.ceil(remainingMs / 1000);
        const pluralS = remainingSeconds !== 1 ? "s" : "";

        return res.status(429).json({
          error: `Please wait ${remainingSeconds} second${pluralS} before requesting another password reset email.`,
        });
      }
    }

    // Generate new password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetTokenExpiry = new Date(
      Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_MS
    );

    // Save token to database
    await authModel.savePasswordResetToken(
      user._id,
      resetTokenHash,
      resetTokenExpiry
    );

    // Send reset email
    const resetLink = `${getFrontendUrl()}/forgot-password?token=${resetToken}`;
    await withTimeout(
      sendPasswordResetEmail(user.email, user.name, resetLink),
      EMAIL_SEND_TIMEOUT_MS
    );

    res.json({
      message:
        "If an account exists with this email, you will receive a password reset link.",
      expiresIn: "24 hours",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    if (error.message === "Email service timeout") {
      return res.status(503).json({
        error: "Email server is taking too long. Please try again in a moment.",
      });
    }
    res.status(500).json({ error: "Failed to process password reset request" });
  }
}


// Verify reset token
export async function verifyResetToken(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        valid: false,
        message: "Reset token is required",
      });
    }

    // Hash the token to find in database
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with this reset token
    const user = await authModel.getUserByResetTokenHash(tokenHash);

    if (!user) {
      return res.status(400).json({
        valid: false,
        message:
          "Your reset link has expired or is invalid. Please request a new password reset.",
      });
    }

    // Token is valid
    res.json({
      valid: true,
      message: "Reset token is valid",
    });
  } catch (error) {
    console.error("Verify reset token error:", error);
    res.status(500).json({
      valid: false,
      message: "Failed to verify reset token",
    });
  }
}

// Reset password - submit new password
export async function resetPassword(req, res) {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    // Validate inputs
    if (!token) {
      return res.status(400).json({ error: "Reset token is required" });
    }

    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    if (!confirmPassword) {
      return res
        .status(400)
        .json({ error: "Password confirmation is required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Validate password strength (same as registration)
    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    // Hash the token to find in database
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with this reset token
    const user = await authModel.getUserByResetTokenHash(tokenHash);

    if (!user) {
      return res.status(400).json({
        error:
          "Your reset link has expired or is invalid. Please request a new password reset.",
      });
    }

    // Hash the new password
    const bcrypt = (await import("bcryptjs")).default;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token
    const updated = await authModel.resetUserPassword(user._id, hashedPassword);

    if (!updated) {
      return res.status(500).json({ error: "Failed to reset password" });
    }

    res.json({
      success: true,
      message:
        "Password has been reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
}

// Resend password reset link
export async function resendResetLink(req, res) {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!NITKKR_EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        error: "Only @nitkkr.ac.in email addresses are allowed",
      });
    }

    // Check if user exists
    const user = await authModel.getUserByEmail(email);
    if (!user) {
      // For security, don't reveal if email exists
      return res.json({
        message:
          "If an account exists with this email, you will receive a password reset link.",
      });
    }

    // Check reset cooldown based on token generation time (30 seconds)
    const tokenInfo = await authModel.getPasswordResetTokenInfo(user._id);
    if (tokenInfo) {
      const now = new Date();
      let timeSinceGeneration;

      // NEW: Use explicit generation timestamp if available (backward compatible)
      if (tokenInfo.generatedAt) {
        const generatedAt = new Date(tokenInfo.generatedAt);
        timeSinceGeneration = now.getTime() - generatedAt.getTime();
      } else {
        // FALLBACK: Use old calculation for tokens without timestamp field
        const tokenExpiry = new Date(tokenInfo.expiresAt);
        const timeUntilExpiry = tokenExpiry.getTime() - now.getTime();
        timeSinceGeneration = PASSWORD_RESET_TOKEN_EXPIRY_MS - timeUntilExpiry;
      }

      // If token was generated less than 30 seconds ago, prevent resend
      if (timeSinceGeneration < PASSWORD_RESET_COOLDOWN_MS) {
        const remainingMs = PASSWORD_RESET_COOLDOWN_MS - timeSinceGeneration;
        const remainingSeconds = Math.ceil(remainingMs / 1000);
        const pluralS = remainingSeconds !== 1 ? "s" : "";

        return res.status(429).json({
          error: `Please wait ${remainingSeconds} second${pluralS} before requesting another password reset email.`,
        });
      }
    }

    // Generate new password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetTokenExpiry = new Date(
      Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_MS
    );

    // Update token in database
    await authModel.savePasswordResetToken(
      user._id,
      resetTokenHash,
      resetTokenExpiry
    );

    // Send reset email
    const resetLink = `${getFrontendUrl()}/forgot-password?token=${resetToken}`;
    await withTimeout(
      sendPasswordResetEmail(user.email, user.name, resetLink),
      EMAIL_SEND_TIMEOUT_MS
    );

    res.json({
      message:
        "Password reset link sent successfully. Check your inbox for the email.",
      expiresIn: "24 hours",
    });
  } catch (error) {
    console.error("Resend reset link error:", error);
    if (error.message === "Email service timeout") {
      return res.status(503).json({
        error: "Email server is taking too long. Please try again in a moment.",
      });
    }
    res.status(500).json({ error: "Failed to resend password reset email" });
  }
}