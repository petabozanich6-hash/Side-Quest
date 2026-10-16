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


## Additional official SCSA appendix collection (16 October 2026)

Three further **review-only** datasets from the 2026 WACE Manual, Appendix 3:

| Table | File | Source-relationship records |
| --- | --- | ---: |
| Table 13, p.146 — VET industry-specific | `wa-wace-2026-vet-table13-review.json` | 87 (80 distinct identifiers; 10 industries and 44 qualification rows) |
| Table 14, pp.147–148 — Interstate Languages | `wa-wace-2026-interstate-languages-table14-review.json` | 150 (31 language offerings) |
| Table 15, p.148 — Preliminary | `wa-wace-2026-preliminary-table15-review.json` | 48 (8 subjects and 40 units) |

**Accumulated WA review entries: 824 (539 existing + 285 new), BEFORE deduplication and independent record-by-record revalidation.** This is not a count of unique official identifiers and does not represent 824 outcomes.

Source URL: https://www.scsa.wa.edu.au/__data/assets/pdf_file/0018/1232028/_WACE-Manual-2026-April.pdf

### Critical validation notes

- Table 13: SCSA deliberately reuses several `VE...` and `VT...` codes across qualifications with overlapping competency units. Preserve qualification associations, not just a deduplicated code list.
- Table 14: interstate language provider state (NSW/SA/VIC) is the provider for a **WA WACE course offering**. Do not recategorise these records as NSW, SA or VIC syllabus outcomes.
- Table 15: Preliminary `P1...` through `P4...` are unit identifiers and must not enter outcome mastery tracking.
- Manually compare all earlier page 139–145 review batches against PDF page images and official 2026 course-code spreadsheets. Some originally generated course/unit code variants need independent checking; **none of these review files is approved for production use**.
- SCSA maintains downloadable current course and course-unit summaries at https://senior-secondary.scsa.wa.edu.au/syllabus-and-support-materials/course-codes and current VET summaries at https://senior-secondary.scsa.wa.edu.au/syllabus-and-support-materials/vet-industry-specific . These authoritative exports should be preferred for final independent reconciliation.
