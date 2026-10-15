/**
 * ACARA v9 codes contain a level immediately before the final strand/description suffix.
 * Some subjects contain internal digits (for example Auslan first/second-language pathways:
 * AC9L1AU8EC01, AC9L2AU4C01). Never interpret the first digit as the year.
 */
export function ac9Level(code) {
  if (typeof code !== "string" || !/^(?:AC9|ACL9)[A-Z0-9]+$/.test(code)) return null;
  const match = code.match(/(F|10|[1-9])(?=[A-Z]{0,4}\d{2,3}$)/);
  return match ? match[1] === "F" ? 0 : Number(match[1]) : null;
}
