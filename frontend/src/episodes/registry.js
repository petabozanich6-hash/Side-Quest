import roundingPilot from "./s2-mat-y3-w02-l1.json";

/** Frontend registry of teaching episodes keyed by lesson seed_key. */
const BY_SEED = {
  [roundingPilot.seed_key]: roundingPilot,
};

export function getTeachingEpisode(seedKey) {
  if (!seedKey) return null;
  return BY_SEED[seedKey] || null;
}

export function listTeachingEpisodes() {
  return Object.values(BY_SEED);
}

export { roundingPilot };
