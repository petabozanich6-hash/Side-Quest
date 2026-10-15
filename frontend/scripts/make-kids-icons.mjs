// Renders the SQ Kids icons (fox face on sunny yellow) from one SVG with Chromium.
// PW_PATH=<playwright index.mjs> node frontend/scripts/make-kids-icons.mjs frontend/public/icons
import { writeFileSync } from "node:fs";
const { chromium } = await import(process.env.PW_PATH);
const OUT = process.argv[2];

// Fox face in a 120x120 box, matching the mascot on the child sign-in (components/shared/Botanical.jsx Pet).
const fox = `
  <path d="M30 44 L 22 10 L 52 30 Z" fill="#C77B5B"/><path d="M90 44 L 98 10 L 68 30 Z" fill="#C77B5B"/>
  <path d="M32 38 L 27 18 L 46 30 Z" fill="#F5EFE0"/><path d="M88 38 L 93 18 L 74 30 Z" fill="#F5EFE0"/>
  <ellipse cx="60" cy="62" rx="40" ry="37" fill="#C77B5B"/>
  <ellipse cx="60" cy="79" rx="20" ry="14" fill="#F5EFE0"/>
  <circle cx="45" cy="58" r="6" fill="#2A2822"/><circle cx="46.8" cy="56.2" r="2" fill="#FBF7EC"/>
  <circle cx="75" cy="58" r="6" fill="#2A2822"/><circle cx="76.8" cy="56.2" r="2" fill="#FBF7EC"/>
  <ellipse cx="35" cy="70" rx="6" ry="3.6" fill="#D4857A" opacity="0.55"/><ellipse cx="85" cy="70" rx="6" ry="3.6" fill="#D4857A" opacity="0.55"/>
  <ellipse cx="60" cy="72.5" rx="4.2" ry="3.2" fill="#2A2822"/>
  <path d="M53 80 Q 60 86, 67 80" stroke="#2A2822" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;

// rounded: transparent corners like the parent icon; full: edge-to-edge (iPhone and "maskable" Android crop it).
// art = how much of the icon the fox fills (maskable must stay inside the middle 80%).
function svg({ rounded, art }) {
  const bg = rounded ? `<rect x="0" y="0" width="512" height="512" rx="104" fill="#F2C46B"/>` : `<rect width="512" height="512" fill="#F2C46B"/>`;
  const size = 512 * art, off = (512 - size) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${bg}
    <circle cx="256" cy="256" r="${size * 0.47}" fill="#FBE3A4" opacity="0.55"/>
    <g transform="translate(${off} ${off + size * 0.02}) scale(${size / 120})">${fox}</g></svg>`;
}
const jobs = [
  ["kids-icon-192.png", 192, { rounded: true, art: 0.74 }],
  ["kids-icon-512.png", 512, { rounded: true, art: 0.74 }],
  ["kids-maskable-192.png", 192, { rounded: false, art: 0.62 }],
  ["kids-maskable-512.png", 512, { rounded: false, art: 0.62 }],
  ["kids-apple-touch-icon.png", 180, { rounded: false, art: 0.72 }],
  ["kids-favicon-32.png", 32, { rounded: true, art: 0.86 }],
];
writeFileSync(`${OUT}/kids-icon.svg`, svg({ rounded: true, art: 0.74 }));
const browser = await chromium.launch();
for (const [name, px, opts] of jobs) {
  const page = await browser.newPage({ viewport: { width: px, height: px } });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg(opts).replace("<svg ", `<svg width="${px}" height="${px}" `)}</body></html>`);
  await page.screenshot({ path: `${OUT}/${name}`, omitBackground: true, clip: { x: 0, y: 0, width: px, height: px } });
  await page.close();
}
await browser.close();
console.log("done");
