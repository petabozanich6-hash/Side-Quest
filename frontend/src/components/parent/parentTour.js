/**
 * The guided tour describes real Parent Hub pages rather than a separate demo.
 * Keep each step short and honest about membership restrictions.
 */
export const TOUR_VERSION = 1;

export function tourStorageKey(parentId) {
  return "sq_parent_guided_tour_v" + TOUR_VERSION + "_" + String(parentId || "");
}

export function parentTourSteps(jurisdiction) {
  const international = jurisdiction === "OTHER";
  return [
    {
      path: "/parent", target: "tour-dashboard", title: "Dragon HQ: your dashboard",
      description: "This is your home base. See what your children are working on, what needs your review, and where to head next. You can always come back here.",
    },
    {
      path: "/parent/children", target: "tour-children", title: "Start with your adventurers",
      description: "Add each child, choose their level and subjects, and set up their child login and pocket pet. Each child's records stay in your family's own space.",
    },
    {
      path: "/parent/lessons", target: "tour-lessons", title: "Make your own learning quests",
      description: "Build lessons yourself, save them in your library, and assign them when they're ready. AI drafting is a Family Membership feature; you'll always review drafts before assigning them.",
    },
    {
      path: "/parent/assignments", target: "tour-assignments", title: "Give out quests and review work",
      description: "Assignments show which child has each lesson and its progress. Your child's completed work comes back for your review — a finished lesson isn't automatically an achieved curriculum outcome.",
    },
    {
      path: "/parent/calendar", target: "tour-calendar", title: "Tame the family calendar",
      description: "See upcoming learning and commitments in one place. Family Membership unlocks advanced planning and timetable tools; your preview still lets you explore the calendar.",
    },
    {
      path: "/parent/evidence", target: "tour-evidence", title: "The Evidence Backpack",
      description: "Reviewed lessons and everyday learning belong here. Paid families can add observations, keep detailed evidence and use the full export tools.",
    },
    {
      path: "/parent/outcomes", target: "tour-outcomes",
      title: international ? "Your family learning goals" : "Follow your curriculum outcomes",
      description: international
        ? "Outside Australia, create your own learning goals, connect evidence, and confirm achievements yourself. Side-Quest doesn't claim these meet your local curriculum rules."
        : "Track progress against the available curriculum references for your state or territory. Evidence helps show progress, but only you confirm an outcome as Achieved.",
    },
    international
      ? {
          path: "/parent/curriculum", target: "tour-curriculum", title: "A compass for learning abroad",
          description: "You can use Side-Quest outside Australia without Australian outcome codes. Check registration and curriculum rules with the authority where you live.",
        }
      : {
          path: "/parent/homeschool-compass", target: "tour-compass", title: "Your Homeschooling Compass",
          description: "Find the registration and planning guidance for your Australian state or territory. Side-Quest helps with organisation — your local education authority sets the requirements.",
        },
    {
      path: "/parent/plan", target: "tour-plan", title: "Your plan, your pace",
      description: "The seven-day preview is deliberately small. This page explains exactly which tools are included and what Family Membership unlocks. There's no need to upgrade to finish the tour.",
    },
  ];
}
