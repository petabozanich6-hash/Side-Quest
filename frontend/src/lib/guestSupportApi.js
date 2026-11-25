// Separate credential; never attach the homeschool JWT or persist into localStorage.
const KEY="sq_support_guest";
export function guestToken(){try{return sessionStorage.getItem(KEY)||"";}catch{return "";}}
export function setGuestToken(value){try{if(value)sessionStorage.setItem(KEY,value);else sessionStorage.removeItem(KEY);}catch{}}
export async function guestRequest(path,body,token=guestToken()){
 const response=await fetch("/api/support-guest"+path,{method:body===undefined?"GET":"POST",credentials:"same-origin",cache:"no-store",headers:{"Content-Type":"application/json",...(token?{"X-SideQuest-Guest":token}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
 const data=await response.json().catch(()=>({}));
 if(!response.ok){if(response.status===401)setGuestToken("");const error=new Error(data.detail||"Could not reach Learning Support");error.response={status:response.status,data};throw error;}
 return {data};
}
export const guestApi={get:path=>guestRequest(path),post:(path,body)=>guestRequest(path,body)};
