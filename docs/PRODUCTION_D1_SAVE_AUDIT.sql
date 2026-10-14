-- READ-ONLY production D1 compatibility audit for Side-Quest save endpoints.
-- Execute in Cloudflare D1 Console for sidequest-db1. No data is changed.
-- Each row is a missing column or missing table compared with current Worker save paths.
WITH expected(table_name, column_name) AS (
VALUES
  ('life_evidence','id'),
  ('life_evidence','family_id'),
  ('life_evidence','student_id'),
  ('life_evidence','title'),
  ('life_evidence','description'),
  ('life_evidence','date'),
  ('life_evidence','duration_minutes'),
  ('life_evidence','location'),
  ('life_evidence','file_ids'),
  ('life_evidence','parent_note'),
  ('life_evidence','status'),
  ('life_evidence','suggested_mappings'),
  ('life_evidence','accepted_mappings'),
  ('life_evidence','ai_summary'),
  ('life_evidence','ai_activity_type'),
  ('life_evidence','ai_additional'),
  ('life_evidence','created_by'),
  ('life_evidence','reviewed_at'),
  ('life_evidence','reviewed_by'),
  ('life_evidence','created_at'),
  ('life_evidence','updated_at'),
  ('learning_plans','id'),
  ('learning_plans','family_id'),
  ('learning_plans','student_id'),
  ('learning_plans','title'),
  ('learning_plans','period_start'),
  ('learning_plans','period_end'),
  ('learning_plans','interests'),
  ('learning_plans','subject_focus'),
  ('learning_plans','teaching_approach'),
  ('learning_plans','notes'),
  ('learning_plans','status'),
  ('learning_plans','ai_content'),
  ('learning_plans','created_at'),
  ('learning_plans','updated_at'),
  ('calendar_events','id'),
  ('calendar_events','family_id'),
  ('calendar_events','student_id'),
  ('calendar_events','title'),
  ('calendar_events','date'),
  ('calendar_events','start_time'),
  ('calendar_events','duration_minutes'),
  ('calendar_events','event_type'),
  ('calendar_events','linked_lesson_id'),
  ('calendar_events','linked_assignment_id'),
  ('calendar_events','notes'),
  ('calendar_events','status'),
  ('calendar_events','created_at'),
  ('students','id'),
  ('students','family_id'),
  ('students','name'),
  ('students','username'),
  ('students','pin_hash'),
  ('students','birth_year'),
  ('students','stage'),
  ('students','year_level'),
  ('students','theme'),
  ('students','interests'),
  ('students','notes'),
  ('students','created_at'),
  ('students','extra'),
  ('students','electives'),
  ('students','subject_levels'),
  ('evidence_notes','id'),
  ('evidence_notes','family_id'),
  ('evidence_notes','student_id'),
  ('evidence_notes','title'),
  ('evidence_notes','learning_area'),
  ('evidence_notes','notes'),
  ('evidence_notes','occurred_on'),
  ('evidence_notes','file_ids'),
  ('evidence_notes','created_at'),
  ('reading_log','id'),
  ('reading_log','family_id'),
  ('reading_log','student_id'),
  ('reading_log','title'),
  ('reading_log','author'),
  ('reading_log','pages'),
  ('reading_log','pages_read'),
  ('reading_log','read_date'),
  ('reading_log','duration_minutes'),
  ('reading_log','source'),
  ('reading_log','book_type'),
  ('reading_log','reading_mode'),
  ('reading_log','comprehension_notes'),
  ('reading_log','favourite_part'),
  ('reading_log','difficulty'),
  ('reading_log','parent_note'),
  ('reading_log','logged_by'),
  ('reading_log','logged_role'),
  ('reading_log','created_at'),
  ('families','id'),
  ('families','name'),
  ('families','owner_id'),
  ('families','created_at'),
  ('families','jurisdiction'),
  ('families','plan'),
  ('families','trial_started_at'),
  ('families','trial_ends_at'),
  ('ai_usage','id'),
  ('ai_usage','family_id'),
  ('ai_usage','user_id'),
  ('ai_usage','kind'),
  ('ai_usage','status'),
  ('ai_usage','created_at')
), live AS (
SELECT 'life_evidence' AS table_name, name AS column_name FROM pragma_table_info('life_evidence')
UNION ALL
SELECT 'learning_plans' AS table_name, name AS column_name FROM pragma_table_info('learning_plans')
UNION ALL
SELECT 'calendar_events' AS table_name, name AS column_name FROM pragma_table_info('calendar_events')
UNION ALL
SELECT 'students' AS table_name, name AS column_name FROM pragma_table_info('students')
UNION ALL
SELECT 'evidence_notes' AS table_name, name AS column_name FROM pragma_table_info('evidence_notes')
UNION ALL
SELECT 'reading_log' AS table_name, name AS column_name FROM pragma_table_info('reading_log')
UNION ALL
SELECT 'families' AS table_name, name AS column_name FROM pragma_table_info('families')
UNION ALL
SELECT 'ai_usage' AS table_name, name AS column_name FROM pragma_table_info('ai_usage')
)
SELECT e.table_name, e.column_name AS missing_column,
  CASE WHEN EXISTS (SELECT 1 FROM live l WHERE l.table_name=e.table_name)
       THEN 'COLUMN_MISSING' ELSE 'TABLE_MISSING' END AS finding
FROM expected e
WHERE NOT EXISTS (SELECT 1 FROM live l WHERE l.table_name=e.table_name AND l.column_name=e.column_name)
ORDER BY e.table_name, e.column_name;
