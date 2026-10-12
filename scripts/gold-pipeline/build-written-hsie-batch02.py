#!/usr/bin/env python3
"""Year 3 HSIE Written Core batch 02: First Nations unit w07-l1 through w10-l2, then places near and far w11-l1 through w12-l2 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

HIS, ACH, GEO = 'HS2-HIS-01', 'HS2-ACH-01', 'HS2-GEO-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='hsie', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-hsie-y3-w07-l1',ACH,['Country','belonging','responsibility','respect'],
  'For many First Nations Peoples, Country means much more than land. It includes waters, sky, plants, animals, people, stories and responsibilities, and caring for Country is shared between people and place. Each Nation has its own relationship with its own Country, so we learn from local voices and published sources instead of assuming.',
  'Example reading: a book written by a First Nations author describes Country as family, with duties to look after it. The class records three ideas from the text, such as "includes water and sky", "people belong to Country" and "caring is a responsibility", and adds the name of the author and the Nation named in the book.',
  'A classmate says Country just means a piece of land. Using the ideas above, write one sentence that corrects the idea and name where you found your information.',
  'Country includes land, waters, sky, living things and people, along with stories and responsibilities. Name the published source or the local educator who provided the idea.',
  'Treating Country as only a place on a map misses the relationships and responsibilities described by First Nations authors and Custodians.',
  'Read or listen to a published text by a First Nations author or local educator about Country. Record three ideas and the source. Then draw a place you belong to and write two sentences about how you care for it. Do not claim to know any Nation\'s ties to its Country.'),
L('s2-hsie-y3-w07-l2',ACH,['season','calendar','sign','local'],
  'Many First Nations have seasonal calendars based on local signs such as flowering plants, animal behaviour and weather, rather than the four fixed seasons used in many school calendars. The number and names of seasons differ between Nations, so calendars must come from community-approved sources and are not interchangeable.',
  'Example: a class looks at a community-approved seasonal calendar published by a First Nations organisation. They record how the calendar uses signs such as the flowering of a plant to mark a change, then compare the number of seasons with the four-season calendar on the classroom wall.',
  'A student says "All Aboriginal calendars have four seasons". What should they do to correct this, and what kind of source should they use?',
  'Look at community-approved published calendars from different Nations, such as those shared by First Nations organisations, and note that the number and names of seasons differ.',
  'Painting a local calendar and calling it an Aboriginal calendar claims knowledge that belongs to Custodians.',
  'Create your own signs-of-the-year calendar for your area using what you can observe, such as flowering trees, birds and weather, across at least four months. Label it clearly as your own. List one published First Nations calendar source and one difference from yours.'),
L('s2-hsie-y3-w08-l1',ACH,['story','Custodians','permission','source'],
  'Dreaming stories belong to particular Nations and families. They carry law, history, science, geography and responsibilities and are not just fairytales. Some are shared publicly by Custodians for education and others are not for sharing, so students use only stories that Custodians or First Nations authors have published, and they do not invent or guess.',
  'Example: a class library book is credited to a named First Nations storyteller, names the Nation and credits the artist. The teacher reads the book as it is written instead of retelling it from memory. The class records the title, storyteller, Nation and publisher on a source card.',
  'Which is the better source: a website with no author, or a book credited to named Custodians of a Nation? Give a reason.',
  'The book credited to Custodians, because it shows who holds the story and that they chose to share it. The unnamed website cannot show permission or accuracy.',
  'Thinking Dreaming stories are made-up fairytales, or that any version is as good as another, ignores that they carry law and knowledge held by Custodians.',
  'Read or listen to one published story by a First Nations storyteller. Complete a source card with title, storyteller, Nation, publisher and one thing the story teaches the reader about responsibility. Do not retell the story from memory.'),
L('s2-hsie-y3-w08-l2',ACH,['protocol','retell','credit','permission'],
  'Protocols are respectful rules for sharing First Nations stories and knowledge. Before using a story, ask who holds it and whether permission has been given. Credit the storyteller and the Nation, do not change the words or images, and do not copy art styles or symbols as if they were yours.',
  'Example: a class wants to share a story at assembly. They ask their local Aboriginal education officer, who suggests the school invite a Custodian or read the published book with its credits shown. The class writes a thank-you note and puts the credits on the program.',
  'A student wants to retell a story they heard once and add a new ending. List two protocol questions they should ask first.',
  'Who holds this story, and do I have permission to share it? How should the storyteller and Nation be credited? Changing a story is not acceptable.',
  'Believing that anyone can retell a story if the retelling is kind ignores who holds the story and whether permission was given.',
  'Write a protocol checklist of five questions to ask before sharing a First Nations story. Then write a short story of your own about a place you care for, and explain why it was right to choose your own story.'),
L('s2-hsie-y3-w09-l1',ACH,['technology','tool','material','environment'],
  'First Nations Peoples developed tools and technologies suited to local environments and materials, such as boomerangs, woomeras, digging sticks, grinding stones, coolamons, bark canoes and fish traps. Different places used different tools, so no single list fits every Nation, and each tool is matched to its purpose and local materials.',
  'Example: the stone fish traps at Brewarrina in New South Wales are still standing. The class writes a record: tool = stone fish trap; material = local stone; purpose = catching and holding fish; environment = river. They name a published source and note that other Nations used other methods.',
  'Match tool to purpose: grinding stone; coolamon; boomerang. Why might a bark canoe suit a river but not a desert?',
  'Grinding stone: crushing seeds; coolamon: carrying or holding; boomerang: hunting, digging or other purposes depending on the kind. Bark canoes suit water and local trees but a desert has little water to travel on.',
  'Describing First Nations technology as "simple" ignores the knowledge of materials and the design that make each tool effective.',
  'Choose four tools from a museum or library source. For each, record the material, purpose and environment, then write one sentence on the knowledge needed to make it. Name the source and one question for a local Aboriginal educator.'),
L('s2-hsie-y3-w09-l2',ACH,['bush food','safety','caring','knowledge'],
  'Bush foods are native plants and animals eaten by First Nations Peoples, and the knowledge of how to find, prepare and care for them belongs to Custodians. Some plants are harmful if prepared the wrong way, so students never pick or eat wild plants without expert guidance. Caring for Country includes taking only what is needed and protecting plants and animals.',
  'Example: a class learns that macadamia nuts, finger limes and lemon myrtle are Australian native foods now sold by growers, including First Nations-owned businesses. They write one care rule, such as "take only what is needed", and one safety rule: never eat plants you find outside without expert advice.',
  'A friend wants to taste berries from a bush in the park because they are bush food. What two things should you say?',
  'Do not eat wild plants without an expert; some are harmful if prepared incorrectly. Bush food knowledge belongs to Custodians, so ask a local Aboriginal educator or use a published source.',
  'Assuming that any berry growing outside is a bush food and safe to eat is dangerous and ignores the knowledge needed.',
  'Research three native foods from a published source. Record the name, where it grows and one caring idea. Write two safety rules and one way students can care for local plants. Do not taste wild plants.'),
L('s2-hsie-y3-w10-l1',ACH,['contribution','today','achievement','respect'],
  'First Nations Peoples make important contributions today in art, sport, law, science, language revival and caring for Country. Contributions come from many people and communities, so we use published sources and ask local educators to find examples that are local and accurate.',
  'Example: Eddie Mabo, a Meriam man from the Torres Strait, led a case that led to the High Court Mabo decision in 1992, which recognised that First Nations peoples held rights to land before colonisation. The class also records a different kind of contribution, such as an Indigenous ranger group caring for Country.',
  'Match each person or group to the area of contribution: Eddie Mabo; Albert Namatjira; Cathy Freeman; Indigenous rangers.',
  'Mabo: law and land rights; Namatjira: art; Freeman: sport, 400 metres at the 2000 Olympics; rangers: caring for Country.',
  'Thinking First Nations contributions belong only to the past hides the achievements of people and communities today.',
  'Choose three contributions from three different areas from published sources. Record who, what and why it matters. Add one local example found by asking your school library or a local educator.'),
L('s2-hsie-y3-w10-l2',ACH,['review','respect','protocol','Country'],
  'The First Nations unit review connects diversity of Nations, Acknowledgement of Country, connection to Country, seasonal calendars, story protocols, technology, bush food care and contributions today. The key habit is respect: ask, credit and use community-approved sources.',
  'Example review plan: a poster with a published map credit, the local acknowledgement wording confirmed by a local source, a source card for one story, a care rule for Country and one contribution today, each with the source named.',
  'Match each habit to a respectful action: confirm local name; credit a story; follow safety rules for plants.',
  'Confirm local name by asking local sources; credit a story by naming storyteller and Nation; follow safety by not eating wild plants without an expert.',
  'A poster of pictures with no sources or protocols shows decoration instead of respectful learning.',
  'Complete a review sheet with five respectful habits from this unit and an example of each. Write one question you would like to ask a local Aboriginal educator, and say how you would show thanks.'),
L('s2-hsie-y3-w11-l1',GEO,['place','location','feature','use'],
  'A place can be described by its location (where it is), its features (what is there), how people use it and how it changes. Geographers describe what can be observed and measured before giving opinions.',
  'Example: Maple Creek Reserve is east of the town centre near Station Street. Features: a creek, bushland and picnic shelters. People use it for walking and bird watching. Opinion kept separate: "I find it peaceful".',
  'Describe your school ground using location, three features and two uses. Which sentence is an opinion instead of a feature?',
  'For example: "The school ground is behind the main building" is location; "a basketball court" is a feature; "the best place" is an opinion.',
  'Describing only what you like about a place gives opinions without the features other people could observe.',
  'Write a place profile of somewhere you know. Include its location with a nearby landmark and direction, six features, three uses and one change over time. Add a sketch or photo.'),
L('s2-hsie-y3-w11-l2',GEO,['natural','built','managed','impact'],
  'Natural features exist without people, such as creeks, hills, beaches and bush. Built features are made by people, such as roads, bridges and benches. Some places are managed, such as a planted garden, where people shape living things. Built features can affect natural ones.',
  'Example: at a beach, sand dunes and rock pools are natural. The surf club, seawall and boardwalk are built. Planted dune grass is managed because people planted it to hold the sand.',
  'Sort: waterfall, dam, footpath, bush, a pond dug by council. Which is hardest to place and why?',
  'Natural: waterfall and bush. Built: dam, footpath and dug pond. The pond is hardest because it holds living plants even though people made it.',
  'Believing that anything green is natural ignores that people plant and shape gardens, lawns and sports fields.',
  'Make a two-column table of eight natural and eight built features from a place you know. Mark two where people have shaped living things. Write one sentence on how a built feature affects a natural one.'),
L('s2-hsie-y3-w12-l1',GEO,['symbol','key','compass','scale'],
  'A map uses symbols explained in a key, a compass rose to show direction (north, south, east, west and in between) and often a scale that shows how a map distance matches real distance. Direction comes from the north arrow, not from the left or right of the page.',
  'Example map: a blue wavy line is the river and a red cross is the hospital. P is parking. The compass rose shows north at the top. The scale says 2 cm = 200 metres. From the school go east along the main road for 4 cm, which is 400 metres, to the library.',
  'The library is north-east of the park. In which direction is the park from the library? Write the compass direction.',
  'South-west. The opposite of north-east is south-west.',
  'Saying "left is west" ignores the north arrow, which sets direction on the map.',
  'Use a map of your local area from a library or council. Answer eight questions using key, compass and scale. Write a route using direction words and distances, and design a key for six symbols.'),
L('s2-hsie-y3-w12-l2',GEO,['plan','grid','scale','title'],
  'To make a map, plan the area, choose features, decide symbols and a key, add a compass and scale, and give it a title. A grid of squares helps place features accurately, and a review asks what the map shows well and what it leaves out.',
  'Example plan: a playground map on a grid of ten squares by eight squares, with one square equal to five paces. Symbols: a green circle for a tree, a blue square for a tap and a brown rectangle for a bench. Title, key and north arrow are added last.',
  'Choose symbols for a tree, a tap, a bench and a handball court. Why should each symbol be different?',
  'For example: green circle, blue square, brown rectangle and a grey rectangle with lines. Different symbols let the reader tell features apart using the key.',
  'Using the same symbol for several features, or leaving off the key, makes the map hard to read.',
  'Draw a grid map of the school ground or a room with ten features. Include a key, compass, scale and title. Write one sentence on what the map shows well and one on what it leaves out.'),
]

VISUALS = {
 's2-hsie-y3-w07-l1': [pair_visual('Land','soil, hills, rivers','Connected','waters, sky, living things, people','Land and everything connected to it.','Relationships and responsibilities.'),
  pair_visual('Source','First Nations author','Ask','local educator','Where to find local ideas respectfully.','Name the source of every idea.')],
 's2-hsie-y3-w07-l2': [pair_visual('Four seasons','one school calendar','Local signs','plants, animals, weather','Fixed seasons beside signs-based calendars.','Calendars differ between Nations.'),
  pair_visual('Published','community-approved calendar','Your own','label it as your own','Own calendar versus a community calendar.','Do not claim knowledge held by Custodians.')],
 's2-hsie-y3-w08-l1': [pair_visual('Story','holds law and knowledge','Fairytale?','a mistaken label','Stories carry law and knowledge.','Some stories are not for sharing.'),
  pair_visual('Source card','title, storyteller, Nation','Permission','shared by Custodians','A source card for a published story.','Credit the storyteller and Nation.')],
 's2-hsie-y3-w08-l2': [pair_visual('Ask first','who holds this story?','Credit','storyteller and Nation','Protocol questions before sharing.','Never change the words.'),
  pair_visual('Own story','a place you care for','Not yours','copied art or symbols','Choose your own story.','Share only what is yours to share.')],
 's2-hsie-y3-w09-l1': [pair_visual('Tool','coolamon, woomera, boomerang','Matched to','purpose and local materials','Tools matched to purpose and materials.','Different places used different tools.'),
  pair_visual('Fish trap','stone, river, Brewarrina','Knowledge','design for water flow','Technology from skilled design.','Skilled design is not simple.')],
 's2-hsie-y3-w09-l2': [pair_visual('Bush food','native plants and animals','Knowledge','held by Custodians','Bush foods belong to a living knowledge.','Ask local educators.'),
  pair_visual('Safe','never eat wild plants','Care','take only what is needed','Safety and care rules for plants.','Expert guidance comes first.')],
 's2-hsie-y3-w10-l1': [pair_visual('Mabo','law and land rights, 1992','Namatjira','art','Contributions in law and art.','Contributions come from many fields.'),
  pair_visual('Freeman','sport, 2000 Olympics','Rangers','caring for land and waters','Contributions in sport and caring for Country.','Name a source for each example.')],
 's2-hsie-y3-w10-l2': [pair_visual('Ask','confirm the local name','Credit','storyteller and Nation','Respectful habits from the unit.','Use community-approved sources.'),
  pair_visual('Safe','no wild plant tasting','Care','take only what is needed','Safety and care habits.','Review with named sources.')],
 's2-hsie-y3-w11-l1': [pair_visual('Location','where it is','Features','what is there','Describing location and features.','Separate features from opinions.'),
  pair_visual('Use','walking, bird watching','Change','playground replaced','How people use a place and how it changes.','Observe first, then give opinions.')],
 's2-hsie-y3-w11-l2': [pair_visual('Natural','dunes, rock pools','Built','surf club, seawall','Natural and built features at a beach.','Sort by who made it.'),
  pair_visual('Managed','planted dune grass','Impact','boardwalk protects dunes','Managed places and their effects.','Green is not always natural.')],
 's2-hsie-y3-w12-l1': [pair_visual('Key','blue line river, red cross hospital','Scale','2 cm = 200 m','Key and scale on a town map.','Read the key before measuring.'),
  pair_visual('NE','north-east of park','SW','park from library','Opposite compass directions.','Use the north arrow, not left or right.')],
 's2-hsie-y3-w12-l2': [pair_visual('Grid','10 by 8 squares','Scale','1 square = 5 paces','Grid and scale for a playground map.','Plan before drawing.'),
  pair_visual('Symbols','green circle tree, blue square tap','Last','title, key, north arrow','Symbols and finishing touches.','Every feature gets its own symbol.')],
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
