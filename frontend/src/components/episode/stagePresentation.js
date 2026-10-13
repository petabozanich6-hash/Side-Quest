/**
 * Age-stage presentation hooks.
 * Stage 2 is the pilot default. Stage 3/4 keep the same interaction model
 * but tone down bounce/emoji chrome so secondary UX is not babyish.
 */

const PRESETS = {
  S2: {
    label: "Stage 2",
    showCharacterBounce: true,
    captionStyle: "friendly",
    controlSize: "large",
    diagramLabelSize: 16,
    encourageReplay: true,
    titleTone: "quest",
  },
  S3: {
    label: "Stage 3",
    showCharacterBounce: false,
    captionStyle: "plain",
    controlSize: "medium",
    diagramLabelSize: 15,
    encourageReplay: true,
    titleTone: "lesson",
  },
  S4: {
    label: "Stage 4",
    showCharacterBounce: false,
    captionStyle: "plain",
    controlSize: "medium",
    diagramLabelSize: 14,
    encourageReplay: false,
    titleTone: "lesson",
  },
};

export function presentationForStage(stage) {
  const key = String(stage || "S2").toUpperCase();
  return PRESETS[key] || PRESETS.S2;
}
