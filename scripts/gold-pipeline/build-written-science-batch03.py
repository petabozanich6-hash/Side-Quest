#!/usr/bin/env python3
"""Year 3 Science Written Core batch 03: structures finish + forces start w13-l1 through w18-l2 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

SCI, PQU, DDT = 'ST2-SCI-01', 'ST2-PQU-01', 'ST2-DDT-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='science', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-sci-y3-w13-l1',DDT,['design process','need','ideas','evaluate'],
  'The design process moves through understanding a need, generating ideas, choosing and making, testing and improving — not decorating first.',
  'Need: hold three pencils on a desk edge. Ideas: cup, folded card tray, clipped pouch. Choose tray → make → test tip-over → add wider base.',
  'Order these steps for a lunch-box divider: test with fruit; list needs; sketch three ideas; build one.',
  'List needs → sketch ideas → build → test (typical productive order).',
  'Skipping testing means you never know if the need was met.',
  'Write a design-process poster with five stages and one sentence each. Apply it to a tiny brief (hold two erasers) through sketch and paper prototype.'),
L('s2-sci-y3-w13-l2',DDT,['brief','criteria','constraint','idea'],
  'A design brief includes the job, success criteria and constraints (limits on materials, size, time or safety).',
  'Brief: bridge a 20 cm gap holding 10 coins. Criteria: no sag to table. Constraints: one A4 card, tape only, 30 minutes.',
  'Write criteria and constraints for: a windproof bookmark made from scrap paper.',
  'Criteria e.g. stays in book, not torn by light breeze; constraints: scrap only, no glue if banned.',
  'Criteria that only say “looks cool” do not tell you when the job is done.',
  'Create a full brief for a classroom helper object. List three criteria and three constraints. Sketch two ideas that both meet the brief.'),
L('s2-sci-y3-w14-l1',DDT,['prototype','build','test','record'],
  'A prototype is a first working version used to test ideas quickly. Build safely, then record what happens under test.',
  'Paper tower prototype: roll tubes, tape base, add coin loads. Record height, coins held, failure mode (squash/tip).',
  'List three things to record when testing a pencil holder prototype.',
  'e.g. whether pencils stay, tip-over yes/no, time to build, one failure note.',
  'Building once and never testing leaves the design unproven.',
  'Build a scrap prototype for your brief. Run three tests. Complete a results table and photo/sketch of the prototype.'),
L('s2-sci-y3-w14-l2',DDT,['improve','feedback','change','retest'],
  'Improving a design means changing one feature at a time based on test evidence, then retesting.',
  'Tower tipped → widen base (one change) → retest coins. If still weak, thicken tubes next — do not change everything at once.',
  'Prototype sagged in the middle. Suggest one improvement and what you would remeasure.',
  'Add a centre support or fold a ridge; remeasure coins held or sag amount.',
  'Random decoration after a fail does not count as an evidence-based improvement.',
  'Improve your prototype with one justified change. Retest with the same method. Write before/after results and the reason the change helped or did not.'),
L('s2-sci-y3-w15-l1',DDT,['present','audience','evidence','solution'],
  'Presenting a design solution tells the audience the need, your choice, test evidence and next improvement — with clear visuals.',
  'Talk structure: Need → Idea chosen → How tested → Results (numbers) → Improvement. Show the prototype or a labelled photo.',
  'Write three sentences you would say about a bridge that held 12 coins then failed at 13.',
  'Must include need, result numbers and next fix idea.',
  'Showing only a pretty photo without test numbers is a weak presentation.',
  'Prepare a 1–2 minute presentation (script + one visual) for your structure project. Include criteria, results and one next step.'),
L('s2-sci-y3-w15-l2',DDT,['review','structure','design','test'],
  'Structures unit review connects structure types, strong shapes, fair strength tests and the design–build–test–improve cycle.',
  'Review path: structure parts → triangle/arch → fair test → brief → prototype improve → present with evidence.',
  'Mini: why add a diagonal; one fair-test control; one design-process stage after testing.',
  'Triangles brace; same span/materials; improve/retest (or present).',
  'Review without test language misses the engineering idea.',
  'Complete a 12-item structures review. Outline one brief→test→improve story in four bullets. List two next goals.'),
L('s2-sci-y3-w16-l1',SCI,['force','push','pull','motion'],
  'A force is a push or a pull. Forces can start, stop, speed up, slow down or change the direction of motion.',
  'Kick a ball (push) → starts moving. Pull a drawer → opens. Push a swing → changes motion each push.',
  'Label push or pull: opening a zipper; pressing a doorbell; towing a toy car by string; leaning on a wall.',
  'Pull; push; pull; push (contact push).',
  'Thinking forces only exist when you see fast motion misses still pushes (leaning on a wall).',
  'List twelve everyday actions as push or pull. For four of them say how motion changed (start/stop/faster/slower/direction).'),
L('s2-sci-y3-w16-l2',SCI,['force','move','direction','contact'],
  'Forces that make things move often act by contact (hands, bats, wind on sails as air contact). Direction of the force relates to direction of motion change.',
  'Push a book right → slides right. Hit a ball forward → moves forward. A larger push can make a larger speed change on the same object.',
  'Predict direction: pull a cart toward you; push a trolley away. What motion change?',
  'Cart moves toward you; trolley moves away — force direction matches the motion change.',
  'Saying the ball “wanted” to move avoids naming the force.',
  'Set up five safe motion demos (toy cars/balls). Record force type, direction and motion change. Draw arrows on sketches for three demos.'),
L('s2-sci-y3-w17-l1',SCI,['friction','surface','grip','slide'],
  'Friction is a force between surfaces that opposes sliding. Rougher contact often means more friction; smoother often means less.',
  'Rubber soles grip tiles better than socks. Oil on a surface can reduce friction. Friction helps us walk without slipping and also warms rubbed hands.',
  'Order likely friction high→low for a toy car: carpet; smooth wood; icy-style plastic sheet (if available).',
  'Carpet highest; wood middle; smooth plastic lowest (typical).',
  'Thinking friction is only “bad” ignores how it helps us walk and hold objects.',
  'Test a block or shoe sole on three surfaces. Measure slide distance with the same gentle push (or ramp). Table results and conclude which surface had most friction.'),
L('s2-sci-y3-w17-l2',PQU,['fair test','ramp','friction','measure'],
  'A fair friction ramp test keeps ramp height, object and release method the same, changing only the surface material.',
  'Same toy car, same ramp height, release without pushing. Surfaces: sandpaper, paper, plastic. Measure distance past ramp end.',
  'Which change would make the test unfair: taller ramp for sandpaper only? How fix?',
  'Unfair — use the same height for every surface.',
  'Pushing harder on the surface you expect to win ruins fairness.',
  'Run the fair ramp test with three surfaces. Record distances. Conclude which had most friction with evidence. List what you kept the same.'),
L('s2-sci-y3-w18-l1',SCI,['gravity','fall','pull','Earth'],
  'Gravity is a pull toward Earth that makes unsupported objects fall and gives us weight. On Earth it acts downward toward the ground.',
  'Drop a ball and a scarf: both fall, though air can slow some objects. Jump up — gravity pulls you back down. Scales measure weight from gravity’s pull.',
  'True or fix: “Gravity only works on heavy things.” “Gravity pulls down toward Earth.”',
  'False — acts on all objects; second statement is the useful Year 3 idea.',
  'Thinking astronauts have “no gravity” in orbit oversimplifies — they are in free fall (stretch idea only if ready).',
  'Do three safe drop demos (same height). Record what falls and how air might change the motion for a flat sheet vs crumpled sheet. Write a gravity definition in your words.'),
L('s2-sci-y3-w18-l2',SCI,['air resistance','surface','slow','compare'],
  'Air resistance is a push from air against a moving object. Larger flat surfaces often slow falling more than tight crumpled shapes of the same paper.',
  'Flat tissue falls slowly; same tissue crumpled falls faster. Parachutes use a large canopy to increase air resistance.',
  'Predict: which hits first from the same height — flat A4 or tightly crumpled A4? Why?',
  'Crumpled usually sooner; flat has more air resistance.',
  'Calling air resistance “anti-gravity” confuses two different ideas.',
  'Fair drop test: flat vs crumpled paper (same height, same time start). Repeat three times. Table results and conclude about air resistance with evidence.'),
]

VISUALS = {
 's2-sci-y3-w13-l1': [pair_visual('Need','job to solve','Ideas','several options','Design process start.','Test before declaring done.'),
  pair_visual('Make → test','see what fails','Improve','change then retest','Design cycle middle.','Decorate after function.')],
 's2-sci-y3-w13-l2': [pair_visual('Criteria','how you know success','Constraints','limits on build','Brief parts.','Cool looks ≠ criteria.'),
  pair_visual('Bridge brief','span + coin load','Limits','one card + tape','Example brief.','Two ideas can both fit.')],
 's2-sci-y3-w14-l1': [pair_visual('Prototype','first working version','Test','record results','Prototype purpose.','Numbers beat guesses.'),
  pair_visual('Record','height / coins / fail mode','Photo','labelled sketch','What to capture.','Three tests minimum.')],
 's2-sci-y3-w14-l2': [pair_visual('Evidence','what the test showed','One change','then retest','Improvement discipline.','Do not change everything at once.'),
  pair_visual('Before','coins held','After','new result','Before/after comparison.','Decoration is not a fix.')],
 's2-sci-y3-w15-l1': [pair_visual('Present','need → idea → test','Evidence','numbers + visual','Presentation structure.','Photo alone is weak.'),
  pair_visual('Next step','named improvement','Audience','hears criteria','Closing the talk.','Keep script to 1–2 minutes.')],
 's2-sci-y3-w15-l2': [pair_visual('Review path','parts → shapes → fair test','Then','brief → improve → present','Structures review path.','Use test language.'),
  pair_visual('Mini','diagonal brace; same span','After test','improve','Compact structures review.','List next goals.')],
 's2-sci-y3-w16-l1': [pair_visual('Push','away contact','Pull','toward you','Forces as push or pull.','Still pushes count too.'),
  pair_visual('Motion change','start stop faster slower','Or','change direction','What forces can do.','Name the force, not wishes.')],
 's2-sci-y3-w16-l2': [pair_visual('Force arrow','direction of push/pull','Motion','changes that way','Force and motion link.','Contact forces common here.'),
  pair_visual('Demo','toy car / ball','Record','type + direction','Motion demo notes.','Sketch arrows on three.')],
 's2-sci-y3-w17-l1': [pair_visual('Friction','opposes sliding','Rough','often more grip','Friction idea.','Friction also helps walking.'),
  pair_visual('Carpet','higher friction','Smooth plastic','lower friction','Surface comparison.','Same push when comparing.')],
 's2-sci-y3-w17-l2': [pair_visual('Ramp fair test','same height + car','Change','surface only','Fair friction controls.','No extra pushes.'),
  pair_visual('Measure','distance past ramp','Conclude','most friction surface','Ramp test evidence.','List what stayed the same.')],
 's2-sci-y3-w18-l1': [pair_visual('Gravity','pull toward Earth','Effect','things fall / weight','Gravity idea.','Acts on all objects.'),
  pair_visual('Drop','ball and scarf','Both','fall downward','Everyday gravity evidence.','Write your definition.')],
 's2-sci-y3-w18-l2': [pair_visual('Air resistance','air pushes back','Large flat','often slower fall','Air resistance idea.','Not the same as gravity.'),
  pair_visual('Flat sheet','more resistance','Crumpled','less resistance','Paper drop comparison.','Repeat three times.')],
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
