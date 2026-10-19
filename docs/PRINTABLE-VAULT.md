# Printable Vault — image-first overhaul

## Authoring and quality target
Side-Quest is selling access to high-quality, first-party printable **activities**, not plain question sheets. The quality reference is the illustrated Preview Collection shown to the owner in ChatGPT. This change is a **technical and vector-template overhaul**; it does not embed the exact generated preview images. Review the real printable artwork before releasing to members.

Every image is scalable SVG with A4 dimensions (210 × 297 mm), so it can be printed or converted into a PDF from the browser's Print / Save as PDF action. All SVG source is authored on the server, with no remote scripts or assets. No AI is used on download. White/ink-saving mode, parent guide mode, and ordinary artwork mode are available.

## New catalogue
The previous 12-item collection and its question-sheet PDF endpoints have been retired. The current catalogue contains **20 originals**: ten general activity sheets (maze, puppet, colouring, games, castles, dragon eggs, creature matching, potion spinner, optical illusions, goblin escape game), and ten Halloween activity sheets (haunted maze, spiderweb maze pack, bat puppet, pumpkin faces, paper haunted house, trick-or-treat board game, monster match, potion spinner, colouring, escape pumpkin patch).

## Access
- GET /api/printables lists metadata only and returns an unlocked flag.
- GET /api/printables/:id/image?page=0&variant=colour|ink|guide returns server-rendered protected SVG for a particular page.
- The parent role and an **effective paid plan or verified platform owner role** are checked on each image GET. Ordinary preview and expired families cannot fetch bytes, not even directly by URL. Child accounts cannot view parent guides.
- Cache-Control private, no-store; Content-Type image/svg+xml; Content-Security-Policy default-src none (inline style for original artwork).
- No public /assets PDF or SVG copies.
- No database migration, Stripe change or per-image AI charge.

## Parent interface
- Real member-only illustration thumbnails lazily loaded through authenticated API requests.
- Search, filters for colouring, crafts, mazes, puzzles and games; Halloween bundled separately.
- **View:** inspect the actual SVG pages.
- **Images:** save the underlying A4 SVG pages for reuse.
- **Print / PDF:** opens an A4 print layout; standard browser Print dialog can save as PDF.
- **Ink-saving:** same artwork on white stock with minimal fills.
- **Parent guide:** separate instructive image, not baked into the child's activity page.

## Release requirements
1. Automated Worker test, TypeScript check, frontend build and regression suites pass.
2. View each of the 20 images at full A4, zoom in and print; ensure cut/fold lines and reading order are usable.
3. **Physically assemble** all foldable crafts, dice and split-pin activities, testing both Chrome and Safari printing.
4. Editorial illustration review against the reference previews before commercial release; if images don't meet the standard, keep this pull request unmerged and upgrade the art first.
5. Inspect game mechanics and parent keys, particularly every maze solution, spinner and cipher.
6. Check paid, owner, preview, expired, child and unauthenticated access. Verify old PDFs return 404.
7. Production deploy only after explicit artwork sign-off.
