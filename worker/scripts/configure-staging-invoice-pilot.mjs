import {readFileSync,writeFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";

// Never log input values or write secret values into a Wrangler config.
export function configureStagingInvoicePilot(config,e){
 if(config.name!=="side-quest-staging"||config.vars?.STAGING_PRIVATE!=="true"||config.d1_databases?.length!==1||
 config.d1_databases[0].binding!=="DB"||config.d1_databases[0].database_name!=="sidequest-staging"||
 config.routes?.length||config.route||config.env||config.r2_buckets?.some(b=>b.bucket_name!=="sidequest-staging-files"))
 throw Error("Refusing to configure a non-isolated staging Worker.");
 const vars={...config.vars,SUPPORT_UNIFIED_PORTAL_TEST:"false",SUPPORT_SQUARE_INVOICE_TEST:"false",SUPPORT_SQUARE_INVOICE_NOTICE_TEST:"false"};
 for(const key of ["SQUARE_APPLICATION_ID","SQUARE_LOCATION_ID","SQUARE_WEBHOOK_URL","SUPPORT_GUEST_ORIGIN"])delete vars[key];
 if(e.ENABLE_INVOICE_PILOT==="true"){
  const origin=e.STAGING_SUPPORT_ORIGIN||"";
  if(!/^https:\/\/side-quest-staging\.[a-z0-9-]+\.workers\.dev$/.test(origin))throw Error("Missing or invalid private staging origin.");
  if(!/^sandbox-sq0idb-[A-Za-z0-9_-]+$/.test(e.STAGING_SQUARE_APPLICATION_ID||""))throw Error("A Square sandbox application ID is required.");
  if(!/^[A-Z0-9]{8,32}$/.test(e.STAGING_SQUARE_LOCATION_ID||""))throw Error("A Square sandbox location ID is required.");
  if(!e.STAGING_SQUARE_ACCESS_TOKEN||!e.STAGING_SQUARE_WEBHOOK_SIGNATURE_KEY||!e.STAGING_SUPPORT_TEST_EMAIL||
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.STAGING_SUPPORT_TEST_EMAIL))throw Error("Private staging sandbox secrets or synthetic test recipient missing.");
  Object.assign(vars,{SUPPORT_UNIFIED_PORTAL_TEST:"true",SUPPORT_SQUARE_INVOICE_TEST:"true",SUPPORT_GUEST_ORIGIN:origin,
   SQUARE_APPLICATION_ID:e.STAGING_SQUARE_APPLICATION_ID,SQUARE_LOCATION_ID:e.STAGING_SQUARE_LOCATION_ID,SQUARE_WEBHOOK_URL:origin+"/api/billing/square-webhook"});
 }
 return {...config,vars};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const path=process.argv[2];if(path!=="wrangler.staging.jsonc")throw Error("Only the dedicated staging config is supported.");
 const raw=readFileSync(path,"utf8").split("\n").filter(l=>!l.trim().startsWith("//")).join("\n");
 const config=configureStagingInvoicePilot(JSON.parse(raw),process.env);
 writeFileSync(path,JSON.stringify(config,null,2)+"\n");
 console.log("Private staging config validated; invoice pilot "+(config.vars.SUPPORT_SQUARE_INVOICE_TEST==="true"?"enabled":"disabled")+". Email delivery remains disabled.");
}
