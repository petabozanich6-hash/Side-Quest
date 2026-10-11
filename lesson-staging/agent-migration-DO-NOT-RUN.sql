-- Migration: Rebuild Reading with Expression lesson
-- Run: wrangler d1 execute sidequest-db1 --remote --file=migrations/002_rebuild_reading_expression_lesson.sql

UPDATE lessons SET
  title = 'Reading with Expression',
  status = 'published',
  updated_at = datetime('now'),
  data = json('{"year_level":"Year 3","subject":"English","learning_intention":"I can explain what expressive reading is, use punctuation, phrasing, pitch, volume and emphasis to show meaning, and read a passage aloud with expression and improve my performance.","status":"published","duration_minutes":45,"success_criteria":["I can pause at full stops, commas, question marks and exclamation marks.","I can group words into meaningful phrases instead of reading one word at a time.","I can change my voice (pitch, volume, pace) to match the meaning or emotion of the text.","I can emphasise important words to show what matters most in a sentence.","I can explain why I made a particular reading choice.","I can reread a passage and improve my expression on the second attempt."],"source_note":"Substantially rebuilt and expanded from the original lesson card."}')
WHERE id = 'seed-s2-eng-y3-w01-l1';
