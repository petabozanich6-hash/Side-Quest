// Side-Quest companion artwork.
//
// Every pet is drawn from one shared rig (body, head, face, moods) so the five
// species read as one family, plus species parts (ears, tails, wings, shell...).
// Growth stages re-proportion the SAME character, and outfits attach to anchors
// inside the head or body group so they move, breathe and grow with the pet.
//
// Everything here returns SVG markup strings from our own static artwork only
// (no user text), so it can be previewed outside React and rendered with
// dangerouslySetInnerHTML by PetFigure.jsx.
import { wearableArt, WEAR_ATTACH, WEAR_SLOT } from "./petWear.js";
import { seasonalArt } from "./petSeasonal.js";

export const SPECIES = ["turtle", "fox", "owl", "dragon", "goblin"];
export const STAGES = ["egg", "hatchling", "youngling", "companion", "hero", "legend"];
export const MOODS = ["calm", "happy", "joy", "sleepy", "sad", "sick"];

export function stageKey(levelName) {
  const s = String(levelName || "").toLowerCase();
  return STAGES.includes(s) ? s : "companion";
}

// ------------------------------------------------------------------ palettes
const PAL = {
  turtle: { skin: ["#CFE493", "#95BD5C", "#557D33"], line: "#33401A", belly: ["#F7EBBE", "#D9BF7A"], bellyLine: "#B49552", iris: "#9A6232", spot: "#C6EBA0", muzzle: "#E2EFA6",
    egg: { base: ["#E6EFC2", "#B9CC86"], mark: "#6E9A40", line: "#56702F" } },
  fox: { skin: ["#F9BC74", "#E37C38", "#A4491D"], line: "#5A2A12", belly: ["#FFF8EC", "#F0D7B4"], bellyLine: "#D9B48A", iris: "#7A4A1E", sock: ["#6A4430", "#3A2418"], muzzle: "#FFF6E8", inner: "#F6CFAE",
    egg: { base: ["#FBE3C2", "#EDB27A"], mark: "#D86A2C", line: "#9A5A2A" } },
  owl: { skin: ["#DDBE92", "#A97D52", "#6E4C2E"], line: "#4A3220", belly: ["#F8EACB", "#E2C79A"], bellyLine: "#B98E5E", iris: "#E2A23A", disc: ["#F6E8CC", "#DCC29A"], beak: ["#F3B54A", "#C98320"],
    egg: { base: ["#F2E7D2", "#D4BE98"], mark: "#A97D52", line: "#7A5A38" } },
  dragon: { skin: ["#97D8CF", "#4FA59B", "#2C6C66"], line: "#1E4A46", belly: ["#F8E7B0", "#E0B95E"], bellyLine: "#BE9440", iris: "#B0662A", horn: ["#FFF3D8", "#E2C287"], wing: ["#F7BE98", "#D9805A"], spine: "#F29A63", muzzle: "#B9E9E0",
    egg: { base: ["#D2EEE8", "#8FCBC1"], mark: "#3F8C84", line: "#2E6A64" } },
  goblin: { skin: ["#C3BEF0", "#8F88CC", "#5D5596"], line: "#3B3466", belly: ["#E4E1FA", "#C6C0EE"], bellyLine: "#A39CDC", iris: "#4E8A3A", hair: ["#FFB15C", "#DB6A2A"], inner: "#F4BACB", freckle: "#6E66B0",
    egg: { base: ["#E4E0F8", "#B9B2E6"], mark: "#8F88CC", line: "#5D5596" } },
};

// Stage proportions. The body scales from the ground; the head scales at the
// neck and drops to meet the smaller body. Babies get bigger heads.
const STAGE_RIG = {
  hatchling: { body: 0.62, head: 0.84, drop: 62, lvl: 1 },
  youngling: { body: 0.8, head: 0.92, drop: 24, lvl: 2 },
  companion: { body: 1, head: 1, drop: 0, lvl: 3 },
  hero: { body: 1.03, head: 1.02, drop: -6, lvl: 4 },
  legend: { body: 1.05, head: 1.03, drop: -10, lvl: 5 },
};

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const path = (d, fill, line, w = 4, extra = "") => `<path d="${d}" fill="${fill}" stroke="${line}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${extra ? " " + extra : ""}/>`;
const mirror = (inner) => `<g transform="matrix(-1 0 0 1 400 0)">${inner}</g>`;
const both = (inner) => inner + mirror(inner);

// ------------------------------------------------------------------ gradients
function defs(u, sp) {
  const p = PAL[sp];
  const [l, m, d] = p.skin;
  const rad = (id, stops, cx = "40%", cy = "28%", r = "80%") =>
    `<radialGradient id="${u}-${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a !== undefined ? ` stop-opacity="${a}"` : ""}/>`).join("")}</radialGradient>`;
  const lin = (id, a, b, x2 = 0, y2 = 1) => `<linearGradient id="${u}-${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  return `<defs>
    ${rad("head", [[0, l], [0.45, m], [1, d]])}
    ${rad("body", [[0, l], [0.62, m], [1, d]], "45%", "30%")}
    ${rad("limb", [[0, l], [1, d]], "35%", "25%", "85%")}
    ${lin("belly", p.belly[0], p.belly[1])}
    ${rad("eye", [[0, "#3A2618"], [0.7, "#21140C"], [1, "#140B06"]], "50%", "35%", "70%")}
    ${lin("iris", "rgba(0,0,0,0)", p.iris)}
    ${rad("glow", [[0, "#FFE7A0", 0.75], [1, "#FFE7A0", 0]], "50%", "50%", "50%")}
    ${sp === "turtle" ? rad("shell", [[0, "#B08A4C"], [0.6, "#83602F"], [1, "#523A18"]], "50%", "25%", "85%") + lin("scute", "#D2AA62", "#9A7438", 1, 1) : ""}
    ${sp === "fox" ? lin("sock", p.sock[0], p.sock[1]) + rad("tail", [[0, l], [0.55, m], [1, d]], "70%", "30%", "90%") : ""}
    ${sp === "owl" ? lin("disc", p.disc[0], p.disc[1]) + lin("beak", p.beak[0], p.beak[1]) : ""}
    ${sp === "dragon" ? lin("horn", p.horn[0], p.horn[1]) + lin("wing", p.wing[0], p.wing[1], 1, 1) : ""}
    ${sp === "goblin" ? lin("hair", p.hair[0], p.hair[1]) : ""}
    <clipPath id="${u}-cbody"><path d="${BODY}"/></clipPath>
    <clipPath id="${u}-chead"><path d="${HEAD[sp] || HEAD.base}"/></clipPath>
    <filter id="${u}-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>`;
}

