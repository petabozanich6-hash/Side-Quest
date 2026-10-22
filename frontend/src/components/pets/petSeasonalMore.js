// Birthday, New Year, Easter and Lunar New Year prizes and room decorations (100 x 100 boxes),
// drawn in the same style as the pets. Merged into the seasonal catalogue by petSeasonal.js.
const INK = "#3A2A1A";
const s = (d, fill, w = 3, stroke = INK, extra = "") =>
  `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${extra ? " " + extra : ""}/>`;
const shine = (d, w = 3, o = 0.55) => `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="${w}" stroke-linecap="round" opacity="${o}"/>`;
const circ = (cx, cy, r, fill, stroke = INK, w = 3) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`;

// ---------------------------------------------------------------- shared shapes
const scarf = (main, line, stripe, dash = "") => `
  ${s("M60,40 C64,58 68,76 74,96 L56,98 C54,80 50,62 46,46Z", main, 3, line)}
  <path d="M50,60 L67,57 M53,76 L71,73" stroke="${stripe}" stroke-width="5"/>
  <g stroke="${line}" stroke-width="2.4" stroke-linecap="round"><path d="M58,98 L57,104"/><path d="M64,97 L64,103"/><path d="M70,96 L72,102"/></g>
  ${s("M2,18 C30,42 70,42 98,18 L100,38 C72,66 28,66 0,38Z", main, 3, line)}
  <path d="M4,30 C32,52 68,52 96,30" stroke="${stripe}" stroke-width="5" fill="none"${dash ? ` stroke-dasharray="${dash}"` : ""}/>
  ${shine("M8,26 C22,38 36,44 48,46", 3, 0.4)}`;
const necklace = (cord, pendant) => `<path d="M4,14 C30,40 70,40 96,14" fill="none" stroke="${cord}" stroke-width="5" stroke-linecap="round"/><path d="M50,34 L50,42" stroke="${cord}" stroke-width="3"/>${pendant}`;
const shoe = (main, trim, line = INK, extra = "") => `
  ${s("M14,52 C14,40 26,34 40,36 L62,40 C80,44 94,54 94,70 C94,80 86,84 76,84 L20,84 C12,84 8,78 10,70Z", main, 3, line)}
  ${s("M8,78 L96,78 L94,86 Q88,92 76,92 L20,92 Q10,92 8,86Z", trim, 2.6, line)}
  ${extra}${shine("M22,46 C30,42 40,42 48,44", 3, 0.5)}`;
const boot = (main, trim, line = INK) => `
  ${s("M26,10 L60,10 L60,52 C76,56 90,62 94,72 C96,80 88,84 78,84 L20,84 C12,84 8,80 10,72 L14,52Z", main, 3, line)}
  ${s("M24,10 L62,10 L62,22 L24,22Z", trim, 2.4, line)}
  ${s("M8,80 L96,80 L94,88 Q88,94 76,94 L20,94 Q10,94 8,88Z", trim, 2.4, line)}
  ${shine("M32,26 L32,48", 3, 0.4)}`;
const balloon = (fill, line) => `
  ${s("M50,6 C70,6 82,22 82,40 C82,60 64,74 50,74 C36,74 18,60 18,40 C18,22 30,6 50,6Z", fill, 3, line)}
  ${s("M44,74 L56,74 L50,82Z", fill, 2.4, line)}
  <path d="M50,82 C44,88 56,92 50,98" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>
  ${shine("M30,26 C32,18 38,14 44,12", 5, 0.6)}`;
const star = (fill, line) => s("M50,6 L62,36 94,38 70,58 78,90 50,72 22,90 30,58 6,38 38,36Z", fill, 3, line);
const sparkle = (cx, cy, r, fill) => `<path d="M${cx},${cy - r} C${cx + r * 0.15},${cy - r * 0.15} ${cx + r * 0.15},${cy - r * 0.15} ${cx + r},${cy} C${cx + r * 0.15},${cy + r * 0.15} ${cx + r * 0.15},${cy + r * 0.15} ${cx},${cy + r} C${cx - r * 0.15},${cy + r * 0.15} ${cx - r * 0.15},${cy + r * 0.15} ${cx - r},${cy} C${cx - r * 0.15},${cy - r * 0.15} ${cx - r * 0.15},${cy - r * 0.15} ${cx},${cy - r}Z" fill="${fill}" stroke="#B8861E" stroke-width="1.6"/>`;
const flower = (cx, cy, r, petal, mid = "#F6CA52") => `<g transform="translate(${cx} ${cy})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="${-r}" rx="${r * 0.62}" ry="${r * 0.95}" transform="rotate(${a})" fill="${petal}" stroke="#9A6A6A" stroke-width="1.4"/>`).join("")}<circle r="${r * 0.55}" fill="${mid}" stroke="#9A6A1E" stroke-width="1.2"/></g>`;
const medal = (ribbonA, ribbonB, disc, line, face = "") => `
  ${s("M30,4 L46,4 L56,40 L42,44Z", ribbonA, 2.4, line)}${s("M70,4 L54,4 L44,40 L58,44Z", ribbonB, 2.4, line)}
  ${circ(50, 64, 26, disc, line)}<circle cx="50" cy="64" r="18" fill="none" stroke="#FFFFFF" stroke-width="2" opacity=".5"/>${face}
  ${shine("M34,56 C36,48 42,44 48,42", 4, 0.6)}`;
