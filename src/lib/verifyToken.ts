// lib/verifyToken.ts
import jwt from "jsonwebtoken";

export function verifyToken(token: string): string | null {
  if (!process.env.JWT_SECRET) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // @ts-ignore — we know it's safe
    return (decoded as any)?.userId || null;
  } catch {
    return null;
  }
}
