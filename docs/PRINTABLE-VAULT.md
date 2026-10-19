# Side-Quest premium printable artwork — owner import

## What is deployed
The Printable Vault is switched to **actual raster illustrations**, using the ten black-and-white Side-Quest-branded activity pages approved by the founder. Code-drawn SVGs and question-style worksheet content are not served as fallbacks.

All source artwork is kept out of the PUBLIC GitHub repository. Only canonical slugs, page metadata and secure backend code are in the repository.

### How the artwork is brought into Side-Quest
1. Download `SideQuest_Premium_Printables_Batch_01.zip` from the accompanying ChatGPT deliverable. It contains 10 print masters plus 10 ink-saving PNGs, each 2480 × 3508 pixels on an A4-proportioned canvas, manifest and README.
2. Sign in as the **verified platform owner**, open `/parent/printable-vault`, and use **Owner HQ · Premium artwork importer**.
3. Choose the ZIP **directly**, no extraction necessary. The frontend reads the ZIP locally and sends all 20 PNGs to authenticated, owner-only `POST /api/printables/admin/assets/:id?variant=colour|ink` endpoints.
4. The Worker checks valid known IDs, A4 dimensions, PNG signature, byte length, and owner role, then stores original image bytes privately in Cloudflare R2 (`BUCKET`, `sidequest-files`), prefix `printable-vault/illustrated-v1/`.
5. Reload the page to inspect the imported cards, open previews, and print to A4 or save as PDF via browser print.
6. Uploaded colour and optional ink-saving artwork appears automatically for active Family Memberships. The importer and asset replacement endpoints remain verified-owner-only. Activities not yet uploaded stay unavailable.

If the upload stops part-way through, selecting the ZIP again safely replaces already uploaded objects and finishes the rest. Unrecognised PNG names are rejected.

### Deployed collection (10)
- lost-treasure-maze
- moving-dragon-puppet
- enchanted-castle-colouring
- race-to-hoard
- paper-medieval-castle
- haunted-castle-maze
- build-a-bat-puppet
- pumpkin-face-creator
- trick-or-treat-board-game
- halloween-colouring-adventure

Other planned activities and Halloween crafts do **not** show the old SVG art while their premium illustration files are outstanding.

## Privacy and security
- Public GitHub repo carries NO original PNGs; originals are held in private R2.
- Child and unauthenticated accounts cannot access previews/answers.
- Only verified owner accounts and families with an effective paid membership (including eligible billing grace periods) can fetch printable image bytes. Free-preview, expired and unauthenticated accounts cannot.
- Only the verified platform owner can upload or replace artwork. Paying families have no upload permission.
- No presigned R2 URLs or CDN public object keys are sent to the browser. PNG bytes stream through authenticated Worker GETs with `private, no-store`.
- No database migration; existing R2 BUCKET binding works.

## Release QA
- The previous owner-only review gate has been lifted at the owner's direction. New artwork uploads are shown to paid members immediately, so check each page before importing. Mechanical activity correctness has **not** been proved: a visually attractive AI-drawn maze may be blocked; board games may contain misnumbered squares and model parts may not fit when assembled. Those need individual remediation before the owner disables the review-only release gate.
- Browser A4 printing should maintain proportions. The PNG canvas is 2480×3508; the original source was lower resolution, so resampling does not invent 300-dpi illustration detail.
- Before publication, test A4 print margins on home printers and assemble paper parts, using adult supervision for scissors/split pins.
