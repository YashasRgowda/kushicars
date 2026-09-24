/**
 * Short reference codes — KC-7F3K2.
 *
 * Crockford's base32 minus the letters that get misread down a phone line:
 * no I/L/O (1/0) and no U. A code has to survive being read aloud in a noisy
 * forecourt, which rules out a UUID.
 */
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export function makeRef(prefix = 'KC', length = 5): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = '';
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return `${prefix}-${out}`;
}
