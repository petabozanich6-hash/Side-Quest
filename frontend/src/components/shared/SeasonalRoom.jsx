import React from "react";

export const SEASONS = {
  halloween: { label: "Halloween", bg: "linear-gradient(180deg, #4C2A6B 0%, #9A6BC8 100%)" },
  christmas: { label: "Christmas", bg: "linear-gradient(180deg, #DBEAFE 0%, #FEE2E2 100%)" },
  new_year: { label: "New Year", bg: "linear-gradient(180deg, #1E1B4B 0%, #4338CA 100%)" },
  easter: { label: "Easter", bg: "linear-gradient(180deg, #FDF2F8 0%, #DCFCE7 100%)" },
  mothers_day: { label: "Mother's Day", bg: "linear-gradient(180deg, #FFF1F2 0%, #FBCFE8 100%)" },
  birthday: { label: "Birthday", bg: "linear-gradient(180deg, #FEF9C3 0%, #FBCFE8 100%)" },
  lunar_new_year: { label: "Lunar New Year", bg: "linear-gradient(180deg, #FEE2E2 0%, #FDE68A 100%)" },
};

export const GIFT_EMOJI = {
  hw_pumpkin_hat: "\u{1F383}", xmas_santa_hat: "\u{1F385}", ny_party_glasses: "\u{1F973}",
  easter_bunny_ears: "\u{1F430}", mum_bouquet: "\u{1F490}", bday_balloon: "\u{1F388}",
  lny_lantern: "\u{1F3EE}",
};

const Flower = ({ x, y, c = "#EC4899", r = 9 }) => (
  <g transform={`translate(${x},${y})`}>
    {[0, 72, 144, 216, 288].map(a => (
      <circle key={a} cx={Math.cos((a * Math.PI) / 180) * r} cy={Math.sin((a * Math.PI) / 180) * r} r={r * 0.8} fill={c} />
    ))}
    <circle r={r * 0.6} fill="#FDE047" />
  </g>
);

const Heart = ({ x, y, s = 1, c = "#F43F5E" }) => (
  <path transform={`translate(${x},${y}) scale(${s})`} d="M0,8 c-14,-12 -8,-24 0,-14 c8,-10 14,2 0,14z" fill={c} />
);

const Burst = ({ x, y, c }) => (
  <g transform={`translate(${x},${y})`} stroke={c} strokeWidth="4" strokeLinecap="round">
    {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
      <line key={a} x1={Math.cos((a * Math.PI) / 180) * 12} y1={Math.sin((a * Math.PI) / 180) * 12}
        x2={Math.cos((a * Math.PI) / 180) * 34} y2={Math.sin((a * Math.PI) / 180) * 34} />
    ))}
  </g>
);

const Bunting = ({ colors }) => (
  <g>
    <path d="M0,14 Q200,44 400,14 T800,14" stroke="#6B7280" strokeWidth="2" fill="none" />
    {Array.from({ length: 12 }).map((_, i) => {
      const x = 30 + i * 66;
      const y = 14 + Math.sin((i / 11) * Math.PI * 2) * 0 + (i % 2 === 0 ? 14 : 14);
      return <polygon key={i} points={`${x - 14},${y} ${x + 14},${y} ${x},${y + 30}`} fill={colors[i % colors.length]} />;
    })}
  </g>
);

const Lantern = ({ x }) => (
  <g transform={`translate(${x},0)`}>
    <line x1="0" y1="0" x2="0" y2="44" stroke="#92400E" strokeWidth="2" />
    <rect x="-10" y="42" width="20" height="6" rx="2" fill="#F59E0B" />
    <ellipse cx="0" cy="72" rx="30" ry="26" fill="#DC2626" />
    <ellipse cx="0" cy="72" rx="12" ry="26" fill="none" stroke="#F59E0B" strokeWidth="2" />
    <rect x="-10" y="96" width="20" height="6" rx="2" fill="#F59E0B" />
    <line x1="0" y1="102" x2="0" y2="130" stroke="#F59E0B" strokeWidth="3" />
    <line x1="-5" y1="102" x2="-7" y2="122" stroke="#F59E0B" strokeWidth="2" />
    <line x1="5" y1="102" x2="7" y2="122" stroke="#F59E0B" strokeWidth="2" />
  </g>
);

const Balloon = ({ x, y, c }) => (
  <g>
    <path d={`M${x},${y + 28} Q${x - 6},${y + 70} ${x + 4},${y + 110}`} stroke="#6B7280" strokeWidth="1.5" fill="none" />
    <ellipse cx={x} cy={y} rx="22" ry="28" fill={c} />
    <ellipse cx={x - 7} cy={y - 10} rx="5" ry="8" fill="#fff" opacity="0.5" />
  </g>
);

const Egg = ({ x, y, c, s = "#fff" }) => (
  <g transform={`translate(${x},${y})`}>
    <ellipse rx="16" ry="21" fill={c} />
    <path d="M-15,-2 Q-7,-8 0,-2 T15,-2" stroke={s} strokeWidth="3" fill="none" />
    <path d="M-14,8 Q-7,3 0,8 T14,8" stroke={s} strokeWidth="3" fill="none" />
  </g>
);