// ------------------------------------------------------------------ shared shapes
const BODY = "M200,192 C262,192 292,240 294,300 C296,356 258,388 200,388 C142,388 104,356 106,300 C108,240 138,192 200,192Z";
const HEAD = {
  base: "M200,50 C272,50 310,94 308,142 C306,190 262,224 200,224 C138,224 94,190 92,142 C90,94 128,50 200,50Z",
  fox: "M200,58 C262,58 300,92 304,134 C306,152 316,164 326,178 C306,182 294,188 286,196 C268,216 236,226 200,226 C164,226 132,216 114,196 C106,188 94,182 74,178 C84,164 94,152 96,134 C100,92 138,58 200,58Z",
  owl: "M200,66 C232,52 278,54 300,82 C316,106 316,150 302,182 C284,214 246,228 200,228 C154,228 116,214 98,182 C84,150 84,106 100,82 C122,54 168,52 200,66Z",
};
const ARM = "M134,236 C104,246 84,282 88,312 C91,334 116,338 126,320 C136,300 142,272 146,252Z";
const FOOT = "M118,384 C114,362 132,348 156,350 C182,352 194,368 190,386 C186,400 126,402 118,384Z";
const HEAD_TOP = { turtle: 50, fox: 60, owl: 62, dragon: 50, goblin: 50 };

