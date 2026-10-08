import React from "react";
import useSeasonal from "./useSeasonal";

export default function SeasonalWorn() {
  const { keepsakes } = useSeasonal();
  const worn = keepsakes.filter(k => k.worn);
  if (!worn.length) return null;
  return (
    <div className="absolute -top-11 left-1/2 -translate-x-1/2 flex gap-1 text-3xl pointer-events-none" data-testid="worn-seasonal">
      {worn.map(k => <span key={k.pack} title={k.name}>{k.emoji}</span>)}
    </div>
  );
}
