// Combine independently rendered, child-specific Side-Quest HTML documents into
// one print-ready family PDF without storing any children's answers.
// Each learner begins on a new page and retains the full branded layout.
export function combineFamilyPlanHtml(pages: string[]): string {
  if (!Array.isArray(pages) || pages.length < 2 || pages.length > 5) {
    throw new Error("Choose between two and five learner plans.");
  }
  const head = pages[0].match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
  if (!head) throw new Error("Invalid family document layout.");
  const bodies = pages.map((page) => {
    const body = page.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1];
    if (!body) throw new Error("Invalid learner document layout.");
    return body;
  });
  return '<!doctype html><html lang="en"><head>' + head
    + '<style>.family-learner-page{break-before:page;page-break-before:always}</style></head><body>'
    + bodies.map((body, index) => '<main class="' + (index ? 'family-learner-page' : '') + '">' + body + '</main>').join('')
    + '</body></html>';
}
