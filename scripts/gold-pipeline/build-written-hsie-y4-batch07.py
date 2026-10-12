#!/usr/bin/env python3
"""Year 4 HSIE Written Core batch 07: w37-l1 through w40-l2 (8). Inquiry close + reflection."""
from hsie_y4_support import L, pair_visual, write_batch

HIS = 'HS2-HIS-01'

LESSONS = [
L('s2-hsie-y4-w37-l1', HIS, ['source', 'evaluate', 'reliable', 'useful'],
  'Finding and evaluating sources asks who made them, when, why and whether they help answer the inquiry question. For First Nations topics, prefer First Nations-authored or Community-approved published materials.',
  'Example checklist: author, date, purpose, primary/secondary, useful for question?, gaps. Discard anonymous unsourced claims.',
  'Which is more useful for a First Nations land-care question: an anonymous blog, or a published Indigenous ranger education page?',
  'Published Indigenous ranger education page.',
  'Using the first search hit without checking the author risks error and disrespect.',
  'Find four sources for your inquiry. Complete an evaluation table and keep the best three. Note any Community verification still needed.'),
L('s2-hsie-y4-w37-l2', HIS, ['organise', 'note', 'category', 'quote'],
  'Organising information uses categories, note cards and clear quote marks. Paraphrase in your own words; credit every source.',
  'Example: digital or paper cards tagged cause / effect / perspective / FN protocol note. Quotes under 15 words with citation.',
  'Fix this note crime: pasted paragraph, no author, presented as your writing.',
  'Paraphrase, add author/title/date, use quotes only for exact words.',
  'Mixing all notes in one blob makes the presentation chaotic.',
  'Organise notes into four categories with source codes. Prepare a quote bank of three short cited quotes maximum.'),
L('s2-hsie-y4-w38-l1', HIS, ['analyse', 'conclude', 'evidence', 'limit'],
  'Analysing and drawing conclusions means answering the inquiry question with evidence sentences and naming limits, including whose voices are missing.',
  'Example conclusion frame: “The sources show… because… A limit is… First Nations perspectives were / were not available in our sources…”',
  'Why name missing voices in a conclusion?',
  'It keeps the answer honest and shows what still needs respectful research.',
  'A conclusion with no evidence is only an opinion.',
  'Write a draft conclusion (8–12 sentences) with at least four evidence links and one limit. Peer check for invented claims.'),
L('s2-hsie-y4-w38-l2', HIS, ['presentation', 'visual', 'script', 'credit'],
  'Creating a presentation organises the inquiry story: question, sources, findings, conclusion, credits and thanks. Visuals support evidence; they do not replace it.',
  'Example slide/card order: question → map/timeline → three findings → conclusion → source list → Acknowledgement if appropriate to school protocol.',
  'List five sections every inquiry presentation should include.',
  'Question; findings/evidence; conclusion; sources; (and typically method or limits) — accept clear five.',
  'Decorative slides with no sources fail the history purpose.',
  'Build presentation cards/slides with a visible source list. Script 2–3 minutes. Include respect credit for any First Nations content.'),
L('s2-hsie-y4-w39-l1', HIS, ['rehearse', 'timer', 'feedback', 'clear'],
  'Practising the presentation uses a timer, clear voice, pointing to evidence and feedback on respect and accuracy.',
  'Example rehearsal checklist: eye contact, pace, evidence pointed to, source named aloud, no invented FN details.',
  'Give two feedback comments that improve accuracy/respect, not only “speak louder”.',
  'e.g. “Name your source when you show the quote”; “Remove the guessed Nation name”.',
  'Reading every word in a tiny font without looking up loses the audience.',
  'Rehearse twice with a peer timer. Record two feedback fixes and apply them.'),
L('s2-hsie-y4-w39-l2', HIS, ['present', 'audience', 'question', 'evidence'],
  'Presenting the inquiry means speaking to the audience, answering questions with evidence and thanking helpers, including any Aboriginal educators consulted.',
  'Example Q&A: “How do you know?” → point to source card. If unsure about a Community detail, say what still needs verification.',
  'Practise answering: “Did you invent any First Nations details?” with an honest protocol reply.',
  'e.g. “No — we used published/Community sources only and tagged what needs local verification.”',
  'Guessing an answer when you have no evidence breaks trust.',
  'Deliver the presentation. Log two audience questions with evidence-based answers. Write thank-you notes as needed.'),
L('s2-hsie-y4-w40-l1', HIS, ['reflect', 'skill', 'strand', 'growth'],
  'Stage 2 HSIE reflection names growth across history, geography, civics and respectful First Nations learning, with evidence from real tasks.',
  'Example frames: I can now evaluate sources…; I used to invent… now I check Community/published sources…; Next I will…',
  'Write one growth statement about respectful First Nations learning with evidence.',
  'Any honest evidenced statement about sources/protocols.',
  'Vague “I got better at HSIE” without examples is weak.',
  'Complete a reflection matrix across history, geography, civics and First Nations respect — strength + next step each.'),
L('s2-hsie-y4-w40-l2', HIS, ['celebrate', 'thanks', 'goal', 'share'],
  'Celebration recognises inquiry strategies, teamwork and respectful habits — and thanks people who helped, including First Nations educators when involved. Set one forward goal.',
  'Example celebration card: strategy (source evaluation), evidence (inquiry grade/feedback), thanks, next goal (local history with Community guidance).',
  'Name one strategy worth celebrating and one specific next goal.',
  'Any strategy + actionable goal pair.',
  'Only ranking who “won” HSIE ignores learning processes.',
  'Write and share a celebration card: strategy, evidence, thanks, next goal. Prefer process over prizes.'),
]

