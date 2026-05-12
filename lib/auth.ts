import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET || "fallback_secret_for_dev_only";
const key = new TextEncoder().encode(secretKey);

export const TOKEN_NAME = "admin_token";

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(username: string) {
  const token = await encrypt({ username });

  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;
  try {
    return await decrypt(token);
  } catch (error) {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const token = request.cookies.get(TOKEN_NAME)?.value;
  if (!token) return;

  // Refresh the expiration so the user stays logged in if they are active
  const parsed = await decrypt(token);
  parsed.expires = new Date(Date.now() + 60 * 60 * 24 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: TOKEN_NAME,
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
