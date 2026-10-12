"""Reconstruct repository-planned lessons locally; never contacts live D1."""
import csv, json, sqlite3
from pathlib import Path

root=Path(__file__).resolve().parents[1]
db=sqlite3.connect(':memory:')
skip={'0006','0007','0008','0009','0010','0011'}
for file in sorted((root/'worker/migrations').glob('*.sql')):
 if file.name[:4] not in skip: db.executescript(file.read_text())

def canonical(stage):
 return {'Early Stage 1':'ES1','Stage 1':'S1'}.get(stage,stage)
priority={'S2':1,'S4':1,'ES1':2,'S1':2,'S3':2,'S5':2,'S6':2}
out=root/'docs/inventory';out.mkdir(parents=True,exist_ok=True)
rows=[]
for seed,title,stage,area,data in db.execute('SELECT seed_key,title,stage,learning_area,data FROM lessons ORDER BY stage,seed_key'):
 d=json.loads(data);st=canonical(stage)
 status='queued'
 if seed=='s2-eng-y3-w01-l1':status='approved_gold_on_main'
 elif d.get('pass')==1 and d.get('review_status') in {'unreviewed','needs_expert_review'} and d.get('teach_steps'):status='authored_in_repository_unreviewed'
 rows.append({'seed_key':seed,'stage':st,'year_level':d.get('year_level',''),'learning_area':area,'title':title,'priority':priority.get(st,2),'status':status})
columns=['seed_key','stage','year_level','learning_area','title','priority','status']
summary=[]
for stage in ['ES1','S1','S2','S3','S4','S5','S6']:
 selected=[r for r in rows if r['stage']==stage]
 # Split senior inventory by year so each reviewable CSV stays manageable.
 groups=[('S6-Y11',[r for r in selected if '11' in str(r['year_level'])]),('S6-Y12',[r for r in selected if '12' in str(r['year_level'])])] if stage=='S6' else [(stage,selected)]
 for name,group in groups:
  with (out/f'{name}.csv').open('w',newline='') as f:
   w=csv.DictWriter(f,fieldnames=columns);w.writeheader();w.writerows(group)
 summary.append({'stage':stage,'priority':priority[stage],'total':len(selected),'approved_gold':sum(r['status']=='approved_gold_on_main' for r in selected),'authored_unreviewed':sum(r['status']=='authored_in_repository_unreviewed' for r in selected)})
with (out/'SUMMARY.csv').open('w',newline='') as f:
 w=csv.DictWriter(f,fieldnames=list(summary[0]));w.writeheader();w.writerows(summary)
assert len(rows)==len({r['seed_key'] for r in rows}), 'Seed-key inventory is not unique'
print(json.dumps({'total':len(rows),'summary':summary,'files':[str(p.relative_to(root)) for p in sorted(out.glob('*.csv'))]},indent=2))
