// logic JWT

import { SignJWT, jwtVerify } from "jose";

const TOKEN_EXPIRES_IN = "1d";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET phải có ít nhất 32 ký tự.");
  }

  return new TextEncoder().encode(secret);
}

export type AuthPayload = {
  userId: string;
  email?: string;
};

// Tạo JWT sau khi đăng nhập thành công.
export async function createAuthToken(
  payload: AuthPayload
): Promise<string> {
  return new SignJWT({
    email: payload.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRES_IN)
    .sign(getJwtSecret());
}

// Xác minh tính hợp lệ của token
export async function verifyAuthToken(
  token: string
): Promise<AuthPayload> {
  const { payload } = await jwtVerify(
    token,
    getJwtSecret(),
    { algorithms: ["HS256"] }
  );

  if (
    typeof payload.sub !== "string" ||
    payload.sub.length === 0
  ) {
    throw new Error("JWT không chứa userId hợp lệ.");
  }

  return {
    userId: payload.sub,
    email:
      typeof payload.email === "string"
        ? payload.email
        : undefined,
  };
}

// Dùng trong API Route để lấy userId từ cookie.
export async function getUserIdFromToken(
  token?: string
): Promise<string> {
  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  try {
    const payload = await verifyAuthToken(token);
    return payload.userId;
  } catch {
    throw new Error("UNAUTHORIZED");
  }
}
