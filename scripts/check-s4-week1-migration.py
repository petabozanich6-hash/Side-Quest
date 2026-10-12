"""Local-only check: four Year 7 lessons replace only their placeholder rows."""
import json,sqlite3
from pathlib import Path
root=Path(__file__).resolve().parents[1]
db=sqlite3.connect(':memory:')
for file in sorted((root/'worker/migrations').glob('*.sql')):
 if file.name[:4] not in {'0006','0007','0008','0009','0010','0011','0047'}:db.executescript(file.read_text())
before={r[0]:r for r in db.execute('SELECT id,seed_key,title,stage,learning_area,data,updated_at FROM lessons')}
sql=(root/'worker/migrations/0047_s4_y7_english_w01_complete.sql').read_text()
db.executescript(sql)
after={r[0]:r for r in db.execute('SELECT id,seed_key,title,stage,learning_area,data,updated_at FROM lessons')}
changed=[k for k in after if after[k]!=before[k]]
assert len(changed)==4
assert {after[k][1] for k in changed}=={f's4-eng-y7-w01-l{i}' for i in range(1,5)}
assert before.keys()==after.keys()
for k in changed:
 a,b=after[k],before[k];value=json.loads(a[5])
 assert a[0]==b[0] and a[1]==b[1] and a[3:5]==b[3:5]
 assert value['year_level']=='Year 7' and value['title']==a[2]
 assert 'coming_soon' not in value
 assert len(value['teach_steps'])==4 and len(value['quiz'])==10
 assert all(q['type']=='multiple_choice' for q in value['quiz'])
 assert value['pass_mark']==.9
 assert all(key not in value for key in ['resources','word_challenges','sort_activity','suspense_builder','spelling'])
 assert value['review_status']=='unreviewed'
snapshot={r[0]:r[1] for r in db.execute('SELECT id,data FROM lessons')}
db.executescript(sql)
assert snapshot=={r[0]:r[1] for r in db.execute('SELECT id,data FROM lessons')}
print('Passed: exactly four target rows; IDs/all other rows preserved; 10 scored choices each; content stable on rerun.')
