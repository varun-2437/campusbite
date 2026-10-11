/**
 * Client-Side Cryptographic Utilities for CampusBite
 * Implements salted SHA-256 hashing via Web Crypto API for secure password
 * storage and verification in client-side persistence and offline mode.
 */

export async function hashPassword(password, salt) {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateSalt() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyPassword(inputPassword, salt, storedHash) {
  const inputHash = await hashPassword(inputPassword, salt);
  return inputHash === storedHash;
}
