import React from "react";
import { ACCESSORY_SLOTS, petSpots } from "./petAccessoryPositions";

// Vector wearables are attached to species-specific points on the illustration,
// rather than laid out in a disconnected row above the pet.
function Wearable({ id }) {
  const line = { fill: "none", stroke: "#493C34", strokeWidth: 5, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (id) {
    case "scarf": return <><path d="M17 35 Q50 50 83 35 L82 62 Q50 78 18 62Z" fill="#DB7957" stroke="#824735" strokeWidth="5"/><path d="M57 54 L79 93 Q65 99 55 90 L42 59" fill="#EFA28A" stroke="#824735" strokeWidth="5"/><path d="M57 70 L72 66 M63 83 L79 79" stroke="#FFDDD0" strokeWidth="5"/></>;
    case "bow": return <><path d="M49 50 Q14 5 9 33 Q5 68 48 56Z" fill="#EF91AE" stroke="#9B426A" strokeWidth="5"/><path d="M51 50 Q91 5 93 33 Q94 73 52 56Z" fill="#F1A9C2" stroke="#9B426A" strokeWidth="5"/><circle cx="50" cy="52" r="11" fill="#FFE4EC" stroke="#9B426A" strokeWidth="4"/></>;
    case "flower_crown": return <><path d="M8 60 Q50 26 92 60" {...line} stroke="#427C4E" strokeWidth="10"/>{[20,40,60,80].map((x,i)=><g key={x} transform={"translate(" + x + " " + (i%2?38:47) + ")"}><circle r="12" fill="#F8AFC7"/><circle r="5" fill="#FFDC72"/></g>)}</>;
    case "party_hat": return <><path d="M16 80 L50 6 86 80Z" fill="#8DBEDB" stroke="#456886" strokeWidth="5"/><path d="M31 57 L65 37 M39 73 L73 55" stroke="#FFF7B2" strokeWidth="8"/><circle cx="50" cy="8" r="11" fill="#F7AA63"/><path d="M13 84 Q50 93 87 84" {...line} stroke="#F9D0AC" strokeWidth="9"/></>;
    case "bookworm_specs": return <><circle cx="29" cy="53" r="24" fill="#B9E4ED" stroke="#334E58" strokeWidth="6"/><circle cx="73" cy="53" r="24" fill="#B9E4ED" stroke="#334E58" strokeWidth="6"/><path d="M50 45 Q52 38 55 45 M4 44 L0 40 M98 44 L100 40" {...line}/><path d="M19 39 L26 36 M62 39 L69 36" stroke="white" strokeWidth="5" opacity=".8"/></>;
    case "shades": return <><path d="M3 38 Q23 30 47 39 L44 67 Q26 86 10 63Z" fill="#314354" stroke="#172A32" strokeWidth="5"/><path d="M53 39 Q75 30 97 38 L89 63 Q72 85 56 67Z" fill="#314354" stroke="#172A32" strokeWidth="5"/><path d="M44 44 L56 44" {...line}/><path d="M16 43 L33 39 M65 43 L82 39" stroke="#93DCE9" strokeWidth="5"/></>;
    case "headphones": return <><path d="M15 59 Q12 7 50 7 Q88 7 85 59" fill="none" stroke="#334457" strokeWidth="14"/><rect x="4" y="42" width="25" height="39" rx="9" fill="#77B7AF" stroke="#334457" strokeWidth="5"/><rect x="71" y="42" width="25" height="39" rx="9" fill="#77B7AF" stroke="#334457" strokeWidth="5"/></>;
    case "backpack": return <><rect x="20" y="19" width="62" height="75" rx="20" fill="#C98557" stroke="#6B503C" strokeWidth="6"/><path d="M34 27 Q48 -2 69 25 M28 44 L74 44" {...line} stroke="#6B503C"/><rect x="33" y="53" width="38" height="27" rx="8" fill="#E4B380" stroke="#6B503C" strokeWidth="5"/><circle cx="52" cy="66" r="5" fill="#F4DDAB"/></>;
    case "cape": return <><path d="M38 14 Q51 26 65 14 Q81 48 95 95 L53 82 L8 95 Q25 48 38 14Z" fill="#C96D7A" stroke="#793F54" strokeWidth="5"/><path d="M35 16 Q51 26 68 16" {...line} stroke="#F9DF91" strokeWidth="7"/><circle cx="51" cy="20" r="7" fill="#F8D889"/></>;
    case "butterfly": return <><path d="M50 47 Q12 -4 6 28 Q-2 60 47 63Z M52 47 Q88 -4 94 28 Q102 60 55 63Z" fill="#A8C9F5" stroke="#6073B4" strokeWidth="5"/><path d="M47 61 Q11 48 14 77 Q25 99 49 69Z M53 61 Q89 48 86 77 Q75 99 51 69Z" fill="#D8BAF3" stroke="#6073B4" strokeWidth="5"/><path d="M50 40 L50 81" {...line}/><circle cx="35" cy="41" r="7" fill="#FCEDC1"/><circle cx="65" cy="41" r="7" fill="#FCEDC1"/></>;
    case "crown": return <><path d="M11 34 L27 57 50 18 73 57 90 34 85 85 15 85Z" fill="#F5CF60" stroke="#926A21" strokeWidth="6"/><circle cx="50" cy="59" r="9" fill="#B04E78"/><circle cx="29" cy="66" r="6" fill="#6A97CF"/><circle cx="71" cy="66" r="6" fill="#7DAB86"/></>;
    case "top_hat": return <><path d="M25 14 L78 14 72 70 30 70Z" fill="#3B3B55" stroke="#20263A" strokeWidth="5"/><path d="M29 52 L74 52 L73 68 L30 68Z" fill="#8E6DB3"/><path d="M10 76 Q49 91 91 76" {...line} stroke="#272D40" strokeWidth="13"/></>;
    case "star_badge": return <><path d="M50 7 L62 36 94 39 70 59 77 91 50 74 23 91 30 59 6 39 38 36Z" fill="#F7CD58" stroke="#9B7329" strokeWidth="6"/><circle cx="50" cy="52" r="11" fill="#FFF3C0"/></>;
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
