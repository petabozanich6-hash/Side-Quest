import React from "react";
import { ACCESSORY_SLOTS, petSpots } from "./petAccessoryPositions";

// Vector wearables are attached to species-specific points on the illustration,
// rather than laid out in a disconnected row above the pet.
export function Wearable({ id }) {
  const line = { fill: "none", stroke: "#493C34", strokeWidth: 5, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (id) {
    case "scarf": return <><path d="M12 32 Q50 44 88 32 L85 52 Q50 66 15 52Z" fill="#a95b50" stroke="#71483e" strokeWidth="2.5"/><path d="M14 33 Q50 44 86 33 L84 43 Q48 56 16 44Z" fill="#d89b7c"/><path d="M60 48 Q68 63 72 89 L55 93 Q54 72 47 55Z" fill="#c9846d" stroke="#71483e" strokeWidth="2.5"/><path d="M55 68 L65 65 M58 79 L69 76 M56 91 L57 97 M61 90 L63 96 M67 89 L69 95" fill="none" stroke="#f4d8b5" strokeWidth="2" strokeLinecap="round"/><path d="M20 47 Q38 54 53 50" fill="none" stroke="#f4d8b5" strokeWidth="1.5" strokeDasharray="2 3"/></>;
    case "bow": return <><path d="M49 50 Q14 5 9 33 Q5 68 48 56Z" fill="#EF91AE" stroke="#9B426A" strokeWidth="3"/><path d="M51 50 Q91 5 93 33 Q94 73 52 56Z" fill="#F1A9C2" stroke="#9B426A" strokeWidth="3"/><circle cx="50" cy="52" r="11" fill="#FFE4EC" stroke="#9B426A" strokeWidth="4"/></>;
    case "flower_crown": return <><path d="M7 62 Q50 34 93 62" fill="none" stroke="#58764a" strokeWidth="4"/>{[15,33,52,71,88].map((x,i)=><g key={x} transform={`translate(${x} ${50 + Math.abs(2-i)*4})`}><ellipse cx="-6" cy="5" rx="7" ry="3" fill="#8aa36b" transform="rotate(-25)"/>{[0,72,144,216,288].map(a=><ellipse key={a} cx="0" cy="-5" rx="3.8" ry="5.5" transform={`rotate(${a})`} fill={i%2 ? '#f9e7c9' : '#e8b2b0'} stroke="#c28e87" strokeWidth=".6"/>)}<circle r="3" fill="#c99a46"/><circle cx="-1" cy="-1" r="1" fill="#ffe4a0"/></g>)}</>;
    case "party_hat": return <><path d="M16 80 L50 6 86 80Z" fill="#8DBEDB" stroke="#456886" strokeWidth="3"/><path d="M31 57 L65 37 M39 73 L73 55" stroke="#FFF7B2" strokeWidth="8"/><circle cx="50" cy="8" r="11" fill="#F7AA63"/><path d="M13 84 Q50 93 87 84" {...line} stroke="#F9D0AC" strokeWidth="9"/></>;
    case "bookworm_specs": return <><circle cx="29" cy="53" r="24" fill="#B9E4ED" fillOpacity=".18" stroke="#334E58" strokeWidth="3"/><circle cx="73" cy="53" r="24" fill="#B9E4ED" fillOpacity=".18" stroke="#334E58" strokeWidth="3"/><path d="M50 45 Q52 38 55 45 M4 44 L0 40 M98 44 L100 40" {...line}/><path d="M19 39 L26 36 M62 39 L69 36" stroke="white" strokeWidth="3" opacity=".8"/></>;
    case "shades": return <><path d="M3 38 Q23 30 47 39 L44 67 Q26 86 10 63Z" fill="#314354" stroke="#172A32" strokeWidth="3"/><path d="M53 39 Q75 30 97 38 L89 63 Q72 85 56 67Z" fill="#314354" stroke="#172A32" strokeWidth="3"/><path d="M44 44 L56 44" {...line}/><path d="M16 43 L33 39 M65 43 L82 39" stroke="#93DCE9" strokeWidth="3"/></>;
    case "headphones": return <><path d="M15 59 Q12 7 50 7 Q88 7 85 59" fill="none" stroke="#334457" strokeWidth="14"/><rect x="4" y="42" width="25" height="39" rx="9" fill="#77B7AF" stroke="#334457" strokeWidth="3"/><rect x="71" y="42" width="25" height="39" rx="9" fill="#77B7AF" stroke="#334457" strokeWidth="3"/></>;
    case "backpack": return <><rect x="20" y="19" width="62" height="75" rx="20" fill="#C98557" stroke="#6B503C" strokeWidth="3"/><path d="M34 27 Q48 -2 69 25 M28 44 L74 44" {...line} stroke="#6B503C"/><rect x="33" y="53" width="38" height="27" rx="8" fill="#E4B380" stroke="#6B503C" strokeWidth="3"/><circle cx="52" cy="66" r="5" fill="#F4DDAB"/></>;
    case "cape": return <><path d="M35 14 Q50 23 65 14 C72 33 79 68 88 90 Q69 87 50 95 Q30 87 12 90 C23 65 26 33 35 14Z" fill="#746889" stroke="#51495f" strokeWidth="2.5"/><path d="M38 22 Q35 57 22 85 Q34 81 43 87 L47 25Z" fill="#95859f"/><path d="M60 23 Q60 58 76 85 L58 89 52 26Z" fill="#635872"/><path d="M18 87 Q32 84 50 91 Q68 84 82 87" fill="none" stroke="#d9bd7d" strokeWidth="1.7"/><path d="M33 17 Q50 29 67 17" fill="none" stroke="#d9bd7d" strokeWidth="4"/><circle cx="50" cy="24" r="4" fill="#f2d89c" stroke="#977845" strokeWidth="1.5"/></>;
    case "butterfly": return <><path d="M50 47 Q12 -4 6 28 Q-2 60 47 63Z M52 47 Q88 -4 94 28 Q102 60 55 63Z" fill="#A8C9F5" stroke="#6073B4" strokeWidth="3"/><path d="M47 61 Q11 48 14 77 Q25 99 49 69Z M53 61 Q89 48 86 77 Q75 99 51 69Z" fill="#D8BAF3" stroke="#6073B4" strokeWidth="3"/><path d="M50 40 L50 81" {...line}/><circle cx="35" cy="41" r="7" fill="#FCEDC1"/><circle cx="65" cy="41" r="7" fill="#FCEDC1"/></>;
    case "crown": return <><path d="M11 34 L27 57 50 18 73 57 90 34 85 85 15 85Z" fill="#F5CF60" stroke="#926A21" strokeWidth="3"/><circle cx="50" cy="59" r="9" fill="#B04E78"/><circle cx="29" cy="66" r="6" fill="#6A97CF"/><circle cx="71" cy="66" r="6" fill="#7DAB86"/></>;
    case "top_hat": return <><path d="M25 14 L78 14 72 70 30 70Z" fill="#3B3B55" stroke="#20263A" strokeWidth="3"/><path d="M29 52 L74 52 L73 68 L30 68Z" fill="#8E6DB3"/><path d="M10 76 Q49 91 91 76" {...line} stroke="#272D40" strokeWidth="13"/></>;
    case "star_badge": return <><path d="M50 7 L62 36 94 39 70 59 77 91 50 74 23 91 30 59 6 39 38 36Z" fill="#F7CD58" stroke="#9B7329" strokeWidth="3"/><circle cx="50" cy="52" r="11" fill="#FFF3C0"/></>;
    case "magic_wand": return <><path d="M24 89 L69 30" stroke="#6c567b" strokeWidth="7" strokeLinecap="round"/><path d="M25 86 L66 33" stroke="#ba9fbe" strokeWidth="2"/><path d="M72 7 L79 22 96 24 84 36 86 52 72 44 57 52 60 35 48 24 65 22Z" fill="#eed39a" stroke="#a78349" strokeWidth="2"/><path d="M32 18 L32 27 M28 22 L36 22 M87 69 L87 77 M83 73 L91 73" stroke="#c6a771" strokeWidth="2" strokeLinecap="round"/></>;
    case "rainbow": return <><path d="M14 74 A36 42 0 0 1 86 74" fill="none" stroke="#cc8e85" strokeWidth="11"/><path d="M24 74 A26 32 0 0 1 76 74" fill="none" stroke="#e8c88e" strokeWidth="9"/><path d="M33 74 A17 23 0 0 1 67 74" fill="none" stroke="#92b19b" strokeWidth="9"/><path d="M41 74 A9 15 0 0 1 59 74" fill="none" stroke="#91abb9" strokeWidth="7"/><path d="M4 77 Q0 67 10 64 Q14 53 23 61 Q33 59 35 70 Q44 81 29 84 L12 84Q5 84 4 77 M96 77 Q100 67 90 64 Q86 53 77 61 Q67 59 65 70 Q56 81 71 84 L88 84Q95 84 96 77" fill="#fff3dd" stroke="#d2c3ab" strokeWidth="1.5"/></>;
    default: return null;
  }
}
const emojiFallback = { rainbow: "🌈", magic_wand: "🪄" };

export default function PetWearables({ species, equipped = [] }) {
  const ids = (equipped || []).filter((id) => ACCESSORY_SLOTS[id]);
  if (!ids.length) return null;
  return <div className="absolute inset-0 pointer-events-none" aria-hidden="true" data-testid="worn-accessories">
    {ids.map((id) => {
      const slot = ACCESSORY_SLOTS[id];
      const p = petSpots(species, slot)[0];
      if (!p) return null;
      const [x, y, size] = p;
      const emoji = emojiFallback[id];
      return <span key={id} className="absolute grid place-items-center select-none" style={{
        left: x + "%", top: y + "%", width: (size * (slot === "back" ? 1.2 : 1.13)) + "%",
        aspectRatio: "1", transform: "translate(-50%, -50%)",
        filter: "drop-shadow(0 2px 2px rgba(42,30,24,.2))",
      }}>
        {emoji ? <span style={{fontSize: "clamp(18px, 3vw, 34px)"}}>{emoji}</span> :
          <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg"><Wearable id={id}/></svg>}
      </span>;
    })}
  </div>;
}
