#!/usr/bin/env python3
"""Year 3 HSIE Written Core batch 06: cultures and communities, start of inquiry project, w31-l1 through w36-l2 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

HIS, ACH, GEO = 'HS2-HIS-01', 'HS2-ACH-01', 'HS2-GEO-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='hsie', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-hsie-y3-w31-l1',HIS,['culture','language','custom','diversity'],
  'Culture is the way a group of people live, including language, food, beliefs, customs, arts, clothing and celebrations. A community can include many cultures, and each person can belong to more than one. We learn about cultures from the people themselves and from reliable sources, not from assumptions.',
  'Example: a school finds that families speak twelve different languages at home. A culture web for one family lists language, favourite foods, a festival and a family custom, with notes on which parts the family chose to share.',
  'Sort into language, food, custom or celebration: Auslan; dumplings; shaking hands when meeting; Lunar New Year.',
  'Auslan: language; dumplings: food; shaking hands: custom; Lunar New Year: celebration.',
  'Believing everyone from a country shares exactly the same culture ignores individual and family differences.',
  'Make a culture web for yourself or for a published example using five categories. Add one thing that is shared with others in your community and one that is different. Share only what you feel comfortable sharing.'),
L('s2-hsie-y3-w31-l2',HIS,['origin','family','map','permission'],
  'Australians\' families come from First Nations Peoples and from many countries around the world. A family origin map uses pins and a key to show places that are part of a family story. People choose what to share, and some families prefer to share a place that is special to them.',
  'Example: a student places pins on a world map: one for where a grandparent was born, one for where their family lives now and one for a place their family often visits. The key says pin colours and the student writes two facts about each.',
  'What could a student do if they do not know where their family came from, or prefer not to say?',
  'Ask a trusted family member if they can, or choose a place that is special to them, such as a holiday place or a place they want to learn about.',
  'Assuming that all students have the same family story, or must share it, ignores privacy and different circumstances.',
  'Make a map showing four places from your family story or a place that matters to you. Include a key, four facts and a sentence about why people may choose not to share.'),
L('s2-hsie-y3-w32-l1',HIS,['migration','reason','arrive','contribute'],
  'Migration means moving to live in another place. People may leave because of war, hardship or lack of work, which are push reasons, or move toward safety, jobs or family, which are pull reasons. Migrants have contributed to Australian communities in many ways.',
  'Example (fictional): a family arrives in the 1960s from Italy. Push: few jobs at home. Pull: work on a building site and relatives already in the suburb. Contributions: a family cafe and a local soccer club. The story is told with date, place, reason and result.',
  'Sort into push or pull: war at home; a job offer; relatives already living in Australia; lack of food.',
  'Push: war at home and lack of food. Pull: a job offer and relatives already in Australia.',
  'Believing everyone migrates for the same reason leaves out the many different stories behind moving.',
  'Write a migration story profile using your own family with permission, a published interview or a library book. Include when, from where, why, challenges and one contribution to the community.'),
L('s2-hsie-y3-w32-l2',HIS,['interview','respect','consent','record'],
  'When interviewing a family member about migration or the past, ask permission, explain why you want to know, prepare open and respectful questions, listen carefully and record accurately. Some memories may be hard to share, so people can choose to skip a question. Ask what you may share with others.',
  'Example questions: "What do you remember about the place you grew up?" and "What was it like in the first week after you arrived?" The interviewer notes the date, who was present and which stories may be shared. Sensitive question reworded: "Is there anything you would like to share about why you moved?"',
  'Which question is more respectful: "Why did your family run away?" or "Is there anything you would like to share about why your family moved?"',
  'The second, because it lets the person choose what to share and avoids guessing at painful reasons.',
  'Pushing someone to answer questions they prefer to skip is disrespectful and may hurt.',
  'Interview a trusted adult with permission and an adult present. Write six open questions, record four facts and one memory, and write which parts they agree you may share. Thank them in writing.'),
L('s2-hsie-y3-w33-l1',HIS,['tradition','festival','food','meaning'],
  'A tradition is something passed down in a family or community, such as a festival, a meal or a custom. Festivals have meanings, for example Diwali is a festival of lights celebrated by many Hindu, Sikh and Jain families, and Eid al-Fitr marks the end of Ramadan for Muslim communities. Use trusted sources or ask families, because traditions differ.',
  'Example table: Lunar New Year; celebrated by many East and South-East Asian communities; families share meals and give red envelopes; meaning: new year and good luck. Each row has name, who celebrates, what people do, meaning and source.',
  'A student says that everyone from one country celebrates in exactly the same way. What should they do to correct this?',
  'Use sources and ask people. Families within a country can celebrate in different ways.',
  'Using one picture of a food or festival to stand for a whole culture is a stereotype.',
  'Complete a table of three traditions with name, who celebrates, what people do, the meaning and the source. Write one thing the traditions share with another tradition you know.'),
L('s2-hsie-y3-w33-l2',HIS,['share','present','respect','allergy'],
  'Sharing a tradition means choosing what you want to share, preparing clear information about what it is and why it matters, and presenting respectfully. Use kind words about other people\'s traditions. Food can only be shared with school permission and attention to allergies.',
  'Example presentation plan: a poster with a photo, the name of the tradition, who takes part, why it matters and one question for the class. A note says no food will be shared unless the school agrees and allergies are checked.',
  'Rewrite "That food is weird" as a respectful comment.',
  'For example: "I have not tried that before. Can you tell me about it?"',
  'Using words like weird or strange to describe a tradition is unkind and closes down learning.',
  'Prepare a two-minute presentation or poster on a tradition you want to share. Include name, who takes part, why it matters, one question for the class and an allergy note. Practise using respectful words.'),
L('s2-hsie-y3-w34-l1',HIS,['language','Auslan','revival','greeting'],
  'More than 300 languages are spoken in homes across Australia, according to the 2021 census, and English is the most common. There are hundreds of First Nations languages, many still spoken and being revived by communities. Auslan is the sign language of the Deaf community in Australia.',
  'Example: a class collects greetings for hello from five languages used by students and families who agree to share, and writes them with a pronunciation note. For First Nations languages, they use materials from the local language centre and do not guess words.',
  'Why might a community want to bring back a language that few people speak?',
  'Language carries culture, stories and identity. Reviving a language helps keep these strong for future generations.',
  'Believing there is only one Aboriginal language, or that First Nations languages no longer exist, ignores the many languages that are still spoken and being revived.',
  'Collect five greetings from languages used in your community with permission, plus one from a published source. Write each with a pronunciation note. For First Nations languages use only local language centre or published sources.'),
L('s2-hsie-y3-w34-l2',GEO,['welcome','newcomer','include','kindness'],
  'Welcoming newcomers means making people feel safe and included. Actions include greeting them by their name and learning how to say it, offering a buddy, showing them around, inviting them to play, using pictures or translation to help and being patient.',
  'Example welcome plan for a new student: a buddy to meet at the gate, a map of the school with the toilets and library marked, a few words in their language if they would like to share, and an invitation to join a lunch game.',
  'Which are welcoming actions: asking how to say a new student\'s name and practising it; ignoring them until they speak English; inviting them to join a game?',
  'Asking how to say their name and practising it, and inviting them to join a game. Ignoring them is unwelcoming.',
  'Thinking a newcomer must learn everything alone leaves out the many ways the community can help.',
  'Create a welcome guide for a new student with six items, including a simple school map and buddy roles. Write two welcoming sentences and one thing a newcomer could teach the class.'),
L('s2-hsie-y3-w35-l1',GEO,['respect','empathy','difference','speak up'],
  'Living together respectfully means treating people kindly, listening to their experiences, being curious without judging and speaking up when someone is treated unfairly because of who they are. Racism and name-calling harm people and are not acceptable.',
  'Example: a student is teased about their lunch. A respectful bystander stands next to them, says "That is not okay" calmly, and tells a teacher. Later they ask the student about the food with real curiosity.',
  'Write one thing you could say or do if you saw someone being teased about their culture.',
  'For example: stand with them, say "That is not okay", and tell a teacher.',
  'Staying silent or laughing along because it seems small allows the unfairness to continue.',
  'Write a respect action plan with three situations, such as name-calling, exclusion and a stereotype. For each write what you could say and do and who you could ask for help.'),
L('s2-hsie-y3-w35-l2',HIS,['review','culture','respect','showcase'],
  'The cultures and communities review links culture, family origins, migration stories, interviewing with care, traditions and festivals, sharing, languages, welcoming newcomers and living together respectfully.',
  'Example showcase: a display with a culture web, a family origin map, a migration story, a language greeting chart and a respect plan, each with sources named and permission noted.',
  'Match each product to what it shows: culture web; origin map; greeting chart; respect plan.',
  'Culture web: parts of culture; origin map: places in a story; greeting chart: language diversity; respect plan: living together fairly.',
  'A display of flags and food pictures with no sources or permission shows stereotypes rather than understanding.',
  'Assemble a cultures and communities showcase using the checklist. Check that you have permission for every personal item. Write a one-minute talk and two questions for further study.'),
L('s2-hsie-y3-w36-l1',HIS,['question','open','investigable','focus'],
  'An inquiry question is a focused question that can be answered using evidence from sources. Open questions often begin with how or why and need more than yes or no. An investigable question can be answered using people, places, objects, books or maps that you can reach.',
  'Example: Topic: our library. Closed question: Is the library old? Open and investigable: How has the library changed since 1990? Sources: old photos, a librarian interview, the council website.',
  'Improve this question for a local topic: "Why is everything different?"',
  'For example: "How have the shops in our main street changed since 1980?" It names the place, time and what to look for.',
  'A question that is too wide, or that has only a yes or no answer, cannot guide an investigation.',
  'Choose a topic you can study. Write eight possible questions, choose one main question and three smaller sub-questions, and explain why your main question is open and investigable.'),
L('s2-hsie-y3-w36-l2',HIS,['plan','source','timetable','ethics'],
  'A plan for an investigation lists the question, the sources to use, the steps in order, who to ask, a timetable and ethical rules such as permission, safety and honest recording. A record sheet is prepared before collecting information.',
  'Example plan: Question: How has the library changed since 1990? Sources: three photos from the local history room, an interview with a librarian, the council web page. Timetable: week 1 photos, week 2 interview, week 3 write findings. Ethics: permission for the interview and photo credits.',
  'Put these steps in order: write findings; choose a question; collect sources; plan a timetable.',
  'Choose a question; plan a timetable; collect sources; write findings.',
  'Starting to collect information with no plan wastes time and often leaves gaps.',
  'Write a plan for your inquiry with the question, three sources, four steps, a timetable, a record sheet design and three ethical rules. Show your plan to an adult before you start.'),
]

VISUALS = {
 's2-hsie-y3-w31-l1': [pair_visual('Culture','language, food, customs','Families','12 languages at home','Culture and diversity in one school.','Culture includes more than food.'),
  pair_visual('Web','my language, my festival','Share','only what I choose','A personal culture web.','Choose what to share.')],
 's2-hsie-y3-w31-l2': [pair_visual('Pin','where a grandparent was born','Pin','where we live now','A family origin map.','Use a key for pin colours.'),
  pair_visual('Choice','share if you wish','Special place','a place that matters','Privacy on family maps.','No one has to share.')],
 's2-hsie-y3-w32-l1': [pair_visual('Push','war, few jobs','Pull','safety, work, relatives','Push and pull reasons.','Each story has its own reasons.'),
  pair_visual('1960s','family arrives','Contribution','cafe and soccer club','A migration story.','Date, place, reason, result.')],
 's2-hsie-y3-w32-l2': [pair_visual('Respectful','Is there anything you would like to share?','Pushy','Why did your family run away?','Respectful and pushy questions.','Let people choose.'),
  pair_visual('Record','date, who, what may be shared','Thank','thank-you note','Recording and thanking.','Ask what you may share.')],
 's2-hsie-y3-w33-l1': [pair_visual('Lunar New Year','meals, red envelopes','Diwali','festival of lights','Two traditions and their meanings.','Use sources or ask families.'),
  pair_visual('Eid al-Fitr','end of Ramadan','Not all same','families differ','Traditions within cultures.','Avoid stereotypes.')],
 's2-hsie-y3-w33-l2': [pair_visual('Poster','name, who, why it matters','Question','one for the class','Plan for sharing a tradition.','Keep language respectful.'),
  pair_visual('Weird food','unkind','Tell me about it','curious and kind','Respectful comments.','Ask, do not judge.')],
 's2-hsie-y3-w34-l1': [pair_visual('Homes','300+ languages','English','most common','Languages at home in Australia.','Many languages share one community.'),
  pair_visual('First Nations','hundreds, revived today','Auslan','sign language of the Deaf','Languages and sign language.','Use local language centres.')],
 's2-hsie-y3-w34-l2': [pair_visual('Name','say it correctly','Buddy','meet at the gate','Welcoming a new student.','Say the name kindly and correctly.'),
  pair_visual('Map','toilets and library marked','Invite','join a lunch game','Helping a newcomer settle in.','Include them in play.')],
 's2-hsie-y3-w35-l1': [pair_visual('Teasing','about lunch','Upstander','stand with, say it is not okay','Responding to teasing.','Tell an adult too.'),
  pair_visual('Curious','ask kindly','Judging','laughing along','Curiosity and judgement.','Curiosity includes listening.')],
 's2-hsie-y3-w35-l2': [pair_visual('Web','culture parts','Map','family places','Evidence from the unit.','Permission for personal items.'),
  pair_visual('Greetings','languages','Respect plan','what to say and do','More evidence from the unit.','Name the source.')],
 's2-hsie-y3-w36-l1': [pair_visual('Closed','Is the library old?','Open','How has it changed since 1990?','Closed and open questions.','Open questions need evidence.'),
  pair_visual('Too wide','Why is everything different?','Focused','shops on Main Street since 1980','Wide and focused questions.','Name place and time.')],
 's2-hsie-y3-w36-l2': [pair_visual('Week 1','photos','Week 2','interview','Inquiry timetable.','Plan the order of steps.'),
  pair_visual('Week 3','write findings','Ethics','permission, safety, honesty','Timetable end and ethics.','Show your plan to an adult.')],
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
