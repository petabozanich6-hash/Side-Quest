"""Local SQLite simulation; does not contact or change Cloudflare."""
import json, sqlite3
from pathlib import Path
root=Path(__file__).resolve().parents[1]
sql=(root/'worker/migrations/0044_s2_y3_w01_l1_gold_expression.sql').read_text()
old_sql=(root/'worker/migrations/0013_s2_y3_w01_l1_reading_expression.sql').read_text()
db=sqlite3.connect(':memory:')
db.executescript((root/'worker/migrations/0002_core.sql').read_text())
identity={'id':'stable-id','seed_key':'s2-eng-y3-w01-l1','unit_id':'stable-unit','coming_soon':True}
for identifier,key in [('shared','s2-eng-y3-w01-l1'),('other','s2-eng-y3-w01-l2')]:
 db.execute('INSERT INTO lessons(id,family_id,seed_key,title,data,created_at,updated_at) VALUES(?,?,?,?,?,?,?)',(identifier,None,key,'Old',json.dumps(identity),'created','before'))
db.executescript(old_sql)
before_other=db.execute("SELECT data FROM lessons WHERE id='other'").fetchone()[0]
db.executescript(sql)
for identifier in ['shared']:
 title,data=db.execute('SELECT title,data FROM lessons WHERE id=?',(identifier,)).fetchone();value=json.loads(data)
 assert title==value['title']
 assert value['id']=='stable-id' and value['unit_id']=='stable-unit'
 assert len(value['teach_steps'])==4 and len(value['quiz'])==10
 assert len(value['stage_hints'])==10
 assert all(key not in value for key in ['coming_soon','spelling','resources','word_challenges','planner_fields'])
 assert value['independent_task'].startswith('YOU DO: Your Voice Detective task')
assert db.execute("SELECT data FROM lessons WHERE id='other'").fetchone()[0]==before_other
assert db.execute("SELECT family_id FROM lessons WHERE id='shared'").fetchone()[0] is None
snapshot=db.execute('SELECT id,data FROM lessons ORDER BY id').fetchall();db.executescript(sql)
assert db.execute('SELECT id,data FROM lessons ORDER BY id').fetchall()==snapshot
print('SQLite checks passed: replace old lesson, preserve IDs/ownership/metadata, update unique seed row, leave other seed unchanged, stable content on rerun.')
