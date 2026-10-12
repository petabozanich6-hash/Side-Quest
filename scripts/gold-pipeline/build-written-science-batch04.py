#!/usr/bin/env python3
"""Year 3 Science Written Core batch 04: forces finish + Earth/Sun/Moon start w19-l1 through w24-l2 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

SCI, PQU = 'ST2-SCI-01', 'ST2-PQU-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='science', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-sci-y3-w19-l1',SCI,['magnet','attract','repel','pole'],
  'Magnets can attract (pull toward) some materials and can repel (push away) when like poles face each other. Opposite poles attract.',
  'North facing south → attract. North facing north → repel. Magnets attract iron/steel paperclips but not typical plastic or aluminium foil strongly.',
  'Predict: two north ends together; north and south together; magnet near wooden block.',
  'Repel; attract; little/no attraction to wood.',
  'Thinking all metals are magnetic is false — copper and aluminium usually are not.',
  'Test a magnet with ten objects. Table attract/not. Show attract and repel with two magnets. Write the pole rule in your words.'),
L('s2-sci-y3-w19-l2',SCI,['magnetic','material','test','sort'],
  'Magnetic materials are attracted to magnets (many iron/steel objects). Non-magnetic materials are not attracted even if they are metal.',
  'Sort: steel spoon (magnetic); plastic ruler (not); aluminium can (usually not); iron nail (magnetic).',
  'A coin might be mixed alloys — how do you decide scientifically?',
  'Test with a magnet and record the result rather than guessing from colour.',
  'Sorting by “looks shiny” is not a magnetic test.',
  'Sort sixteen objects into magnetic/not using a magnet. Include three metals that are not magnetic if available. Write one surprise result.'),
L('s2-sci-y3-w20-l1',SCI,['force','playground','toy','identify'],
  'Playgrounds and toys show pushes, pulls, friction, gravity and sometimes magnetism working together.',
  'Slide: gravity pulls down; friction with the surface slows you. Swing: pushes start motion; gravity changes the path. Magnetic toy crane: magnet attracts steel loads.',
  'On a scooter: name one push, one friction example and where gravity acts.',
  'Push on the ground/handle; friction on wheels/brake; gravity pulls rider/scooter down.',
  'Naming only “fun forces” without push/pull/friction/gravity language is incomplete.',
  'Choose five toys or playground actions. For each, name two forces involved and how motion changes. Sketch one with force arrows.'),
L('s2-sci-y3-w20-l2',SCI,['review','force','friction','magnet'],
  'Forces unit review connects pushes/pulls, friction, gravity, air resistance and magnets with fair-test habits.',
  'Review path: push/pull → friction surfaces → gravity/air → magnet poles → playground forces.',
  'Mini: force that slows a slide; pole pair that repels; fair ramp control.',
  'Friction; like poles; same height/car.',
  'Review labels without examples are weaker.',
  'Complete a 12-item forces review. Include one fair-test outline. List two next goals.'),
L('s2-sci-y3-w21-l1',SCI,['day','night','Earth','spin'],
  'Day and night happen because Earth spins (rotates). The side facing the Sun has day; the side facing away has night.',
  'Torch as Sun, ball as Earth: spin the ball — half lit, half dark. People on the lit side see day; on the dark side see night.',
  'If it is day where you are, what is likely on the opposite side of Earth?',
  'Night (approximately opposite).',
  'Thinking the Sun moves around Earth each day is a common alternative idea; the Year 3 model uses Earth’s spin.',
  'Build a ball-and-torch day/night model. Draw day and night on a circle diagram. Write two sentences using spin/rotate language.'),
L('s2-sci-y3-w21-l2',SCI,['model','rotate','torch','observe'],
  'Modelling Earth’s spin with a globe/ball and lamp helps show why the Sun appears to rise and set without the Sun racing around us.',
  'Mark a sticker “home” on the ball. Slow spin: sticker moves into light (sunrise) and out (sunset). Keep the lamp still.',
  'What should stay still in the model — lamp or ball’s centre light source idea? What moves?',
  'Lamp (Sun) stays; Earth ball rotates.',
  'Moving both torch and ball wildly makes the model confusing.',
  'Run the sticker sunrise/sunset demo three times. Record what you saw at sticker morning/midday/evening positions. Write how the model matches real day/night.'),
L('s2-sci-y3-w22-l1',SCI,['shadow','Sun','block','direction'],
  'Shadows form when an opaque object blocks light. Outdoor shadow direction and length relate to the Sun’s position in the sky.',
  'Morning Sun lower → longer shadows one way; midday Sun higher → shorter shadows; afternoon shadows swing the other way.',
  'If your shadow points away from the Sun, where is the light coming from relative to you?',
  'From the opposite side — Sun is opposite the shadow direction.',
  'Thinking shadows are “pools of dark paint” misses that they are regions without direct light.',
  'Draw three outdoor shadows (morning/midday/afternoon if possible, or lamp demo). Label light source, object and shadow. Note length/direction changes.'),
L('s2-sci-y3-w22-l2',PQU,['shadow','length','time','record'],
  'Investigating shadow length through the day needs the same object, same ground spot and recordings at different clock times.',
  'Stake in playground: measure shadow length at 9:00, 11:00, 1:00. Keep stake upright. Table time vs length.',
  'Why must the stake stay the same height and place?',
  'So length changes are due to Sun position/time, not a different object.',
  'Measuring different objects at each time makes the pattern meaningless.',
  'Record at least three shadow lengths for one object. Graph or table the results. Conclude when the shadow was shortest and why using Sun height ideas.'),
L('s2-sci-y3-w23-l1',SCI,['season','tilt','year','pattern'],
  'Seasons are yearly patterns of weather and day length. A useful Stage 2 model links seasons to Earth’s yearly path and tilt (keep language age-right: tilt means parts of Earth lean toward/away from Sun across the year).',
  'In Australia, summer tends to be warmer with longer days; winter cooler with shorter days. Seasons reverse between northern and southern hemispheres.',
  'Sort typical NSW: beach weather and long daylight; frost mornings and early dark — which seasons?',
  'Summer-like; winter-like.',
  'Thinking Earth is closer to the Sun in summer (only) is a common mix-up; tilt/day length ideas matter more in the school model.',
  'Make a seasons poster for your place: typical weather, day length idea and two living-thing changes per season. State Australia/NSW context.'),
L('s2-sci-y3-w23-l2',SCI,['season','living things','adapt','cycle'],
  'Living things respond to seasons: some plants flower in spring; some animals grow thicker coats or migrate; deciduous trees may lose leaves in cooler months.',
  'Jacarandas flowering can mark warmer months in some Australian places. Birds may nest when food is plentiful. Garden vegetables have planting seasons.',
  'Give one plant and one animal seasonal change you can observe locally.',
  'Answers vary — must link to a season and a living-thing response.',
  'Assuming all trees lose leaves in Australian winters ignores many evergreen species.',
  'Survey six living things (real or photo) for seasonal clues. Table: living thing / season clue / how it helps survival or growth.'),
L('s2-sci-y3-w24-l1',SCI,['Moon','phase','shape','cycle'],
  'The Moon’s phases are the changing lit shapes we see over about a month as the Moon orbits Earth and sunlight lights different parts from our view.',
  'New moon: dark from Earth. Crescent: thin lit slice. First quarter: half lit. Full: fully lit disc. Then back through gibbous/crescent.',
  'Order: new → crescent → first quarter → full (simplified). What comes after full toward new again?',
  'Gibbous then crescent getting thinner (waning) toward new.',
  'Thinking Earth’s shadow causes the monthly phases confuses phases with eclipses.',
  'Make a phase diagram with four named shapes. Use a ball and torch to show lit portions. Write that sunlight and Moon’s position cause the pattern.'),
L('s2-sci-y3-w24-l2',SCI,['record','Moon','date','pattern'],
  'Recording the Moon over time (sketch + date) reveals the repeating phase pattern even if some nights are cloudy.',
  'Diary: date, time, sketch of lit shape, weather. After two weeks you should see the lit part grow or shrink in sequence.',
  'Why record the date beside each sketch?',
  'So you can see order and roughly how long between shapes.',
  'Sketching from memory a week later without dates loses the evidence trail.',
  'Keep a Moon diary for at least eight nights (or use reliable class photos). Order sketches and write two pattern sentences. Note cloudy gaps honestly.'),
]

VISUALS = {
 's2-sci-y3-w19-l1': [pair_visual('Attract','opposite poles','Repel','like poles','Magnet pole rules.','Not all metals are magnetic.'),
  pair_visual('Paperclip','attracted','Plastic','not attracted','Magnetic vs not.','Show both attract and repel.')],
 's2-sci-y3-w19-l2': [pair_visual('Test','use a magnet','Sort','magnetic / not','Magnetic materials test.','Shiny ≠ magnetic.'),
  pair_visual('Steel','usually yes','Aluminium','usually no','Metal differences.','Record surprises.')],
 's2-sci-y3-w20-l1': [pair_visual('Slide','gravity + friction','Swing','pushes + gravity','Playground forces.','Name two forces each time.'),
  pair_visual('Scooter','push and friction','Arrows','on a sketch','Toy force diagrams.','Avoid vague “fun force”.')],
 's2-sci-y3-w20-l2': [pair_visual('Review path','push/pull → friction','Then','gravity → magnets','Forces unit review.','Examples strengthen answers.'),
  pair_visual('Mini','friction; like poles','Fair ramp','same height','Compact forces review.','List next goals.')],
 's2-sci-y3-w21-l1': [pair_visual('Earth spins','lit side day','Dark side','night','Day and night model.','Sun stays; Earth rotates.'),
  pair_visual('Torch','Sun stand-in','Ball','Earth stand-in','Ball-and-torch demo.','Opposite side is night.')],
 's2-sci-y3-w21-l2': [pair_visual('Sticker home','into light = sunrise','Out of light','sunset','Sunrise/sunset on a model.','Keep the lamp still.'),
  pair_visual('Still','lamp','Moves','Earth ball','What moves in the model.','Wild motion confuses learners.')],
 's2-sci-y3-w22-l1': [pair_visual('Shadow','blocked light','Sun low','longer shadow','Shadow basics.','Shadow opposite the Sun.'),
  pair_visual('Midday','shorter shadow','Afternoon','swings direction','Shadow through the day.','Not a pool of paint.')],
 's2-sci-y3-w22-l2': [pair_visual('Same stake','same place','Different times','length changes','Fair shadow investigation.','Do not swap objects.'),
  pair_visual('Table','time vs length','Shortest','near midday often','Shadow length evidence.','Graph or table results.')],
 's2-sci-y3-w23-l1': [pair_visual('Season','yearly pattern','Australia','summer longer days','Seasons in context.','Tilt/day length matter.'),
  pair_visual('Summer','warmer longer light','Winter','cooler shorter light','Season contrasts.','NSW examples on poster.')],
 's2-sci-y3-w23-l2': [pair_visual('Plants','flower / grow cycles','Animals','coats / nesting','Living things and seasons.','Evergreens may keep leaves.'),
  pair_visual('Survey','six living things','Clue','linked to a season','Seasonal observation table.','Survival or growth link.')],
 's2-sci-y3-w24-l1': [pair_visual('Phases','lit shapes change','Cause','sunlight + Moon position','Moon phase idea.','Not Earth’s monthly shadow.'),
  pair_visual('New → crescent','→ quarter → full','Then','waning back','Phase sequence.','Ball and torch help.')],
 's2-sci-y3-w24-l2': [pair_visual('Diary','date + sketch','Pattern','grows or shrinks','Moon recording.','Cloudy nights noted honestly.'),
  pair_visual('Order','sketches in time','Sentences','two pattern claims','Diary evidence.','Dates keep the trail.')],
}

def create():
    assert len(LESSONS) == 12
    db = reconstruct()
    try:
        for u in LESSONS:
            row = db.execute('SELECT * FROM lessons WHERE seed_key=?', (u['seed_key'],)).fetchone()
            if row is None:
                raise ValueError(u['seed_key'])
            base = baseline_data(row)
            bundle = build_from_spec(base, u, VISUALS[u['seed_key']], subject='science')
            atomic_json(ROOT / 'lesson-pipeline/authored' / f"{u['seed_key']}.json", bundle)
            print('Written Core science bundle:', u['seed_key'])
    finally:
        db.close()

if __name__ == '__main__':
    create()
