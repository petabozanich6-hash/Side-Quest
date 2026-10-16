// A one-way fingerprint of a piece of text, so Side-Quest can recognise official syllabus wording that older records
// still hold without storing that wording itself. Text is normalised first (lower case, letters and digits only).
export const squashWording = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** cyrb53: a fast 53-bit string hash, written as base-36. Not for security, only for recognising text. */
export function wordingFingerprint(text: string): string {
  const s = squashWording(text);
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < s.length; i++) {
    const ch = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
