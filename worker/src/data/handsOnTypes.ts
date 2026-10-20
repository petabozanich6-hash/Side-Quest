// Original Side-Quest activity instructions; no third-party worksheets or copied recipes.
export type HandsOnCategory =
  | "Kitchen Science" | "Crystal Lab" | "Dough & Sensory"
  | "LEGO & Builders" | "Engineering Lab"
  | "Nature Explorers" | "Art & Making"
  | "Everyday Maths" | "Stories & Words" | "Movement & Games"
  | "Space & Sky" | "Sound & Music" | "Coding Without Screens"
  | "Practical Life" | "History & Maps"
  | "Light & Colour" | "Forces & Motion" | "Weather Watch" | "Plants & Gardens"
  | "Logic & Probability" | "Drama & Performance" | "Design for Everyone"
  | "Money & Markets" | "Earth & Landforms" | "Community & Civics";

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

/** Each source row is deliberately original and written for printable family guides. */
export type QuestRow = [
  id:string, title:string, ages:string, minutes:number, mess:HandsOnQuest["mess"],
  icon:string, description:string, materials:string, steps:string,
  wonder:string, skills:string, safety:string, extension:string
];
const fields = (source:string):string[] => source.split("|").map(s=>s.trim()).filter(Boolean);
export function fromRows(category:HandsOnCategory, rows:QuestRow[]):HandsOnQuest[] {
  return rows.map(([id,title,ages,minutes,mess,icon,description,materials,steps,wonder,skills,safety,extension])=>
    quest(id,title,category,ages,minutes,mess,icon,description,fields(materials),
      fields(steps),fields(wonder),fields(skills),safety,extension));
}
