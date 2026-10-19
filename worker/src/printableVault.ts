import type { App, Guards } from "./types";
import { getEntitlement } from "./lessonBuilder";
import { isPlatformOwner } from "./access";
import { renderVaultSvg, type VaultPicture } from "./printableVaultSvg";

// Only original, activity-first illustrated printables remain in the catalogue.
// Old question sheets have been retired, including their former PDF endpoints.
export const VAULT_ITEMS:VaultPicture[]=[
 {id:"lost-treasure-maze",title:"The Dragon's Lost Treasure Maze",pages:2,category:"Mazes & Puzzles",ages:"5-10",minutes:20,kind:"maze",theme:"Dragons",collection:"activity-puzzles",materials:"Colouring pencils",description:"Find the treasure across two playable dragon cave mazes.",guide:["Two mazes: easy and tricky.","Start at the upper left and finish at the lower right.","Print at A4 100%. Colour the drawings after solving."]},
 {id:"moving-dragon-puppet",title:"Build-a-Dragon Moving Puppet",pages:2,category:"Colour, Cut & Create",ages:"6-12",minutes:40,kind:"craft",theme:"Dragons",collection:"activity-build",materials:"Scissors, colours, split pins",description:"Cut and assemble a dragon with movable wings and other pieces.",guide:["Colour before cutting; reinforce with thin card if desired.","Cut along the outer shapes and make marked pin holes with adult help.","Use split pins at moving joints, not glue."]},
 {id:"enchanted-castle-colouring",title:"Enchanted Castle Colouring Adventure",pages:2,category:"Colouring & Creativity",ages:"7-Adult",minutes:35,kind:"colouring",theme:"Fantasy",collection:"activity-art",materials:"Coloured pencils",description:"Colour an illustrated castle, dragons, pumpkins and tiny hidden gems.",guide:["Two themed fantasy scenes.","Look for gems and small decorations to colour.","There is no right way to finish this drawing."]},
 {id:"race-to-hoard",title:"Race to the Dragon's Hoard",pages:2,category:"Print & Play Games",ages:"6-13",minutes:30,kind:"game",theme:"Dragons",collection:"activity-play",materials:"Scissors, glue, colours",description:"A complete 36-space board game with paper die and tokens.",guide:["Cut out the four tokens; fold the six-sided die.","Take turns moving forward by the rolled amount.","Star means extra turn; bat means back one; ghost means forward two.","First to space 36 wins; exact roll not needed."]},
 {id:"paper-medieval-castle",title:"Build Your Own Medieval Castle",pages:2,category:"Colour, Cut & Create",ages:"8-15",minutes:45,kind:"craft",theme:"Medieval",collection:"activity-build",materials:"Scissors, glue, coloured pencils",description:"Colour and assemble a model castle from folding wall panels and roof.",guide:["Colour walls and roof before cutting.","Cut SOLID outer outlines, fold DASHED seams.","Glue the narrow tab inside the castle.","Fold and attach the roof; thin card helps."]},
 {id:"design-dragon-egg",title:"Design a Dragon Egg",pages:2,category:"Colour, Cut & Create",ages:"5-12",minutes:30,kind:"craft",theme:"Dragons",collection:"activity-build",materials:"Scissors, glue, colouring pencils",description:"Decorate patterned dragon eggs and craft a baby dragon nest.",guide:["Colour and cut the three illustrated egg shapes.","Cut and decorate the baby dragon on page two.","Fold the nest strip into a ring and glue the tab."]},
 {id:"forest-detective",title:"Forest Creature Detective",pages:2,category:"Print & Play Games",ages:"6-11",minutes:25,kind:"game",theme:"Nature",collection:"activity-play",materials:"Scissors, colouring pencils",description:"Cut-out picture cards to sort, match and invent a woodland mystery.",guide:["Cut out and colour all the picture cards.","Match similar creatures and invent tracks or habitats.","Play face-down matching games with the cards."]},
 {id:"potion-spinner",title:"The Potion-Maker's Spinner",pages:2,category:"Print & Play Games",ages:"8-14",minutes:35,kind:"game",theme:"Magic",collection:"activity-play",materials:"Scissors, two split pins, colours",description:"Two working spinner wheels for pretend potion combinations.",guide:["Cut the two labelled spinner wheels and arrows.","Adult helps punch the pivot holes; attach arrows with split pins.","Spin both and invent a fictional potion.","No real potions or chemicals."]},
 {id:"illusion-gallery",title:"The Impossible Illusion Gallery",pages:2,category:"Mazes & Puzzles",ages:"12-Adult",minutes:30,kind:"puzzle",theme:"Geometry",collection:"activity-art",materials:"Two coloured pencils, scissors",description:"Colour optical illusions and cut geometric tiles into a tessellation.",guide:["Alternate strongly contrasting colours in each ring.","Cut out the triangular tiles on page two.","Rearrange the shapes into repeating patterns."]},
 {id:"goblin-workshop-escape",title:"Escape the Goblin Workshop",pages:2,category:"Mazes & Puzzles",ages:"10-16",minutes:40,kind:"puzzle",theme:"Escape Game",collection:"activity-puzzles",materials:"Scissors, split pin, pencil",description:"Unlock the workshop with a spinning decoder and picture-code puzzle.",guide:["Join the alphabet wheels at their centres.","Shift encrypted letters back three places to reveal GOBLIN.","For the final picture lock use 4 - 2 - 7."]},
 {id:"haunted-castle-maze",title:"Haunted Castle Maze",pages:2,category:"Mazes & Puzzles",ages:"5-10",minutes:20,kind:"maze",theme:"Halloween",collection:"halloween-puzzles",materials:"Pencil, colours",description:"Make it through two winding haunted castle mazes to find a pumpkin.",guide:["Solve both mazes from start to exit.","The second maze is more challenging.","Decorate the spooky castle, pumpkin and spiderwebs."]},
 {id:"spiderweb-maze-pack",title:"Spiderweb Maze Pack",pages:3,category:"Mazes & Puzzles",ages:"6-12",minutes:25,kind:"maze",theme:"Halloween",collection:"halloween-puzzles",materials:"Pencil, colours",description:"Three increasingly tricky spooky mazes with illustrated cobwebs.",guide:["Three mazes: easy, medium and tricky.","Start at the upper left; exit at the lower right.","Colour spiders and webs when you finish."]},
 {id:"build-a-bat-puppet",title:"Build-a-Bat Puppet",pages:2,category:"Colour, Cut & Create",ages:"6-12",minutes:35,kind:"craft",theme:"Halloween",collection:"halloween-build",materials:"Scissors, split pins, colouring pencils",description:"Colour and assemble a flapping bat with two movable wings.",guide:["Colour and cut the bat body and wings.","Ask an adult to make pivot holes.","Connect each wing to the body with split pins.","Do not glue moving joints."]},
 {id:"pumpkin-face-creator",title:"Pumpkin Face Creator",pages:2,category:"Colour, Cut & Create",ages:"5-11",minutes:30,kind:"craft",theme:"Halloween",collection:"halloween-build",materials:"Scissors, tape, colours",description:"Mix and match spooky, silly pumpkin eyes, noses, grins and hats.",guide:["Colour the big pumpkin first.","Cut out face pieces on page two.","Use removable tape for endlessly changing faces."]},
 {id:"paper-haunted-house",title:"Build a Paper Haunted House",pages:2,category:"Colour, Cut & Create",ages:"8-14",minutes:45,kind:"craft",theme:"Halloween",collection:"halloween-build",materials:"Scissors, glue, colouring pencils",description:"Build a little paper haunted house with foldable walls, roof and ghosts.",guide:["Colour the walls and roof.","Cut solid outlines, fold dashed seams.","Glue tabs into a house shape and attach the roof.","Optional: cut extra ghosts, pumpkins and bats."]},
 {id:"trick-or-treat-board-game",title:"Trick-or-Treat Adventure",pages:2,category:"Print & Play Games",ages:"6-13",minutes:30,kind:"game",theme:"Halloween",collection:"halloween-play",materials:"Scissors, glue, colours",description:"Roll a paper die to race through pumpkins, bats and ghosts.",guide:["Cut tokens and fold paper die.","Move the number of spaces rolled.","Pumpkin means extra roll; bat means back one; ghost means forward two.","Reach square 36 to win."]},
 {id:"monster-match-up",title:"Monster Match-Up",pages:2,category:"Print & Play Games",ages:"6-11",minutes:25,kind:"game",theme:"Halloween",collection:"halloween-play",materials:"Scissors, colouring pencils",description:"Colour and cut monster picture cards to play matching games.",guide:["Colour and cut creature cards.","Mix and play matching games or invent a creature story.","For extra challenge, print twice to make pairs."]},
 {id:"halloween-potion-spinner",title:"Halloween Potion Lab Spinner",pages:2,category:"Print & Play Games",ages:"8-14",minutes:35,kind:"game",theme:"Halloween",collection:"halloween-play",materials:"Scissors, two split pins, colours",description:"Cut two Halloween spinner wheels to invent silly, imaginary potions.",guide:["Cut wheels and arrows and pin with adult assistance.","Spin ingredient and effect wheels to imagine potions.","Never mix or drink real ingredients or chemicals."]},
 {id:"halloween-colouring-adventure",title:"Halloween Colouring Adventure",pages:2,category:"Colouring & Creativity",ages:"6-Adult",minutes:35,kind:"colouring",theme:"Halloween",collection:"halloween-art",materials:"Colouring pencils",description:"Detailed fantasy Halloween scenes with castles, bats and dragons.",guide:["Colour the full illustrated scene.","Look for hidden gems and decorative details.","No assigned answer or mandatory written work."]},
 {id:"escape-pumpkin-patch",title:"Escape the Pumpkin Patch",pages:2,category:"Mazes & Puzzles",ages:"9-15",minutes:40,kind:"puzzle",theme:"Halloween",collection:"halloween-puzzles",materials:"Scissors, split pin, pencil",description:"Assemble a cipher wheel and solve the Halloween code to escape.",guide:["Assemble the two cipher wheels with a split pin.","Decode the secret message with a backwards shift of three.","Use picture counting for the final code, 4 - 2 - 7."]}
];

