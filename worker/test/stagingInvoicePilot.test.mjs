import test from "node:test";
import assert from "node:assert/strict";
import {configureStagingInvoicePilot} from "../scripts/configure-staging-invoice-pilot.mjs";
const config={name:"side-quest-staging",vars:{STAGING_PRIVATE:"true"},d1_databases:[{binding:"DB",database_name:"sidequest-staging",database_id:"synthetic"}]};
const env={ENABLE_INVOICE_PILOT:"true",STAGING_SUPPORT_ORIGIN:"https://side-quest-staging.test.workers.dev",STAGING_SQUARE_APPLICATION_ID:"sandbox-sq0idb-test",STAGING_SQUARE_LOCATION_ID:"LOCATION123",STAGING_SQUARE_ACCESS_TOKEN:"TEST_TOKEN_PRIVATE",STAGING_SQUARE_WEBHOOK_SIGNATURE_KEY:"TEST_SIGN_PRIVATE",STAGING_SUPPORT_TEST_EMAIL:"test@example.com"};
test("pilot defaults off; only isolated sandbox config can enable it; no secret in config",()=>{
 const off=configureStagingInvoicePilot(config,{});
 assert.equal(off.vars.SUPPORT_SQUARE_INVOICE_TEST,"false");
 assert.equal(off.vars.SUPPORT_GUEST_ENABLED,"false");
 const on=configureStagingInvoicePilot(config,env);
 assert.equal(on.vars.SUPPORT_SQUARE_INVOICE_TEST,"true");
 assert.equal(on.vars.SUPPORT_UNIFIED_PORTAL_TEST,"true");
 assert.equal(on.vars.SUPPORT_GUEST_ENABLED,"true");
 assert.equal(on.vars.SUPPORT_SQUARE_INVOICE_NOTICE_TEST,"false");
 assert.equal(on.vars.SQUARE_WEBHOOK_URL,env.STAGING_SUPPORT_ORIGIN+"/api/billing/square-webhook");
 for(const secret of [env.STAGING_SQUARE_ACCESS_TOKEN,env.STAGING_SQUARE_WEBHOOK_SIGNATURE_KEY,env.STAGING_SUPPORT_TEST_EMAIL])assert.equal(JSON.stringify(on).includes(secret),false);
 assert.throws(()=>configureStagingInvoicePilot({...config,name:"side-quest"},env));
 assert.throws(()=>configureStagingInvoicePilot({...config,d1_databases:[{binding:"DB",database_name:"sidequest-db1"}]},env));
 assert.throws(()=>configureStagingInvoicePilot({...config,r2_buckets:[{bucket_name:"production"}]},env));
 assert.throws(()=>configureStagingInvoicePilot({...config,routes:["sidequestlearning.app/*"]},env));
 assert.throws(()=>configureStagingInvoicePilot(config,{...env,STAGING_SQUARE_APPLICATION_ID:"sq0idp-live"}));
 assert.throws(()=>configureStagingInvoicePilot(config,{...env,STAGING_SUPPORT_ORIGIN:"https://sidequestlearning.app"}));
 assert.throws(()=>configureStagingInvoicePilot(config,{...env,STAGING_SQUARE_ACCESS_TOKEN:""}));
 assert.equal(config.vars.SUPPORT_SQUARE_INVOICE_TEST,undefined);
 assert.equal(configureStagingInvoicePilot(on,{}).vars.SQUARE_WEBHOOK_URL,undefined);
});

