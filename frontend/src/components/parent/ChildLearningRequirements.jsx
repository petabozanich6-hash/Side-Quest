import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, apiErrorMessage } from "../../lib/api";
import { toast } from "sonner";

/**
 * Registration requirements explainer, NOT an official approval/compliance assessment.
 * Never infer stage from age alone; homeschool exemptions/pathways need authority confirmation.
 */
const NSW_PRIMARY = ["English", "Mathematics", "Science and Technology", "HSIE (History and/or Geography)", "Creative Arts", "PDHPE"];
const NSW_SECONDARY = ["English", "Mathematics", "Science", "One HSIE syllabus"];
const NSW_CHOICES = ["Creative Arts", "PDHPE", "Languages", "Technology"];
const SA_SOURCE = "https://www.education.sa.gov.au/docs/curriculum/guide-to-home-education-in-south-australia.pdf";
const VIC_AREAS = ["English", "Mathematics", "Science", "Humanities", "The Arts", "Technologies", "Health and Physical Education", "Languages"];
const NSW_SOURCE = "https://www.nsw.gov.au/education-and-training/home-schooling/registration-guidelines/curriculum-overview";
const NSW_PRIMARY_SOURCE = "https://www.nsw.gov.au/education-and-training/home-schooling/registration-guidelines/k-to-6-curriculum";
const NSW_SECONDARY_SOURCE = "https://www.nsw.gov.au/education-and-training/home-schooling/registration-guidelines/7-to-10-curriculum";
const VIC_SOURCE = "https://www2.vrqa.vic.gov.au/develop-home-education-learning-plan";

export function requirementsFor(jurisdiction, stage) {
  if (jurisdiction === "NSW") {
    if (["ES1", "S1", "S2", "S3"].includes(stage)) return {
      required: NSW_PRIMARY, choices: [], choicesNote: "Languages may be added as an optional learning area.",
      explanation: "Plan learning in these six key learning areas using relevant NESA syllabuses. History and/or Geography meet the HSIE area; check stage-specific syllabus requirements.",
      source: NSW_PRIMARY_SOURCE, verified: true,
    };
    if (["S4", "S5"].includes(stage)) return {
      required: NSW_SECONDARY, choices: NSW_CHOICES, chooseCount: 2,
      choicesNote: "Choose two syllabuses from TWO DIFFERENT additional learning areas. Selecting one subject does not remove the need for the second area.",
      explanation: "English, Mathematics, Science and one HSIE syllabus form the core. Choose additional subjects in two different other learning areas. Consult the official guidelines for your child's circumstances and current syllabus editions.",
      source: NSW_SECONDARY_SOURCE, verified: true,
    };
    return { required: [], choices: [], verified: false, source: NSW_SOURCE, explanation: "Senior secondary pathways and HSC-related arrangements depend on the courses and registration circumstances. Check the official NSW guidance before selecting requirements." };
  }
  if (jurisdiction === "VIC") return {
    required: VIC_AREAS, choices: [], verified: true, source: VIC_SOURCE,
    explanation: "A Victorian home education learning plan must substantially address eight learning areas unless an exemption applies. Following the Victorian Curriculum itself is not mandatory. The areas can be taught through integrated projects.",
  };
  if (jurisdiction === "SA") return {
    required: VIC_AREAS, choices: [], verified: true, source: SA_SOURCE,
    explanation: "South Australian home education programs must address all eight Australian Curriculum learning areas. The department does not require one specific teaching method or commercial curriculum. There is no fixed additional elective-subject number in this guidance; senior pathways need separate consideration.",
  };
  if (jurisdiction === "ACT") return {
    required: [], choices: [], verified: true,
    source: "https://www.act.gov.au/education-and-training/find-a-school-and-enrol/home-education-home-schooling",
    explanation: "ACT home education requires a broad, high-quality program suited to the child, including intellectual, physical, social and emotional development. The ACT registration guidance does not prescribe a fixed list of compulsory school subjects or a minimum number of elective subjects. Literacy and numeracy progress is included in annual reporting.",
  };
  if (jurisdiction === "NT") {
    const main = ["English", "Mathematics", "Science", "Health and Physical Education", "Technologies"];
    const shared = {
      source: "https://nt.gov.au/learning/primary-and-secondary-students/home-education",
      detailed_subjects_url: "https://nt.gov.au/__data/assets/word_doc/0007/1639843/subjects-and-content-descriptions-transition-to-year-10-.DOCX",
      verified: true, choices: [],
      choicesNote: "The NT subject-selection table states no numerical minimum for additional elective subjects.",
    };
    if (["ES1", "S1", "S2", "S3"].includes(stage)) return {
      ...shared, required: [...main, "Humanities and Social Sciences (HASS)", "The Arts"],
      optional: ["Languages"],
      explanation: "Transition–Year 6: teach English, Mathematics, Science, Health and Physical Education, HASS, The Arts and Technologies. Languages are optional. The government asks programs to address most listed content descriptions.",
    };
    if (stage === "S4") return {
      ...shared, required: [...main, "Humanities and Social Sciences (History, Geography, Economics and Business, Civics and Citizenship)", "The Arts"],
      optional: ["Languages"],
      explanation: "Years 7–8: teach English, Mathematics, Science, Health and Physical Education, HASS (including History, Geography, Economics and Business, Civics and Citizenship), The Arts and Technologies. Languages are optional.",
    };
    if (stage === "S5") return {
      ...shared, required: [...main, "History (HASS)"],
      optional: ["Geography", "Economics and Business", "Civics and Citizenship", "The Arts (Dance, Drama, Media Arts, Music, Visual Arts)", "Languages"],
      explanation: "Years 9–10: English, Mathematics, Science, Health and Physical Education, History and Technologies are listed without an optional label. Geography, Economics and Business, Civics and Citizenship, The Arts and Languages are explicitly optional. No minimum elective number is specified.",
    };
    return {
      required: [], choices: [], verified: true,
      source: shared.source, detailed_subjects_url: shared.detailed_subjects_url,
      explanation: "For Years 11–12, the NT home education guidance requires 25 hours per week of educational learning. It does not prescribe a fixed elective-subject count; subjects should suit the child's interests, needs and future goals.",
    };
  }
  if (jurisdiction === "QLD") return {
    required: [], choices: [], verified: true,
    source: "https://education.qld.gov.au/schools-and-educators/other-education/Pages/registration.aspx",
    explanation: "Queensland home education has no mandated list of individual subjects or minimum elective count. Parents develop a high-quality program appropriate to their child; Australian Curriculum-based and thematic examples are optional, not mandatory templates.",
  };
  if (jurisdiction === "WA") return {
    required: [], choices: [], verified: true,
    source: "https://www.education.wa.edu.au/develop-an-education-program",
    explanation: "Western Australia does not prescribe a separate compulsory-subject checklist or a fixed number of elective subjects for home educators. The program should suit the child, and moderators consider its consistency with the WA Curriculum. Its eight learning areas are useful references, not automatically eight compulsory standalone lessons.",
  };
  if (jurisdiction === "TAS") return {
    required: ["Literacy", "Numeracy", "A broad range of learning areas suited to the child"],
    choices: [], verified: true,
    source: "https://oer.tas.gov.au/wp-content/uploads/2023/10/Understanding-the-Standards-Sept-2023-FINAL-2.pdf",
    explanation: "Tasmania's standards include literacy, numeracy and a suitable range of other learning areas. They do not require all eight Australian Curriculum areas or a fixed number of elective subjects. Programs also address wellbeing, interpersonal skills and other applicable standards.",
  };
  return {
    required: [], choices: [], verified: false, source: null,
    explanation: "Your state or territory has its own home education rules. Side-Quest has not verified an exhaustive stage-specific compulsory-subject checklist here, so we will not label particular subjects mandatory. Use the official registration and curriculum links below to confirm your plan.",
  };
}