/** Owner-approved preview *images*, never check these originals into this public repository.
 * Their private R2 keys are the only asset source for the gallery and printing. */
const PREMIUM_IDS=[
 "lost-treasure-maze","moving-dragon-puppet","enchanted-castle-colouring",
 "race-to-hoard","paper-medieval-castle","haunted-castle-maze",
 "build-a-bat-puppet","pumpkin-face-creator",
 "trick-or-treat-board-game","halloween-colouring-adventure"
] as const;

const premiumSet=new Set<string>(PREMIUM_IDS);
const premiumItems=VAULT_ITEMS.filter(i=>premiumSet.has(i.id));
const knownItems=new Map(VAULT_ITEMS.map(item=>[item.id,item]));
const ROOT_PREFIX="printable-vault/illustrated-v1/";
const VALID_ID=/^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/;
const premiumPath=(id:string,variant:"colour"|"ink")=>
 ROOT_PREFIX+id+(variant==="ink"?"-ink":"")+".png";
const BYTES_LIMIT=7_000_000;
const isPng=(data:ArrayBuffer)=>{
 const b=new Uint8Array(data);
 const magic=[137,80,78,71,13,10,26,10];
 if(b.length<33 || !magic.every((v,i)=>b[i]===v))return false;
 const dv=new DataView(data);
 const width=dv.getUint32(16),height=dv.getUint32(20);
 // Actual printable images may have different resolutions; constrain to legible portrait pages.
 return width>=768&&height>=1000&&width<=10000&&height<=14000&&width/height>=.55&&width/height<=.90;
};

