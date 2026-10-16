# WA WACE 2026 course-code collection — review manifest (16 October 2026)

Source: [SCSA WACE Manual April 2026, Appendix 3, Table 12, printed pp. 139–145](https://www.scsa.wa.edu.au/__data/assets/pdf_file/0018/1232028/_WACE-Manual-2026-April.pdf).

**Purpose:** raw source-backed codes for later integration by Claude. These are **subject, course and unit codes**, NOT curriculum learning outcome identifiers. Keep outside mastery/outcome tables.

## Files in this collection
- `wa-wace-2026-manual-page139-review.json` — 84 records
- `wa-wace-2026-manual-page140-review.json` — 65 records
- `wa-wace-2026-manual-page141-review.json` — 98 records
- `wa-wace-2026-manual-page142-review.json` — 89 records
- `wa-wace-2026-manual-page143-review.json` — 83 records
- `wa-wace-2026-manual-page144-review.json` — 91 records
- `wa-wace-2026-manual-page144-punjabi-review.json` — 10 records
- `wa-wace-2026-manual-page145-review.json` — 19 records

**Total: 539 source-record entries before deduplication**. This is not a count of learning outcomes or necessarily unique codes. Source review required before production use.

### Review flags
- The printed manual has `ALPBL` (rather than an intuitively expected `A1PBL`) for Punjabi Background Language. Do not silently rewrite.
- The printed manual has `ATPML` as Tamil Second Language examinable course while its Year 11 code is `AETML`. Do not silently rewrite.
- Some Design/Materials Design courses use pathway-specific four- or five-character subject stems; do not infer codes from a universal template.
- Page-specific files should be compared against the authority table, deduplicated and checked for genuine version/year applicability.
- The manual's final table includes only ATAR, General and Foundation courses; **does not establish completeness for VET industry-specific courses, Preliminary units, endorsed programs, WA K–10, or individual learning outcomes**.

## Next extraction targets
1. WACE 2026 VET industry-specific course codes and Preliminary units from official SCSA sources.
2. WACE course syllabus-specific outcome or unit learning outcome identifiers, where officially assigned.
3. SCSA K–10 downloadable curriculum content codes and all language/elective pathways, with version provenance.
4. Independent machine audit: compare page images to records, validate duplicate/code-kind rules, then integrate alongside jurisdiction catalogues.

**Safety:** Do not merge or deploy this review data without verification, especially while PR #158 is still draft.
