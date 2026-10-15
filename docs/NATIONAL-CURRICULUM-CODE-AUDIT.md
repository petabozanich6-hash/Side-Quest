# Nationwide curriculum identifier coverage — verified source audit (16 October 2026)

**Status: inventory and implementation design; NOT a completed dataset.** Do not describe Side-Quest as having all codes until automated coverage checks pass. This audit intentionally does not invent identifiers.

## Verified import progress (16 October 2026)

- **ACARA MRAC/2024/04: 2,678 content descriptions imported and committed on this draft branch**, compared with 1,395 in main.
- Includes all eight F–10 learning areas and **1,283 Languages identifiers**, covering 18 identified subjects/frameworks/pathways including 42 `ACL9` classical-language codes.
- Automated GitHub Actions fetched the official source, checked source-area presence, duplicate IDs, F–10 bands and regression tests. Imported into `worker/src/data/ac9-outcomes.ts`; the existing Outcome Tracker reads this shared file automatically.
- Specific language electives and Chinese first/background/second-language pathways are tested so outcomes from unrelated languages and pathways are not silently mixed.
- **NSW remains a partial seed of 137 identifiers**. Victoria and WA require state-specific imports, and every senior-secondary authority still needs a course/outcome inventory.
- **These 2,678 entries are verified *national curriculum content-description identifiers*, not separate complete curriculum catalogues for five states.**
- Victoria's 2026 effective provision includes a mix of VC2 and VC1 in certain languages and EAL subjects; import both with separate effective dates, not a fabricated single VC2 catalogue. Official references: https://www.vcaa.vic.edu.au/curriculum/foundation-10-version-2/victorian-curriculum-f-10-version-20 and https://f10.vcaa.vic.edu.au/download-curriculum (official CSV download selector).
- WA's curriculum publishes applicable versions and some transitional 2027 Languages material: https://k10outline.scsa.wa.edu.au/. Do not substitute national content codes without verifying WA adoption and any state-specific identifiers.

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