export const VAULT_BUNDLES=[
 {id:"halloween-puzzles",title:"Spooky Mazes & Escapes",description:"Haunted castles, spiderwebs and a pumpkin-patch escape."},
 {id:"halloween-build",title:"Halloween Colour, Cut & Create",description:"Moving bat, silly pumpkin faces and paper haunted house."},
 {id:"halloween-play",title:"Halloween Print & Play",description:"A trick-or-treat board game, monster cards and potion spinner."},
 {id:"halloween-art",title:"Halloween Colouring",description:"Two detailed fantasy Halloween colouring scenes."},
 {id:"activity-puzzles",title:"Mazes & Escape Quests",description:"Find lost treasure and solve an escape-room code."},
 {id:"activity-build",title:"Colour, Cut & Build",description:"Moving dragon puppet, castle model and dragon eggs."},
 {id:"activity-art",title:"Colour & Create",description:"Colour fantasy castles and optical illusions."},
 {id:"activity-play",title:"Print & Play",description:"Board game, picture cards and magical potion wheels."}
];


export const VAULT_ART_REVIEW_ONLY=false;
type Variant="colour"|"ink";
type VaultMeta={title:string;category:string;kind:string;ages:string;theme:string;collection:string;materials:string};
type InventoryItem={id:string;colour:boolean;ink:boolean;meta?:Partial<VaultMeta>;updated?:number};
const textValue=(value:string|undefined,max:number)=>String(value||"").replace(/[\x00-\x1f\x7f]/g,"").trim().slice(0,max);
const readableTitle=(id:string)=>id.replace(/^sidequest-/,"").split("-").filter(Boolean).map(x=>x.charAt(0).toUpperCase()+x.slice(1)).join(" ");
const FALLBACK_META=(id:string):VaultMeta=>({
 title:readableTitle(id),category:"Learning & Discovery",kind:"activity",ages:"All ages",
 theme:"Discovery",collection:"new-adventures",materials:"Pencils or colouring supplies"
});
const metaFor=(id:string,meta?:Partial<VaultMeta>):VaultPicture=>{
 const known=knownItems.get(id);
 if(known)return known;
 const defaults=FALLBACK_META(id);
 const m={...defaults,...meta};
 return {id,title:textValue(m.title,120)||defaults.title,pages:1,
   category:textValue(m.category,60)||defaults.category,
   ages:textValue(m.ages,30)||defaults.ages,minutes:25,
   kind:textValue(m.kind,30)||defaults.kind,
   theme:textValue(m.theme,50)||defaults.theme,
   collection:"new-adventures",
   materials:textValue(m.materials,100)||defaults.materials,
   description:"Original Side-Quest printable activity: "+(textValue(m.title,120)||defaults.title)+".",
   guide:[]};
};
const itemMeta=(i:VaultPicture,available:boolean,inkAvailable:boolean)=>({
 id:i.id,title:i.title,category:i.category,ages:i.ages,minutes:i.minutes,
 kind:i.kind,description:i.description,materials:i.materials,theme:i.theme,
 collection:i.collection,pages:1,format:"png",available,ink_available:inkAvailable
});

