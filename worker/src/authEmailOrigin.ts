import type {Env} from "./types";
import {SITE_URL} from "./email";
/** Trusted configured origin, never Host, Origin or any caller-supplied URL. */
export function authEmailOrigin(env:Partial<Env>):string|null{
 if(!env.STAGING_KEY&&env.STAGING_PRIVATE!=="true")return SITE_URL;
 if(!env.STAGING_KEY)return null;
 const configured=env.SUPPORT_GUEST_ORIGIN||"";
 try{const u=new URL(configured);return u.protocol==="https:"&&/^side-quest-staging\.[a-z0-9-]+\.workers\.dev$/.test(u.hostname)&&u.origin===configured?configured:null;}catch{return null;}
}
