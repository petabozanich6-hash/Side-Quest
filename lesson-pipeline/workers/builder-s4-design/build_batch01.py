#!/usr/bin/env python3
"""Year 7 Design and Technology Written Core, lessons 1–12.

One running context: a cardboard desk organiser for Jordan, a Year 7 student
whose pencils roll off the desk. Paper and cardboard only; scissors with an
adult nearby; no power tools. Outcome DIT5-EVL-01 is proposed and not verified.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / 'scripts' / 'gold-pipeline'))

from assessment_quiz import _option  # noqa: E402
from elective_batch import write_elective_batch  # noqa: E402
from written_bundle import pair_visual  # noqa: E402

CODE = 'DIT5-EVL-01'
SOURCE_URL = (
    'https://curriculum.nsw.edu.au/learning-areas/tas/'
    'design-innovation-technology-7-10-2025/outcomes'
)
SOURCE_NOTE = (
    'Catalogue subject is Design and Technology. Proposed Year 7 alignment uses '
    'Design Innovation Technology 7–10 (2025) outcome DIT5-EVL-01, which the syllabus '
    'says may be adjusted for Stage 4 (DIT4-ADJ-01). The 2019 Design and Technology '
    'syllabus is in teach-out until 2029. Content-point mapping pending. Not NESA verified. '
    'Practical work is paper or cardboard only.'
)
OUT_DIR = Path(__file__).resolve().parent / 'authored'

SEEDS = [
    's5-design-technology-y9-w01-l1',
    's5-design-technology-y9-w01-l2',
    's5-design-technology-y9-w02-l1',
    's5-design-technology-y9-w02-l2',
    's5-design-technology-y9-w03-l1',
    's5-design-technology-y9-w03-l2',
    's5-design-technology-y9-w04-l1',
    's5-design-technology-y9-w04-l2',
    's5-design-technology-y9-w05-l1',
    's5-design-technology-y9-w05-l2',
    's5-design-technology-y9-w06-l1',
    's5-design-technology-y9-w06-l2',
]


def lesson(seed, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(
        seed_key=seed,
        code=CODE,
        subject='technology',
        vocab=vocab,
        principle=principle,
        model=model,
        guided=guided,
        feedback=feedback,
        misconception=misconception,
        independent=independent,
    )


LESSONS = [
    lesson(
        SEEDS[0],
        ['user', 'need', 'problem', 'decoration'],
        (
            'Design names the user and the problem before decoration, colour or stickers are chosen at all. '
            'A user is the person who will actually use the solution. A need is what is going wrong for that person. '
            'Jordan is a Year 7 student who does homework at a small desk. Pencils roll off the edge, drop to the floor '
            'and take time to find. The user is Jordan. The problem is lost rolling pencils, not a dull-looking desk. '
            'Stickers, a favourite colour or a fancy shape can be decided later, after the need is clear. '
            'If you decorate first, you may make something attractive that still lets pencils fall.'
        ),
        (
            'Jordan is a Year 7 student whose pencils roll off a small homework desk and disappear underneath. '
            'A useful opening is: user Jordan; problem, pencils leave the desk during homework and are lost on the floor. '
            'One sentence that keeps both facts is: Jordan needs the pencils to stay on the desk instead of rolling away. '
            'A weak opening is a drawing of a rainbow box with no user and no problem. The rainbow does not say who is affected '
            'or what goes wrong. Decoration can wait until those two facts are written.'
        ),
        (
            'Jordan wants rainbow stickers on the organiser before writing anything else. '
            'State the user and the problem that must be written before any colour or sticker is chosen.'
        ),
        (
            'The user is Jordan and the problem is pencils rolling off the desk; rainbow stickers are not the need. '
            'Jordan is a Year 7 student working at a small desk. Pencils roll over the edge and are lost underneath. '
            'A sticker colour does not keep a pencil on the desk, so it is not part of the problem statement. '
            'Write the user and the lost-pencil problem first. Choose colour only after that need is clear.'
        ),
        (
            'Starting with rainbow stickers or a favourite colour before naming who loses the pencils. '
            'That mistake treats design as decorating. The pencils still roll away, so the need is untouched. '
            'Fix it by writing the user and the problem in two sentences, then leave colour until later.'
        ),
        (
            'A classmate knocks an eraser off a crowded afternoon desk; name that user and problem with no colour. '
            'Write two sentences: who the user is, and what goes wrong. Do not choose stickers, colours or a shape. '
            'This is a different person and a different object from Jordan and the rolling pencils.'
        ),
    ),
    lesson(
        SEEDS[1],
        ['brief', 'constraint', 'cost', 'size'],
        (
            'A design brief names the user, the need and the constraints the solution must respect. '
            'A constraint is a limit, not a wish. For Jordan’s pencil organiser the limits are real: spend nothing, '
            'fit a desk corner, and use paper or cardboard already at home. Cost, size and materials are constraints '
            'because they rule some ideas out before making starts. A slogan such as “be tidy” is not a brief. '
            'It has no user, no need and no limit a maker can follow. This lesson stays on paper: no tools yet.'
        ),
        (
            'Jordan’s brief records the user, the lost-pencil need, and three home constraints before any cutting. '
            'User: Jordan, Year 7, homework at a small desk. Need: pencils stop rolling onto the floor. '
            'Constraints: cost is zero dollars, the base must sit in a desk corner about 15 cm by 15 cm, '
            'and the only materials are paper and cardboard already at home. A poster that says “be organised” '
            'fails this model because it has no user, no need and no limit.'
        ),
        (
            'Finish Jordan’s organiser brief with the user, the need, and three constraints. '
            'The constraints must cover cost, the desk-corner size, and which materials are allowed at home.'
        ),
        (
            'User Jordan needs pencils to stay on the desk, within zero cost, a 15 cm corner and home card. '
            'Need: pencils roll off during homework and are lost. Constraint of cost: spend zero dollars. '
            'Constraint of size: the base fits a corner space of about 15 cm by 15 cm. '
            'Constraint of materials: paper and cardboard already at home. No shop list and no slogan.'
        ),
        (
            'Writing the slogan “make homework tidy” and calling that slogan a finished design brief. '
            'A slogan skips the user, the need and the limits. Another person cannot tell what to make, '
            'how big it may be, or what it may cost. Replace the slogan with user, need and constraints.'
        ),
        (
            'Write a fresh brief for a classmate whose highlighter caps fall off inside a pencil case. '
            'Include the user, the need, and constraints of zero cost, a size that fits the pencil case, '
            'and paper or cardboard from home. Do not copy Jordan’s pencil-rolling need or the 15 cm corner.'
        ),
    ),
    lesson(
        SEEDS[2],
        ['criterion', 'check', 'bump', 'edge'],
        (
            'A success criterion is a check you can try and mark yes or no, not a wish such as “looks good”. '
            'Jordan’s organiser has three criteria. It holds 8 pencils. It fits a desk corner of about 15 cm by 15 cm. '
            'It has no sharp edges. Each check needs an action: count the pencils after a gentle bump, measure the base, '
            'or run a fingertip along every edge. “Awesome” and “cool” cannot be checked, because people will disagree. '
            'Write the number, the size or the safety check in the criterion itself.'
        ),
        (
            'Jordan’s three criteria can be marked yes or no: eight pencils, a 15 cm corner, and smooth edges. '
            'Holds 8: eight pencils stay in when the desk gets one gentle sideways bump from a fingertip. '
            'Fits the corner: the base measures no more than 15 cm along each side of the corner space. '
            'No sharp edges: a fingertip traced around every edge finds no point that scratches skin. '
            '“It should look amazing” is not on the list, because nobody can agree how to mark it.'
        ),
        (
            'Rewrite these wishes as three criteria for Jordan: “holds enough pencils”, “not too big”, and “safe to touch”. '
            'Each rewrite must say what to count, measure or trace so another person could mark yes or no.'
        ),
        (
            'Holds eight pencils after one gentle bump, fits a 15 cm corner, and has no scratching edge. '
            'Enough pencils becomes a count of 8 that stay in after the bump. Not too big becomes a base that fits '
            'inside a corner of about 15 cm by 15 cm. Safe to touch becomes a fingertip test with no sharp point. '
            'Each line can be marked yes or no by someone who was not in the room when you wrote it.'
        ),
        (
            'Using “looks cool” or “is awesome” as a success criterion for the pencil organiser. '
            'Those words cannot be counted, measured or traced, so two people can disagree forever. '
            'Replace each wish with a check that has a number, a measurement or a clear yes-or-no action.'
        ),
        (
            'Write three checkable criteria for a bookmark that must stay inside a library book. '
            'Use new checks: it marks one page, it does not tear the page, and it is shorter than the book. '
            'Do not reuse the eight-pencil count, the 15 cm desk corner, or the organiser edge test.'
        ),
    ),
    lesson(
        SEEDS[3],
        ['observation', 'feature', 'limit', 'object'],
        (
            'Investigating existing products means describing real objects you can see, not inventing brand claims. '
            'Look at material, one useful feature and one limit. A feature is something the object already does. '
            'A limit is something it does poorly for Jordan’s brief. A kitchen mug and a cardboard shoebox can be '
            'observed if they are actually in the room. You record what you see. You do not write that a brand is '
            '“the best” or give a star score you did not measure. If the object in front of you differs, describe that object.'
        ),
        (
            'Two home objects are described from looking: a kitchen mug and a cardboard shoebox, with no brand score. '
            'Mug: ceramic, heavy, holds many pens upright, but the round base does not tuck into a square desk corner '
            'and a chip can leave a sharp rim. Shoebox: light cardboard, stops small items rolling, but it is much wider '
            'than a 15 cm corner and a torn flap can scratch. Neither description names a company or invents a rating. '
            'If your mug or box differs, change the notes to match the object you can touch.'
        ),
        (
            'Describe two real containers you can see at home or in class that already hold small items. '
            'For each one, write the material, one useful feature and one limit. Do not name a brand as best '
            'and do not invent a star rating.'
        ),
        (
            'A strong investigation points at two real objects and records material, one feature and one limit. '
            'Example of the standard, not a brand claim: a lunchbox is plastic, it closes, but it may be too deep '
            'for a desk corner; a cereal box is light card with a wide base, but a torn flap can be sharp. '
            'Your own two objects may differ. The requirement is what you can see, not a company slogan.'
        ),
        (
            'Writing that a famous brand never drops pencils, or scoring it five stars, without looking at it. '
            'That invents a claim. You cannot check a slogan by wishing. Describe material, a feature and a limit '
            'from an object in front of you, and leave out any score you did not measure.'
        ),
        (
            'Investigate an ice-cream tub and a zip bag you can actually see, as holders for loose markers. '
            'For each, record material, one useful feature and one limit. If one of those objects is not in the room, '
            'swap in a different container you can see. Do not reuse the mug and shoebox notes, and invent no brand claim.'
        ),
    ),
    lesson(
        SEEDS[4],
        ['variety', 'sketch', 'structure', 'difference'],
        (
            'Generating ideas means producing several different ways to meet the same brief, not one box in three colours. '
            'A difference is a change in structure: how the pencils are held, not which sticker is used. '
            'For Jordan, three structures are a corner tray, a folded sleeve and a standing roll. '
            'Each idea is a sketch described in words: the shape, how eight pencils sit, and which criterion it aims at. '
            'Jordan measured one pencil at 18 cm, longer than the 15 cm corner, so a flat row of pencils may stick out. '
            'Three colours of the same tray still count as one idea.'
        ),
        (
            'Three word-sketches differ in structure: a flat corner tray, an 18 cm sleeve, and a standing roll. '
            'Tray: a shallow triangle with walls about 3 cm high; pencils lie flat; it aims at the corner fit, '
            'but an 18 cm pencil may stick out of a 15 cm corner. Sleeve: a folded tunnel one pencil long, about 18 cm; '
            'eight pencils lie side by side; it aims at holding 8, but the length misses the corner. '
            'Standing roll: a card tube pencils stand in, with a small base; it aims at both the count and the corner. '
            'The shapes differ. The colours are not mentioned.'
        ),
        (
            'Describe three different organiser ideas for Jordan in words, as if you were labelling quick sketches. '
            'Each idea must change the shape or how the pencils are held, and name one criterion it tries to meet. '
            'Do not offer the same tray in three colours.'
        ),
        (
            'Three ideas should differ in structure, such as a flat tray, a long sleeve and a standing holder. '
            'Each note says how the eight pencils sit and which check it targets: holding 8, fitting the 15 cm corner, '
            'or keeping edges smooth. A pencil Jordan measured at 18 cm will stick out of a 15 cm corner if it lies flat, '
            'so a flat idea must admit that limit. Three sticker colours of one box are still one idea.'
        ),
        (
            'Calling three sticker colours of the same box three ideas, when the pencil-holding structure never changes. '
            'Colour is decoration. Variety means a different shape or a different way of holding the pencils. '
            'Replace the colour list with three structures that do different jobs against the criteria.'
        ),
        (
            'Generate three word-sketches for keeping headphones from tangling inside a school bag. '
            'Change the structure each time, and name one check each idea aims at. '
            'Do not redraw the pencil tray, the sleeve or the standing roll.'
        ),
    ),
    lesson(
        SEEDS[5],
        ['trade-off', 'choice', 'stability', 'compromise'],
        (
            'Choosing an idea means matching it to the criteria and naming the trade-off you accept. '
            'A trade-off is a benefit you give up so a more important criterion is met. '
            'Jordan’s checks are still: holds 8 pencils, fits a 15 cm by 15 cm corner, and has no sharp edges. '
            'The flat tray and the 18 cm sleeve struggle with the corner because the pencil is longer than 15 cm. '
            'The standing roll can meet the count and the corner, but a narrow roll tips. That loss of stability '
            'is the trade-off, not a reason to hide the weakness. “I like it” does not explain a choice.'
        ),
        (
            'The standing roll is chosen because it can hold eight pencils inside the corner; stability is the trade-off. '
            'Tray: folded smooth edges and a low shape, but an 18 cm pencil lying flat sticks out of the 15 cm corner, '
            'so corner fit fails. Sleeve: holds eight pencils in a row and edges can be folded, but it is about 18 cm long, '
            'so it also misses the corner. Standing roll: pencils stand in a tube with a base under 15 cm, and edges can be '
            'folded smooth, so count and corner can pass. It tips if the base is narrow. The accepted trade-off is less stability, '
            'to be improved later with a wider base, not ignored.'
        ),
        (
            'Choose one of the tray, the sleeve or the standing roll for Jordan. '
            'Say which of the three criteria it can meet, and name one trade-off you accept. '
            'The pencil measure in the model is 18 cm and the corner is 15 cm by 15 cm.'
        ),
        (
            'Choose the standing roll: it can hold eight upright pencils in the 15 cm corner, and edges can be folded smooth. '
            'The tray and the sleeve are about as long as the 18 cm pencil, so they miss the corner. '
            'The trade-off is stability: a narrow roll tips more easily than a flat tray. '
            'Saying the roll “looks cool” does not show the criteria or the weakness you accept.'
        ),
        (
            'Picking the prettiest idea and pretending the chosen design has no disadvantage at all. '
            'Every idea gives something up. Hiding the weakness makes the next test meaningless. '
            'Name the criteria the idea can meet and state the trade-off in one clear sentence.'
        ),
        (
            'Choose between a flat pocket and a small box for a bus pass and a library card kept together. '
            'Criteria: fits a pocket, keeps both cards dry, and has no sharp edge. Explain one trade-off. '
            'Do not choose the pencil roll or reuse the 15 cm desk corner.'
        ),
    ),
    lesson(
        SEEDS[6],
        ['sequence', 'scissors', 'cardboard', 'supervision'],
        (
            'A making plan lists every material and the numbered steps before scissors touch the cardboard. '
            'For Jordan’s organiser the materials are paper for marking and cardboard for the piece. '
            'The only cutting tool is scissors. An adult stays nearby while anyone cuts. '
            'No craft knife, no glue gun and no power tool belongs in this plan. '
            'A safe sequence measures and marks, then cuts, then folds, then joins by slotting tabs into slits, '
            'then presses edges flat. Cutting first, with no marks, wastes card and is harder to control.'
        ),
        (
            'Jordan’s plan uses cardboard and scissors only, with an adult nearby, and joins pieces by slotted tabs. '
            'Materials: one cereal-box panel, scrap paper, a pencil for marking, and scissors. '
            'Sequence: measure a base no wider than 15 cm and mark it; cut on the line with scissors while an adult is in the room; '
            'fold the walls; cut short tabs and slits and slot them together; press every edge flat so nothing scratches. '
            'A craft knife, a hot glue gun and any power tool are left off the list on purpose.'
        ),
        (
            'Write Jordan’s materials list and a numbered making sequence for the cardboard organiser. '
            'Include when scissors are used, where the adult must be, and how pieces join without a knife or power tool.'
        ),
        (
            'Materials are cardboard, marking paper, a pencil and scissors; an adult is nearby for every cut. '
            'Order: measure and mark a base within 15 cm, cut with scissors, fold, slot tabs into slits, then press edges flat. '
            'Joining is by slots, not by a knife or a hot tool. Power tools are not in a Year 7 paper plan. '
            'Cutting before measuring is not a step in this sequence.'
        ),
        (
            'Planning a craft knife or a hot glue gun because it seems faster than scissors and slots. '
            'Those tools are outside this paper brief and need a different safety setup. '
            'Keep scissors as the only cutter, keep an adult nearby, and join cardboard by slotting.'
        ),
        (
            'Plan materials and a numbered sequence for a cardboard bookmark, using scissors only and an adult nearby. '
            'The steps must suit a flat bookmark, not a pencil tube. Do not include a knife, a glue gun or a power tool.'
        ),
    ),
    lesson(
        SEEDS[7],
        ['prototype', 'simplification', 'final', 'testpiece'],
        (
            'A prototype is a quick cardboard model built to learn, not the finished organiser you hope to keep. '
            'The final idea states what the organiser should do: hold 8 pencils, fit the 15 cm corner, and have smooth edges, '
            'using the standing roll with a wider base. The prototype simplifies that idea so it can be tried today '
            'with scrap card and scissors. It may be rougher, shorter or joined with simple slots. '
            'Its job is to answer the criteria, not to look neat. Refusing to build until the drawing looks perfect '
            'stops you learning. Calling the rough model “finished forever” stops you improving it.'
        ),
        (
            'The final idea is a stable standing roll; today’s prototype is a shorter scrap-card tube made to test, not to keep. '
            'Final idea: a standing roll on a wide base, holding 8 pencils, fitting inside 15 cm by 15 cm, with folded smooth edges. '
            'Prototype plan: roll scrap cereal-box card into a tube, slot two tabs into a square base cut under 15 cm, '
            'and stop even if the tube looks rough. The prototype asks whether eight pencils fit and whether the base resists a tip. '
            'It is not the neat final piece, and it still uses scissors only, with an adult nearby.'
        ),
        (
            'Write two short parts for Jordan: what the final standing-roll idea promises, and what the cardboard prototype '
            'simplifies so it can be tested today with scrap card and scissors. Keep an adult nearby for cutting.'
        ),
        (
            'The final roll promises eight pencils, a 15 cm corner fit and smooth edges on a wider base. '
            'The prototype uses scrap cardboard and slotted tabs, may be shorter or rougher, and exists so those checks can be tried. '
            'Looking neat is not the prototype’s job. Scissors remain the only cutter, with an adult nearby. '
            'The rough tube is a test piece, not the final organiser.'
        ),
        (
            'Treating the first rough cardboard tube as the final product, or waiting for a perfect drawing before any model. '
            'A prototype is allowed to look unfinished because its job is to answer a test. '
            'A final idea is the promise you are aiming at. Keep the two descriptions separate.'
        ),
        (
            'Contrast a final idea and a cardboard prototype for a folded-card phone stand used on a library desk. '
            'Say what the prototype simplifies so it can be tested today. Use scissors and cardboard only, with an adult nearby. '
            'Do not copy the pencil-roll measurements or the eight-pencil promise.'
        ),
    ),
    lesson(
        SEEDS[8],
        ['test', 'measurement', 'nudge', 'result'],
        (
            'Testing a prototype means trying each criterion in a way someone else could repeat. '
            'For Jordan, three tests match the three criteria. Count how many of 8 pencils stay in after one gentle nudge. '
            'Measure the base in centimetres and compare it with the 15 cm by 15 cm corner. '
            'Trace every edge with a fingertip and note any point that scratches. '
            'A nudge is a small sideways push with one finger, not a throw. '
            'Looking at the tube and saying “it seems fine” is not a test, because no result was recorded.'
        ),
        (
            'Each criterion gets an action and a recorded result: a pencil count, a centimetre measure, and an edge trace. '
            'Holds 8: place eight pencils in the prototype, give one gentle fingertip nudge, and write how many stay in. '
            'Corner fit: measure the base length and width in centimetres and compare both with 15 cm. '
            'Edges: trace every edge with a fingertip and write “scratch” or “smooth” for each edge. '
            'Record the result beside the criterion before you judge the whole design. Scissors stay down during the test.'
        ),
        (
            'For Jordan’s cardboard prototype, write the action you would measure or try for each criterion: '
            'holds 8 pencils, fits the 15 cm desk corner, and has no sharp edges. Say what result you would write down.'
        ),
        (
            'Count pencils after one gentle nudge, measure the base in centimetres against 15 cm, and trace every edge. '
            'The pencil result is a number out of 8. The corner result is two measurements compared with 15 cm by 15 cm. '
            'The edge result is smooth or scratch for each edge. “It seems fine” is not a recorded result. '
            'Do the tests with the prototype already made; do not cut during the test.'
        ),
        (
            'Saying the prototype passed after a glance, without counting, measuring or tracing an edge. '
            'A glance has no number and no yes-or-no record, so nobody can repeat it. '
            'Write the action and the result for each criterion before you decide how good the design is.'
        ),
        (
            'Plan three tests for a cardboard bookend that must hold three paperbacks upright, fit a shelf end, '
            'and have no sharp edge. Say what you would count or measure, and what result you would write. '
            'Do not reuse the pencil count of 8 or the 15 cm desk corner.'
        ),
    ),
    lesson(
        SEEDS[9],
        ['failure', 'record', 'change', 'information'],
        (
            'A failed test is information about the design, not a verdict that the student failed. '
            'Record what you tried, what happened, and one change linked to that result. '
            'If only some of the eight pencils stay in, the tube is telling you something about height or width. '
            'Change one thing, then repeat the same test. Changing height, width and colour together means you will not '
            'know which change helped. Rubbing out the fail hides the information you need. '
            'The organiser can improve; the person is not the failure.'
        ),
        (
            'A nudge test kept five of eight pencils; the record treats that fail as information and changes only the height. '
            'Tried: eight pencils in the standing roll, one gentle fingertip nudge. Result: five stayed in and three fell out, '
            'so “holds 8” was not met. Information: the tube is wide enough for the pencils, but it is only 6 cm tall, '
            'too short to steady them. One change: slot a 4 cm cardboard collar on the tube so it is taller, then repeat the same nudge. '
            'The base is not changed in this step. Colour is not changed. The fail stays written down.'
        ),
        (
            'Jordan’s corner test shows a base 18 cm wide, while the marked corner is 15 cm wide. '
            'Record the failed result as information and propose one change only. Say which test you would repeat.'
        ),
        (
            'Record an 18 cm base against a 15 cm corner, then cut the base down and measure that same corner again. '
            'The fit criterion failed because 18 is greater than 15. One change: cut the base to 14 cm, slot the tube on again, '
            'and remeasure length and width. Do not also change the tube height in this step, or you will not know what fixed the fit. '
            'Changing the colour does not change the width. Keep the failed 18 cm written on the page.'
        ),
        (
            'Rubbing out a failed result, or changing colour, height and width all in the same step. '
            'The fail is the evidence. Erasing it leaves you with a guess. Changing three things at once means the next test '
            'cannot tell you which change mattered. Keep the record, and change one feature that matches the result.'
        ),
        (
            'A cardboard bookmark prototype tears a library-book page during one careful trial on the desk. '
            'Record what you tried, what failed, and one change you would make before trying again. '
            'Use the bookmark, not the pencil tube, and do not erase the failed trial.'
        ),
    ),
    lesson(
        SEEDS[10],
        ['evaluation', 'improvement', 'evidence', 'judgement'],
        (
            'Evaluation matches each criterion to the test evidence, then names one improvement. '
            'It is more precise than “I like my organiser” or a single score out of ten. '
            'For each criterion, write met or not met, and the result that proves it. '
            'An improvement targets a criterion that was not met. If the corner and the edges passed but the pencil count did not, '
            'the next change is about holding pencils, not about colour. '
            'Two criteria can pass while one fails. That is a mixed result, not a total success or a total failure.'
        ),
        (
            'Evaluation of Jordan’s later prototype: corner and edges are met, but only six of eight pencils stayed in. '
            'Holds 8: not met, because six pencils stayed in after one gentle nudge and two fell out. '
            'Fits the corner: met, because the base measured 13 cm by 13 cm and the marked corner was 15 cm by 15 cm. '
            'No sharp edges: met, because a fingertip trace found only folded seams and no scratching point. '
            'Improvement: add a 3 cm cardboard collar to raise the tube, then repeat only the pencil-count nudge. '
            'The design is not “bad”; two checks passed and one still needs work.'
        ),
        (
            'Evaluate a prototype that fits the 15 cm corner and has smooth edges, but holds only four pencils before they spill. '
            'State which criteria are met, which is not met, and one change aimed at the unmet criterion.'
        ),
        (
            'Corner fit and smooth edges are met; holding eight pencils is not met, because only four stayed in. '
            'The change is to deepen or heighten the holder, then repeat the pencil count. '
            'Do not call the whole prototype a failure, and do not call it finished. '
            'A score such as 8/10 without the three criteria hides which check failed. Colour is not the missing evidence.'
        ),
        (
            'Giving the project one overall score, such as 8/10, because the organiser looks good. '
            'A single score skips which criterion passed and which failed. '
            'Judge each criterion with its result, then write one improvement for a criterion that was not met.'
        ),
        (
            'Evaluate a cardboard door wedge that stops a bedroom door, still scratches, and slides on a smooth floor. '
            'Say what is met, what is not, and one change aimed at an unmet check. '
            'Do not evaluate Jordan’s pencil organiser, and do not give only a score out of ten.'
        ),
    ),
    lesson(
        SEEDS[11],
        ['transfer', 'process', 'sibling', 'puzzle'],
        (
            'Transfer means using the same design process for a new user and a new need, not copying Jordan’s pencil answers. '
            'The process is: name the user and the problem, write a brief with constraints, set checks you can try, '
            'describe real objects you can see, sketch different structures, choose one and name a trade-off, '
            'plan cardboard and scissors with an adult nearby, separate the prototype from the final idea, '
            'test, record a fail as information, and evaluate what was met. '
            'A new user changes the facts. “Holds 8 pencils” is Jordan’s criterion. It does not belong on someone else’s brief '
            'unless that person also has that need. Copying the title and keeping every pencil sentence is not transfer.'
        ),
        (
            'A grandparent’s recipe cards slide off the bench; the process moves to that new user without pencil criteria. '
            'User and problem: a grandparent, recipe cards slide off the kitchen bench while cooking. '
            'Constraints: zero cost, sits beside the toaster, paper or cardboard from home. '
            'One checkable criterion: holds 10 cards and they stay put when the bench is wiped once, with no sharp edge. '
            'This worked transfer is not Jordan’s organiser and it is not a puzzle-piece brief. '
            'Safety stays the same: scissors only, adult nearby, no power tool.'
        ),
        (
            'Apply the first three process steps to a friend who loses hair ties in a sports bag. '
            'Write the user and the problem, one home-cardboard constraint, and one checkable criterion. '
            'Do not write a puzzle brief, and do not reuse “holds 8 pencils”.'
        ),
        (
            'The friend loses hair ties in a sports bag; one constraint is home cardboard that fits the side pocket. '
            'User: the friend. Problem: hair ties vanish in the bag. '
            'Criterion: holds 6 hair ties and they stay in when the bag is tipped gently once, with no sharp edge. '
            'That is the same process with new facts. “Holds 8 pencils” does not describe hair ties. '
            'Scissors and an adult nearby remain the making limit when a model is eventually planned.'
        ),
        (
            'Copying Jordan’s “holds 8 pencils” criterion onto a new user, and changing only the title. '
            'The process stays, but the facts must change. A new person has a new need, new constraints and new checks. '
            'If the criterion still talks about pencils, the transfer has not happened.'
        ),
        (
            'Write a fresh brief for a younger sibling, about six, whose jigsaw pieces scatter across the floor. '
            'Include the user, the need, two constraints (zero cost and home cardboard), and two criteria that are not pencil tests. '
            'State the making limit: scissors and cardboard only, with an adult nearby. '
            'Do not reuse Jordan’s eight-pencil count, the 15 cm desk corner, or the recipe-card example.'
        ),
    ),
]

VISUALS = {
    SEEDS[0]: [
        pair_visual(
            'User and problem', 'Jordan loses rolling pencils',
            'Decoration first', 'Stickers before any need',
            'Jordan’s lost pencils contrasted with a sticker-first box that names no user.',
            'Name the user and the rolling-pencil problem before any decoration.',
        ),
        pair_visual(
            'Useful opening', 'User Jordan; pencils roll off',
            'Weak opening', 'Rainbow box, no problem',
            'A user-and-problem sentence beside a rainbow box that does not say what goes wrong.',
            'A design opening states who is affected and what fails.',
        ),
    ],
    SEEDS[1]: [
        pair_visual(
            'Brief parts', 'User, need, three limits',
            'Not a brief', 'Tidy-desk slogan only',
            'A brief with user, need and constraints beside a slogan that has no limits.',
            'Constraints of cost, corner size and home card make the brief usable.',
        ),
        pair_visual(
            'Cost and size', 'Zero dollars; 15 cm corner',
            'Materials', 'Paper and cardboard at home',
            'Cost and corner-size limits beside the home paper-and-cardboard material limit.',
            'Each constraint rules an idea out before making starts.',
        ),
    ],
    SEEDS[2]: [
        pair_visual(
            'Can be checked', '8 pencils; 15 cm; smooth',
            'Cannot be checked', 'Looks awesome or cool',
            'Countable pencil, corner and edge checks beside wishes that cannot be marked.',
            'A criterion needs a count, a measure or a yes-or-no action.',
        ),
        pair_visual(
            'Bump count', 'How many of 8 stay in',
            'Edge trace', 'Fingertip finds no scratch',
            'A gentle bump count beside a fingertip edge trace for Jordan’s organiser.',
            'The check is the action you would actually try.',
        ),
    ],
    SEEDS[3]: [
        pair_visual(
            'Seen mug', 'Ceramic; round; may chip',
            'Seen shoebox', 'Light card; wider than corner',
            'Notes from a real mug and a real shoebox, with material, feature and limit.',
            'Describe objects you can see. Do not invent a brand score.',
        ),
        pair_visual(
            'From looking', 'Material, feature, limit',
            'Invented claim', 'Best brand; five stars',
            'An observation record beside a brand claim and star score that were not measured.',
            'Investigation records what you can point at.',
        ),
    ],
    SEEDS[4]: [
        pair_visual(
            'Tray or sleeve', 'Flat; pencil may stick out',
            'Standing roll', 'Pencils stand; small base',
            'A flat holder that may exceed the corner beside a standing roll with a small base.',
            'Ideas differ in structure, not in sticker colour.',
        ),
        pair_visual(
            'Three structures', 'Tray, sleeve, standing roll',
            'One idea thrice', 'Same box, three colours',
            'Three different pencil-holding structures beside one box repeated in three colours.',
            'Variety means a different way of holding the pencils.',
        ),
    ],
    SEEDS[5]: [
        pair_visual(
            'Corner miss', '18 cm pencil; 15 cm space',
            'Roll fits', 'Stands inside the corner',
            'An 18 cm flat pencil missing a 15 cm corner beside a standing roll that fits.',
            'The corner criterion eliminates the long flat ideas.',
        ),
        pair_visual(
            'Chosen idea', 'Standing roll holds eight',
            'Trade-off', 'Narrow roll can tip',
            'The chosen standing roll beside the stability trade-off of a narrow base.',
            'A choice names both the criteria met and the weakness accepted.',
        ),
    ],
    SEEDS[6]: [
        pair_visual(
            'Tool allowed', 'Scissors; adult nearby',
            'Left off', 'No knife; no power tool',
            'Scissors with an adult nearby beside the knife and power tools left off the plan.',
            'This paper plan cuts only with scissors.',
        ),
        pair_visual(
            'Order', 'Mark, cut, fold, slot',
            'Unsafe order', 'Cut first, no marks',
            'A measure-mark-cut-fold-slot sequence beside cutting before any marks are drawn.',
            'The sequence joins cardboard with tabs and slits.',
        ),
    ],
    SEEDS[7]: [
        pair_visual(
            'Final promise', '8 pencils; wide stable base',
            'Today’s model', 'Rough scrap-card tube',
            'The final standing-roll promise beside a rough scrap-card prototype built to test.',
            'A prototype is for learning, not for keeping as the final piece.',
        ),
        pair_visual(
            'Simplified', 'Shorter tube; slotted tabs',
            'Still answered', 'Fit, count, smooth edges',
            'Prototype simplifications beside the three criteria the model is still built to answer.',
            'Roughness is allowed; the criteria are not dropped.',
        ),
    ],
    SEEDS[8]: [
        pair_visual(
            'Nudge test', 'Count how many of 8 stay',
            'Ruler test', 'Base compared with 15 cm',
            'A pencil-count nudge beside a ruler check of the base against the 15 cm corner.',
            'Each criterion has a repeatable action and a written result.',
        ),
        pair_visual(
            'Edge test', 'Trace; write scratch or smooth',
            'Not a test', 'Glance; it seems fine',
            'A recorded fingertip edge trace beside a glance that writes no result.',
            'A test produces a number or a yes-or-no note.',
        ),
    ],
    SEEDS[9]: [
        pair_visual(
            'Failed nudge', '5 stayed in; 3 fell out',
            'One change', 'Taller collar; same nudge',
            'Five of eight pencils staying in beside one change: a taller collar and the same nudge.',
            'The fail is information. Change one feature, then repeat the test.',
        ),
        pair_visual(
            'Width fail', 'Base 18 cm; corner 15 cm',
            'Not a fix', 'New colour; same width',
            'An 18 cm base against a 15 cm corner beside a colour change that leaves the width untouched.',
            'The change must match the measurement that failed.',
        ),
    ],
    SEEDS[10]: [
        pair_visual(
            'Met', '13 cm base inside 15 cm',
            'Not met', '6 of 8 pencils stayed',
            'A met corner measurement beside an unmet pencil count of six out of eight.',
            'Evaluation judges each criterion with its own result.',
        ),
        pair_visual(
            'Improvement', 'Raise tube; retest count',
            'Hidden result', 'Score 8/10; looks good',
            'A collar aimed at the pencil count beside a single score that hides which check failed.',
            'The next change targets the criterion that was not met.',
        ),
    ],
    SEEDS[11]: [
        pair_visual(
            'Same process', 'User, limits, check, test',
            'New facts', 'Not the pencil answers',
            'The design-process steps beside a reminder that a new user needs new facts.',
            'Transfer keeps the process and changes the user, need and criteria.',
        ),
        pair_visual(
            'Recipe-card model', '10 cards stay when wiped',
            'Sibling task', 'Puzzle pieces on the floor',
            'A recipe-card worked example beside the separate sibling puzzle-piece brief.',
            'The independent brief uses a younger sibling, not Jordan’s pencils.',
        ),
    ],
}


def norm(text: str) -> str:
    return re.sub(r'[^\w]+', ' ', text.lower(), flags=re.UNICODE).replace('_', ' ').strip()


def preflight(lessons):
    errors = []
    focus = 'design criteria, safe making steps or test evidence'
    fixed = {
        'Repeat the worked example wording with no new evidence.',
        'Start making with no criteria or safety check.',
        'Call the first attempt finished without testing.',
        'Invent missing details to make the answer sound complete.',
        'Ignore safety or cultural protocols to finish faster.',
        'Treat every claim as equally reliable without checking a source or cue.',
        'Retype the worked example with no new example.',
    }
    if [item['seed_key'] for item in lessons] != SEEDS:
        errors.append('seed order changed')
    seen_full = set()
    for item in lessons:
        seed = item['seed_key']
        if len(item['vocab']) != 4:
            errors.append(f'{seed}: vocab')
        fields = [item['principle'], item['model'], item['guided'], item['feedback'],
                  item['misconception'], item['independent']]
        if len({norm(part) for part in (item['model'], item['guided'], item['independent'])}) != 3:
            errors.append(f'{seed}: model/guided/independent not distinct')
        opts = []
        for label, text in zip(
            ('principle', 'model', 'feedback', 'misconception', 'independent'),
            (item['principle'], item['model'], item['feedback'], item['misconception'], item['independent']),
        ):
            opt = _option(text)
            opts.append(opt)
            if not (80 <= len(opt) <= 118):
                errors.append(f'{seed} {label} option len {len(opt)}: {opt}')
            if opt in fixed:
                errors.append(f'{seed} {label} collided with a fixed option')
        if len(set(opt.casefold() for opt in opts)) != len(opts):
            errors.append(f'{seed}: duplicate content options {opts}')
        blob = '\n'.join(fields)
        if re.search(r'\bpets?\b', blob, flags=re.I):
            errors.append(f'{seed}: pet word')
        if 'http://' in blob or 'https://' in blob or '…' in blob or '...' in blob:
            errors.append(f'{seed}: url or ellipsis')
        v0 = _option(item['vocab'][0], 40)
        guided = item['guided'].strip()
        stem1 = guided if guided.endswith('?') else guided + ' Which response is most accurate?'
        stems = [
            stem1,
            f'Which statement is a common mistake when working with {v0}?',
            f'Which response best applies {v0} with new evidence?',
            f'Which response best evaluates {focus} when analysing {v0}?',
            f'Which evidence move best supports a claim about {v0}?',
            f'Which choice best applies this lesson idea about {v0}?',
            f'Which action keeps {focus} accurate for {v0}?',
            f'Which independent response best applies {v0} to new material?',
        ]
        norms = [norm(stem) for stem in stems]
        if len(set(norms)) != len(norms):
            errors.append(f'{seed}: duplicate stems')
        for i, left in enumerate(norms):
            for right in norms[i + 1:]:
                if len(left) > 40 and len(right) > 40 and (
                    left.startswith(right[:40]) or right.startswith(left[:40])
                ):
                    errors.append(f'{seed}: near-duplicate stem {left[:50]!r} vs {right[:50]!r}')
        for part in fields:
            if part in seen_full:
                errors.append(f'{seed}: repeated field text')
            seen_full.add(part)
        if item['independent'] in item['model'] or item['independent'] in item['guided'] or item['independent'] in item['principle']:
            errors.append(f'{seed}: independent leaked')
    for seed, visuals in VISUALS.items():
        if len(visuals) != 2:
            errors.append(f'{seed}: visual count')
        for visual in visuals:
            svg = visual['svg']
            if re.search(r'LEARN.*TRY.*CHECK|step one.*step two', svg, flags=re.I):
                errors.append(f'{seed}: generic visual')
            if re.search(r'\bpets?\b', visual['alt'] + visual['caption'], flags=re.I):
                errors.append(f'{seed}: pet in visual')
    return errors


def main():
    errors = preflight(LESSONS)
    if errors:
        for error in errors:
            print('PREFLIGHT', error)
        return 1
    written = write_elective_batch(
        LESSONS,
        VISUALS,
        subject='technology',
        source_url=SOURCE_URL,
        source_note=SOURCE_NOTE,
        out_dir=OUT_DIR,
    )
    print('Seeds written:', ', '.join(written))
    return 0 if written == SEEDS else 1


if __name__ == '__main__':
    raise SystemExit(main())
