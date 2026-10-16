# Nationwide curriculum identifier coverage — verified source audit (16 October 2026)

## Interrupted Work-mode verification checkpoint — reconciliation pending (16 October 2026)

The interrupted Work-mode session reported **1,664 structured NSW records** and **1,038 Victorian outcome references** each matched to their recorded source locations. It clarified that Victoria had **92 distinct source documents**, not 95 (the latter counted repeated/shared document links). **These figures are a handoff checkpoint, not yet independently reproduced by the committed verification artifacts**; they must not silently supersede the older numbers elsewhere in this document or be described as a complete curriculum import.

| Control | Handoff checkpoint | Last identified committed control | Required reconciliation |
|---|---:|---:|---|
| NSW source-verified structured records | 1,664 | `curriculum-audits/nesa-card-verification.json`: 1,435/1,435 matched on 81 pages | Identify the 229 additional source/record pairs; compare page URLs, exact IDs, editions and overlapping subject-specific review files. Report duplicates and future-only records separately. |
| Victorian outcome references | 1,038 | Earlier VC2, VC1 EAL and transitional Languages collections use different identifier kinds and counts | Locate the exact 1,038-record reference manifest; distinguish document references from unique identifiers and from VC2/VC1 catalogue totals. |
| Victorian unique source documents | 92 | Historical checkpoint: 95 links | Deduplicate canonical document URLs and SHA/source identities; preserve references to shared documents without counting each link as a new document. |

Outstanding follow-up from the interrupted session:
- **VIC English / EAL:** extract identifiers and edition/pathway mappings presented in tables, not only linear paragraph text; record table coordinates/page provenance. Do not classify ordinary English and EAL as interchangeable.
- **VIC Drama / Theatre Studies:** official downloadable source links were broken; retain original URLs and failure responses, seek current official replacement/archived edition references, and mark unresolved records as pending instead of inventing codes.
- **NSW unresolved references:** reconcile unmatched or inaccessible official syllabus pages against the latest official syllabus inventory; account for stage gaps, senior elective/Life Skills pages, version changes and duplicate source/code pairs.
- Re-run verification using **committed, reproducible manifests** before changing the headline counts or claiming the audit is complete. Track `source_url`, `source_edition`, `identifier_kind`, exact `identifier`, verification method/date, status, and source-document identity.
- Keep all newly collected or uncertain records **review-only**: do not regenerate runtime catalogues, merge/deploy this PR, alter historic child evidence or present national coverage as complete.


**Status: inventory and implementation design; NOT a completed dataset.** Do not describe Side-Quest as having all codes until automated coverage checks pass. This audit intentionally does not invent identifiers.

## Latest executed collection and verification (16 October 2026)

**This section supersedes the historical progress figures below. All eight jurisdictions remain INCOMPLETE.** This is a review-only collection commit; runtime catalogues and integrations were not regenerated. No merge or deployment was performed. Unknown denominators are not percentages of completeness.

All 11 existing bulk jobs were executed. See `curriculum-audits/national-collection-report.json` for the initial run and `collection-followup-report.json` for fixes, retries and validation. The initial ACT Python lacked pdfplumber; the retry used the bundled Python runtime. The orchestrator now accepts `CURRICULUM_PYTHON` and allows ten minutes per importer instead of killing a sequential source collection after two minutes.

