import type {Env} from "./types";
import {squareConfig,squareCall,type Fetch} from "./square";
import {getOrder,hasSquareInvoiceIntent,supportPaymentsEnabled,type Channel} from "./supportOrders";
export async function prepareSupportCheckout(env:Env,channel:Channel,id:string,oid:string,fetchImpl?:Fetch){
 if(!supportPaymentsEnabled(env))return {error:"Tutoring checkout is disabled until isolated Square sandbox testing is complete."};
 const cfg=squareConfig(env);if(!cfg.ok||cfg.production)return {error:"Square sandbox is not configured."};
 const row=await getOrder(env.DB,channel,id,oid);
 if(!row||row.status!=="confirmed"||row.amount_cents<=0)return {error:"Confirm the service before preparing checkout."};
 if(await hasSquareInvoiceIntent(env.DB,oid))return {error:"A prepared Square invoice requires owner reconciliation before starting checkout."};
 if(row.checkout_url)return {url:row.checkout_url};
 if(row.start_at&&row.start_at<=new Date().toISOString())return {error:"Appointment time has passed; review the order."};
 // Stable Square idempotency key, including recovery if a network response is lost.
 const claimed=await env.DB.prepare("UPDATE support_service_orders SET checkout_started_at=COALESCE(checkout_started_at,?),updated_at=? WHERE id=? AND status='confirmed'").bind(new Date().toISOString(),new Date().toISOString(),oid).run();
 if(!claimed.meta?.changes)return {error:"Order no longer available."};
 const result=await squareCall(cfg,"POST","online-checkout/payment-links",{idempotency_key:oid,quick_pay:{name:"Side-Quest Learning Support",price_money:{amount:row.amount_cents,currency:"AUD"},location_id:cfg.locationId}},fetchImpl);
 const link=result?.payment_link;
 if(!link?.id||!link?.order_id||typeof link.url!=="string"||!/^https:\/\/(sandbox\.square\.link|square\.link|checkout\.square\.site)\//.test(link.url))throw Error("Square returned an unexpected checkout response");
 await env.DB.prepare("UPDATE support_service_orders SET square_order_id=?,square_link_id=?,checkout_url=?,updated_at=? WHERE id=? AND status='confirmed' AND (square_order_id IS NULL OR square_order_id=?)").bind(link.order_id,link.id,link.url,new Date().toISOString(),oid,link.order_id).run();
 return {url:link.url};
}