const Scene = ({ id }) => {
  switch (id) {
    case "halloween":
      return (
        <g>
          <path d="M0,0 L130,0 M0,0 L120,70 M0,0 L70,120 M0,0 L0,130 M95,0 Q70,40 0,95 M45,0 Q35,20 0,45" stroke="#E5E7EB" strokeWidth="2" fill="none" opacity="0.85" />
          <circle cx="690" cy="70" r="36" fill="#FEF3C7" />
          <circle cx="678" cy="60" r="6" fill="#FDE68A" /><circle cx="702" cy="82" r="8" fill="#FDE68A" />
          {[[230, 60], [560, 40], [610, 110]].map(([x, y], i) => (
            <path key={i} transform={`translate(${x},${y})`} d="M-22,0 q11,-16 22,0 q11,-16 22,0 q-11,4 -22,18 q-11,-14 -22,-18z" fill="#1F1F2E" />
          ))}
          <g transform="translate(120,285)">
            <ellipse rx="38" ry="30" fill="#F97316" />
            <ellipse rx="16" ry="30" fill="none" stroke="#EA580C" strokeWidth="3" />
            <rect x="-4" y="-42" width="8" height="16" rx="3" fill="#65A30D" />
            <polygon points="-20,-8 -8,-8 -14,-18" fill="#1F1F2E" /><polygon points="8,-8 20,-8 14,-18" fill="#1F1F2E" />
            <path d="M-20,6 L-10,16 L-4,8 L4,16 L10,8 L20,6 L14,22 Q0,28 -14,22z" fill="#1F1F2E" />
          </g>
          <g transform="translate(690,300)">
            <ellipse rx="26" ry="21" fill="#F97316" /><rect x="-3" y="-32" width="6" height="12" rx="2" fill="#65A30D" />
          </g>
        </g>
      );
    case "christmas":
      return (
        <g>
          <path d="M0,22 Q100,56 200,22 T400,22 T600,22 T800,22" stroke="#374151" strokeWidth="2" fill="none" />
          {[40, 130, 220, 310, 400, 490, 580, 670, 760].map((x, i) => (
            <circle key={x} cx={x} cy={i % 2 ? 42 : 36} r="7" fill={["#EF4444", "#FACC15", "#22C55E", "#3B82F6"][i % 4]} />
          ))}
          <g transform="translate(705,300)">
            <rect x="-8" y="-6" width="16" height="16" fill="#92400E" />
            <polygon points="0,-130 -46,-60 46,-60" fill="#15803D" />
            <polygon points="0,-98 -58,-18 58,-18" fill="#16A34A" />
            <polygon points="0,-64 -68,-4 68,-4" fill="#15803D" />
            <polygon points="0,-146 6,-132 20,-132 9,-124 13,-110 0,-118 -13,-110 -9,-124 -20,-132 -6,-132" fill="#FACC15" />
            {[[-20, -70, "#EF4444"], [24, -40, "#3B82F6"], [-30, -20, "#FACC15"], [8, -92, "#EF4444"]].map(([x, y, c], i) => (
              <circle key={i} cx={x} cy={y} r="6" fill={c} />
            ))}
          </g>
          <g transform="translate(110,296)">
            <rect x="-26" y="-26" width="52" height="36" fill="#DC2626" />
            <rect x="-5" y="-26" width="10" height="36" fill="#FACC15" />
            <rect x="-26" y="-12" width="52" height="8" fill="#FACC15" />
            <path d="M0,-26 q-18,-22 -4,-22 q8,0 4,22 q-4,-22 4,-22 q14,0 0,22z" fill="#FACC15" />
          </g>
          {[[60, 90], [180, 140], [330, 90], [480, 70], [600, 150], [760, 120], [260, 200]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke="#E5E7EB" />
          ))}
        </g>
      );
    case "new_year":
      return (
        <g>
          <Burst x={140} y={90} c="#FACC15" />
          <Burst x={660} y={70} c="#F472B6" />
          <Burst x={400} y={40} c="#38BDF8" />
          {[[60, 200, "#F472B6"], [210, 160, "#FACC15"], [320, 110, "#38BDF8"], [500, 120, "#34D399"], [600, 200, "#FACC15"], [750, 180, "#F472B6"], [110, 260, "#38BDF8"], [700, 270, "#34D399"]].map(([x, y, c], i) => (
            <rect key={i} x={x} y={y} width="10" height="5" rx="2" fill={c} transform={`rotate(${i * 37} ${x} ${y})`} />
          ))}
          <g transform="translate(110,290)">
            <polygon points="-14,0 14,0 8,-40 -8,-40" fill="#FACC15" /><rect x="-3" y="-52" width="6" height="12" fill="#E5E7EB" />
          </g>
        </g>
      );
    case "easter":
      return (
        <g>
          <path d="M0,320 Q100,285 200,320 Z M600,320 Q700,280 800,320 Z" fill="#86EFAC" />
          <Egg x={70} y={285} c="#F9A8D4" s="#fff" />
          <Egg x={125} y={296} c="#93C5FD" s="#FDE047" />
          <Egg x={175} y={288} c="#FDE047" s="#F472B6" />
          <Egg x={640} y={292} c="#C4B5FD" s="#fff" />
          <Egg x={700} y={284} c="#86EFAC" s="#fff" />
          <Egg x={750} y={296} c="#FDBA74" s="#fff" />
          <Flower x={230} y={300} c="#F472B6" r={7} /><Flower x={580} y={302} c="#FDE047" r={7} />
        </g>
      );
    case "mothers_day":
      return (
        <g>
          <Flower x={80} y={270} c="#EC4899" r={14} /><Flower x={140} y={298} c="#F97316" r={11} />
          <Flower x={705} y={275} c="#A855F7" r={14} /><Flower x={650} y={298} c="#EC4899" r={11} />
          <Flower x={190} y={250} c="#FDA4AF" r={9} /><Flower x={600} y={255} c="#FDA4AF" r={9} />
          <Heart x={250} y={70} s={1.2} /><Heart x={560} y={50} s={1} c="#EC4899" /><Heart x={380} y={30} s={0.8} />
          <Heart x={90} y={120} s={0.9} c="#EC4899" /><Heart x={720} y={130} s={1.1} />
        </g>
      );
    case "birthday":
      return (
        <g>
          <Bunting colors={["#F43F5E", "#FACC15", "#38BDF8", "#34D399", "#A78BFA"]} />
          <Balloon x={70} y={170} c="#F43F5E" /><Balloon x={115} y={190} c="#FACC15" /><Balloon x={95} y={150} c="#38BDF8" />
          <Balloon x={705} y={170} c="#A78BFA" /><Balloon x={745} y={195} c="#34D399" /><Balloon x={725} y={150} c="#F43F5E" />
        </g>
      );
    case "lunar_new_year":
      return (
        <g>
          <Lantern x={110} /><Lantern x={690} />
          {[[60, 280], [160, 296], [630, 290], [740, 280]].map(([x, y], i) => (
            <g key={i}><circle cx={x} cy={y} r="14" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" /><rect x={x - 4} y={y - 4} width="8" height="8" fill="#CA8A04" /></g>
          ))}
          <Heart x={260} y={60} s={0.9} c="#DC2626" /><Heart x={540} y={60} s={0.9} c="#DC2626" />
        </g>
      );
    default:
      return null;
  }
};