const STAGES = [
  ["ES1", "Kindergarten / Foundation equivalent (NSW Early Stage 1)"],
  ["S1", "Years 1–2 (NSW Stage 1)"],
  ["S2", "Years 3–4 (NSW Stage 2)"],
  ["S3", "Years 5–6 (NSW Stage 3)"],
  ["S4", "Years 7–8 (NSW Stage 4)"],
  ["S5", "Years 9–10 (NSW Stage 5)"],
  ["S6", "Years 11–12 (NSW Stage 6)"],
];
export default function ChildLearningRequirements({ jurisdiction, guide, student }) {
  const [stage, setStage] = useState(student?.stage || "S2");
  const [selected, setSelected] = useState(Array.isArray(student?.compass_areas) ? student.compass_areas : []);
  const [saving, setSaving] = useState(false);
  const [age, setAge] = useState("");
  const result = useMemo(() => requirementsFor(jurisdiction, stage), [jurisdiction, stage]);
  const chosenAreas = new Set(selected);
  const choiceSatisfied = !result.chooseCount || chosenAreas.size >= result.chooseCount;
  const canSave = jurisdiction === "NSW" && ["S4", "S5"].includes(stage) && student?.id && stage === student.stage;
  const saveChoices = async () => {
    setSaving(true);
    try { await api.put(`/students/${student.id}`, { compass_areas: selected }); toast.success("Learning-area choices saved to this child"); }
    catch (err) { toast.error(apiErrorMessage(err)); }
    finally { setSaving(false); }
  };
  return <section className="paper-card p-5 sm:p-6 space-y-4" aria-labelledby="learning-requirements-heading" data-testid="compass-learning-requirements">
    <div>
      <h2 id="learning-requirements-heading" className="font-display text-2xl font-bold text-emerald-950">Which subjects does my child need?</h2>
      <p className="text-sm text-stone-700 mt-2">See mandatory learning areas and how many additional subject choices are required. This is not an outcome checklist or government approval.</p>
    </div>
    <div className="grid sm:grid-cols-2 gap-3">
      <label className="text-sm font-semibold">Age (optional)
        <input className="input mt-1" type="number" min="3" max="21" value={age} onChange={e => setAge(e.target.value)} placeholder="For your own reference" />
      </label>
      <label className="text-sm font-semibold">Intended learning stage / year
        <select className="input mt-1" value={stage} onChange={e => { setStage(e.target.value); setSelected([]); }}>
          {STAGES.map(([value, name]) => <option key={value} value={value}>{name}</option>)}
        </select>
      </label>
    </div>
    {student && <p className="text-xs text-stone-600">Looking at {student.name}'s requirements. Their saved profile currently uses {student.stage || "an unspecified stage"}; changing this guide does not change their profile.</p>}
    {age && <p className="text-xs text-stone-600">Age {age} does not automatically determine the appropriate learning stage. Parents can plan with their child's needs and discuss the proposed level with the registering authority.</p>}
    <div className="rounded-xl bg-stone-50 border border-stone-200 p-4">
      <p className="text-sm leading-relaxed">{result.explanation}</p>
      {result.verified && result.required.length > 0 ? <>
        <h3 className="font-bold text-emerald-950 mt-4 mb-2">{jurisdiction === "VIC" ? "Eight learning areas to address" : "Mandatory learning areas"}</h3>
        <ul className="grid sm:grid-cols-2 gap-2">{result.required.map(s => <li key={s} className="text-sm flex items-start gap-2"><span aria-hidden="true" className="text-emerald-700">✓</span>{s}</li>)}</ul>
      </> : result.verified ? <p className="text-sm font-semibold mt-3 text-emerald-950">This level has no fixed compulsory subject list in the cited home education guidance.</p> : <p className="text-sm font-semibold mt-3 text-amber-900">This jurisdiction or stage needs an authority-verified mandatory/choice breakdown.</p>}
      {result.verified && result.choices.length === 0 && <p className="text-xs text-stone-600 mt-3">No fixed minimum number of additional elective subjects is specified in the cited home education guidance. Other learning opportunities can still be included.</p>}
      {result.optional?.length > 0 && <><h3 className="font-bold text-emerald-950 mt-4 mb-2">Optional subjects (no set minimum)</h3><ul className="grid sm:grid-cols-2 gap-2">{result.optional.map(item => <li key={item} className="text-sm">• {item}</li>)}</ul></>}
      {result.choices.length > 0 && <>
        <h3 className="font-bold text-emerald-950 mt-4">Select at least {result.chooseCount} additional learning areas</h3>
        <p className="text-xs text-stone-600 mb-2">{result.choicesNote}</p>
        <div className="grid sm:grid-cols-2 gap-2">{result.choices.map(s => <label key={s} className="flex gap-2 items-center text-sm"><input type="checkbox" checked={chosenAreas.has(s)} onChange={e => setSelected(old => e.target.checked ? [...old, s] : old.filter(x => x !== s))}/>{s}</label>)}</div>
        <p role="status" className="text-sm mt-3">{choiceSatisfied ? "✓ Minimum learning-area selection met. Choose specific syllabuses on the child profile." : `${chosenAreas.size} of ${result.chooseCount} additional learning areas selected.`}</p>
        {canSave && <button type="button" onClick={saveChoices} disabled={!choiceSatisfied || saving} className="rounded-xl bg-emerald-900 text-white text-sm font-bold px-4 py-2 disabled:opacity-50 mt-2">{saving ? "Saving…" : "Save these learning-area choices for this child"}</button>}
        {!canSave && <p className="text-xs text-stone-600 mt-2">Save subject choices on the child profile; this checklist does not change their stage.</p>}
      </>}
      {jurisdiction === "NSW" && result.verified && !result.choices.length && <p className="text-xs mt-3">Optional: Languages. You can combine several learning areas in a project while recording the relevant learning.</p>}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        {result.source && <a className="font-semibold underline text-emerald-800" href={result.source} target="_blank" rel="noopener noreferrer">Read official requirements ↗</a>}
        {result.detailed_subjects_url && <a className="font-semibold underline text-emerald-800" href={result.detailed_subjects_url} target="_blank" rel="noopener noreferrer">NT Transition–Year 10 subject guide (Word document) ↗</a>}
        <Link to="/parent/children" className="font-semibold underline text-emerald-800">Review child's stage and subjects</Link>
        <span className="text-stone-600">Learning-plan creation is a separate paid Side-Quest service.</span>
      </div>
    </div>
    <p className="text-xs text-stone-600">For NSW Stage 4–5, use Save to store the selected learning areas on this child’s profile; this does not select specific syllabuses or overwrite existing subjects. For other jurisdictions and stages, the checklist is informational only. This checklist is a guide to planning, not evidence that a registration application meets the rules. Senior courses, exemptions, age eligibility, implementation dates and special pathways may require individual advice. Confirm details with {guide?.authority || "your registration authority"}.</p>
  </section>;
}
