import React from "react";

export default function PrintableResource({ resource }) {
  if (!resource) return null;
  return <section className="rounded-xl border p-4 bg-white" data-testid="printable-resource">
    <h3 className="font-bold">{resource.title}</h3>
    <p className="mt-2 text-sm">{resource.instructions}</p>
    <p className="mt-3 whitespace-pre-wrap leading-relaxed">{resource.passage}</p>
    <ul className="mt-3 list-disc pl-5 text-sm">{(resource.prompts || []).map((prompt) => <li key={prompt}>{prompt}</li>)}</ul>
    <p className="mt-2 text-sm">Use Print at Hand it in for this sheet and the lesson, or copy these prompts onto paper.</p>
  </section>;
}
