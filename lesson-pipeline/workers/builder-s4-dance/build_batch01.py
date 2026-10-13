#!/usr/bin/env python3
"""Year 7 Dance Written Core, batch 01 (builder-s4-dance).

Twelve lessons on body, time, space, dynamics, relationships, motif, phrase,
performance quality and safe practice. Movement is optional, pain-free and
adult-supervised. Written plans are acceptable evidence.

This script only authors draft bundles. It does not certify educational
quality or NESA alignment.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / 'scripts/gold-pipeline'))

from elective_batch import write_elective_batch  # noqa: E402
from written_bundle import pair_visual  # noqa: E402

CODE = 'DA4-PER-01'
SOURCE = 'https://curriculum.nsw.edu.au/learning-areas/creative-arts/dance-7-10-2023/outcomes'
SOURCE_NOTE = (
    'Proposed Stage 4 alignment to Dance 7–10 (2023) outcome DA4-PER-01. '
    'Content-point mapping pending. Not NESA verified. Movement is optional, '
    'pain-free, and adult-supervised. Written plans are acceptable evidence.'
)
OUT = Path(__file__).resolve().parent / 'authored'

SEEDS = [
    's5-dance-y9-w01-l1',
    's5-dance-y9-w01-l2',
    's5-dance-y9-w02-l1',
    's5-dance-y9-w02-l2',
    's5-dance-y9-w03-l1',
    's5-dance-y9-w03-l2',
    's5-dance-y9-w04-l1',
    's5-dance-y9-w04-l2',
    's5-dance-y9-w05-l1',
    's5-dance-y9-w05-l2',
    's5-dance-y9-w06-l1',
    's5-dance-y9-w06-l2',
]


def L(seed, vocab, principle, model, guided, feedback, misconception, independent):
    if len(vocab) != 4:
        raise ValueError(f'{seed}: need exactly 4 vocab words')
    return dict(
        seed_key=seed,
        code=CODE,
        subject='arts',
        vocab=vocab,
        principle=principle,
        model=model,
        guided=guided,
        feedback=feedback,
        misconception=misconception,
        independent=independent,
    )


def V(left_title, left_text, right_title, right_text, alt, caption):
    for label in (left_title, right_title):
        if len(label) > 28:
            raise ValueError(f'Visual title too long ({len(label)}): {label}')
    for label in (left_text, right_text):
        if len(label) > 42:
            raise ValueError(f'Visual line too long ({len(label)}): {label}')
    return pair_visual(left_title, left_text, right_title, right_text, alt, caption)


LESSONS = [
    L(
        SEEDS[0],
        ['a warm-up', 'a clear pathway', 'safe travel', 'spacing'],
        'A warm-up prepares joints and attention before dancers travel through a shared studio. '
        'Its purpose is to wake ankles, knees, hips and shoulders with small, comfortable movements, '
        'not to force a stretch or win a race. After that, a pathway is the route a body takes. '
        'A clear pathway curves around other people so shoulders and outstretched arms stay in personal space. '
        'Cutting straight across someone who is already moving is a collision, not a dance idea. '
        'Draw the route if you would rather not travel. If you do move, an adult stays nearby, the floor is clear, '
        'and you stop at the first twinge.',
        'Mina circles her ankles and shoulders, then walks a wide curve that stays a full arm span from Sam. '
        'She spends about two minutes on easy joint circles and one soft balance before any travel. '
        'She does not sprint, and she does not slice between two people who are already walking. '
        'Leo, working on paper, draws dotted curves around two crosses that stand for other dancers and labels '
        'the start of the curve "warm-up done". Both examples separate preparation from travel and keep a gap.',
        'Priya enters a shared studio and immediately runs on a diagonal through two classmates who are already walking. '
        'What should change in her warm-up and her pathway, and what would personal space look like in that room?',
        'Priya should warm her joints first, then walk a curve outside the other dancers\' arm span. '
        'The diagonal run skips preparation and crosses pathways that are already in use, so a bump is likely. '
        'Personal space means her body and her outstretched arms do not enter the gap those dancers need. '
        'A labelled drawing of the curve is a complete answer if she does not want to travel.',
        'A warm-up is only toe-touching, and the fastest straight line is always the best pathway. '
        'That belief skips joint readiness and treats other dancers as obstacles to beat. '
        'A useful warm-up is small circles and easy walking you can do without strain. '
        'The safer pathway is the clear one, even when it is longer than the diagonal.',
        'On a new floor sketch, draw a curved pathway around three dancers and mark where the warm-up happens. '
        'Use a rectangular room, not Mina\'s open curve, and star one place you would pause so arm spans do not overlap. '
        'Name the joints the warm-up would include. Travelling the route is optional and only with an adult nearby.',
    ),
    L(
        SEEDS[1],
        ['duration', 'slow movement', 'quick movement', 'time choice'],
        'Duration is how long a movement lasts, and a slow or quick choice changes the meaning. '
        'Slow movement can feel careful, heavy or sad because the audience has time to notice each part. '
        'Quick movement can feel urgent, playful or startled because the action arrives and vanishes. '
        'The same reach is a different idea if it fills four counts or only one. '
        'Dancers choose duration on purpose, then say what that length communicates. '
        'You can clap or write the counts if you would rather not move.',
        'A reach toward a window that fills four slow counts reads as careful searching, not as an alarm. '
        'Ari keeps the arm path identical and performs, or writes, the same reach in one quick count, which reads as sudden alarm. '
        'Because the shape did not change, the audience can tell that duration carried the new meaning. '
        'Ari\'s chart says: counts 1-4 slow reach means searching; count 1 quick reach means alarm.',
        'A dancer steps toward a closed door. Version A uses four slow steps. Version B uses four quick steps in the same direction. '
        'What different meaning does each duration suggest, and which clue shows that time, not a new step, made the change?',
        'Slow steps toward the door suggest caution, while the same quick steps suggest urgency. '
        'The clue is that direction and step shape stayed the same, so duration is the element that changed the meaning. '
        'Naming "slow" or "quick" without a meaning only describes the clock. '
        'A count chart is enough if you do not step the phrase.',
        'Moving faster always makes a dance better, because speed is treated only as a fitness score. '
        'Duration is a meaning choice, not a ranking. A slow walk can be the stronger choice when the idea is waiting. '
        'Quicker is not automatically more skilled, and slower is not automatically weaker.',
        'Write two timings for a new head turn, with a different meaning for the slow version and the quick version. '
        'Use counts, and do not reuse the window reach or the door walk. '
        'Trying the timings is optional, gentle, and only with an adult nearby.',
    ),
    L(
        SEEDS[2],
        ['level', 'direction', 'high space', 'spatial choice'],
        'Level is the height of the body in space, and direction is the way the body faces or travels. '
        'Low is close to the floor, middle is around standing height, and high reaches above the shoulders. '
        'Direction includes forward, backward, sideways and diagonal. '
        'Changing level or direction gives the audience a new view of the same idea without inventing a new story. '
        'Point to the levels from a chair, or travel only on a clear floor with an adult nearby.',
        'Noor looks for a lost shoe low near the floor, then at middle height beside a table, then high toward a shelf. '
        'The direction changes from forward to sideways so the search covers a new slice of the room. '
        'The idea stays "searching", but each look is a different spatial choice. '
        'A second sketch uses arrows labelled low-forward, middle-sideways and high-backward.',
        'A dancer wants to show "greeting a friend" without repeating one standing wave at middle level. '
        'How could low, middle and high, plus two directions, change what that greeting communicates?',
        'A low secret wave, a middle public hello, and a high call use different levels on purpose. '
        'Facing forward and then sideways shows the friend is not always in the same place. '
        'The levels and directions should match the kind of greeting, not sit on top as decoration. '
        'Describe the greeting from your seat if you do not want to move.',
        'Space in dance means only the size of the room, so level and direction are said to add nothing. '
        'The room is the container. Level and direction are choices inside it. '
        'A high backward step does not communicate the same idea as a low forward step, even in one studio.',
        'Plan a hiding idea that uses a new order of levels and two directions Noor did not use in the shoe search. '
        'State what each level suggests about hiding. '
        'You may point or describe instead of travelling.',
    ),
    L(
        SEEDS[3],
        ['sharp dynamic', 'sustained dynamic', 'movement quality', 'dynamic choice'],
        'Sharp movement has sudden edges, while sustained movement continues smoothly without a jerk. '
        'Dynamics are the quality of the action, and that quality communicates an idea. '
        'A sharp arm can suggest refusal, surprise or a stop signal. '
        'A sustained arm can suggest calm, sadness or patience. '
        'The idea comes from the quality, not from a costume or a louder count. '
        'Write the quality words if you do not perform them.',
        'A sharp head turn that stops at once can clearly say "no" before any words are needed. '
        'Jo then lowers the same head over four even counts, and that sustained path can say "I am listening". '
        'One body part changes only its dynamic, so the audience can see where the idea came from. '
        'Jo labels the sharp version "refusal" and the sustained version "patience".',
        'Two dancers both raise one arm. Dancer A snaps the arm up and freezes. Dancer B lifts the arm in one smooth, even path. '
        'What idea might each dynamic communicate, and what is missing if the note only says "they raised an arm"?',
        'The snapped arm can signal alarm, while the smooth lift can signal ongoing care or a slow greeting. '
        'Writing only "they raised an arm" hides the dynamic, so the audience effect cannot be checked. '
        'Name sharp or sustained and attach one clear idea to each. '
        'A written label is enough evidence.',
        'Any fast movement is called sharp and any slow movement is called sustained, because dynamics are treated as speed. '
        'A slow action can still be sharp if it jerks and stops. '
        'A quick action can be sustained if the path stays smooth. '
        'Quality is the edge and the continuity, not only the clock.',
        'Give one new sideways step a sharp version and a sustained version, each with its own idea. '
        'Do not reuse the head turn or the raised arm. '
        'Describe both versions if you stay seated.',
    ),
    L(
        SEEDS[4],
        ['beside', 'mirroring', 'contrast', 'relationship'],
        'A dance relationship is how one body relates to another body or to an imagined partner. '
        'Beside means sharing a side, with similar facing and a gap so elbows do not collide. '
        'Mirroring means matching the action on the opposite side, like a reflection. '
        'Contrast means a clear difference, such as one dancer still while the other travels. '
        'A real partner is optional. A solo dancer can name where the imagined partner stands and still show their own side of the relationship.',
        'Kai stands beside Ren, both facing a window, with a gap so their elbows never meet. '
        'When they mirror, Kai lifts the right arm and Ren lifts the left arm together. '
        'For contrast, Kai sinks and stays still while Ren walks a slow curve. '
        'If Ren is away, Kai writes "imagined partner on my left" and leaves a visible gap, performing only Kai\'s side.',
        'Describe a four-count relationship study that uses beside, then mirroring, then contrast. '
        'A real partner is optional. If you work alone, how will a viewer still understand the missing partner?',
        'Stand beside with a clear gap, mirror one opposite arm, then contrast by freezing one side. '
        'A solo plan names where the imagined partner stands and which action they would do. '
        'The relationship is the match or the difference, not merely being in a room with someone. '
        'Words plus a simple map are enough.',
        'Relationships cannot be learned without a real partner standing in the room with you today. '
        'Relationship is a choice you can plan and describe. '
        'Naming beside, mirroring or contrast, and showing your own side, is real dance evidence. '
        'No one is required to partner if they need more space.',
        'Plan a four-count goodbye study that uses beside, mirroring and contrast with either a real or an imagined partner. '
        'Keep a gap for personal space, and do not copy the window study. '
        'State which side you would do if you are working alone.',
    ),
    L(
        SEEDS[5],
        ['a motif', 'intent', 'count structure', 'intent match'],
        'A motif is a short movement idea that can be repeated later, and four counts are enough when they share one intent. '
        'Intent is the purpose the movement is trying to show, such as searching. '
        'Each count needs an action that serves that purpose, not a random party step. '
        'After one viewing or one reading, someone else should be able to name the intent. '
        'Notate the four counts if you do not dance them. Any trial stays gentle, with an adult nearby.',
        'A searching motif looks low, reaches, turns the head, and freezes with the hands still open. '
        'Every count serves searching, and the freeze shows the search is not finished. '
        'A different intent, protecting, would close the arms on count 4 instead of leaving them open. '
        'The open hands are the clue that this motif is still looking.',
        'A student writes count 1 step forward, count 2 clap, count 3 spin, count 4 bow, and labels the intent "searching". '
        'Why does this fail as a searching motif, and what is one repair that still uses exactly four counts?',
        'The clap, the spin and the bow fail because those actions do not show looking for something. '
        'A repair keeps four counts but changes them to look, reach, change direction and freeze while still searching. '
        'The word "searching" has to match what the written body actually does. '
        'Changing the label without changing the actions leaves the mismatch in place.',
        'Any four counts are called a motif, even when the separate actions share no purpose at all. '
        'A motif needs a purpose that ties the counts together. '
        'Four unrelated party moves are a list, not a motif. Intent is the thread.',
        'Create a four-count motif with the intent "waiting", using actions that never copy the dropped-key search. '
        'Give each count one action and one sentence on how it shows waiting. '
        'Dancing it is optional and must stay pain-free with an adult nearby.',
    ),
    L(
        SEEDS[6],
        ['repetition', 'variation', 'kept intent', 'level change'],
        'Repeating a motif helps an audience recognise the idea, and a variation changes level or speed while the intent stays. '
        'Variation is not a brand-new dance. If the intent is searching, a lower and slower repeat is still searching. '
        'If the variation becomes a celebration spin, the intent has been lost. '
        'Say which part stayed and which part changed. A two-column chart is acceptable evidence. '
        'Perform the repeat only if the space is clear and an adult is nearby.',
        'The searching actions stay in order: look, reach, turn the head, then freeze at middle height. '
        'Variation A keeps those four actions but drops to a low level and uses slower counts, so the search feels more careful. '
        'Variation B only speeds up a spin and drops the look, so the intent disappears. '
        'The successful variation changes level and speed and keeps the searching actions.',
        'You have a four-count "calling" motif at middle level and medium speed: hand to mouth, step forward, reach high, freeze. '
        'Write one exact repetition and one variation that changes level or speed. What must stay so it is still calling?',
        'Keep the hand-to-mouth call inside the variation, and change only the level or the speed. '
        'The repetition uses the same four actions at the same level and speed so the idea can be recognised. '
        'If the variation removes the call, it is a new idea, not a variation of calling. '
        'Write both versions in counts.',
        'Varying a motif is treated as swapping it for harder steps so the first idea disappears. '
        'A variation changes one element, such as level or speed, and protects the intent. '
        'Being impressive is not the goal. Recognition is. '
        'The audience should still be able to name the original idea.',
        'Show one exact repeat and one level or speed change for a new four-count listening motif of your own. '
        'In two lines, state what stayed and what changed. '
        'Do not reuse the searching actions or the calling motif.',
    ),
    L(
        SEEDS[7],
        ['a phrase', 'a beginning', 'a middle', 'ending stillness'],
        'A phrase needs a beginning, a middle and an end, and stillness can be a chosen ending rather than a mistake. '
        'The beginning introduces the intent. The middle develops it, often with a change of level or direction. '
        'The end resolves it. Holding a clear shape tells the audience the phrase is finished. '
        'Stopping because the next step was forgotten is not the same as choosing stillness. '
        'You can mark the three parts on paper.',
        'A still sideways look begins the searching phrase and makes the intent readable. '
        'The middle travels for four counts and changes from middle height to low. '
        'A held low reach, with the eyes still focused, ends the phrase on purpose. '
        'A weak version wanders off and drops the arms halfway, so the finish looks accidental.',
        'A phrase about arriving home starts with a walk and continues with a turn, then the dancer simply leaves the space. '
        'How would you rewrite the ending so stillness is a choice, and what jobs do the beginning and the middle still need?',
        'Hold a clear doorway shape for two counts so the arrival reads as chosen stillness. '
        'The beginning should show the first sign of arriving, and the middle should develop it with a change of level or direction. '
        'Leaving without a held shape makes the stop look accidental. '
        'Stillness works as an ending when the shape and the focus stay readable.',
        'A phrase must keep moving until the music ends, because any stillness is taken to mean the dancer failed. '
        'Stillness is a movement choice with its own duration. '
        'A held ending can be the strongest close. Endless motion can make a phrase feel unfinished.',
        'Plan a remembering phrase that changes level or direction in the middle and uses stillness on purpose at the end. '
        'Say how many counts each part lasts. Do not copy the searching phrase. '
        'Performing it is optional.',
    ),
    L(
        SEEDS[8],
        ['focus', 'a clear shape', 'performance quality', 'audience reading'],
        'Performance quality is the clarity of focus and finished shapes, not a longer list of steps. '
        'Focus is where the eyes and attention go. A clear shape means the spine, arms and legs finish a position a viewer can read. '
        'Right counts with wandering eyes and half-made arms weaken the idea. '
        'You can mark a focus point with an X on a sketch if you are not performing. '
        'Any performance trial stays inside a clear space with an adult nearby.',
        'Eyes stay on one empty chair during a remembering reach, and the arms finish in a rounded shape rather than collapsing. '
        'The steps are simple, yet remembering still reads because focus and shape agree. '
        'A comparison dancer does those same steps while looking at the floor and letting the wrists flop, and the idea becomes muddy. '
        'The difference is performance quality, not a new step vocabulary.',
        'Two performances use the same four steps for "refusal". Performer 1 looks at one fixed point and finishes each shape. '
        'Performer 2 looks around the room and leaves the elbows unclear. Which has stronger performance quality, and which two details prove it?',
        'Performer 1 is clearer because the eyes stay on one point and each refusal shape is fully finished. '
        'Performer 2 may know the steps, but wandering eyes and unfinished elbows blur the idea. '
        'Steps alone do not carry performance quality. '
        'Name the focus and one finished shape in your answer.',
        'Performance quality is treated as harder steps or a bigger smile, even when the focus and shapes stay unclear. '
        'Difficulty and a smile do not replace a readable idea. '
        'Focus and finished shapes let a simple motif communicate. '
        'A smile that ignores the intent can even contradict it.',
        'For a new curiosity moment, name one focus point and two finished shapes a viewer could read. '
        'Then describe the weaker version of the same steps with lost focus, and say what each version would communicate. '
        'You do not have to perform it.',
    ),
    L(
        SEEDS[9],
        ['alignment', 'a pain signal', 'a footwear check', 'safe setup'],
        'Safe practice means plain alignment, a stop at pain, and a check of footwear and the floor before any movement. '
        'In standing, think of ears, shoulders, ribs and hips stacked, with knees softly bent in the direction of the toes rather than collapsing inward. '
        'Pain is a stop signal, not a target and not proof of effort. '
        'This lesson does not diagnose soreness and does not promise that any exercise is medically safe. '
        'A written safety check is complete evidence. An adult stays nearby if anyone moves.',
        'Sam stacks ribs over hips, keeps knees soft over the toes, and rolls the shoulders gently. '
        'Sam then checks that the floor is dry and clear, and that the shoes are the ones an adult agreed, or bare feet only if that was the plan. '
        'When a knee twinges, Sam stops, sits, and writes the rest of the phrase instead of pushing on. '
        'Nobody in this example claims the warm-up cured anything.',
        'A student locks the knees, lets the ribs sag, wears slippery socks on a dusty floor, and says a sharp knee pain means they should continue. '
        'Which safe-practice repairs should they make, without offering a medical diagnosis?',
        'Soften the knees over the toes, stack the ribs over the hips, and stop if the knee hurts. '
        'Also change slippery socks for agreed shoes, and use a dry, clear floor. '
        'Stop at the sharp knee pain and tell an adult. Do not treat pain as training. '
        'These are practice rules, not a diagnosis or a treatment. '
        'Writing the repairs is the task.',
        'Pain is taken as proof that you are working hard enough, and alignment is treated as a concern only for professionals. '
        'Pain is a reason to stop and tell an adult, not a badge. '
        'Plain alignment helps everyday standing and bending stay organised. '
        'This lesson still does not claim to treat soreness.',
        'Write a lounge-room check for alignment, a pain stop, footwear, and three floor hazards. '
        'Name the hazards you would remove. Do not copy Sam\'s studio list, and state that the check is not medical advice. '
        'Movement stays optional.',
    ),
    L(
        SEEDS[10],
        ['element vocabulary', 'audience effect', 'a dance description', 'evidence'],
        'A useful description names dance elements and the effect those choices have on an audience. '
        'Elements from this unit include pathway, duration, level, direction, dynamic, relationship, motif, phrase, focus and stillness. '
        'A strong description says what could be seen and what that choice helps a viewer understand or feel. '
        '"It was good" does not name an element, so another person cannot check it. '
        'Describe a moment you watched, remembered or planned on paper.',
        'A dancer sinks on a slow sustained path to a low level and holds stillness while looking at an empty chair. '
        'Element vocabulary: low level, slow duration, sustained dynamic, focus and ending stillness. '
        'Audience effect: the slowness and the held look make waiting feel unfinished, so viewers stay with the chair too. '
        'The note never stops at "it was emotional".',
        'A classmate only writes that the dance was nice and that the person moved a lot. '
        'How would you rewrite a sharp, high, quick reach that then freezes, using three element words and one audience effect?',
        'Name the high level, the quick time and the sharp stop, then say the freeze lets the audience catch the call. '
        '"Nice" and "moved a lot" hide which elements did the work. '
        'Three element names plus one effect are enough for a checkable description. '
        'You are describing, not scoring talent.',
        'Words such as amazing or boring are treated as better description than the names of dance elements. '
        'Talent words skip the evidence. An audience effect has to be tied to a visible choice, such as a low level or a sharp stop. '
        'Otherwise the comment cannot be checked or improved.',
        'Describe a new moment you invent, not the empty-chair hold and not the high reach. '
        'Use at least four element words and explain one audience effect for each of two choices. '
        'Write in full sentences a viewer could check against the plan.',
    ),
    L(
        SEEDS[11],
        ['a phrase plan', 'count structure', 'dynamic choice', 'intent repair'],
        'A phrase plan on paper records counts, level, dynamic and intent before any optional dancing. '
        'The plan is the evidence. A common failure is a list of steps with no intent, or an intent the counts do not show. '
        'Repair means changing the actions or the words until they match. '
        'Dancing the phrase is optional, stays pain-free, and happens only with an adult nearby. '
        'Eight counts are enough for a beginning, a middle and an end.',
        'Counts 1-8 of finding use a low look, a sharp head turn, slow travel and searching stillness. '
        'Counts 1-2 are a low sustained look, and counts 3-4 are a middle-level sharp head turn. '
        'Counts 5-6 are slow forward travel. Counts 7-8 are stillness with the eyes still searching. '
        'Level, dynamic and intent are all written, and every pair of counts still looks for something. '
        'A weak plan that only says "spin, jump, pose" under the title "finding" needs repair because nothing searches.',
        'A plan says the intent is "calming", but the counts are a high sharp clap, a run forward, a quick arm shake and a bow. '
        'What is the mismatch, and how would you repair the plan on paper without adding a fifth count?',
        'Repair the four counts into a sustained arm lower, a slow sway and a still ending. '
        'The mismatch is that calming was written above actions that never settle. '
        'After the repair, the intent word and the dynamics agree. '
        'Do not add counts. Repair the four that are there.',
        'Writing the intent word at the top is treated as finishing the plan, even when every count shows a different idea. '
        'The heading is not evidence by itself. Each count has to be able to serve the intent. '
        'A mismatch between the title and the actions is the error this lesson asks you to repair.',
        'Write an eight-count deciding plan, then repair one mismatched version in two sentences. '
        'Do not reuse finding or calming. Performing the phrase is optional.',
    ),
]

VISUALS = {
    SEEDS[0]: [
        V(
            'Cold start', 'Travel before joints wake',
            'Warm then travel', 'Circles, then a clear curve',
            'Two panels contrast travelling before the joints are awake with joint circles followed by a clear curve.',
            'A warm-up readies attention and joints before a dancer travels a clear pathway.',
        ),
        V(
            'Crossing path', 'Cuts through other dancers',
            'Clear pathway', 'Curves around their arm span',
            'Two panels contrast a route that cuts through other dancers with a curve that stays outside their arm span.',
            'A clear pathway bends around other people so bodies do not collide in a shared space.',
        ),
    ],
    SEEDS[1]: [
        V(
            'Speed as a score', 'Faster always means better',
            'Time as meaning', 'Duration changes the idea',
            'Two panels contrast treating speed as a score with using duration to change what a movement means.',
            'Duration is a meaning choice. Faster is not automatically a better dance idea.',
        ),
        V(
            'Slow duration', 'Four counts, careful search',
            'Quick duration', 'One count, sudden alarm',
            'Two panels show the same kind of reach lasting four slow counts as a search, or one quick count as an alarm.',
            'Both durations can be correct. Changing the length changes the meaning of the same action.',
        ),
    ],
    SEEDS[2]: [
        V(
            'Room size only', 'Space means only the walls',
            'Choices in space', 'Height plus the way you face',
            'Two panels contrast thinking of space as only the room size with choosing height and facing inside the room.',
            'Level and direction are choices inside the room, not just the distance between the walls.',
        ),
        V(
            'One height only', 'Only middle, facing front',
            'Level plus direction', 'Low, high, side and back',
            'Two panels contrast a single middle-level front-facing action with low, high, sideways and backward choices.',
            'Low, middle and high levels, plus a change of direction, give one idea more than one spatial view.',
        ),
    ],
    SEEDS[3]: [
        V(
            'Speed is quality', 'Fast always means sharp',
            'Edge and flow', 'A slow jerk can be sharp',
            'Two panels contrast equating fast with sharp and noticing that a slow jerk still has a sharp edge.',
            'Sharp and sustained describe edges and continuity. They are not only another name for fast and slow.',
        ),
        V(
            'Sharp dynamic', 'Sudden stop can say no',
            'Sustained dynamic', 'Even flow can say wait',
            'Two panels show a sudden stop communicating refusal and an even sustained path communicating waiting.',
            'Both dynamics are useful. A sharp edge and a sustained flow communicate different ideas.',
        ),
    ],
    SEEDS[4]: [
        V(
            'Partner required', 'Solo cannot show relation',
            'Partner optional', 'Name where the partner is',
            'Two panels contrast requiring a live partner with naming an imagined partner and dancing one side.',
            'Beside, mirror and contrast can be planned with a partner or described as a solo with an imagined partner.',
        ),
        V(
            'Beside', 'Same facing, elbows clear',
            'Mirror, contrast', 'Match arms, then one still',
            'Two panels show beside as matched facing with a gap, then mirror arms and a contrast where one dancer is still.',
            'Beside shares a side with space between bodies. Mirror matches opposite sides. Contrast makes a clear difference.',
        ),
    ],
    SEEDS[5]: [
        V(
            'Unrelated counts', 'Clap, spin and bow, no aim',
            'Searching motif', 'Look, reach, turn, freeze',
            'Two panels contrast four unrelated actions with a four-count searching motif of look, reach, turn and freeze.',
            'A motif ties four counts to one intent. Unrelated actions do not become a motif just because there are four of them.',
        ),
        V(
            'Intent label only', 'Says searching, shows party',
            'Actions match intent', 'Every count still looks',
            'Two panels contrast a searching label on party actions with four counts that each continue the look.',
            'The intent word and the actions have to agree. Each count should still show the purpose.',
        ),
    ],
    SEEDS[6]: [
        V(
            'Replace the motif', 'New tricks, the idea is gone',
            'Vary and keep idea', 'Lower and slower, still search',
            'Two panels contrast replacing a motif with tricks and varying it by going lower and slower while still searching.',
            'A variation changes level or speed and keeps the intent. Replacing the idea is not a variation.',
        ),
        V(
            'Exact repetition', 'Same level and same speed',
            'One element changes', 'Change level or change speed',
            'Two panels show an exact repeat at the same level and speed beside one change of either level or speed.',
            'Repetition helps the audience recognise the motif. Variation changes one element and protects the idea.',
        ),
    ],
    SEEDS[7]: [
        V(
            'Accidental stop', 'Arms drop and focus leaves',
            'Chosen stillness', 'Hold a readable end shape',
            'Two panels contrast an accidental stop, with dropped arms, and a chosen ending that holds a readable shape.',
            'Stillness is an ending choice when the shape stays readable. Dropping the shape makes the stop look accidental.',
        ),
        V(
            'Phrase beginning', 'Opens the intent clearly',
            'Middle and end', 'Develops, then resolves it',
            'Two panels show a beginning that opens the intent and a middle that develops the idea before an ending resolves it.',
            'A phrase has a beginning that introduces, a middle that develops, and an end that resolves.',
        ),
    ],
    SEEDS[8]: [
        V(
            'Steps only', 'Counts right, eyes wander',
            'Focus and shape', 'Eyes fixed, arms finished',
            'Two panels contrast correct counts with wandering eyes and the same steps with fixed focus and finished arms.',
            'Performance quality depends on focus and clear shapes. Knowing the steps is not the whole performance.',
        ),
        V(
            'Difficulty first', 'Hard steps hide the idea',
            'Readable performance', 'Simple shape, clear focus',
            'Two panels contrast adding difficult steps that hide the idea with a simple finished shape and clear focus.',
            'A simple motif can read clearly when the focus is chosen and the shapes are finished.',
        ),
    ],
    SEEDS[9]: [
        V(
            'Pain as a target', 'Keep going when it hurts',
            'Pain as a stop', 'Stop, sit, and tell an adult',
            'Two panels contrast continuing through pain with stopping, sitting and telling an adult.',
            'Pain is a stop signal. This diagram is a practice rule, not a medical diagnosis or a treatment.',
        ),
        V(
            'Unchecked setup', 'Dusty floor and loose socks',
            'Checked setup', 'Dry floor and agreed shoes',
            'Two panels contrast a dusty floor with loose socks and a dry clear floor with agreed footwear.',
            'Before movement, check that the floor is dry and clear and that footwear matches the adult\'s plan.',
        ),
    ],
    SEEDS[10]: [
        V(
            'Talent judgement', 'Amazing, but no element',
            'Element and effect', 'Slow and low makes us wait',
            'Two panels contrast a talent word with no element and a description linking slow and low movement to waiting.',
            'Name an element and its effect on the audience. A talent word alone cannot be checked.',
        ),
        V(
            'Vague comment', 'Nice, and they moved a lot',
            'Checkable comment', 'High, quick, sharp, then held',
            'Two panels contrast a vague praise comment with a description of a high, quick, sharp reach that is then held.',
            'A checkable description names elements such as level, time and dynamic, then says what the audience can read.',
        ),
    ],
    SEEDS[11]: [
        V(
            'Intent as a title', 'Heading says finding, body jumps',
            'Counts serve intent', 'Look low, travel, then freeze',
            'Two panels contrast a finding title on jumps with counts that look low, travel and freeze while still searching.',
            'The intent is not finished when it is only a heading. The counts themselves have to serve that idea.',
        ),
        V(
            'Mismatched calming', 'Sharp claps labelled calming',
            'Repaired calming', 'Sustained sway, then stillness',
            'Two panels contrast sharp claps labelled calming with a repair that uses a sustained sway and stillness.',
            'Repair a mismatch by changing the actions so the dynamic agrees with the intent, without adding extra counts.',
        ),
    ],
}


def _first_sentence(text: str, limit: int = 120) -> str:
    text = ' '.join(text.split())
    for sep in ('. ', '! ', '? ', '; '):
        idx = text.find(sep)
        if 24 <= idx + 1 <= limit:
            return text[: idx + 1].strip()
    if len(text) <= limit:
        return text
    cut = text[:limit].rsplit(' ', 1)[0].rstrip('.,;:')
    return cut or text[:limit]


def _norm(text: str) -> str:
    return re.sub(r'[^0-9a-z]+', ' ', text.lower()).strip()


def preflight(lessons, visuals):
    if [item['seed_key'] for item in lessons] != SEEDS:
        raise SystemExit('Seed order drifted')
    if set(visuals) != set(SEEDS):
        raise SystemExit('Visual keys do not match seeds')
    seen = {}
    problems = []
    pet = re.compile(r'\bpets?\b', re.I)
    for item in lessons:
        seed = item['seed_key']
        if item['subject'] != 'arts' or item['code'] != CODE:
            problems.append(f'{seed}: subject or code drifted')
        if pet.search(' '.join([
            item['principle'], item['model'], item['guided'], item['feedback'],
            item['misconception'], item['independent'], ' '.join(item['vocab']),
        ])):
            problems.append(f'{seed}: pet wording')
        if not item['guided'].rstrip().endswith('?'):
            problems.append(f'{seed}: guided prompt should be a question')
        blob = '\n'.join(item[k] for k in ('principle', 'model', 'guided', 'feedback', 'misconception'))
        if item['independent'] in blob:
            problems.append(f'{seed}: independent text leaked into earlier fields')
        heads = []
        for key in ('principle', 'model', 'guided', 'feedback', 'misconception', 'independent'):
            if item[key] in seen:
                problems.append(f'{seed}: copied {key} from {seen[item[key]]}')
            seen[item[key]] = seed
            if key != 'guided':
                head = _first_sentence(item[key], 120)
                if not head.endswith(('.', '!', '?')) or not 80 <= len(head) <= 120:
                    problems.append(f'{seed} {key} first sentence ({len(head)}): {head}')
                heads.append(_norm(head).rstrip('.'))
        if len(set(heads)) != len(heads):
            problems.append(f'{seed}: first sentences collide')
        if len(visuals[seed]) != 2:
            problems.append(f'{seed}: need two diagrams')
        for visual in visuals[seed]:
            if 'step one' in visual['svg'].lower():
                problems.append(f'{seed}: generic process card')
            if not visual['alt'] or not visual['caption']:
                problems.append(f'{seed}: visual needs alt and caption')
    if problems:
        raise SystemExit('Preflight failed:\n' + '\n'.join(problems))


def audit_written(out_dir: Path):
    """Catch validator failures that the quiz builder does not raise."""
    problems = []
    for seed in SEEDS:
        bundle = __import__('json').loads((out_dir / f'{seed}.json').read_text())
        lesson = bundle['lesson']
        if lesson['seed_key'] != seed or lesson['title'].startswith('Year 7') is False:
            problems.append(f'{seed}: identity drift')
        if lesson['outcome_codes'] != [CODE]:
            problems.append(f'{seed}: outcome {lesson["outcome_codes"]}')
        if lesson.get('review_status') != 'unreviewed':
            problems.append(f'{seed}: review status')
        if 'http://' in __import__('json').dumps(lesson) or 'https://' in __import__('json').dumps(lesson):
            # SVG namespace is the only allowed URL, and it uses www.w3.org.
            raw = __import__('json').dumps(lesson)
            if re.search(r'https?://(?!www\.w3\.org/2000/svg)', raw):
                problems.append(f'{seed}: external URL in lesson')
        mc = [q for q in lesson['quiz'] if q['type'] == 'multiple_choice']
        stems = [_norm(q['question']) for q in mc]
        for i, a in enumerate(stems):
            for b in stems[i + 1:]:
                if len(a) > 40 and len(b) > 40 and (a.startswith(b[:40]) or b.startswith(a[:40])):
                    problems.append(f'{seed}: near-duplicate stems: {a[:50]} || {b[:50]}')
        model_head = _norm(str(lesson['worked_example'])[:120])
        head40 = model_head[:40] if len(model_head) > 40 else ''
        for q in mc:
            opts = q['options']
            if len({o.strip().lower() for o in opts}) != 4:
                problems.append(f'{seed}: duplicate options in {q["question"][:60]}')
            correct = _norm(opts[q['correct_index']])
            if head40 and head40 in correct:
                problems.append(f'{seed}: option copies worked example')
            for stage, hints in lesson['stage_hints'].items():
                if stage == 'quiz' or stage.startswith('teach'):
                    pass
            # Hint leak is per stage against that stage's question.
        for stage, hints in lesson['stage_hints'].items():
            if stage == 'quiz':
                questions = mc
            elif stage.startswith('teach'):
                questions = [lesson['teach_steps'][int(stage[5:])]['check']]
            else:
                questions = []
            for q in questions:
                correct = _norm(q['options'][q['correct_index']])
                for hint in hints:
                    if correct and correct in _norm(hint):
                        problems.append(f'{seed}: {stage} hint contains correct option: {hint}')
        for i, step in enumerate(lesson['teach_steps']):
            if len(step['explain']) < 300:
                problems.append(f'{seed}: teach{i} shallow')
    if problems:
        raise SystemExit('Audit failed:\n' + '\n'.join(problems))


def main():
    preflight(LESSONS, VISUALS)
    written = write_elective_batch(
        LESSONS,
        VISUALS,
        subject='arts',
        source_url=SOURCE,
        source_note=SOURCE_NOTE,
        out_dir=OUT,
    )
    audit_written(OUT)
    print(f'Authored {len(written)} dance lessons in {OUT}')
    return written


if __name__ == '__main__':
    main()
