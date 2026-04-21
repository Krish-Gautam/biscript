import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import {
  createUser,
  getUserByEmail,
  getUserById,
  verifyPassword,
  updateUserProfile,
  checkAdminExists,
  createAdmin,
  saveEmailVerificationToken,
  getEmailVerificationTokenInfo,
  verifyEmailByTokenHash,
  savePasswordResetToken,
  getUserByResetTokenHash,
  getPasswordResetTokenInfo,
  resetUserPassword,
  deleteUnverifiedOlderThan,
  deleteExpiredPasswordResetTokens,
} from "../models/authModels.js";
import { signAccessToken, signRefreshToken, verifyToken } from "../utils/jwt.js";

const EMAIL_VERIFICATION_TTL_MS = Number(process.env.EMAIL_VERIFICATION_TTL_MS || 24 * 60 * 60 * 1000);
const PASSWORD_RESET_TTL_MS = Number(process.env.PASSWORD_RESET_TTL_MS || 30 * 60 * 1000);
const RESEND_COOLDOWN_MS = Number(process.env.RESEND_COOLDOWN_MS || 60 * 1000);

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

function backendBaseUrl(req) {
  if (process.env.BACKEND_BASE_URL) return process.env.BACKEND_BASE_URL;
  return `${req.protocol}://${req.get("host")}`;
}

function frontendBaseUrl(req) {
  if (process.env.FRONTEND_URL) return process.env.FRONTEND_URL;
  return `${req.protocol}://${req.get("host")}`;
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

async function sendEmail({ to, subject, text, html }) {
  const transporter = createMailer();

  if (!transporter) {
    console.log("SMTP not configured. Intended email:", { to, subject, text });
    return;
  }

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
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

export async function register(req, res) {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");
    const username = String(req.body?.username || "").trim();
    const phone = String(req.body?.phone || "").trim();
    const branch = String(req.body?.branch || "").trim();
    const year = String(req.body?.year || "").trim();
    const roll_number = String(req.body?.roll_number || "").trim();

    if (!email || !password || !username) {
      return res.status(400).json({ error: "email, username and password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters with uppercase, lowercase and number",
      });
    }

    await deleteUnverifiedOlderThan(24);

    const created = await createUser(email, password, username, phone, branch, year);

    await updateUserProfile(created.id, {
      username,
      name: username,
      phone,
      branch,
      year,
      roll_number,
      role: "student",
      is_member: false,
    });

    const rawToken = randomToken();
    const tokenHash = hashOpaqueToken(rawToken);
    const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS);
    await saveEmailVerificationToken(created.id, tokenHash, expiresAt);

    const verifyLink = `${backendBaseUrl(req)}/api/auth/verify-email?token=${encodeURIComponent(rawToken)}`;

    await sendEmail({
      to: email,
      subject: "Verify your Biscript account",
      text: `Welcome to Biscript. Verify your email by opening: ${verifyLink}`,
      html: `<p>Welcome to Biscript.</p><p>Please verify your email by clicking <a href="${verifyLink}">this link</a>.</p>`,
    });

    return res.status(201).json({
      message: "Registration successful. Please verify your email.",
      user: {
        id: created.id,
        email,
        username,
      },
    });
  } catch (error) {
    if (error.message === "User already exists") {
      return res.status(409).json({ error: "Email already registered" });
    }

    console.error("register error:", error);
    return res.status(500).json({ error: "Failed to register user" });
  }
}

export async function verifyEmail(req, res) {
  try {
    const token = String(req.query?.token || "");
    if (!token) {
      return res.status(400).json({ error: "Missing verification token" });
    }

    const tokenHash = hashOpaqueToken(token);
    const verified = await verifyEmailByTokenHash(tokenHash);

    if (!verified) {
      return res.status(400).json({ error: "Invalid or expired verification link" });
    }

    const loginUrl = `${frontendBaseUrl(req)}/login`;
    return res.status(200).send(
      `<html><body style="font-family:sans-serif"><h2>Email verified successfully</h2><p>You can now log in.</p><p><a href="${loginUrl}">Go to login</a></p></body></html>`
    );
  } catch (error) {
    console.error("verifyEmail error:", error);
    return res.status(500).json({ error: "Failed to verify email" });
  }
}

export async function resendVerificationEmail(req, res) {
  try {
    const email = normalizeEmail(req.body?.email);

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(200).json({ message: "If the account exists, a verification email has been sent." });
    }

    if (user.email_verified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    const tokenInfo = await getEmailVerificationTokenInfo(user._id);
    if (!canResendFrom(tokenInfo.generatedAt)) {
      return res.status(429).json({ error: "Please wait before requesting another verification email" });
    }

    const rawToken = randomToken();
    const tokenHash = hashOpaqueToken(rawToken);
    const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS);

    await saveEmailVerificationToken(user._id, tokenHash, expiresAt);

    const verifyLink = `${backendBaseUrl(req)}/api/auth/verify-email?token=${encodeURIComponent(rawToken)}`;

    await sendEmail({
      to: email,
      subject: "Your Biscript verification link",
      text: `Open this link to verify your account: ${verifyLink}`,
      html: `<p>Open this link to verify your account:</p><p><a href="${verifyLink}">${verifyLink}</a></p>`,
    });

    return res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error("resendVerificationEmail error:", error);
    return res.status(500).json({ error: "Failed to resend verification email" });
  }
}