| Jurisdiction | Evidence retained / collected | Remaining completeness gaps |
|---|---|---|
| NSW | **1,435 source-page/code records, 1,430 distinct code strings**, from 81/90 modern outcome pages. Added 568 source/code pairs and removed 18 adjustment notices from the outcome collection (net +550). All 1,435 match independently fetched rendered NESA outcome-card IDs; URLs and response hashes retained. | Nine CEC routes return 404; 37 syllabus versions lack expected stages; legacy syllabuses, editions, senior and VET inventories unresolved. Distinct code strings are not edition-scoped identities. |
| VIC | Existing 2,927 VC2 codes classified across 53 official routes; rerun reached all 53 routes. EAL rerun confirms 796 identifiers; transitional Languages rerun confirms 1,249 candidates from 13/14 routes. | Level-page retry reached 13/15 pages, with Year 7 and Foundation timing out; prior 15-page dataset preserved. Classical-language framework route is 404; senior VCE/VM/VET and version applicability unresolved. |
| QLD | Existing 78 A–Z syllabus-title records plus 18 SEE/short-course inventory records retained, with overlap possible. | Direct QCAA bulk index returns 403; individual syllabus objectives/outcomes, editions and VET still require collection. Titles are not outcome identifiers. |
| WA | All 26 existing WA source inventories and partial review datasets are now included in the audit, including WACE and ABLEWA. Science and Digital Technologies ABLEWA parser patterns repaired. | All 19 official JSON downloads returned 403. Existing partial observations remain review-only; no fabricated or empty replacement catalogue. WACE course/unit tables do not establish outcome coverage. |
| SA | SACE rerun: 427 distinct subject/credit codes from 91/91 tables, including 62 Modified Subject variants. | Outcome/performance-standard identifiers, VET, external courses and state applicability remain unresolved. |
| TAS | TASC rerun: 164/164 declared 2026 accredited course identifiers, no extraction errors. | Course outcomes/criteria, VET and specialist pathways are not covered by a course-list count. |
| ACT | Newly saved **113 course names/classifications**, all rendered table cells parsed from official register version 20.02.2026. A=91, T=83, M=84, H=10 match the overview. | Table V classifications total **29**, but overview states **28** VET-integrated courses. Retain both counts; control check fails and completeness stays false. No numeric outcome codes invented; R units, external VET and course outcomes remain outside this extraction. |
| NT | Shared SACE rerun confirms 427 subject/credit codes; counted once in source data. | NTCET-specific arrangements, local pathways, outcomes, VET/external courses and F–10 adoption require reconciliation. |

Shared ACARA rerun recovered 2,678 content-description identifiers across all eight learning areas, including 1,283 Languages. This validates the shared source release, not eight complete state catalogues. The regenerated runtime file differed only in its download date and was not committed.

Verification: **225/225 JavaScript tests**, **6/6 ACT Python parser tests**, and worker TypeScript checking passed. Separate live verification matched **1,435/1,435 NSW records** to exact rendered card attributes on 81 official pages. Tests validate extraction and application regressions, not national curriculum completeness.

Sources and machine-readable evidence:
- NSW per-record official URLs and syllabus editions: `worker/src/data/nesa-review-import.json`; independent response hashes: `curriculum-audits/nesa-card-verification.json`.
- ACT official PDF URL, SHA-256, page numbers, register edition and discrepant controls: `worker/src/data/act-bsss-2026-courses-review.json`.
- Every available jurisdiction dataset, including previously omitted review files: `curriculum-audits/national-data-audit.json`. Within-file counts must not be summed across files or identifier kinds.
- WA acquisition failures: `curriculum-audits/wa-acquisition-report.json`; Victorian level retry: `curriculum-audits/vic-level-retry.json`.

The 18 excluded `-ADJ-` identifiers remain listed in `collection-followup-report.json` as adjustment notices. Historical child evidence and active outcome catalogues were not rewritten.

### Follow-up collected: VCE English/EAL table outcomes (16 October 2026)

Captured **16 source-linked unit-outcome references** in `worker/src/data/vic-vce-english-eal-unit-outcomes-review.json`: Units 1–4, Outcomes 1–2, separately for English and EAL (8 per pathway). The current official VCAA planning page presents these as side-by-side outcome-statement tables: https://www.vcaa.vic.edu.au/curriculum/vce-curriculum/vce-study-designs/english-and-english-additional-language/planning . Units 1–2 apply from 2023, Units 3–4 from 2024. These are **unit/outcome references**, not invented globally unique alphanumeric identifiers. The source's pathway-specific statements are not conflated. No runtime changes, no merge, no national completeness claim. This does **not** resolve the separate 1,038-reference / 92-document verification checkpoint until its manifest is located.

