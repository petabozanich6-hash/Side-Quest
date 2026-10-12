#!/usr/bin/env python3
"""Year 3 Mathematics Written Core batch 10: mass review + time w28-l2 through w31-l1 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

NSM1, NSM2 = 'MA2-NSM-01', 'MA2-NSM-02'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='mathematics', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-mat-y3-w28-l2',NSM1,['scale','balance','read','mass'],
  'Measuring mass with scales means placing the object carefully and reading the marked value in grams or kilograms at eye level.',
  'A kitchen scale shows 350 g for an apple. A bathroom scale might show 32 kg for a child. Zero the scale before measuring when the tool allows.',
  'A scale marks every 100 g. The pointer is halfway between 400 and 500. About what mass?',
  'About 450 g.',
  'Reading from an angle or with something else on the scale changes the mass reading.',
  'Measure or simulate six masses. Record estimate, reading and unit. Write two tips for accurate scale use including resetting to zero when possible.'),
L('s2-mat-y3-w28-l3',NSM1,['mass','capacity','problem','convert'],
  'Mass and capacity problems combine reading quantities, converting units and deciding totals or comparisons in context.',
  'Two juice cartons of 250 mL total 500 mL. Three bags of 200 g flour total 600 g = 0.6 kg. Compare 1.5 L and 1200 mL → 1.5 L is greater.',
  'Solve: 4×300 mL drinks; total mass of 5×150 g snack packs in kg and g.',
  '1200 mL=1.2 L; 750 g = 0.75 kg.',
  'Adding millilitres to grams without noticing different attributes is meaningless.',
  'Solve eight mixed mass/capacity problems (totals, differences, conversions, enough/not enough). Label the attribute (mass or capacity) for each.'),
L('s2-mat-y3-w28-l4',NSM1,['review','mass','capacity','volume'],
  'Measurement review for mass, capacity and volume connects unit choice, conversion, reading scales and cube volumes.',
  'Review path: choose g/kg → convert 2500 g → read a scale → convert 1.5 L → count a 2×3×4 cube volume.',
  'Mini review: convert 3 kg; 750 mL to L; volume of 3×3×2 cubes; heavier of 900 g and 1 kg.',
  '3000 g; 0.75 L; 18 cubic units; 1 kg heavier.',
  'Review answers without units are incomplete.',
  'Complete a 12-item mass/capacity/volume review. Show conversions. List two next goals.'),
L('s2-mat-y3-w29-l1',NSM2,['analog','minute','hour hand','minute hand'],
  'On an analog clock, the minute hand shows minutes past the hour (each number mark is 5 minutes) and the hour hand moves gradually between hour numbers.',
  'When the minute hand points to 4, that is 20 minutes (4×5). If the hour hand is just past 2, the time is about 2:20.',
  'Read: minute hand on 6, hour hand halfway between 3 and 4. Write the time.',
  '3:30.',
  'Reading the hour number alone without looking at the minute hand misses the minutes.',
  'Read and draw twelve analog times to the minute (including half and quarter past/to). For four times write how you used the 5-minute marks.'),
L('s2-mat-y3-w29-l2',NSM2,['digital','12-hour','colon','match'],
  'Digital time shows hours and minutes with a colon (for example 09:05). Match digital displays to analog clock faces in 12-hour time.',
  '2:45 digital matches an analog clock with minute hand on 9 (45 minutes) and hour hand near 3. 09:05 means 9 hours and 5 minutes.',
  'Write digital for: minute hand on 2, hour near 7. Draw analog for 4:50.',
  '7:10; analog with minute on 10, hour near 5.',
  'Writing 7:70 as a time is impossible — minutes only go 00–59.',
  'Match ten digital↔analog pairs. Convert eight times both ways. Correct three invalid digital times and write why each fails.'),
L('s2-mat-y3-w29-l3',NSM2,['am','pm','midnight','noon'],
  'AM times are from midnight to just before noon; PM times are from noon to just before midnight. Context tells which half of the day.',
  '7:00 AM is morning breakfast time; 7:00 PM is evening. 12:00 noon is midday; 12:00 midnight starts a new day.',
  'Label AM or PM: school starts 9:00; dinner 6:30; bedtime 8:15; sunrise 6:20.',
  'AM; PM; PM; AM (typical).',
  'Thinking AM/PM only means morning/night without the noon/midnight boundaries confuses midday times.',
  'Sort sixteen events into AM/PM. Write four pairs of the same clock numbers with different AM/PM meanings (e.g. 7:00 AM vs 7:00 PM).'),
L('s2-mat-y3-w29-l4',NSM2,['fluency','clock','digital','am/pm'],
  'Clock fluency reads analog and digital times accurately and assigns AM/PM from context.',
  'Set: read analog 1:25; write digital; choose AM/PM for lunchtime near 1:00.',
  'Read/draw: 10:40; 3:05; AM/PM for 3:05 at afternoon sport.',
  'Answers: 10:40; 3:05; PM for afternoon sport.',
  'Swapping hour and minute hands produces large reading errors.',
  'Complete an eighteen-item clock fluency mix. Re-work misses by counting 5-minute marks aloud.'),
L('s2-mat-y3-w30-l1',NSM2,['minute','hour','day','week'],
  'Time units relate: 60 minutes = 1 hour; 24 hours = 1 day; 7 days = 1 week. Convert using these facts.',
  '2 hours = 120 minutes. 3 days = 72 hours. 2 weeks = 14 days.',
  'Convert: 90 minutes to hours and minutes; 48 hours to days; 21 days to weeks.',
  '1 hour 30 minutes; 2 days; 3 weeks.',
  'Using 100 minutes = 1 hour (decimal habit) is incorrect for clock time.',
  'Complete sixteen conversions among minutes, hours, days and weeks. Write the key facts you used at the top of the page.'),
L('s2-mat-y3-w30-l2',NSM2,['calendar','date','month','order'],
  'Calendars organise days into weeks and months. Find dates, count days between dates and order events on a calendar.',
  'If 5 March is a Tuesday, then 12 March is also Tuesday (add 7 days). There are 31 days in March.',
  'A calendar shows 1 April on a Saturday. What day is 8 April? How many days from 3 April to 10 April?',
  'Saturday; 7 days.',
  'Forgetting that months have different lengths causes off-by-one date errors.',
  'Using a real or printed month calendar, answer twelve questions (day of date, date of day, days between, order three events).'),
L('s2-mat-y3-w30-l3',NSM2,['elapsed','start','end','duration'],
  'Elapsed time is how long passes from a start time to an end time. Count on by hours then minutes, or use a number line for time.',
  'From 2:20 to 3:05: 40 minutes to 3:00, then 5 minutes → 45 minutes elapsed. From 10:50 to 12:10 crosses noon carefully.',
  'Find elapsed time: 1:15 to 1:55; 11:40 to 12:20.',
  '40 minutes; 40 minutes.',
  'Subtracting digital numbers like ordinary decimals (3.05−2.20) without place-of-minutes thinking often fails.',
  'Solve ten elapsed-time problems (within 3 hours). Show a time line or count-on steps. Include two that cross the hour.'),
L('s2-mat-y3-w30-l4',NSM2,['fluency','convert','elapsed','calendar'],
  'Time fluency mixes unit conversions, clock reading support, calendar facts and short elapsed times.',
  'Set: 150 minutes = __ h __ min; elapsed 4:10→4:55; days in 2 weeks.',
  'Convert 3 hours to minutes; elapsed 9:35→10:15; date 7 days after 2 May if needed use a calendar.',
  '180 minutes; 40 minutes; 9 May.',
  'Mixing up 60 and 100 for minutes-per-hour breaks conversions.',
  'Complete an eighteen-item time fluency set. Re-work misses with a written conversion fact or time line.'),
L('s2-mat-y3-w31-l1',NSM2,['timetable','row','column','read'],
  'Timetables organise start times in rows and columns. Read the correct row and column meeting point to find a time.',
  'If the bus timetable shows Town Hall at 8:15 and Central at 8:32, travel between them takes 17 minutes. Find the column for the day/service you need.',
  'A simple table: Library opens Mon 9:00, Wed 10:00. What time Wednesday? How much later than Monday?',
  '10:00; 1 hour later.',
  'Reading the wrong row (mixing places) gives the wrong time.',
  'Read two simple timetables (class/bus/TV style). Answer ten questions finding times, durations and which is earlier. Highlight the row and column you used for three answers.'),
]

VISUALS = {
 's2-mat-y3-w28-l2': [pair_visual('Scale','350 g apple','Zero','reset before measuring','Mass reading on a kitchen scale.','Read at eye level.'),
  pair_visual('Marks','every 100 g','Halfway','about 450 g','Interpolating between scale marks.','Nothing else on the scale.')],
 's2-mat-y3-w28-l3': [pair_visual('Capacity total','4×300 mL','Mass total','5×150 g','Attribute kept separate in problems.','Do not add mL to grams.'),
  pair_visual('Compare','1.5 L vs 1200 mL','Greater','1.5 L','Capacity comparison after converting.','Convert before comparing.')],
 's2-mat-y3-w28-l4': [pair_visual('Review path','g/kg → convert → scale','Then','L/mL → cube volume','Mass/capacity/volume review path.','Units on every answer.'),
  pair_visual('Mini','3 kg; 750 mL; 3×3×2','Heavier','1 kg > 900 g','Compact review items.','List next goals.')],
 's2-mat-y3-w29-l1': [pair_visual('Minute hand','on 4 → 20 min','Hour hand','just past 2 → 2:20','Analog clock reading to the minute.','Use 5-minute marks.'),
  pair_visual('Half past','minute on 6','Example','3:30','Half-past reading on an analog clock.','Do not ignore the minute hand.')],
 's2-mat-y3-w29-l2': [pair_visual('Digital','2:45','Analog','minute on 9','Digital matched to analog.','Minutes only go 00–59.'),
  pair_visual('Also','09:05','Means','9 hours 5 minutes','Digital time with a leading zero.','Invalid times need correcting.')],
 's2-mat-y3-w29-l3': [pair_visual('AM','midnight to noon','PM','noon to midnight','AM/PM halves of the day.','Context chooses AM or PM.'),
  pair_visual('Same numbers','7:00 AM vs 7:00 PM','Different','morning vs evening','Same clock numbers, different day halves.','Noon and midnight are boundaries.')],
 's2-mat-y3-w29-l4': [pair_visual('Fluency','1:25 analog','Digital','01:25 or 1:25','Clock fluency linking faces and digits.','Count marks on misses.'),
  pair_visual('Context','afternoon sport 3:05','Label','PM','AM/PM from event context.','Do not swap hour and minute hands.')],
 's2-mat-y3-w30-l1': [pair_visual('60 min','1 hour','24 h','1 day','Time unit relationships.','7 days = 1 week.'),
  pair_visual('Convert','90 min = 1 h 30 min','21 days','3 weeks','Conversions using 60 and 7.','Not 100 minutes per hour.')],
 's2-mat-y3-w30-l2': [pair_visual('Calendar','weeks in a month','+7 days','same weekday','Calendar structure for dates.','Months have different lengths.'),
  pair_visual('1 April Saturday','8 April','Saturday','+7','Finding a date a week later.','Count days between carefully.')],
 's2-mat-y3-w30-l3': [pair_visual('Start','2:20','End','3:05','Elapsed time on a time line.','Count hours then minutes.'),
  pair_visual('Elapsed','45 minutes','Cross hour','shown in steps','Elapsed time crossing an hour.','Do not subtract times like decimals.')],
 's2-mat-y3-w30-l4': [pair_visual('Fluency','150 min; elapsed; weeks','Facts','60 and 7','Mixed time fluency items.','Write the fact used on misses.'),
  pair_visual('Elapsed','4:10→4:55','Duration','45 min','Short elapsed-time fluency.','Time lines help.')],
 's2-mat-y3-w31-l1': [pair_visual('Timetable','row × column','Meeting cell','the time','How to read a timetable cell.','Use the correct row and column.'),
  pair_visual('Duration','8:15 to 8:32','Travel','17 minutes','Duration from two timetable times.','Wrong row gives wrong time.')],
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
