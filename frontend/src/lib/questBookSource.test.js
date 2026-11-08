import { compileBookSubsectionSource } from "./questBookSource";

test("short book sources keep all pages and content", () => {
  const pages = [{ page: 4, text: "Short example." }, { page: 5, text: "Another example." }];
  const result = compileBookSubsectionSource(pages);
  expect(result.abbreviated).toBe(false);
  expect(result.text).toContain("Short example.");
  expect(result.text).toContain("Another example.");
  expect(result.text).toContain("[PDF page 4]");
  expect(result.text).toContain("[PDF page 5]");
});

test("long subsections draw from all source pages rather than generating one lesson per page", () => {
  const pages = Array.from({ length: 12 }, (_, i) => ({ page: i + 10, text: `Opening ${i} ` + "practise ".repeat(500) + `Ending ${i}` }));
  const result = compileBookSubsectionSource(pages);
  expect(result.abbreviated).toBe(true);
  expect(result.text.length).toBeLessThanOrEqual(7900);
  for (let i = 0; i < 12; i++) {
    expect(result.text).toContain(`[PDF page ${i + 10}]`);
    expect(result.text).toContain(`Opening ${i}`);
    expect(result.text).toContain(`Ending ${i}`);
  }
  expect(result.originalChars).toBeGreaterThan(result.text.length);
});

test("rejects missing or out-of-order PDF pages", () => {
  expect(() => compileBookSubsectionSource([{ page: 1, text: "a" }, { page: 3, text: "b" }])).toThrow(/consecutive/);
});
