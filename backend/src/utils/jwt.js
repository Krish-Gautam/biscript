import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const REFRESH_SECRET =
  process.env.REFRESH_SECRET || "your-refresh-secret-change-in-production";
const TOKEN_EXPIRY = "7d";
const REFRESH_EXPIRY = "30d";

export function generateToken(userId, email, role = "member") {
  return jwt.sign({ userId, email, role }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}

export function generateRefreshToken(userId) {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
}

export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};