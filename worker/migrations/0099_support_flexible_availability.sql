-- Keep all existing bookings; publication stays in its current state.
ALTER TABLE support_public_availability ADD COLUMN policy_json TEXT NOT NULL DEFAULT '{"enforced":true,"weekly_limit":5,"daily_limit":2,"evening_limit":1,"date_overrides":[],"week_overrides":[]}';
-- Only replace the unchanged, unpublished original seed.
UPDATE support_public_availability SET windows_json='[{"day":2,"start":"09:00","end":"13:00"},{"day":3,"start":"18:00","end":"19:30"},{"day":4,"start":"09:00","end":"13:00"}]',revision=revision+1,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now')
WHERE id=1 AND enabled=0 AND revision=1 AND windows_json='[{"day":1,"start":"09:00","end":"13:00"},{"day":2,"start":"09:00","end":"13:00"},{"day":3,"start":"09:00","end":"13:00"},{"day":4,"start":"09:00","end":"13:00"},{"day":5,"start":"09:00","end":"13:00"}]';
