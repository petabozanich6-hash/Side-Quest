#!/usr/bin/env python3
"""Year 3 Mathematics Written Core batch 13: data, chance, investigation w37-l2 through w40-l1 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

DATA1, DATA2, CHAN = 'MA2-DATA-01', 'MA2-DATA-02', 'MA2-CHAN-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='mathematics', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-mat-y3-w37-l2',DATA1,['tally','table','five','total'],
  'Tally marks group responses in fives (four upright strokes and a fifth across). Tables show category and tally/frequency.',
  'Soccer //// / (6), Tip //// (4). Frequency is the count. Column totals should equal the number of people surveyed.',
  'Make tallies for: red 7, blue 3, green 5. What is the total? Which colour is most popular?',
  'Tallies show 7, 3, 5; total 15; red most popular.',
  'Drawing five separate strokes without the fifth-across bundle makes tallies hard to count quickly.',
  'Build tally tables for two data sets (one given, one collected). Convert tallies to frequencies. Write two comparison sentences.'),
L('s2-mat-y3-w37-l3',DATA1,['picture graph','column graph','scale','symbol'],
  'Picture graphs use symbols (each symbol may stand for 1 or more). Column graphs use bars whose heights show frequencies.',
  'If ★ = 2 votes and cats have 3 stars, cats have 6 votes. A column to height 6 means frequency 6 when the scale is 1 unit = 1.',
  'A picture graph key says ♥ = 2. Hearts: 4. How many responses? Sketch a column graph for frequencies 3, 5, 2.',
  '8 responses; columns of heights 3, 5, 2 with labelled axes.',
  'Ignoring the key (treating every picture as 1) doubles or halves the true totals.',
  'Create one picture graph (with key) and one column graph for the same data (at least 4 categories). Write two sentences a reader could learn from each.'),
L('s2-mat-y3-w37-l4',DATA1,['fluency','graph','tally','frequency'],
  'Data fluency reads tallies and simple graphs quickly, using keys and scales correctly.',
  'Set: tally //// // → frequency; picture key ▲=2 with 5 triangles; tallest column category.',
  'Read: frequency from tally; value from picture graph; compare two columns.',
  'Answers follow key/scale; comparisons use frequencies not bar decoration.',
  'Reading the axis label wrong (starting at 1 instead of 0) shifts every value.',
  'Complete an eighteen-item graph/tally fluency set. Re-work misses by rewriting the key first.'),
L('s2-mat-y3-w38-l1',DATA2,['interpret','most','least','difference'],
  'Interpreting graphs means answering questions about most/least, totals, differences and simple conclusions supported by the data.',
  'If blue has 12 and red has 7, blue is more popular by 5. Total of all categories answers “how many surveyed” when everyone chose one option.',
  'From a column graph: which is least? What is the difference between top two? About how many in total?',
  'Least = shortest column; difference = subtract frequencies; total = sum.',
  'Saying “most people like X” when the sample is only your table group overgeneralises.',
  'Answer twelve interpretation questions on two graphs. For three answers write the exact numbers you used. Write one careful conclusion that does not overclaim.'),
L('s2-mat-y3-w38-l2',DATA2,['choose','picture','column','purpose'],
  'Choose a graph type to match the purpose: picture graphs suit small counts with a friendly key; column graphs suit comparing category heights clearly.',
  'Comparing favourite sports for a class of 28 → column graph is clear. Showing lunch choices with ♥=1 for a group of 10 → picture graph works well.',
  'Which graph for: many categories with larger numbers; tiny data set for a poster aimed at young readers?',
  'Column; picture (typical choices) — justify with purpose.',
  'Choosing a graph that hides the scale makes comparisons unfair.',
  'For three data sets, choose picture or column and justify in one sentence each. Build the better graph for one set and list one weakness of the other choice.'),
L('s2-mat-y3-w38-l3',DATA1,['survey','question','fair','option'],
  'Good survey questions are clear, fair and have sensible options. Biased wording pushes people toward one answer.',
  'Biased: “Don’t you agree pizza is best?” Fairer: “Which lunch do you prefer? pizza / sandwich / sushi / other.” Options should cover likely answers.',
  'Rewrite a biased question about favourite seasons into a fair multiple-choice question with four options.',
  'Neutral stem + balanced options including other/not sure if needed.',
  'Leading questions produce data that mainly shows the writer’s opinion.',
  'Write four survey questions (two fair drafts from biased starters). Pilot one question with at least ten people. Comment on clarity of options.'),
L('s2-mat-y3-w38-l4',DATA2,['fluency','interpret','choose','total'],
  'Data fluency mixes reading values, comparing categories, totals and choosing suitable displays.',
  'Set: difference between two columns; total; better graph type for a poster of 8 responses.',
  'From a graph: most; least; total; one conclusion.',
  'Use frequencies; conclusion must quote numbers.',
  'Mixing picture-key values with column heights from a different graph confuses practice sets.',
  'Complete an eighteen-item data fluency mix. Re-work misses by listing the key/scale before recalculating.'),
L('s2-mat-y3-w39-l1',CHAN,['certain','likely','unlikely','impossible'],
  'Chance language describes how probable an event is: certain (must happen), likely, unlikely, impossible (cannot happen).',
  'Pulling a red cube from a bag of only red cubes is certain. Rolling a 7 on a standard die is impossible. Rain tomorrow might be likely or unlikely depending on the forecast context.',
  'Label: sun rising tomorrow (everyday sense); drawing a square from a bag of only circles; rolling an even number on a fair die.',
  'Certain (everyday); impossible; likely (3 of 6) — accept likely/even chance discussion.',
  'Calling unlikely the same as impossible erases events that can still happen.',
  'Sort twenty events into certain / likely / unlikely / impossible. Write one new event for each category with a short reason.'),
L('s2-mat-y3-w39-l2',CHAN,['experiment','dice','spinner','trial'],
  'Chance experiments repeat trials (dice rolls, spinner spins) and record outcomes to see what happens over many goes.',
  'Roll a die 20 times; tally faces 1–6. A fair die should not produce only sixes if trials are honest — small samples still vary.',
  'Plan: spinner with 2 red, 1 blue. Predict which colour appears more in 15 spins. How will you record?',
  'Predict red more often; use a tally table for red/blue.',
  'Stopping when you get the result you wanted biases the experiment.',
  'Run one dice or spinner experiment with at least 24 trials. Record tallies. Write prediction, results and whether results roughly matched the prediction.'),
L('s2-mat-y3-w39-l3',CHAN,['record','compare','sample','variation'],
  'Recording and comparing results means using tables or graphs and noticing that samples vary even when the chance setup stays the same.',
  'Group A rolled 4 sixes in 20 rolls; Group B rolled 1 six — both possible with a fair die. Compare frequencies side by side; do not accuse unfairness from one small difference alone.',
  'Two students spin a fair 2-colour spinner 10 times each. One gets 7 red, one gets 4 red. What can you say?',
  'Both results possible; small samples vary; more trials give a clearer picture.',
  'Declaring a die “broken” after three rolls ignores natural variation.',
  'Compare two experiment result tables (yours vs a partner or given set). Make a combined graph. Write three comparison sentences including one about variation.'),
L('s2-mat-y3-w39-l4',CHAN,['fluency','certain','likely','impossible'],
  'Chance fluency quickly assigns chance words and reads simple experiment tallies.',
  'Set: label impossible event; likely event; read which outcome occurred most in a tally.',
  'Label three events; from a tally of 12 spins choose most/least frequent colour.',
  'Labels per definitions; most/least from frequencies.',
  'Using “certain” for “very likely” loosens the language.',
  'Complete an eighteen-item chance fluency set. Re-work misses by writing the four chance words and one example each at the top.'),
L('s2-mat-y3-w40-l1',DATA1,['investigation','plan','question','method'],
  'A Year 3 investigation plan states a question, the data or experiment method, how results will be recorded and what “finished” looks like.',
  'Plan template: Question → What I will measure/ask → How I will record → How many trials/people → Graph I will use → What I will look for.',
  'Draft a plan for: “Which vowel appears most in a page of a book?” List method and recording.',
  'Tally vowels on one page; table of A E I O U; column graph; look for tallest bar.',
  'Starting without a question wastes trials that do not answer anything.',
  'Write a full investigation plan for one approved question (data or chance). Include timeline for the next lesson’s carrying-out stage. Get a parent/teacher nod on safety and fairness.'),
]

VISUALS = {
 's2-mat-y3-w37-l2': [pair_visual('Tally','//// = 5','Table','category | tally | frequency','Tally marks in a table.','Bundle fifth stroke across.'),
  pair_visual('Example','red 7 blue 3 green 5','Total','15','Frequencies from tallies.','Total matches survey size.')],
 's2-mat-y3-w37-l3': [pair_visual('Picture graph','symbol + key','Column graph','bar height','Two ways to display frequencies.','Always read the key.'),
  pair_visual('Key','♥ = 2','Four hearts','8 responses','Picture-graph value from key.','Key ignored → wrong totals.')],
 's2-mat-y3-w37-l4': [pair_visual('Fluency','tally → frequency','Graph','use key/scale','Data reading fluency.','Rewrite key on misses.'),
  pair_visual('Compare','tallest column','Means','highest frequency','Comparing categories.','Axis start matters.')],
 's2-mat-y3-w38-l1': [pair_visual('Most / least','tallest / shortest','Difference','subtract','Graph interpretation moves.','Quote numbers in conclusions.'),
  pair_visual('Total','sum categories','Care','do not overclaim','Sample vs everyone.','Table group ≠ whole world.')],
 's2-mat-y3-w38-l2': [pair_visual('Column','clear comparisons','Picture','friendly small sets','Choosing a graph for purpose.','Hidden scales hurt fairness.'),
  pair_visual('Class sports','column graph','Tiny poster set','picture graph','Purpose-matched choices.','Justify each choice.')],
 's2-mat-y3-w38-l3': [pair_visual('Biased','pushes one answer','Fair','neutral + options','Survey question quality.','Avoid leading stems.'),
  pair_visual('Options','cover likely answers','Other','allowed when needed','Balanced multiple choice.','Pilot for clarity.')],
 's2-mat-y3-w38-l4': [pair_visual('Fluency','read + compare + choose','First','key/scale','Mixed data fluency.','List key before recalculating.'),
  pair_visual('Conclusion','uses frequencies','Not','decoration height alone','Evidence-based sentences.','Keep graphs consistent in a set.')],
 's2-mat-y3-w39-l1': [pair_visual('Certain','must happen','Impossible','cannot happen','Chance language poles.','Unlikely ≠ impossible.'),
  pair_visual('Likely','more chance','Unlikely','less chance','Middle chance words.','Context can shift likely/unlikely.')],
 's2-mat-y3-w39-l2': [pair_visual('Trial','one roll or spin','Record','tally outcomes','Chance experiment structure.','Do not stop to favour a result.'),
  pair_visual('Predict','before trials','Compare','after tallies','Prediction vs results.','Small samples still vary.')],
 's2-mat-y3-w39-l3': [pair_visual('Compare','two result tables','Graph','side by side','Comparing experiment samples.','Variation is expected.'),
  pair_visual('Fair die','different tallies possible','More trials','clearer picture','Sample size idea.','Three rolls ≠ proof broken.')],
 's2-mat-y3-w39-l4': [pair_visual('Fluency','label chance words','Read','experiment tally','Chance language fluency.','Certain ≠ very likely.'),
  pair_visual('Most frequent','highest tally','Least','lowest tally','Reading chance results.','Examples for each word help.')],
 's2-mat-y3-w40-l1': [pair_visual('Plan','question → method → record','Then','graph → look for','Investigation planning template.','No question → wasted trials.'),
  pair_visual('Example','vowel count on a page','Display','column graph','Sample Year 3 investigation plan.','Include how many / how recorded.')],
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
            bundle = build_from_spec(base, u, VISUALS[u['seed_key']], subject='mathematics')
            atomic_json(ROOT / 'lesson-pipeline/authored' / f"{u['seed_key']}.json", bundle)
            print('Written Core maths bundle:', u['seed_key'])
    finally:
        db.close()

if __name__ == '__main__':
    create()