test("private unified family portal can be enabled without payment or mail configuration",()=>{
 const portal=configureStagingInvoicePilot(config,{ENABLE_FAMILY_PORTAL:"true",ENABLE_INVOICE_PILOT:"false"});
 assert.equal(portal.vars.SUPPORT_UNIFIED_PORTAL_TEST,"true");
 assert.equal(portal.vars.SUPPORT_SQUARE_INVOICE_TEST,"false");
 assert.equal(portal.vars.SUPPORT_SQUARE_INVOICE_NOTICE_TEST,"false");
 assert.equal(portal.vars.SQUARE_WEBHOOK_URL,undefined);
 assert.equal(portal.vars.SQUARE_APPLICATION_ID,undefined);
 assert.equal(portal.vars.SUPPORT_GUEST_ORIGIN,undefined);
 assert.equal(portal.vars.SUPPORT_GUEST_ENABLED,"false");
 const withOrigin=configureStagingInvoicePilot(config,{ENABLE_FAMILY_PORTAL:"true",STAGING_SUPPORT_ORIGIN:env.STAGING_SUPPORT_ORIGIN});
 assert.equal(withOrigin.vars.SUPPORT_GUEST_ORIGIN,env.STAGING_SUPPORT_ORIGIN);
 assert.equal(withOrigin.vars.SUPPORT_GUEST_ENABLED,"true");
 assert.equal(configureStagingInvoicePilot(withOrigin,{}).vars.SUPPORT_GUEST_ENABLED,"false");
 assert.throws(()=>configureStagingInvoicePilot(config,{ENABLE_FAMILY_PORTAL:"true",STAGING_SUPPORT_ORIGIN:"https://sidequestlearning.app"}));
 const disabled=configureStagingInvoicePilot(portal,{ENABLE_FAMILY_PORTAL:"false"});
 assert.equal(disabled.vars.SUPPORT_UNIFIED_PORTAL_TEST,"false");
});

test("staging admin allowlist uses only the explicit validated origin, even when Square is disabled",()=>{
 const origin="https://side-quest-staging.test.workers.dev";
 const configured=configureStagingInvoicePilot(config,{ENABLE_FAMILY_PORTAL:"true",STAGING_ORIGIN_INPUT:origin+"/"});
 assert.equal(configured.vars.ADMIN_ORIGINS,origin);
 assert.equal(configured.vars.SUPPORT_GUEST_ORIGIN,origin);
 assert.equal(configured.vars.SUPPORT_SQUARE_INVOICE_TEST,"false");
 assert.equal(configureStagingInvoicePilot(config,{STAGING_SUPPORT_ORIGIN:origin}).vars.ADMIN_ORIGINS,origin);
 assert.throws(()=>configureStagingInvoicePilot(config,{STAGING_ORIGIN_INPUT:"https://sidequestlearning.app"}));
 assert.throws(()=>configureStagingInvoicePilot(config,{STAGING_ORIGIN_INPUT:origin+"/api/staging-access"}));
 assert.throws(()=>configureStagingInvoicePilot(config,{STAGING_ORIGIN_INPUT:origin+"?key=private"}));
 assert.throws(()=>configureStagingInvoicePilot(config,{STAGING_ORIGIN_INPUT:"https://other.test.workers.dev"}));
 assert.equal(configureStagingInvoicePilot(configured,{}).vars.ADMIN_ORIGINS,undefined);
});

test("metered resource AI is opt-in, isolated, and removed when disabled",()=>{
 const e={ENABLE_RESOURCE_AI:"true",ENABLE_FAMILY_PORTAL:"true",STAGING_SUPPORT_ORIGIN:env.STAGING_SUPPORT_ORIGIN};
 const on=configureStagingInvoicePilot(config,e);
 assert.equal(on.vars.SUPPORT_RESOURCE_AI,"true");assert.deepEqual(on.ai,{binding:"AI"});
 const off=configureStagingInvoicePilot(on,{});assert.equal(off.vars.SUPPORT_RESOURCE_AI,"false");assert.equal(off.ai,undefined);
 assert.throws(()=>configureStagingInvoicePilot(config,{ENABLE_RESOURCE_AI:"true"}));
 assert.throws(()=>configureStagingInvoicePilot(config,{...e,STAGING_SUPPORT_ORIGIN:"https://sidequestlearning.app"}));
});