VISUALS = {
 's2-hsie-y4-w37-l1': [pair_visual('Evaluate', 'author date purpose', 'Prefer', 'FN-authored when topic FN', 'Finding sources.', 'Skip anonymous claims.'),
  pair_visual('Four sources', 'keep three', 'Risk', 'first hit only', 'Evaluation table.', 'Verification tags.')],
 's2-hsie-y4-w37-l2': [pair_visual('Categories', 'note cards', 'Quotes', 'short + cited', 'Organising information.', 'Paraphrase default.'),
  pair_visual('Four categories', 'quote bank', 'Risk', 'paste as own writing', 'Organised notes.', 'Source codes.')],
 's2-hsie-y4-w38-l1': [pair_visual('Evidence sentences', 'answer question', 'Limits', 'missing voices', 'Conclusions.', 'No evidence = opinion only.'),
  pair_visual('Draft conclusion', 'peer check', 'Risk', 'invented claims', 'Evidence-rich conclusion.', 'Four evidence links.')],
 's2-hsie-y4-w38-l2': [pair_visual('Story order', 'question→credits', 'Visuals', 'support evidence', 'Creating presentations.', 'Sources visible.'),
  pair_visual('Script 2–3 min', 'FN credits', 'Risk', 'decoration only', 'Slides + script.', 'Respect credits.')],
 's2-hsie-y4-w39-l1': [pair_visual('Rehearse', 'timer + checklist', 'Feedback', 'accuracy/respect', 'Practising presentations.', 'Fix guessed Nation names.'),
  pair_visual('Two rehearsals', 'apply fixes', 'Risk', 'read tiny font only', 'Peer-timed practice.', 'Two fixes logged.')],
 's2-hsie-y4-w39-l2': [pair_visual('Present', 'evidence answers', 'Honest', 'verification limits', 'Inquiry presentation.', 'No guessing.'),
  pair_visual('Q&A log', 'thank-yous', 'Risk', 'invent under pressure', 'Live present.', 'Two Q answered.')],
 's2-hsie-y4-w40-l1': [pair_visual('Growth', 'with evidence', 'FN respect', 'protocol habit', 'Year reflection.', 'Examples required.'),
  pair_visual('Matrix', 'four strands', 'Risk', 'vague better', 'Reflection matrix.', 'Next steps each.')],
 's2-hsie-y4-w40-l2': [pair_visual('Celebrate', 'strategy', 'Thanks', 'educators helpers', 'Celebration close.', 'Process over trophies.'),
  pair_visual('Card', 'goal forward', 'Risk', 'only who won', 'Shared celebration.', 'Thanks included.')],
}


def create():
    write_batch(LESSONS, VISUALS, expected_count=8)


if __name__ == '__main__':
    create()
