// Measurable (observable) verbs allowed to open a learning objective.
export const MEASURABLE_VERBS = new Set([
  "add", "analyse", "analyze", "apply", "arrange", "calculate", "classify", "compare", "complete", "compose",
  "construct", "convert", "create", "critique", "define", "describe", "design", "determine", "develop",
  "diagram", "distinguish", "draw", "estimate", "evaluate", "explain", "find", "identify", "illustrate",
  "interpret", "justify", "label", "list", "locate", "match", "measure", "name", "order", "organise",
  "organize", "plan", "predict", "read", "recall", "recognise", "recognize", "revise", "round", "select",
  "show", "solve", "sort", "spell", "state", "subtract", "summarise", "summarize", "test", "use", "write",
  "multiply", "divide", "edit", "choose", "build", "debug", "demonstrate", "present", "reduce", "simplify", "check",
]);
// Vague verbs that cannot be assessed directly.
export const VAGUE_VERBS = new Set(["understand", "know", "learn", "appreciate", "be", "become", "realise", "realize", "enjoy", "grasp"]);
export function firstWord(s) {
  return (String(s).trim().toLowerCase().match(/^[a-z]+/) || [""])[0];
}
