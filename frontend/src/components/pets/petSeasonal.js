// Seasonal prizes and room decorations drawn to match the pets (100 x 100 boxes).
// Prizes without artwork yet fall back to their emoji, placed on the same anchors.
const INK = "#3A2A1A";
const s = (d, fill, w = 3, stroke = INK, extra = "") =>
  `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${extra ? " " + extra : ""}/>`;
const shine = (d, w = 3, o = 0.55) => `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="${w}" stroke-linecap="round" opacity="${o}"/>`;

const pumpkin = (face = false) => `
  ${s("M50,30 C72,26 94,40 94,62 C94,84 74,96 50,96 C26,96 6,84 6,62 C6,40 28,26 50,30Z", "#EE8A2E", 3, "#8A3E10")}
  <path d="M50,32 C40,48 40,80 50,94 M50,32 C60,48 60,80 50,94 M30,34 C20,50 22,80 32,92 M70,34 C80,50 78,80 68,92" fill="none" stroke="#B85A1A" stroke-width="2.6"/>
  ${s("M48,32 C46,22 48,14 56,8 L60,12 C54,18 54,24 56,32Z", "#6E8A3A", 2.6, "#3E5A1E")}
  ${s("M58,22 C68,12 82,14 86,22 C76,26 66,26 58,22Z", "#8AAE4A", 2.2, "#3E5A1E")}
  ${face ? `${s("M26,56 L36,46 L42,58Z", "#FFD86A", 2.4, "#6A2A08")}${s("M58,58 L64,46 L74,56Z", "#FFD86A", 2.4, "#6A2A08")}${s("M26,70 Q50,92 74,70 L66,74 L60,68 L52,76 L46,68 L40,76 L34,70Z", "#FFD86A", 2.4, "#6A2A08")}` : ""}
  ${shine("M20,52 C22,44 28,38 36,36", 4, 0.45)}`;

