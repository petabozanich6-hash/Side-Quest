import { DRAGON_BOOKS, dragonBookLinks } from "./dragonLibrary";
test("book recommendations have unique titles and safe directory destinations", () => {
  expect(DRAGON_BOOKS.length).toBeGreaterThanOrEqual(200);
  // Append-only titles keep stable book IDs and reading-log references from the first release.
  expect(DRAGON_BOOKS[0].title).toBe("Let\x27s Go Looking");
  const byBand = Object.fromEntries(["early","primary","middle","teen"].map(band => [band, DRAGON_BOOKS.filter(book => book.band === band).length]));
  for (const count of Object.values(byBand)) expect(count).toBeGreaterThanOrEqual(30);
  const titles = DRAGON_BOOKS.map(b => b.title.toLowerCase());
  expect(new Set(titles).size).toBe(titles.length);
  for (const book of DRAGON_BOOKS) {
    expect(book.title).toBeTruthy();
    expect(book.note).toBeTruthy();
    expect(["early","primary","middle","teen"]).toContain(book.band);
    const links = dragonBookLinks(book);
    expect(new URL(links.trove).hostname).toBe("trove.nla.gov.au");
    expect(new URL(links.secondhand).hostname).toBe("www.ebay.com.au");
    if (links.free) expect(["bookdash.org","www.gutenberg.org"]).toContain(new URL(links.free).hostname);
    if (book.access === "bookdash") {
      expect(links.free).toMatch(/^https:\/\/bookdash\.org\/books\/[a-z0-9-]+\/$/);
      expect(links.free).not.toContain("undefined");
    }
    if (book.access === "borrow") expect(links.free).toBeNull();
  }
});

test("newer recommendations stay link-only with no claimed free downloads", () => {
  const expansion = DRAGON_BOOKS.slice(90);
  expect(expansion.length).toBeGreaterThanOrEqual(110);
  for (const book of expansion) {
    expect(book.access).toBe("borrow");
    expect(dragonBookLinks(book).free).toBeNull();
    expect(book.note.length).toBeGreaterThan(20);
  }
});
