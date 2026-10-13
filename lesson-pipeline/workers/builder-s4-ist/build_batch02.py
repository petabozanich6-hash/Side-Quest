#!/usr/bin/env python3
"""Year 7 Information and Software Technology Written Core, programming lessons 13–24.

Paper algorithms only: sequence, order, input and output, variables, decisions,
repetition, tracing, debugging order, precise instructions, counted loops and test tables.
No computer, website, network attack, malware, or password task is required.
Automated checks are not educational review or NESA verification.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / 'scripts' / 'gold-pipeline'))

from elective_batch import write_elective_batch
from written_bundle import pair_visual

# Published Computing Technology 7–10 (2022). Stage 4 may adjust Stage 5 outcomes.
OPL = 'CT5-OPL-01'
SOURCE = 'https://curriculum.nsw.edu.au/learning-areas/tas/computing-technology-7-10-2022/outcomes'
SOURCE_NOTE = (
    'Catalogue area is Information and Software Technology. '
    'Proposed Year 7 alignment to Computing Technology 7–10 (2022) outcome CT5-OPL-01. '
    'CT4-ADJ-01 says Stage 4 may adjust Stage 5 outcomes. '
    'Pending mapping. Not NESA verified. Paper algorithms only.'
)
OUT = Path(__file__).resolve().parent / 'authored'

# Trace checks used in the lessons. Independent totals stay out of the student prompt wording where noted.
assert (4 > 2) and not (1 > 2) and not (2 > 2) and not (0 > 2) and (3 > 2) and (5 > 2) and (6 > 2)
assert not (4 > 4) and (5 > 4) and not (0 > 4)
assert 0 + 1 + 1 + 1 == 3
assert 0 + 1 + 1 + 1 + 1 == 4
assert 0 + 2 + 2 + 2 == 6
assert 5 - 1 - 1 - 1 == 2
assert 0 + 1 + 1 == 2
assert 1 + 0 + 1 == 2 and 0 + 1 + 1 == 2 and 1 + 0 + 0 == 1
assert 3 != (2 + 3) and 4 != (1 + 4) and 1 != (6 + 1)


def plate(slices, limit=2):
    return 'bigger' if slices > limit else 'small'


assert plate(0) == 'small' and plate(1) == 'small' and plate(2) == 'small' and plate(3) == 'bigger'
assert plate(4) == 'bigger' and plate(5) == 'bigger' and plate(6) == 'bigger'
assert plate(0, 4) == 'small' and plate(4, 4) == 'small' and plate(5, 4) == 'bigger'
assert [plate(n) for n in (0, 1, 3)] == ['small', 'small', 'bigger']
assert [n for n in (0, 1, 3)] == [0, 1, 3]


def opener(text):
    flat = ' '.join(text.split())
    for i, ch in enumerate(flat):
        if ch in '.!?' and (i + 1 == len(flat) or flat[i + 1] == ' '):
            return flat[:i + 1]
    return flat


OPENER_ISSUES = []


def lesson(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    if len(vocab) != 4:
        raise SystemExit(f'{seed}: need 4 vocab words')
    for name, text in (
        ('principle', principle), ('model', model), ('feedback', feedback),
        ('misconception', misconception), ('independent', independent),
    ):
        got = opener(text)
        if not 85 <= len(got) <= 118:
            OPENER_ISSUES.append(f'{seed} {name} opener is {len(got)} chars: {got}')
    blob = '\n'.join([principle, model, guided, feedback, misconception, independent])
    if re.search(r'\bpets?\b', blob, re.I):
        raise SystemExit(f'{seed}: banned pet wording')
    if re.search(r'https?://', blob, re.I):
        raise SystemExit(f'{seed}: URL in lesson text')
    if re.search(r'\b(exploit|malware|phishing|crack|bypass|hack)\b', blob, re.I):
        raise SystemExit(f'{seed}: unsafe security wording')
    return dict(
        seed_key=seed, code=code, vocab=vocab, principle=principle, model=model,
        guided=guided, feedback=feedback, misconception=misconception,
        independent=independent, subject='technology',
    )


def V(left_title, left_text, right_title, right_text, alt, caption):
    if len(left_text) > 42 or len(right_text) > 42:
        raise SystemExit(f'visual text over 42: {left_text!r} | {right_text!r}')
    return pair_visual(left_title, left_text, right_title, right_text, alt, caption)


P = 's5-information-software-technology-y9-'

LESSONS = [
    lesson(
        P + 'w11-l1', OPL,
        ['algorithm', 'sequence', 'step', 'precision'],
        'An algorithm is a precise sequence of steps that a person can follow and get the same result each time. '
        'The steps are written in order, each step says exactly one action, and a second person should not have to guess. '
        'Work on paper. A computer and a website are not required.',
        'To make one slice of toast, take the bread from the bag, load the toaster, wait for the pop, then plate it. '
        'Step 1 takes one slice of bread out of the bag. Step 2 puts that slice in the toaster. '
        'Step 3 waits until the toast pops up. Step 4 places the toast on a plate. '
        'The result is one slice of toast on a plate. Leaving out step 1 means there is no bread to toast. '
        'Describe the toaster on paper only, and do not use a hot toaster unless an adult says it is safe.',
        'These toast actions are listed out of order: plate the toast, take one slice from the bag, put that slice in the toaster. What precise sequence actually makes the toast?',
        'The precise sequence is take one slice from the bag, then put that slice in the toaster, then plate the toast. '
        'Plating first fails because there is no toast yet. Putting a slice in the toaster before taking it from the bag fails because the toaster is empty. '
        'A precise algorithm names each action in the order that produces one slice of toast on a plate.',
        'A common mistake is to treat a jumbled list of toast actions as an algorithm even when that order cannot make toast. '
        'The same four words in the wrong order are not the same sequence.',
        'On paper, write four ordered steps for filling one glass from a jug, and name the step before pouring. '
        'Use a jug, a glass and a table. Do not copy the toast steps.',
    ),
    lesson(
        P + 'w11-l2', OPL,
        ['order', 'swap', 'result', 'sequence'],
        'The order of steps changes the result, so butter then jam is a different algorithm from jam then butter. '
        'A swap keeps the same two spreads but changes which spread finishes on top. Work on paper only.',
        'Spreading butter first and jam second leaves jam on top, while the swapped order leaves butter on top instead. '
        'Butter then jam: the bread meets butter, then jam covers the butter, so the top layer is jam. '
        'Jam then butter: the bread meets jam, then butter covers the jam, so the top layer is butter. '
        'The same swap with peanut butter then banana slices leaves banana on top, and banana then peanut butter leaves peanut butter on top. '
        'Same ingredients, different order, different result.',
        'A recipe says spread honey, then sprinkle oats. What changes if those two steps are swapped, and which ingredient ends on top in each order?',
        'Honey then oats leaves oats on top, but oats then honey leaves honey on top, so the swap changes the slice. '
        'The honey and the oats are the same ingredients in both algorithms. '
        'The last step is the layer a person sees and tastes first, so the order is part of the result.',
        'A common mistake is to think that swapping two steps does not matter when both versions use the same ingredients. '
        'The ingredients can match while the finished slice does not.',
        'On paper, compare sock-then-shoe with shoe-then-sock for one foot, and say which order can actually be worn. '
        'Name what the swap breaks. This is not a toast algorithm.',
    ),
    lesson(
        P + 'w12-l1', OPL,
        ['input', 'output', 'slices', 'count'],
        'Input is the number of slices you start with, and output is the count of toast those slices become. '
        'Each slice becomes one piece of toast. The toaster is the tool, not the output. Work on paper only.',
        'When the input is 2 slices and each slice is toasted once, the output is 2 pieces of toast, so 2 in equals 2 out. '
        'The input is chosen before the steps run. The output is the count you can check at the end. '
        'If the algorithm dropped a slice, the output would be 1, and 2 in would not equal 1 out. '
        'That drop is not part of this algorithm, so the honest output is 2.',
        'The input is 4 slices and each slice becomes one piece of toast. What is the output count, and which number was the input?',
        'The input is 4 slices and the output is 4 pieces of toast, because each slice is toasted once and none are dropped. '
        'The check is 4 in equals 4 out. The toaster is still the tool, not the output. '
        'An output of 3 would mean one slice was never toasted, which this algorithm does not do.',
        'A common mistake is to call the toaster the output, instead of counting the pieces of toast the algorithm produces. '
        'A tool does the work. The output is the result count.',
        'On paper, an input of 5 bread rolls each becomes one warm roll, so state the input, the output count, and the check. '
        'Show that 5 in equals 5 out. Do not reuse the slice numbers 2 or 4.',
    ),
    lesson(
        P + 'w12-l2', OPL,
        ['variable', 'assignment', 'replace', 'value'],
        'A variable is a named box that holds one current value, so a later assignment replaces what was stored before. '
        'The name stays the same. The value inside can change. The box does not keep the old number beside the new one.',
        'The box named slices stores 2 when slices = 2, and later slices = 3 replaces that 2, so the box then holds only 3. '
        'After the first assignment the current value is 2. After the second assignment the current value is 3. '
        'The 2 is gone. It is not added, so the box does not hold 5. A named box stores one current value, not a history of every value. '
        'Reading slices at the end means reading 3.',
        'A box named cups is set with cups = 1, and later the algorithm says cups = 4. What value does cups hold at the end, and what happened to 1?',
        'At the end cups holds 4, because cups = 4 replaces the earlier 1, and the box does not add 1 and 4 to make 5. '
        'The name cups is unchanged. The current value is 4, which is the only value in the box. '
        'Writing 1 beside 4 would mean two values at once, and this variable cannot do that.',
        'A common mistake is to add the old value to the new one, so slices = 2 then slices = 3 is wrongly treated as 5. '
        'Assignment replaces. It does not add, unless the step itself says to add.',
        'On paper, trace books = 6 followed by books = 1, state the current value, and say why the box does not hold 7. '
        'Use the name books, not slices or cups.',
    ),
    lesson(
        P + 'w13-l1', OPL,
        ['decision', 'condition', 'branch', 'plate'],
        'A decision checks a condition: if slices > 2 use a bigger plate, otherwise use a small plate, and both traces matter. '
        'Greater than 2 means 3 or more. The value 2 itself uses the small plate because 2 > 2 is false. Work on paper only.',
        'Slices = 4 uses the bigger plate because 4 > 2 is true, and slices = 1 uses the small plate. '
        'The condition 1 > 2 is false, so slices = 1 takes the else branch. '
        'The rule did not change between the two traces. The input changed, so the plate changed. '
        'Guessing a plate without testing slices > 2 skips the decision.',
        'Use the same plate rule for slices = 5 and for slices = 2. Which plate does each value choose, and why does 2 stay off the bigger plate?',
        'Slices = 5 chooses the bigger plate because 5 > 2, and slices = 2 chooses the small plate because 2 > 2 is false. '
        'The condition is greater than 2, not greater than or equal to 2. '
        'That is why 2 slices still use the small plate, while 5 slices use the bigger plate.',
        'A common mistake is to send every amount of toast to the bigger plate, including a value that is not greater than 2. '
        'A false condition must take the else branch.',
        'On paper, trace the plate decision for slices = 0 and slices = 6, and write true or false beside each chosen plate. '
        'Keep the same rule, slices > 2. Do not copy the 4 and 1 traces.',
    ),
    lesson(
        P + 'w13-l2', OPL,
        ['repetition', 'repeat', 'total', 'count'],
        'Repetition runs one step a set number of times, and repeating spread one slice three times butters three slices. '
        'Start from 0. Each repeat adds 1 to the total. Work on paper only.',
        'Start at 0 buttered slices and repeat spread one slice three times, so the totals become 1, then 2, then 3. '
        'After repeat 1 the total is 1. After repeat 2 the total is 2. After repeat 3 the total is 3. '
        'The check is 0 + 1 + 1 + 1 = 3. Doing the step once would leave the total at 1, which ignores the instruction to repeat three times. '
        'Doubling the repeats would make 6, and that extra work is not in the algorithm.',
        'Repeat the step place one sticker exactly 4 times, starting from a total of 0. What is the total after each repeat, and what is the final total?',
        'Four sticker repeats from 0 give the totals 1, then 2, then 3, then 4, and the check is 0 + 1 + 1 + 1 + 1 = 4. '
        'The final total is 4 because the step ran four times, not three times and not once. '
        'The repeat number is how many times the step runs, and the total counts the completed steps.',
        'A common mistake is to butter only one slice, or to double the repeats, when the instruction says repeat three times. '
        'The number written beside repeat is the number of times the step happens.',
        'On paper, start at 0 and repeat fold one towel exactly two times, writing the total after each repeat and at the end. '
        'The final total should be 2. Do not reuse the toast or sticker counts.',
    ),
    lesson(
        P + 'w14-l1', OPL,
        ['trace', 'counter', 'step', 'final'],
        'Tracing records the value after every step, and this counter starts at 0, adds 1 three times, and finishes at 3. '
        'A four-step trace writes four values, not only the last number. Work on paper only.',
        'The four steps set the counter to 0, add 1, add 1, and add 1, so the values are 0, then 1, then 2, then 3. '
        'Step 1 sets counter to 0, and the value is 0. Step 2 adds 1, and the value is 1. '
        'Step 3 adds 1, and the value is 2. Step 4 adds 1, and the value is 3. '
        'The check is 0 + 1 + 1 + 1 = 3. The final value is 3. Stopping at the start would report 0, which is not the end of the four steps.',
        'Trace these four steps on paper: set marks to 0, add 2, add 2, add 2. What is the value after each step, and what is the final value?',
        'The marks trace is 0, then 2, then 4, then 6, because each of the three add-2 steps increases the counter by 2. '
        'The check is 0 + 2 + 2 + 2 = 6, so the final value is 6. '
        'Adding 1 each time would finish at 3, but this trace adds 2. A complete trace lists the value after every step.',
        'A common mistake is to call the starting 0 the final value, or to add a step the algorithm never states. '
        'The final value is the value after the last written step.',
        'On paper, trace set points to 5, then subtract 1 three times, and write the value after each of the four steps. '
        'The values run 5, then 4, then 3, then 2, so the final points are 2.',
    ),
    lesson(
        P + 'w14-l2', OPL,
        ['bug', 'order', 'fix', 'object'],
        'A bug here is a step in the wrong place, and spreading jam before the bread leaves the bag cannot be carried out. '
        'Naming the bug means naming the broken order. The fix is an order a person can actually do. Work on paper only.',
        'The broken steps spread jam and only then take the bread out of the bag, so the fix takes the bread out first. '
        'Broken order: step 1 spread jam on the slice, step 2 take the bread out of the bag. '
        'There is no slice out of the bag when the jam step runs, so the jam step has no object yet. '
        'Fixed order: step 1 take the bread out of the bag, step 2 spread jam on that slice. '
        'The jam step is still needed. It was only too early.',
        'A list says tie the shoelaces, then put the shoes on the feet. What is the broken order, and what two-step fix can actually be done?',
        'The broken shoe order ties the laces before the shoes are on, and the fix puts the shoes on before tying the laces. '
        'Broken order: tie the shoelaces, then put the shoes on the feet. '
        'Fixed order: put the shoes on the feet, then tie the shoelaces. '
        'The lace step stays in the algorithm. It moves to the moment when the shoes are already on.',
        'A common mistake is to delete the jam step, when the real bug is that the jam is spread before the bread is out. '
        'A useful fix repairs the order and keeps the step that still needs to happen.',
        'On paper, find the bug in pour the drink then open the bottle, name that broken order, and write the two-step fix. '
        'The drink cannot be poured before the bottle is open.',
    ),
    lesson(
        P + 'w15-l1', OPL,
        ['verb', 'object', 'precision', 'instruction'],
        'A paper robot needs a precise verb and a named object in every step, because a missing object is unclear. '
        'Put it in fails: it does not name the object, and in does not name the place. Work on paper. No computer is required.',
        'Precise steps pick up the pencil, place the pencil in the case, pick up the ruler, and place the ruler in the case. '
        'Step 1: pick up the pencil. Step 2: place the pencil in the pencil case. '
        'Step 3: pick up the ruler. Step 4: place the ruler in the pencil case. Step 5: close the pencil case. '
        'Each verb has an object. A classmate acting as the robot can follow the steps without asking what it means.',
        'Rewrite grab it, put that in, and do the next thing so a robot can pack one eraser and one sharpener into the pencil case. What four precise steps replace those vague lines?',
        'The repair names the eraser and the sharpener, and each object is picked up and then placed in the case. '
        'Step 1: pick up the eraser. Step 2: place the eraser in the pencil case. '
        'Step 3: pick up the sharpener. Step 4: place the sharpener in the pencil case. '
        'Put it in is still too vague, because the robot is not told which object moves or where it goes.',
        'A common mistake is to write put it in and expect a robot to know which object and which container were meant. '
        'A precise instruction names the verb, the object and the place.',
        'On paper, write four precise steps that pack one glue stick and one pen into a zip pouch, naming the object each time. '
        'Do not reuse the pencil, the ruler, the eraser or the sharpener.',
    ),
    lesson(
        P + 'w15-l2', OPL,
        ['loop', 'count', 'pile', 'bound'],
        'A counted loop runs from a start count to an end count, and adding one book from 1 to 4 leaves a pile of 4. '
        'The pile starts at 0. The loop stops when count reaches 4. Work on paper only.',
        'For count from 1 to 4, add one book to a pile that starts at 0, so the pile sizes become 1, then 2, then 3, then 4. '
        'When count is 1, the pile is 1. When count is 2, the pile is 2. When count is 3, the pile is 3. When count is 4, the pile is 4. '
        'The pile size ends at 4. The check is 0 + 1 + 1 + 1 + 1 = 4. A fifth book is not added, because the end count is 4.',
        'A pile starts at 0. For count from 1 to 3, add one plate to the pile. What is the pile size after each count, and what is the final size?',
        'For count from 1 to 3, the plate pile grows 1, then 2, then 3, and it stops at 3 because the end count is 3. '
        'The check is 0 + 1 + 1 + 1 = 3. The loop does not continue to 4. '
        'Count names which repeat is happening. The pile stores how many plates have been added.',
        'A common mistake is to stop after count 1, or to keep adding past the end count, so the pile does not finish at 4. '
        'The end number in for count from 1 to 4 is the last count that adds a book.',
        'On paper, a stack starts at 0 and for count from 1 to 5 you add one cup, then write the size after each count. '
        'The sizes are 1, 2, 3, 4 and 5, so the stack ends at 5.',
    ),
    lesson(
        P + 'w16-l1', OPL,
        ['test', 'input', 'plate', 'zero'],
        'A test table pairs each input with the expected plate and toast count, and the row for 0 slices must be included. '
        'The rule is: if slices > 2 use a bigger plate, else use a small plate. Toast count equals the input, including 0. Work on paper only.',
        'Inputs 0, 1 and 3 give small plate and 0 toast, small plate and 1 toast, then bigger plate and 3 toast. '
        'Row 0: 0 > 2 is false, so the plate is small and the toast output is 0. '
        'Row 1: 1 > 2 is false, so the plate is small and the toast output is 1. '
        'Row 3: 3 > 2 is true, so the plate is bigger and the toast output is 3. '
        'Skipping the zero row would hide the case where there is nothing to toast and the small plate is still chosen.',
        'Using the same greater-than-2 plate rule, what plate and toast count belong in the rows for input 2 and input 4?',
        'Input 2 gives a small plate and 2 toast because 2 > 2 is false, and input 4 gives a bigger plate and 4 toast. '
        'Input 4 is true for slices > 2, so the plate is bigger and the toast count is 4. '
        'The zero row is still part of the rule: 0 slices means 0 toast and a small plate, even when this question asks about 2 and 4.',
        'A common mistake is to skip the zero row, or to treat 0 slices as a bigger plate, even though 0 > 2 is false. '
        'Zero is a real input. It expects a small plate and an output of 0 toast.',
        'On paper, use a bigger plate only when slices > 4, and table the inputs 0, 4 and 5 with plate and toast count. '
        'For this new limit, 0 and 4 use the small plate, and 5 uses the bigger plate. Toast counts stay 0, 4 and 5.',
    ),
    lesson(
        P + 'w16-l2', OPL,
        ['sequence', 'decision', 'count', 'plant'],
        'A plant-watering algorithm uses a sequence, one dry-soil decision and a count, and it is not a toast task. '
        'Visit every plant in order. If the soil is dry, pour one cup and add 1 to watered. If the soil is not dry, add 0. Work on paper only.',
        'Dry, wet, then dry plants make the watered count go 0, 1, 1 and finish at 2, with all three plants visited. '
        'Start watered at 0. Plant A is dry, so pour one cup and watered becomes 1. '
        'Plant B is wet, so pour nothing and watered stays 1. Plant C is dry, so pour one cup and watered becomes 2. '
        'The visit count is 3. The watered count ends at 2. Wet soil is a real decision, not a skipped plant.',
        'Three pots are wet, then dry, then dry. Start watered at 0 and use the same dry-soil decision. What is watered after each pot, and what is the final count?',
        'Wet, dry, then dry makes watered stay 0, become 1, then finish at 2, because only the two dry pots receive a cup. '
        'Pot 1 is wet, so watered stays 0. Pot 2 is dry, so watered becomes 1. Pot 3 is dry, so watered becomes 2. '
        'All 3 pots are visited. Pouring on the wet pot would ignore the decision and make the count 3, which this algorithm does not do.',
        'A common mistake is to water every plant, or to skip the count, so the dry-soil decision never changes the result. '
        'The decision chooses the cup. The count records only the plants that received water.',
        'On paper, three ferns go dry, wet, then wet, so write the sequence, the decision, and the count after each fern. '
        'Start at 0. The counts are 1, then 1, then 1, so the final watered count is 1 and the visit count is 3.',
    ),
]

VISUALS = {
    P + 'w11-l1': [
        V('Precise sequence', 'bag, toaster, wait, plate', 'Result', 'one toast slice on a plate',
          'Four toast steps in order: take bread from the bag, load the toaster, wait for the pop, then plate one slice.',
          'An algorithm is those steps in that order, and the result is one slice of toast on a plate.'),
        V('Broken order', 'plate the toast before it exists', 'Complete order', 'take bread out before toasting',
          'Plating first has no toast yet. The complete order takes the bread out before the toaster step.',
          'A precise sequence can be followed. A jumbled list of the same actions may not make toast.'),
    ],
    P + 'w11-l2': [
        V('Butter then jam', 'jam finishes on top', 'Jam then butter', 'butter finishes on top',
          'Butter then jam leaves jam on top. Jam then butter leaves butter on top.',
          'The same two spreads in swapped order make different finished slices.'),
        V('Same ingredients', 'butter and jam are both used', 'Swap changes it', 'the top layer is different',
          'Both orders use butter and jam. The swap changes which spread is the top layer.',
          'Order is part of the algorithm. Matching ingredients do not make the results match.'),
    ],
    P + 'w12-l1': [
        V('Input', '2 slices enter the steps', 'Output', '2 pieces of toast come out',
          'Input is 2 slices. Output is 2 pieces of toast, one from each slice.',
          'Input is the starting number of slices. Output is the count of toast at the end.'),
        V('Check', '2 in equals 2 out', 'Not the output', 'the toaster is only the tool',
          'The check is 2 in equals 2 out. The toaster is the tool, not the output count.',
          'Count the toast. Do not name the toaster as the output of the algorithm.'),
    ],
    P + 'w12-l2': [
        V('First assignment', 'slices = 2 stores 2', 'Replacement', 'slices = 3 now stores 3',
          'slices = 2 stores 2. Later slices = 3 replaces that value, so the box stores 3.',
          'A variable keeps its name and holds one current value. A new assignment replaces the old value.'),
        V('One current value', 'the box holds 3, not both', 'Not addition', '2 replaced by 3 is not 5',
          'After slices = 3 the box holds 3 only. Replacing 2 with 3 is not the sum 5.',
          'Assignment replaces the value in the named box. It does not add the old and new numbers.'),
    ],
    P + 'w13-l1': [
        V('slices = 4', '4 > 2 true: bigger plate', 'slices = 1', '1 > 2 false: small plate',
          'slices = 4 makes 4 > 2 true, so the bigger plate is used. slices = 1 makes 1 > 2 false, so the small plate is used.',
          'One decision, two traces. The plate follows whether slices is greater than 2.'),
        V('Same rule', 'greater than 2 means bigger', 'Equal to 2', '2 is not greater: small',
          'The same rule uses a bigger plate only when slices is greater than 2. slices = 2 uses the small plate.',
          'The condition is greater than 2. Equal to 2 is false, so the else branch uses the small plate.'),
    ],
    P + 'w13-l2': [
        V('Repeat 3 times', 'spread one slice each time', 'Running total', '0 then 1 then 2 then 3',
          'Repeat spread one slice three times. The buttered total goes 0, 1, 2, 3.',
          'Each repeat adds one buttered slice. Three repeats finish at 3.'),
        V('Check', '0 + 1 + 1 + 1 = 3', 'Not once', 'one repeat would stop at 1',
          'The check is 0 + 1 + 1 + 1 = 3. Stopping after one repeat would leave the total at 1.',
          'The repeat count is three, so the total slices buttered is 3.'),
    ],
    P + 'w14-l1': [
        V('Four steps', 'set 0, add 1, add 1, add 1', 'After each step', 'values 0, 1, 2, then 3',
          'Four steps: set the counter to 0, then add 1 three times. The values are 0, 1, 2 and 3.',
          'A trace writes the counter after every step. The final value is 3.'),
        V('Final value', 'the counter finishes at 3', 'Check', '0 + 1 + 1 + 1 = 3',
          'The counter finishes at 3. The check is 0 + 1 + 1 + 1 = 3.',
          'Three additions of 1, after a start of 0, end at 3. The start is not the final value.'),
    ],
    P + 'w14-l2': [
        V('Broken order', 'spread jam, then take bread out', 'Why it fails', 'no slice is out of the bag',
          'The broken order spreads jam and only then takes the bread out of the bag. There is no slice yet.',
          'The bug is the order. Jam is spread before the bread has been taken out of the bag.'),
        V('The fix', 'take bread out, then spread jam', 'Bug named', 'the jam step was too early',
          'The fix takes the bread out of the bag first, then spreads jam. The jam step stays, but it moves later.',
          'Repair the broken order. Do not delete the jam step that still needs to happen.'),
    ],
    P + 'w15-l1': [
        V('Vague step', 'put it in names nothing', 'Precise step', 'place the pencil in the case',
          'Put it in names neither the object nor the place. Place the pencil in the case names both.',
          'A paper robot needs a precise verb and a named object in every step.'),
        V('Verb plus object', 'pick up the ruler', 'Then the place', 'place the ruler in the case',
          'Pick up the ruler names the object. Place the ruler in the case names the object and the place.',
          'Precise packing steps say which object moves and where that object goes.'),
    ],
    P + 'w15-l2': [
        V('Count 1 to 4', 'add one book on each count', 'Pile ends', 'pile size finishes at 4',
          'For count from 1 to 4, add one book each time. The pile size finishes at 4.',
          'A counted loop stops at its end count. Here the end count is 4, so the pile ends at 4.'),
        V('Trace', 'pile becomes 1, 2, 3, then 4', 'Stop at 4', 'a fifth book is not added',
          'The pile is 1, then 2, then 3, then 4. The loop does not add a fifth book.',
          'Write the pile after every count. The last count, 4, is the final pile size.'),
    ],
    P + 'w16-l1': [
        V('Input 0', 'small plate and 0 toast', 'Input 1', 'small plate and 1 toast',
          'Input 0 expects a small plate and 0 toast. Input 1 expects a small plate and 1 toast.',
          'The zero row is a real test. 0 is not greater than 2, so the plate is small and the toast count is 0.'),
        V('Input 3', 'bigger plate and 3 toast', 'Zero case', '0 is tested, not skipped',
          'Input 3 expects a bigger plate and 3 toast, because 3 > 2. The zero case is included, not skipped.',
          'A test table needs inputs 0, 1 and 3, with the expected plate and toast count for each.'),
    ],
    P + 'w16-l2': [
        V('Visit all three', 'A dry, B wet, C dry', 'Watered count', '0, 1, 1, then ends at 2',
          'Plant A is dry, B is wet and C is dry. Watered goes 0, 1, 1 and ends at 2.',
          'The sequence visits three plants. The decision pours only on dry soil. The count ends at 2.'),
        V('Decision', 'pour only if the soil is dry', 'Different task', 'plants and cups, not toast',
          'Pour one cup only if the soil is dry. This algorithm waters plants. It is not the toast algorithm.',
          'Sequence, one dry-soil decision and a watered count are enough. Wet soil adds 0.'),
    ],
}


def main():
    if OPENER_ISSUES:
        raise SystemExit('\n'.join(OPENER_ISSUES))
    seeds = [item['seed_key'] for item in LESSONS]
    expected = [
        P + 'w11-l1', P + 'w11-l2', P + 'w12-l1', P + 'w12-l2',
        P + 'w13-l1', P + 'w13-l2', P + 'w14-l1', P + 'w14-l2',
        P + 'w15-l1', P + 'w15-l2', P + 'w16-l1', P + 'w16-l2',
    ]
    if seeds != expected:
        raise SystemExit('seed order changed')
    if set(VISUALS) != set(seeds):
        raise SystemExit('visual keys do not match lessons')
    if [item['code'] for item in LESSONS] != [OPL] * 12:
        raise SystemExit('unexpected codes')
    written = write_elective_batch(
        LESSONS, VISUALS, subject='technology', source_url=SOURCE,
        source_note=SOURCE_NOTE, out_dir=OUT,
    )
    print(f'{len(written)} bundles in {OUT}')


if __name__ == '__main__':
    main()
