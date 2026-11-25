import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {termsReview,confirmReviewedTerms,persistTermsAcceptance,acceptanceReceipt} from "../src/supportTermsAcceptance.ts";
test("draft terms cannot be accepted, and approved snapshot records exact agreement once for the scoped order",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());const now=new Date("2026-11-25T00:00:00.000Z"),at=now.toISOString();
 db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").run("g","parent@example.test","Parent","Support","Request",at,at);
 db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run("o","guest","g","q",3000,"Lesson","Online","Agreed arrangements","live","2026-12-08T00:00:00.000Z","2026-12-08T01:00:00.000Z","awaiting_confirmation",at,at);
 const env={DB:db,SUPPORT_TERMS_REQUIRED:"true"};
 assert.equal(await termsReview(env,"guest","other","o"),null);
 const draft=await termsReview(env,"guest","g","o");assert.equal(draft.approved,false);
 assert.equal(await confirmReviewedTerms({...env,SUPPORT_TERMS_APPROVED_VERSION:draft.version},"guest","g","o","parent@example.test",{confirmed:true,terms_accepted:true,terms_version:draft.version,terms_fingerprint:draft.fingerprint},now),false);
 assert.equal(await acceptanceReceipt(db,"guest","g","o"),null);
 // Isolated internal persistence test with a synthetic approval. No production approval bypass.
 const approved={...draft,approved:true,version:"synthetic-test-only"};
 assert.equal(await persistTermsAcceptance(db,"guest","other","o","parent@example.test",approved,now),false);
 assert.equal(await persistTermsAcceptance(db,"guest","g","o","parent@example.test",approved,now),true);
 assert.equal(await persistTermsAcceptance(db,"guest","g","o","parent@example.test",approved,now),false);
 const receipt=await acceptanceReceipt(db,"guest","g","o");assert.equal(receipt.agreement_version,approved.version);assert.equal(receipt.fingerprint,approved.fingerprint);assert.equal(receipt.base64,approved.base64);assert.equal(receipt.accepted_at,at);
 assert.equal(await acceptanceReceipt(db,"guest","other","o"),null);
 assert.equal(db.raw.prepare("SELECT status FROM support_service_orders WHERE id='o'").get().status,"confirmed");
});
