#!/usr/bin/env python3
"""Year 3 HSIE Written Core batch 05: citizenship close, community and remembrance, w25-l1 through w30-l2 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

HIS, ACH, GEO = 'HS2-HIS-01', 'HS2-ACH-01', 'HS2-GEO-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='hsie', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-hsie-y3-w25-l1',GEO,['citizen','responsibility','contribute','community'],
  'A citizen is a member of a community with rights and responsibilities. Good citizens follow laws and rules, respect other people, care for shared places, help others and take part in decisions in ways that suit their age, such as class votes.',
  'Example: a student returns a lost jumper to the office, picks up litter at the park with a parent, votes in a class decision and welcomes a new student. Each action helps the community and shows a responsibility.',
  'Which are good citizen actions: picking up litter in a park; copying in a test; volunteering at the school fete; leaving a gate open on a farm?',
  'Picking up litter and volunteering. Copying is dishonest and an open farm gate can harm animals and people.',
  'Believing only adults can be citizens ignores the many ways children contribute to their communities.',
  'Write a citizenship plan with three actions, one for home, one for school and one for the wider community. For each name the responsibility it shows and how you will record evidence that you did it.'),
L('s2-hsie-y3-w25-l2',GEO,['review','rights','laws','showcase'],
  'The rules, laws and fairness review links why we have rules, rules in different places, fairness and rights, responsibilities, who makes rules, class decisions, laws, fair conflict resolution and good citizenship.',
  'Example showcase: a poster with a class charter, a diagram of who makes rules at three levels of government, a vote tally and a short conflict script, each labelled with the skill and the evidence.',
  'Match each item to its idea: charter; government diagram; vote tally; conflict script.',
  'Charter: rights and responsibilities; government diagram: who makes rules; vote tally: fair decisions; script: resolving conflict.',
  'Listing rules without reasons or evidence shows memory but not understanding of why rules matter.',
  'Assemble a rules and fairness showcase using the checklist. Write a one-minute talk and name two rules you think are most important and why.'),
L('s2-hsie-y3-w26-l1',HIS,['commemorate','significance','date','celebrate'],
  'Days of national and local significance are times when communities remember or celebrate something important. National examples include Anzac Day on 25 April, Remembrance Day on 11 November, National Sorry Day on 26 May and NAIDOC Week in July. Local examples include town anniversaries and local memorial days.',
  'Example calendar entries: 25 April, Anzac Day, remember people who served in war and operations; 26 May, National Sorry Day, remember Aboriginal and Torres Strait Islander children taken from their families; first week in July, NAIDOC Week, celebrate First Nations history and culture. Each entry has a date, purpose and way the day is marked.',
  'Sort each day into remember, celebrate or both: Anzac Day; a town anniversary picnic; NAIDOC Week.',
  'Anzac Day is mainly remember. A town anniversary picnic is mainly celebrate. NAIDOC Week celebrates First Nations culture, though it also honours history, so it can be both.',
  'Treating every special day as a holiday for fun leaves out days that are mainly for remembering and reflecting.',
  'Make a calendar of six days of significance, including one local day found from a council or library source. For each record the date, what it marks, why it matters and how it is observed. Name your sources.'),
L('s2-hsie-y3-w26-l2',HIS,['remember','memorial','respect','identity'],
  'Communities remember people and events to honour them, to learn from the past and to share an identity. They do this through ceremonies, memorials, minutes of silence, stories and traditions. Different groups may remember different events in different ways.',
  'Example: a town war memorial lists the names of local people who served. On days of remembrance people place flowers and stand quietly. Local families and the council look after the memorial, which shows the community\'s respect.',
  'Why might a town keep a memorial in its main street? Give two reasons.',
  'To honour the people named and to remind the community of the past. It also gives people a place to gather and remember together.',
  'Thinking memorials are only sad places leaves out honour, learning and shared identity.',
  'Study a local memorial by visiting with an adult or using a photo or council page. Record what it remembers, who it is for, the symbols on it and when it is used. Write three reasons the community keeps it.'),
L('s2-hsie-y3-w27-l1',HIS,['Anzac','Gallipoli','dawn','remembrance'],
  'Anzac stands for Australian and New Zealand Army Corps. On 25 April 1915 Anzac soldiers landed at Gallipoli in Turkey. Anzac Day on 25 April now remembers all Australians and New Zealanders who have served and died in wars and conflicts. Aboriginal and Torres Strait Islander people have also served. The day is for remembering, not for celebrating war.',
  'Example fact sheet: Who: Australian and New Zealand soldiers. When: landing before dawn on 25 April 1915. Where: Gallipoli, Turkey. Today: dawn services, the Last Post, a minute\'s silence and wreaths, with the words "Lest we forget".',
  'What does ANZAC stand for, and why is the main service held at dawn?',
  'Australian and New Zealand Army Corps. Dawn services recall that the landing took place at dawn.',
  'Believing Anzac Day celebrates winning a war misses that it honours those who served and those who died.',
  'Write a fact sheet on Anzac Day using one reliable source such as the Australian War Memorial. Include who, when, where, how it is remembered and why. Add one question you would ask a veteran or family member with permission.'),
L('s2-hsie-y3-w27-l2',HIS,['symbol','poppy','cenotaph','Last Post'],
  'Symbols help communities remember. The red poppy is worn for Remembrance Day. Rosemary is worn on Anzac Day to show remembrance. The Last Post is a bugle call played at ceremonies. A cenotaph is a monument to people buried elsewhere. A minute\'s silence at 11 am on 11 November marks the end of the First World War.',
  'Example table: Poppy; red flower; worn near 11 November to remember; Last Post; bugle call; played at services to honour those who died; Wreath; circle of flowers; placed at a memorial to show respect. Each symbol has a meaning and a time it is used.',
  'Match each symbol to its meaning: poppy; minute\'s silence; wreath.',
  'Poppy: remembrance; minute\'s silence: quiet respect at 11 am on 11 November; wreath: flowers laid to honour those remembered.',
  'Treating symbols as decoration without learning their meaning removes the respect they are meant to show.',
  'Create a remembrance symbols page with four symbols, the meaning of each and when it is used. Choose one symbol for a local event and justify your choice with a reason.'),
L('s2-hsie-y3-w28-l1',HIS,['Australia Day','Sorry Day','NAIDOC','perspective'],
  'Australia Day on 26 January marks the arrival of the First Fleet at Sydney Cove in 1788. Many Australians celebrate it, and many First Nations people see it as the start of dispossession and call it Survival Day or Invasion Day. National Sorry Day on 26 May remembers the Stolen Generations. NAIDOC Week in July celebrates the history, culture and achievements of First Nations Peoples.',
  'Example table: 26 January: arrival of the First Fleet 1788; seen as a celebration by some and as a day of mourning by others. 26 May: National Sorry Day; remembers Aboriginal and Torres Strait Islander children who were removed from families by government policies. July: NAIDOC Week; celebrates culture and achievements.',
  'Match each day to what it recognises: 26 January; 26 May; NAIDOC Week.',
  '26 January: First Fleet arrival and different views; 26 May: the Stolen Generations; NAIDOC Week: First Nations history, culture and achievements.',
  'Saying that everyone feels the same way about 26 January leaves out the experiences of First Nations Peoples.',
  'Make a fact table for three days with date, what it marks and who it matters to. Write two respectful sentences about why people can feel differently about 26 January. Talk with an adult about anything that worries you.'),
L('s2-hsie-y3-w28-l2',HIS,['perspective','listen','evidence','respect'],
  'A perspective is how a person sees an event based on their experiences. The same day can mean different things to different people. To explore perspectives respectfully, listen, use evidence from different sources, avoid saying one view is simply wrong and say when you need to learn more.',
  'Example: on a day of significance, one source says it is a day of celebration for a community group. Another source from a First Nations organisation says it is a day of mourning. The student records both with sources and writes "Some people... while others..." without judging either.',
  'Write one sentence with "Some people believe... while others believe..." for an event with more than one view.',
  'For example: "Some people celebrate 26 January as a national day, while others see it as a day to remember loss."',
  'Choosing a side with no evidence, or treating one group\'s view as the only one, is not respectful historical thinking.',
  'Choose one day of significance. Read two sources with different views and record who said what. Write a respectful summary and one question you still have. Ask an adult to read it.'),
L('s2-hsie-y3-w29-l1',HIS,['celebration','culture','tradition','diversity'],
  'Communities celebrate for many reasons, such as culture, religion, harvest, history or friendship. Examples include Lunar New Year, Diwali, Eid, Christmas, Harmony Day and local shows. Celebrations help people share traditions and learn about each other.',
  'Example: Harmony Day on 21 March celebrates cultural diversity. A class records the day, why it is held and how people join in, such as wearing orange and sharing stories. Another entry lists a local community festival and who organises it.',
  'Sort each into culture, religion or local community: Diwali; Christmas; the town agricultural show; Harmony Day.',
  'Diwali and Christmas are religious celebrations for many people and also cultural. The show is local community. Harmony Day celebrates cultural diversity.',
  'Believing everyone in a country celebrates the same things ignores the many cultures within a community.',
  'Choose one celebration held in your community. Make a profile with what, when, who, how it is celebrated and why it matters. Include one respectful way for visitors to join. Use a local or family source.'),
L('s2-hsie-y3-w29-l2',HIS,['plan','ceremony','program','respect'],
  'Planning a class commemoration means choosing its purpose, deciding who will take part, setting the order of the program, giving roles and thinking about respectful behaviour. A good plan is safe, simple and considers everyone in the class.',
  'Example plan: purpose, a minute\'s silence at school on 11 November. Program: welcome, acknowledgement of Country, a short reading, silence at 11 am, flowers placed, thank you. Roles: speaker, timekeeper and flower carrier.',
  'Put in order: minute\'s silence; welcome; thank you; reading.',
  'Welcome; reading; minute\'s silence; thank you.',
  'Planning a long program with no roles or quiet moments makes the event hard to follow and less respectful.',
  'Plan a class commemoration for a day of significance. Write the purpose, a timed program with five parts, roles for four students and three rules for respectful behaviour. Include a short script for the speaker.'),
L('s2-hsie-y3-w30-l1',HIS,['symbol','flag','emblem','anthem'],
  'Australia has national symbols that help show identity: the Australian flag, the coat of arms with a kangaroo and an emu, the golden wattle, the national colours green and gold and the anthem Advance Australia Fair. The Aboriginal flag and the Torres Strait Islander flag are also official flags of Australia.',
  'Example: the Australian flag has the Union Jack, the Southern Cross and the seven-pointed Commonwealth Star. The Aboriginal flag, designed by Harold Thomas in 1971, has black for Aboriginal people, yellow for the sun and red for the earth. The Torres Strait Islander flag was designed by Bernard Namok.',
  'Match each symbol to what it shows: golden wattle; coat of arms; Aboriginal flag.',
  'Golden wattle: floral emblem; coat of arms: kangaroo and emu with a shield; Aboriginal flag: black, yellow and red with meanings.',
  'Treating symbols as decoration ignores their designers, histories and meanings.',
  'Make a symbols of Australia poster with five symbols, what each shows and who designed it if known. Name one source and one question you still have.'),
L('s2-hsie-y3-w30-l2',HIS,['review','remembrance','significance','showcase'],
  'The community and remembrance unit links days of significance, why we remember, Anzac Day, symbols of remembrance, different perspectives on days, celebrations, planning a commemoration and national symbols. Respect and evidence matter in every part.',
  'Example showcase: a one-page display with a calendar of days, an Anzac Day fact sheet, a symbol page, a respectful two-view summary and a commemoration plan, with sources named.',
  'Match each product to its skill: calendar; symbol page; two-view summary; plan.',
  'Calendar: significance and dates; symbol page: meaning; two-view summary: perspectives; plan: respectful commemoration.',
  'A display of pictures without sources or reasons shows decoration and not understanding.',
  'Assemble a showcase of your community and remembrance work. Write a one-minute talk and list two questions for further study.'),
]

VISUALS = {
 's2-hsie-y3-w25-l1': [pair_visual('Citizen','member with duties','Action','return a lost jumper','A citizen\'s responsibilities.','Children can be citizens too.'),
  pair_visual('Home','tidy up','Community','welcome a new student','Citizen actions in two places.','Record evidence of each action.')],
 's2-hsie-y3-w25-l2': [pair_visual('Charter','rights and duties','Government','local, state, federal','Rules and fairness parts.','Label each part.'),
  pair_visual('Vote','tally and decision','Script','conflict steps','Decisions and conflicts.','Name the skill shown.')],
 's2-hsie-y3-w26-l1': [pair_visual('25 April','Anzac Day, remember service','26 May','Sorry Day, remember children','National days of remembrance.','Date, meaning, how marked.'),
  pair_visual('July','NAIDOC Week, celebrate','Local','town anniversary','Celebrate, remember or both.','Add one local day.')],
 's2-hsie-y3-w26-l2': [pair_visual('Memorial','names of local people','Gather','flowers, quiet, stories','How a community remembers.','Care for the memorial.'),
  pair_visual('Honour','those remembered','Study','the past','Reasons to remember.','Remembering has many purposes.')],
 's2-hsie-y3-w27-l1': [pair_visual('1915','landing at Gallipoli','25 April','Anzac Day today','From 1915 to Anzac Day today.','Remember, not celebrate war.'),
  pair_visual('Dawn','service at first light','Words','"Lest we forget"','Dawn service and its words.','Honour all who served.')],
 's2-hsie-y3-w27-l2': [pair_visual('Poppy','red flower, Remembrance Day','Rosemary','worn on Anzac Day','Flowers that remember.','Each symbol has a meaning.'),
  pair_visual('Last Post','bugle call','11 am','minute\'s silence on 11 Nov','Sound and silence of remembrance.','Quiet respect is part of it.')],
 's2-hsie-y3-w28-l1': [pair_visual('26 January','First Fleet arrives, 1788','Views','celebrate or mourn','One date with different views.','Listen to First Nations voices.'),
  pair_visual('26 May','Sorry Day, Stolen Generations','July','NAIDOC Week, culture','Two days for First Nations Peoples.','Dates and what each marks.')],
 's2-hsie-y3-w28-l2': [pair_visual('Perspective','how a person sees an event','Evidence','two sources, two views','Perspectives with evidence.','Name each source.'),
  pair_visual('Some people','celebrate','Others','remember loss','Respectful sentence frame.','Avoid saying one view is wrong.')],
 's2-hsie-y3-w29-l1': [pair_visual('Harmony Day','21 March, diversity','Local show','community festival','Two community celebrations.','Date, host and meaning.'),
  pair_visual('Diwali','festival of lights','Lunar New Year','family traditions','Celebrations in many cultures.','Ask families or use sources.')],
 's2-hsie-y3-w29-l2': [pair_visual('Welcome','then reading','Silence','at 11 am','Order of a short commemoration.','Quiet time is part of the plan.'),
  pair_visual('Roles','speaker, timekeeper, flowers','Rules','quiet, kind, on time','Roles and rules.','Everyone has a part.')],
 's2-hsie-y3-w30-l1': [pair_visual('Flag','Union Jack, Southern Cross, star','Coat of arms','kangaroo and emu','Australian flag and coat of arms.','Every part has a meaning.'),
  pair_visual('Aboriginal flag','black, yellow, red','Wattle','golden wattle, green and gold','Flag colours and emblems.','Name the designer when known.')],
 's2-hsie-y3-w30-l2': [pair_visual('Calendar','days and dates','Symbol page','four symbols','Evidence from the unit.','Include sources.'),
  pair_visual('Two views','respectful summary','Plan','commemoration steps','More evidence from the unit.','Say what each shows.')],
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
            bundle = build_from_spec(base, u, VISUALS[u['seed_key']], subject='hsie')
            atomic_json(ROOT / 'lesson-pipeline/authored' / f"{u['seed_key']}.json", bundle)
            print('Written Core hsie bundle:', u['seed_key'])
    finally:
        db.close()

if __name__ == '__main__':
    create()
