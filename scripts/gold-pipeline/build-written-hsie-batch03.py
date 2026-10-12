#!/usr/bin/env python3
"""Year 3 HSIE Written Core batch 03: places near and far finish, weather, climate and resources, w13-l1 through w18-l2 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

HIS, ACH, GEO = 'HS2-HIS-01', 'HS2-ACH-01', 'HS2-GEO-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='hsie', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-hsie-y3-w13-l1',GEO,['state','territory','capital','Australia'],
  'Australia has six states (New South Wales, Victoria, Queensland, South Australia, Western Australia, Tasmania) and two mainland territories (Northern Territory and Australian Capital Territory). Each has a capital city. Canberra, in the Australian Capital Territory, is the national capital.',
  'Example: Tasmania is a state and its capital is Hobart. The Northern Territory is a territory and its capital is Darwin. Canberra is inside the Australian Capital Territory in the south-east of the country, between Sydney and Melbourne.',
  'Match: Western Australia, South Australia, Victoria, Queensland to their capitals. True or false: Sydney is the capital of Australia.',
  'Perth, Adelaide, Melbourne and Brisbane. False: Sydney is the capital of New South Wales, and Canberra is the capital of Australia.',
  'Thinking Sydney or Melbourne is Australia\'s capital because they are the largest cities mixes up size with the role of a capital.',
  'Label a blank outline map of Australia with six states, two mainland territories and eight capital cities. Write four sentences using direction words, such as "Western Australia is west of the Northern Territory", and one memory aid.'),
L('s2-hsie-y3-w13-l2',GEO,['location','relative','grid','direction'],
  'Places can be located by relative location (north of, next to, between) and by grid references. A grid uses letters for columns and numbers for rows, so each square has a reference such as D3.',
  'Example: Darwin is north of Alice Springs, and Adelaide is south of it. On a classroom grid with columns A to F left to right and rows 1 to 6 from the top, the library is at D3 and the park is at D6. The park is three squares south of the library.',
  'On the same grid the shop is at B3 and the school is at E3. In which direction is the school from the shop, and how many squares?',
  'East, three squares. Both are in row 3, and E is three columns right of B.',
  'Reading rows before columns, or counting the starting square, gives the wrong square or wrong distance.',
  'Use an atlas or online map of Australia to locate eight places. Write relative location sentences for each, and give grid references from a class grid. Name the atlas you used.'),
L('s2-hsie-y3-w14-l1',GEO,['continent','ocean','equator','neighbour'],
  'The world has seven continents (Africa, Antarctica, Asia, Australia, Europe, North America, South America) and five oceans (Pacific, Atlantic, Indian, Southern, Arctic). The equator is an imaginary line around the middle of Earth. Australia is both a country and a continent, and it has neighbouring countries such as Indonesia, Papua New Guinea, Timor-Leste and New Zealand.',
  'Example: Asia is the largest continent and the Pacific is the largest ocean. Australia lies between the Indian and Pacific Oceans and south of the equator. Indonesia is to the north and New Zealand is to the south-east.',
  'Sort into continent or ocean: Antarctica, Pacific, Asia, Indian, Europe, Southern.',
  'Continents: Antarctica, Asia, Europe. Oceans: Pacific, Indian, Southern.',
  'Treating a country such as Indonesia as a continent, or an ocean as a country, mixes up the types of places on a world map.',
  'Label a world map with the seven continents and five oceans, the equator, Australia and three neighbouring countries. Write three sentences describing Australia\'s location.'),
L('s2-hsie-y3-w14-l2',GEO,['compare','criteria','similarity','difference'],
  'To compare two places fairly, use the same criteria for both, such as location, climate, natural features, built features and how people use the place. Comparisons give evidence of similarity and difference and avoid saying one place is better.',
  'Example comparison using climate: Cairns in Queensland is hot and humid with a wet summer; Hobart in Tasmania is cool with four seasons. Natural features: rainforest and reef near Cairns; mountain and harbour at Hobart. Similarity: both are coastal cities.',
  'Write one similarity and one difference for the place you live and one in another state, using the same criteria for both.',
  'Both statements must use one category, such as climate or location, for both places, for example "both are coastal" and "one is warmer in winter".',
  'Comparing different things, such as one place\'s weather with another\'s food, or calling one place the best, is not a fair comparison.',
  'Choose one local place and one distant place. Complete a five-criteria grid with sources and write three sentences, with two similarities and one difference, using the same criteria for both.'),
L('s2-hsie-y3-w15-l1',GEO,['climate','coast','inland','cause'],
  'Places differ because of location. Nearness to the equator, being on the coast or inland and height above sea level all change temperature and rainfall. People\'s choices, resources and history also make places different.',
  'Example: Darwin is hot all year because it is closer to the equator. Hobart is cooler because it is further south and close to the Southern Ocean. Coastal places often have milder temperatures than inland places at the same latitude.',
  'Why might Canberra, which is inland and higher above sea level, have colder winters than Sydney on the coast?',
  'Canberra is higher above sea level and further from the sea\'s mild influence, so winter nights are colder and frosts are more common.',
  'Saying "they are different because they are different places" gives no cause that can be checked against a map or data.',
  'Choose one coastal and one inland town. Use a published climate source to write two differences and give at least two causes for each, using words such as distance from the equator, coast and height.'),
L('s2-hsie-y3-w15-l2',GEO,['review','place','map','showcase'],
  'The places unit review links the features of a place, natural and built features, map skills, Australia\'s states and capitals, world locations, comparing places and the causes of similarity and difference.',
  'Example showcase: a poster map of one place with a key, compass and scale, a table of natural and built features, a comparison with a second place and one cause of a difference, with the source named.',
  'Match each part of the showcase to the skill it shows: key and compass; table; comparison; cause.',
  'Key and compass: map reading; table: sorting features; comparison: using criteria; cause: geographic reasoning.',
  'A poster of pretty pictures with no key, criteria or sources shows decoration rather than geographic thinking.',
  'Assemble a places showcase using the checklist, practise a one-minute talk and write two questions for another place study.'),
L('s2-hsie-y3-w16-l1',GEO,['weather','climate','pattern','average'],
  'Weather is what is happening in the air today, such as temperature, rain and wind. Climate is the usual pattern of weather in a place measured over many years. Different places have different climates, such as tropical, desert and temperate.',
  'Example: on Tuesday Hobart has 12 degrees and rain; this is weather. Over many years, Hobart has mild summers and cool winters; this is climate. Darwin has a wet season and a dry season every year, and that repeated pattern is its climate.',
  'Sort into weather or climate: it is raining today; Darwin has a wet season every year; it is 38 degrees right now.',
  'Weather: raining today and 38 degrees right now. Climate: Darwin\'s wet season every year, because it is a repeating pattern.',
  'Saying "the climate today is hot" mixes up one day of weather with the long-term pattern called climate.',
  'Use published climate data from the Bureau of Meteorology or an atlas for a tropical, a desert and a temperate place. Record summer and winter temperatures and rainfall, and write three sentences showing weather versus climate.'),
L('s2-hsie-y3-w16-l2',GEO,['record','temperature','rainfall','wind'],
  'Recording local weather uses measurements taken at the same time each day: temperature in degrees Celsius from a thermometer in the shade, rainfall in millimetres from a rain gauge, wind as calm, breeze or strong and the direction it comes from, and cloud as clear, partly cloudy or overcast. Never look at the sun.',
  'Example record, Monday 9 am: 21 degrees, 0 mm rain, light breeze from the south-east, partly cloudy. Tuesday 9 am: 19 degrees, 4 mm rain, calm, overcast. The table has columns for date, time, temperature, rain, wind and cloud.',
  'What is wrong with "Monday: nice weather" and "Tuesday 18 degrees at 9 am, Wednesday 24 degrees at 3 pm" as a record?',
  'The first is an opinion and not a measurement. The second measures at different times, so the days cannot be compared fairly.',
  'Recording at different times or using opinions such as "nice" makes it impossible to compare days.',
  'Record the weather at the same time each day for seven days, including temperature, rainfall, wind and cloud. Draw a line graph of temperatures and write one pattern you found. Do not look at the sun.'),
L('s2-hsie-y3-w17-l1',GEO,['climate','shelter','clothing','adapt'],
  'Climate affects how people live, including their homes, clothing, food, work, transport and recreation. People adapt to the climate using local materials and knowledge, though cost, culture and technology also matter.',
  'Example: in the hot, wet tropics homes may be built on stilts for airflow and flooding, with wide verandahs for shade. In regions that face cyclones, building rules require strong roofs and fixings. People wear light clothes in the heat and waterproof clothing in heavy rain.',
  'Link climate to a feature: heavy snow; a hot dry desert; a cyclone-prone coast. Write one home or clothing feature for each.',
  'Snow: steep roof and warm layers; hot desert: thick walls, shade and light clothing; cyclone coast: strong roof fixings and shutters.',
  'Saying climate is the only reason people live the way they do ignores cost, culture and technology.',
  'Choose two very different climates. Make a cause and effect table showing how climate affects homes, clothing and food or work. Use at least two sources.'),
L('s2-hsie-y3-w17-l2',GEO,['home','clothing','region','stereotype'],
  'Homes and clothing around the world often show a response to climate. Examples include stilt homes in wet regions, thick-walled homes and underground homes in hot dry places and steep roofs where snow falls. People\'s choices vary within places, and many people everywhere wear modern clothes, so we avoid stereotypes.',
  'Example: at Coober Pedy in South Australia some people live in underground homes called dugouts, which stay cooler in summer and warmer in winter. In snowy parts of Norway steep roofs let snow slide off. A table records climate, home feature, reason and source.',
  'Design a home for a hot, dry place. Write three features and the reason for each.',
  'For example: thick walls to keep heat out, small windows or shade to cut the sun, and light colours to reflect heat.',
  'Saying that everyone in a country wears the same traditional clothes is a stereotype that ignores modern life and personal choice.',
  'Choose three places from an atlas or library book. Complete a table with climate, home feature, clothing and reason. Write one stereotype to avoid and the fairer way to say it.'),
L('s2-hsie-y3-w18-l1',GEO,['resource','renewable','non-renewable','source'],
  'Natural resources come from nature and are used by people, such as water, soil, air, sunlight, wind, timber, fish and minerals. Renewable resources, such as sunlight, wind and managed forests, can be replaced in a human lifetime. Non-renewable resources, such as coal, oil, gas and many minerals, took millions of years to form.',
  'Example: a paper notebook starts as trees, a renewable resource if forests are replanted. Petrol comes from oil, a non-renewable resource. A glass jar is made from sand, so sand and the energy to heat it are resources.',
  'Sort into renewable or non-renewable: wind, coal, sunlight, iron ore.',
  'Renewable: wind and sunlight. Non-renewable: coal and iron ore.',
  'Believing resources never run out because nature is big ignores that some resources take millions of years to form.',
  'Trace one product, such as a wooden table, a glass jar or a bicycle, back to its natural resources. Make a table with resource, where it comes from and whether it is renewable. Write one sentence on how people affect it.'),
L('s2-hsie-y3-w18-l2',GEO,['reduce','reuse','recycle','wisely'],
  'Using resources wisely means using less, using things again and recycling materials so fewer new resources are taken. Reduce, reuse, recycle and repair all help. Saving water and energy at home and school also protects resources.',
  'Example: a family fixes a dripping tap, takes a short shower and turns off lights in empty rooms. They use a jar as a pencil holder and put cans in the recycling bin. The class records which action reduces, reuses or recycles.',
  'Sort into reduce, reuse or recycle: buying fewer plastic wraps; using a jar as a pencil holder; putting cans in the recycling bin.',
  'Reduce: buying fewer plastic wraps. Reuse: the jar as a pencil holder. Recycle: cans in the recycling bin.',
  'Thinking recycling is the only action leaves out that reducing and reusing save more resources before anything is made.',
  'Plan a one-week wise use challenge for your home or class. Choose three actions, record daily evidence, and write whether it helped and what you would change.'),
]

VISUALS = {
 's2-hsie-y3-w13-l1': [pair_visual('Tasmania','state, capital Hobart','NT','territory, capital Darwin','A state and a territory with capitals.','Know the state or territory for each capital.'),
  pair_visual('Canberra','capital of Australia, in the ACT','Sydney','capital of NSW','National capital and a state capital.','Largest city is not always the capital.')],
 's2-hsie-y3-w13-l2': [pair_visual('Darwin','north of Alice Springs','Adelaide','south of Alice Springs','Relative location from one town.','Say north, south, east or west.'),
  pair_visual('D3','library','D6','park, 3 squares south','Grid references on a classroom grid.','Columns first, then rows.')],
 's2-hsie-y3-w14-l1': [pair_visual('Continents','7, such as Asia and Africa','Oceans','5, such as Pacific and Indian','Seven continents and five oceans.','Know which are land and which are water.'),
  pair_visual('Australia','south of the equator','Neighbours','Indonesia, PNG, New Zealand','Where Australia sits in the world.','Name neighbouring countries by direction.')],
 's2-hsie-y3-w14-l2': [pair_visual('Cairns','hot, humid, wet summer','Hobart','cool, four seasons','Comparing climate in two places.','Same criteria for both places.'),
  pair_visual('Both','coastal cities','Different','reef or mountain','Similarity and difference.','Evidence, not best or worst.')],
 's2-hsie-y3-w15-l1': [pair_visual('Darwin','near the equator, hot all year','Hobart','further south, cooler','Latitude and temperature.','Distance from the equator matters.'),
  pair_visual('Coast','milder temperatures','Inland','colder winters, more frost','Coastal and inland differences.','Height above sea level matters too.')],
 's2-hsie-y3-w15-l2': [pair_visual('Map','key, compass, scale','Features','natural and built','Skills used in the places showcase.','Show the key and scale.'),
  pair_visual('Compare','same criteria','Cause','coast, equator, height','Comparing places and giving causes.','Name your source.')],
 's2-hsie-y3-w16-l1': [pair_visual('Weather','12 degrees and rain today','Climate','mild summers, cool winters','Weather today and climate over years.','One day is weather, a pattern is climate.'),
  pair_visual('Darwin','wet and dry season','Pattern','repeats every year','A repeating seasonal pattern.','Use data over many years.')],
 's2-hsie-y3-w16-l2': [pair_visual('Mon 9 am','21 degrees, 0 mm, breeze SE','Tue 9 am','19 degrees, 4 mm, calm','Two days of recorded weather.','Same time each day.'),
  pair_visual('Measure','degrees, mm, wind, cloud','Opinion','"nice weather"','Measurements instead of opinions.','Never look at the sun.')],
 's2-hsie-y3-w17-l1': [pair_visual('Hot and wet','stilts, shade, light clothes','Cyclone coast','strong roof, shutters','Climate and housing features.','Match each feature to its reason.'),
  pair_visual('Snow','steep roof, warm layers','Desert','thick walls, shade','Homes in snow and desert places.','Cost and culture also matter.')],
 's2-hsie-y3-w17-l2': [pair_visual('Coober Pedy','underground dugouts','Norway','steep snow roofs','Homes in hot desert and snowy places.','Local materials and climate.'),
  pair_visual('Stereotype','everyone dresses the same','Fair','many people, many choices','Avoiding stereotypes.','Use specific evidence.')],
 's2-hsie-y3-w18-l1': [pair_visual('Renewable','sunlight, wind, managed forest','Non-renewable','coal, oil, iron ore','Renewable and non-renewable resources.','Millions of years to form.'),
  pair_visual('Notebook','trees','Jar','sand and heat','Tracing a product to resources.','Name the resource for each part.')],
 's2-hsie-y3-w18-l2': [pair_visual('Reduce','buy fewer wraps','Reuse','jar as pencil holder','Reduce and reuse actions.','Reduce first, then reuse.'),
  pair_visual('Recycle','cans in the bin','Save','fix a dripping tap','Recycle and save actions.','Count the actions you really do.')],
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