// ------------------------------------------------------------------ species: behind the body
function backParts(sp, u, lvl) {
  const p = PAL[sp];
  if (sp === "turtle") {
    const gold = lvl >= 5 ? "#F2C95B" : "#4A3419";
    return `
      ${path("M96,352 C74,356 62,368 58,380 C76,382 92,374 104,364Z", `url(#${u}-limb)`, p.line, 3.8)}
      ${path("M200,128 C290,128 342,196 342,280 C342,348 298,392 200,392 C102,392 58,348 58,280 C58,196 110,128 200,128Z", `url(#${u}-shell)`, "#3A2812", 5)}
      <g fill="url(#${u}-scute)" stroke="${gold}" stroke-width="${lvl >= 5 ? 3.5 : 3}" stroke-linejoin="round">
        ${both('<path d="M66,250 C70,214 90,186 116,170 L126,214 C108,226 96,244 92,262Z"/><path d="M60,300 C58,284 60,270 64,258 L92,268 C90,282 90,296 92,308Z"/><path d="M68,338 C62,328 60,318 60,308 L92,314 C94,328 98,340 104,350Z"/>')}
      </g>
      <path d="M92,196 C112,160 150,138 196,134" stroke="#F3CF8A" stroke-width="6" fill="none" stroke-linecap="round" opacity=".55"/>
      <path d="M302,190 C318,212 330,240 334,266" stroke="#FFC46E" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>`;
  }
  if (sp === "fox") {
    const s = 0.86 + lvl * 0.05; // the tail gets grander as the fox grows
    return `<g transform="translate(262 352) scale(${s}) translate(-262 -352)">
      ${path("M258,356 C330,374 386,330 376,258 C370,208 334,178 300,190 C326,218 336,262 320,298 C306,328 282,338 256,332Z", `url(#${u}-tail)`, p.line, 4)}
      ${path("M300,190 C334,178 370,208 376,258 C356,236 332,228 314,232 C320,218 314,202 300,190Z", lvl >= 5 ? "#FFF1C8" : p.belly[0], p.line, 3.5)}
      <path d="M330,250 C340,276 336,300 322,318 M350,240 C360,266 356,294 340,316" stroke="${p.skin[0]}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
    </g>`;
  }
  if (sp === "owl") {
    return `<g fill="url(#${u}-limb)" stroke="${p.line}" stroke-width="3.5" stroke-linejoin="round">
      <path d="M176,372 L170,410 L188,396 Z"/><path d="M200,374 L200,414 L212,398 Z"/><path d="M224,372 L230,410 L212,396 Z"/>
    </g>`;
  }
  if (sp === "dragon") {
    const ws = 0.78 + lvl * 0.07;
    const wing = `<g transform="translate(150 250) scale(${ws}) translate(-150 -250)">
        ${path("M152,236 C112,190 66,170 30,184 C46,200 50,222 44,246 C64,240 80,248 88,266 C102,254 120,256 132,266Z", `url(#${u}-wing)`, p.line, 4)}
        <path d="M150,238 C118,214 72,196 34,186 M140,250 C116,234 86,226 46,244 M134,262 C120,252 104,252 88,264" stroke="${p.skin[1]}" stroke-width="4" fill="none" stroke-linecap="round"/>
      </g>`;
    const ts = 0.85 + lvl * 0.05;
    return `${both(wing)}
      <g transform="translate(250 360) scale(${ts}) translate(-250 -360)">
        ${path("M246,370 C298,394 348,384 366,350 L394,356 L380,334 L392,314 L362,324 C350,352 308,362 258,348Z", `url(#${u}-limb)`, p.line, 4)}
        ${path("M366,350 L394,356 L380,334 L392,314 L362,324Z", lvl >= 5 ? "#F2C95B" : p.spine, p.line, 3)}
      </g>`;
  }
  return "";
}

// ------------------------------------------------------------------ species: belly, arms, feet
function bellyPart(sp, u) {
  const p = PAL[sp];
  const shade = `<ellipse cx="200" cy="214" rx="96" ry="26" fill="#1E2A10" opacity=".28" filter="url(#${u}-soft)"/>`;
  const shine = `<ellipse cx="176" cy="258" rx="20" ry="9" fill="#FFFFFF" opacity=".35" transform="rotate(-18 176 258)"/>`;
  const rim = `<path d="M286,262 C292,290 290,330 274,356" stroke="#FFC878" stroke-width="5" fill="none" stroke-linecap="round" opacity=".5"/>`;
  let inner = "";
  if (sp === "turtle") {
    inner = `${path("M200,218 C240,218 260,256 260,302 C260,348 236,374 200,374 C164,374 140,348 140,302 C140,256 160,218 200,218Z", `url(#${u}-belly)`, "#A88A4A", 3)}
      <g stroke="${p.bellyLine}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"><path d="M200,222 L200,370"/><path d="M146,262 Q200,276 254,262"/><path d="M141,304 Q200,318 259,304"/><path d="M150,344 Q200,356 250,344"/></g>`;
  } else if (sp === "fox") {
    inner = `${path("M200,204 C226,214 246,232 252,262 C258,300 240,346 200,366 C160,346 142,300 148,262 C154,232 174,214 200,204Z", `url(#${u}-belly)`, p.bellyLine, 2.5)}
      <path d="M176,236 L184,246 L190,236 M210,236 L216,246 L224,236 M190,270 L198,280 L206,270" stroke="${p.bellyLine}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>`;
  } else if (sp === "owl") {
    inner = `${path("M200,214 C244,214 266,256 264,304 C262,348 236,374 200,374 C164,374 138,348 136,304 C134,256 156,214 200,214Z", `url(#${u}-belly)`, p.bellyLine, 2.5)}
      <g stroke="${p.bellyLine}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".9">
        ${[250, 284, 318, 350].map((y, r) => [0, 1, 2, 3].slice(0, r === 3 ? 3 : 4).map((i) => { const x = 158 + i * 28 + (r % 2) * 14 - (r === 3 ? -14 : 0); return `<path d="M${x - 9},${y} Q${x},${y + 9} ${x + 9},${y}"/>`; }).join("")).join("")}
      </g>`;
  } else if (sp === "dragon") {
    inner = `${path("M200,212 C238,212 258,252 258,300 C258,346 236,374 200,374 C164,374 142,346 142,300 C142,252 162,212 200,212Z", `url(#${u}-belly)`, p.bellyLine, 3)}
      <g stroke="${p.bellyLine}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".85">${[246, 274, 302, 330, 356].map((y) => `<path d="M${150 + Math.abs(y - 300) / 6},${y} Q200,${y + 10} ${250 - Math.abs(y - 300) / 6},${y}"/>`).join("")}</g>`;
  } else if (sp === "goblin") {
    inner = `${path("M200,226 C236,226 256,262 254,304 C252,346 230,370 200,370 C170,370 148,346 146,304 C144,262 164,226 200,226Z", `url(#${u}-belly)`, p.bellyLine, 2.5)}
      <path d="M194,318 Q200,326 206,318" stroke="${p.bellyLine}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }
  return `<g clip-path="url(#${u}-cbody)">${shade}${inner}${shine}${rim}</g>`;
}

function arms(sp, u) {
  const p = PAL[sp];
  if (sp === "owl") {
    const wing = `${path("M136,228 C98,236 76,282 82,326 C86,350 106,352 116,340 C110,324 118,306 126,298 C134,276 142,252 148,240Z", `url(#${u}-limb)`, p.line, 3.8)}
      <path d="M108,268 C98,288 94,306 96,326 M122,262 C112,286 108,306 110,330" stroke="${p.skin[0]}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".75"/>
      <path d="M86,322 Q96,334 106,326 Q112,338 118,334" stroke="${p.line}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".6"/>`;
    return both(wing);
  }
  const arm = path(ARM, `url(#${u}-limb)`, p.line, 3.8);
  const paw = sp === "fox"
    ? path("M88,306 C90,326 104,336 118,330 C126,326 128,316 126,312 C114,314 100,312 88,306Z", `url(#${u}-sock)`, p.line, 3)
    : `<ellipse cx="98" cy="322" rx="5" ry="4" fill="${sp === "dragon" ? PAL.dragon.horn[0] : "#F3F6DE"}" opacity=".95"/><ellipse cx="110" cy="328" rx="5" ry="4" fill="${sp === "dragon" ? PAL.dragon.horn[0] : "#F3F6DE"}" opacity=".95"/>`;
  const rim = `<path d="M110,262 C104,276 100,290 100,302" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none" opacity=".25"/>`;
  return both(arm + paw + rim);
}

function feet(sp, u) {
  const p = PAL[sp];
  if (sp === "owl") {
    const talon = `<g fill="url(#${u}-beak)" stroke="${p.line}" stroke-width="3" stroke-linejoin="round">
      <path d="M134,372 C130,388 126,398 130,402 C138,400 142,390 146,378Z"/><path d="M152,374 C152,390 150,400 156,404 C162,398 162,388 162,376Z"/><path d="M168,372 C172,386 176,396 182,398 C184,390 180,380 176,370Z"/></g>`;
    return both(talon);
  }
  const fill = sp === "fox" ? `url(#${u}-sock)` : `url(#${u}-limb)`;
  const toe = sp === "fox" ? "#2E1C12" : sp === "dragon" ? PAL.dragon.horn[0] : "#EEF5D2";
  const foot = `${path(FOOT, fill, p.line, 3.8)}
    <g fill="${toe}" stroke="${sp === "fox" ? "none" : p.line}" stroke-width="1.2" opacity="${sp === "fox" ? 0.6 : 1}"><ellipse cx="134" cy="390" rx="6" ry="5"/><ellipse cx="152" cy="394" rx="6" ry="5"/><ellipse cx="170" cy="393" rx="6" ry="5"/></g>`;
  return both(foot);
}

// ------------------------------------------------------------------ species: head
function behindHead(sp, u, lvl) {
  const p = PAL[sp];
  if (sp === "fox") {
    const ear = `${path("M118,112 C102,72 104,34 120,12 C150,26 172,56 178,80Z", `url(#${u}-head)`, p.line, 4)}
      ${path("M128,96 C118,70 120,46 128,30 C146,44 160,62 164,78Z", p.inner, "none", 0)}
      ${path("M120,12 C126,30 136,40 146,46 C138,26 130,16 120,12Z", lvl >= 5 ? "#F2C95B" : "#4A2A1A", p.line, 2.5)}`;
    return both(ear);
  }
  if (sp === "owl") {
    const len = 0.85 + lvl * 0.05;
    return both(`<g transform="translate(150 80) scale(${len}) translate(-150 -80)">${path("M116,86 C100,62 102,40 110,24 C130,40 148,58 158,70Z", `url(#${u}-head)`, p.line, 4)}<path d="M114,44 C122,56 132,64 142,70" stroke="${p.skin[0]}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/></g>`);
  }
  if (sp === "dragon") {
    const hs = 0.8 + lvl * 0.07;
    const horn = `<g transform="translate(160 70) scale(${hs}) translate(-160 -70)">${path("M150,74 C132,48 130,24 140,6 C156,28 170,48 178,64Z", `url(#${u}-horn)`, p.line, 3.8)}<path d="M142,40 L156,46 M138,24 L150,30" stroke="${p.horn[1]}" stroke-width="3" stroke-linecap="round"/>${lvl >= 5 ? '<path d="M140,6 C143,14 147,20 151,24" stroke="#F2C95B" stroke-width="5" stroke-linecap="round"/>' : ""}</g>`;
    const frill = path("M96,128 L66,116 L82,140 L60,150 L90,160 Z", p.spine, p.line, 3);
    return both(horn + frill);
  }
  if (sp === "goblin") {
    const ear = `${path("M110,130 C74,110 52,78 46,48 C82,58 114,82 132,106Z", `url(#${u}-head)`, p.line, 4)}
      ${path("M112,116 C86,100 70,80 64,64 C88,72 108,88 120,102Z", p.inner, "none", 0)}
      ${lvl >= 5 ? '<circle cx="62" cy="76" r="5" fill="#F2C95B" stroke="#8A6A1A" stroke-width="2"/>' : ""}`;
    return both(ear);
  }
  return "";
}

function headDetail(sp, u, lvl, hatWorn) {
  const p = PAL[sp];
  const rimA = `<path d="M112,112 C122,84 150,64 184,58" stroke="#FFE2A6" stroke-width="5" fill="none" stroke-linecap="round" opacity=".45"/>`;
  const rimB = `<path d="M284,96 C300,120 302,152 292,178" stroke="#FFC878" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55"/>`;
  const gloss = `<ellipse cx="160" cy="76" rx="34" ry="13" fill="#FFFFFF" opacity=".2" transform="rotate(-20 160 76)"/>`;
  let inner = "", over = "";
  if (sp === "turtle") {
    inner = `<g fill="${p.spot}" opacity=".55"><ellipse cx="168" cy="72" rx="11" ry="8"/><ellipse cx="226" cy="64" rx="8" ry="6"/><ellipse cx="252" cy="86" rx="6" ry="5"/><ellipse cx="146" cy="96" rx="6" ry="5"/><ellipse cx="200" cy="58" rx="5" ry="4"/></g>`;
    over = `<ellipse cx="200" cy="182" rx="50" ry="30" fill="${p.muzzle}" opacity=".45"/>`;
  } else if (sp === "fox") {
    over = `${path("M200,138 C230,138 252,160 254,184 C256,208 228,222 200,222 C172,222 144,208 146,184 C148,160 170,138 200,138Z", p.muzzle, "none", 0)}
      ${both('<path d="M98,170 C110,176 122,180 134,180" stroke="#FFF6E8" stroke-width="8" stroke-linecap="round" fill="none"/>')}
      ${path("M186,160 Q200,152 214,160 Q212,174 200,177 Q188,174 186,160Z", "#2E1A10", "#2E1A10", 2)}
      <ellipse cx="195" cy="160" rx="4" ry="2.5" fill="#FFFFFF" opacity=".6"/>`;
  } else if (sp === "owl") {
    over = `${path("M200,96 C214,78 252,76 272,96 C292,118 290,162 268,182 C246,200 214,198 200,188 C186,198 154,200 132,182 C110,162 108,118 128,96 C148,76 186,78 200,96Z", `url(#${u}-disc)`, PAL.owl.bellyLine, 2.5)}
      <path d="M200,98 L200,150" stroke="${PAL.owl.bellyLine}" stroke-width="2" opacity=".6"/>`;
  } else if (sp === "dragon") {
    inner = `<g fill="${p.skin[2]}" opacity=".35"><circle cx="150" cy="80" r="5"/><circle cx="166" cy="70" r="4"/><circle cx="250" cy="80" r="5"/><circle cx="234" cy="70" r="4"/></g>`;
    over = `<ellipse cx="200" cy="184" rx="58" ry="32" fill="${p.muzzle}" opacity=".7"/>
      <g fill="${p.line}" opacity=".6"><ellipse cx="186" cy="170" rx="4" ry="3"/><ellipse cx="214" cy="170" rx="4" ry="3"/></g>
      <g fill="${lvl >= 5 ? "#F2C95B" : p.spine}" stroke="${p.line}" stroke-width="2.5" stroke-linejoin="round"><path d="M186,54 L200,30 L214,54Z"/><path d="M170,58 L178,40 L190,56Z"/><path d="M230,58 L222,40 L210,56Z"/></g>`;
  } else if (sp === "goblin") {
    over = `${path("M198,148 C206,156 218,172 214,180 C206,186 194,184 190,176 C188,166 192,156 198,148Z", p.skin[1], p.line, 2.5)}
      <g fill="${p.freckle}" opacity=".55"><circle cx="124" cy="160" r="2.6"/><circle cx="134" cy="154" r="2.6"/><circle cx="132" cy="166" r="2.6"/><circle cx="276" cy="160" r="2.6"/><circle cx="266" cy="154" r="2.6"/><circle cx="268" cy="166" r="2.6"/></g>
      ${hatWorn ? "" : path("M176,62 C172,36 186,18 204,8 C198,26 210,30 222,20 C224,40 216,56 212,64 C200,58 188,58 176,62Z", `url(#${u}-hair)`, "#8A3E12", 3)}`;
  }
  return `<g clip-path="url(#${u}-chead)">${inner}${gloss}${rimA}${rimB}</g>${over}`;
}

// ------------------------------------------------------------------ face (shared, with species tweaks)
const EYES = {
  base: { l: 158, r: 242, y: 134, w: 21, h: 25 },
  fox: { l: 156, r: 244, y: 128, w: 19, h: 23 },
  owl: { l: 162, r: 238, y: 134, w: 24, h: 26, ring: true },
};
function face(sp, u, mood, lvl) {
  const p = PAL[sp];
  const e = EYES[sp] || EYES.base;
  const openEye = (x) => `<g class="p-eye">
      ${e.ring ? `<circle cx="${x}" cy="${e.y}" r="${e.w + 8}" fill="${p.iris}" stroke="${p.line}" stroke-width="3"/>` : ""}
      <ellipse cx="${x}" cy="${e.y}" rx="${e.w}" ry="${e.h}" fill="url(#${u}-eye)"/>
      ${e.ring ? "" : `<ellipse cx="${x}" cy="${e.y}" rx="${e.w}" ry="${e.h}" fill="url(#${u}-iris)" opacity=".55"/>`}
      <g class="p-pupil"><circle cx="${x - 7}" cy="${e.y - 10}" r="${e.w * 0.38}" fill="#fff"/><circle cx="${x + 8}" cy="${e.y + 10}" r="${e.w * 0.17}" fill="#fff" opacity=".85"/>
      ${lvl >= 5 ? `<path d="M${x + 7},${e.y - 16} l2,5 5,2 -5,2 -2,5 -2,-5 -5,-2 5,-2z" fill="#FFF3B0"/>` : ""}</g>
    </g>`;
  const arcUp = (x) => `<path d="M${x - 20},${e.y + 6} Q${x},${e.y - 20} ${x + 20},${e.y + 6}"/>`;
  const arcDown = (x) => `<path d="M${x - 20},${e.y + 2} Q${x},${e.y + 16} ${x + 20},${e.y + 2}"/>`;
  const ringBehind = (x) => e.ring ? `<circle cx="${x}" cy="${e.y}" r="${e.w + 8}" fill="${p.iris}" stroke="${p.line}" stroke-width="3" opacity=".9"/>` : "";
  const blush = `<g fill="#F07F6E" opacity="${mood === "sick" ? 0.15 : 0.42}"><ellipse cx="${sp === "owl" ? 128 : 134}" cy="${sp === "owl" ? 186 : 170}" rx="20" ry="11"/><ellipse cx="${sp === "owl" ? 272 : 266}" cy="${sp === "owl" ? 186 : 170}" rx="20" ry="11"/></g>`;
  const nostrils = sp === "turtle" ? `<g fill="${p.line}" opacity=".55"><ellipse cx="193" cy="162" rx="2.6" ry="2"/><ellipse cx="207" cy="162" rx="2.6" ry="2"/></g>` : "";

  let eyes;
  if (mood === "joy") eyes = `${ringBehind(e.l)}${ringBehind(e.r)}<g fill="none" stroke="#21140C" stroke-width="6" stroke-linecap="round">${arcUp(e.l)}${arcUp(e.r)}</g>`;
  else if (mood === "sleepy") eyes = `${ringBehind(e.l)}${ringBehind(e.r)}<g fill="none" stroke="#21140C" stroke-width="5.5" stroke-linecap="round">${arcDown(e.l)}${arcDown(e.r)}</g>`;
  else eyes = openEye(e.l) + openEye(e.r);

  let brows = "";
  if (mood === "sad" || mood === "sick") brows = `<g stroke="${p.line}" stroke-width="4.5" stroke-linecap="round"><path d="M${e.l - 18},${e.y - 36} L${e.l + 14},${e.y - 44}"/><path d="M${e.r + 18},${e.y - 36} L${e.r - 14},${e.y - 44}"/></g>`;
  if (mood === "happy") brows = `<g stroke="${p.line}" stroke-width="4" stroke-linecap="round" fill="none" opacity=".7"><path d="M${e.l - 14},${e.y - 40} Q${e.l},${e.y - 48} ${e.l + 14},${e.y - 40}"/><path d="M${e.r - 14},${e.y - 40} Q${e.r},${e.y - 48} ${e.r + 14},${e.y - 40}"/></g>`;

  const my = sp === "fox" ? 190 : sp === "owl" ? 196 : sp === "goblin" ? 196 : 182;
  let mouth;
  if (sp === "owl") {
    const open = mood === "happy" || mood === "joy";
    mouth = open
      ? `${path("M186,160 Q200,152 214,160 L200,178Z", `url(#${u}-beak)`, p.line, 3)}${path("M188,180 Q200,200 212,180Z", "#C9583E", p.line, 3)}`
      : `${path("M186,160 Q200,152 214,160 L200,186Z", `url(#${u}-beak)`, p.line, 3)}${mood === "sad" || mood === "sick" ? `<path d="M186,198 Q200,190 214,198" stroke="${p.line}" stroke-width="3.5" fill="none" stroke-linecap="round"/>` : ""}`;
  } else if (mood === "happy" || mood === "joy") {
    mouth = `${path(`M${178},${my - 6} Q200,${my + 30} ${222},${my - 6} Z`, "#6E2A22", "#3A2616", 4)}<path d="M188,${my + 12} Q200,${my + 4} 212,${my + 12} Q206,${my + 22} 200,${my + 22} Q194,${my + 22} 188,${my + 12}Z" fill="#E8776B"/>${sp === "goblin" ? `<path d="M206,${my - 4} L212,${my - 4} L209,${my + 4}Z" fill="#fff"/>` : ""}${sp === "dragon" ? `<path d="M186,${my - 4} L192,${my - 4} L189,${my + 3}Z M208,${my - 4} L214,${my - 4} L211,${my + 3}Z" fill="#fff"/>` : ""}`;
  } else if (mood === "sleepy") {
    mouth = `<ellipse cx="200" cy="${my + 4}" rx="7" ry="6" fill="#6E2A22" stroke="#3A2616" stroke-width="3"/>`;
  } else if (mood === "sad") {
    mouth = `<path d="M186,${my + 8} Q200,${my - 4} 214,${my + 8}" fill="none" stroke="#3A2616" stroke-width="4.5" stroke-linecap="round"/>`;
  } else if (mood === "sick") {
    mouth = `<path d="M184,${my + 4} q5,-6 10,0 t10,0 t10,0" fill="none" stroke="#3A2616" stroke-width="4" stroke-linecap="round"/>`;
  } else {
    mouth = `<path d="M184,${my - 2} Q192,${my + 8} 200,${my} Q208,${my + 8} 216,${my - 2}" fill="none" stroke="#3A2616" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>${sp === "goblin" ? `<path d="M205,${my + 2} L211,${my + 1} L208,${my + 9}Z" fill="#fff" stroke="#3A2616" stroke-width="1.5"/>` : ""}`;
  }
  const sweat = mood === "sick" ? `<path d="M288,96 C282,108 280,116 286,120 C292,124 298,118 296,110 C295,104 291,100 288,96Z" fill="#BFE6F7" stroke="#4A88A8" stroke-width="2.5"/>` : "";
  return `<g class="p-face">${blush}${nostrils}${eyes}${brows}${mouth}${sweat}</g>`;
}

// ------------------------------------------------------------------ anchors for outfits
// [x, y, width] in the companion coordinate system, inside the head or body group.
function anchors(sp) {
  const top = HEAD_TOP[sp] || 50;
  const e = EYES[sp] || EYES.base;
  const earPts = {
    turtle: [[104, 118], [296, 118]], fox: [[132, 40], [268, 40]], owl: [[118, 46], [282, 46]],
    dragon: [[146, 30], [254, 30]], goblin: [[70, 70], [330, 70]],
  }[sp];
  return {
    head: { g: "head", at: [[200, top + 12]], w: sp === "fox" || sp === "dragon" ? 112 : 124 },
    face: { g: "head", at: [[200, e.y]], w: (e.r - e.l) * 2.4 },
    ears: { g: "head", at: earPts, w: 46 },
    cheeks: { g: "head", at: sp === "owl" ? [[128, 188], [272, 188]] : [[132, 172], [268, 172]], w: 34 },
    neck: { g: "body", at: [[200, 218]], w: 196 },
    chest: { g: "body", at: [[236, 270]], w: 46 },
    back: { g: "back", at: [[200, 214]], w: 250 },
    left: { g: "body", at: [[92, 322]], w: 92 },
    right: { g: "body", at: [[308, 322]], w: 92 },
    feet: { g: "body", at: [[156, 384], [244, 384]], w: 70 },
  };
}

const CAPE_CLASP = `<path d="M132,214 Q200,250 268,214" fill="none" stroke="#E2C27E" stroke-width="6" stroke-linecap="round"/><circle cx="200" cy="232" r="9" fill="#F4D998" stroke="#8A6A30" stroke-width="3"/><circle cx="197" cy="229" r="3" fill="#FFF6D8"/>`;

function place(art, [x, y], w, [cx, cy], flip = false) {
  const s = w / 100;
  const t = flip
    ? `translate(${x + w * cx} ${y - w * cy}) scale(${-s} ${s})`
    : `translate(${x - w * cx} ${y - w * cy}) scale(${s})`;
  return `<g transform="${t}">${art}</g>`;
}

function emojiAt(emoji, [x, y], w, lift = 0) {
  y -= lift;
  return `<text x="${x}" y="${y}" font-size="${(w * 0.85).toFixed(0)}" text-anchor="middle" dominant-baseline="central">${esc(emoji)}</text>`;
}

// Returns { head, body, back } markup for regular outfits and seasonal prizes.
function outfitLayers(sp, worn, seasonal) {
  const A = anchors(sp);
  const out = { head: { front: "", seas: "" }, body: { front: "", seas: "" }, back: "" };
  for (const id of worn) {
    const slot = WEAR_SLOT[id];
    const art = wearableArt(id);
    if (!slot || !art) continue;
    let a = A[slot];
    if (id === "headphones") a = { g: "head", at: [[200, (EYES[sp] || EYES.base).y - 10]], w: 236 };
    if (id === "rainbow") a = { g: "head", at: [[200, (HEAD_TOP[sp] || 50) + 4]], w: 230 };
    if (id === "backpack") a = { g: "back", at: [[300, 262]], w: 118 };
    if (id === "cape") a = { g: "back", at: [[200, 198]], w: 340 };
    if (id === "magic_wand") a = { ...A.right, w: 116 };
    if (id === "butterfly") a = { g: "back", at: [[200, 250]], w: 300 };
    const attach = WEAR_ATTACH[id] || [0.5, 0.5];
    const g = a.g === "back" ? "back" : a.g;
    const markup = a.at.map((pt) => place(art, pt, a.w, attach)).join("");
    if (g === "back") out.back += markup; else out[g].front += markup;
    if (id === "cape") out.body.front += CAPE_CLASP;
  }
  for (const k of seasonal) {
    const a = A[k.slot];
    if (!a) continue;
    const art = seasonalArt(k.id);
    const markup = a.at.map((pt, i) => art
      ? place(art.svg, pt, a.w * (art.scale || 1), art.attach || [0.5, 0.5], i === 1 && art.mirror)
      : emojiAt(k.emoji, pt, a.w, k.slot === "head" ? a.w * 0.32 : 0)).join("");
    out[a.g === "back" ? "body" : a.g].seas += markup;
  }
  return out;
}

// ------------------------------------------------------------------ egg
const EGG = "M200,64 C262,64 300,170 300,252 C300,334 256,384 200,384 C144,384 100,334 100,252 C100,170 138,64 200,64Z";
function eggMarks(sp) {
  const m = PAL[sp].egg.mark;
  if (sp === "fox") return `<g fill="${m}" opacity=".85"><path d="M100,250 C140,230 160,262 200,246 C240,230 262,262 300,244 L300,280 C262,298 240,266 200,282 C160,298 140,266 100,286Z"/><path d="M120,170 C150,158 168,176 196,166 C190,150 176,140 158,142 C140,146 126,156 120,170Z" opacity=".6"/></g>`;
  if (sp === "owl") return `<g fill="none" stroke="${m}" stroke-width="4" stroke-linecap="round" opacity=".8">${[150, 196, 242, 288, 330].map((y, r) => [0, 1, 2, 3, 4].map((i) => { const x = 118 + i * 41 + (r % 2) * 20; return `<path d="M${x - 14},${y} Q${x},${y + 14} ${x + 14},${y}"/>`; }).join("")).join("")}</g>`;
  if (sp === "turtle") return `<g fill="${PAL.turtle.egg.base[1]}" stroke="${m}" stroke-width="4" stroke-linejoin="round" opacity=".9">${[[200, 160], [160, 230], [240, 230], [200, 300], [140, 310], [260, 310]].map(([x, y]) => `<path d="M${x},${y - 30} L${x + 28},${y - 14} L${x + 28},${y + 16} L${x},${y + 32} L${x - 28},${y + 16} L${x - 28},${y - 14}Z"/>`).join("")}</g>`;
  if (sp === "dragon") return `<g fill="none" stroke="${m}" stroke-width="4" opacity=".75">${[140, 180, 220, 260, 300, 340].map((y, r) => [0, 1, 2, 3, 4, 5].map((i) => { const x = 106 + i * 38 + (r % 2) * 19; return `<path d="M${x - 18},${y} A18,18 0 0 0 ${x + 18},${y}"/>`; }).join("")).join("")}</g>`;
  return `<g fill="${m}" opacity=".75"><circle cx="160" cy="160" r="16"/><circle cx="238" cy="196" r="22"/><circle cx="170" cy="262" r="26"/><circle cx="246" cy="300" r="15"/><circle cx="200" cy="340" r="11"/><path d="M220,120 c10,0 14,10 6,14 c-8,4 -16,-2 -12,-10" fill="none" stroke="${m}" stroke-width="5" stroke-linecap="round"/></g>`;
}

function eggAnchors() {
  return {
    head: { at: [[200, 76]], w: 120 }, face: { at: [[200, 190]], w: 180 }, ears: { at: [[132, 140], [268, 140]], w: 44 },
    cheeks: { at: [[150, 236], [250, 236]], w: 34 }, neck: { at: [[200, 268]], w: 200 }, chest: { at: [[232, 300]], w: 46 },
    left: { at: [[104, 300]], w: 80 }, right: { at: [[296, 300]], w: 80 }, feet: { at: [[160, 380], [240, 380]], w: 60 },
  };
}

export function renderEgg({ species = "turtle", uid = "egg", seasonal = [], cold = false } = {}) {
  const sp = SPECIES.includes(species) ? species : "turtle";
  const u = `${uid}-${sp}`;
  const e = PAL[sp].egg;
  const A = eggAnchors();
  const prizes = seasonal.map((k) => {
    const a = A[k.slot];
    if (!a) return "";
    const art = seasonalArt(k.id);
    return a.at.map((pt, i) => art ? place(art.svg, pt, a.w * (art.scale || 1), art.attach || [0.5, 0.5], i === 1 && art.mirror) : emojiAt(k.emoji, pt, a.w)).join("");
  }).join("");
  return `<svg viewBox="0 0 400 430" class="sq-pet sq-egg${cold ? " is-cold" : ""}" data-species="${sp}" data-stage="egg" overflow="visible" aria-hidden="true">
    <defs>
      <radialGradient id="${u}-egg" cx="38%" cy="28%" r="80%"><stop offset="0" stop-color="#FFFDF4"/><stop offset=".35" stop-color="${e.base[0]}"/><stop offset="1" stop-color="${e.base[1]}"/></radialGradient>
      <clipPath id="${u}-cegg"><path d="${EGG}"/></clipPath>
      <filter id="${u}-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
    </defs>
    <ellipse class="p-shadow" cx="200" cy="396" rx="96" ry="14" fill="#2E1806" opacity=".45" filter="url(#${u}-soft)"/>
    <g class="p-rig"><g class="p-egg">
      ${path(EGG, `url(#${u}-egg)`, e.line, 4.5)}
      <g clip-path="url(#${u}-cegg)">
        ${eggMarks(sp)}
        <ellipse cx="200" cy="384" rx="120" ry="48" fill="#3A2210" opacity=".18" filter="url(#${u}-soft)"/>
        <path d="M262,140 C284,190 292,250 280,312" stroke="#FFC878" stroke-width="7" fill="none" stroke-linecap="round" opacity=".55"/>
      </g>
      <ellipse cx="164" cy="128" rx="22" ry="34" fill="#FFFFFF" opacity=".55" transform="rotate(18 164 128)"/>
      <ellipse cx="150" cy="176" rx="7" ry="10" fill="#FFFFFF" opacity=".45"/>
      ${prizes ? `<g data-testid="worn-seasonal" pointer-events="none">${prizes}</g>` : ""}
    </g></g>
  </svg>`;
}

// ------------------------------------------------------------------ pet
export function renderPet({ species = "turtle", stage = "companion", mood = "calm", worn = [], seasonal = [], uid = "pet" } = {}) {
  const sp = SPECIES.includes(species) ? species : "turtle";
  const st = stageKey(stage);
  if (st === "egg") return renderEgg({ species: sp, uid, seasonal });
  const md = MOODS.includes(mood) ? mood : "calm";
  const R = STAGE_RIG[st];
  const u = `${uid}-${sp}`;
  const p = PAL[sp];
  const hatWorn = worn.some((id) => WEAR_SLOT[id] === "head") || seasonal.some((k) => k.slot === "head");
  const L = outfitLayers(sp, worn, seasonal);
  const bodyT = R.body === 1 ? "" : `translate(200 398) scale(${R.body}) translate(-200 -398)`;
  const headT = `translate(0 ${R.drop}) translate(200 215) scale(${R.head}) translate(-200 -215)`;

  const shellBits = st === "hatchling" ? {
    cup: `${path("M128,366 L146,350 L160,366 L176,348 L192,366 L208,348 L224,366 L240,350 L256,366 L272,352 C278,384 250,404 200,404 C150,404 122,384 128,366Z", `url(#${u}-eggshell)`, p.egg.line, 4)}<path d="M150,384 C170,394 230,394 250,384" stroke="#FFFFFF" stroke-width="5" opacity=".5" fill="none" stroke-linecap="round"/>`,
    cap: hatWorn ? "" : path(`M150,${HEAD_TOP[sp] + 22} L164,${HEAD_TOP[sp] + 8} L178,${HEAD_TOP[sp] + 22} L192,${HEAD_TOP[sp] + 6} L208,${HEAD_TOP[sp] + 22} L222,${HEAD_TOP[sp] + 6} L236,${HEAD_TOP[sp] + 22} L250,${HEAD_TOP[sp] + 10} C246,${HEAD_TOP[sp] - 14} 226,${HEAD_TOP[sp] - 28} 200,${HEAD_TOP[sp] - 28} C174,${HEAD_TOP[sp] - 28} 154,${HEAD_TOP[sp] - 14} 150,${HEAD_TOP[sp] + 22}Z`, `url(#${u}-eggshell)`, p.egg.line, 4),
  } : { cup: "", cap: "" };

  const halo = st === "legend" ? `<ellipse cx="200" cy="220" rx="190" ry="200" fill="url(#${u}-glow)"/>` : "";
  const front = (L.body.front || L.head.front) ? true : false;

  return `<svg viewBox="0 0 400 430" class="sq-pet mood-${md} stage-${st}" data-species="${sp}" data-stage="${st}" data-mood="${md}" overflow="visible" aria-hidden="true">
    ${defs(u, sp).replace("</defs>", `<radialGradient id="${u}-eggshell" cx="38%" cy="28%" r="80%"><stop offset="0" stop-color="#FFFDF4"/><stop offset=".4" stop-color="${p.egg.base[0]}"/><stop offset="1" stop-color="${p.egg.base[1]}"/></radialGradient></defs>`)}
    ${halo}
    <ellipse class="p-shadow" cx="200" cy="402" rx="${132 * R.body}" ry="16" fill="#2E1806" opacity=".5" filter="url(#${u}-soft)"/>
    <ellipse cx="200" cy="398" rx="${96 * R.body}" ry="7" fill="#2E1806" opacity=".42"/>
    <g class="p-rig"><g class="p-breath">
      <g transform="${bodyT}">
        ${backParts(sp, u, R.lvl)}
        ${L.back ? `<g data-testid="worn-accessories-back" pointer-events="none">${L.back}</g>` : ""}
        ${path(BODY, `url(#${u}-body)`, p.line, 3.8)}
        ${bellyPart(sp, u)}
        ${arms(sp, u)}
        ${feet(sp, u)}
        ${L.body.front ? `<g data-testid="worn-accessories" data-layer="body" pointer-events="none">${L.body.front}</g>` : ""}
        ${L.body.seas ? `<g data-testid="worn-seasonal" data-layer="body" pointer-events="none">${L.body.seas}</g>` : ""}
      </g>
      ${shellBits.cup}
      <g transform="${headT}"><g class="p-head">
        ${behindHead(sp, u, R.lvl)}
        ${path(HEAD[sp] || HEAD.base, `url(#${u}-head)`, p.line, 4.2)}
        ${headDetail(sp, u, R.lvl, hatWorn)}
        ${face(sp, u, md, R.lvl)}
        ${shellBits.cap}
        ${L.head.front ? `<g data-testid="${front && L.body.front ? "worn-accessories-head" : "worn-accessories"}" data-layer="head" pointer-events="none">${L.head.front}</g>` : ""}
        ${L.head.seas ? `<g data-testid="${L.body.seas ? "worn-seasonal-head" : "worn-seasonal"}" data-layer="head" pointer-events="none">${L.head.seas}</g>` : ""}
      </g></g>
    </g></g>
    <g class="p-zzz" font-family="Fraunces, Georgia, serif" font-weight="700" fill="#FBF7EC" stroke="#4A3B1E" stroke-width="1.5" paint-order="stroke">
      <text class="z z1" x="296" y="${76 + R.drop}" font-size="34">z</text><text class="z z2" x="312" y="${60 + R.drop}" font-size="28">z</text><text class="z z3" x="326" y="${46 + R.drop}" font-size="22">z</text>
    </g>
  </svg>`;
}

// ------------------------------------------------------------------ animation styles (shared by every pet)
export const PET_ART_CSS = `
.sq-pet{display:block;width:100%;height:auto;overflow:visible}
.sq-pet .p-rig{transform-box:view-box;transform-origin:200px 400px}
.sq-pet .p-breath{transform-box:view-box;transform-origin:200px 396px}
.sq-pet .p-head{transform-box:view-box;transform-origin:200px 215px}
.sq-pet .p-shadow{transform-box:view-box;transform-origin:200px 402px}
.sq-pet .p-eye{transform-box:fill-box;transform-origin:center}
.sq-pet .p-egg{transform-box:view-box;transform-origin:200px 384px}
.sq-pet .p-zzz{opacity:0}
.sq-pet.is-cold{filter:grayscale(.55) brightness(.92)}
.sq-pet.mood-sick .p-rig{filter:saturate(.55) brightness(1.04)}
.sq-live .sq-pet .p-breath{animation:sqBreathe 3.6s ease-in-out infinite}
.sq-live .sq-pet .p-head{animation:sqSway 7s ease-in-out infinite}
.sq-live .sq-pet.mood-happy .p-rig{animation:sqBounce 2.6s ease-in-out infinite}
.sq-live .sq-pet.mood-sleepy .p-breath{animation-duration:5.2s}
.sq-live .sq-pet.mood-sleepy .p-head{animation:sqDoze 5.2s ease-in-out infinite}
.sq-pet.mood-sleepy .p-zzz{opacity:1}
.sq-live .sq-pet.mood-sleepy .z{animation:sqZzz 3.6s ease-in-out infinite;opacity:0;transform-box:fill-box;transform-origin:center}
.sq-live .sq-pet.mood-sleepy .z2{animation-delay:1.2s}.sq-live .sq-pet.mood-sleepy .z3{animation-delay:2.4s}
.sq-pet.mood-sad .p-head,.sq-pet.mood-sick .p-head{animation:none!important;transform:rotate(-3deg) translateY(5px)}
.sq-live .sq-pet .p-egg{animation:sqEgg 3.2s ease-in-out infinite}
.sq-blink .sq-pet .p-eye{animation:sqBlink .17s ease-in-out}
@keyframes sqBreathe{0%,100%{transform:scale(1,1)}50%{transform:scale(1.012,1.022)}}
@keyframes sqSway{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2.2deg)}}
@keyframes sqBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes sqDoze{0%,100%{transform:rotate(-6deg) translateY(4px)}50%{transform:rotate(-4deg) translateY(7px)}}
@keyframes sqBlink{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.08)}}
@keyframes sqZzz{0%{opacity:0;transform:translate(0,0) scale(.6)}25%{opacity:1}100%{opacity:0;transform:translate(26px,-60px) scale(1.15)}}
@keyframes sqEgg{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
@media (prefers-reduced-motion: reduce){.sq-pet *{animation:none!important}}
`;
