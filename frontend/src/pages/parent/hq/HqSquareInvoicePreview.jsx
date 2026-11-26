import React,{useEffect,useState} from "react";
import {Link,useLocation} from "react-router-dom";
import {adminApi} from "../../../lib/adminApi";

// A link, not an embedded invoice form. The focused route owns the entire workflow.
export default function HqSquareInvoicePreview({order,requestId,guest,children}){
 const [state,setState]=useState(null),location=useLocation();
 const key=[guest?"guest":"member",requestId,order.id].map(encodeURIComponent).join("/");
 useEffect(()=>{let live=true;setState(null);adminApi.get("/support-invoice-lookup/status").then(async r=>{
  if(!r.available){if(live)setState({available:false});return;}
  try{const workspace=await adminApi.get("/support-invoice-workspace/"+key);if(live)setState({available:true,workspace});}
  catch{if(live)setState({available:true,error:true});}
 }).catch(()=>{if(live)setState({available:false});});return()=>{live=false;};},[key]);
 if(!state)return <p className="text-sm" role="status">Checking invoice options…</p>;
 if(!state.available)return children||null;
 if(state.error)return <p role="alert" className="text-sm">Invoice workspace unavailable. Check its saved status before using manual payment options.</p>;
 const {workspace}=state;
 if(!workspace.intent&&!workspace.eligible)return children||null;
 return <div className="space-y-2"><Link to={"/parent/command-centre/learning-support/invoice/"+key} state={{from:location.pathname+location.search}} className="inline-block rounded-xl bg-emerald-950 text-white px-4 py-2 text-sm font-semibold">{workspace.intent?"Continue invoice review":"Open invoice review"} →</Link>
 {workspace.intent?<p className="text-xs">A saved Square preparation exists. Use invoice review rather than starting another payment method.</p>:<details className="border rounded-lg p-2"><summary className="cursor-pointer text-sm">Manual invoice alternative</summary>{children}</details>}</div>;
}
