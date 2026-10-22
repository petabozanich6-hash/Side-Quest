import React from "react";
import { Pet } from "./Botanical";
import PetFigure, { NEW_ART_SPECIES } from "../pets/PetFigure";

// Companion portraits outside the pet room (welcome card, helper bubble, parent overview, picker).
// The five current species use the shared companion artwork; retired species keep their original drawing.
export const ART_SPECIES = NEW_ART_SPECIES;
const STAGES = ["egg", "hatchling", "youngling", "companion", "hero", "legend"];

export function artStage(levelName) {
  const s = String(levelName || "").toLowerCase();
  return STAGES.includes(s) ? s : "hatchling";
}

export default function PetArt({ species, stage, size = 200, happy = true, mood, worn, seasonal, live = true, children, ...rest }) {
  if (!ART_SPECIES.includes(species)) return <Pet species={species} size={size} happy={happy}>{children}</Pet>;
  const st = artStage(stage);
  return (
    <div className="relative inline-block" style={{ width: size }} {...rest}>
      <PetFigure species={species} stage={st} size={size} mood={mood || (happy ? "calm" : "sad")} worn={worn} seasonal={seasonal} live={live} />
      {children}
    </div>
  );
}
