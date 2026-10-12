import React from "react";
import Furniture, { AcornIcon } from "./Furniture";

const ORDER = ["Rest", "Play", "Comfort", "Decor", "Themes", "Floors"];

export default function NestShop({ shop = [], acorns = 0, busy, justBought, onBuy, onUse, onTheme, onFloor }) {
  const groups = ORDER.map((category) => ({
    category,
    items: shop.filter((item) => item.category === category),
  })).filter((group) => group.items.length);

  return (
    <section className="paper-card p-5" data-testid="nest-shop">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display text-lg font-bold" style={{ color: "#1F3B2D" }}>Nest shop</h2>
          <p className="text-xs text-stone-600 mt-1">Acorns come with learning, once for each piece of work. Nothing here costs real money.</p>
        </div>
        <div className="acorn-balance" data-testid="acorn-balance" aria-live="polite" aria-label={`${acorns} acorns`}>
          <AcornIcon />
          <span>{acorns}</span>
        </div>
      </div>
      {groups.map((group) => (
        <div key={group.category} className="mb-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">{group.category}</div>
          <div className="shop-grid">
            {group.items.map((item) => (
              <article key={`${item.kind}-${item.id}`} className={`shop-card ${item.owned ? "is-owned" : ""} ${justBought === item.id ? "is-bought" : ""}`} data-testid={`shop-${item.id}`}>
                <div className="shop-preview">
                  {item.kind === "furniture" && <Furniture item={item.id} lampOn />}
                  {item.kind !== "furniture" && (
                    <span className="block h-12 w-16 rounded-xl border" style={{ borderColor: "#D4C8A8", background: swatch(item) }} />
                  )}
                </div>
                <div className={`rarity ${item.rarity === "rare" ? "rare" : ""}`}>{item.rarity}</div>
                <div className="font-display font-bold" style={{ color: "#1F3B2D" }}>{item.name}</div>
                <p className="text-xs text-stone-600 flex-1">{item.blurb}</p>
                <div className="text-xs font-bold">{item.owned ? "In your cupboard" : <span className="inline-flex items-center gap-1"><AcornIcon size={14} /> {item.cost}</span>}</div>
                {item.owned ? (
                  <OwnedActions item={item} onUse={onUse} onTheme={onTheme} onFloor={onFloor} />
                ) : (
                  <button
                    type="button"
                    className="shop-buy"
                    disabled={busy || acorns < item.cost}
                    aria-label={acorns < item.cost ? `${item.name} needs ${item.cost} acorns. You have ${acorns}.` : `Add the ${item.name} to the cupboard for ${item.cost} acorns`}
                    onClick={() => onBuy(item.id)}
                    data-testid={`buy-${item.id}`}
                  >
                    {acorns < item.cost ? "Need more acorns" : "Add to cupboard"}
                  </button>
                )}
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function swatch(item) {
  if (item.swatch?.colors) return `linear-gradient(90deg, ${item.swatch.colors.join(", ")})`;
  if (item.swatch?.sky) return `linear-gradient(180deg, ${item.swatch.sky}, ${item.swatch.wall})`;
  return "#F5EFE0";
}

function OwnedActions({ item, onUse, onTheme, onFloor }) {
  if (item.kind === "theme") {
    return (
      <button type="button" className="shop-buy" disabled={item.placed} onClick={() => onTheme(item.id)} data-testid={`bg-${item.id}`}>
        {item.placed ? "On the walls" : "Use this theme"}
      </button>
    );
  }
  if (item.kind === "floor") {
    return (
      <button type="button" className="shop-buy" disabled={item.placed} onClick={() => onFloor(item.id)} data-testid={`floor-${item.id}`}>
        {item.placed ? "Underfoot" : "Use this floor"}
      </button>
    );
  }
  return (
    <button type="button" className="shop-buy" disabled={item.placed} onClick={() => onUse(item.id)} data-testid={`place-${item.id}`}>
      {item.placed ? "In the room" : "Put in the room"}
    </button>
  );
}
