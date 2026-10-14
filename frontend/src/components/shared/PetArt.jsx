import React from "react";
import { Pet } from "./Botanical";

// Illustrated pets (character sheet art). Species without art fall back to the original drawn pet.
export const ART_SPECIES = ["goblin", "dragon", "fox", "owl", "turtle"];
const STAGES = ["egg", "hatchling", "youngling", "companion", "hero", "legend"];

export function artStage(levelName) {
  const s = String(levelName || "").toLowerCase();
  return STAGES.includes(s) ? s : "hatchling";
}

export default function PetArt({ species, stage, size = 200, happy = true, children, ...rest }) {
  if (!ART_SPECIES.includes(species)) return <Pet species={species} size={size} happy={happy}>{children}</Pet>;
  const st = artStage(stage);
  return (
    <div className="relative inline-block" style={{ width: size, height: size }} data-testid="pet-art" data-species={species} data-stage={st} {...rest}>
      <img src={`/pet-art/${species}-${st}.webp`} alt={`${species} ${st}`} draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom" }} />
      {children}
    </div>
  );
}
