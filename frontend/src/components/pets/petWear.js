// Regular wardrobe items, drawn in a 100 x 100 box with shading that matches the pets.
// WEAR_ATTACH is the point of the box that sits on the pet's anchor (e.g. a hat's brim).
export const WEAR_SLOT = {
  scarf: "neck", bow: "head", flower_crown: "head", party_hat: "head",
  bookworm_specs: "face", backpack: "back", cape: "back",
  star_badge: "chest", crown: "head", top_hat: "head", rainbow: "head",
  magic_wand: "right", headphones: "head", shades: "face", butterfly: "back",
};

export const WEAR_ATTACH = {
  scarf: [0.5, 0.3], bow: [0.5, 0.62], flower_crown: [0.5, 0.62], party_hat: [0.5, 0.92],
  bookworm_specs: [0.5, 0.5], shades: [0.5, 0.5], headphones: [0.5, 0.5], backpack: [0.5, 0.5],
  cape: [0.5, 0.04], butterfly: [0.5, 0.5], crown: [0.5, 0.9], top_hat: [0.5, 0.92],
  star_badge: [0.5, 0.5], magic_wand: [0.22, 0.86], rainbow: [0.5, 0.82],
};

const INK = "#3A2A1A";
const s = (d, fill, w = 3, stroke = INK, extra = "") =>
  `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${extra ? " " + extra : ""}/>`;
const shine = (d, w = 3, o = 0.55) => `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="${w}" stroke-linecap="round" opacity="${o}"/>`;

