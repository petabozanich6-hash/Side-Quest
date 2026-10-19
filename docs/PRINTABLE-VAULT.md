# Printable Vault — Phase 1 (October 2026)

## Scope and access
- First-party original learning activities, not external worksheet redistribution.
- Paid Family Membership parents can download A4 PDFs, ink-savers and parent keys. The verified platform owner can also download them to review the library without buying a subscription.
- Preview/expired accounts can browse metadata, but not PDF content; child accounts cannot access the parent catalogue.
- Entitlement is verified on EVERY PDF GET using the existing paid-membership signal in getEntitlement. No public static PDFs or bearer tokens in URLs.
- This is separate from the parent-saved external Resource Library. No AI is needed for downloads.
- PDF responses are private/no-store. No migrations.

## Routes
- /parent/printable-vault
- GET /api/printables — metadata and entitlement flag
- GET /api/printables/:id/pdf?variant=colour|ink|guide — printable activity or parent key
- GET /api/printables/bundles/:id/pdf?variant=colour|ink — printable pack

## Individual activities
| ID | Title | Ages | Pack |
|---|---|---|---|
| dragon-hoard | The Dragon Hoard | 8–11 | starter |
| secret-library | A Secret in the Library | 8–12 | starter |
| dragon-flight-lab | Dragon Flight Lab | 8–13 | starter |
| ember-island-map | Map of Ember Island | 8–12 | starter |
| goblin-lockers | The Goblin Lockers | 9–14 | starter |
| rune-gate | The Rune Gate | 12–16 | starter |
| build-a-dragon | Build Your Own Dragon | 6–12 | craft |
| story-quest-cube | Fold a Story Quest Cube | 7–14 | craft |
| treasure-pocket | Make a Treasure Pocket | 6–12 | craft |
| fraction-feast | Dragon's Fraction Feast | 8–12 | quick |
| science-sort | Sort the Scientist's Samples | 7–11 | quick |
| poetry-portal | The Poetry Portal | 10–15 | quick |

## Sample file status
The earlier sample PDF attachments from the design conversation are NOT yet deployed as files to GitHub or R2. The code reproduces the nine original concepts in an on-demand template renderer and adds three more. Do not claim the exact original sample PDFs are live.

## Deliberately deferred
- Assign-to-child button and activity-specific evidence association.
- Downloadable thumbnails, favourites, versioned uploads.
- Australian curriculum outcome code matching (needs verification).
- Uploading the exact binary PDFs and hosting them securely from R2.
These need an integration QA pass; do not add fake buttons.

## Before merge/deploy
1. Typecheck Worker, run unit tests and frontend build.
2. Verify unauthenticated, child, preview, expired and paid access to both single and bundle endpoints.
3. Download every student, ink saver and parent PDF and validate A4 and answer isolation.
4. Physically assemble all paper crafts: validate cut outlines, dashed fold lines, tabs and instructions.
5. Check no questions overlap diagrams or other content, and that writing space is adequate.
6. Test browser preview and saving on mobile PWA, Chrome and Safari.
7. Confirm no public static URL exposes member-only files.
8. No database migration needed.

## Content policy
Activities are first-party. Any external material needs verified reuse rights and correct attribution; no claim of curriculum accreditation. Publish new printables only after subject, safety, licensing and print-layout editorial QA.

## Phase 2 — activity-first collection

The new collection contains **10 original, paper-first designs** instead of question sheets, with multi-page A4 PDF artwork. Each printable is generated only after paid-parent or verified-owner entitlement checks, preserving the existing free-preview lock.

| ID | Format | What is physically on the page |
|---|---|---|
| lost-treasure-maze | maze | 10×10 and 18×18 seeded perfect mazes; answer path in parent solution PDF |
| moving-dragon-puppet | buildable | body/head, wings, tail, two legs; pin joint markers |
| enchanted-castle-colouring | colouring | simple castle scene and detailed seek-and-colour fantasy scene |
| race-to-hoard | board game | 36 playable numbered path squares, four tokens and printable folding die |
| paper-medieval-castle | craft | tabbed four-sided tower net plus gate/wall sections with stand folds |
| design-dragon-egg | craft | three patterned eggs, baby dragon and a glue-tab nest strip |
| forest-detective | cut/match | six animal cards, six footprint cards and three habitat cards |
| potion-spinner | spinner game | ingredient and effect wheels, pointers and invented potion cards |
| illusion-gallery | art puzzle | concentric optical illusion and a cut-out triangle tessellation |
| goblin-workshop-escape | escape game | cut-out Caesar decoder, secret message and picture-count final lock |

Bundles: Mazes and Escape Quests, Cut Build and Make, Colour and Create, Print and Play. Each includes member-only colour and ink-saver variants.

Editorial checks: paper-cut joint fit and spinner assembly need hands-on testing. Detailed vector originals are intentionally simple to print with no graphics hosting or copyrighted material. Printed off-site previews should never bypass membership. No auto-assignment or state-outcome tagging in this phase.
