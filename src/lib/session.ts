import type { AstroCookies } from 'astro';
import { randomBytes } from 'node:crypto';

const cookieName = 'ralli_csrf';

export function csrf(cookies: AstroCookies): string {
  const existing = cookies.get(cookieName)?.value;
  if (existing) return existing;
  const token = randomBytes(32).toString('hex');
  cookies.set(cookieName, token, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: 12 * 60 * 60,
  });
  return token;
}

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
