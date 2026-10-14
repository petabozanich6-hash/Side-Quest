# Outcome Tracker — production release checklist

This feature is **not live merely because a PR is green**. Obtain explicit release approval after each safeguard is verified.

## Before merging into main
- [ ] Consolidated PR #139 worker tests, TypeScript, frontend build and browser E2E all pass at its final head SHA.
- [ ] Review the source and licence provenance of each published catalogue. This release shows **outcome identifiers only**; official curriculum descriptions remain with the responsible curriculum authority.
- [ ] NSW code list verified against current syllabus identifiers and implementation dates. AC9 is a *partial reference catalogue* (without Languages or achievement standards), not a jurisdictional compliance certificate.
- [ ] Confirm whether QLD, SA, TAS, ACT and NT use AC9 identifiers for the precise learning area and implementation year. Where unknown, prefer an explicit incomplete/unavailable label over claiming full local compliance.
- [ ] VIC and WA do not receive fabricated outcomes; their authority sites are linked from the Curriculum Hub.
- [ ] Verify review behaviour: approval alone = practice; parent's "Shown it" = evidence of understanding; two distinct reviewed occasions or qualifying comprehensive assessment = Demonstrated; only a parent can confirm Achieved.
- [ ] Verify API guards enforce the session family's home-state and student ownership even when client parameters are tampered with; test two different families.
- [ ] Verify printable evidence pack accurately labels the home-state framework, separates period-based activity log from **all-time mastery snapshot**, shows codes rather than curriculum wording, and never implies regulatory certification.

## Production database — mandatory before deployment
- [ ] Identify the authoritative **production** D1 binding `sidequest-db1` using the deployed Worker configuration. Do not confuse with `sidequest-db`.
- [ ] Take and securely retain a restorable production D1 backup **before** any migration or first request that can create tables. Record its timestamp, database ID and restoration steps.
- [ ] Inspect `_cf_KV` / `d1_migrations` or equivalent migration history and `sqlite_master` for existing `outcome_progress`, `outcome_evidence`, and `outcome_status_history` tables and their columns/indexes. The Worker also executes `CREATE TABLE IF NOT EXISTS` on access; that does **not** prove schema compatibility.
- [ ] **Never apply** competing `0057_outcome_progress.sql` from old PR #138 alongside `0057_outcome_tracker.sql`: both create `outcome_progress` with incompatible layouts.
- [ ] Validate migration `0057_outcome_tracker.sql` and preceding migrations in staging against a production-like snapshot; verify no existing table is overwritten and no duplicate migration number is present.
- [ ] Confirm rollback plan covers Worker code and database schema/data separately; additive schema is not proof a rollback is risk-free.

## After approved deployment
- [ ] Verify parent accounts in NSW, QLD and an unsupported jurisdiction (e.g. VIC) see **only their own** permitted curriculum codes and never another family's data.
- [ ] Assign, submit, return, approve and review an actual lesson; verify no accidental Demonstrated or Achieved transitions.
- [ ] Check that repeated sync does not double-count evidence and that parent-confirmed status has stable audit history.
- [ ] Download/print the report for each account and compare the chart/counts with the live tracker and linked evidence.
- [ ] Check Worker errors, D1 writes and client console without exposing personally identifiable child records.
- [ ] Do not advertise verified nationwide compliance until all state-specific implementation and licensing checks are resolved.
