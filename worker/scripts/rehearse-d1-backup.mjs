// Offline only. Read a verified independent SQL backup and its JSON verification report.
// Never invokes Wrangler, touches the network, changes the export or writes production.
import { DatabaseSync } from 'node:sqlite';
import { readFileSync,readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const quote = s => '"' + s.replaceAll('"','""') + '"';
const counts = db => Object.fromEntries(db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' ORDER BY name").all().map(({name})=>[name,db.prepare('SELECT count(*) AS n FROM '+quote(name)).get().n]));
// Only these historically runtime-added columns may be reconciled, and only
// on the private restored copy after checking the exact column definition.
// Preserve and execute all other statements, especially the 0069 token index.
const knownAdds = {
  '0069_parent_email_verification.sql': [
    ['users','email_verified_at','TEXT',0,null],
    ['users','email_verification_required_at','TEXT',0,null],
  ],
  '0070_question_review_flags.sql': [['submissions','review_flags','TEXT',1,"'[]'"]],
  '0071_outcome_prior_learning.sql': ['at','by','source','note'].map(s=>['outcome_progress','prior_learning_'+s,'TEXT',0,null]),
};
function reconcileKnownAdds(db,m){
  let sql=m.sql;
  const reconciled=[];
  for(const [table,column,type,notnull,def] of knownAdds[m.name]||[]){
    const statement='ALTER TABLE '+table+' ADD COLUMN '+column+' '+type+(notnull?' NOT NULL':'')+(def!==null?' DEFAULT '+def:'')+';';
    // Do not reconcile modified, duplicated or unexpected SQL.
    if(sql.split(statement).length!==2)throw Error('Historical ADD COLUMN statement differs from reviewed definition');
    const present=db.prepare('PRAGMA table_xinfo('+quote(table)+')').all().find(r=>r.name===column);
    if(!present)continue;
    if(present.type.toUpperCase()!==type||present.notnull!==notnull||present.dflt_value!==def||present.pk!==0||present.hidden!==0)throw Error('Existing column definition conflicts with reviewed migration');
    sql=sql.replace(statement,'-- Existing column verified on restored copy: '+table+'.'+column);
    reconciled.push(table+'.'+column);
  }
  return {sql,reconciled};
}
export function rehearse(db,migrations) {
  const initial=counts(db);
  const applied=new Set(db.prepare('SELECT name FROM d1_migrations').all().map(r=>r.name));
  const known=new Set(migrations.map(m=>m.name));
  const unknown=[...applied].filter(n=>!known.has(n));
  if(unknown.length) return {ok:false,reason:'Unrecognised recorded migrations',unknown};
  const pending=migrations.filter(m=>!applied.has(m.name));
  const tested=[],reconciled=[];
  for(const m of pending){
    db.exec('BEGIN');
    try {
      const plan=reconcileKnownAdds(db,m);
      db.exec(plan.sql);
      const now=counts(db);
      const changed=Object.keys(initial).filter(n=>now[n]!==initial[n]);
      if(changed.length){db.exec('ROLLBACK');return {ok:false,failed:m.name,reason:'Existing table row counts changed',changed,tested};}
      db.exec('COMMIT');
      tested.push(m.name);
      for(const column of plan.reconciled)reconciled.push({migration:m.name,column});
    }catch(e){
      try{db.exec('ROLLBACK');}catch{}
      // Do not print database content or SQL errors containing values.
      return {ok:false,failed:m.name,reason:/duplicate column name|Existing column definition/i.test(String(e))?'Existing column conflicts with migration; reconcile its definition and history before proceeding':'Migration failed on private rehearsal copy; investigate locally',tested};
    }
  }
  return {ok:true,tested,reconciled,pending:pending.length,existingTables:Object.keys(initial).length,notice:'Local rehearsal only; not proof of production readiness or data-content equality.'};
}
function main(){
  const [sqlPath,reportPath]=process.argv.slice(2);
  if(!sqlPath||!reportPath)throw Error('Usage: node worker/scripts/rehearse-d1-backup.mjs /private/backup.sql /private/backup.json');
  const sql=readFileSync(sqlPath,'utf8'),report=JSON.parse(readFileSync(reportPath,'utf8'));
  const root=resolve(fileURLToPath(new URL('../../',import.meta.url)));
  const config=readFileSync(resolve(root,'wrangler.jsonc'),'utf8');
  const id=config.match(/"database_id":\s*"([^"]+)"/)?.[1];
  if(!id||report.database_id!==id||report.restore_check!=='all tables match live'||createHash('sha256').update(sql).digest('hex')!==report.sha256)throw Error('Verified backup report does not match this database/export');
  const db=new DatabaseSync(':memory:');
  try{
    db.exec(sql);
    const original=counts(db);
    if(!report.rows||Object.keys(original).length!==Object.keys(report.rows).length||Object.keys(original).some(n=>original[n]!==report.rows[n]))throw Error('Restored table counts do not match verified backup report');
    const dir=resolve(root,'worker/migrations');
    const migrations=readdirSync(dir).filter(n=>n.endsWith('.sql')).sort().map(name=>({name,sql:readFileSync(resolve(dir,name),'utf8')}));
    const result=rehearse(db,migrations);
    console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=1;
  }finally{db.close();}
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{main();}catch{console.error('Offline rehearsal could not verify or load the supplied backup; no production action taken. Check the private inputs.');process.exitCode=2;}
}