const PRIZES = {
  // Halloween
  "halloween-1": { attach: [0.5, 0.88], svg: pumpkin(false) },
  "halloween-2": { attach: [0.5, 0.9], svg: `
    ${s("M50,2 C56,20 64,44 74,70 L26,70 C38,46 44,24 50,2Z", "#5E3E86", 3, "#2E1A4A")}
    <path d="M50,4 C46,26 40,48 34,68" stroke="#7E5EAA" stroke-width="4" opacity=".8" fill="none"/>
    ${s("M28,62 L72,62 L74,72 L26,72Z", "#F08A2E", 2.6, "#2E1A4A")}
    ${s("M4,74 Q50,62 96,74 Q90,86 50,86 Q10,86 4,74Z", "#4A2E6E", 3, "#2E1A4A")}
    <rect x="45" y="61" width="10" height="11" rx="2" fill="#FFD86A" stroke="#2E1A4A" stroke-width="2"/>` },
  "halloween-3": { attach: [0.5, 0.5], svg: `
    ${s("M6,38 Q26,30 46,40 L42,58 Q28,70 12,58 Q2,48 6,38Z", "#F08A2E", 3, "#6A2A08")}
    ${s("M54,40 Q74,30 94,38 Q98,48 88,58 Q72,70 58,58Z", "#F08A2E", 3, "#6A2A08")}
    <path d="M12,46 Q26,40 40,46 L38,54 Q28,62 16,54Z M60,46 Q74,40 88,46 L84,54 Q72,62 62,54Z" fill="#2A1E3A"/>
    <path d="M46,44 L54,44" stroke="#6A2A08" stroke-width="4" stroke-linecap="round"/>
    <path d="M6,38 L0,30 M94,38 L100,30" stroke="#6A2A08" stroke-width="4" stroke-linecap="round"/>
    ${shine("M18,48 L30,45 M66,48 L78,45", 2.4, 0.7)}` },
  "halloween-4": { attach: [0.5, 0.3], svg: `
    ${s("M60,40 C64,58 68,76 74,96 L56,98 C54,80 50,62 46,46Z", "#B9B4C4", 3, "#4E4A5A")}
    ${s("M2,18 C30,42 70,42 98,18 L100,38 C72,66 28,66 0,38Z", "#D6D2DE", 3, "#4E4A5A")}
    <g stroke="#6E6A7A" stroke-width="1.6" fill="none" opacity=".85">
      <path d="M50,30 L50,58 M50,44 L24,34 M50,44 L76,34 M50,44 L30,56 M50,44 L70,56"/>
      <path d="M38,40 Q44,36 50,38 Q56,36 62,40 M32,50 Q42,46 50,50 Q58,46 68,50"/>
      <path d="M58,62 L70,90 M54,74 L72,72"/>
    </g>
    <circle cx="70" cy="34" r="3.5" fill="#2A2232"/><path d="M70,34 L70,22" stroke="#2A2232" stroke-width="1.2"/>` },
  "halloween-5": { attach: [0.5, 0.22], svg: `
    <path d="M6,14 C30,40 70,40 94,14" fill="none" stroke="#5A3A22" stroke-width="3"/>
    <g transform="translate(50 52) rotate(-20)">${s("M-22,-4 C-30,-14 -18,-20 -14,-10 L14,-10 C18,-20 30,-14 22,-4 C30,4 18,12 14,2 L-14,2 C-18,12 -30,4 -22,-4Z", "#FBF4E2", 2.6, "#7A6A52")}</g>
    <path d="M50,36 L50,44" stroke="#5A3A22" stroke-width="3"/>` },
  "halloween-6": { attach: [0.5, 0.5], scale: 1.35, svg: `
    <g stroke="#2A2232" stroke-width="4" stroke-linecap="round" fill="none"><path d="M36,46 Q20,36 10,44 M36,54 Q18,52 8,62 M38,62 Q24,70 18,82 M64,46 Q80,36 90,44 M64,54 Q82,52 92,62 M62,62 Q76,70 82,82"/></g>
    ${s("M50,30 C64,30 70,42 70,54 C70,68 62,76 50,76 C38,76 30,68 30,54 C30,42 36,30 50,30Z", "#3A2E4A", 3, "#1A1222")}
    <circle cx="43" cy="50" r="5" fill="#fff"/><circle cx="57" cy="50" r="5" fill="#fff"/><circle cx="44" cy="51" r="2.4" fill="#1A1222"/><circle cx="58" cy="51" r="2.4" fill="#1A1222"/>
    <path d="M44,62 Q50,67 56,62" stroke="#E86A8A" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    ${shine("M40,36 Q46,32 52,34", 2.4, 0.5)}` },
  "halloween-7": { attach: [0.5, 0.5], scale: 1.2, svg: `
    ${s("M30,78 L70,78 L76,94 L24,94Z", "#8A6A3A", 3, "#4A3418")}
    <circle cx="50" cy="48" r="34" fill="#B18AE6" stroke="#4E2E86" stroke-width="3"/>
    <circle cx="50" cy="48" r="22" fill="#D7C2F7" opacity=".6"/>
    <path d="M40,40 l3,7 7,3 -7,3 -3,7 -3,-7 -7,-3 7,-3z" fill="#FFF6C8"/>
    ${shine("M30,34 C34,24 42,18 52,16", 5, 0.6)}` },
  "halloween-8": { attach: [0.5, 0.72], scale: 1.25, svg: `
    ${s("M50,10 C72,10 84,28 84,50 L84,80 L74,72 L64,82 L54,72 L44,82 L34,72 L24,82 L16,74 L16,50 C16,28 28,10 50,10Z", "#FBFAFF", 3, "#7A7896")}
    <ellipse cx="38" cy="42" rx="6" ry="8" fill="#2A2638"/><ellipse cx="62" cy="42" rx="6" ry="8" fill="#2A2638"/>
    <circle cx="36" cy="39" r="2.2" fill="#fff"/><circle cx="60" cy="39" r="2.2" fill="#fff"/>
    <ellipse cx="50" cy="58" rx="7" ry="6" fill="#2A2638"/><ellipse cx="50" cy="61" rx="4" ry="2.6" fill="#E86A8A"/>
    <g fill="#F7A8B8" opacity=".6"><ellipse cx="28" cy="54" rx="5" ry="3"/><ellipse cx="72" cy="54" rx="5" ry="3"/></g>
    ${shine("M26,24 C30,18 38,14 46,14", 4, 0.8)}` },
  "halloween-9": { attach: [0.42, 0.18], svg: `
    ${s("M30,20 C24,32 14,48 14,66 C14,86 30,96 50,96 C70,96 86,86 86,66 C86,48 76,32 70,20Z", "#F08A2E", 3, "#6A2A08")}
    ${s("M28,12 Q50,24 72,12 L70,22 Q50,32 30,22Z", "#E0782A", 2.6, "#6A2A08")}
    <path d="M36,22 Q42,4 52,16" fill="none" stroke="#6A2A08" stroke-width="3" stroke-linecap="round"/>
    <g transform="translate(32 54)">${s("M0,0 C-6,-6 -10,-2 -8,2 C-10,6 -6,10 0,4Z", "#E86AA8", 2, "#7A2A50")}</g>
    ${s("M38,46 L62,46 L62,58 L38,58Z", "#FFD86A", 2, "#6A2A08")}${s("M40,64 L60,64 L60,74 L40,74Z", "#8E6DB3", 2, "#3E2E58")}
    ${shine("M24,52 C24,44 28,36 32,30", 4, 0.45)}` },
  "halloween-10": { attach: [0.5, 0.6], mirror: true, scale: 1.9, svg: `
    ${s("M90,60 C78,40 62,26 40,22 C42,32 36,36 28,34 C30,44 22,48 14,46 C18,58 12,64 4,64 C30,66 62,66 90,60Z", "#4A3E5E", 3, "#1E1828")}
    <path d="M86,58 C70,48 54,40 40,26 M86,58 C64,54 44,48 28,38 M86,58 C58,58 36,54 14,50" stroke="#6E6284" stroke-width="2.4" fill="none" stroke-linecap="round"/>` },
  "halloween-11": { attach: [0.5, 0.58], mirror: true, scale: 1.05, svg: `
    ${s("M30,6 L62,6 L60,54 C76,58 92,64 96,76 C98,86 90,92 78,92 L18,92 C10,92 6,86 8,78 L12,54 Z", "#3A2E4A", 3, "#1A1222")}
    ${s("M28,6 L64,6 L63,18 L29,18Z", "#7E5EAA", 2.4, "#1A1222")}
    ${s("M8,84 L98,84 L96,92 Q90,98 78,98 L16,98 Q8,98 8,92Z", "#1A1222", 2, "#1A1222")}
    <rect x="38" y="30" width="14" height="12" rx="2" fill="none" stroke="#F2C95B" stroke-width="3"/>
    ${shine("M36,22 L36,50", 3, 0.3)}` },
  "halloween-12": { attach: [0.5, 0.5], mirror: true, svg: `
    ${s("M60,12 C40,14 24,32 24,52 C24,74 42,90 64,90 C52,82 44,68 44,52 C44,34 52,20 60,12Z", "#FFE07A", 3, "#9A7420")}
    <circle cx="38" cy="44" r="3" fill="#E8C24E"/><circle cx="36" cy="64" r="2.4" fill="#E8C24E"/>
    ${shine("M32,32 C36,24 42,20 48,18", 3, 0.7)}` },
};

