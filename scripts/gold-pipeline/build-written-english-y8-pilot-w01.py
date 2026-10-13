#!/usr/bin/env python3
"""Parallel-worker pilot: Y8 English w01 (2 lessons) into worker inbox."""
import argparse
from pathlib import Path

from english_y8_support import L, pair_visual, write_batch, URA, ECA

LESSONS = [
L('s4-eng-y8-w01-l1', URA, ['narrator', 'reliability', 'evidence', 'perspective'],
  'Evaluating a narrator’s reliability means testing whether the storyteller’s account can be trusted in this text. Readers weigh what the narrator says against what the narrator does, what other characters reveal and what the narrative voice withholds. A strong judgement cites short evidence and explains the effect on the reader—not a label such as “unreliable” with no proof.',
  'Extract: “I never panic,” Mara insisted, while the unlocked side gate stood open behind her and her hands shook on the display board. Claim: Mara’s self-assessment is shaky. Evidence: the contrast between “never panic” and shaking hands / overlooked open gate. Explanation: the mismatch invites readers to question how accurately Mara reads her own situation.',
  'In two or three sentences, judge the narrator’s or focaliser’s reliability in a short extract you are reading. Quote or closely paraphrase one detail and explain how it supports your judgement.',
  'Strong answer: names a reliability judgement, cites a concrete detail (speech vs action, omission, exaggeration) and explains the reader effect.',
  'Calling every first-person narrator “unreliable” automatically, or inventing backstory that is not in the text.',
  'Independently annotate a new page: mark two reliability cues, write a paragraph judgement with embedded evidence, and add one sentence on how the judgement changes (or does not change) your sympathy for the character.'),
L('s4-eng-y8-w01-l2', ECA, ['perspective', 'rewrite', 'voice', 'purpose'],
  'Rewriting a scene from another perspective shifts pronoun system, knowledge limits and emphasis while keeping core events recognisable. Year 8 writers choose what the new focaliser can know, what they notice first and which words carry their attitude. The rewrite should serve a clear purpose (sympathy, tension, comedy) rather than only swapping names.',
  'Original (Mara): “The door would not move. Warm light spilled from the side entrance.” Rewrite (Jordan, staff): “I propped the side door and watched a student shove the locked front entrance as if force could change the timetable.” Same blocked front door; different knowledge and attitude.',
  'Rewrite four to six lines of a studied scene from a different character’s perspective. Keep two facts constant; change pronoun/knowledge and one attitude word.',
  'Strong answer: events stay aligned; voice and knowledge clearly belong to the new focaliser; purpose of the shift is visible.',
  'Changing the plot entirely, or writing the new voice as a copy of the original with only the name replaced.',
  'Independently produce a polished rewrite (120–180 words) plus a three-sentence craft reflection: what stayed constant, what the new voice noticed first, and how reader sympathy shifted.'),
]

VISUALS = {
 's4-eng-y8-w01-l1': [pair_visual('Says', 'I never panic', 'Shows', 'shaking hands',
    'Speech versus action as reliability cue.', 'Cite the mismatch.'),
  pair_visual('Judgement', 'self-assessment shaky', 'Effect', 'reader doubts Mara',
    'Reliability claim with reader effect.', 'No invented backstory.')],
 's4-eng-y8-w01-l2': [pair_visual('Constant', 'blocked front door', 'Shift', 'Jordan’s knowledge',
    'Perspective rewrite keeps core facts.', 'Change noticing and attitude.'),
  pair_visual('Purpose', 'tension / sympathy', 'Avoid', 'name-only swap',
    'Rewrite serves a purpose.', 'Voice must change.')],
}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--out-dir', type=Path, required=True)
    args = parser.parse_args()
    write_batch(LESSONS, VISUALS, expected_count=2, out_dir=args.out_dir, label='Y8 English')


if __name__ == '__main__':
    main()
