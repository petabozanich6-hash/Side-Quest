// Shared labels for the Outcome Tracker. The five statuses are fixed; only a parent confirmation reaches Achieved.
import { Circle, Sprout, Leaf, TreeDeciduous, Award } from "lucide-react";

export const STATUS_ORDER = ["not_started", "introduced", "developing", "demonstrated", "achieved"];

export const STATUS = {
  not_started: { label: "Not Started", short: "Not started", icon: Circle, bg: "#F1EEE6", fg: "#57534E", border: "#D6D3D1", bar: "#D6D3D1", hint: "No learning evidence yet." },
  introduced: { label: "Introduced", short: "Introduced", icon: Sprout, bg: "#F0F7FF", fg: "#1E4E79", border: "#A9CBEA", bar: "#8DB8E0", hint: "Met in a learning experience." },
  developing: { label: "Developing", short: "Developing", icon: Leaf, bg: "#FFF7E6", fg: "#7A4B0B", border: "#E8C27A", bar: "#D4A574", hint: "Practised, building towards understanding." },
  demonstrated: { label: "Demonstrated", short: "Demonstrated", icon: TreeDeciduous, bg: "#ECF7EF", fg: "#1F5A36", border: "#8CC4A0", bar: "#6B8A5B", hint: "Understanding shown in reviewed work. Waiting for your confirmation." },
  achieved: { label: "Achieved", short: "Achieved", icon: Award, bg: "#1F3B2D", fg: "#F5EFE0", border: "#1F3B2D", bar: "#1F3B2D", hint: "Confirmed by you." },
};

export const GAPS = {
  not_introduced: "Not introduced yet",
  not_revisited: "Introduced but not revisited",
  limited_evidence: "Limited evidence so far",
  needs_consolidation: "Needs more consolidation",
  awaiting_confirmation: "Ready for your confirmation",
  confirmed_evidence_changed: "Confirmed, but its evidence changed",
};

export const LEVELS = {
  participation: "Took part",
  practice: "Practised",
  demonstrated: "Showed understanding",
};

export const SUPPORT = {
  independent: "Independently",
  some: "With some help",
  significant: "With a lot of help",
};

export const SOURCE = {
  lesson_review: "Lesson work",
  quiz: "Lesson quiz",
  life_learning: "Life learning",
  evidence_note: "Evidence Backpack note",
  parent_observation: "Your observation",
};

export const ORIGIN = { ai: "AI-drafted lesson", manual: "Lesson you built", life: "Everyday learning", parent: "Added by you" };

export function StatusBadge({ status, size = "sm", testid }) {
  const s = STATUS[status] || STATUS.not_started;
  const Icon = s.icon;
  const pad = size === "lg" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${pad}`} style={{ backgroundColor: s.bg, color: s.fg, borderColor: s.border }} data-testid={testid} data-status={status}>
      <Icon size={size === "lg" ? 15 : 12} aria-hidden="true" /> {s.label}
    </span>
  );
}

/** A thin stacked bar of statuses (counts keyed by status). */
export function StatusBar({ counts, total, testid }) {
  const t = total || STATUS_ORDER.reduce((n, k) => n + (counts?.[k] || 0), 0) || 1;
  return (
    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-stone-200" role="img" aria-label={STATUS_ORDER.map((k) => `${STATUS[k].label} ${counts?.[k] || 0}`).join(", ")} data-testid={testid}>
      {STATUS_ORDER.slice(1).reverse().map((k) => (counts?.[k] ? <div key={k} style={{ width: `${(100 * counts[k]) / t}%`, backgroundColor: STATUS[k].bar }} /> : null))}
    </div>
  );
}