### Follow-up collected: VCE Drama and Theatre Studies (16 October 2026)

Stored **14 individually observed VCE unit/outcome headings**, comprising 10 Drama and 4 Theatre Studies references, in `worker/src/data/vic-vce-drama-theatre-verified-unit-outcome-review.json`. Source: VCAA official 2025-accredited teaching-and-learning pages https://vcaa.vic.edu.au/curriculum/vce-curriculum/vce-study-designs/drama/teaching-and-learning and https://www.vcaa.vic.edu.au/curriculum/vce-curriculum/vce-study-designs/teaching-and-learning-0 . This is a **verified subset**, not all outcomes for either study. VCAA unit/outcome ordinal references are not invented official alphanumeric codes. Original failed download links still require separate resolution. No runtime data changed.

### Follow-up collected: VCE science outcome references (16 October 2026)

Added **17 individually checked unit/outcome references** to `worker/src/data/vic-vce-sciences-unit-outcomes-review.json` — Biology 6, Chemistry 8, Psychology 3. These are **selected verified headings only**, not the full set of outcomes for the subjects, and not alphanumeric curriculum codes. Official pages: https://vcaa.vic.edu.au/curriculum/vce-curriculum/vce-study-designs/biology/teaching-and-learning ; https://www.vcaa.vic.edu.au/curriculum/vce-curriculum/vce-study-designs/chemistry/teaching-and-learning ; https://vcaa.vic.edu.au/curriculum/vce-curriculum/vce-study-designs/psychology/teaching-and-learning . Keep review-only and do not count toward a completed national syllabus inventory.

### Follow-up collected: NSW 2025 Drama and Music Life Skills official outcomes (16 October 2026)

Verified and retained **20 literal NESA syllabus outcome IDs**: **12 Drama Life Skills 11–12** (`worker/src/data/nsw-drama-life-skills-2025-official-outcomes-review.json`) and **8 Music Life Skills 11–12** (`worker/src/data/nsw-music-life-skills-2025-official-outcomes-review.json`). Full outcome identifier lists on the two specified official source pages were checked: https://curriculum.nsw.edu.au/learning-areas/creative-arts/drama-life-skills-11-12-2025/outcomes and https://curriculum.nsw.edu.au/learning-areas/creative-arts/music-life-skills-11-12-2025/outcomes . Both 2025 syllabus editions begin staged implementation **in 2027**, so they are not automatically active in 2026. Their codes may already occur in the broader NESA import; **do not add 20 to unique NSW code totals without edition/source-pair deduplication**. These are real official alphanumeric outcome identifiers, unlike VCE ordinal outcome references. No runtime modification.

### Follow-up collected: NSW Dance Life Skills and Music 2 (16 October 2026)

Retained **25 source-checked NSW 2025 syllabus outcome code records** in two separate review-only datasets:

- `worker/src/data/nsw-dance-life-skills-2025-official-outcomes-review.json`: **13** Dance Life Skills 11–12 literal codes, official source https://curriculum.nsw.edu.au/learning-areas/creative-arts/dance-life-skills-11-12-2025/outcomes .
- `worker/src/data/nsw-music-2-2025-official-outcomes-review.json`: **12** Music 2 11–12 literal codes (6 Year 11 + 6 Year 12), official source https://curriculum.nsw.edu.au/learning-areas/creative-arts/music-2-11-12-2025/outcomes .

Both syllabuses first implement in 2027 (Music 2 first new-syllabus HSC examination 2028). These files are verifiable **page-level lists**; they are **not necessarily 25 novel identifiers** relative to `nesa-review-import.json`. Compare exact code, source URL and syllabus edition before updating the NSW distinct-ID count. Do not publish these future-only identifiers into current 2026 mappings, rewrite past evidence, or merge/deploy.

## Historical progress notes (superseded where the latest run differs)

## Verified senior curriculum source imports (16 October 2026)

Senior COURSE/SUBJECT identifiers are **not** learning-outcome/content-description identifiers. Do not place them into `outcome_progress` / mastery codes merely because they exist.

