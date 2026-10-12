"""Local-only regression check for the three priority Stage 2 lessons."""
import json,sqlite3
from pathlib import Path
root=Path(__file__).resolve().parents[1]
db=sqlite3.connect(':memory:')
for file in sorted((root/'worker/migrations').glob('*.sql')):
 if file.name[:4] not in {'0006','0007','0008','0009','0010','0011','0046'}:db.executescript(file.read_text())
before={r[0]:r for r in db.execute('SELECT id,seed_key,title,stage,learning_area,data,updated_at FROM lessons')}
sql=(root/'worker/migrations/0046_s2_y3_english_w01_remaining.sql').read_text()
db.executescript(sql)
after={r[0]:r for r in db.execute('SELECT id,seed_key,title,stage,learning_area,data,updated_at FROM lessons')}
changed=[k for k in after if after[k]!=before[k]]
assert len(changed)==3
assert {after[k][1] for k in changed}=={'s2-eng-y3-w01-l2','s2-eng-y3-w01-l3','s2-eng-y3-w01-l4'}
assert before.keys()==after.keys()
for k in changed:
 a,b=after[k],before[k];value=json.loads(a[5])
 assert a[0]==b[0] and a[1]==b[1] and a[3:5]==b[3:5]
 assert value['year_level']=='Year 3' and value['title']==a[2]
 assert 'coming_soon' not in value
 assert len(value['teach_steps'])==4 and len(value['quiz'])==10
 assert all(key not in value for key in ['resources','word_challenges','sort_activity','suspense_builder','planner_fields'])
 assert value['review_status']=='unreviewed'
snapshot={r[0]:r[1] for r in db.execute('SELECT id,data FROM lessons')}
db.executescript(sql)
assert snapshot=={r[0]:r[1] for r in db.execute('SELECT id,data FROM lessons')}
print('Passed: exactly three target rows; IDs and other rows preserved; old activities cleared; content stable on rerun.')
