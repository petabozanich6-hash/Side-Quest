-- Parents can point children to exact editable questions on returned assignments.
-- Never overwrite the child's draft or previously submitted answers.
ALTER TABLE submissions ADD COLUMN review_flags TEXT NOT NULL DEFAULT '[]';

-- An immutable copy of the answers handed in on this attempt, for accurate historical reviews.
ALTER TABLE submissions ADD COLUMN submission_draft TEXT;
