-- Add public game specifications without rebuilding existing activity tables.
ALTER TABLE support_activity_templates ADD COLUMN game_json TEXT;
ALTER TABLE support_live_activities ADD COLUMN game_json TEXT;
