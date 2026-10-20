// Original Side-Quest activity instructions; no third-party worksheets or copied recipes.
export type HandsOnCategory =
  | "Kitchen Science" | "Crystal Lab" | "Dough & Sensory"
  | "LEGO & Builders" | "Engineering Lab"
  | "Nature Explorers" | "Art & Making"
  | "Everyday Maths" | "Stories & Words" | "Movement & Games";

export type HandsOnQuest = {
  id: string;
  title: string;
  category: HandsOnCategory;
  ages: string;
  minutes: number;
  mess: "Low" | "Medium" | "High";
  icon: string;
  description: string;
  materials: string[];
  steps: string[];
  wonder: string[];
  skills: string[];
  safety: string;
  extension: string;
};
export const quest = (
  id: string, title: string, category: HandsOnCategory, ages: string, minutes: number,
  mess: HandsOnQuest["mess"], icon: string, description: string,
  materials: string[], steps: string[], wonder: string[], skills: string[],
  safety: string, extension: string,
): HandsOnQuest => ({ id, title, category, ages, minutes, mess, icon,
  description, materials, steps, wonder, skills, safety, extension });
