-- Prior learning: outcomes a parent recognises as already met before Side-Quest (a school report, NAPLAN result,
-- previous schooling or the starting check). A parent decision like confirmation, shown as its own status.
-- Additive only. The Worker also adds these columns itself if this migration hasn't been applied.
ALTER TABLE outcome_progress ADD COLUMN prior_learning_at TEXT;
ALTER TABLE outcome_progress ADD COLUMN prior_learning_by TEXT;
ALTER TABLE outcome_progress ADD COLUMN prior_learning_source TEXT;
ALTER TABLE outcome_progress ADD COLUMN prior_learning_note TEXT;
