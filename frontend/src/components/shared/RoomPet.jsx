import React, { useId } from "react";

// Room illustrations share the established 120-unit wardrobe anchors.
// Each instance owns its paint IDs so multiple companions can coexist.
export default function RoomPet({ species = "fox", size = 220, happy = true, children, backChildren }) {
  const id = useId().replace(/:/g, "");
  const palettes = {
    fox: ["#efa96c", "#c56c42", "#88482e", "#fff0d5"],
    owl: ["#c7a17a", "#886143", "#604434", "#f6e8ca"],
    turtle: ["#abd197", "#6d9c70", "#42684c", "#e7e5aa"],
    hedgehog: ["#dab491", "#af815f", "#70503f", "#f5dfbd"],
    fawn: ["#e6ba87", "#bf8656", "#80553b", "#fff0d9"],
    squirrel: ["#dda77a", "#b46f48", "#75452f", "#f7dfbd"],
    rabbit: ["#fff8ed", "#d9c9b9", "#a18a7c", "#fffaf0"],
    dragon: ["#a3c7b0", "#5e947d", "#365f51", "#ece3ac"],
    goblin: ["#c1d99a", "#8bad6d", "#536d45", "#e8edc6"],
  };
  const [light, base, dark, cream] = palettes[species] || palettes.fox;
  const fur = `url(#${id}-fur)`, face = `url(#${id}-face)`;
  const outline = { stroke: dark, strokeWidth: 1.2, strokeLinejoin: "round" };
  return <svg width={size} height={size} viewBox="0 0 120 120" style={{ overflow: "visible" }} data-species={species}>
    <defs>
      <radialGradient id={`${id}-fur`} cx="32%" cy="20%" r="85%"><stop stopColor={light}/><stop offset=".65" stopColor={base}/><stop offset="1" stopColor={dark}/></radialGradient>
      <radialGradient id={`${id}-face`} cx="35%" cy="22%" r="90%"><stop stopColor={light}/><stop offset="1" stopColor={base}/></radialGradient>
      <radialGradient id={`${id}-eye`} cx="35%" cy="20%"><stop stopColor="#665044"/><stop offset="1" stopColor="#231d1a"/></radialGradient>
    </defs>
    {/* Silhouettes: tails, wings and quills give each species its own shape. */}
    {species === "fox" && <g {...outline}><path d="M81 97 C117 103 121 73 102 59 C105 79 82 72 77 91Z" fill={fur}/><path d="M102 59 Q124 78 109 93 L103 83 96 85 Q106 73 102 59" fill={cream} stroke="none"/></g>}
    {species === "squirrel" && <g {...outline}><path d="M81 98 C119 111 122 69 108 53 C92 35 76 51 86 68 C96 58 105 75 94 80 L77 83Z" fill={fur}/><path d="M94 87 C118 86 111 51 95 56" fill="none" stroke={light} strokeWidth="4" strokeLinecap="round"/></g>}
    {species === "dragon" && <g {...outline}><path d="M80 97 Q111 108 113 76 Q103 92 86 83Z" fill={fur}/><path d="M34 67 Q13 43 8 61 L15 82 34 87 M86 67 Q107 43 112 61 L105 82 86 87" fill="#c9a5a0"/><path d="M12 61 L29 78 M108 61 L91 78" fill="none"/></g>}
    {species === "hedgehog" && <path d="M25 91 L15 79 22 74 13 61 23 58 17 43 29 44 27 28 40 34 45 20 54 30 65 19 72 32 85 25 86 41 100 38 96 54 107 61 99 73 105 85 91 95Z" fill="#795a48" stroke="#594334" strokeWidth="1.5"/>}
    {backChildren}
    {/* Soft pear-shaped bodies and grounded paws. */}
    <path d="M40 64 C24 75 26 100 39 106 Q60 116 81 106 C94 99 96 76 80 64Z" fill={fur} {...outline}/>
    <ellipse cx="60" cy="88" rx="20" ry="22" fill={cream} opacity=".9"/>
    {species === "turtle" && <g><ellipse cx="60" cy="86" rx="30" ry="23" fill="#638166" {...outline}/><path d="M49 69 L70 69 81 85 71 101 49 101 38 85Z" fill="#90ac78" stroke="#496a50" strokeWidth="1.5"/><path d="M49 69 L51 81 44 91 49 101 M70 69 L68 81 76 91 71 101 M51 81 L68 81 M44 91 L76 91" fill="none" stroke="#496a50" strokeWidth="1.3"/></g>}
    {species === "owl" ? <g fill={fur} {...outline}><path d="M32 69 Q18 85 36 101 Q45 91 38 75Z"/><path d="M88 69 Q102 85 84 101 Q75 91 82 75Z"/></g> : <g fill={face} {...outline}><ellipse cx="33" cy="85" rx="7" ry="13" transform="rotate(-14 33 85)"/><ellipse cx="87" cy="85" rx="7" ry="13" transform="rotate(14 87 85)"/></g>}
    <g fill={species === "owl" ? "#d4a55f" : face} {...outline}><ellipse cx="43" cy="106" rx="13" ry="7"/><ellipse cx="77" cy="106" rx="13" ry="7"/></g>
    <path d="M39 105 L39 109 M44 106 L44 110 M73 106 L73 110 M78 105 L78 109" stroke={dark} strokeWidth="1" opacity=".45"/>
    {/* Ears stay behind the face; head/face anchors remain 60,21 and 60,48. */}
    {['fox','squirrel','fawn'].includes(species) && <g {...outline}>
      <path d={species === 'fawn' ? 'M39 36 Q13 35 18 19 Q37 16 45 34Z' : 'M34 36 Q26 18 32 9 Q48 16 48 34Z'} fill={fur}/>
      <path d={species === 'fawn' ? 'M81 36 Q107 35 102 19 Q83 16 75 34Z' : 'M86 36 Q94 18 88 9 Q72 16 72 34Z'} fill={fur}/>
      <path d="M36 28 L35 17 44 30 M84 28 L85 17 76 30" stroke={cream} strokeWidth="5" strokeLinecap="round"/>
    </g>}
    {species === 'rabbit' && <g {...outline}><path d="M39 37 C20 -8 43 -9 50 31 M70 31 C77 -9 100 -8 81 37" fill={fur}/><path d="M41 28 Q31 0 37 7 L46 29 M74 29 L83 7 Q89 0 79 28" fill="#dfa9a6" stroke="none"/></g>}
    {species === 'goblin' && <g {...outline}><path d="M37 37 Q17 22 6 29 Q12 50 37 53 M83 37 Q103 22 114 29 Q108 50 83 53" fill={fur}/><path d="M31 39 L15 33 Q20 44 33 46 M89 39 L105 33 Q100 44 87 46" fill="#d7b6a2" stroke="none"/></g>}
    {species === 'dragon' && <g fill="#e9d8a3" {...outline}><path d="M38 30 Q25 18 33 8 Q36 22 47 25 M82 30 Q95 18 87 8 Q84 22 73 25"/></g>}
    <path d={species === 'owl' ? 'M30 24 L45 29 Q60 20 75 29 L90 24 89 47 Q94 70 60 73 Q26 70 31 47Z' : 'M30 45 C29 15 91 15 90 45 Q94 67 76 72 Q60 79 44 72 Q26 67 30 45Z'} fill={face} {...outline}/>
    {species === 'fox' && <path d="M32 45 Q42 46 49 57 L60 65 71 57 Q78 46 88 45 Q91 67 60 72 Q29 67 32 45" fill={cream}/>} 
    {species === 'owl' && <g fill={cream}><ellipse cx="47" cy="49" rx="17" ry="19"/><ellipse cx="73" cy="49" rx="17" ry="19"/></g>}
    {['rabbit','squirrel','hedgehog','fawn','goblin','dragon'].includes(species) && <ellipse cx="60" cy="62" rx={species === 'dragon' ? 21 : 16} ry="10" fill={cream} opacity=".9"/>}
    {species === 'fawn' && <g fill={cream}><ellipse cx="45" cy="33" rx="3" ry="4"/><ellipse cx="60" cy="29" rx="3" ry="4"/><ellipse cx="75" cy="33" rx="3" ry="4"/><circle cx="37" cy="77" r="2"/><circle cx="83" cy="77" r="2"/></g>}
    {species === 'goblin' && <path d="M43 27 Q40 15 51 20 L58 11 65 20 74 17 78 28 Q62 23 43 27" fill="#58754b"/>}
    {species === 'hedgehog' && <path d="M37 37 L42 29 47 35 53 27 59 32" fill="none" stroke={cream} strokeWidth="2" strokeLinecap="round"/>}
    {species === 'dragon' && <g fill={dark} opacity=".4"><circle cx="42" cy="33" r="2"/><circle cx="48" cy="29" r="2"/><circle cx="78" cy="33" r="2"/></g>}
    {[50,70].map(x => <g key={x} className={happy ? 'animate-blink' : ''} style={{transformOrigin:`${x}px 48px`}}><ellipse cx={x} cy="48" rx="4.5" ry="5.6" fill={`url(#${id}-eye)`}/><circle cx={x-1.3} cy="46" r="1.7" fill="#fffaf1"/><circle cx={x+1.4} cy="50" r=".7" fill="#dcb895"/></g>)}
    <g fill="#d98e81" opacity=".4"><ellipse cx="40" cy="57" rx="5" ry="3"/><ellipse cx="80" cy="57" rx="5" ry="3"/></g>
    {species === 'owl' ? <path d="M56 57 Q60 54 64 57 L60 64Z" fill="#c99045"/> : <><path d="M56 57 Q60 54 64 57 Q63 61 60 61 Q57 61 56 57" fill={species === 'rabbit' ? '#bc807d' : '#533a30'}/><path d={happy ? 'M60 61 L60 63 Q56 67 53 63 M60 63 Q64 67 67 63' : 'M55 65 Q60 63 65 65'} fill="none" stroke="#694d40" strokeWidth="1.3" strokeLinecap="round"/></>}
    {species === 'rabbit' && <path d="M58 66 L58 70 62 70 62 66" fill="#fff"/>}
    {children}
  </svg>;
}