export async function login(req, res) {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const validPassword = await verifyPassword(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.email_verified) {
      return res.status(403).json({
        error: "Please verify your email before logging in",
      });
    }

    const tokens = tokenPair(user);

    return res.status(200).json({
      message: "Login successful",
      ...tokens,
      user: safeUser(user),
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({ error: "Failed to login" });
  }
}

export async function refreshToken(req, res) {
  try {
    const incomingToken =
      req.body?.refreshToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!incomingToken) {
      return res.status(401).json({ error: "Refresh token is required" });
    }

    const payload = verifyToken(incomingToken);
    if (!payload || payload.type !== "refresh") {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }

    const user = await getUserById(payload.userId);
    if (!user || !user.email_verified) {
      return res.status(401).json({ error: "User not authorized" });
    }

    const accessToken = signAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role || "student",
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("refreshToken error:", error);
    return res.status(500).json({ error: "Failed to refresh token" });
  }
}

export async function getProfile(req, res) {
  try {
    const user = await getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user: safeUser(user) });
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
}

export async function updateProfile(req, res) {
  try {
    const allowedFields = ["username", "name", "phone", "branch", "year", "roll_number", "is_member"];
    const updates = {};

    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body || {}, key)) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid profile fields to update" });
    }

    const updated = await updateUserProfile(req.user.userId, updates);
    if (!updated) {
      return res.status(404).json({ error: "User not found or no changes made" });
    }

    const user = await getUserById(req.user.userId);
    return res.status(200).json({ message: "Profile updated", user: safeUser(user) });
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
}

export async function setupAdmin(req, res) {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");
    const name = String(req.body?.name || "Admin").trim();

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

    const admin = await createAdmin(email, password, name);
    const tokens = tokenPair({ _id: admin.id, email: admin.email, role: "admin" });

    return res.status(201).json({
      message: "Admin created successfully",
      ...tokens,
      user: {
        id: admin.id,
        email: admin.email,
        username: admin.name,
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

export async function forgotPassword(req, res) {
  try {
    const email = normalizeEmail(req.body?.email);

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    await deleteExpiredPasswordResetTokens();

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(200).json({ message: "If the account exists, a reset link has been sent." });
    }

    const tokenInfo = await getPasswordResetTokenInfo(user._id);
    if (!canResendFrom(tokenInfo.generatedAt)) {
      return res.status(429).json({ error: "Please wait before requesting another reset link" });
    }

    const rawToken = randomToken();
    const tokenHash = hashOpaqueToken(rawToken);
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);

    await savePasswordResetToken(user._id, tokenHash, expiresAt);

    const resetLink = `${frontendBaseUrl(req)}/reset-password?token=${encodeURIComponent(rawToken)}`;
    await sendEmail({
      to: email,
      subject: "Biscript password reset",
      text: `Reset your password using this link: ${resetLink}`,
      html: `<p>Reset your password using this link:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    });

    return res.status(200).json({ message: "If the account exists, a reset link has been sent." });
  } catch (error) {
    console.error("forgotPassword error:", error);
    return res.status(500).json({ error: "Failed to process forgot password" });
  }
}

export async function resendResetLink(req, res) {
  try {
    const email = normalizeEmail(req.body?.email);

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(200).json({ message: "If the account exists, a reset link has been sent." });
    }

    const tokenInfo = await getPasswordResetTokenInfo(user._id);
    if (!canResendFrom(tokenInfo.generatedAt)) {
      return res.status(429).json({ error: "Please wait before requesting another reset link" });
    }

    const rawToken = randomToken();
    const tokenHash = hashOpaqueToken(rawToken);
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);

    await savePasswordResetToken(user._id, tokenHash, expiresAt);

    const resetLink = `${frontendBaseUrl(req)}/reset-password?token=${encodeURIComponent(rawToken)}`;
    await sendEmail({
      to: email,
      subject: "Your Biscript reset link",
      text: `Reset your password using this link: ${resetLink}`,
      html: `<p>Reset your password using this link:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    });

    return res.status(200).json({ message: "Reset link sent" });
  } catch (error) {
    console.error("resendResetLink error:", error);
    return res.status(500).json({ error: "Failed to resend reset link" });
  }
}

export async function verifyResetToken(req, res) {
  try {
    const token = String(req.query?.token || "");
    if (!token) {
      return res.status(400).json({ error: "Missing reset token" });
    }

    const tokenHash = hashOpaqueToken(token);
    const user = await getUserByResetTokenHash(tokenHash);

    if (!user) {
      return res.status(400).json({ valid: false, error: "Invalid or expired reset token" });
    }

    return res.status(200).json({ valid: true });
  } catch (error) {
    console.error("verifyResetToken error:", error);
    return res.status(500).json({ error: "Failed to verify reset token" });
  }
}

export async function resetPassword(req, res) {
  try {
    const token = String(req.body?.token || "");
    const newPassword = String(req.body?.newPassword || "");

    if (!token || !newPassword) {
      return res.status(400).json({ error: "token and newPassword are required" });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters with uppercase, lowercase and number",
      });
    }

    const tokenHash = hashOpaqueToken(token);
    const user = await getUserByResetTokenHash(tokenHash);

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const changed = await resetUserPassword(user._id, hashedPassword);
    if (!changed) {
      return res.status(500).json({ error: "Could not update password" });
    }

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({ error: "Failed to reset password" });
  }
}

