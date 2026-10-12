#!/usr/bin/env python3
"""Stage 2 Year 3 English Written Core batch 02: fourteen lessons w04-l2 through w07-l3.

Primary twelve-lesson delivery is w04-l2..w07-l1; w07-l2/l3 close the week before batch 03.
Phase 1 written content only. Reuses the validated batch-01 D1 bundle shape.
"""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from episode_support import room_episode

def topic(code, mission, outcome, stages, independent, parent, vocab):
    return dict(code=code, mission=mission, outcome=outcome, stages=stages,
                independent=independent, parent=parent, vocab=vocab)

UNITS = [
topic('s2-eng-y3-w04-l2','Show feelings through actions and details instead of naming the emotion directly.','EN2-CWT-01',[
('Name the feeling, then remove the label','Telling names the emotion; showing lets the reader infer it from actions, body language and surroundings.','"Pia was frightened" tells. "Pia gripped the railing as the floorboards creaked" shows clues that suggest fear without using that word.','Rewrite "Tom was angry" using actions only.','Example: "Tom slammed his pencil onto the desk and stared at the torn page." The actions imply anger.','Replacing angry with mad still tells; show observable evidence.'),
('Choose useful sensory or physical clues','Not every detail helps. Choose actions a reader can picture that point towards one feeling.','For excitement I write "Amira bounced on her toes and checked the window again." The bouncing and repeated checking suggest anticipation.','Write two clues that could show worry at a bus stop.','Checking the timetable twice and biting a lip are useful clues; naming the bus colour is not.','A smile alone can mean many feelings; add a second confirming clue.'),
('Keep the scene short and clear','Two or three precise sentences are stronger than a long list of adjectives.','"Leo\'s hands shook as he opened the envelope. He exhaled when he saw his name." Relief is clear without naming it.','Trim a draft that lists five adjectives for surprise into two clear sentences.','Choose two concrete actions; delete repeated describing words that do not add evidence.','Piling synonyms for the emotion is still telling.'),
('Check a reader can infer the intended feeling','Read your scene aloud and ask what feeling seems most likely. If several feelings fit equally, add one clearer clue.','My draft about a lost dog could sound sad or calm. I add "He wiped his eyes on his sleeve" so sadness is clearer.','Improve a scene that could mean either surprise or fear.','Add a clue that distinguishes them, such as a jump back for fear versus a wide grin for pleasant surprise.','Do not claim the feeling is obvious if your clues support more than one reading.')],
'Write three short original scenes (two sentences each) that show worry, surprise and relief without using those three words. Underline the exact actions that suggest each feeling and explain one choice.',
'Accept any clear action-based clues; reject drafts that merely rename the emotion. Require underlining or listing of the evidence actions.',
['showing','telling','clue','inference']),
topic('s2-eng-y3-w04-l3','Join ideas with because, when, although and if to build clear complex sentences.','EN2-CWT-01',[
('Find the independent clause','An independent clause can stand alone as a complete sentence. A dependent clause needs that main clause to finish its meaning.','"We moved inside" can stand alone. "because rain soaked the field" cannot; it needs the main clause.','Which part can stand alone: "Tara carried a torch because the cave was dark"?','"Tara carried a torch" is independent; the because-clause depends on it.','A capital letter alone does not make a dependent clause a sentence.'),
('Use because for a reason','Because introduces a reason that explains the main action.','"Tara carried a torch because the cave was dark." The reason follows because.','Join "We packed jumpers" and "the evening grew cold" with because.','"We packed jumpers because the evening grew cold."','Putting a full stop before a because-clause creates a fragment.'),
('Use when, although and if carefully','When often shows time; although shows contrast; if shows a condition. Choose the conjunction that matches the relationship.','"When the bell rang, we lined up." Time. "Although the path was muddy, we kept walking." Contrast. "If it rains, we will read inside." Condition.','Write one sentence with although about a picnic and wet grass.','Example: "Although the grass was wet, we spread the blanket on the dry rise."','Using because for every relationship hides the real connection between ideas.'),
('Punctuate and reread the whole sentence','If the dependent clause comes first, a comma often follows it. Then reread to check both parts make sense together.','"Because the cave was dark, Tara carried a torch." The comma follows the opening clause.','Punctuate: When the tide rose we moved our towels.','"When the tide rose, we moved our towels."','Do not add a comma that splits a short subject from its verb.')],
'Write four original complex sentences: one each with because, when, although and if. Mark the independent clause in each sentence and explain one punctuation choice.',
'Require four different conjunctions, accurate clause marking and a brief punctuation reason. Accept varied topics.',
['independent','dependent','conjunction','clause']),
topic('s2-eng-y3-w04-l4','Write legibly at a comfortable pace, then improve unclear letters without rushing.','EN2-HANDW-01',[
('Keep letter size and spacing steady','Readable handwriting keeps letters a similar size and leaves clear spaces between words before speed increases.','I write "We searched beside the creek" at an even height, leave a finger-space between words, and check that c and e look different.','Copy "The small kite floated above the oval" slowly and check two letter pairs.','c/e and a/o should stay distinct; word spaces should not collapse.','Pressing harder does not make letters clearer if shapes become crushed.'),
('Shape tricky letters before racing','Letters that look alike need careful formation. Fix the shape first; then practise a comfortable pace.','I slow down on k and h so the upright and arms stay clear, then rewrite the whole word once.','Rewrite "quick" and "chair" focusing on q, k, c and h.','Each letter should be recognisable without guessing from context alone.','Skipping a confusing letter and speeding on wastes the practice.'),
('Compare slow and comfortable-pace copies','A second copy at a natural pace should stay readable. If meaning is lost, slow down again.','I time a careful copy, then a comfortable second copy of the same sentence, and circle any unclear letters.','Write the kite sentence twice: once slowly, once at a comfortable pace.','Both should keep a readable baseline; faster is not better if letters merge.','Racing to finish first is not the goal of this lesson.'),
('Rewrite only the unclear parts','Choose two unclear words, rewrite them more carefully, and note how you kept your hand comfortable.','I circle "searched" because the r and c joined oddly, rewrite it, and shake out my hand between lines.','Identify two unclear words in your faster copy and rewrite them.','The rewrite should be clearer, not simply larger and messier.','Rewriting the whole paragraph when only two words are unclear can cause fatigue.')],
'Copy a 35–50 word original paragraph (from a book or this lesson) twice. Record approximate time for the comfortable copy, circle unclear letters, rewrite two words more clearly, and note one way you kept your hand comfortable.',
'Assess legibility and self-correction more than pure speed. Accept typed reflection if motor difficulty makes long handwriting unfair; still require a short handwriting sample where possible.',
['legibility','spacing','pace','formation']),
topic('s2-eng-y3-w05-l1','Summarise a story by keeping character, problem, action and outcome in your own words.','EN2-RECOM-01',[
('Find the essential parts','A summary keeps the main character, problem, important action and outcome. It leaves out decoration.','Story: "Hana missed her bus, called her aunt and caught the next service." Summary: "After missing the bus, Hana arranged help and travelled later."','Which detail is essential in "Raj lost his library card, checked his bag, found it in his jacket and borrowed a book"?','Losing then finding the card and borrowing a book are essential; the jacket pocket is optional detail.','A summary is shorter than the original and does not invent feelings.'),
('Use your own words','Paraphrase shows understanding. Keep the same meaning while changing the wording.','Instead of copying "caught the next service", I write "travelled later on another bus."','Paraphrase "found it in his jacket" without copying those words.','Example: "He discovered the card inside his coat." Meaning stays true.','Copying every sentence is not summarising.'),
('Keep a logical order','Summaries usually follow the story order: problem, response, outcome.','First Hana misses the bus; then she gets help; finally she travels later. Reversing the ending would confuse a reader.','Order these: found the card; lost the card; borrowed a book.','Lost; found; borrowed.','Beginning with the ending leaves the problem unexplained.'),
('Justify one omitted detail','Explain why a left-out detail was not needed for the main meaning.','I omit the jacket because the important event is recovering the card, not the exact pocket.','Name one detail you would omit from a picnic story about rain and explain why.','Weather that does not change the problem can often be shortened; the rain that ends the picnic usually cannot.','Omitting the main problem makes the summary incomplete.')],
'Read or listen to a short story of at least 150 words. Identify character, problem, response and outcome; write a three-sentence summary in your own words; justify one minor detail you omitted.',
'Require paraphrase, essential plot parts and a sensible omission reason. Do not demand the exact wording of a model summary.',
['summary','paraphrase','essential','omit']),
topic('s2-eng-y3-w05-l2','Write a resolution that solves the problem, then revise meaning before editing surface errors.','EN2-CWT-01',[
('Solve the central problem','A resolution shows how the main difficulty is addressed. It should connect to the earlier problem.','Opening: "The class plant wilted." Response: they check soil and water it. Resolution: "Its leaves lifted over the next week."','Complete an ending after "The puppy escaped through a loose gate."','Example: "A neighbour held the puppy while Dad repaired the latch." The fix matches the cause.','An unrelated miracle ending ignores the story\'s problem.'),
('Revise for logic and clarity first','Revising meaning comes before fixing capitals. Ask whether the ending answers the problem.','I check that watering explains why the plant recovers; then I improve a vague pronoun.','Revise an ending where a lost map is found by a dragon with no earlier clue.','Connect the finding to earlier actions, such as retracing steps or asking a ranger.','Editing spelling cannot repair a disconnected plot.'),
('Edit surface features second','After meaning is sound, check capitals, full stops and spelling.','I capitalise sentence starts and correct "leaved" to "leaves" once the ending makes sense.','Edit: "dad fixed the latch. the puppy was safe"','"Dad fixed the latch. The puppy was safe."','Editing before revising can polish a broken ending.'),
('Name one revision and one edit','Show that you understand the difference between changing ideas and fixing conventions.','Revision: I linked the latch repair to the escape. Edit: I capitalised Dad.','Identify one meaning change and one punctuation fix in your lost-map ending.','The meaning change should affect the solution; the edit should affect spelling or punctuation.','Calling every change an edit hides the revision step.')],
'Write a six-sentence story ending for a lost map. First revise the solution\'s logic and clarity, then edit punctuation and spelling. Identify one revision and one edit.',
'Require a problem-linked resolution plus explicit revision/edit labels. Accept varied map-story settings.',
['resolution','revise','edit','ending']),
topic('s2-eng-y3-w05-l3','Punctuate dialogue with quotation marks and place speech punctuation correctly.','EN2-CWT-01',[
('Mark the spoken words','Quotation marks show the exact words a character says.','"Where is my hat?" asked Ben. The spoken question sits inside the quotation marks.','Add quotation marks: Mila said I can help you.','Mila said, "I can help you."','Do not put the speaker tag inside the quotation marks unless those words are spoken.'),
('Keep speech punctuation inside the marks','Question marks and full stops that belong to the spoken words stay inside the quotation marks.','The question mark in "Where is my hat?" belongs to the question Ben asks.','Punctuate the spoken question: where is the library asked Sam.','"Where is the library?" asked Sam.','A question mark still belongs to a question even when a speaker tag follows.'),
('Use a comma with a speaker tag when needed','When a tag such as said Mila introduces a statement, a comma often appears before the opening quote.','Mila said, "I can help you." The comma comes after said.','Punctuate: Ben whispered the torch is failing.','Ben whispered, "The torch is failing."','Forgetting the comma can make the sentence harder to read, though meaning still depends on the quotes.'),
('Start a new line when the speaker changes','A new paragraph for a new speaker helps readers follow the conversation.','"Can I help?" asked the shopkeeper.\n\n"Yes, please," said Mina.','Write two lines where a child asks a price and a shopkeeper answers.','Each speaker begins on a new line with their own quotation marks.','Running two speakers into one paragraph makes turn-taking unclear.')],
'Write six lines of original dialogue between a child and a shopkeeper. Include a question, a statement and a new paragraph when the speaker changes. Check every quotation mark.',
'Require correct quotation marks, at least one question, speaker changes on new lines, and readable tags. Accept varied shopping topics.',
['dialogue','quotation','speaker','punctuation']),
topic('s2-eng-y3-w05-l4','Prepare a clean final narrative for a real reader and explain presentation choices.','EN2-CWT-01',[
('Choose a title that fits the story','A useful title hints at character, setting or problem without spoiling every event.','I change "Story" to "The Lost Lantern" so a reader anticipates a missing light and a search.','Choose a title for a story about a missing bicycle and explain why it fits.','"The Bicycle at the Creek" suggests setting and problem better than "My Work".','A vague title does not help a reader know what the piece is about.'),
('Use paragraphs when the action changes','Paragraphs group related sentences. Start a new paragraph when time, place or focus shifts.','When the search moves from the shed to the creek, I begin a new paragraph.','Mark where a new paragraph should start in a three-event search story.','A shift to a new place or time is a common paragraph break.','One giant block of text makes the story harder to follow.'),
('Proofread before sharing','Read slowly for missing words, capitals and full stops after the story meaning is clear.','I read aloud and catch a missing full stop before I share the story with my family.','List three proofreading checks you will use before publishing.','Capitals, end marks and whether every sentence is complete are useful checks.','Publishing is not only making text pretty; meaning comes first.'),
('Explain one revision to a reader','An author\'s note can name a change made for clarity or audience.','I note that I added a clearer ending so the reader knows the lantern was returned.','Write one sentence explaining a revision you made for a reader.','The note should name a specific change, not only "I improved it."','A decoration change alone is weaker evidence than a meaning revision.')],
'Publish a 150–250 word original narrative with a title and paragraphs. Add a short author\'s note identifying two revisions and one response to possible reader feedback.',
'Check title fit, paragraphing, proofreading and a reflective author note. Length may be slightly flexible if quality is strong.',
['title','paragraph','proofread','publish']),
topic('s2-eng-y3-w06-l1','Use headings, glossaries and indexes to locate and understand information.','EN2-RECOM-01',[
('Scan headings to find a section','Headings group information so a reader can jump to the needed part.','To learn about echidna food, I scan for a heading such as "Feeding" before reading every page.','Which heading would likely help you find where koalas live: Food, Habitat or Glossary?','Habitat. Food would more likely discuss diet.','A heading organises ideas; it does not prove every sentence under it is accurate.'),
('Use a glossary for word meanings','A glossary defines important subject words, usually near the end of an information text.','If I know the word habitat appears but not its meaning, the glossary can define it.','Which feature helps most when you need the meaning of invertebrate?','A glossary definition. An index points to pages, not definitions.','Guessing a technical word without checking can create a false fact.'),
('Use an index to find page references','An index lists topics alphabetically with page numbers so you can find where a word appears.','I look up echidna in the index to find the pages that mention it, then read those sections.','Would an index or a glossary better help you find every page that mentions claws?','An index lists page references; a glossary explains meanings.','Indexes help location; they do not rewrite the information for you.'),
('Choose the right feature for the job','Match the question to the feature: meaning, location or section overview.','Meaning → glossary. Page finding → index. Section topic → heading or contents.','For each need, name the best feature: define burrow; find pages about diet; jump to a Shelter section.','Glossary; index; heading/contents.','Using the wrong feature wastes time and may miss the answer.')],
'Create a two-page mini-information text about a local animal with two headings, four glossary definitions and a short alphabetised index. Explain when a reader would use each feature.',
'Require working examples of each feature and a clear explanation of purpose. Facts should be plausible and checkable.',
['heading','glossary','index','feature']),
topic('s2-eng-y3-w06-l2','Plan an information report by grouping facts under clear headings before drafting.','EN2-CWT-02',[
('Choose factual categories','Report plans group related facts under headings such as habitat, food or adaptations.','For a koala report I plan: classification, habitat, food and adaptations. Each heading holds related facts.','Sort: eats eucalyptus; has sharp claws; lives in trees.','Food; adaptations; habitat. Some overlap can be explained.','A report presents checked information, not an invented adventure.'),
('List facts you can verify','Under each heading, note facts you can check in a reliable source, with the source title.','I write "eats eucalypt leaves — Australian Museum fact sheet" under Food.','Add one verifiable fact and a source title under Habitat for a wombat.','Example: lives in burrows — wildlife organisation page title.','Unsupported claims do not belong in the plan.'),
('Draft an introduction that previews the report','The opening states what the report will explain without telling the whole content.','"This report explains where koalas live, what they eat and how their bodies help them survive."','Write a one-sentence introduction for a platypus report with three planned headings.','The sentence should name the topics the headings will cover.','An introduction is not a full copy of every fact.'),
('Keep imagination out of the plan','If a fact sounds like a story event, move it out of the report plan.','"The koala made friends with a bird" is narrative, not a factual heading note.','Remove the non-factual item from: mammal; eucalypt diet; flew to the moon.','Flew to the moon does not belong in a factual plan.','Reports and narratives have different jobs.')],
'Choose a NSW native animal. Plan three factual headings, list two verifiable facts per section with source titles, and draft an introduction stating what the report will explain.',
'Require three headings, six checkable facts with sources named at title level, and a preview introduction. Full paragraphs are not required in this planning lesson.',
['heading','fact','source','plan']),
topic('s2-eng-y3-w06-l3','Use precise technical words and explain them in reader-friendly language.','EN2-RECOM-01',[
('Replace vague wording with an exact term','A precise subject word carries more information than a general placeholder.','"The wombat digs a burrow" is clearer than "The animal makes a hole." Burrow means an underground shelter made or used by an animal.','Replace "thing the animal lives in" when describing bees.','Hive (or nest, if carefully defined) names the structure; explain the term.','A complicated word is not automatically accurate.'),
('Define before you rely on the word','Give a plain-English definition so a reader can follow the sentence.','"A burrow is an underground shelter. Wombats dig burrows for safety." Definition first, then use.','Define habitat in one short sentence for a Year 3 reader.','Example: Habitat is the place where a living thing usually lives and finds what it needs.','Using a technical word without explanation can block understanding.'),
('Give an example and a non-example','An example shows correct use; a non-example shows a misuse.','Example: "The bilby rests in a burrow." Non-example: calling a bird\'s high nest a burrow.','Give an example and non-example for hive.','Example: bee colony structure; non-example: a dog kennel.','A non-example helps prevent overgeneralising the term.'),
('Check the term against a source','Confirm that your definition matches a reliable information source.','I check burrow against a wildlife glossary before I lock the definition into my report.','Name one place you could check the meaning of nocturnal.','A glossary, museum fact sheet or approved dictionary can help.','Copying a wrong definition spreads the error.')],
'Create a six-word glossary for a habitat report. For three of the words, write a plain-English definition, a correct example sentence and a non-example; note where you checked each meaning.',
'Require accurate learner-friendly definitions, true examples, clear non-examples and a source note. Accept reasonable synonym choices if explained.',
['technical','definition','example','glossary']),
topic('s2-eng-y3-w06-l4','Listen for the main topic and jot cue notes rather than copying every word.','EN2-OLC-01',[
('Catch the topic and a few key facts','Good notes record the main subject and important steps or facts, not a full transcript.','Speaker: "Frogs begin as eggs, hatch into tadpoles and later develop legs." Notes: frogs—eggs → tadpoles → legs.','Listen for the topic in: "Rain fills the creek; water flows downhill towards the river."','Topic: rainwater moving from creek towards river.','Trying to write every word usually means missing the next idea.'),
('Use short cue words','Cue notes are memory prompts. Spelling and full sentences are not required in the notes themselves.','I write "rain—creek fills—downhill—river" instead of copying the whole speech.','Reduce this sentence to five cue words or fewer: "Storm clouds gathered above the oval before the match."','Example: storm clouds—oval—before match.','Notes that look like a finished paragraph may be too slow for listening.'),
('Rebuild the meaning aloud','After noting cues, say the ideas back in complete sentences to check understanding.','From eggs → tadpoles → legs I can say: "Frogs start as eggs, become tadpoles and then grow legs."','Rebuild a spoken sentence from the cues rain—creek—river.','"Rain fills the creek and water flows towards the river."','If you cannot rebuild the idea, your cues are too thin or unclear.'),
('Compare with the original for accuracy','Check one detail you might have missed or changed after the oral summary.','I notice I said "instantly grow legs" but the speaker said "later develop legs," so I correct the timing.','After a 45-second summary, name one check you will make against the passage.','Listen again for a number, order word or name you might have altered.','A confident summary can still contain an inaccurate detail.')],
'Ask an adult to read a new 100–150 word factual passage twice. Take 6–8 cue notes; deliver a 45-second oral summary; compare it with the passage and record one missing or inaccurate detail.',
'Assess cue brevity, oral reconstruction and accuracy check. Spelling in notes is not the target.',
['listen','cue','summary','accuracy']),
topic('s2-eng-y3-w07-l1','Identify the main idea of an information paragraph and the details that support it.','EN2-RECOM-01',[
('Ask what the whole paragraph is mainly about','The main idea is the broad point of the paragraph, not one tiny fact alone.','"Mangroves grow in salty coastal places. Their roots trap mud and shelter small fish." Main idea: mangroves support coastal habitats.','What is the main idea of "Ants live in colonies. Workers gather food, and queens lay eggs"?','Different roles in ant colonies; workers and queens are supporting examples.','The main idea is narrower than "nature" and broader than one isolated fact.'),
('Select details that support the main idea','Supporting details prove, explain or exemplify the main idea.','Roots trapping mud and sheltering fish support the habitat idea.','Name two supporting details for a paragraph about bee roles in a hive.','Workers gathering food and a queen laying eggs can support colony roles.','An interesting detail about an unrelated animal does not support this paragraph\'s idea.'),
('Reject unrelated details','A fact can be true and still not belong under this main idea.','A sentence about desert lizards does not support a mangrove habitat paragraph.','Which detail does not belong with ant colony roles: workers forage; queens lay eggs; sharks hunt seals?','Sharks hunt seals is unrelated.','Keeping every interesting fact creates a cluttered paragraph.'),
('Write a short main-idea sentence','Sum up the paragraph in about 6–10 words without listing every detail.','"Mangroves help coastal habitats in salty places."','Write a 6–10 word main idea for the ant paragraph.','Example: "Ant colonies have different important roles."','Copying the first sentence unchanged is not always the best main idea.')],
'Read two short factual paragraphs about ecosystems. Give each a 6–10 word main idea sentence and two supporting details; explain why one interesting but unrelated detail does not belong.',
'Require distinct main ideas, relevant supports and a clear rejection of an unrelated detail. Accept varied ecosystem topics.',
['main idea','detail','support','unrelated']),
topic('s2-eng-y3-w07-l2','Write a classification paragraph that names a category, shared feature and examples.','EN2-CWT-02',[
('Start with the category','A classification paragraph names the group before listing members.','"Marsupials are mammals whose young usually develop in a pouch. Kangaroos and koalas are examples." The category comes first.','Write a topic sentence that classifies frogs as amphibians.','"Frogs are amphibians that generally begin life in water and change form as they grow."','A list of examples without a category does not explain classification.'),
('Name the shared feature','State what members of the group have in common.','Marsupials share young that usually develop in a pouch; that feature defines the group in this paragraph.','Add a shared feature to: "Birds are animals. Emus and magpies are examples."','Example: birds are animals that have feathers and lay eggs.','Examples alone do not tell the reader why they belong together.'),
('Give clear examples','Choose examples that truly fit the category and feature.','Kangaroos and koalas fit marsupials; a crocodile would not.','Choose two examples for reptiles that live in Australia.','Blue-tongue lizards and saltwater crocodiles can work if the feature fits; check facts.','An example that breaks the defining feature weakens the paragraph.'),
('Finish with an explanatory sentence','End by reminding the reader what the classification helps us understand.','"Grouping animals this way helps readers compare how young are raised."','Write a closing sentence for a paragraph classifying deciduous trees.','The ending should link back to the category purpose, not start a new topic.','Stopping after examples can leave the purpose unclear.')],
'Write a factual 100–130 word paragraph classifying two kinds of Australian animals or rocks. Include a category statement, defining feature, two examples and a final explanatory sentence.',
'Require category, feature, two fitting examples and a closing explanation. Check factual plausibility.',
['category','feature','example','classify']),
topic('s2-eng-y3-w07-l3','Use pronouns for cohesion only when a reader can tell who or what they mean.','EN2-CWT-01',[
('Replace a repeated noun carefully','A pronoun can replace a noun already named when the reference is clear.','"Leah found a map. She folded it." She refers to Leah; it refers to the map.','Repair: "The ranger opened the gate. The ranger checked the latch."','"The ranger opened the gate. She checked the latch." (or they, if appropriate).','Too many pronouns create confusion when two people are nearby.'),
('Watch for ambiguous she/he/they','If two people could match the pronoun, keep the name or rewrite.','"Leah told Mia she was late" is unclear: who was late? Rewrite to name the person.','Repair the ambiguity in "Sam gave Alex his book."','Example: "Sam gave Alex Sam\'s book" or "Sam lent the book to Alex."','A short sentence can still be unclear if two nouns compete.'),
('Keep cohesion across a short paragraph','Mix names and pronouns so the writing is smooth but trackable.','"Mina packed a torch. She checked the batteries, then Mina called her sister." Alternating can help when a new character appears.','Revise a six-sentence paragraph that repeats a character name every sentence.','Use pronouns for some repeats; keep the name when a second person appears.','Replacing every noun with a pronoun can erase clarity.'),
('Explain two references','Show that you can identify what each pronoun stands for.','In my revision, she = Mina and it = the torch.','After revising, explain two pronoun references in your paragraph.','Each explanation should name the noun the pronoun replaces.','If you cannot name the noun, the pronoun is not clear enough.')],
'Revise a six-sentence paragraph with repeated character names. Use pronouns selectively, explain two references, and rewrite one ambiguous sentence so its meaning is clear.',
'Require selective pronoun use, two accurate reference explanations and one ambiguity repair.',
['pronoun','reference','cohesion','ambiguous']),
]