- **Tasmania, TASC 2026:** the full current-year official A–Z list declares **164 courses**; the source parser independently recovered **164** (0 failures, 164 distinct IDs), broken down as Preliminary 32, Level 1 20, Level 2 60, Level 3 48, Level 4 4. Codes, real course titles, levels, TCE credits and official source URLs are held in `worker/src/data/tasc-2026-course-codes.json`. These are source-confirmed **senior course IDs**. View through the family-jurisdiction-bound read-only `GET /api/curriculum/senior-courses` and TAS Curriculum Compass search. Future years require re-verification. Source: https://www.tasc.tas.gov.au/students/courses/a-z/.
- **South Australia and Northern Territory (SACE/NTCET):** official SACE subject listing and **all 91/91 parsed code-table pages** provided **427 distinct codes** (Stage 1: 234; Stage 2: 193; **62 Modified Subject variants**, failures 0). Data kept as `worker/src/data/sace-2026-subject-review.json` with exact official page URLs; `seniorCatalogueFor("SA"|"NT")` provides **subject-and-credit codes**, not outcomes, and labels the catalogue **partial** pending VET/external national continuers/NT-specific verification. Both jurisdictions use read-only family-scoped API and Curriculum Compass search. Source: https://www.sace.sa.edu.au/teaching/subjects.
- **ACT BSSS 2026:** the official source `ACT_BSSS_Course_Register_2026.pdf` says **113 unique courses** within 11 frameworks, including A/T/M/V/H classifications. These are publicly presented as named courses and classification codes, **not individual numbered outcomes**. Review-only PDF parser and regression tests committed, but the direct official PDF gave HTTP **403** to GitHub Actions. No ACT senior codes were added; do not silently invent identifiers. Official source: https://www.bsss.act.edu.au/act_senior_secondary_system/curriculum/act_bsss_curriculum_and_course_register.
- **Queensland QCE:** senior General, Applied, Short Courses and electives have an official QCAA listing. `worker/scripts/import-qcaa-senior.mjs` and parser fixtures exist, but GitHub-hosted source access was HTTP **403**; no verified QCE senior course listing was added.
- **Western Australia WACE:** state curriculum JSON importer exists but both source index and direct JSON assets were HTTP **403** to hosted jobs. State-specific K–10 and WACE cannot be claimed complete.

**No merge, production deployment, child evidence rewrite or unauthorised fetch workaround.** When official sites block automated downloads, use a legitimate authority-provided export/manual-download source and validate it before exposing records as complete.

## Victorian curriculum source-backed code catalogue (16 October 2026)

**Built and connected on this draft branch** — not merged, not live:

- **2,927 distinct Victorian Curriculum F–10 v2 identifiers** discovered from all 15 official VCAA level pages, then mapped against **53 subject / capability / language-sequence source pages**, with **0 unmapped codes** and **43 identifiers legitimately referenced in more than one subject/sequence context**. All VCAA source URLs and 2026 applicable-version warnings are retained.
- **796 distinct official VCAA v1 English as an Additional Language content-description identifiers**, separately extracted and level-tagged: Pathway A 161, B 318 and C 317. The 2026 VCAA timeline confirms EAL continues to use v1 at this time.
- **3,723 unique VCAA code identifiers** compiled to `worker/src/data/vic-source-ids.ts`. Each retains code, official URL, version, subject(s), pathway(s) and source level(s), without reproducing syllabus wording.
- `catalogueFor("VIC")` now returns a **partial, source-backed VCAA catalogue**, separate from NSW NESA codes and ACARA v9. `programFor` filters selected subjects, language pathways and exact EAL progression levels. Ordinary English children must not receive EAL outcomes; generic "Languages" does not mean all 18 language electives.
- In 2026, **Version 1.0 remains required** for several Phase 3/4 Languages (including Arabic, Latin, Classical Greek and Turkish); published VC2 identifiers for these subjects are **not added to a child's default program**. Their missing VC1 counterparts still need a full official source import. VC2 transition flags do not certify school-sector implementation dates.
- Victorian lesson manual code linking is now enabled with a VCAA lookup link; **automated lesson-code matching remains NSW-only** until independently tested. The Outcome Tracker is source-backed but is **not complete Victorian curriculum certification**.
- Missing: V1 Phase 3/4 Languages, other transitional V1 A–D materials, senior VCE/VCE VM/VET, unverified Level 10A availability, and all other jurisdiction-wide completeness manifests. Do not claim everything is loaded.

