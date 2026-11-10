import test from "node:test";
import assert from "node:assert/strict";
import { billingCadence, instalmentCents, instalmentsPerMail, mailPaymentStatus } from "../src/shopMailBilling.ts";

test("fortnightly pricing preserves roughly the annual monthly total", () => {
  assert.equal(instalmentCents(1300,"monthly"),1300);
  assert.equal(instalmentCents(1300,"fortnightly"),600);
  assert.equal(instalmentCents(2999,"fortnightly"),1384);
  assert.equal(instalmentsPerMail("monthly"),1);
  assert.equal(instalmentsPerMail("fortnightly"),2);
  assert.equal(billingCadence("fortnightly"),"fortnightly");
  assert.equal(billingCadence("weekly"),null);
});
test("part-paid fortnightly customers are never eligible for mailing", () => {
  const first=mailPaymentStatus("fortnightly",1,0,"active");
  assert.equal(first.eligible,false);
  assert.equal(first.label,"Part paid — do not send");
  assert.equal(first.paid_instalments,1);
  const second=mailPaymentStatus("fortnightly",2,0,"active");
  assert.equal(second.eligible,true);
  const used=mailPaymentStatus("fortnightly",2,1,"active");
  assert.equal(used.eligible,false);
  assert.equal(used.unused,0);
});
test("extra fortnightly payments carry forward, but do not count twice", () => {
  assert.equal(mailPaymentStatus("fortnightly",3,1,"active").eligible,false);
  assert.equal(mailPaymentStatus("fortnightly",4,1,"active").eligible,true);
  assert.equal(mailPaymentStatus("fortnightly",4,2,"active").eligible,false);
  assert.equal(mailPaymentStatus("monthly",2,1,"active").eligible,true);
});
test("cancelled, paused and past-due subscriptions stay on hold", () => {
  for(const status of ["cancelled","cancelling","past_due","paused","pending"]){
    assert.equal(mailPaymentStatus("fortnightly",4,0,status).eligible,false);
  }
});
