// A separately prepared, self-hosted exact-version browser bundle. No runtime CDN or npm dependency.
const PATH="/vendor/realtimekit-2.1.0/browser.js";
let loading;
export function loadSupportVideoSdk(){
 if(window.RealtimeKitClient?.init)return Promise.resolve(window.RealtimeKitClient);
 if(loading)return loading;
 loading=new Promise((resolve,reject)=>{
  const script=document.createElement("script");script.src=PATH;script.async=true;
  const timeout=setTimeout(()=>fail(),15000);
  function fail(){clearTimeout(timeout);script.remove();reject(new Error("The staged video SDK is unavailable. The teaching board is still available."));}
  script.onerror=fail;
  script.onload=()=>{clearTimeout(timeout);if(window.RealtimeKitClient?.init)resolve(window.RealtimeKitClient);else fail();};
  document.head.appendChild(script);
 }).catch(e=>{loading=null;throw e;});
 return loading;
}
