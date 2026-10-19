# Side-Quest Printable Vault — expanding private artwork collection

## Owner upload
The verified platform owner can add unlimited new portrait PNG activities using the **Owner HQ · Printable Vault artwork importer** on `/parent/printable-vault`. New filenames create new printable cards automatically. No code change or D1 migration is required after deployment.

- Use individual PNG images or an **uncompressed** ZIP containing PNGs. For compressed ZIPs, extract the PNGs locally before selecting them in the importer.
- Use distinct, descriptive filenames such as `solar-system-planet-quest.png` or `butterfly-lifecycle.png`. Filenames are converted to readable titles; the category picker sets new card categories.
- PNGs must be portrait pages, at least 768 × 1000 pixels, within 7 MB per image. Print mode fits each image onto A4 paper.
- Existing names are protected by default: imports stop with a clear conflict error instead of silently overwriting earlier artwork. Tick **Replace existing artwork** to deliberately replace them or resume an interrupted import. Optional `-ink.png` files attach ink-saving variants.
- The browser verifies server acknowledgement and rereads the Vault catalogue before reporting successful addition; thumbnails refresh immediately.

## Storage and subscriptions
The original 10 approved catalogue records remain; new records are discovered by listing private Cloudflare R2 objects under `printable-vault/illustrated-v1/`. Owner upload adds title/category/format metadata to each R2 object, so the gallery does not depend on a static ID list. Pre-existing objects without metadata retain their approved descriptions. The gallery reads from the same private bucket `BUCKET` / `sidequest-files`.

**Only verified owner accounts can import or replace artwork.** Only the owner and families with an effective paid Family Membership can fetch or print actual image bytes. Unpaid accounts may browse limited catalogue descriptions but cannot download, view or print the images. Content is not placed in the public GitHub repo.

The backend confirms R2 writes with an object existence check. It never claims a successful import simply because a browser upload request finished. A user-facing error explains duplicate filenames, invalid image dimensions, missing storage or authorization failures.

## QA
Tests cover old and newly named images, owner restrictions, free/expired membership restrictions and immediate paid access. For a complete release, check a fresh browser import and A4 print in production after Cloudflare deploy.