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

const itemMeta=(i:VaultPicture)=>({id:i.id,title:i.title,category:i.category,ages:i.ages,minutes:i.minutes,kind:i.kind,description:i.description,materials:i.materials,theme:i.theme,collection:i.collection,pages:i.pages,format:"svg"});
export async function canAccessPrintableVault(db:D1Database,user:{id:string;family_id:string}) {
 const {limits}=await getEntitlement(db,user.family_id);
 return limits.aiGeneration || await isPlatformOwner(db,user.id);
}
export function registerPrintableVault(app:App,g:Guards) {
 app.get("/api/printables",g.auth,g.parent,async c=>{
  const unlocked=await canAccessPrintableVault(c.env.DB,c.get("user"));
  c.header("Cache-Control","private, no-store");
  return c.json({unlocked,items:VAULT_ITEMS.map(itemMeta),bundles:VAULT_BUNDLES,format:"svg"});
 });
 const paid=async(c:any,next:any)=>{
  if(!await canAccessPrintableVault(c.env.DB,c.get("user")))
   return c.json({code:"UPGRADE_REQUIRED",detail:"The Printable Vault is included in Family Membership."},402);
  return next();
 };
 app.get("/api/printables/:id/image",g.auth,g.parent,paid,c=>{
  const item=VAULT_ITEMS.find(i=>i.id===c.req.param("id"));
  if(!item)return c.json({detail:"Activity not found"},404);
  const variant=c.req.query("variant")==="guide"?"guide":c.req.query("variant")==="ink"?"ink":"colour";
  const page=Number(c.req.query("page")||"0");
  if(!Number.isInteger(page)||page<0||page>=item.pages)return c.json({detail:"Page not found"},404);
  const svg=renderVaultSvg(item,page,variant);
  c.header("Content-Type","image/svg+xml; charset=utf-8");
  c.header("Cache-Control","private, no-store");
  c.header("X-Content-Type-Options","nosniff");
  c.header("Content-Security-Policy","default-src 'none'; style-src 'unsafe-inline'");
  return c.body(svg);
 });
}
