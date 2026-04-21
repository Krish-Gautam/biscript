import crypto from "crypto";

const ACCESS_TOKEN_TTL_SECONDS = Number(process.env.ACCESS_TOKEN_TTL_SECONDS || 15 * 60);
const REFRESH_TOKEN_TTL_SECONDS = Number(process.env.REFRESH_TOKEN_TTL_SECONDS || 7 * 24 * 60 * 60);
const JWT_SECRET = process.env.JWT_SECRET || "dev-only-change-me";

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(input) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(normalized + padding, "base64").toString("utf8");
}

function signSegment(segment) {
  return crypto
    .createHmac("sha256", JWT_SECRET)
    .update(segment)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function signToken(payload, expiresInSeconds = ACCESS_TOKEN_TTL_SECONDS) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const body = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedBody = base64UrlEncode(JSON.stringify(body));
  const data = `${encodedHeader}.${encodedBody}`;
  const signature = signSegment(data);

  return `${data}.${signature}`;
}

export function verifyToken(token) {
  try {
    if (!token || typeof token !== "string") {
      return null;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const [encodedHeader, encodedBody, receivedSignature] = parts;
    const data = `${encodedHeader}.${encodedBody}`;
    const expectedSignature = signSegment(data);

    const received = Buffer.from(receivedSignature);
    const expected = Buffer.from(expectedSignature);

    if (received.length !== expected.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(received, expected)) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(encodedBody));
    const now = Math.floor(Date.now() / 1000);

    if (!payload.exp || payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function signAccessToken(user) {
  return signToken(
    {
      type: "access",
      userId: user.userId,
      email: user.email,
      role: user.role,
    },
    ACCESS_TOKEN_TTL_SECONDS
  );
}

export function signRefreshToken(user) {
  return signToken(
    {
      type: "refresh",
      userId: user.userId,
      email: user.email,
      role: user.role,
    },
    REFRESH_TOKEN_TTL_SECONDS
  );
}