/** Discover the owner's entire private collection in R2. Older approved art has no
 * R2 metadata, so keep its original descriptions while allowing unlimited new slugs. */
async function getInventory(bucket:R2Bucket|undefined):Promise<InventoryItem[]>{
 const found=new Map<string,InventoryItem>();
 for(const old of premiumItems)found.set(old.id,{id:old.id,colour:false,ink:false});
 if(!bucket)return [...found.values()];
 let cursor: string|undefined;
 do{
  const page=await bucket.list({prefix:ROOT_PREFIX,limit:1000,cursor,include:["customMetadata"]});
  for(const obj of page.objects){
   if(!obj.key.startsWith(ROOT_PREFIX))continue;
   const filename=obj.key.slice(ROOT_PREFIX.length);
   const match=/^([a-z0-9-]+?)(-ink)?\.png$/.exec(filename);
   if(!match||!VALID_ID.test(match[1]))continue;
   const id=match[1],variant:Variant=match[2]?"ink":"colour";
   const entry:InventoryItem=found.get(id)||{id,colour:false,ink:false};
   entry[variant]=true;
   const objectMeta=obj.customMetadata as Partial<VaultMeta>|undefined;
   if(objectMeta&&Object.keys(objectMeta).length)entry.meta={...entry.meta,...objectMeta};
   entry.updated=Math.max(entry.updated||0,obj.uploaded?.getTime()||0);
   found.set(id,entry);
  }
  cursor=page.truncated?page.cursor:undefined;
 }while(cursor);
 // Legacy asset objects are still discovered above. No separate database migration.
 return [...found.values()];
}

