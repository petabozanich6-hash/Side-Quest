"""Local SQLite verification only; does not contact Cloudflare."""
import json, sqlite3
from pathlib import Path
from lxml import etree

root=Path(__file__).resolve().parents[1]
db=sqlite3.connect(':memory:')
for file in sorted((root/'worker/migrations').glob('*.sql')):
    if file.name[:4] not in {'0006','0007','0008','0009','0010','0011','0048'}:
        db.executescript(file.read_text())
before={r[0]:r for r in db.execute('SELECT id,seed_key,title,stage,learning_area,data,updated_at FROM lessons')}
sql=(root/'worker/migrations/0048_s2_y4_english_w01_complete.sql').read_text()
db.executescript(sql)
after={r[0]:r for r in db.execute('SELECT id,seed_key,title,stage,learning_area,data,updated_at FROM lessons')}
changed=[key for key in after if after[key]!=before[key]]
assert len(changed)==4
assert {after[k][1] for k in changed}=={f's2-eng-y4-w01-l{i}' for i in range(1,5)}
assert before.keys()==after.keys()
images=0
for key in changed:
    old,new=before[key],after[key]
    assert old[0:2]==new[0:2] and old[3:5]==new[3:5]
    lesson=json.loads(new[5])
    assert lesson['title']==new[2] and lesson['year_level']=='Year 4'
    assert 'coming_soon' not in lesson and lesson['pass']==1
    assert len(lesson['teach_steps'])==4 and len(lesson['quiz'])==10
    assert sum(q['type']=='multiple_choice' for q in lesson['quiz'])==8
    assert sum(q['type']=='short_answer' for q in lesson['quiz'])==2
    assert lesson['pass_mark']==.9
    assert all(k not in lesson for k in ['resources','sort_activity','word_challenges','suspense_builder'])
    def scan(v):
        global images
        if isinstance(v,dict):
            if 'svg' in v:
                etree.fromstring(v['svg'].encode());images+=1
            for child in v.values():scan(child)
        elif isinstance(v,list):
            for child in v:scan(child)
    scan(lesson)
snapshot={r[0]:r[1] for r in db.execute('SELECT id,data FROM lessons')}
db.executescript(sql)
assert snapshot=={r[0]:r[1] for r in db.execute('SELECT id,data FROM lessons')}
print(f'Passed: exactly four target rows; identities and all other rows preserved; stable content on rerun; {images} SVGs parsed.')
