# The Dragon's Library — first release

This is a curated **external-link directory**, not an ebook library. It does not host book text, cover images, prices, personal library-card details, or scraped publisher descriptions.

## User experience

- Parent Hub: **Dragon's Library** in the sidebar.
- Child Hub: **Library** beside My reading.
- Shared catalogue search with reading stage, genre, subjects and access filters.
- Legitimate external routes: Trove Australian library discovery; Libby and BorrowBox service homepages (library-dependent); direct Book Dash book pages; Project Gutenberg title search (country copyright rules differ); eBay AU second-hand search (parents only).
- **Log this book after reading** prefills existing reading-log forms and does **not** record work automatically. Parent approvals and child submissions remain unchanged.
- No database migration, third-party API key, external tracking pixel, AI request or new server endpoint.

## Editorial and legal safety

- Only book title, author/creator credit and our original synopsis are stored. No cover art or excerpts.
- Book Dash's own website offers the listed books freely. Other availability is never promised.
- Search links are constructed from fixed, known HTTPS provider domains, not user-controlled URLs.
- Titles and reading bands are editorial suggestions, not a suitability guarantee. Parent discretion applies, especially for teen titles.
- Project Gutenberg's US public-domain status is not an automatic statement of Australian or international rights.
- Correct mistakes or remove books by changing \`frontend/src/data/dragonLibrary.js\`. Before adding a title, verify the title and author against legitimate publishing/catalogue information and review links.

## Next enhancement (not in this release)

Owner HQ catalogue editing and durable family wishlists should be added only with D1-backed server access controls and migration/backup review. Do not put a cross-family reading list in localStorage or repurpose the completed-reading log to hold wishlists.