Source authority: https://www.vcaa.vic.edu.au/curriculum/foundation-10-version-2/victorian-curriculum-f-10-version-20 . Official code search https://f10.vcaa.vic.edu.au/download-curriculum .

### Western Australia blocker confirmed with direct downloads

SCSA officially lists downloadable subject-by-subject JSON, including Noongar, Chinese, French, German, Hindi, Indonesian, Italian, Japanese, Korean, Tamil and Years 7–10 languages. GitHub Actions received **HTTP 403** for both the outline index and directly requested official English/Chinese JSON assets. The WA importer and its fixture tests remain available; an authorised direct-file provision (for example a human-downloaded source import) is needed before we can correctly ingest WA state identifiers. All WA code claims remain unavailable.

## Verified import progress (16 October 2026)

- **ACARA MRAC/2024/04: 2,678 content descriptions imported and committed on this draft branch**, compared with 1,395 in main.
- Includes all eight F–10 learning areas and **1,283 Languages identifiers**, covering 18 identified subjects/frameworks/pathways including 42 `ACL9` classical-language codes.
- Automated GitHub Actions fetched the official source, checked source-area presence, duplicate IDs, F–10 bands and regression tests. Imported into `worker/src/data/ac9-outcomes.ts`; the existing Outcome Tracker reads this shared file automatically.
- Specific language electives and Chinese first/background/second-language pathways are tested so outcomes from unrelated languages and pathways are not silently mixed.
- **NSW remains a partial seed of 137 identifiers**. Victoria and WA require state-specific imports, and every senior-secondary authority still needs a course/outcome inventory.
- **These 2,678 entries are verified *national curriculum content-description identifiers*, not separate complete curriculum catalogues for five states.**
- Victoria's 2026 effective provision includes a mix of VC2 and VC1 in certain languages and EAL subjects; import both with separate effective dates, not a fabricated single VC2 catalogue. Official references: https://www.vcaa.vic.edu.au/curriculum/foundation-10-version-2/victorian-curriculum-f-10-version-20 and https://f10.vcaa.vic.edu.au/download-curriculum (official CSV download selector).
- WA's curriculum publishes applicable versions and some transitional 2027 Languages material: https://k10outline.scsa.wa.edu.au/. Do not substitute national content codes without verifying WA adoption and any state-specific identifiers.

### NSW NESA accuracy issue found

