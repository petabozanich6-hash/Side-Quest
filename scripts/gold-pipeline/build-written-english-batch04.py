#!/usr/bin/env python3
"""Year 3 English Written Core batch 04: w11-l2 through w14-l1 (12 lessons)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

LESSONS = [
dict(seed_key='s2-eng-y3-w11-l2', code='EN2-CWT-01', vocab=['rhyme', 'couplet', 'draft', 'revise'],
 principle='Write a short rhyming poem by choosing end sounds carefully and keeping a clear idea across the lines.',
 model='"Rain on the tin roof / drumming like a hoof." The end sounds roof/hoof rhyme, and both lines stay about rain noise.',
 guided='Write two rhyming lines about a windy oval without forcing nonsense words.',
 feedback='Example: "The wind raced across the oval track / and tugged my hat right off my back." Back/track rhyme and keep one scene.',
 misconception='Any two words that look alike on paper do not necessarily rhyme; listen for matching end sounds.',
 independent='Draft an 8-line rhyming poem about a local place. Mark rhyming pairs, keep one clear topic, then revise one forced rhyme into a more natural choice.'),
dict(seed_key='s2-eng-y3-w11-l3', code='EN2-VOCAB-01', vocab=['alliteration', 'onomatopoeia', 'sound word', 'effect'],
 principle='Alliteration repeats starting sounds; onomatopoeia uses words that imitate sounds. Both can make writing more vivid when used with purpose.',
 model='"The slippery snake slid" uses repeated s sounds (alliteration). "The gate clanged shut" uses clanged to imitate the sound (onomatopoeia).',
 guided='Add alliteration to "birds sat on the branch" and replace "made a noise" with an onomatopoeic verb in a second sentence.',
 feedback='Example: "Bright blue birds bounced on the branch." "The branch creaked in the wind." Creake imitates the sound.',
 misconception='Using many sound effects at once can distract from meaning; choose one useful effect at a time.',
 independent='Write six original sentences: three with clear alliteration and three with onomatopoeia. Underline the sound feature and explain the effect of two sentences on a reader.'),
dict(seed_key='s2-eng-y3-w11-l4', code='EN2-OLC-01', vocab=['performance', 'pace', 'expression', 'audience'],
 principle='Performing a poem means reading aloud with clear words, useful pauses and expression that matches the meaning.',
 model='For "The small grey cat / curled on the mat", I pause at the line break, soften my voice on curled, and keep every word audible.',
 guided='Read two lines about a storm: once too fast, once with pauses at commas and line ends. Which helps a listener?',
 feedback='Pauses at line ends and key words help listeners hear the meaning; racing through hides the poem\'s shape.',
 misconception='Louder is not automatically better; expression should fit the poem\'s feeling.',
 independent='Choose or write an 8–12 line poem. Mark two places to pause and one word to stress. Perform it twice, record or note one improvement in pace or clarity, and write a short self-assessment.'),
dict(seed_key='s2-eng-y3-w12-l1', code='EN2-RECOM-01', vocab=['simile', 'metaphor', 'comparison', 'image'],
 principle='A simile compares using like or as; a metaphor says one thing is another to create a strong image. Both need a clear shared idea.',
 model='"The moon was like a silver coin" is a simile. "The moon was a silver coin" is a metaphor. Both compare round brightness.',
 guided='Change "The road was long" into one simile and one metaphor without inventing impossible facts about the road\'s length.',
 feedback='Simile: "The road stretched like a dusty ribbon." Metaphor: "The road was a dusty ribbon." Both create an image of length and dryness.',
 misconception='A comparison is weak if the two things share no clear feature the reader can understand.',
 independent='Collect four similes and four metaphors from poems or write your own. Label each, explain the shared feature for three examples, and rewrite one weak comparison to make the image clearer.'),
dict(seed_key='s2-eng-y3-w12-l2', code='EN2-CWT-01', vocab=['imagery', 'sense detail', 'poem draft', 'revision'],
 principle='Imagery uses precise sensory details and comparisons so a reader can picture a scene. Choose details that support one mood.',
 model='"Frost lace covered the window. The yard was a white hush." Sight and a quiet metaphor build a cold, still mood.',
 guided='Improve "It was cold outside" with two sensory details and one comparison.',
 feedback='Example: "My breath fogged the air. The grass was a stiff silver carpet." The reader can see and feel the cold.',
 misconception='Listing every sense in every line can crowd the poem; select the most useful details.',
 independent='Write a 10–12 line descriptive poem about morning, night or rain. Include at least three sensory details and one simile or metaphor. Revise one line for a sharper image and explain the change.'),
dict(seed_key='s2-eng-y3-w12-l3', code='EN2-SPELL-01', vocab=['pattern', 'rhyme family', 'proofread', 'word choice'],
 principle='When writing poems, check spelling of rhyme partners and choose letter patterns that match the intended sound.',
 model='If I rhyme night with light, both use igh. "Nite" looks like a sound spelling but is not the conventional word in this poem.',
 guided='Choose the conventional spellings for a rain/____ and day/____ rhyme pair suitable for a poem.',
 feedback='Rain pairs with words such as plain or lane depending on meaning; day often pairs with play or away. Confirm each spelling.',
 misconception='A creative poem does not excuse inventing spellings for ordinary words without a clear reason.',
 independent='Draft eight lines that use at least three rhyme pairs. Proofread every end word against a reliable list or dictionary, correct two spellings, and explain one pattern you used.'),
dict(seed_key='s2-eng-y3-w12-l4', code='EN2-OLC-01', vocab=['discussion', 'evidence', 'listening', 'response'],
 principle='In a literature discussion, support ideas with evidence from the text and listen so you can respond to others\' points.',
 model='Claim: the poem feels lonely. Evidence: "empty oval" and "one crow calling". I listen to a partner\'s different view about hope in the final line before I reply.',
 guided='After hearing "The lantern went out, but the path still shone with wet stones," state one feeling and one quoted clue.',
 feedback='Feeling might be calm or determined; wet stones shining is a useful clue. Another listener may choose a different supported feeling.',
 misconception='Saying "I just liked it" without pointing to words does not show text-based discussion.',
 independent='Read a short poem twice. Prepare three discussion notes: a claim, a quotation, and a question. Hold a 3-minute discussion with a partner or parent, then write what you heard that changed or strengthened your idea.'),
dict(seed_key='s2-eng-y3-w13-l1', code='EN2-RECOM-01', vocab=['persuasion', 'audience', 'reason', 'purpose'],
 principle='Persuasive texts try to influence an audience\'s ideas or actions using clear reasons suited to that audience.',
 model='"Please join the clean-up because litter harms creek wildlife" names an action and a reason that matters to people who care about animals.',
 guided='Who is the audience, and what is the request, in "Families should walk to school on Fridays to reduce parking crowding"?',
 feedback='Audience: families. Request: walk to school on Fridays. Reason: reduce parking crowding.',
 misconception='A persuasive text is not only shouting; it needs a clear ask and reasons the audience may accept.',
 independent='Find or write a short persuasive paragraph about a school or home issue. Identify audience, request and two reasons. Explain whether the reasons suit that audience.'),
dict(seed_key='s2-eng-y3-w13-l2', code='EN2-CWT-03', vocab=['opinion', 'reason', 'example', 'structure'],
 principle='A persuasive paragraph often states an opinion, gives reasons with examples, and ends with a clear reminder of the request.',
 model='"Our class should start a compost bin. Food scraps would feed the garden, and less rubbish would go to landfill. Please support the bin this term." Opinion, reasons, request.',
 guided='Add one reason and one example to support "We should plant shade trees near the playground."',
 feedback='Reason: shade cools play spaces. Example: the western seats become too hot after lunch.',
 misconception='Repeating the opinion three times is not the same as giving reasons.',
 independent='Write a 90–120 word persuasive paragraph on a local issue. Include opinion, two reasons with examples, and a closing request. Underline the opinion sentence and list your two reasons.'),
dict(seed_key='s2-eng-y3-w13-l3', code='EN2-CWT-03', vocab=['modal verb', 'rhetorical question', 'word choice', 'tone'],
 principle='Persuasive language can use modal verbs (should, must, could) and careful word choices to strengthen a request without unfair exaggeration.',
 model='"We should protect the wetlands" uses should for recommendation. "Must we wait until the frogs disappear?" is a rhetorical question that pushes urgency.',
 guided='Rewrite "It is okay to leave rubbish" into a clearer persuasive sentence using should or must, then add one fair reason.',
 feedback='"We should not leave rubbish because it can harm birds that feed near the path." The modal marks the recommendation.',
 misconception='Using must for every small request can sound unfair or untrue; match strength to the issue.',
 independent='Revise a weak persuasive draft of six sentences. Add two modal verbs, one rhetorical question and replace two vague words with precise ones. Explain how your tone changed.'),
dict(seed_key='s2-eng-y3-w13-l4', code='EN2-OLC-01', vocab=['oral argument', 'reason', 'rebuttal', 'respect'],
 principle='An oral persuasive talk presents a clear position, supports it with reasons, and responds respectfully to another view.',
 model='Position: lunchtime sports clubs should rotate equipment. Reason: more students get a turn. Response to "But packing takes time": a five-minute rota chart can organise packing fairly.',
 guided='State a position on "homework packs should include a reading choice" and one reason. Then reply to "Choice makes marking harder."',
 feedback='A fair reply might suggest a short list of approved choices so marking stays manageable while students still choose.',
 misconception='Interrupting or mocking the other view is not the same as giving a reasoned response.',
 independent='Prepare a 60–90 second persuasive talk on a family or school topic. Include position, two reasons and a calm response to one opposing point. Perform and note one improvement.'),
dict(seed_key='s2-eng-y3-w14-l1', code='EN2-RECOM-01', vocab=['advertisement', 'purpose', 'technique', 'audience'],
 principle='Advertisements persuade people to notice a product or idea using techniques such as slogans, images and selective facts. Readers should identify purpose and technique.',
 model='A poster saying "Crunch apples: pick of the orchard" uses a slogan and positive word pick. It wants readers to choose that fruit brand; it does not prove every apple is best.',
 guided='What is the purpose, and name one technique, in a poster: "Join River Clean Crew — fun for families!" with smiling photos.',
 feedback='Purpose: recruit volunteers. Techniques: slogan-like call and happy images suggesting enjoyment.',
 misconception='An attractive advertisement is not automatically a complete or balanced set of facts.',
 independent='Analyse two advertisements (print or screen). For each, state audience, purpose, two techniques and one question a careful reader should ask before trusting the message.'),
]

VISUALS = {
 's2-eng-y3-w11-l2': [
  pair_visual('Rhyme pair', 'roof / hoof', 'Same idea', 'rain on tin',
   'Rhyming end words roof and hoof in a rain poem.',
   'End sounds match while the scene stays clear.'),
  pair_visual('Forced line', 'nonsense partner', 'Natural line', 'back / track',
   'Forced nonsense rhyme contrasted with a natural back/track pair.',
   'Choose rhyme partners that still make sense.'),
 ],
 's2-eng-y3-w11-l3': [
  pair_visual('Alliteration', 'slippery snake slid', 'Onomatopoeia', 'gate clanged',
   'Alliterative s sounds beside the sound-imitating word clanged.',
   'Each sound feature has a different job in a sentence.'),
  pair_visual('Useful', 'one clear effect', 'Crowded', 'too many sound tricks',
   'One purposeful sound effect contrasted with overcrowded effects.',
   'Select sound features that serve meaning.'),
 ],
 's2-eng-y3-w11-l4': [
  pair_visual('Pause', 'at line break', 'Stress', 'key feeling word',
   'Performance pause at a line break and stress on a key word.',
   'Pauses and stress help listeners hear the poem.'),
  pair_visual('Too fast', 'words blur', 'Clear pace', 'every word heard',
   'Rushed reading contrasted with a clear paced performance.',
   'Volume alone does not create useful expression.'),
 ],
 's2-eng-y3-w12-l1': [
  pair_visual('Simile', 'moon like a coin', 'Metaphor', 'moon was a coin',
   'Simile with like beside a metaphor without like.',
   'Both compare, but only the simile uses like or as.'),
  pair_visual('Shared feature', 'round and bright', 'Weak link', 'no clear shared idea',
   'Clear shared feature contrasted with a weak comparison.',
   'Readers need a feature they can understand.'),
 ],
 's2-eng-y3-w12-l2': [
  pair_visual('Sight', 'frost on window', 'Mood', 'white hush',
   'Frost image beside a quiet mood metaphor.',
   'Sensory details and comparisons build one mood.'),
  pair_visual('Vague', 'It was cold', 'Sharper', 'breath fogged; silver grass',
   'Vague cold statement improved with fogged breath and silver grass.',
   'Precise details help a reader picture the scene.'),
 ],
 's2-eng-y3-w12-l3': [
  pair_visual('Sound pair', 'night / light', 'Spelling', 'igh pattern',
   'Rhyming night and light sharing an igh spelling pattern.',
   'Match intended sound with conventional spelling.'),
  pair_visual('Draft error', 'nite', 'Corrected', 'night',
   'Invented nite spelling corrected to night.',
   'Poem writing still needs accurate ordinary words.'),
 ],
 's2-eng-y3-w12-l4': [
  pair_visual('Claim', 'poem feels lonely', 'Evidence', 'empty oval; one crow',
   'Feeling claim supported by empty oval and crow clues.',
   'Discussion needs words from the text.'),
  pair_visual('Listen', 'partner different view', 'Respond', 'use their point',
   'Listening to a partner view before responding with evidence.',
   'Reply to ideas, not only repeat your first claim.'),
 ],
 's2-eng-y3-w13-l1': [
  pair_visual('Request', 'join the clean-up', 'Reason', 'protect creek wildlife',
   'Persuasive request linked to a wildlife reason.',
   'Name the ask and a reason the audience may care about.'),
  pair_visual('Audience', 'families', 'Purpose', 'walk on Fridays',
   'Audience families with purpose to walk on Fridays.',
   'Reasons should suit the people being persuaded.'),
 ],
 's2-eng-y3-w13-l2': [
  pair_visual('Opinion', 'start a compost bin', 'Reasons', 'garden; less landfill',
   'Opinion about compost with garden and landfill reasons.',
   'Reasons and examples support the opinion.'),
  pair_visual('Close', 'support the bin', 'Not enough', 'repeat opinion only',
   'Closing request contrasted with mere opinion repetition.',
   'End by reminding the reader of the action.'),
 ],
 's2-eng-y3-w13-l3': [
  pair_visual('Modal', 'should protect', 'Question', 'Must we wait?',
   'Modal should beside a rhetorical urgency question.',
   'Match language strength to the issue.'),
  pair_visual('Weak', 'It is okay to litter', 'Stronger', 'We should not leave rubbish',
   'Weak permission statement revised to a clear recommendation.',
   'Precise words make the position clearer.'),
 ],
 's2-eng-y3-w13-l4': [
  pair_visual('Position', 'rotate equipment', 'Reason', 'more students get turns',
   'Oral position on rotating equipment with a fairness reason.',
   'State the position before giving reasons.'),
  pair_visual('Other view', 'packing takes time', 'Calm reply', 'five-minute rota chart',
   'Opposing packing concern met with a calm rota reply.',
   'Respond to the point without mocking the speaker.'),
 ],
 's2-eng-y3-w14-l1': [
  pair_visual('Slogan', 'Crunch apples', 'Purpose', 'choose that brand',
   'Advertising slogan aiming to influence fruit choice.',
   'Identify purpose before trusting the message.'),
  pair_visual('Technique', 'smiling photos', 'Reader question', 'What is left out?',
   'Happy photo technique beside a careful reader question.',
   'Attractive design is not a full set of facts.'),
 ],
}


def create():
    assert len(LESSONS) == 12
    db = reconstruct()
    try:
        for u in LESSONS:
            row = db.execute('SELECT * FROM lessons WHERE seed_key=?', (u['seed_key'],)).fetchone()
            if row is None:
                raise ValueError('Missing ' + u['seed_key'])
            base = baseline_data(row)
            # Preserve first mapped code when present; otherwise use authored code.
            codes = base.get('outcome_codes') or []
            if codes:
                u = dict(u, code=codes[0])
            bundle = build_from_spec(base, u, VISUALS[u['seed_key']])
            # Keep additional mapped codes as pending curriculum entries when present.
            if len(codes) > 1:
                bundle['lesson']['outcome_codes'] = list(codes)
                bundle['curriculum'] = [
                    dict(code=c,
                         source='https://curriculum.nsw.edu.au/learning-areas/english/english-k-10-2022/outcomes',
                         verification_status='pending',
                         lesson_evidence=u['principle'],
                         scope_limit='Partial contribution; confirm content points for each listed code.')
                    for c in codes]
            out = ROOT / 'lesson-pipeline/authored' / f"{u['seed_key']}.json"
            atomic_json(out, bundle)
            print('Written Core bundle:', out)
    finally:
        db.close()


if __name__ == '__main__':
    create()
