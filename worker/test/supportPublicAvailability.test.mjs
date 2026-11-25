import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {validateAvailability,saveAvailability,readAvailability,publicWindows,readPublicAvailability} from "../src/supportPublicAvailability.ts";
const now=new Date("2026-11-25T00:00:00Z"); // Wednesday, 11 am Sydney.
const hours=[{day:3,start:"09:00",end:"16:00"},{day:4,start:"09:00",end:"16:00"}];
test("weekly settings reject overlaps, malformed times and publication without hours",()=>{
 assert.ok(validateAvailability({enabled:true,revision:0,windows:hours}));
 for(const windows of [[],[{day:3,start:"9:00",end:"12:00"}],[{day:3,start:"12:00",end:"09:00"}],[...hours,{day:3,start:"10:00",end:"14:00"}]])assert.equal(validateAvailability({enabled:true,revision:0,windows}),null);
});
test("booking, preparation and wrap-up split public windows without exposing private labels",()=>{
 const b=[{start_at:"2026-11-26T00:00:00Z",end_at:"2026-11-26T01:00:00Z",prep_minutes:15,wrap_minutes:15,learner_label:"PRIVATE",scope:"PRIVATE" }];
 const days=publicWindows(hours,b,now);
 assert.equal(days.length,14);
 assert.deepEqual(days[1],{date:"2026-11-26",windows:[{start:"2026-11-25T22:00:00.000Z",end:"2026-11-25T23:30:00.000Z"},{start:"2026-11-26T01:30:00.000Z",end:"2026-11-26T05:00:00.000Z"}]});
 assert.ok(!JSON.stringify(days).includes("PRIVATE"));
 assert.equal(days[0].windows[0].start,"2026-11-25T00:30:00.000Z");
});
test("whole day block removes all advertised time; Sydney DST is respected",()=>{
 const b=[{start_at:"2026-11-25T13:00:00Z",end_at:"2026-11-26T13:00:00Z"}];
 assert.deepEqual(publicWindows(hours,b,now)[1].windows,[]);
 const winter=publicWindows([{day:3,start:"09:00",end:"10:00"}],[],new Date("2026-06-02T13:00:00Z"));
 assert.equal(winter[0].date,"2026-06-02");assert.equal(winter[1].windows[0].start,"2026-06-02T23:00:00.000Z");
});
test("actual diary changes immediately affect public availability and cancellation releases times",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());
 assert.deepEqual(await readAvailability(db),{enabled:false,windows:[],revision:0});
 assert.equal((await readPublicAvailability(db,now)).published,false);
 assert.equal(await saveAvailability(db,{enabled:true,windows:hours,revision:0,confirmed:true}),true);
 assert.equal(await saveAvailability(db,{enabled:false,windows:[],revision:0,confirmed:true}),false);
 const initial=await readPublicAvailability(db,now);
 db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run("private-order","guest","private-request","private-quote",3000,"private lesson","online","terms","live","2026-11-26T00:00:00.000Z","2026-11-26T01:00:00.000Z","confirmed",now.toISOString(),now.toISOString());
 db.raw.prepare("INSERT INTO support_tutor_diary(order_id,learner_label,prep_minutes,wrap_minutes,updated_at) VALUES(?,?,?,?,?)").run("private-order","private learner",15,15,now.toISOString());
 const changed=await readPublicAvailability(db,now);
 assert.notDeepEqual(changed.days[1],initial.days[1]);assert.ok(!JSON.stringify(changed).includes("private"));
 assert.deepEqual(changed.days[1].windows,publicWindows(hours,[{start_at:"2026-11-26T00:00:00Z",end_at:"2026-11-26T01:00:00Z",prep_minutes:15,wrap_minutes:15}],now)[1].windows);
 db.raw.prepare("UPDATE support_service_orders SET status='cancelled' WHERE id=?").run("private-order");
 assert.deepEqual((await readPublicAvailability(db,now)).days,initial.days);
 db.raw.prepare("INSERT INTO support_busy_blocks(id,label,start_at,end_at,created_at) VALUES(?,?,?,?,?)").run("private-block","private appointment","2026-11-25T13:00:00.000Z","2026-11-26T13:00:00.000Z",now.toISOString());
 assert.deepEqual((await readPublicAvailability(db,now)).days[1].windows,[]);
 assert.equal(await saveAvailability(db,{enabled:false,windows:hours,revision:1,confirmed:true}),true);
 assert.equal((await readPublicAvailability(db,now)).published,false);
});
