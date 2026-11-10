import {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {API} from "../../lib/api";

// Public landing/shop traffic only. Don't observe private family, child or owner pages.
// No cookies, user identifiers, query parameters, referrers or personal data are sent.
export default function SiteTrafficTracker(){
 const {pathname}=useLocation();
 useEffect(()=>{
  const path=pathname.replace(/\/+$/,"")||"/";
  if(!(["/","/shop","/login","/register","/get-app","/forgot-password"].includes(path)||/^\/shop\/configure-planner\/[0-9a-f-]{36}$/i.test(path)||/^\/parent\/trust(?:\/[a-z0-9-]+)?$/.test(path)))return;
  try{
   const key="sq-public-traffic-tab";
   let session=sessionStorage.getItem(key);
   if(!session){session=crypto.randomUUID();sessionStorage.setItem(key,session);}
   fetch(API+"/traffic/view",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path,session}),keepalive:true,credentials:"omit"}).catch(()=>{});
  }catch{/* Analytics must never disrupt browsing */}
 },[pathname]);
 return null;
}
