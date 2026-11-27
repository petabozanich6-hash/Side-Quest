import {initialSlideInteraction,changeSlideInteraction,validateSlideVisual} from "./supportSlideVisuals";
import type {Env} from "./types";
import {getOrder,type Channel} from "./supportOrders";
import {getDeck} from "./supportDecks";
import {presentationImage} from "./supportFiles";
const SQL="CREATE TABLE IF NOT EXISTS support_classrooms (order_id TEXT PRIMARY KEY REFERENCES support_service_orders(id) ON DELETE CASCADE, is_open INTEGER NOT NULL DEFAULT 0 CHECK(is_open IN (0,1)), revision INTEGER NOT NULL DEFAULT 0, board_json TEXT NOT NULL DEFAULT '{\"text\":\"\",\"strokes\":[]}', updated_at TEXT NOT NULL)";
export const classroomEnabled=(env:Env)=>env.SUPPORT_CLASSROOM_ENABLED==="true";
export async function ensureClassrooms(db:D1Database){await db.prepare(SQL).run();}
// A closed request or pending cancellation blocks learner access, including historical bookings.
// Owners retain access to close the room.
const parentBookingGuard="EXISTS(SELECT 1 FROM support_guest_requests r WHERE r.id=o.request_id AND r.status NOT IN ('closed','resolved')) AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=o.id AND c.status='pending')";
const memberBookingGuard="EXISTS(SELECT 1 FROM parent_feedback r WHERE r.id=o.request_id AND r.page_hint='learning-support' AND r.status NOT IN ('closed','resolved')) AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=o.id AND c.status='pending')";
const empty=()=>({text:"",strokes:[] as any[],slide:null as any,image:null as any});
export async function classroomState(db:D1Database,channel:Channel,id:string,oid:string,owner:boolean,now=new Date()){
 const order=await getOrder(db,channel,id,oid);
 if(!order||order.mode!=="live"||order.status!=="paid"||order.legacy_checkout||order.checkout_started_at||!order.start_at||!order.end_at)return null;
 if(!owner&&channel==="guest"&&await db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='support_portal_enquiry_origins'").first()&&!await db.prepare("SELECT 1 FROM support_service_orders o WHERE o.id=? AND "+parentBookingGuard).bind(oid).first())return null;
 if(!owner&&channel==="member"&&!await db.prepare("SELECT 1 FROM support_service_orders o WHERE o.id=? AND "+memberBookingGuard).bind(oid).first())return null;
 const t=now.getTime(),start=Date.parse(order.start_at),end=Date.parse(order.end_at);
 if(!Number.isFinite(start)||!Number.isFinite(end))return null;
 // Owner may inspect preparation status, but neither party can edit outside the session window.
 const inWindow=t>=start-10*60000&&t<=end+10*60000;
 await ensureClassrooms(db);
 const row=await db.prepare("SELECT * FROM support_classrooms WHERE order_id=?").bind(oid).first<any>();
 const open=inWindow&&row?.is_open===1;
 return {in_window:inWindow,open,revision:Number(row?.revision||0),board:open||owner&&inWindow?(row?JSON.parse(row.board_json):empty()):empty(),start_at:order.start_at,end_at:order.end_at};
}
export async function setClassroomOpen(db:D1Database,channel:Channel,id:string,oid:string,open:boolean,now=new Date()){
 const state=await classroomState(db,channel,id,oid,true,now);
 if(!state?.in_window)return false;
 // Check payment status again at write time, including manual refunds/review states.
 const r=await db.prepare("INSERT INTO support_classrooms(order_id,is_open,updated_at) SELECT id,?,? FROM support_service_orders WHERE id=? AND channel=? AND request_id=? AND status='paid' AND mode='live' AND checkout_started_at IS NULL ON CONFLICT(order_id) DO UPDATE SET is_open=excluded.is_open,revision=support_classrooms.revision+1,updated_at=excluded.updated_at").bind(open?1:0,now.toISOString(),oid,channel,id).run();
 return !!r.meta?.changes;
}
export async function editClassroom(db:D1Database,channel:Channel,id:string,oid:string,owner:boolean,b:Record<string,unknown>,now=new Date()){
 const state=await classroomState(db,channel,id,oid,owner,now);
 if(!state?.open)return {error:"The classroom is not open."};
 if(!Number.isInteger(b.revision)||b.revision!==state.revision)return {error:"The board changed. Refresh and try again."};
 const board=state.board;
 if(b.action==="stroke"){
  const points=b.points,color=b.color;
  if(!Array.isArray(points)||points.length<2||points.length>160||!["#163b2c","#2563eb","#b91c1c","#111827"].includes(String(color))||!points.every(p=>Array.isArray(p)&&p.length===2&&p.every(n=>typeof n==="number"&&Number.isFinite(n)&&n>=0&&n<=1)))return {error:"Invalid drawing."};
  if(board.strokes.length>=100)return {error:"Board is full. Ask the tutor to clear it."};
  board.strokes.push({points:points.map(p=>p.map((n:number)=>Math.round(n*10000)/10000)),color});
 }else if(b.action==="text"&&owner&&typeof b.text==="string"&&b.text.length<=2000)board.text=b.text;
 else if(b.action==="clear"&&owner&&b.confirmed===true){board.strokes=[];board.text="";}
 else if(b.action==="hide-slide"&&owner)board.slide=null;
 else if(b.action==="hide-image"&&owner)board.image=null;
 else if(b.action==="present-image"&&owner&&typeof b.file_id==="string"){
  const image=await presentationImage(db,b.file_id);if(!image)return {error:"Choose an active learner-facing PNG or JPEG."};
  board.image={id:image.id,title:image.title};board.slide=null;
 }
 else if(b.action==="slide-interact"){
  const next=changeSlideInteraction(board.slide?.visual,board.slide?.interaction,b,owner);
  if(!next)return {error:"This visual action is not available for the current slide."};
  board.slide.interaction=next;
 }
 else if(b.action==="present"&&owner&&typeof b.deck_id==="string"&&typeof b.index==="number"&&Number.isInteger(b.index)){
  const deck=await getDeck(db,b.deck_id);
  if(!deck||deck.status!=="reviewed"||deck.revision!==b.deck_revision||b.index<0||b.index>=deck.slides.length)return {error:"Only current, reviewed resources can be presented."};
  const s=deck.slides[b.index];
  board.image=null;
  const visual=validateSlideVisual(s.visual);
  board.slide={title:deck.title,heading:s.heading,body:s.body,kind:s.kind,number:b.index+1,total:deck.slides.length,...(visual?{visual,interaction:initialSlideInteraction(visual)}:{})};
 }
 else return {error:"This board action is not available."};
 const json=JSON.stringify(board);if(json.length>220000)return {error:"Board is full."};
 const guard=!owner&&channel==="member"?" AND "+memberBookingGuard:!owner&&channel==="guest"&&await db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='support_portal_enquiry_origins'").first()?" AND "+parentBookingGuard:"";
 const r=await db.prepare("UPDATE support_classrooms SET board_json=?,revision=revision+1,updated_at=? WHERE order_id=? AND revision=? AND is_open=1 AND EXISTS(SELECT 1 FROM support_service_orders o WHERE o.id=support_classrooms.order_id AND o.channel=? AND o.request_id=? AND o.status='paid' AND o.checkout_started_at IS NULL"+guard+")").bind(json,now.toISOString(),oid,state.revision,channel,id).run();
 if(!r.meta?.changes)return {error:"The board changed or the room closed. Refresh and try again."};
 return {ok:true};
}

export async function canReadClassroomImage(db:D1Database,channel:Channel,id:string,oid:string,fid:string,owner:boolean,now=new Date()){
 const s=await classroomState(db,channel,id,oid,owner,now);
 return !!s?.open&&s.board.image?.id===fid&&!!await presentationImage(db,fid);
}
