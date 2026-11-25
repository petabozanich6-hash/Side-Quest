CREATE TABLE IF NOT EXISTS support_public_availability (
 id INTEGER PRIMARY KEY CHECK(id=1), enabled INTEGER NOT NULL DEFAULT 0 CHECK(enabled IN (0,1)),
 windows_json TEXT NOT NULL DEFAULT '[]', revision INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL
);

-- Owner-requested initial weekly hours. Publication remains off pending go-live checks.
-- Do not replace settings if they have already been configured.
INSERT OR IGNORE INTO support_public_availability(id,enabled,windows_json,revision,updated_at)
VALUES(1,0,'[{"day":1,"start":"09:00","end":"13:00"},{"day":2,"start":"09:00","end":"13:00"},{"day":3,"start":"09:00","end":"13:00"},{"day":4,"start":"09:00","end":"13:00"},{"day":5,"start":"09:00","end":"13:00"}]',1,strftime('%Y-%m-%dT%H:%M:%fZ','now'));

-- Owner-requested unavailable week, Sydney local 30 Nov 2026 00:00 to 7 Dec 2026 00:00.
-- Preserve any existing service orders; the diary block only prevents new reservations.
INSERT OR IGNORE INTO support_busy_blocks(id,label,start_at,end_at,created_at)
VALUES('initial-availability-block-2026-11-30','Unavailable','2026-11-29T13:00:00.000Z','2026-12-06T13:00:00.000Z',strftime('%Y-%m-%dT%H:%M:%fZ','now'));