const egg = (base, band, dots) => `
  ${s("M50,8 C70,8 84,40 84,60 C84,82 68,94 50,94 C32,94 16,82 16,60 C16,40 30,8 50,8Z", base, 3, "#6A4A3A")}
  ${s("M17,56 C32,48 40,62 50,54 C60,46 70,62 84,54 L84,66 C70,74 60,58 50,66 C40,74 32,60 16,68Z", band, 2, "#6A4A3A")}
  <g fill="${dots}"><circle cx="38" cy="34" r="4"/><circle cx="60" cy="28" r="3.5"/><circle cx="50" cy="82" r="4"/><circle cx="30" cy="80" r="3"/><circle cx="70" cy="80" r="3"/></g>
  ${shine("M30,32 C32,24 36,18 42,16", 4, 0.65)}`;
const lantern = `
  <path d="M50,2 L50,14" stroke="${INK}" stroke-width="3"/>
  ${s("M36,12 L64,12 L64,20 L36,20Z", "#C9952E", 2.4)}
  ${s("M50,18 C80,18 90,34 90,50 C90,66 80,82 50,82 C20,82 10,66 10,50 C10,34 20,18 50,18Z", "#D9343A", 3, "#6A1418")}
  <path d="M50,18 C36,30 36,70 50,82 M50,18 C64,30 64,70 50,82 M28,22 C18,36 18,64 28,78 M72,22 C82,36 82,64 72,78" fill="none" stroke="#8A1A20" stroke-width="2"/>
  ${s("M36,80 L64,80 L64,88 L36,88Z", "#C9952E", 2.4)}
  <path d="M42,88 L40,100 M50,88 L50,100 M58,88 L60,100" stroke="#F2C95B" stroke-width="2.6" stroke-linecap="round"/>
  <ellipse cx="50" cy="50" rx="22" ry="26" fill="#FFB43C" opacity=".25"/>
  ${shine("M22,40 C24,32 28,26 34,24", 4, 0.5)}`;
const mandarin = `
  ${s("M50,22 C74,22 90,38 90,58 C90,80 72,94 50,94 C28,94 10,80 10,58 C10,38 26,22 50,22Z", "#F59A2E", 3, "#9A4E10")}
  <g fill="#D97A1E" opacity=".6"><circle cx="34" cy="52" r="1.8"/><circle cx="60" cy="44" r="1.8"/><circle cx="68" cy="68" r="1.8"/><circle cx="42" cy="76" r="1.8"/></g>
  ${s("M50,24 C48,16 50,10 54,6", "none", 3, "#4A3418")}
  ${s("M54,18 C64,6 80,8 86,16 C76,24 62,24 54,18Z", "#5E9A3A", 2.4, "#2E5A1E")}
  ${shine("M22,48 C24,40 30,34 38,32", 5, 0.55)}`;
