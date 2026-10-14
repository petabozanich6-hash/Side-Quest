-- Cache of YouTube search results so the same lesson topic is not searched again and again (the free quota is small).
-- Safe and additive. The code keeps working if this table has not been created yet.
CREATE TABLE IF NOT EXISTS resource_cache (
  cache_key TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL
);
