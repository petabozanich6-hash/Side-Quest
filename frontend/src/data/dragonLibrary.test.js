import { DRAGON_BOOKS, dragonBookLinks } from "./dragonLibrary";
test("book recommendations have unique titles and safe directory destinations", () => {
  expect(DRAGON_BOOKS.length).toBeGreaterThanOrEqual(80);
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