const ART = {
  scarf: `
    ${s("M62,38 C66,56 70,74 76,96 L58,99 C55,80 51,62 47,44Z", "#B54A33")}
    <path d="M51,60 L68,57 M54,76 L72,73" stroke="#F0B562" stroke-width="4"/>
    <g stroke="#5E2014" stroke-width="2.4" stroke-linecap="round"><path d="M60,99 L59,105"/><path d="M66,98 L66,104"/><path d="M72,97 L74,103"/></g>
    ${s("M2,18 C30,42 70,42 98,18 L100,38 C72,66 28,66 0,38Z", "#C8553D", 3, "#5E2014")}
    <path d="M4,32 C32,54 68,54 96,32" stroke="#F0B562" stroke-width="5" fill="none"/>
    ${shine("M8,26 C22,38 36,44 48,46", 3, 0.45)}`,
  bow: `
    ${s("M48,56 C30,30 8,26 6,48 C4,70 28,76 48,64Z", "#EF8FAE", 3, "#8E3A60")}
    ${s("M52,56 C70,30 92,26 94,48 C96,70 72,76 52,64Z", "#F3A8C1", 3, "#8E3A60")}
    <path d="M14,44 C22,46 32,52 40,58 M86,44 C78,46 68,52 60,58" stroke="#C9608A" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    ${s("M50,52 m-11,0 a11,10 0 1,0 22,0 a11,10 0 1,0 -22,0", "#FFD3E1", 3, "#8E3A60")}
    ${shine("M12,40 C14,34 20,32 26,34", 3)}`,
  flower_crown: `
    <path d="M4,66 Q50,40 96,66" fill="none" stroke="#5E7A40" stroke-width="5" stroke-linecap="round"/>
    ${[[12, 62, "#F2B2B0"], [30, 54, "#FBEFD2"], [50, 50, "#F7C6C4"], [70, 54, "#FBEFD2"], [88, 62, "#F2B2B0"]].map(([x, y, c]) => `
      <g transform="translate(${x} ${y})">
        <ellipse cx="-7" cy="6" rx="7" ry="3.4" fill="#8AA86A" stroke="#4E6A36" stroke-width="1.5" transform="rotate(-25)"/>
        ${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-6" rx="4.6" ry="6.4" transform="rotate(${a})" fill="${c}" stroke="#B9776E" stroke-width="1.4"/>`).join("")}
        <circle r="3.6" fill="#E0A63E" stroke="#9A6A1E" stroke-width="1.2"/><circle cx="-1" cy="-1" r="1.2" fill="#FFF1B8"/>
      </g>`).join("")}`,
  party_hat: `
    ${s("M18,90 L50,8 L82,90Z", "#8EC2DE", 3, "#3E6582")}
    <path d="M30,62 L68,46 M24,78 L76,62" stroke="#FFF6B0" stroke-width="7" stroke-linecap="round"/>
    <path d="M50,10 L40,90" stroke="#FFFFFF" stroke-width="4" opacity=".35"/>
    ${s("M14,88 Q50,100 86,88 L86,94 Q50,106 14,94Z", "#F4C089", 2.6, "#8A5A2A")}
    <circle cx="50" cy="8" r="9" fill="#F7AA63" stroke="#8A5A2A" stroke-width="2.6"/><circle cx="47" cy="5" r="3" fill="#FFE2BC"/>`,
  bookworm_specs: `
    <circle cx="29" cy="50" r="17" fill="#CDEBF2" fill-opacity=".22" stroke="#3B2A1E" stroke-width="4"/>
    <circle cx="71" cy="50" r="17" fill="#CDEBF2" fill-opacity=".22" stroke="#3B2A1E" stroke-width="4"/>
    <path d="M46,48 Q50,43 54,48 M12,46 L2,42 M88,46 L98,42" fill="none" stroke="#3B2A1E" stroke-width="4" stroke-linecap="round"/>
    ${shine("M20,42 L27,38 M62,42 L69,38", 3, 0.8)}`,
  shades: `
    ${s("M8,40 Q26,34 46,40 L44,58 Q30,72 14,60Z", "#2E3F4E", 3, "#14232C")}
    ${s("M54,40 Q74,34 92,40 L86,60 Q70,72 56,58Z", "#2E3F4E", 3, "#14232C")}
    <path d="M46,44 L54,44 M8,42 L0,38 M92,42 L100,38" stroke="#14232C" stroke-width="4" stroke-linecap="round"/>
    ${shine("M16,46 L32,42 M62,46 L78,42", 3, 0.7)}`,
  headphones: `
    <path d="M10,62 Q8,6 50,6 Q92,6 90,62" fill="none" stroke="#2F3E50" stroke-width="9" stroke-linecap="round"/>
    <path d="M14,40 Q22,14 50,12" fill="none" stroke="#6B8296" stroke-width="3" stroke-linecap="round" opacity=".7"/>
    ${s("M0,48 Q0,40 8,40 L16,40 Q22,40 22,48 L22,74 Q22,82 16,82 L8,82 Q0,82 0,74Z", "#76B6AE", 3, "#2F3E50")}
    ${s("M78,48 Q78,40 84,40 L92,40 Q100,40 100,48 L100,74 Q100,82 92,82 L84,82 Q78,82 78,74Z", "#76B6AE", 3, "#2F3E50")}
    ${shine("M5,50 L5,68 M83,50 L83,68", 3, 0.6)}`,
  backpack: `
    ${s("M18,22 Q18,12 30,12 L70,12 Q82,12 82,22 L84,86 Q84,96 72,96 L28,96 Q16,96 16,86Z", "#C98557", 3, "#6B4A30")}
    <path d="M34,14 Q50,-6 66,14" fill="none" stroke="#6B4A30" stroke-width="4" stroke-linecap="round"/>
    ${s("M28,52 Q28,46 34,46 L66,46 Q72,46 72,52 L72,78 Q72,84 66,84 L34,84 Q28,84 28,78Z", "#E2B07C", 3, "#6B4A30")}
    <path d="M28,58 L72,58" stroke="#6B4A30" stroke-width="2.4"/>
    <rect x="45" y="54" width="10" height="9" rx="2" fill="#F2D28C" stroke="#6B4A30" stroke-width="2"/>
    ${shine("M24,24 L24,80", 3, 0.35)}`,
  cape: `
    ${s("M30,2 Q50,8 70,2 C84,14 94,34 98,58 Q74,54 50,60 Q26,54 2,58 C6,34 16,14 30,2Z", "#6F5F92", 2.4, "#3E3458")}
    <path d="M32,6 Q16,28 6,54 Q22,52 34,56 L40,8Z" fill="#8F7FB2" opacity=".9"/>
    <path d="M64,8 Q78,30 94,54 L66,57 L60,8Z" fill="#5A4C7A" opacity=".9"/>
    <path d="M8,57 Q28,52 50,58 Q72,52 92,57" fill="none" stroke="#E2C27E" stroke-width="1.8"/>`,
  butterfly: `
    ${s("M50,48 Q18,4 6,28 Q-4,58 46,62Z", "#A9CBF4", 3, "#4D60A0")}
    ${s("M50,48 Q82,4 94,28 Q104,58 54,62Z", "#A9CBF4", 3, "#4D60A0")}
    ${s("M47,60 Q12,52 14,76 Q22,96 49,68Z", "#D7BBF2", 3, "#4D60A0")}
    ${s("M53,60 Q88,52 86,76 Q78,96 51,68Z", "#D7BBF2", 3, "#4D60A0")}
    <circle cx="28" cy="34" r="6" fill="#FCEDC1"/><circle cx="72" cy="34" r="6" fill="#FCEDC1"/>
    <circle cx="26" cy="74" r="4" fill="#FFFFFF" opacity=".7"/><circle cx="74" cy="74" r="4" fill="#FFFFFF" opacity=".7"/>`,
  crown: `
    ${s("M10,40 L28,62 L50,20 L72,62 L90,40 L84,90 L16,90Z", "#F4CC5C", 3, "#8A6420")}
    <path d="M16,80 L84,80" stroke="#C9952E" stroke-width="3"/>
    <circle cx="50" cy="64" r="8" fill="#B04E78" stroke="#6E2848" stroke-width="2"/>
    <circle cx="30" cy="70" r="5.5" fill="#6A97CF" stroke="#34588A" stroke-width="2"/><circle cx="70" cy="70" r="5.5" fill="#7DAB86" stroke="#3E6A48" stroke-width="2"/>
    <circle cx="50" cy="20" r="4" fill="#FFF1B8" stroke="#8A6420" stroke-width="2"/><circle cx="10" cy="40" r="3.5" fill="#FFF1B8" stroke="#8A6420" stroke-width="2"/><circle cx="90" cy="40" r="3.5" fill="#FFF1B8" stroke="#8A6420" stroke-width="2"/>
    ${shine("M22,52 L26,82", 3, 0.6)}`,
  top_hat: `
    ${s("M28,10 Q50,4 72,10 L70,74 L30,74Z", "#3B3B55", 3, "#1E2234")}
    ${s("M30,56 L70,56 L70,72 L30,72Z", "#8E6DB3", 2.4, "#1E2234")}
    ${s("M6,80 Q50,96 94,80 Q96,90 86,92 Q50,104 14,92 Q4,90 6,80Z", "#2C2F44", 3, "#1E2234")}
    ${shine("M36,16 L36,52", 4, 0.3)}`,
  star_badge: `
    ${s("M50,6 L62,36 94,38 70,58 78,90 50,72 22,90 30,58 6,38 38,36Z", "#F6CA52", 3, "#8A6420")}
    <circle cx="50" cy="50" r="12" fill="#FFF1B8" stroke="#C9952E" stroke-width="2"/>
    ${shine("M40,22 L46,10", 3, 0.7)}`,
  magic_wand: `
    <path d="M22,88 L66,32" stroke="#5E4A70" stroke-width="8" stroke-linecap="round"/>
    <path d="M24,84 L64,34" stroke="#B49AC0" stroke-width="2.4" stroke-linecap="round"/>
    ${s("M72,6 L79,21 96,23 84,35 86,52 72,44 57,52 60,35 48,23 65,21Z", "#F2D58E", 2.6, "#9A7438")}
    <path d="M30,16 L30,26 M25,21 L35,21 M88,66 L88,76 M83,71 L93,71" stroke="#E2C27E" stroke-width="2.6" stroke-linecap="round"/>`,
  rainbow: `
    <path d="M12,80 A38,44 0 0 1 88,80" fill="none" stroke="#D9786A" stroke-width="10"/>
    <path d="M22,80 A28,34 0 0 1 78,80" fill="none" stroke="#F2C26E" stroke-width="9"/>
    <path d="M31,80 A19,25 0 0 1 69,80" fill="none" stroke="#8FBF8E" stroke-width="9"/>
    <path d="M39,80 A11,17 0 0 1 61,80" fill="none" stroke="#7FA9CC" stroke-width="7"/>
    ${s("M2,82 Q0,72 10,70 Q14,60 24,66 Q34,64 36,74 Q44,84 30,88 L12,88 Q4,88 2,82Z", "#FFF6E6", 2, "#CDBEA6")}
    ${s("M98,82 Q100,72 90,70 Q86,60 76,66 Q66,64 64,74 Q56,84 70,88 L88,88 Q96,88 98,82Z", "#FFF6E6", 2, "#CDBEA6")}`,
};

export function wearableArt(id) {
  return ART[id] || "";
}
