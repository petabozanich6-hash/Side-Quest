// All coordinates are relative to the full square PetArt canvas, not its room.
// The underlying artwork is centred with object-fit: contain.
export const ACCESSORY_SLOTS = {
  scarf: "neck", bow: "head", flower_crown: "head", party_hat: "head",
  bookworm_specs: "face", backpack: "back", cape: "back",
  star_badge: "chest", crown: "head", top_hat: "head", rainbow: "head",
  magic_wand: "right", headphones: "head", shades: "face", butterfly: "back",
};
const shape = (head, face, neck, chest, back, left, right, feet, ears, cheeks) => ({
  head: [head], face: [face], neck: [neck], chest: [chest], back: [back],
  left: [left], right: [right], feet, ears, cheeks,
});
// x and y in %, and approximate decoration width in % of the art canvas.
const SPECIES = {
  turtle: shape([76,25,24],[78,45,23],[66,60,27],[61,70,17],[38,57,38],[18,61,20],[89,64,20],[[28,83,15],[73,87,15]],[[68,31,11],[88,32,11]],[[70,53,9],[87,53,9]]),
  dragon: shape([67,22,23],[69,37,25],[63,54,23],[61,65,17],[33,58,34],[23,64,20],[81,66,19],[[48,88,15],[73,88,15]],[[57,23,10],[78,24,10]],[[60,47,9],[78,47,9]]),
  fox: shape([63,24,24],[64,42,27],[64,58,24],[63,69,17],[37,62,35],[22,63,18],[88,65,18],[[49,87,14],[73,87,14]],[[51,24,11],[77,24,11]],[[53,49,9],[74,49,9]]),
  owl: shape([51,23,25],[51,41,26],[51,59,25],[51,70,17],[43,64,34],[23,62,19],[80,62,19],[[39,86,14],[63,86,14]],[[37,26,10],[65,26,10]],[[43,49,9],[61,49,9]]),
  goblin: shape([54,25,24],[54,42,25],[52,56,24],[51,69,16],[42,61,34],[21,66,19],[79,66,19],[[41,87,13],[64,87,13]],[[30,30,10],[79,30,10]],[[44,50,9],[65,50,9]]),
};

// Hatchlings still have their own illustration but use the same proportion-based placements.
export function petSpots(species, slot) {
  const speciesSpots = SPECIES[species] || SPECIES.dragon;
  return speciesSpots[slot] || [];
}

export function maxThreeBySlot(ids) {
  const latest = new Map();
  (ids || []).forEach((id) => {
    const slot = ACCESSORY_SLOTS[id];
    if (slot) {
      latest.delete(slot);
      latest.set(slot, id);
    }
  });
  return [...latest.values()].slice(-3);
}
