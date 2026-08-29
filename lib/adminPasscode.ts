/**
 * Passcode hashing for the advisor dashboard.
 *
 * Uses Web Crypto PBKDF2-SHA256 so it runs identically on the Cloudflare
 * Workers runtime and in Node. The Cloudflare secret WAYLUME_ADMIN_TOKEN
 * always keeps working as a recovery credential; a passcode stored here
 * simply adds a second accepted value that the advisor controls.
 */

const ITERATIONS = 100_000; // Cloudflare Workers caps PBKDF2 at 100k iterations.
const KEY_LENGTH = 32;

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer)).map(byte => byte.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

async function derive(passcode: string, salt: Uint8Array) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(passcode), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as unknown as BufferSource, iterations: ITERATIONS, hash: "SHA-256" },
    key,
    KEY_LENGTH * 8,
  );
  return toHex(bits);
}

export async function hashPasscode(passcode: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(passcode, salt);
  return { hash, salt: toHex(salt.buffer) };
}

export async function verifyPasscode(passcode: string, hash: string, salt: string) {
  try {
    const candidate = await derive(passcode, fromHex(salt));
    if (candidate.length !== hash.length) return false;
    let mismatch = 0;
    for (let i = 0; i < candidate.length; i += 1) mismatch |= candidate.charCodeAt(i) ^ hash.charCodeAt(i);
    return mismatch === 0;
  } catch {
    return false;
  }
}

export function passcodeProblem(passcode: string): string | null {
  if (passcode.length < 12) return "Use at least 12 characters.";
  if (!/[a-zA-Z]/.test(passcode)) return "Include at least one letter.";
  if (!/[0-9\W_]/.test(passcode)) return "Include at least one number or symbol.";
  return null;
}
