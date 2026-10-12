#!/usr/bin/env python3
"""Year 3 HSIE Written Core batch 01: local community history + start of First Nations unit, w01-l1 through w06-l2 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

HIS, ACH, GEO = 'HS2-HIS-01', 'HS2-ACH-01', 'HS2-GEO-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='hsie', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-hsie-y3-w01-l1',HIS,['community','place','service','belonging'],
  'A community is a group of people who share a place, a purpose or an interest and who depend on one another. A local community has shared places (school, park, library), people (neighbours, helpers) and services (clinic, bus, rubbish collection).',
  'Example suburb "Riverside": families live along the creek, the library and clinic are shared places, and volunteers run the netball club. The nurse treats club players and club parents raise money for the school, so people depend on each other.',
  'Which of these are communities: neighbours who share a street party each year; ten strangers who wait at the same traffic light once; a netball club; a school?',
  'Street neighbours, the netball club and the school are communities because people share a place or purpose and deal with each other over time. The strangers at the traffic light are not.',
  'Thinking a community is only the buildings, or only people who look or speak alike, leaves out the people, purposes and sharing that make a community.',
  'List six places and six groups in a community you belong to. Draw a web showing who depends on whom. Write three sentences about why members of a community need each other.'),
L('s2-hsie-y3-w01-l2',GEO,['map','symbol','key','direction'],
  'A map is a drawing of a place seen from above. A useful sketch map has a title, symbols explained in a key and a north arrow so a reader can follow directions.',
  'Example map "Home to the park": a square symbol marks home, a green patch marks the park and S marks the shop. Oak Street runs north to south and the north arrow points to the top. The key says square = home, green = park, S = shop.',
  'Draw a map from your classroom to the library with two turns. Which three things must be added so another student can use it?',
  'A title, a key for each symbol and a north arrow. Without them a reader cannot tell what the symbols mean or which way is north.',
  'Drawing houses from the side like a picture, or leaving out the key, gives a picture rather than a map.',
  'Make a map of the area within five minutes of school or a place you know well. Include eight features, a key, a north arrow and a title. Write two directions such as "go north along ...". Leave out your home address.'),
L('s2-hsie-y3-w02-l1',HIS,['change','continuity','past','present'],
  'Historians compare the past and present to find what has changed and what has stayed the same (continuity). Both can be shown by evidence such as photographs, maps and the memories of older people.',
  'Example: an old photo of Elm Street shows a dirt road, a corner shop and a horse and cart. A recent photo shows a sealed road, a supermarket and many cars. Change: road surface, shops, transport. Continuity: the creek still crosses at the same bend and the school sits on the same hill.',
  'Sort into change or continuity: trams replaced by buses; the post office is on the same corner; people still meet at the park on Saturdays.',
  'Trams replaced by buses is change. The post office on the same corner and people meeting at the park are continuity.',
  'Saying that everything has changed, or that nothing has, ignores the evidence that both happen.',
  'Choose a place in your community. Use two sources such as a photo and an older person. Complete a Then / Now / Change / Continuity table with five rows. Suggest one cause of one change.'),
L('s2-hsie-y3-w02-l2',HIS,['interview','question','oral history','permission'],
  'An oral history interview gathers memories from a person who was there. Good interviewers ask permission, prepare open questions that start with how, why or what, listen carefully, record accurately and say thank you.',
  'Weak question: "Did you like school?" (yes or no). Better: "What did you do at lunch when you were at school?" Example notes for a fictional interviewee Mr Lee: walked two kilometres to school; played marbles at lunch; the hall was used for dances.',
  'Rewrite these as open questions: "Was it fun?" and "Did you have a television?"',
  'For example: "What did you enjoy most, and why?" and "How did your family spend evenings and what did you use for entertainment?"',
  'Asking only yes or no questions, or interrupting, produces very short answers that give a historian little evidence.',
  'With adult permission, interview a trusted adult about the past of a place. Write six open questions. Record four facts, one opinion and the date. Do not share private details publicly.'),
L('s2-hsie-y3-w03-l1',HIS,['source','primary','secondary','inference'],
  'A primary source was made at the time being studied (photo, object, letter, map). A secondary source was made later (textbook, documentary). To use a source, ask what it is, who made it, when, what it shows and what it does not show.',
  'Example photo: shopfront sign "Mills Bakery", a horse and cart and people in long coats. It shows a bakery and transport of the time. It does not show who owned the shop or what the bread cost, so those questions need other sources.',
  'A museum holds a heavy iron kettle with a curved handle. What can you infer, and what can you not know from the kettle alone?',
  'It was probably used to heat water over a fire or stove, and the material is iron. You cannot know who owned it or the exact year without a label or another source.',
  'Believing that a photo shows everything truthfully ignores that someone chose what to photograph and what to leave out.',
  'Choose one photo or object from a family, library or museum collection. Complete a source record: type, primary or secondary, clues, one inference and one remaining question. Compare it with a second source.'),
L('s2-hsie-y3-w03-l2',HIS,['timeline','sequence','scale','date'],
  'A timeline puts events in order using dates on an evenly spaced scale. The distance between events shows how much time passed, so the spacing must match the dates.',
  'Example timeline for Riverside, one centimetre for every 20 years: school opens 1890, bridge built 1925, library opens 1968, skate park opens 2010. The gap between the school and the bridge is 35 years, so it is shorter than the gap between the bridge and the skate park.',
  'On a line marked every 10 years from 1900 to 2020 place: school 1912, tram line 1930, park 1975, library 2005. How many years between the park and the library?',
  'Mark each date at its own position. The park and library are 30 years apart. The earliest gap is school to tram line, 18 years.',
  'Spacing events evenly just to make them fit, regardless of their dates, gives a timeline that misleads the reader about time.',
  'Build a timeline of six dated events from your area or family. Use one consistent scale, add a title and write one sentence about a pattern you can see.'),
L('s2-hsie-y3-w04-l1',HIS,['significance','impact','person','place'],
  'A person or place is significant if it mattered to many people, changed something or has a lasting effect. Fame alone does not make something significant, and a person can be significant locally without being known elsewhere.',
  'Example: a nurse who ran the town\'s first clinic for thirty years affected many families, and the clinic still operates. The old railway station is significant because it was where people arrived and where the first market was held.',
  'Which is more significant to a community: someone who painted the school fence once, or someone who led the campaign to build the library? Give a reason.',
  'The library campaigner, because the library serves many people and has lasted for years. The fence painting helped for a short time and affected fewer people.',
  'Assuming that famous or old always means significant skips the questions about impact, numbers of people and how long it lasted.',
  'Choose three people or places in your community. Complete a significance table with columns for impact, people affected and lasting effect. Rank them and justify the order using a local source.'),
L('s2-hsie-y3-w04-l2',HIS,['heritage','landmark','protect','respect'],
  'Heritage is what we inherit from the past and choose to protect: buildings, places, objects, stories and traditions. A landmark is a recognisable feature. Many heritage items, including First Nations sites, are protected, so they must be looked after and never taken or damaged.',
  'Example: the old courthouse is a sandstone building from the 1880s that is now used as a community hall. Council lists it as heritage so changes need approval. It is a landmark because people use it to give directions.',
  'Which could become heritage: an old school bell, a new shopping centre, a hundred-year-old fig tree? Give a reason for each choice.',
  'The bell and the fig tree link to the community\'s past and could be protected. The new shopping centre has no long history yet, though it might become heritage in future.',
  'Thinking heritage means only old buildings leaves out trees, objects, stories and living traditions.',
  'Write a heritage fact sheet on one local landmark: what it is, where it is, its age from a source, who uses it, why it should be protected and two ways to care for it. Name your source.'),
L('s2-hsie-y3-w05-l1',HIS,['inquiry','question','evidence','conclusion'],
  'A history inquiry asks a focused question, finds evidence from more than one source, records findings and reaches a conclusion that names its evidence and its limits.',
  'Question: How has Station Park changed since 1960? Sources: two photos, an interview and a council page. Findings: playground replaced, fence added, trees taller. Conclusion: the park has changed in equipment but kept its trees; limits: only two photos.',
  'Improve this question: "Tell me about history." Write a focused question about a local place and name two sources.',
  'For example: "How has the shopping street changed since 1980?" Sources: an old photo and an interview with a long-time shopkeeper.',
  'A very wide question, or a conclusion with no evidence, cannot be answered by a few sources.',
  'Complete a mini inquiry: write a focused question, use three sources, record an evidence table and write a conclusion with two pieces of evidence and one limit. List your sources.'),
L('s2-hsie-y3-w05-l2',HIS,['review','showcase','present','source'],
  'A unit showcase brings together the skills used to study the past: describing community, mapping, comparing change, interviewing, using sources, timelines, significance and heritage.',
  'Example showcase poster: title, labelled map, a timeline with four dates, two sources named, one interview quote and a conclusion sentence. A one-minute talk covers the question, the strongest piece of evidence and what is still unknown.',
  'Match each showcase part to its skill: map, timeline, quote, conclusion.',
  'Map shows place and direction; timeline shows sequence and time; quote is oral history evidence; conclusion answers the inquiry question.',
  'Filling a poster with pictures but no sources or conclusion shows decoration, not historical thinking.',
  'Assemble a showcase of your community inquiry using the checklist. Practise a one-minute talk and list two questions you would investigate next.'),
L('s2-hsie-y3-w06-l1',ACH,['First Nations','Aboriginal','Torres Strait Islander','respect'],
  'Aboriginal peoples and Torres Strait Islander peoples are two distinct groups, together called First Nations Peoples. There are many different Nations, each with its own languages, laws and ways of life, so no single description fits all. Their cultures are living and continuing.',
  'Example inquiry: a class opens a published map such as the AIATSIS Map of Indigenous Australia. It shows many language groups, so it supports the idea of diversity. The map is indicative and does not draw exact boundaries, so the class writes questions to ask a local Aboriginal education officer.',
  'Which is more accurate: "All Aboriginal people have the same culture" or "There are many First Nations with different languages and customs"? Which sources help?',
  'The second. Sources such as the AIATSIS map, books by First Nations authors and local Aboriginal educators show the diversity.',
  'Talking about First Nations Peoples only in the past tense, or as one group, hides that cultures continue and differ between Nations.',
  'Make a respectful fact file on First Nations Peoples using two published sources. Include two ways Nations differ, one question to ask a local Aboriginal educator and the names of the sources. Do not guess about any Nation.'),
L('s2-hsie-y3-w06-l2',ACH,['Country','Acknowledgement','Welcome','Elders'],
  'Whose Country we are on is found by asking local sources: the local Aboriginal Land Council, council, school Aboriginal education staff or a published map. An Acknowledgement of Country can be given by anyone, while a Welcome to Country is given by Elders or Custodians of that Country.',
  'Example: Mia looks up her suburb on the AIATSIS map, writes the Nation name exactly as it is spelled there and shows it to the school\'s Aboriginal education officer, who confirms the wording used locally. Her acknowledgement: "I acknowledge the Traditional Custodians of the land on which we are learning and pay respect to Elders past and present."',
  'A student guesses the Nation name from a holiday booklet. What should they do instead before using the name in an acknowledgement?',
  'Ask local sources to confirm the name and spelling, and ask how the school wants the words used. Do not guess.',
  'Treating an Acknowledgement of Country as the same as a Welcome to Country mixes up who may speak and what each is for.',
  'Find out how your school or local council acknowledges Country. Record the source, the exact words and who gave you the information. Write your own respectful note for a class event once the local name is confirmed.'),
]

VISUALS = {
 's2-hsie-y3-w01-l1': [pair_visual('Community','people share place or purpose','Not a community','one-off strangers at lights','Defining a community by shared place and purpose.','A community needs sharing over time.'),
  pair_visual('Clinic','nurse treats club players','Club','parents raise money for school','Members of a local community depend on each other.','Show who depends on whom.')],
 's2-hsie-y3-w01-l2': [pair_visual('Map','view from above','Photo','side view of houses','A map is a plan from above, not a side picture.','Plan view shows where things are.'),
  pair_visual('Key','square home, green park, S shop','North arrow','N points to the top','Key symbols and north arrow on a sketch map.','Title, key and north arrow make a map usable.')],
 's2-hsie-y3-w02-l1': [pair_visual('Then','dirt road, horse and cart','Now','sealed road, supermarket','Comparing Elm Street then and now.','Compare two sources of the same street.'),
  pair_visual('Change','road, shops, transport','Continuity','creek bend, school hill','Change and continuity in one place.','Both change and continuity have evidence.')],
 's2-hsie-y3-w02-l2': [pair_visual('Closed','Did you like school?','Open','What did you do at lunch?','Closed and open interview questions.','Open questions start with what, how or why.'),
  pair_visual('Notes','walked 2 km; played marbles','Opinion','"The hall was my favourite"','Separating facts from opinions in interview notes.','Record date and who spoke.')],
 's2-hsie-y3-w03-l1': [pair_visual('Primary','made at the time','Secondary','made later','Primary and secondary sources.','Date and maker matter.'),
  pair_visual('Photo shows','bakery sign, horse cart','Photo hides','owner, prices','What a photo can and cannot show.','A single source leaves questions.')],
 's2-hsie-y3-w03-l2': [pair_visual('1890','school','1925','bridge','Dated events along an even scale.','Space dates by years, not by room on the page.'),
  pair_visual('1968','library','2010','skate park','Later events on the Riverside timeline.','A longer gap needs more space.')],
 's2-hsie-y3-w04-l1': [pair_visual('Significant','many people, lasting effect','Less','few people, short effect','Significance criteria for people and places.','Fame is not the same as significance.'),
  pair_visual('Nurse','clinic still open','Fence painter','one afternoon','Comparing impact in a community.','Impact, numbers and lasting effect.')],
 's2-hsie-y3-w04-l2': [pair_visual('Heritage','buildings, trees, stories','Landmark','recognisable feature','Heritage and landmark meaning.','Heritage includes more than buildings.'),
  pair_visual('Protect','council heritage list','Respect','never take or damage','Caring for heritage places.','Leave objects in place.')],
 's2-hsie-y3-w05-l1': [pair_visual('Question','How has the park changed?','Too wide','Tell me about history','Focused inquiry question beside a vague one.','A focused question can be answered.'),
  pair_visual('Evidence','photos + interview + council','Conclusion','answer + limit','From sources to a conclusion.','Name limits honestly.')],
 's2-hsie-y3-w05-l2': [pair_visual('Poster','title, map, timeline','Talk','question, evidence, unknown','Parts of a community history showcase.','Each part shows a history skill.'),
  pair_visual('Map','place and direction','Timeline','sequence and time','Skills matched to showcase parts.','Say what each part proves.')],
 's2-hsie-y3-w06-l1': [pair_visual('Many Nations','different languages and laws','One group?','a mistaken idea','Diversity of First Nations Peoples.','Avoid one description for all.'),
  pair_visual('Two groups','Aboriginal; Torres Strait Islander','Today','cultures continue','First Nations Peoples then and now.','Cultures are living, not only past.')],
 's2-hsie-y3-w06-l2': [pair_visual('Acknowledgement','anyone can give','Welcome','Elders or Custodians give','Acknowledgement and Welcome compared.','Know who may give which.'),
  pair_visual('Ask','land council, school staff','Guess','booklet or memory','Confirm the local name before using it.','Spell the name as the community does.')],
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
