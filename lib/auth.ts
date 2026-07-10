import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function sign(value: string) {
  const key = await getSecretKey();
  const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Buffer.from(sigBuffer).toString("hex");
}

export async function createSession() {
  const value = "admin";
  const sig = await sign(value);
  const store = await cookies();
  store.set(COOKIE_NAME, `${value}.${sig}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function isAuthenticated(request?: Request) {
  const raw = request
    ? request.headers.get("cookie")?.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))?.[1]
    : (await cookies()).get(COOKIE_NAME)?.value;

  if (!raw) return false;

  const [value, sig] = raw.split(".");
  if (!value || !sig) return false;

  const expected = await sign(value);

  // constant-time compare without Node's timingSafeEqual
  if (sig.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < sig.length; i++) {
    mismatch |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}