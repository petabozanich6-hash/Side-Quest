#!/usr/bin/env python3
"""Year 7 English Written Core batch 14: w40 (4)."""
from english_y7_support import L, pair_visual, write_batch

LESSONS = [
L('s4-eng-y7-w40-l1', 'EN4-RVL-01', ['year 7 reading reflection', 'evidence', 'purpose', 'audience check'],
  'Year 7 students learn year 7 reading reflection through explicit strategy, worked examples and evidence-based practice. Identify purpose and audience, apply a clear process, check work against criteria and explain choices with textual or factual support. Keep school-safe topics; credit sources; do not invent NESA content points beyond catalogue codes.',
  'Example: In a classroom task on year 7 reading reflection, Sam names the purpose, lists two success criteria, works a short model with annotated steps, then checks a peer sample against the same criteria. Evidence is quoted or paraphrased accurately; fixes are specific.',
  'You are practising year 7 reading reflection. State the purpose, list two criteria and complete one guided example with a because-explanation.',
  'Strong answer: Purpose clear; criteria fit the skill; explanation uses evidence, not vague praise. Weak answers skip criteria or invent unsupported claims.',
  'Thinking year 7 reading reflection is only talent or first-draft luck. Explicit process, evidence and revision produce reliable Year 7 work.',
  'Independently complete a substantial task on year 7 reading reflection for a real classroom audience: plan, draft or perform as required, include evidence or sources where relevant, self-check against three criteria and write a five-sentence reflection naming one strength and one next goal.'),
L('s4-eng-y7-w40-l2', 'EN4-ECA-01', ['portfolio selection and refl', 'evidence', 'purpose', 'audience check'],
  'Year 7 students learn portfolio selection and reflection through explicit strategy, worked examples and evidence-based practice. Identify purpose and audience, apply a clear process, check work against criteria and explain choices with textual or factual support. Keep school-safe topics; credit sources; do not invent NESA content points beyond catalogue codes.',
  'Example: In a classroom task on portfolio selection and reflection, Sam names the purpose, lists two success criteria, works a short model with annotated steps, then checks a peer sample against the same criteria. Evidence is quoted or paraphrased accurately; fixes are specific.',
  'You are practising portfolio selection and reflection. State the purpose, list two criteria and complete one guided example with a because-explanation.',
  'Strong answer: Purpose clear; criteria fit the skill; explanation uses evidence, not vague praise. Weak answers skip criteria or invent unsupported claims.',
  'Thinking portfolio selection and reflection is only talent or first-draft luck. Explicit process, evidence and revision produce reliable Year 7 work.',
  'Independently complete a substantial task on portfolio selection and reflection for a real classroom audience: plan, draft or perform as required, include evidence or sources where relevant, self-check against three criteria and write a five-sentence reflection naming one strength and one next goal.'),
L('s4-eng-y7-w40-l3', 'EN4-ECB-01', ['year 7 language and spelling', 'evidence', 'purpose', 'audience check'],
  'Year 7 students learn year 7 language and spelling check through explicit strategy, worked examples and evidence-based practice. Identify purpose and audience, apply a clear process, check work against criteria and explain choices with textual or factual support. Keep school-safe topics; credit sources; do not invent NESA content points beyond catalogue codes.',
  'Example: In a classroom task on year 7 language and spelling check, Sam names the purpose, lists two success criteria, works a short model with annotated steps, then checks a peer sample against the same criteria. Evidence is quoted or paraphrased accurately; fixes are specific.',
  'You are practising year 7 language and spelling check. State the purpose, list two criteria and complete one guided example with a because-explanation.',
  'Strong answer: Purpose clear; criteria fit the skill; explanation uses evidence, not vague praise. Weak answers skip criteria or invent unsupported claims.',
  'Thinking year 7 language and spelling check is only talent or first-draft luck. Explicit process, evidence and revision produce reliable Year 7 work.',
  'Independently complete a substantial task on year 7 language and spelling check for a real classroom audience: plan, draft or perform as required, include evidence or sources where relevant, self-check against three criteria and write a five-sentence reflection naming one strength and one next goal.'),
L('s4-eng-y7-w40-l4', 'EN4-URA-01', ['reflection and celebration', 'evidence', 'purpose', 'audience check'],
  'Year 7 students learn reflection and celebration through explicit strategy, worked examples and evidence-based practice. Identify purpose and audience, apply a clear process, check work against criteria and explain choices with textual or factual support. Keep school-safe topics; credit sources; do not invent NESA content points beyond catalogue codes.',
  'Example: In a classroom task on reflection and celebration, Sam names the purpose, lists two success criteria, works a short model with annotated steps, then checks a peer sample against the same criteria. Evidence is quoted or paraphrased accurately; fixes are specific.',
  'You are practising reflection and celebration. State the purpose, list two criteria and complete one guided example with a because-explanation.',
  'Strong answer: Purpose clear; criteria fit the skill; explanation uses evidence, not vague praise. Weak answers skip criteria or invent unsupported claims.',
  'Thinking reflection and celebration is only talent or first-draft luck. Explicit process, evidence and revision produce reliable Year 7 work.',
  'Independently complete a substantial task on reflection and celebration for a real classroom audience: plan, draft or perform as required, include evidence or sources where relevant, self-check against three criteria and write a five-sentence reflection naming one strength and one next goal.'),
]

VISUALS = {
 's4-eng-y7-w40-l1': [pair_visual('Teach','what/why/how','Model','worked example','Year 7 reading reflection.','See the process.'),
  pair_visual('Practise','guided then independent','Reflect','criteria check','Learning loop.','Evidence over guess.')],
 's4-eng-y7-w40-l2': [pair_visual('Teach','what/why/how','Model','worked example','Portfolio selection and reflection.','See the process.'),
  pair_visual('Practise','guided then independent','Reflect','criteria check','Learning loop.','Evidence over guess.')],
 's4-eng-y7-w40-l3': [pair_visual('Teach','what/why/how','Model','worked example','Year 7 language and spelling check.','See the process.'),
  pair_visual('Practise','guided then independent','Reflect','criteria check','Learning loop.','Evidence over guess.')],
 's4-eng-y7-w40-l4': [pair_visual('Teach','what/why/how','Model','worked example','Reflection and celebration.','See the process.'),
  pair_visual('Practise','guided then independent','Reflect','criteria check','Learning loop.','Evidence over guess.')],
}

def create():
    write_batch(LESSONS, VISUALS, expected_count=4)

if __name__ == '__main__':
    create()