def esc(t):
    return (t.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;').replace('"','&quot;'))

def pair_visual(left_title, left_text, right_title, right_text, alt, caption):
    svg=(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 150">'
         f'<rect x="10" y="12" width="310" height="126" rx="14" fill="#fff4ea" stroke="#b87445"/>'
         f'<rect x="340" y="12" width="310" height="126" rx="14" fill="#e8f5ed" stroke="#297a61"/>'
         f'<g font-size="16" fill="#263948">'
         f'<text x="28" y="42">{esc(left_title)}</text>'
         f'<text x="28" y="78">{esc(left_text[:42])}</text>'
         f'<text x="358" y="42">{esc(right_title)}</text>'
         f'<text x="358" y="78">{esc(right_text[:42])}</text>'
         f'</g></svg>')
    return dict(svg=svg, alt=alt, caption=caption)

VISUALS = {
  's2-eng-y3-w04-l2': [
    pair_visual('Tells','Pia was frightened','Shows','Pia gripped the railing',
      'Telling names fear while showing uses gripping the railing as evidence.',
      'Show observable actions so a reader can infer the feeling.'),
    pair_visual('Weak clue','smiled only','Stronger clues','bounced and checked the window',
      'A smile alone versus bouncing and checking a window as excitement clues.',
      'One ambiguous clue is weaker than two confirming actions.'),
  ],
  's2-eng-y3-w04-l3': [
    pair_visual('Independent','We moved inside','Dependent','because rain soaked the field',
      'Independent clause We moved inside beside dependent because-clause about rain.',
      'The because-clause cannot stand alone as a complete sentence.'),
    pair_visual('because','gives a reason','although','shows a contrast',
      'Because labelled as reason beside although labelled as contrast.',
      'Choose the conjunction that matches the relationship between ideas.'),
  ],
  's2-eng-y3-w04-l4': [
    pair_visual('Steady size','even letter height','Clear spaces','gap between words',
      'Even letter height beside clear spaces between handwritten words.',
      'Shape and spacing come before increasing speed.'),
    pair_visual('Unclear copy','merged letters','Rewrite','two clearer words',
      'Merged unclear letters contrasted with two carefully rewritten words.',
      'Rewrite only the unclear parts and keep your hand comfortable.'),
  ],
  's2-eng-y3-w05-l1': [
    pair_visual('Keep','missed bus, got help','Omit','colour of Hana bag',
      'Essential summary events kept beside an omitted bag colour detail.',
      'A summary keeps problem and outcome, not every decoration.'),
    pair_visual('Original','caught the next service','Paraphrase','travelled later on another bus',
      'Original wording paraphrased as travelled later on another bus.',
      'Paraphrase keeps meaning while changing the words.'),
  ],
  's2-eng-y3-w05-l2': [
    pair_visual('Problem','puppy escaped loose gate','Resolution','neighbour holds; latch repaired',
      'Escape problem linked to a resolution that repairs the latch.',
      'The ending should solve the central problem.'),
    pair_visual('Revise meaning','link ending to cause','Then edit','capitals and spelling',
      'Revise meaning first then edit capitals and spelling.',
      'Editing cannot repair a disconnected plot.'),
  ],
  's2-eng-y3-w05-l3': [
    pair_visual('Spoken words','Where is my hat?','Speaker tag','asked Ben',
      'Quoted question Where is my hat beside speaker tag asked Ben.',
      'Quotation marks enclose the spoken words.'),
    pair_visual('One speaker','Can I help?','New line','Yes, please',
      'Shopkeeper question on one line and child answer on a new line.',
      'Start a new paragraph when the speaker changes.'),
  ],
  's2-eng-y3-w05-l4': [
    pair_visual('Weak title','Story','Stronger title','The Lost Lantern',
      'Vague title Story improved to The Lost Lantern.',
      'A title should hint at the story focus for a reader.'),
    pair_visual('Draft block','one long paragraph','Published','paragraphs at action changes',
      'Single draft block versus paragraphs at action changes for publishing.',
      'Paragraphing and proofreading help a real reader.'),
  ],
  's2-eng-y3-w06-l1': [
    pair_visual('Heading','Feeding','Glossary','invertebrate = ...',
      'Heading Feeding beside a glossary definition for invertebrate.',
      'Headings locate sections; glossaries explain words.'),
    pair_visual('Index','echidna 4, 9','Purpose','find page numbers',
      'Index entry echidna with page numbers for locating information.',
      'An index points to pages; it does not define the word.'),
  ],
  's2-eng-y3-w06-l2': [
    pair_visual('Heading Food','eucalypt leaves','Heading Habitat','eucalypt forests',
      'Report plan facts sorted under Food and Habitat headings.',
      'Group related facts before drafting paragraphs.'),
    pair_visual('Keep','checkable fact + source','Remove','made-up adventure event',
      'Checkable fact with source kept; invented adventure removed from plan.',
      'A report plan holds verified information, not story events.'),
  ],
  's2-eng-y3-w06-l3': [
    pair_visual('Vague','makes a hole','Precise','digs a burrow',
      'Vague makes a hole improved to precise digs a burrow.',
      'Technical words carry exact meaning when defined.'),
    pair_visual('Definition','burrow = underground shelter','Non-example','bird nest high in tree',
      'Burrow definition beside a non-example of a high bird nest.',
      'Examples and non-examples protect accurate word use.'),
  ],
  's2-eng-y3-w06-l4': [
    pair_visual('Full speech','long frog life cycle talk','Cue notes','eggs → tadpoles → legs',
      'Long spoken explanation reduced to cue notes eggs tadpoles legs.',
      'Cue notes capture sequence without a full transcript.'),
    pair_visual('Rebuild aloud','complete sentences','Accuracy check','compare one detail',
      'Oral rebuild in sentences then accuracy check against the passage.',
      'Notes are only useful if you can rebuild and verify meaning.'),
  ],
  's2-eng-y3-w07-l1': [
    pair_visual('Main idea','mangroves help coastal habitats','Support','roots trap mud; shelter fish',
      'Main idea about mangroves with supporting root and shelter details.',
      'Details should support the paragraph\'s main idea.'),
    pair_visual('Belongs','workers gather food','Does not belong','sharks hunt seals',
      'Supporting ant detail contrasted with unrelated shark fact.',
      'True facts can still be unrelated to this paragraph.'),
  ],
  's2-eng-y3-w07-l2': [
    pair_visual('Category','marsupials','Feature','young usually in a pouch',
      'Classification category marsupials with shared pouch feature.',
      'Name the group and the shared feature before examples.'),
    pair_visual('Examples','kangaroo, koala','Closing','helps readers compare young',
      'Examples kangaroo and koala with a closing purpose sentence.',
      'Examples must fit the feature; the ending states the purpose.'),
  ],
  's2-eng-y3-w07-l3': [
    pair_visual('Clear','Leah found a map. She folded it.','Unclear','Leah told Mia she was late',
      'Clear pronoun reference beside an ambiguous she with two people.',
      'Use a pronoun only when the reader can tell who it means.'),
    pair_visual('Repeated name','The ranger... The ranger...','Cohesive','The ranger... She...',
      'Repeated ranger name revised to a clear pronoun she.',
      'Selective pronouns improve flow without losing clarity.'),
  ],
}

def make_spec(row, unit):
    base = baseline_data(row)
    l = {k: v for k, v in base.items() if k in (
        'seed_key', 'stage', 'learning_area', 'year_level', 'week',
        'week_in_unit', 'lesson_number', 'lesson_role', 'subject',
        'unit_title', 'unit_number')}
    criteria = [
        f'I can use {unit["vocab"][0]} with a specific example from this lesson.',
        f'I can identify {unit["vocab"][1]} and point to the words or events that support it.',
        f'I can practise {unit["vocab"][2]} independently on a new prompt.',
        f'I can notice {unit["vocab"][3]} needs and correct a likely mistake.',
    ]
    l.update(
        title=base['title'], child_mission=unit['mission'],
        learning_intention=unit['mission'], success_criteria=criteria,
        duration_minutes=55,
        materials=['Paper or typing area', 'Pencil for optional evidence'],
        outcome_codes=[unit['outcome']],
        source_note='Proposed Stage 2 NESA alignment; compare the existing Coming Soon card and official syllabus content points before marking verified.',
        review_status='unreviewed', **{'pass': 1, 'pass_mark': 0.9}, coming_soon=None)
    teach = []; evidence = []
    for i, (title, idea, model, try_it, feedback, trap) in enumerate(unit['stages']):
        rationale = (
            'This matters because a reader or listener can only understand your ideas when you notice how the language works, '
            'test your understanding on specific examples and explain the evidence for your choice. '
            'Keep the meaning of the original text rather than changing facts to make an answer sound impressive.')
        explanation = (
            idea + ' ' + rationale + ' Read the model closely: which particular word, event or detail changes the meaning? '
            'Try explaining the same decision to someone else without repeating the model sentence. '
            'Then compare your new attempt with the feedback and revise anything that does not fit the actual evidence.')
        check = dict(
            type='multiple_choice',
            question=f'Which is the strongest next step when learning to {title.lower()}?',
            options=[
                f'Use the example and explain the clue or language choice before trying {unit["vocab"][i]} independently.',
                'Copy every sentence exactly without explaining it.',
                'Add a made-up event and describe it as a fact.',
                'Ignore the task and choose an unrelated detail.'],
            correct_index=0,
            explanation='The best approach uses the specific concept, evidence and reasoning before practising independently; copying or inventing unsupported facts does not show understanding.')
        teach.append(dict(
            title=title, icon='📖', explain=idea + '\n\n' + explanation,
            example='WATCH MY THINKING\n' + model + '\n\nYOUR SMALL TRY\n' + try_it + '\n\nCOMPARE AND CORRECT\n' + feedback,
            notice='WATCH OUT\n' + trap + ' Re-read the prompt and correct the misunderstanding before moving on.',
            check=check))
        evidence.append(dict(
            rule=idea, why=rationale, model=model, misconception=trap,
            fix='Re-read the prompt and correct the misunderstanding before moving on.',
            guided_attempt=try_it, feedback=feedback))
    visuals = list(VISUALS[unit['code']])
    teach[0]['visual'] = [visuals[0]]
    teach[1]['visual'] = [visuals[1]]
    model0 = unit['stages'][0][2]
    teach[0]['visual_before'] = [room_episode('Talk through the first model', [
        ('pip', 'I read the first example, but I am not sure which detail matters most.'),
        ('juno', 'Name the exact words or events that carry the meaning before you copy a conclusion.'),
        ('pip', 'So I should try the small prompt myself, then compare it with the feedback.'),
        ('juno', 'Pause here. Use this model: ' + model0[:120] + ' Then write your own attempt.', True),
    ])]
    l['teach_steps'] = teach
    l['worked_visuals'] = visuals
    l['worked_example'] = 'I DO — ' + unit['stages'][0][2] + '\n\nNow look for the exact evidence in the words or actions. ' + unit['stages'][1][2]
    l['guided_practice'] = 'WE DO — attempt each prompt before comparing to the feedback.\n' + '\n'.join(
        f'{i+1}. {st[3]}\nCOMPARE: {st[4]}' for i, st in enumerate(unit['stages']))
    l['independent_task'] = 'YOU DO — complete the following substantial original task, not a copied model.\n' + unit['independent']
    l['response_prompt'] = 'Submit your original independent work and your brief explanation of the key choices you made.'
    distractors = [
        'Ignore the words and invent a more exciting event.',
        'Copy the model word-for-word and call that independent work.',
        'Treat a missing detail as a stated fact.',
        'Skip the prompt because the first idea sounded good.']
    q = []
    for i, st in enumerate(unit['stages']):
        q.append(dict(
            type='multiple_choice',
            question=f'Which idea is taught in the stage "{st[0]}"?',
            options=[st[1], st[5], distractors[i % 4], distractors[(i + 1) % 4]],
            correct_index=0,
            explanation=st[1] + ' The other choices either name a known misunderstanding or avoid explaining the actual strategy.'))
    for i, st in enumerate(unit['stages']):
        q.append(dict(
            type='multiple_choice',
            question=f'After trying "{st[3][:80]}", which feedback is most useful?',
            options=[st[4], st[5], 'Any answer is equally supported.', 'There is no need to compare your attempt.'],
            correct_index=0,
            explanation=st[4] + ' This explanation uses the original evidence or language point, rather than treating a misconception as the correct response.'))
    sample1 = 'Original demonstration: ' + unit['stages'][0][2]
    sample2 = 'Common error: ' + unit['stages'][2][5] + ' Correction: ' + unit['stages'][2][4]
    q += [
        dict(type='short_answer',
             question=f'Use your own example to demonstrate {unit["vocab"][0]} and explain the evidence supporting your choice.',
             sample_answer=sample1,
             marking_guide='Require an original relevant example, accurate terminology and an explanation grounded in the example.',
             explanation='Meaningful understanding is shown when a learner transfers the method to new text or speech and explains their evidence.'),
        dict(type='short_answer',
             question=f'Identify and correct a common mistake relating to {unit["vocab"][2]} in this lesson.',
             sample_answer=sample2,
             marking_guide='Require a genuine relevant error, accurate correction and a reason that refers to the target concept.',
             explanation='Explaining a correction helps the learner distinguish an effective strategy from a plausible-sounding but inaccurate approach.'),
    ]
    l['quiz'] = q
    l['parent_notes'] = (
        'Parent: Marking guidance: ' + unit['parent'] +
        ' Accept plausible original solutions where the text supports them; require the learner to explain at least one independent choice.\n\n'
        'Parent: Written model 1: ' + sample1 + '\n\n'
        'Parent: Written model 2: ' + sample2 + '\n\n'
        'Parent: Assess comprehension and language rather than penalising speech or motor difficulties unrelated to the objective. Keep written models out of the child role.')
    l['evidence_instructions'] = 'Keep the independent response and two written check responses; record oral retelling or performance where required by the task.'
    l['offline_alternative'] = 'Use paper to copy only the original independent prompt; have the child respond in writing or orally as required. Save a photograph or brief parent observation for the learning record.'
    l['extension'] = 'Create a new example using a completely different character or setting, show the same skill, then explain to another person how you checked its accuracy.'
    keys = ['accept', 'teach0', 'teach1', 'teach2', 'teach3', 'learn', 'guided', 'write', 'quiz', 'submit']
    descriptions = [
        ('Today you will practise ' + unit['vocab'][0] + '.',
         'Read the mission before you start writing or speaking.',
         'Your goal is: ' + unit['mission']),
        *[(f'Focus on {st[0].lower()}.',
           'Hold this teaching point: ' + st[1][:120],
           'Worked comparison: ' + st[4][:120]) for st in unit['stages']],
        ('Study the first worked demonstration carefully.',
         'Name the exact words or events that make it work.',
         'Demonstration: ' + unit['stages'][0][2][:140]),
        ('Attempt each guided prompt without looking ahead.',
         'Compare your attempt with the supplied specific feedback.',
         'Guided comparison: ' + unit['stages'][1][4][:140]),
        ('Use the independent instructions, not the model words.',
         'Give an original response and the reason behind it.',
         'Independent reminder: ' + unit['independent'][:160]),
        ('Read the whole question and eliminate misconceptions.',
         'Prefer the option that quotes or uses actual evidence.',
         'Likely trap: ' + unit['stages'][2][5][:140]),
        ('Include your own response and a short reason.',
         'Proofread names, sequence and punctuation before sending.',
         'Success looks like: ' + unit['mission']),
    ]
    l['stage_hints'] = {k: list(v) for k, v in zip(keys, descriptions)}
    for key in ('resources', 'word_challenges', 'sort_activity', 'suspense_builder', 'planner_fields',
                'planner_title', 'planner_intro', 'spelling', 'spelling_focus', 'hoard_words',
                'follow_up_challenges', 'printable_resource', 'interactive_activities', 'explicit_teaching'):
        l[key] = None
    return dict(
        architecture='d1-worker', lesson=l,
        curriculum=[dict(
            code=unit['outcome'],
            source='https://curriculum.nsw.edu.au/learning-areas/english/english-k-10-2022/outcomes',
            verification_status='pending', lesson_evidence=unit['mission'],
            scope_limit='Individual Written Core lesson contributes partial evidence; independently verify syllabus content-point alignment.')],
        requirements=dict(
            teaching=evidence,
            practice=dict(
                model_inputs=[unit['stages'][0][2]],
                guided_inputs=[unit['stages'][1][3]],
                independent_inputs=[unit['independent']]),
            visuals=[dict(alt=v['alt'], teaches=v['caption']) for v in visuals],
            review_questions=[
                'Verify original Coming Soon outcome and syllabus content point against NESA English K–10 2022.',
                'Educationally review worked example, independent prompts and all 10 quiz answers.',
                'Verify Stage 2 age suitability and child/parent API answer privacy.',
                'Verify written learner progress saved and restored.',
                'Confirm diagrams teach this lesson idea rather than a generic process.']))

def build_all():
    assert len(UNITS) == 14, 'Batch 02 delivers fourteen Written Core lessons through w07-l3'
    db = reconstruct()
    try:
        for unit in UNITS:
            row = db.execute('SELECT * FROM lessons WHERE seed_key=?', (unit['code'],)).fetchone()
            if row is None:
                raise RuntimeError('Missing curriculum seed: ' + unit['code'])
            bundle = make_spec(row, unit)
            target = ROOT / 'lesson-pipeline/authored' / f'{unit["code"]}.json'
            atomic_json(target, bundle)
            print('Written Core bundle:', target)
    finally:
        db.close()

if __name__ == '__main__':
    build_all()