const cake = `
  ${s("M12,56 L88,56 L88,90 L12,90Z", "#F7D7A8", 3, "#8A5A32")}
  ${s("M12,56 C20,64 28,52 36,60 C44,68 52,52 60,60 C68,68 76,52 88,60 L88,50 L12,50Z", "#F3A8C1", 2.6, "#9A4060")}
  ${s("M6,88 L94,88 L94,96 L6,96Z", "#E2C287", 2.4, "#8A6A30")}
  <g stroke="#3A2A1A" stroke-width="2">${[30, 50, 70].map((x, i) => `<rect x="${x - 4}" y="28" width="8" height="22" rx="2" fill="${["#6A97CF", "#F6CA52", "#7DAB86"][i]}"/>`).join("")}</g>
  ${[30, 50, 70].map((x) => `<path d="M${x},10 C${x + 5},16 ${x + 5},22 ${x},26 C${x - 5},22 ${x - 5},16 ${x},10Z" fill="#FFB43C" stroke="#C9661E" stroke-width="1.6"/>`).join("")}
  <g fill="#E0473A"><circle cx="24" cy="74" r="3"/><circle cx="50" cy="78" r="3"/><circle cx="76" cy="74" r="3"/></g>
  ${shine("M18,64 L18,84", 3, 0.5)}`;
const present = (box, ribbon) => `
  ${s("M10,40 L90,40 L90,92 L10,92Z", box, 3)}${s("M4,28 L96,28 L96,42 L4,42Z", box, 3)}
  <path d="M44,28 L44,92 L56,92 L56,28Z" fill="${ribbon}" stroke="${INK}" stroke-width="2"/>
  ${s("M50,28 C40,10 22,10 24,22 C26,30 40,30 50,28Z", ribbon, 2.6)}${s("M50,28 C60,10 78,10 76,22 C74,30 60,30 50,28Z", ribbon, 2.6)}
  ${shine("M16,50 L16,84", 4, 0.35)}`;
const clock = `
  ${circ(50, 54, 40, "#F6E7C4", "#6A4A2A", 4)}${circ(50, 54, 33, "#FFFDF4", "#C9A56A", 2)}
  <g stroke="#6A4A2A" stroke-width="3" stroke-linecap="round">${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => `<path d="M50,${a % 90 ? 25 : 23} L50,${a % 90 ? 29 : 31}" transform="rotate(${a} 50 54)"/>`).join("")}</g>
  <path d="M50,54 L50,30 M50,54 L50,34" stroke="#3A2A1A" stroke-width="4" stroke-linecap="round"/>
  ${circ(50, 54, 4, "#C9952E", "#6A4A2A", 2)}
  ${s("M24,18 L32,10 M76,18 L68,10", "none", 5, "#6A4A2A")}
  ${shine("M22,40 C26,30 34,22 44,20", 4, 0.6)}`;
const firework = (a, b) => `<g stroke-linecap="round">${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((r, i) => `<path d="M50,50 L50,${i % 2 ? 18 : 10}" transform="rotate(${r} 50 50)" stroke="${i % 2 ? b : a}" stroke-width="5"/>`).join("")}</g>${[0, 60, 120, 180, 240, 300].map((r) => `<circle cx="50" cy="6" r="4" fill="${b}" transform="rotate(${r + 15} 50 50)"/>`).join("")}<circle cx="50" cy="50" r="7" fill="#FFF6C8"/>`;
const butterflyWing = `${s("M90,60 C70,30 40,20 18,30 C8,36 10,52 22,58 C10,62 8,78 20,84 C40,92 70,78 90,60Z", "#F6B8D6", 3, "#9A4A7A")}<circle cx="40" cy="42" r="7" fill="#FFF3C0"/><circle cx="34" cy="72" r="5" fill="#C9E8F7"/>`;
const tulip = (fill) => `${s("M50,96 L50,54", "none", 4, "#3E6A2A")}${s("M50,74 C38,70 30,60 30,50 C40,54 48,62 50,74Z", "#7FB04A", 2, "#3E6A2A")}${s("M34,30 L42,40 L50,24 L58,40 L66,30 C68,44 62,56 50,58 C38,56 32,44 34,30Z", fill, 2.6, "#8A2A40")}`;

// ---------------------------------------------------------------- prizes
export const MORE_PRIZES = {
  // Birthday
  "birthday-1": { attach: [0.5, 0.72], scale: 1.15, svg: cake },
  "birthday-2": { attach: [0.5, 0.9], svg: `
    ${s("M10,40 L28,62 L50,20 L72,62 L90,40 L84,90 L16,90Z", "#F3A8C1", 3, "#9A4060")}
    <path d="M16,78 L84,78" stroke="#F6CA52" stroke-width="5"/>
    <g fill="#FFF1B8" stroke="#9A4060" stroke-width="2"><circle cx="50" cy="20" r="5"/><circle cx="10" cy="40" r="4"/><circle cx="90" cy="40" r="4"/></g>
    ${sparkle(50, 60, 10, "#FFF6C8")}
    ${shine("M22,52 L26,74", 3, 0.6)}` },
  "birthday-3": { attach: [0.5, 1.0], scale: 0.9, svg: balloon("#E0473A", "#7A1E16") },
  "birthday-4": { attach: [0.5, 0.5], svg: `
    ${s("M6,38 Q26,30 46,40 L42,60 Q26,72 12,60 Q2,50 6,38Z", "#F6CA52", 3, "#8A6420")}
    ${s("M54,40 Q74,30 94,38 Q98,50 88,60 Q74,72 58,60Z", "#F6CA52", 3, "#8A6420")}
    <path d="M12,44 Q26,40 40,46 L38,56 Q26,64 16,56Z M60,46 Q74,40 88,44 L84,56 Q74,64 62,56Z" fill="#7FC8E6"/>
    <path d="M46,44 L54,44" stroke="#8A6420" stroke-width="4" stroke-linecap="round"/>
    <g fill="#E0473A"><circle cx="8" cy="30" r="3"/><circle cx="92" cy="30" r="3"/></g><g fill="#6A97CF"><circle cx="16" cy="24" r="2.4"/><circle cx="84" cy="24" r="2.4"/></g>
    ${shine("M18,48 L30,45 M64,48 L76,45", 2.4, 0.8)}` },
  "birthday-5": { attach: [0.5, 0.22], svg: necklace("#C8343A", medal("#C8343A", "#6A97CF", "#F6CA52", "#8A6420", `<text x="50" y="72" font-family="Georgia,serif" font-size="22" font-weight="700" text-anchor="middle" fill="#8A6420">1</text>`).replace(/M30,4 L46,4|M70,4 L54,4/g, (m) => m)) },
  "birthday-6": { attach: [0.5, 0.3], svg: scarf("#8E6DB3", "#3E2E58", "#F6CA52", "3 5") },
  "birthday-7": { attach: [0.5, 0.5], scale: 1.5, svg: `
    ${s("M22,52 L78,52 L70,92 L30,92Z", "#F7D7A8", 3, "#8A5A32")}
    <path d="M34,56 L38,90 M50,56 L50,90 M66,56 L62,90" stroke="#D9A86A" stroke-width="2.4"/>
    ${s("M18,54 C14,40 26,30 36,34 C38,20 62,20 64,34 C74,30 86,40 82,54Z", "#F3A8C1", 3, "#9A4060")}
    ${circ(50, 20, 6, "#E0473A", "#7A1E16", 2.4)}
    <g fill="#FFFFFF"><rect x="30" y="40" width="5" height="2.4" rx="1" transform="rotate(30 32 41)"/><rect x="58" y="38" width="5" height="2.4" rx="1" transform="rotate(-20 60 39)"/><rect x="44" y="46" width="5" height="2.4" rx="1"/></g>` },
  "birthday-8": { attach: [0.5, 0.5], scale: 1.7, svg: `
    ${s("M26,10 L74,10 C74,40 64,56 50,58 C36,56 26,40 26,10Z", "#F6CA52", 3, "#8A6420")}
    ${s("M26,16 C10,16 8,36 26,38 M74,16 C90,16 92,36 74,38", "none", 4, "#8A6420")}
    ${s("M44,58 L56,58 L58,74 L42,74Z", "#E2B03E", 2.4, "#8A6420")}
    ${s("M30,74 L70,74 L74,90 L26,90Z", "#8A5A32", 3, "#4A2E14")}
    ${star("#FFF1B8", "#C9952E").replace('stroke-width="3"', 'stroke-width="2" transform="translate(36 18) scale(.28)"')}
    ${shine("M34,18 L36,40", 4, 0.6)}` },
  "birthday-9": { attach: [0.42, 0.86], svg: `
    ${s("M30,46 L70,46 L50,96Z", "#E2B07C", 3, "#8A5A32")}
    <path d="M38,56 L56,80 M48,50 L62,66 M62,50 L44,76" stroke="#B9844E" stroke-width="2"/>
    ${s("M26,46 C20,30 34,18 50,20 C66,18 80,30 74,46Z", "#F7C6D8", 3, "#9A4060")}
    ${s("M34,24 C34,10 48,4 56,12 C66,10 70,22 64,26", "#FFF4E6", 2.6, "#B49A80")}
    ${circ(56, 6, 5, "#E0473A", "#7A1E16", 2)}
    ${shine("M32,34 C34,28 38,24 44,22", 3, 0.6)}` },
  "birthday-10": { attach: [0.5, 0.6], mirror: true, scale: 1.25, svg: `
    ${s("M30,76 C30,68 38,64 46,66 L46,20 L80,12 L80,64 C80,72 72,76 64,74 C56,72 56,62 64,60 C68,59 72,60 74,62 L74,30 L52,35 L52,72 C52,80 44,84 38,82 C32,80 30,78 30,76Z", "#5E4A86", 2.4, "#2E1A4A")}
    <ellipse cx="38" cy="74" rx="8" ry="6" fill="#8E6DB3"/>` },
  "birthday-11": { attach: [0.5, 0.58], mirror: true, scale: 1.05, svg: shoe("#F3A8C1", "#C9608A", "#7A2A50", `<path d="M40,38 C50,26 62,26 66,40" stroke="#C9608A" stroke-width="3" fill="none"/><circle cx="54" cy="44" r="6" fill="#FFE4EC" stroke="#7A2A50" stroke-width="2"/>`) },
  "birthday-12": { attach: [0.5, 0.5], mirror: true, svg: `
    ${s("M50,30 C72,30 84,48 80,64 C76,82 60,92 50,92 C40,92 24,82 20,64 C16,48 28,30 50,30Z", "#E2384E", 3, "#7A1626")}
    ${s("M32,30 L40,20 L50,28 L60,18 L68,30 C60,36 40,36 32,30Z", "#6FA840", 2.4, "#3E5A1E")}
    <g fill="#FFE6A0">${[[38, 50], [58, 48], [48, 62], [66, 64], [36, 72], [54, 78]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="3.4"/>`).join("")}</g>` },

  // New Year
  "new_year-1": { attach: [0.3, 0.86], scale: 1.5, svg: `
    ${s("M18,90 L40,40 L62,62Z", "#8E6DB3", 3, "#3E2E58")}
    <path d="M28,68 L46,78 M34,54 L52,66" stroke="#F6CA52" stroke-width="4"/>
    <g stroke-width="2"><rect x="60" y="22" width="10" height="6" rx="2" fill="#E0473A" stroke="${INK}" transform="rotate(30 65 25)"/><rect x="74" y="40" width="10" height="6" rx="2" fill="#6A97CF" stroke="${INK}" transform="rotate(-20 79 43)"/><rect x="52" y="8" width="10" height="6" rx="2" fill="#7DAB86" stroke="${INK}" transform="rotate(10 57 11)"/></g>
    ${sparkle(84, 18, 9, "#FFE07A")}${sparkle(70, 62, 6, "#FFE07A")}` },
  "new_year-2": { attach: [0.5, 0.92], svg: `
    ${s("M28,10 Q50,4 72,10 L70,74 L30,74Z", "#2C2F44", 3, "#14182A")}
    ${s("M30,56 L70,56 L70,72 L30,72Z", "#F6CA52", 2.4, "#14182A")}
    ${s("M6,80 Q50,96 94,80 Q96,90 86,92 Q50,104 14,92 Q4,90 6,80Z", "#20243A", 3, "#14182A")}
    ${sparkle(62, 30, 8, "#FFF6C8")}${shine("M36,16 L36,52", 4, 0.3)}` },
  "new_year-3": { attach: [0.5, 0.7], scale: 1.15, svg: `
    <ellipse cx="50" cy="56" rx="44" ry="14" fill="none" stroke="#F6CA52" stroke-width="7"/>
    <ellipse cx="50" cy="56" rx="44" ry="14" fill="none" stroke="#FFF6C8" stroke-width="2.4"/>
    ${sparkle(20, 40, 9, "#FFE07A")}${sparkle(76, 34, 11, "#FFE07A")}${sparkle(50, 26, 7, "#FFF6C8")}` },
  "new_year-4": { attach: [0.5, 0.5], svg: `
    ${s("M2,40 Q24,24 50,40 Q76,24 98,40 Q96,62 76,64 Q60,64 50,52 Q40,64 24,64 Q4,62 2,40Z", "#8E6DB3", 3, "#3E2E58")}
    <ellipse cx="28" cy="46" rx="12" ry="8" fill="#2A1E3A"/><ellipse cx="72" cy="46" rx="12" ry="8" fill="#2A1E3A"/>
    <path d="M8,36 Q24,28 40,36 M60,36 Q76,28 92,36" stroke="#F6CA52" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${sparkle(94, 22, 8, "#FFE07A")}` },
  "new_year-5": { attach: [0.5, 0.3], svg: scarf("#2E3F6E", "#14182A", "#F6CA52") + `<g stroke="${INK}" stroke-width="1.4"><rect x="20" y="30" width="7" height="4" rx="1" fill="#E0473A" transform="rotate(20 23 32)"/><rect x="40" y="40" width="7" height="4" rx="1" fill="#7DAB86" transform="rotate(-30 43 42)"/><rect x="66" y="36" width="7" height="4" rx="1" fill="#F3A8C1" transform="rotate(40 69 38)"/><rect x="58" y="74" width="7" height="4" rx="1" fill="#6A97CF" transform="rotate(-10 61 76)"/></g>` },
  "new_year-6": { attach: [0.5, 0.3], svg: `
    <path d="M4,14 C30,40 70,40 96,14" fill="none" stroke="#C9608A" stroke-width="6" stroke-linecap="round"/>
    ${s("M48,38 C30,22 12,24 12,38 C12,52 32,54 48,44Z", "#F3A8C1", 3, "#8E3A60")}${s("M52,38 C70,22 88,24 88,38 C88,52 68,54 52,44Z", "#F3A8C1", 3, "#8E3A60")}
    ${s("M46,44 L36,82 L44,78 L48,86Z M54,44 L64,82 L56,78 L52,86Z", "#EF8FAE", 2.4, "#8E3A60")}
    ${circ(50, 40, 8, "#FFD3E1", "#8E3A60", 2.6)}` },
  "new_year-7": { attach: [0.5, 0.5], scale: 1.25, svg: clock },
  "new_year-8": { attach: [0.5, 0.5], scale: 1.2, svg: `${s("M50,8 C54,38 62,46 92,50 C62,54 54,62 50,92 C46,62 38,54 8,50 C38,46 46,38 50,8Z", "#FFE07A", 3, "#B8861E")}<circle cx="50" cy="50" r="8" fill="#FFF8D6"/>${sparkle(80, 18, 8, "#FFF6C8")}` },
  "new_year-9": { attach: [0.3, 0.9], scale: 1.5, svg: `
    <path d="M20,96 L52,42" stroke="#8A8A96" stroke-width="5" stroke-linecap="round"/>
    <path d="M44,56 L52,42" stroke="#5A5A66" stroke-width="7" stroke-linecap="round"/>
    <g stroke="#FFD24A" stroke-width="3" stroke-linecap="round">${[0, 40, 80, 120, 160, 200, 240, 280, 320].map((r) => `<path d="M56,36 L56,${r % 80 ? 14 : 8}" transform="rotate(${r} 56 36)"/>`).join("")}</g>
    <circle cx="56" cy="36" r="7" fill="#FFF6C8"/>` },
  "new_year-10": { attach: [0.5, 0.6], mirror: true, scale: 1.2, svg: firework("#E0473A", "#F6CA52") },
  "new_year-11": { attach: [0.5, 0.58], mirror: true, scale: 1.05, svg: shoe("#F4F0E6", "#6A97CF", "#2E3F6E", `<path d="M36,46 L44,54 M44,42 L52,50 M52,40 L60,48" stroke="#2E3F6E" stroke-width="3" stroke-linecap="round"/><path d="M60,58 Q74,56 86,62" stroke="#E0473A" stroke-width="5" fill="none" stroke-linecap="round"/>`) },
  "new_year-12": { attach: [0.5, 0.5], mirror: true, svg: `${star("#FFD24A", "#9A7420")}<circle cx="50" cy="52" r="9" fill="#FFF6C8"/>` },

  // Easter
  "easter-1": { attach: [0.5, 0.95], scale: 1.1, svg: `
    <path d="M14,92 Q50,74 86,92" fill="none" stroke="#C9B8A0" stroke-width="6" stroke-linecap="round"/>
    ${s("M30,88 C18,60 18,22 30,8 C42,22 44,60 40,88Z", "#FBFAF4", 3, "#9A8A7A")}${s("M30,80 C24,58 24,30 30,18 C36,30 38,58 36,80Z", "#F6C0CC", 0, "none")}
    ${s("M70,88 C82,60 82,22 70,8 C58,22 56,60 60,88Z", "#FBFAF4", 3, "#9A8A7A")}${s("M70,80 C76,58 76,30 70,18 C64,30 62,58 64,80Z", "#F6C0CC", 0, "none")}` },
  "easter-2": { attach: [0.5, 0.72], svg: `<path d="M4,70 Q50,44 96,70" fill="none" stroke="#5E7A40" stroke-width="5" stroke-linecap="round"/>${[[14, -12, "#F3A8C1"], [32, -4, "#F6CA52"], [50, 0, "#E0473A"], [68, -4, "#C98AE6"], [86, -12, "#F3A8C1"]].map(([x, r, c]) => `<g transform="translate(${x - 50} ${-4 + Math.abs(x - 50) / 4}) rotate(${r} 50 60) scale(1)">${tulip(c).replace(/M50,96 L50,54/, "M50,68 L50,54")}</g>`).join("")}` },
  "easter-3": { attach: [0.5, 0.5], svg: `
    <circle cx="29" cy="50" r="17" fill="#FDF2C8" fill-opacity=".25" stroke="#C98A3E" stroke-width="4"/>
    <circle cx="71" cy="50" r="17" fill="#FDF2C8" fill-opacity=".25" stroke="#C98A3E" stroke-width="4"/>
    <path d="M46,48 Q50,43 54,48 M12,46 L2,42 M88,46 L98,42" fill="none" stroke="#C98A3E" stroke-width="4" stroke-linecap="round"/>
    ${flower(10, 40, 4, "#F3A8C1")}${shine("M20,42 L27,38 M62,42 L69,38", 3, 0.8)}` },
  "easter-4": { attach: [0.5, 0.25], svg: `<path d="M4,14 C30,44 70,44 96,14" fill="none" stroke="#5E7A40" stroke-width="3"/>${[[8, 18], [22, 28], [36, 34], [50, 36], [64, 34], [78, 28], [92, 18]].map(([x, y]) => flower(x, y, 5.6, "#FFFFFF")).join("")}` },
  "easter-5": { attach: [0.5, 0.25], svg: `<path d="M4,14 C30,44 70,44 96,14" fill="none" stroke="#3E6A2A" stroke-width="4"/>${[[10, 20, -50], [24, 30, -30], [38, 36, -10], [52, 38, 10], [66, 36, 30], [80, 30, 50], [92, 20, 70]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y + 6}" rx="5" ry="10" fill="${r % 20 ? "#7FB04A" : "#5E9A3A"}" stroke="#2E5A1E" stroke-width="1.6" transform="rotate(${r} ${x} ${y + 6})"/>`).join("")}` },
  "easter-6": { attach: [0.5, 0.5], scale: 1.7, svg: medal("#F3A8C1", "#F6CA52", "#8A5A32", "#4A2E14", `<circle cx="50" cy="64" r="16" fill="#A06A3E"/><path d="M42,60 Q50,54 58,60" stroke="#C98A5A" stroke-width="3" fill="none"/>`) },
  "easter-7": { attach: [0.5, 0.5], scale: 1.2, svg: `
    ${circ(50, 50, 40, "#FFF6E6", "#B49A80", 3)}
    <path d="M20,64 A30,30 0 0 1 80,64" fill="none" stroke="#D9786A" stroke-width="7"/>
    <path d="M28,64 A22,22 0 0 1 72,64" fill="none" stroke="#F2C26E" stroke-width="7"/>
    <path d="M36,64 A14,14 0 0 1 64,64" fill="none" stroke="#8FBF8E" stroke-width="7"/>
    <path d="M44,64 A6,6 0 0 1 56,64" fill="none" stroke="#7FA9CC" stroke-width="5"/>` },
  "easter-8": { attach: [0.5, 0.75], scale: 1.15, svg: `
    <path d="M18,46 C18,10 82,10 82,46" fill="none" stroke="#8A5A32" stroke-width="6"/>
    ${egg("#F3A8C1", "#FFF6E6", "#C9608A").replace(/<path d="M50,8[^/]*\/>/, (m) => m).replace("C70,8 84,40", "C70,8 84,40").replace(/^/, '<g transform="translate(14 8) scale(.42)">') + "</g>"}
    ${egg("#8FD3EE", "#FFF6E6", "#4A8AB0").replace(/^/, '<g transform="translate(42 4) scale(.42)">') + "</g>"}
    ${s("M8,46 L92,46 L84,90 Q50,98 16,90Z", "#D9A86A", 3, "#6A4A2A")}
    <path d="M12,58 L88,58 M14,72 L86,72 M30,46 L32,92 M50,46 L50,94 M70,46 L68,92" stroke="#A8784A" stroke-width="2.4"/>` },
  "easter-9": { attach: [0.5, 0.5], scale: 1.1, svg: egg("#F6CA52", "#8FD3EE", "#E0473A") },
  "easter-10": { attach: [0.5, 0.6], mirror: true, scale: 1.4, svg: butterflyWing },
  "easter-11": { attach: [0.5, 0.58], mirror: true, scale: 1.05, svg: boot("#F6CA52", "#7FB04A", "#6A5A1E") + flower(42, 36, 5, "#F3A8C1") },
  "easter-12": { attach: [0.5, 0.5], mirror: true, svg: `
    ${s("M50,22 C74,22 88,40 88,58 C88,78 72,90 50,90 C28,90 12,78 12,58 C12,40 26,22 50,22Z", "#E0473A", 3, "#7A1E16")}
    <path d="M50,22 L50,90" stroke="#3A2A1A" stroke-width="3"/>
    ${s("M30,26 C30,12 70,12 70,26 C62,20 38,20 30,26Z", "#2A2232", 2, "#2A2232")}
    <g fill="#2A2232"><circle cx="34" cy="48" r="6"/><circle cx="66" cy="48" r="6"/><circle cx="34" cy="70" r="5"/><circle cx="66" cy="70" r="5"/></g>
    ${shine("M22,52 C24,42 30,36 38,32", 4, 0.5)}` },

  // Lunar New Year
  "lunar_new_year-1": { attach: [0.4, 0.2], svg: `
    ${s("M20,10 L80,10 L80,92 L20,92Z", "#D9343A", 3, "#6A1418")}
    ${s("M20,10 L80,10 L50,40Z", "#C02A30", 3, "#6A1418")}
    ${circ(50, 40, 10, "#F6CA52", "#8A6420", 2.6)}
    <path d="M44,40 L56,40 M50,34 L50,46" stroke="#8A6420" stroke-width="2"/>
    <path d="M30,66 L70,66 M30,76 L70,76" stroke="#F6CA52" stroke-width="2.4" stroke-dasharray="4 4"/>
    ${shine("M26,50 L26,86", 3, 0.35)}` },
  "lunar_new_year-2": { attach: [0.5, 0.82], scale: 1.1, svg: `
    ${s("M50,10 C82,10 96,34 94,58 C92,72 80,80 50,80 C20,80 8,72 6,58 C4,34 18,10 50,10Z", "#E0473A", 3, "#6A1418")}
    <path d="M8,58 Q20,42 28,58 Q36,42 44,58 Q50,42 56,58 Q64,42 72,58 Q80,42 92,58" fill="none" stroke="#F6CA52" stroke-width="4"/>
    ${circ(32, 30, 8, "#FFFFFF", "#6A1418", 2.4)}${circ(68, 30, 8, "#FFFFFF", "#6A1418", 2.4)}<circle cx="32" cy="31" r="3.4" fill="#2A1E1A"/><circle cx="68" cy="31" r="3.4" fill="#2A1E1A"/>
    ${s("M38,8 C40,0 48,0 50,6 C52,0 60,0 62,8", "#F6CA52", 2.4, "#8A6420")}
    <g fill="#FBFAF4" stroke="#9A8A7A" stroke-width="1.4"><circle cx="10" cy="72" r="6"/><circle cx="22" cy="80" r="6"/><circle cx="90" cy="72" r="6"/><circle cx="78" cy="80" r="6"/></g>` },
  "lunar_new_year-3": { attach: [0.5, 0.9], svg: `
    <path d="M6,84 Q50,70 94,84" fill="none" stroke="#3E6A2A" stroke-width="5" stroke-linecap="round"/>
    ${[[20, 80, 40], [36, 78, 56], [50, 76, 64], [64, 78, 56], [80, 80, 40]].map(([x, b, h]) => `${s(`M${x - 5},${b} L${x - 5},${b - h} Q${x},${b - h - 8} ${x + 5},${b - h} L${x + 5},${b}Z`, "#8AB85A", 2.4, "#3E6A2A")}<path d="M${x - 5},${b - h / 2} L${x + 5},${b - h / 2}" stroke="#3E6A2A" stroke-width="2"/>`).join("")}
    ${s("M50,24 C40,12 44,4 50,4 C56,4 60,12 50,24Z", "#7FB04A", 2, "#3E6A2A")}` },
  "lunar_new_year-4": { attach: [0.5, 0.5], svg: `
    ${s("M6,38 Q26,30 46,40 L44,58 Q30,70 14,60 Q2,48 6,38Z", "#D9343A", 3, "#6A1418")}
    ${s("M54,40 Q74,30 94,38 Q98,48 86,60 Q70,70 56,58Z", "#D9343A", 3, "#6A1418")}
    <path d="M12,44 Q26,40 40,46 L38,54 Q28,62 16,54Z M60,46 Q74,40 88,44 L84,54 Q72,62 62,54Z" fill="#2A1E1A"/>
    <path d="M46,44 L54,44" stroke="#F6CA52" stroke-width="4" stroke-linecap="round"/>
    ${shine("M18,48 L30,45 M64,48 L76,45", 2.4, 0.7)}` },
  "lunar_new_year-5": { attach: [0.5, 0.22], svg: necklace("#D9343A", `${circ(50, 62, 18, "#F6CA52", "#8A6420")}<rect x="44" y="56" width="12" height="12" fill="#FBF1D2" stroke="#8A6420" stroke-width="2"/>${shine("M38,56 C40,50 44,46 48,46", 3, 0.6)}`) },
  "lunar_new_year-6": { attach: [0.5, 0.3], svg: `
    <path d="M4,14 C30,40 70,40 96,14" fill="none" stroke="#D9343A" stroke-width="7" stroke-linecap="round"/>
    ${s("M50,38 C34,22 14,26 16,40 C18,52 38,50 50,42Z", "#D9343A", 3, "#6A1418")}${s("M50,38 C66,22 86,26 84,40 C82,52 62,50 50,42Z", "#D9343A", 3, "#6A1418")}
    ${s("M46,42 L34,90 L42,84 L46,94Z M54,42 L66,90 L58,84 L54,94Z", "#C02A30", 2.4, "#6A1418")}
    ${circ(50, 40, 7, "#F6CA52", "#8A6420", 2.4)}` },
  "lunar_new_year-7": { attach: [0.5, 0.5], scale: 1.6, svg: `
    ${s("M10,66 C10,40 30,26 50,26 C70,26 90,40 90,66 C78,74 22,74 10,66Z", "#FBF4E2", 3, "#9A8A6A")}
    <path d="M24,40 Q30,48 28,60 M38,32 Q42,44 40,60 M50,28 L50,60 M62,32 Q58,44 60,60 M76,40 Q70,48 72,60" stroke="#C9B890" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <circle cx="42" cy="56" r="2.4" fill="#3A2A1A"/><circle cx="58" cy="56" r="2.4" fill="#3A2A1A"/><path d="M46,62 Q50,65 54,62" stroke="#3A2A1A" stroke-width="2" fill="none"/>
    <g fill="#F07F6E" opacity=".5"><ellipse cx="34" cy="62" rx="4" ry="2.4"/><ellipse cx="66" cy="62" rx="4" ry="2.4"/></g>` },
  "lunar_new_year-8": { attach: [0.5, 0.5], scale: 1.2, svg: mandarin },
  "lunar_new_year-9": { attach: [0.5, 0.12], scale: 1.1, svg: lantern },
  "lunar_new_year-10": { attach: [0.5, 0.5], mirror: true, svg: `
    ${s("M8,58 C8,30 30,16 52,20 C74,24 92,40 90,60 C80,52 66,50 50,56 C34,62 20,64 8,58Z", "#F2C26E", 3, "#9A6A1E")}
    <path d="M12,58 C26,54 40,50 52,40" stroke="#C9952E" stroke-width="2.4" fill="none"/>
    <rect x="54" y="48" width="26" height="8" fill="#FFFFFF" stroke="#C9952E" stroke-width="1.4" transform="rotate(-8 67 52)"/>` },
  "lunar_new_year-11": { attach: [0.5, 0.5], mirror: true, scale: 1.1, svg: flower(50, 50, 18, "#F7C6D8", "#E0473A") },
  "lunar_new_year-12": { attach: [0.5, 0.58], mirror: true, scale: 1.05, svg: shoe("#D9343A", "#F6CA52", "#6A1418", `${circ(30, 46, 5, "#FFFFFF", "#6A1418", 2)}<circle cx="30" cy="46" r="2" fill="#2A1E1A"/><path d="M44,46 L52,40 L56,48 L64,42 L68,50 L76,46" stroke="#F6CA52" stroke-width="3" fill="none" stroke-linejoin="round"/>`) },
};

// ---------------------------------------------------------------- room decorations
export const MORE_DECOR = {
  cake, clock, balloon_red: balloon("#E0473A", "#7A1E16"), balloon_blue: balloon("#6A97CF", "#2E4A7A"), balloon_gold: balloon("#F6CA52", "#8A6420"),
  present_pink: present("#F3A8C1", "#6A97CF"), present_gold: present("#F6CA52", "#E0473A"),
  firework: firework("#E0473A", "#F6CA52"), firework2: firework("#6A97CF", "#F3A8C1"),
  glasses: `
    ${s("M20,10 L42,10 L40,40 C38,50 24,50 22,40Z", "#FBF1D2", 3, "#9A8A6A", 'fill-opacity=".8"')}<path d="M22,26 L40,26 L39,40 C37,48 25,48 23,40Z" fill="#F6CA52"/><path d="M31,48 L31,80 M22,82 L40,82" stroke="#9A8A6A" stroke-width="3.4" stroke-linecap="round"/>
    ${s("M58,14 L80,14 L78,44 C76,54 62,54 60,44Z", "#FBF1D2", 3, "#9A8A6A", 'fill-opacity=".8"')}<path d="M60,30 L78,30 L77,44 C75,52 63,52 61,44Z" fill="#F6CA52"/><path d="M69,52 L69,84 M60,86 L78,86" stroke="#9A8A6A" stroke-width="3.4" stroke-linecap="round"/>
    ${sparkle(50, 8, 7, "#FFF6C8")}`,
  confetti_bits: `<g stroke-width="2" stroke="${INK}"><rect x="10" y="20" width="16" height="9" rx="2" fill="#E0473A" transform="rotate(-20 18 24)"/><rect x="60" y="12" width="16" height="9" rx="2" fill="#6A97CF" transform="rotate(25 68 16)"/><rect x="40" y="56" width="16" height="9" rx="2" fill="#F6CA52" transform="rotate(-35 48 60)"/></g>`,
  basket: MORE_PRIZES["easter-8"].svg, egg_blue: egg("#8FD3EE", "#FFF6E6", "#4A8AB0"), egg_pink: egg("#F3A8C1", "#FFF6E6", "#C9608A"),
  tulips: `${tulip("#E0473A")}<g transform="translate(-22 8)">${tulip("#F3A8C1")}</g><g transform="translate(22 8)">${tulip("#F6CA52")}</g>`,
  bunny: `
    ${s("M34,40 C26,20 28,4 36,4 C44,4 46,20 44,40Z", "#FBFAF4", 3, "#9A8A7A")}${s("M56,40 C54,20 56,4 64,4 C72,4 74,20 66,40Z", "#FBFAF4", 3, "#9A8A7A")}
    <path d="M36,36 C32,22 34,12 37,10 M64,36 C68,22 66,12 63,10" stroke="#F6C0CC" stroke-width="5" stroke-linecap="round"/>
    ${s("M50,30 C72,30 82,46 82,60 C82,82 68,94 50,94 C32,94 18,82 18,60 C18,46 28,30 50,30Z", "#FBFAF4", 3, "#9A8A7A")}
    <circle cx="40" cy="56" r="4" fill="#2A2232"/><circle cx="60" cy="56" r="4" fill="#2A2232"/><circle cx="39" cy="54" r="1.4" fill="#fff"/><circle cx="59" cy="54" r="1.4" fill="#fff"/>
    <path d="M46,64 Q50,68 54,64 Z" fill="#E88A9A"/><path d="M50,68 L50,72 M44,74 Q50,78 56,74" stroke="#9A6A6A" stroke-width="2" fill="none" stroke-linecap="round"/>
    <g fill="#F7A8B8" opacity=".6"><ellipse cx="30" cy="66" rx="5" ry="3"/><ellipse cx="70" cy="66" rx="5" ry="3"/></g>`,
  blossom: flower(50, 50, 18, "#F7C6D8", "#E0473A"), daisy: flower(50, 50, 18, "#FFFFFF"),
  butterfly: `<g transform="translate(50 0) scale(-.5 .5) translate(-90 30)">${butterflyWing}</g><g transform="translate(50 0) scale(.5) translate(-90 30)">${butterflyWing}</g><path d="M50,36 L50,64" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
  lantern, mandarin, envelope: MORE_PRIZES["lunar_new_year-1"].svg,
  firecrackers: `<path d="M50,2 L50,20" stroke="#8A6420" stroke-width="3"/>${[24, 42, 60, 78].map((y, i) => `<g transform="rotate(${i % 2 ? 14 : -14} 50 ${y})">${s(`M42,${y - 8} L58,${y - 8} L58,${y + 8} L42,${y + 8}Z`, "#D9343A", 2.4, "#6A1418")}<path d="M42,${y} L58,${y}" stroke="#F6CA52" stroke-width="2.4"/></g>`).join("")}<path d="M46,88 L44,98 M54,88 L56,98" stroke="#F6CA52" stroke-width="2.4" stroke-linecap="round"/>`,
  gold_sparkle: `${sparkle(50, 50, 40, "#FFE07A")}<circle cx="50" cy="50" r="8" fill="#FFF8D6"/>`,
};