export function seasonalArt(id) {
  return PRIZES[id] || null;
}

// Room decorations for seasonal themes (drawn instead of emoji where art exists).
export const DECOR = {
  jack: pumpkin(true),
  cobweb: `<g fill="none" stroke="#F4F0FA" stroke-width="1.8" opacity=".85" stroke-linecap="round">
      <path d="M0,0 L96,10 M0,0 L80,60 M0,0 L44,92 M0,0 L8,98"/>
      <path d="M24,2 Q22,14 20,16 Q12,18 2,24"/><path d="M48,5 Q42,26 40,32 Q22,40 4,48"/>
      <path d="M72,8 Q60,38 58,48 Q34,62 6,74"/><path d="M92,10 Q78,50 74,62 Q46,84 8,96"/></g>
    <g transform="translate(58 52)"><path d="M0,-18 L0,-2" stroke="#2A2232" stroke-width="1.4"/>
      <g stroke="#2A2232" stroke-width="2.4" stroke-linecap="round"><path d="M-4,0 L-12,-4 M-4,3 L-13,5 M4,0 L12,-4 M4,3 L13,5"/></g>
      <ellipse cx="0" cy="2" rx="6" ry="7" fill="#3A2E4A" stroke="#1A1222" stroke-width="2"/><circle cx="-2" cy="1" r="1.4" fill="#fff"/><circle cx="2" cy="1" r="1.4" fill="#fff"/></g>`,
  candle: `
    ${s("M38,40 L62,40 L62,90 L38,90Z", "#F8F2E2", 3, "#8A7A5A")}
    <path d="M38,46 C42,52 44,52 46,46 C48,56 52,58 54,48 C56,54 60,54 62,46" fill="#F8F2E2" stroke="#8A7A5A" stroke-width="2.4"/>
    ${s("M30,88 L70,88 Q74,88 74,92 L74,96 L26,96 L26,92 Q26,88 30,88Z", "#8A6A3A", 2.6, "#4A3418")}
    <path d="M50,40 L50,32" stroke="#3A2A1A" stroke-width="2.4"/>
    <path d="M50,6 C58,16 60,24 54,30 C52,32 48,32 46,30 C40,24 44,16 50,6Z" fill="#FFB43C" stroke="#C9661E" stroke-width="2"/>
    <path d="M50,16 C54,22 54,26 50,28 C46,26 46,22 50,16Z" fill="#FFF1B8"/>
    <circle cx="50" cy="22" r="22" fill="#FFD27A" opacity=".22"/>
    ${shine("M42,48 L42,84", 3, 0.5)}`,
  ghost: PRIZES["halloween-8"].svg,
  // care effects and the mess to clean up
  heart: `${s("M50,90 C22,70 6,54 6,34 C6,20 17,10 30,10 C39,10 46,15 50,23 C54,15 61,10 70,10 C83,10 94,20 94,34 C94,54 78,70 50,90Z", "#E8604C", 3.5, "#7A2418")}${shine("M22,28 C24,22 28,19 34,18", 5, 0.6)}`,
  sparkle: `${s("M50,4 C54,34 66,46 96,50 C66,54 54,66 50,96 C46,66 34,54 4,50 C34,46 46,34 50,4Z", "#FFE07A", 3, "#B8861E")}<circle cx="50" cy="50" r="8" fill="#FFF8D6"/>`,
  star: `${s("M50,6 L62,36 94,38 70,58 78,90 50,72 22,90 30,58 6,38 38,36Z", "#F6CA52", 3, "#8A6420")}${shine("M40,24 L46,12", 4, 0.7)}`,
  apple: `${s("M50,28 C66,18 92,24 92,52 C92,78 72,94 58,90 C54,88 46,88 42,90 C28,94 8,78 8,52 C8,24 34,18 50,28Z", "#E0473A", 3, "#7A1E16")}<path d="M50,28 C50,18 54,10 60,6" stroke="#5A3A1E" stroke-width="4" fill="none" stroke-linecap="round"/>${s("M54,18 C64,8 78,10 82,18 C72,24 62,24 54,18Z", "#7FB04A", 2.4, "#3E5A1E")}${shine("M22,46 C24,38 30,32 38,32", 5, 0.55)}`,
  berry: `${s("M50,30 C74,30 88,48 84,66 C80,86 62,96 50,96 C38,96 20,86 16,66 C12,48 26,30 50,30Z", "#E2384E", 3, "#7A1626")}${s("M30,30 L40,18 L50,28 L60,16 L70,30 C62,36 38,36 30,30Z", "#6FA840", 2.4, "#3E5A1E")}<g fill="#FFE6A0">${[[36,50],[56,48],[46,62],[66,64],[34,72],[54,78]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="2.4" ry="3.4"/>`).join("")}</g>`,
  carrot: `${s("M30,36 C44,26 62,30 66,42 L30,96 C24,98 20,94 22,88Z", "#F08A2E", 3, "#8A3E10")}<path d="M36,52 L44,56 M30,68 L38,70 M26,82 L32,84" stroke="#B85A1A" stroke-width="3" stroke-linecap="round"/>${s("M56,34 C58,18 66,8 76,4 C74,16 70,26 62,36Z M60,38 C74,30 88,30 96,36 C86,42 74,44 62,42Z", "#7FB04A", 2.4, "#3E5A1E")}`,
  ball: `<circle cx="50" cy="50" r="40" fill="#F2F0EA" stroke="#2A2622" stroke-width="3"/>${s("M50,28 L66,40 60,60 40,60 34,40Z", "#2A2622", 2, "#2A2622")}<path d="M50,28 L50,12 M66,40 L84,34 M60,60 L72,78 M40,60 L28,78 M34,40 L16,34" stroke="#2A2622" stroke-width="3"/>${shine("M24,34 C28,26 34,20 42,16", 5, 0.7)}`,
  bubble: `<circle cx="50" cy="50" r="38" fill="#CFEFFA" fill-opacity=".35" stroke="#7FB8D6" stroke-width="3"/>${shine("M28,36 C30,28 36,22 44,20", 6, 0.9)}<circle cx="68" cy="66" r="5" fill="#FFFFFF" opacity=".7"/>`,
  coin: `<circle cx="50" cy="50" r="40" fill="#F6CA52" stroke="#8A6420" stroke-width="3"/><circle cx="50" cy="50" r="28" fill="none" stroke="#C9952E" stroke-width="3"/>${s("M50,32 L56,46 70,46 58,55 62,70 50,61 38,70 42,55 30,46 44,46Z", "#FFF1B8", 2, "#C9952E")}${shine("M22,40 C24,30 30,22 40,18", 5, 0.6)}`,
  confetti: `<g stroke-width="2.4" stroke="#3A2A1A"><rect x="10" y="20" width="18" height="10" rx="2" fill="#E8604C" transform="rotate(-20 19 25)"/><rect x="58" y="10" width="18" height="10" rx="2" fill="#6A97CF" transform="rotate(25 67 15)"/><rect x="40" y="52" width="18" height="10" rx="2" fill="#F6CA52" transform="rotate(-35 49 57)"/><rect x="70" y="66" width="18" height="10" rx="2" fill="#7DAB86" transform="rotate(15 79 71)"/><circle cx="22" cy="74" r="7" fill="#C98AE6"/></g>`,
  mess: `<ellipse cx="50" cy="88" rx="40" ry="9" fill="#2E1806" opacity=".3"/>${s("M14,84 C10,70 22,62 34,64 C30,50 42,40 54,46 C52,32 66,24 72,36 C84,40 84,54 76,60 C90,64 92,80 82,86 C60,92 34,92 14,84Z", "#8A5A32", 3, "#4A2E14")}<path d="M28,74 C40,70 58,70 74,74 M40,56 C48,52 58,52 66,56" stroke="#5E3A1C" stroke-width="3" fill="none" stroke-linecap="round"/>${shine("M24,70 C26,66 30,64 34,64", 4, 0.45)}<g fill="#3A2A1A"><circle cx="44" cy="64" r="3.4"/><circle cx="60" cy="64" r="3.4"/></g><path d="M46,74 Q52,79 58,74" stroke="#3A2A1A" stroke-width="2.6" fill="none" stroke-linecap="round"/><g stroke="#7A8A6A" stroke-width="2" fill="none" opacity=".75"><path d="M22,40 q4,-6 0,-12 q-4,-6 0,-12"/><path d="M84,30 q4,-6 0,-12 q-4,-6 0,-12"/></g>`,
  leaf: `${s("M50,4 L58,26 78,16 72,38 94,40 76,56 86,74 62,68 56,90 50,72 44,90 38,68 14,74 24,56 6,40 28,38 22,16 42,26Z", "#E0782F", 2.4, "#8A3E10")}<path d="M50,30 L50,96" stroke="#8A3E10" stroke-width="2.6" stroke-linecap="round"/>`,
  bat: `${s("M50,40 C42,30 28,24 8,30 C16,36 16,44 10,52 C22,48 30,52 34,60 C40,54 46,54 50,60 C54,54 60,54 66,60 C70,52 78,48 90,52 C84,44 84,36 92,30 C72,24 58,30 50,40Z", "#3A2E4A", 2.4, "#1A1222")}<circle cx="46" cy="44" r="2" fill="#FFD86A"/><circle cx="54" cy="44" r="2" fill="#FFD86A"/>`,
};

export function decorSvg(key) {
  return DECOR[key] ? `<svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible" aria-hidden="true">${DECOR[key]}</svg>` : "";
}