The current NSW seed uses identifiers such as `ENe-OLC-01` and omits official English 2022 outcomes including `ENE-PRINT-01` and `ENE-REFLU-01`. The [NESA English K–10 Syllabus (2022) outcomes page](https://curriculum.nsw.edu.au/learning-areas/english/english-k-10-2022/outcomes) uses uppercase `ENE-OLC-01`. Some seed entries are old syllabus codes or legacy stage notation. The existing 137-code NSW seed is **not** a complete or uniformly current NESA release.

**Do not blindly rewrite saved child outcome evidence IDs:** new NESA editions and old code forms need source-edition-scoped identifiers plus explicit reviewed aliases/migrations. A case-normalisation pass must not equate unrelated code systems. Build a complete official syllabus index and per-version NESA outcomes import first, including Life Skills and senior extensions/electives; verify expected counts against authority syllabus pages.

## NSW source discovery and staged integration (16 October 2026)

- Official primary, secondary and senior syllabus listings discovered **258 distinct linked entries** (including a small number of cross-page or general references which still need reconciliation). Each is tagged with its URL, listing status, publication year where published, kind (including CEC, Life Skills, Extension and VET) and relevant stage index.
- **90** listed modern syllabus pages had a direct outcomes URL. Across those, **885 code candidates** were extracted with their precise official URLs and syllabus edition. **25 pages failed or returned no code**, and legacy NESA material hosted elsewhere remains largely unextracted. This is an incomplete source audit, not a complete NSW dataset.
- Of those extracted, **396 distinct current-listed, stage-resolved code identifiers** were compiled into `nesa-current-2026.ts` and added **without rewriting the existing 137-code seed or historical evidence**. The helper deduplicates genuinely shared outcomes across syllabus versions (for example MAO-WM-01 across multiple senior Mathematics courses).
- Current, outgoing and future syllabus versions are not conflated; **future-only codes are not enabled simply because the syllabus is published**.
- The source audit flags missing K–10 stages. The NESA website's rendered outcome pages may only show selected stages, so a reachable outcomes page does not prove complete course coverage.
- Year 11/12 course identifiers must derive their Stage 6 association from the syllabus context: numbers in *Extension 1* and *Extension 2* codes do not mean Stage 1 or Stage 2.
- `outcomeTracker.ts` now narrows selected Stage 6 English Advanced/Standard and Mathematics pathways by course, rather than attributing all relevant learning-area codes to a child.
- **The NSW catalogue remains partial**. Complete legacy syllabuses, missing stages, Life Skills and senior language/VET pathways still need authoritative import, per-edition checks and careful review of code aliases.

## WA state-specific sources and access issue

Official SCSA provides JSON curriculum downloads (with genuine identifiers such as WA3ELYA3 and language-specific ACL... codes) at https://k10outline.scsa.wa.edu.au/home/resources/outline-downloads . The source importer `worker/scripts/import-wa-review.mjs` and fixture tests are committed, but **the live download returned HTTP 403 to GitHub Actions**. The WA catalogue is **NOT imported**. The importer can be run manually when legitimate source files/site access are available. Do not substitute AC9 as proof of Western Australian curriculum equivalence. Published WA curriculum versions are transitional (some areas revised for implementation 2025/2026, Languages and Arts familiarisation 2026), so verify each subject's applicable year/edition.

## Confirmed gaps in main (historical baseline)

- `worker/src/data/jurisdictions.ts` advertises only NSW as `codes: "verified"`; VIC, QLD, WA, SA, TAS, ACT, NT are `none`.
- `worker/src/data/nsw-outcomes.ts` is an existing seed, **not evidence of complete syllabus coverage**.
- Main previously omitted Languages; this draft PR now imports all eight areas, retaining official language pathways and both `AC9` and `ACL9` identifiers.
- `worker/src/data/curriculum.ts` defines internal course identifiers (for example ENG-S4 and MAT-S4); these must never be represented as official learning-outcome identifiers.
- `docs/OUTCOME-TRACKER.md` describes mastery's curriculum-catalogue dependency and notes the prior Australian Curriculum import branch; deployment status needs fresh verification.

## Jurisdiction-specific authoritative sources

| Jurisdiction | F–10 / K–10 primary authority | Senior secondary authority and special cases |
|---|---|---|
| NSW | NESA, https://curriculum.nsw.edu.au/ ; catalogue **syllabus outcome IDs**, syllabus release and stage | NESA 11–12, including all elective courses, extensions and VET; track old/new syllabus transition |
| VIC | VCAA Victorian Curriculum F–10 v2, https://f10.vcaa.vic.edu.au/ ; curriculum-content IDs and capabilities, including language pathways, EAL and Foundations A–D | VCAA VCE, VCE VM and VET subjects; not interchangeable with F–10 IDs |
| QLD | QCAA Australian Curriculum v9, https://www.qcaa.qld.edu.au/p-10/aciq/version-9 ; use AC9 content description IDs | QCAA QCE General/Applied/Short Courses, VET as applicable |
| WA | SCSA K–10 Outline, https://k10outline.scsa.wa.edu.au/ ; independently verify which adopted / adapted AC9 descriptors and editions apply | SCSA WACE https://senior-secondary.scsa.wa.edu.au/syllabus-and-support-materials/course-codes ; distinguish course, unit and outcome identifiers |
| SA | Australian Curriculum v9 per SA implementation; use AC9 descriptors with edition provenance | SACE Board https://www.sace.sa.edu.au/ ; include Stage 1/2 courses and Modified Subjects |
| TAS | Australian Curriculum v9 per Tasmanian implementation; use AC9 descriptors with edition provenance | TASC https://www.tasc.tas.gov.au/ ; accredited senior courses and VET, plus relevant course identifiers |
| ACT | Australian Curriculum v9, per ACT implementation | ACT BSSS https://www.bsss.act.edu.au/act_senior_secondary_system/curriculum/act_bsss_curriculum_and_course_register ; course register, school-accredited courses, frameworks |
| NT | Australian Curriculum v9 per NT implementation; verify local arrangements and edition | NTCET / SACE-related accredited courses and VET; verify course and subject identifiers per authority |

Sources: https://www.australiancurriculum.edu.au/machine-readable-australian-curriculum ; https://www.vcaa.vic.edu.au/curriculum/foundation-10-version-2/victorian-curriculum-f-10-version-20 ; https://www.qcaa.qld.edu.au/p-10/aciq/version-9 ; https://www.bsss.act.edu.au/act_senior_secondary_system/curriculum/act_bsss_curriculum_and_course_register .

## Data contract (required before bulk ingestion)

One record per source identifier (not one per display label):
`authority, framework, framework_version, jurisdiction_applicability[], identifier, identifier_kind, year_from, year_to, stage, learning_area, subject, course, strand, is_elective, pathway, effective_from, effective_to, source_url, verification_date, status`.

`identifier_kind` separates `syllabus_outcome`, `content_description`, `achievement_standard`, `course_code`, `unit_code`, `competency`, `capability`, and `internal_subject_key`. The last must NEVER pass as an authority code. A senior course code is not automatically an outcome.

Store jurisdiction applicability separately from record identity: identical AC9 codes can legitimately apply to multiple jurisdictions without duplication. Maintain precise editions and coexistence during transitions. Keep existing family outcome/evidence references stable; never erase records on import.

## Ingestion and completeness checks

1. Inventory every official syllabus/course/subject for each jurisdiction × year/band, with a machine-verifiable **expected catalogue manifest**; include compulsory, all elective subjects, Languages/pathways, extensions, VET, disability adjustments and senior courses.
2. Pull **identifiers and non-copyrightable structural metadata** from published machine-readable/downloadable source when available, retaining direct source links and attribution. Review authority terms before bulk mirroring of substantial descriptions.
3. Validate identifiers against authority source, check duplicate IDs and code-kind mismatches; flag unmatched or stale identifiers rather than fabricate.
4. For NSW, expand beyond seed v3; verify per syllabus/version including Stage 6 and all electives.
5. Expand the AC9 importer to Languages and verify no missing curriculum learning areas (including Work Studies where relevant). Some disciplines have multiple subjects and pathways.
6. Do not automatically substitute AC9 IDs for Victoria's distinct curriculum, nor for WA where state-adapted content differs.
7. Expose verified catalogue via one shared API to lesson drafting, parent outcome tracker, learning plans, life learning, evidence backpack and child profile. All surfaces must query the **family jurisdiction and relevant syllabus version**.
8. Generate CI coverage matrix reporting actual/expected per jurisdiction, stage/year, learning area, elective/course, active/versioned status. Hard-fail misleading “complete” indicators and invalid official code claims.
9. Support explicit `not_yet_imported` and `no_identifier_in_framework` states. Never manufacture an outcome code.
10. Preserve existing data, use additive migrations, test user/family isolation, code validation and historical evidence. Review PR and deploy migrations with approval.

## Acceptance

“All codes” can only be certified **per source version and explicit scope** when expected syllabus/course manifests match imported verified identifiers; unknown/transitioning senior programmes must be marked pending, not silently omitted. Coverage includes every elective and each pathway/language where codes exist. This document alone does not satisfy acceptance.
