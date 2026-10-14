# Verified curriculum catalogues — foundation and release gate

**Status: foundation only; no new outcomes are published by this change.** Side-Quest supports state selection for all eight Australian jurisdictions, but that is not equivalent to complete, verified curriculum data for every jurisdiction.

## Reviewed source/licence policy (15 October 2026)
- **ACARA Australian Curriculum v9**: core curriculum website material is generally **CC BY 4.0**, including commercial reuse **with required attribution**. The licence excludes logos, website design, third-party material and certain supporting resources. Official terms: https://www.australiancurriculum.edu.au/copyright-and-terms-of-use/
- **NESA NSW syllabuses**: specific limited non-commercial educational permissions exist for registered home-schooling parents, **not automatically for a commercial curriculum publisher**. Seek NESA copyright permission before republishing syllabus text at scale. https://www.nsw.gov.au/education-and-training/nesa/copyright
- **VCAA Victorian Curriculum F–10**: published text is generally **CC BY-NC**. Commercial use requires separate permission; v2.0 has phased/subject-dependent implementation. https://f10.vcaa.vic.edu.au/copyright-statement
- **WA SCSA**: confirm current curriculum and applicable commercial reuse terms directly; no licence clearance is claimed here. https://k10outline.scsa.wa.edu.au/

## Existing repository work
- NSW seed: `worker/src/data/nsw-outcomes.ts`; **presence does not establish a licensing clearance or a complete official catalogue**.
- ACARA v9 importer: `worker/scripts/import-ac9.mjs`; generated `worker/src/data/ac9-outcomes.ts` exists on branch `data/ac9-import`, **not on main**. It includes content descriptions for selected learning areas and excludes Languages. Its generated records require verification of completeness, year bands and provenance before release.
- Existing outcome tracker PR #139 is NSW-scoped. Competing PR #138 defines a different `outcome_progress` schema at migration 0057. **Do not merge both without reconciliation.**

## Architecture contract
`worker/src/data/cataloguePolicy.ts` specifies jurisdiction → official framework, permitted record types, source version, licence clearance, and catalogue status. A national ACARA content description must never be relabelled as a NSW syllabus outcome or a Victorian achievement standard. The interface is **not** connected to live routes by this PR.

Publishing a catalogue requires all of:
1. Verified publisher/version and official source URL for every record.
2. A reviewed, applicable licence or written commercial permission and compliant attribution.
3. Completeness/coverage report by year, subject, strand and record type; no claim of full national coverage unless demonstrated.
4. Source-specific record codes, wording and year/stage mappings validated, duplicates rejected.
5. Independent review and automated tests before changing status to `verified`.
6. Outcome tracker, plans, lesson builder and Auto-Quest consume one shared catalogue with correct type labels.
7. Missing jurisdictional content is honestly labelled unavailable, never replaced silently by invented or incompatible codes.
8. Existing parent evidence/history persists through version changes and changes of state.

## Next implementation PRs
1. Reconcile #139 and #138, incorporate QLD E2E fix PR #140, and stabilise one outcome tracker.
2. Audit the generated ACARA MRAC import, expand to achievement standards only if sourced and verified, report missing Languages and subject coverage; provide full CC BY attribution and disclaimer.
3. Obtain NESA/VCAA/SCSA reuse clearance before commercial replication of their protected materials. If unavailable, use official links and lawful factual identifiers without bulk protected wording, pending legal review.
4. Wire verified catalogues into jurisdiction-specific tracking, planning, lesson generation and auto-assignment with per-framework validation, versioning and regression tests.

No live database migration, deployment or production settings are changed in this PR.
