import { argon2id } from "@noble/hashes/argon2";
import { utf8ToBytes } from "@noble/hashes/utils";

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function bytesToB64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export async function derivePwdHash(password: string, saltB64: string) {
  const salt = b64ToBytes(saltB64); // ← decode, not encode
  const hash = argon2id(utf8ToBytes(password), salt, {
    t: 2,
    m: 32 * 1024,
    p: 1,
    dkLen: 32, // make explicit
  });
  return bytesToB64(hash); // return base64
}
