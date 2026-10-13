#!/usr/bin/env python3
"""Year 7 Visual Arts drawing Written Core: twelve pencil-and-paper lessons.

Identity fields stay on the catalogue rows. Outcome VA4-AMP-01 is a proposed
alignment only; this script does not certify NESA, educational, or release approval.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / 'scripts' / 'gold-pipeline'))

from assessment_quiz import _option
from elective_batch import write_elective_batch
from written_bundle import pair_visual

CODE = 'VA4-AMP-01'
SOURCE_URL = (
    'https://curriculum.nsw.edu.au/learning-areas/creative-arts/'
    'visual-arts-7-10-2024/outcomes'
)
SOURCE_NOTE = (
    'Proposed Stage 4 alignment to Visual Arts 7–10 (2024) outcome VA4-AMP-01. '
    'Content-point mapping pending. Not NESA verified. Pencil and paper only.'
)
OUT = Path(__file__).resolve().parent / 'authored'


def L(seed, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(
        seed_key=seed, code=CODE, subject='arts', vocab=vocab,
        principle=principle, model=model, guided=guided, feedback=feedback,
        misconception=misconception, independent=independent,
    )


def V(left_title, left_text, right_title, right_text, alt, caption):
    return pair_visual(left_title, left_text, right_title, right_text, alt, caption)


LESSONS = [
L('s5-visual-arts-y9-w01-l1',
  ['contour line', 'slow looking', 'outer edge', 'unshaded drawing'],
  'A contour line follows the edges you actually see on one still mug, slowly and with no shading. '
  'Sit so the mug does not move, rest your eyes on the rim, the side and the handle, and let the pencil travel only as fast as your looking. '
  'This first drawing is an outer edge study: if you are unsure, stop, look again, and continue the same edge rather than inventing a mug from memory.',
  'Sam draws one slow contour of a plain white kitchen mug and leaves every area unshaded. '
  'He starts where the handle meets the body, follows the outer rim as an ellipse, comes down the side, and returns along the handle. '
  'His pencil pauses whenever his eye pauses, so small changes in the rim stay in the line. The paper remains light because shading is a later lesson.',
  'Where should your eyes rest, and which edges should the contour follow, when you draw a chipped enamel mug before any shading?',
  'Keep your eyes on the enamel mug, and draw the rim, the chip and the outer handle as edges you see, still with no shading. '
  'A chip is part of the contour if you can see it; do not smooth it away to make a perfect symbol. '
  'The line can be imperfect as long as it was made while looking.',
  'A neat mug symbol drawn from memory, then shaded heavily, is a better first contour than a slow line made while looking.',
  'Choose a green lidded travel mug you have not drawn in the examples. Make one slow pencil contour of its outer edges and lid, with no shading, and name two edges your eyes followed.'),

L('s5-visual-arts-y9-w01-l2',
  ['blind contour', 'careful contour', 'eye training', 'line control'],
  'A blind contour keeps your eyes on the object the whole time, so the line trains looking even when it wobbles. '
  'A careful contour lets you glance at the paper to place the line, then return your eyes to the object. '
  'Blind work trains sustained looking. Careful work trains looking plus control of where the line sits. Neither exercise is cheating, and neither replaces the other.',
  'Priya draws a spoon twice, once blind and once with short glances to place the line. '
  'In the blind drawing her eyes stay on the spoon, so the bowl’s bump appears even though the line wanders. '
  'In the careful drawing she looks, draws a short edge, glances to see where the pencil landed, and looks back. The second line joins more cleanly because the glance is only for placement.',
  'Two drawings of a jug are side by side: one made without looking at the paper, and one made with brief glances. What does each drawing train?',
  'The no-look drawing trains sustained looking, so a wobble can be evidence of attention, while the glance drawing trains looking plus placement. '
  'Use the blind sheet to notice edges you skipped, then use the careful sheet to put those edges where they belong. '
  'Do not throw away the wobbly sheet; it shows what the eye found.',
  'A wobbly blind contour is simply a failed drawing, so only neat careful outlines are worth keeping.',
  'Draw a metal watering can twice in pencil: one blind contour with your eyes on the can, and one careful contour with glances. Write what the blind line trained and what the careful line trained.'),

L('s5-visual-arts-y9-w02-l1',
  ['negative space', 'handle gap', 'positive shape', 'enclosed shape'],
  'Negative space is the shape of the air around an object, including the hole inside a mug handle. '
  'That enclosed gap is a shape you can draw, and it often makes the handle more accurate than a remembered loop. '
  'The ceramic body is the positive shape. Name the gap first, for example a tall skinny D or a narrow triangle, then draw the handle around it.',
  'Leo draws the hole in a ceramic mug handle as a closed shape before the outer handle. '
  'He looks until he can say the gap is taller than it is wide and slightly pinched at the top. '
  'He draws that air shape, then the ceramic around it. The handle stops looking like a generic circle because the gap decided the curve.',
  'A cup handle has a narrow triangular gap of air. How do you use that negative shape, rather than a remembered loop, to draw the handle?',
  'Draw the triangular air gap first as its own closed shape, then wrap the handle around that gap. '
  'If the triangle is too wide, the handle will be too thick even when the outer line looks smooth. '
  'Check the gap by looking, not by recalling the word handle.',
  'The hole in a handle is empty nothing, so you only draw the solid handle and ignore the air shape.',
  'On a stovetop kettle, draw the enclosed air gap in the handle as a shape, then the handle around it. Label the gap as negative space and the kettle body as the positive shape.'),

L('s5-visual-arts-y9-w02-l2',
  ['proportion', 'pencil measure', 'width comparison', 'height unit'],
  'Proportion is the comparison of one seen size with another, such as height against width. '
  'Hold a pencil at arm’s length, close one eye, put the tip at the top of the object and slide your thumb to the bottom: that gap is one height unit, not a centimetre measurement. '
  'Turn the pencil sideways without moving your thumb, see how the width compares, and stay in the same seat so the unit does not change.',
  'Aisha marks a jam jar’s height with her thumb on a pencil held at arm’s length. '
  'She locks her elbow, closes one eye, aligns the tip with the lid and her thumb with the base. '
  'She turns the pencil horizontal and finds the jar’s width is about one of those same units, so her drawing is about as wide as it is tall. If she leans closer she re-measures, because a bent elbow changes the unit.',
  'A book standing upright looks about twice as tall as it is wide. How do you use one thumb mark on a pencil to check that proportion before you draw?',
  'Mark the book height on the pencil, then turn that same thumb gap sideways to compare width. '
  'Two width units fit in the height, so the drawing should be about twice as tall as it is wide. '
  'This compares what you see from your seat. It is not a ruler reading taken on the table.',
  'Proportion means guessing a familiar shape from memory, or copying centimetres with a ruler laid on the real object.',
  'Use a pencil at arm’s length to compare the height and width of a closed lunchbox. Write the comparison in words, then sketch only the lunchbox using that proportion.'),

L('s5-visual-arts-y9-w03-l1',
  ['light direction', 'shadow shape', 'cast shadow', 'lamp setup'],
  'Light direction is where the light reaches your object in your own setup, such as a window or a desk lamp. '
  'The cast shadow is one shape on the table, with edges you can draw, and it falls on the opposite side from the light. '
  'Name the bright side first, outline that single shadow, and do not scribble a grey halo all around the object.',
  'Noah’s lamp is on the left, so one shadow shape stretches to the right of the mug. '
  'The left side of the mug is the bright side. On the table he sees a long bounded shape, not a fog, and he draws its outline before any dark filling. '
  'He describes his own lamp. He does not borrow a story about a gallery artwork.',
  'Your window is on the right of a bottle. Where is the bright side, and what single shadow shape would you draw on the table?',
  'The bright side faces the right-hand window, and the cast shadow is one shape stretching to the left. '
  'Draw that shape’s edges first. A shadow has a direction because the light has a direction. '
  'If you move the bottle, look again before you keep the old shadow.',
  'Shadows should be scribbled all around the object, because shade is a mood rather than a shape caused by a light source.',
  'Set a torch to the left of an apple on paper. Name that light direction, outline one cast-shadow shape only, and leave artist names and gallery stories out of the note.'),

L('s5-visual-arts-y9-w03-l2',
  ['tone', 'light value', 'mid value', 'dark value'],
  'Tone is how light or dark a pencil mark is on a simple form. '
  'Three values are enough for this study: light left as mostly bare paper, mid as even light hatching, and dark as closer marks. '
  'Put the light value on the side the lamp reaches, the mid value where the form turns, and the dark value on the far side and in the cast shadow.',
  'Hana uses blank paper, light hatching and dense lines as three values on a tin. '
  'The tin is lit from the left, so the left side stays almost the colour of the paper. '
  'The front is hatched lightly for the mid value, and the right side plus the small shadow underneath receive closer lines. She does not cover the whole tin in one grey.',
  'A ball is lit from above and slightly from the left. Where do light, mid and dark belong if you may use only those three values?',
  'Leave the upper-left lit side mostly blank, hatch the middle lightly, and place the darkest marks on the lower-right and the small cast shadow. '
  'Three values turn the outline into a form because the eye can see a clear change. '
  'If every part is equally dark, the ball stays flat.',
  'Pressing hard over the whole form makes a drawing more realistic, so no paper should be left bare.',
  'Shade a pear with only three pencil values. Add a tiny key labelled light, mid and dark, and keep the lit side mostly bare paper.'),

L('s5-visual-arts-y9-w04-l1',
  ['texture mark', 'rough mark', 'smooth mark', 'line rhythm'],
  'Texture marks are lines that suggest how a surface might feel, not just its outer edge. '
  'Rough surfaces can be shown with short, broken, uneven marks, while smooth surfaces use longer, more even lines. '
  'The rhythm of the mark carries the texture. Darkness alone does not, because a smooth surface can be dark and a rough surface can be light.',
  'Jo uses long even lines on ceramic and short broken strokes on a wooden board. '
  'The mug’s side gets continuous lines of similar length, so it reads as smooth. '
  'The board gets clustered, broken marks with small gaps, so it reads as rough. She can still add tone later, but the texture is already in the line.',
  'How should your line change if you draw a smooth metal spoon beside a rough stone, using marks rather than colour words?',
  'Use longer, even lines for the spoon’s smooth metal, and short broken overlapping marks for the stone. '
  'Keep the spoon’s marks similar to each other. Let the stone’s marks change direction and leave little gaps. '
  'You are describing surface, not labelling the objects in writing on the drawing.',
  'Texture only means pressing harder for rough things and more lightly for smooth things, which confuses texture with tone.',
  'Draw a smooth glass marble and a rough pine cone with pencil marks only. Use even lines for the marble and broken marks for the cone, then name which mark suggests which surface.'),

L('s5-visual-arts-y9-w04-l2',
  ['rule of thirds', 'placement', 'composition choice', 'empty space'],
  'The rule of thirds is a placement choice, not a law you must obey. '
  'Imagine the page divided into three columns and three rows, and you may put the object near a crossing so empty space has a job. '
  'Centring the object is equally allowed when you want a still, formal picture. Say why you chose, because the grid does not grade the drawing by itself.',
  'Mina places a mug near the left third so empty space leads the eye. '
  'She lightly imagines two vertical and two horizontal divisions, sits the mug near a left crossing, and lets the table occupy the right side. '
  'She notes that a centred mug would feel more formal, and she is choosing the off-centre page on purpose so the handle has room.',
  'You may centre a shoe or place it near a thirds crossing. Which placement will you choose, and what picture reason supports it?',
  'Placing the shoe near a right-hand crossing leaves quiet space on the left, which is a balance choice, not a rule. '
  'Centring that same shoe would also be valid if the aim was a formal, still picture. '
  'The stronger note names the choice and the reason. It does not say the grid was obeyed.',
  'Every strong drawing must put the object on a thirds crossing, and a centred object is automatically wrong.',
  'On a fresh page, place a teapot either centred or near a thirds crossing. Write one sentence naming that choice and why it suits this picture, and admit the other placement could also work.'),

L('s5-visual-arts-y9-w05-l1',
  ['viewpoint', 'low angle', 'opening ellipse', 'seen height'],
  'Viewpoint is the height of your eye compared with the object you are drawing. '
  'From up high, looking down, a mug’s opening is a wider ellipse and you see more of the inside. '
  'From a lower seat, looking slightly up, that ellipse flattens, less inside shows, more of the base appears, and the mug looks taller against its opening.',
  'From a lower seat, Eli sees a flatter opening ellipse and a taller-looking mug. '
  'His first drawing, made looking down, had a wide ellipse and a visible inside. '
  'He then sits so his eyes are nearer the table height: the opening closes toward a thinner ellipse, the inside almost disappears, and the lower edge becomes clearer. He does not mix the wide top with the low base in one drawing.',
  'You already drew a cup while looking down, with a wide opening. What should change in a second drawing made from a lower angle?',
  'The opening ellipse should flatten, less of the inside should show, and the cup should look taller. '
  'More of the lower edge or underside can appear. Stay in the lower seat for the whole drawing so the ellipse does not change halfway. '
  'The cup itself did not grow; your eye moved.',
  'Changing where you sit changes nothing in the drawing, because a mug is the same object and must always have the same ellipse.',
  'Draw a jug once from a high viewpoint and once from a floor cushion looking slightly up. Label what happened to the opening ellipse and to the jug’s seen height.'),

L('s5-visual-arts-y9-w05-l2',
  ['critique', 'description', 'one analysis', 'kind revision'],
  'A useful critique describes, analyses one choice, interprets intent and suggests one revision. '
  'Describe only what is visible. Analyse means explaining one choice, such as placement or line weight. '
  'Interpret with evidence, using seems to, because you cannot see a private thought. The revision is one kind, specific change, aimed at the drawing rather than at the person.',
  'Ava describes a bottle drawing, analyses the left placement, and offers one kind revision. '
  'She writes: I see a bottle left of centre and a dark shadow to the right. The left placement leaves open space, which seems to aim for a calm picture because the shadow has room to travel. '
  'One change to try is softening the outline where the shadow meets the bottle, so that edge is not equally heavy all the way around.',
  'A centred mug drawing has three clear values and a scratchy handle. What would a kind four-part critique say about it?',
  'I see a centred mug, three values, and a scratchy handle, and the centre placement feels formal and still. '
  'That formal aim seems deliberate because the mug is isolated with even space around it. '
  'One revision is to rebuild the handle from its air gap so the scratchy loop matches the mug you can see.',
  'Critique means saying you like it or that it is bad, without describing a visible choice or offering one change to try.',
  'Critique a pencil drawing of a lace-up boot that sits low on the page, with a heavy outline and a large empty top half. Use description, one analysis, a cautious intent and one kind revision. Do not score it out of ten.'),

L('s5-visual-arts-y9-w06-l1',
  ['drawing plan', 'planned light', 'value map', 'placement reason'],
  'A drawing plan lists the object, the light, three values and one composition choice. '
  'Write those decisions before the final lines, using the real lamp or window you will draw from. '
  'Name where light, mid and dark will go, and give one reason for the placement. You may change the plan after you look again, but you do not start with a guess.',
  'Samir’s plan names a jug, a right-hand window, three values and a right-third placement. '
  'His value map says blank paper on the right, light hatching on the front, and closer marks on the left plus the cast shadow. '
  'He places the jug on the right third so the shadow has room to travel left. The plan is four decisions, not a finished shaded picture.',
  'Plan a drawing of a lunchbox lit by a lamp on the left. What four decisions belong in the plan, and what is one reason for the placement?',
  'The plan should name the lunchbox, the left lamp, light on the left with mid and dark toward the right, and a placement chosen on purpose. '
  'A left-third placement can give the shadow space to fall right. A centred placement can make the box feel still. '
  'Either reason is acceptable when it matches the picture you mean to make.',
  'A plan wastes time, so the final drawing should start with no decision about light, values or placement.',
  'Write a drawing plan for a backpack on a chair: name the object, where your real light comes from, where light, mid and dark will go, and one composition choice with a reason. Do not make the final drawing yet.'),

L('s5-visual-arts-y9-w06-l2',
  ['independent drawing', 'new object', 'pencil study', 'short reflection'],
  'An independent drawing studies a new object in pencil and then reflects on one choice. '
  'Use only a pencil and paper at your desk. Bring together slow looking, a proportion comparison, one shadow, three values and a placement you can explain. '
  'The reflection names one choice and one revision. It does not need a gallery, a famous artwork, or a copied mug from the earlier exercises.',
  'Nia’s sample reflection explains a garlic drawing: left-third placement, three values, one next revision. '
  'She writes that the contour slowed along the papery edges, the window was on the right so the left side went darker, and the garlic sat on the left third to leave room for the shadow. '
  'Her revision would widen the cast shadow, which she had drawn too short. This sample is a model of the note, not the object you must copy.',
  'A sample note says the artist drew an orange from a low angle and left the lit side blank. Which part is a specific choice, and what is one useful revision question?',
  'The low angle and the blank lit side are specific choices, and a useful question is whether the shadow shape still matches the light. '
  'Specific means a viewer could point to it on the page. '
  'I tried my best is not yet a choice, because it does not name angle, value, placement or line.',
  'Independent work means copying the earlier mug drawings and writing that you tried your best, with no named choice.',
  'Using only a pencil and paper, draw one household torch you have not used in these examples, or a single glove if you have no torch. Include a careful contour, a pencil proportion comparison you can describe, one shadow shape, three values and a placement you chose. Then write a short reflection naming one choice and one revision.'),
]


VISUALS = {
's5-visual-arts-y9-w01-l1': [
    V('Slow contour', 'eye stays on the mug rim', 'No shading yet', 'paper stays light',
      'A slow contour follows the mug rim while the page stays unshaded.',
      'Look longer at the mug than the paper, and draw the edge before any tone.'),
    V('Seen edge', 'rim, side and handle', 'Memory symbol', 'a perfect mug from habit',
      'The seen rim, side and handle compared with a remembered mug symbol.',
      'The contour records edges in front of you, including dents and the handle join.'),
],
's5-visual-arts-y9-w01-l2': [
    V('Blind contour', 'eyes stay on the object', 'Careful contour', 'glance, then look back',
      'Blind contour keeps the eyes on the object; careful contour allows placement glances.',
      'Blind contour trains looking. Careful contour trains looking plus where the line sits.'),
    V('Useful wobble', 'shows an edge you noticed', 'Lost glance', 'drawing from a symbol',
      'A wobble that records a noticed edge beside a line drawn from a remembered symbol.',
      'Keep the blind sheet as evidence of looking, then place those edges in the careful sheet.'),
],
's5-visual-arts-y9-w02-l1': [
    V('Handle gap', 'draw the air shape first', 'Mug body', 'the solid positive shape',
      'The air inside a mug handle drawn as a shape beside the solid body.',
      'The hole is a shape. Draw it, then wrap the handle around that gap.'),
    V('Named gap', 'tall, narrow, pinched', 'Generic loop', 'a circle from memory',
      'A named tall narrow handle gap compared with a generic circular loop.',
      'Say what the gap looks like before you draw it, so the handle is not a symbol.'),
],
's5-visual-arts-y9-w02-l2': [
    V('Height unit', 'thumb marks the full height', 'Width compare', 'turn pencil, same thumb',
      'A pencil marks object height, then turns sideways with the same thumb gap.',
      'One thumb position compares height with width. It is not a centimetre ruler.'),
    V('Same seat', 'elbow stays locked', 'Changed unit', 'leaning closer mid-draw',
      'A locked elbow keeps the pencil unit steady, while leaning closer changes it.',
      'If you move, the comparison changes, so re-measure from the new seat.'),
],
's5-visual-arts-y9-w03-l1': [
    V('Light from left', 'bright side faces the lamp', 'One shadow', 'a shape to the right',
      'A lamp at the left of a mug and one cast shadow shape on the table to the right.',
      'Name your own light, then draw the shadow as one shape on the opposite side.'),
    V('Shadow edge', 'outline the shape first', 'Grey halo', 'scribble all around',
      'One outlined cast shadow compared with a scribble circling the whole object.',
      'A cast shadow has edges because the light comes from a direction you can point to.'),
],
's5-visual-arts-y9-w03-l2': [
    V('Three values', 'blank, light hatch, dense', 'On the form', 'lit side to dark side',
      'Three pencil values: bare paper, light hatching and denser dark marks on a form.',
      'Use only light, mid and dark so the form turns instead of becoming one grey fog.'),
    V('Bare paper', 'the light value is empty', 'All pressed', 'no value change left',
      'Bare paper kept as the light value beside a form pressed dark all over.',
      'Leaving paper bare is a value choice. Covering everything flattens the form.'),
],
's5-visual-arts-y9-w04-l1': [
    V('Smooth ceramic', 'long even lines', 'Rough wood', 'short broken marks',
      'Long even lines for a smooth mug beside short broken marks for rough wood.',
      'Line rhythm can suggest surface. Similar long marks read smoother than broken ones.'),
    V('Mark rhythm', 'spacing and breaks', 'Pressure only', 'hard means rough',
      'Texture shown by mark spacing and breaks, not only by pressing harder.',
      'A rough surface can be lightly drawn and a smooth surface can be dark.'),
],
's5-visual-arts-y9-w04-l2': [
    V('Thirds choice', 'object near a crossing', 'Centred choice', 'formal and still',
      'An object near a thirds crossing beside a centred object, both treated as choices.',
      'Rule of thirds is one way to place the object. Centring is allowed when you mean it.'),
    V('Say why', 'space has a job', 'Grid as law', 'off-centre or wrong',
      'A placement reason about empty space beside the belief that the grid is a law.',
      'Explain the picture you want. The crossings do not automatically make a drawing strong.'),
],
's5-visual-arts-y9-w05-l1': [
    V('Looking down', 'wide opening ellipse', 'Lower angle', 'flatter ellipse, taller',
      'The same mug from above with a wide ellipse and from a lower angle with a flatter ellipse.',
      'Lowering your eye flattens the opening, hides more of the inside and makes the body look taller.'),
    V('One viewpoint', 'stay seated for the drawing', 'Mixed view', 'wide top, low base',
      'One consistent viewpoint compared with a wide top mixed with a low-angle base.',
      'Mixing two eye heights in one drawing makes the mug look broken.'),
],
's5-visual-arts-y9-w05-l2': [
    V('Describe', 'I see the visible parts', 'Analyse one', 'name a real choice',
      'A critique that first describes what is visible, then analyses one artistic choice.',
      'Start from what is on the page. Then explain one choice, such as placement or line weight.'),
    V('Kind revision', 'one change to try', 'Vague score', 'good or bad only',
      'One specific kind revision beside a critique that only says the drawing is good or bad.',
      'Suggest one change the maker can try. Talk about the drawing, not the person.'),
],
's5-visual-arts-y9-w06-l1': [
    V('Before lines', 'object and light source', 'Value map', 'light, mid and dark',
      'A drawing plan that names the object, the light source and three value places.',
      'Decide the object, the real light and where the three values go before the final lines.'),
    V('One placement', 'chosen with a because', 'No decision', 'start and hope',
      'A composition choice with a reason beside starting a drawing with no plan.',
      'One placement reason is enough. The plan can change after you look again.'),
],
's5-visual-arts-y9-w06-l2': [
    V('New object', 'not the practice mug', 'Pencil only', 'paper at the desk',
      'An independent pencil drawing of a new object, made on paper without a gallery visit.',
      'Transfer the unit’s looking skills to a different object using only pencil and paper.'),
    V('Reflection', 'one choice, one revision', 'Empty praise', 'I tried my best',
      'A short reflection naming one choice and one revision beside praise with no choice.',
      'Name something a viewer could point to, then one change you would try next.'),
],
}


def _assert_ready(lessons):
    seen = set()
    for spec in lessons:
        seed = spec['seed_key']
        if seed in seen:
            raise SystemExit(f'duplicate seed {seed}')
        seen.add(seed)
        if len(spec['vocab']) != 4:
            raise SystemExit(f'{seed}: need 4 vocab')
        blob = '\n'.join(spec[k] for k in (
            'principle', 'model', 'guided', 'feedback', 'misconception', 'independent'))
        if 'http' in blob or '…' in blob or '...' in blob:
            raise SystemExit(f'{seed}: url or ellipsis in teaching text')
        keys = ('principle', 'model', 'feedback', 'misconception', 'independent')
        opts = [_option(spec[k]) for k in keys]
        if any(not o for o in opts) or len({o.casefold() for o in opts}) < len(opts):
            raise SystemExit(f'{seed}: option collision {opts}')
        others = spec['model'] + spec['guided'] + spec['feedback'] + spec['misconception'] + spec['principle']
        if spec['independent'] in others:
            raise SystemExit(f'{seed}: independent text leaked')
        norms = []
        for key in ('model', 'guided', 'independent'):
            norms.append(' '.join(''.join(ch.lower() if ch.isalnum() else ' ' for ch in spec[key]).split()))
        if len(set(norms)) < 3:
            raise SystemExit(f'{seed}: model, guided and independent are not distinct')
    if set(VISUALS) != seen:
        raise SystemExit(f'visual keys mismatch {set(VISUALS) ^ seen}')
    for seed, pair in VISUALS.items():
        if len(pair) != 2:
            raise SystemExit(f'{seed}: need two visuals')


if __name__ == '__main__':
    _assert_ready(LESSONS)
    written = write_elective_batch(
        LESSONS, VISUALS, subject='arts', source_url=SOURCE_URL,
        source_note=SOURCE_NOTE, out_dir=OUT)
    print('count', len(written))
