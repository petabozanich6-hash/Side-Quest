-- Parent lesson builder, assignment snapshots and account-level entitlements.
-- Safe on populated databases: additive columns only, no lesson rows are changed or deleted.

-- Lessons: a version counter for parent-edited lessons and soft archiving.
ALTER TABLE lessons ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
ALTER TABLE lessons ADD COLUMN archived_at TEXT;

-- Assignments: each assignment keeps its own copy of the lesson as it was when assigned,
-- so editing or archiving the library lesson never changes what a child saw or submitted.
-- xp_awarded makes the review XP award idempotent.
ALTER TABLE assignments ADD COLUMN lesson_snapshot TEXT;
ALTER TABLE assignments ADD COLUMN lesson_version INTEGER;
-- draft: the child's saved-in-progress answers, so a refresh or another device loses nothing.
ALTER TABLE assignments ADD COLUMN draft TEXT;
ALTER TABLE assignments ADD COLUMN xp_awarded INTEGER NOT NULL DEFAULT 0;

-- Quiz attempts are tied to the assignment so submission can require a server-verified pass.
ALTER TABLE quiz_results ADD COLUMN assignment_id TEXT;

-- Families: account entitlement state. Only the server (or the owner via the database) can change it.
-- States: FREE_PREVIEW, PREVIEW_EXPIRED, ACTIVE_MONTHLY, ACTIVE_ANNUAL, PAST_DUE, CANCELLED, INTERNAL.
ALTER TABLE families ADD COLUMN plan TEXT NOT NULL DEFAULT 'FREE_PREVIEW';
ALTER TABLE families ADD COLUMN trial_started_at TEXT;
ALTER TABLE families ADD COLUMN trial_ends_at TEXT;
ALTER TABLE families ADD COLUMN plan_period_end TEXT;

-- Families that exist before this migration are the internal pre-launch accounts.
-- They are marked INTERNAL (unrestricted) so nothing they already use is locked, and so no one is
-- silently given a paid plan. Billing is NOT LIVE; new sign-ups start as FREE_PREVIEW.
UPDATE families SET plan = 'INTERNAL';

CREATE INDEX IF NOT EXISTS idx_lessons_family_archived ON lessons (family_id, archived_at);
CREATE INDEX IF NOT EXISTS idx_assignments_family_status ON assignments (family_id, status);