export async function canAccessPrintableVault(db:D1Database,user:{id:string;family_id:string}){
 const {limits}=await getEntitlement(db,user.family_id);
 return await isPlatformOwner(db,user.id)||(!VAULT_ART_REVIEW_ONLY&&limits.aiGeneration);
}
export function registerPrintableVault(app:App,g:Guards){
 app.get("/api/printables",g.auth,g.parent,async c=>{
  const owner=await isPlatformOwner(c.env.DB,c.get("user").id);
  const unlocked=await canAccessPrintableVault(c.env.DB,c.get("user"));
  const inventory=await getInventory(c.env.BUCKET);
  const newUploads=inventory.filter(x=>!premiumSet.has(x.id)&&x.colour)
   .sort((a,b)=>(b.updated||0)-(a.updated||0));
  const order=[...newUploads,...inventory.filter(x=>premiumSet.has(x.id))];
  const items=order.map(a=>itemMeta(metaFor(a.id,a.meta),unlocked&&a.colour,unlocked&&a.ink));
  const bundles=[...VAULT_BUNDLES];
  if(items.some(i=>i.collection==="new-adventures"))bundles.unshift({
   id:"new-adventures",title:"New Printable Adventures",description:"Freshly uploaded activities and educational discoveries."
  });
  c.header("Cache-Control","private, no-store");
  return c.json({unlocked,owner,art_review_only:VAULT_ART_REVIEW_ONLY,items,
   bundles:bundles.filter(b=>items.some(i=>i.collection===b.id)),
   format:"png",ready_count:owner?inventory.filter(a=>a.colour).length:undefined,
   owner_uploads:owner?inventory.filter(a=>a.colour||a.ink).map(a=>({
    id:a.id,title:metaFor(a.id,a.meta).title,colour:a.colour,ink:a.ink
   })):undefined});
 });
 const paid=async(c:any,next:any)=>{
  if(!await canAccessPrintableVault(c.env.DB,c.get("user")))
   return c.json({code:VAULT_ART_REVIEW_ONLY?"VAULT_REVIEW_ONLY":"UPGRADE_REQUIRED",detail:"The Printable Vault is available with an active Family Membership."},402);
  return next();
 };
 app.get("/api/printables/:id/image",g.auth,g.parent,paid,async c=>{
  const id=c.req.param("id");
  if(!VALID_ID.test(id))return c.json({detail:"Not found"},404);
  if(!c.env.BUCKET)return c.json({detail:"Private printable storage is not configured."},503);
  const page=Number(c.req.query("page")||"0");
  if(!Number.isInteger(page)||page!==0)return c.json({detail:"Page not found"},404);
  const variantParam=c.req.query("variant")||"colour";
  if(variantParam==="guide")return c.json({detail:"Parent guide is not yet approved."},404);
  if(variantParam!=="ink"&&variantParam!=="colour")return c.json({detail:"Unknown image variant"},400);
  const object=await c.env.BUCKET.get(premiumPath(id,variantParam));
  if(!object)return c.json({detail:"Illustration awaiting owner import."},404);
  c.header("Content-Type","image/png");
  c.header("Cache-Control","private, no-store");
  c.header("X-Content-Type-Options","nosniff");
  return c.body(object.body);
 });
 // Owner-only import: the R2 object itself is the catalogue entry, so adding an
 // activity does not require a code change, D1 migration, or public asset URL.
 app.post("/api/printables/admin/assets/:id",g.auth,g.parent,async c=>{
  if(!await isPlatformOwner(c.env.DB,c.get("user").id))
   return c.json({detail:"Platform-owner access required"},403);
  if(!c.env.BUCKET)return c.json({detail:"Private printable storage is not configured"},503);
  const id=c.req.param("id");
  if(!VALID_ID.test(id))return c.json({detail:"Invalid printable file name"},400);
  const variant=c.req.query("variant")||"colour";
  if(variant!=="colour"&&variant!=="ink")return c.json({detail:"Invalid artwork variant"},400);
  if(c.req.header("content-type")?.split(";")[0].trim().toLowerCase()!=="image/png")
   return c.json({detail:"PNG images only"},415);
  const length=Number(c.req.header("content-length")||"0");
  if(length>BYTES_LIMIT)return c.json({detail:"Image is too large (7 MB limit)"},413);
  const bytes=await c.req.arrayBuffer();
  if(bytes.byteLength>BYTES_LIMIT)return c.json({detail:"Image is too large (7 MB limit)"},413);
  if(!isPng(bytes))return c.json({detail:"Use a portrait PNG at least 768 by 1000 pixels (A4 proportions)."},400);
  const existing=knownItems.get(id);
  const metadata:VaultMeta=existing?{
   title:existing.title,category:existing.category,kind:existing.kind,
   ages:existing.ages,theme:existing.theme,collection:existing.collection,materials:existing.materials
  }:{
   title:textValue(c.req.query("title"),120)||readableTitle(id),
   category:textValue(c.req.query("category"),60)||"Learning & Discovery",
   kind:textValue(c.req.query("kind"),30)||"activity",
   ages:textValue(c.req.query("ages"),30)||"All ages",
   theme:textValue(c.req.query("theme"),50)||"Discovery",
   collection:"new-adventures",
   materials:"Pencils or colouring supplies"
  };
  const key=premiumPath(id,variant);
  await c.env.BUCKET.put(key,bytes,{httpMetadata:{contentType:"image/png"},customMetadata:{...metadata}});
  const saved=await c.env.BUCKET.head(key);
  if(!saved)return c.json({detail:"Storage confirmation failed; please retry this image."},502);
  c.header("Cache-Control","no-store");
  return c.json({ok:true,id,variant,bytes:bytes.byteLength});
 });
 // The owner deletes an entire uploaded printable (colour and optional ink artwork).
 // Original ten catalogue descriptions remain, but return to "Import pending".
 // New uploads disappear from the gallery. All other R2 folders are untouched.
 app.delete("/api/printables/admin/assets/:id",g.auth,g.parent,async c=>{
  if(!await isPlatformOwner(c.env.DB,c.get("user").id))
   return c.json({detail:"Platform-owner access required"},403);
  if(!c.env.BUCKET)return c.json({detail:"Private printable storage is not configured"},503);
  const id=c.req.param("id");
  if(!VALID_ID.test(id))return c.json({detail:"Invalid printable ID"},400);
  const keys=[premiumPath(id,"colour"),premiumPath(id,"ink")];
  const before=await Promise.all(keys.map(key=>c.env.BUCKET!.head(key)));
  if(!before.some(Boolean))return c.json({detail:"No uploaded artwork exists for this printable."},404);
  await c.env.BUCKET.delete(keys);
  // Check storage, rather than telling the owner something was removed when R2 still has it.
  const remaining=await Promise.all(keys.map(key=>c.env.BUCKET!.head(key)));
  if(remaining.some(Boolean))return c.json({detail:"The printable could not be fully deleted. Please retry."},502);
  c.header("Cache-Control","no-store");
  return c.json({ok:true,id,deleted_variants:before.map((obj,i)=>obj?(i===0?"colour":"ink"):null).filter(Boolean)});
 });
}
