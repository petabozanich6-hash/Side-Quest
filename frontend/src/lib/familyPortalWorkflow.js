// Display-only workflow decisions. Server-side booking/payment guards remain authoritative.
export const closedRequest=r=>["closed","resolved"].includes(r?.status);
export const activeOrder=o=>o.status!=="cancelled";
export const rootOrder=o=>!o.package_sequence||o.package_sequence===1;
export const payableOrder=o=>o.installment||rootOrder(o);
export function nextBookingAction(request,quotes=[],orders=[]){
 if(closedRequest(request))return null;
 const active=orders.filter(activeOrder);
 const agreement=active.find(o=>o.status==="awaiting_confirmation"&&rootOrder(o)&&!o.cancellation_pending);
 if(agreement)return {stage:"arrangement",order:agreement.id,label:"Review and confirm arrangements"};
 const payment=active.find(o=>["confirmed","review"].includes(o.status)&&payableOrder(o)&&!o.cancellation_pending);
 if(payment)return {stage:"payment",order:payment.id,label:payment.status==="review"||payment.invoice_overdue?"Review payment status":payment.invoice_payment_url?"View your Square invoice":"View payment arrangements"};
 const offer=quotes.find(q=>q.status==="offered");
 if(offer)return {stage:"proposal",quote:offer.id,label:"Review your proposal"};
 const interested=quotes.find(q=>q.status==="interested"&&!active.some(o=>o.quote_id===q.id));
 if(interested)return {stage:"times",quote:interested.id,label:"Choose appointment times"};
 if(active.length)return {stage:"bookings",label:"View your arrangements"};
 return null;
}
export function orderStatus(o){
 if(o.cancellation_pending)return "Cancellation requested — awaiting confirmation";
 if(o.status==="awaiting_confirmation")return "Provisional — agreement required";
 if(o.status==="confirmed")return o.invoice_overdue?"Payment deadline passed — contact Side-Quest":o.invoice_reference?"Invoice issued — awaiting verified payment":"Provisional — invoice to follow";
 if(o.status==="paid")return "Paid — booking confirmed";
 if(o.status==="review")return "Payment needs review — do not pay again";
 if(o.status==="completed")return "Completed";
 if(o.status==="cancelled")return "Cancelled";
 return String(o.status||"").replaceAll("_"," ");
}
