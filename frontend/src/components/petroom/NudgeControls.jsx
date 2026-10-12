import React from "react";
import { ITEMS } from "./roomLogic";

export default function NudgeControls({ placements = [], onNudge, onRemove }) {
  if (!placements.length) return null;
  return (
    <div className="paper-card p-4" data-testid="nudge-panel">
      <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">Move without dragging</div>
      <p className="text-xs text-stone-600 mb-2">These buttons move a piece a little way. Arrow keys do the same when that piece is selected. Dragging is optional.</p>
      <div className="nudge-list">
        {placements.map((placement) => {
          const name = ITEMS[placement.item]?.name || placement.item;
          return (
            <div key={placement.item} className="nudge-row" role="group" aria-label={`Move the ${name}`}>
              <span className="nudge-name">{name}</span>
              <button type="button" className="nudge-btn" aria-label={`Move the ${name} left`} onClick={() => onNudge(placement.item, -0.04, 0)}>Left</button>
              <button type="button" className="nudge-btn" aria-label={`Move the ${name} right`} onClick={() => onNudge(placement.item, 0.04, 0)}>Right</button>
              <button type="button" className="nudge-btn" aria-label={`Move the ${name} up`} onClick={() => onNudge(placement.item, 0, -0.03)}>Up</button>
              <button type="button" className="nudge-btn" aria-label={`Move the ${name} down`} onClick={() => onNudge(placement.item, 0, 0.03)}>Down</button>
              <button type="button" className="nudge-btn" aria-label={`Put the ${name} back in the cupboard`} onClick={() => onRemove(placement.item)}>Remove</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