export function SeasonalDecor({ ids = [] }) {
  if (!ids.length) return null;
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 320"
      preserveAspectRatio="xMidYMax slice" aria-hidden="true" data-testid="seasonal-decor">
      {ids.map(id => <Scene key={id} id={id} />)}
    </svg>
  );
}

export function SeasonalGifts({ petName, data, hatched, worn, claiming, onClaim, onToggle }) {
  const events = data?.events || [];
  const owned = data?.owned || [];
  const unclaimed = events.filter(e => !e.claimed);
  if (!unclaimed.length && !owned.length) return null;
  return (
    <section className="space-y-3" data-testid="seasonal-section">
      {unclaimed.map(e => (
        <button key={e.id} onClick={() => onClaim(e.id)} disabled={claiming}
          className="paper-card w-full p-4 text-left flex items-center gap-4 hover:translate-y-[-2px] transition disabled:opacity-60"
          data-testid={`gift-${e.id}`}>
          <span className="text-4xl">{"\u{1F381}"}</span>
          <span>
            <span className="block font-display text-lg font-bold" style={{ color: "#1F3B2D" }}>{petName} has a {e.label} gift!</span>
            <span className="block text-xs text-stone-600">Tap to open it. It's free and yours to keep.</span>
          </span>
        </button>
      ))}
      {owned.length > 0 && (
        <div className="paper-card p-5" data-testid="seasonal-wardrobe">
          <h2 className="font-display text-lg font-bold mb-1" style={{ color: "#1F3B2D" }}>Festive gifts</h2>
          <p className="text-xs text-stone-600 mb-3">Gifts you've collected. Wear them any time.</p>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {owned.map(g => {
              const on = worn.includes(g.id);
              return (
                <button key={g.id} disabled={!hatched} onClick={() => onToggle(g.id)}
                  className="rounded-xl border-2 p-3 text-center disabled:opacity-40"
                  style={{ borderColor: on ? "#1F3B2D" : "#D4C8A8", background: on ? "#ECFCCB" : "#fff" }}
                  data-testid={`acc-${g.id}`}>
                  <div className="text-3xl">{g.emoji || GIFT_EMOJI[g.id] || "\u2728"}</div>
                  <div className="text-[11px] font-bold mt-1" style={{ color: "#1F3B2D" }}>{g.label}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{g.event_label}</div>
                </button>
              );
            })}
          </div>
          {!hatched && <p className="text-xs text-stone-500 mt-3">Your pet can wear these once it hatches.</p>}
        </div>
      )}
    </section>
  );
}
