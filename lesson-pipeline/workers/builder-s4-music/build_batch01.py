#!/usr/bin/env python3
"""Year 7 Music Written Core: aural skills lessons 1–12.

Catalogue titles repeat the unit name. Teaching progresses from sound and
silence through a written listening log. Identity fields stay on the baseline.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / 'scripts' / 'gold-pipeline'))

from elective_batch import write_elective_batch
from written_bundle import pair_visual

CODE = 'MU4-LIS-01'
SOURCE = 'https://curriculum.nsw.edu.au/learning-areas/creative-arts/music-7-10-2024/outcomes'
NOTE = (
    'Proposed Stage 4 alignment to Music 7–10 (2024) outcome MU4-LIS-01. '
    'Content-point mapping is pending. Not NESA verified. No copyrighted recordings '
    'are required; examples are original descriptions or student-made sounds.'
)
OUT = ROOT / 'lesson-pipeline/workers/builder-s4-music/authored'


def L(seed, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(
        seed_key=seed, code=CODE, subject='arts', vocab=vocab,
        principle=principle, model=model, guided=guided, feedback=feedback,
        misconception=misconception, independent=independent,
    )


LESSONS = [
    L(
        's5-music-y9-w01-l1',
        ['pitch', 'silence', 'duration', 'listening'],
        'Sound is anything you can hear, and silence is the timed gap where hearing stops. '
        'Pitch is how high or low a sound sits, and duration is how long that sound or gap lasts. '
        'A classroom can teach both with no recording: claps are short and hard to hum back, while a hummed note has one pitch you can match. '
        'The pause between them is not a mistake. Its duration changes when the next sound arrives. '
        'You listen for pitch, duration, and silence together so a description could be performed again from words alone.',
        'Four even claps, a two-count silent pause, then one medium hum held for three counts. '
        'Each clap is a short duration and has no single pitch to copy with the voice. '
        'The pause is silence with a duration of about two walking counts, so you do not rush into the hum. '
        'The hum has a clear medium pitch and a longer duration than any clap. '
        'Write those three facts, including the silence, before you add any story about the sound.',
        'You hear two claps, a short silence, one foot stamp, and then a hum that sits higher than a comfortable speaking voice. How do pitch and duration differ for each event, including the silence?',
        'A strong answer gives every event a duration and says whether it has a hummable pitch, and it treats the gap as silence with its own length. '
        'The two claps are short and not one clear pitch. The stamp is also short and unpitched. '
        'The silence has duration but no pitch. The final hum is higher than speaking level and lasts longer than a clap. '
        'Naming only "some noises" leaves out the features a listener needs.',
        'Silence is empty waiting, so a careful listener should skip every gap and describe only the noises. '
        'That fails because a gap has duration and it moves the next sound later. '
        'If you delete the pause, the hum seems to answer the claps at once, which is a different piece. '
        'Put the silence back in the description and give it a count.',
        'Tap a spoon three times on a table, leave one count of silence, then hum a low note for two counts. '
        'On paper, list pitch and duration for the taps, the silence, and the low hum. '
        'Do not reuse the four-clap pattern or the higher hum from the practice. '
        'A parent can listen once and tick whether the silence was given a length.',
    ),
    L(
        's5-music-y9-w01-l2',
        ['direction', 'upward', 'downward', 'repeat'],
        'Pitch direction tells you whether the next note moves up, moves down, or stays the same as the note you just heard. '
        'You already know that a hum has a pitch. Today you compare neighbouring pitches instead of only naming one note as high or low. '
        'Same means you cannot hear a change. Up means the new note is higher. Down means it is lower. '
        'Letter names are not required. Your ear and a pencil are enough if you describe the three notes in order. '
        'Direction matters because a tune is a path, not a pile of separate sounds.',
        'Three hummed notes in words: start on a comfortable middle hum, slide to a clearly higher hum, then hold that same higher hum again. '
        'From the first note to the second, the direction is up. From the second note to the third, the direction is same, because nothing moved. '
        'Do not call the third note "up" just because it is still high. Compare it only with the note before it. '
        'Say the path aloud as "up, then same" and point to which pair each word describes.',
        'A friend hums a high note, then a lower note, then a note that is lower again. How should you name the two pitch movements between those three notes?',
        'A strong answer compares each note only with the one just heard and writes down, then down. '
        'The first move leaves the high note for a lower one, so it is downward. '
        'The second move leaves that note for a still lower one, so it is downward again. '
        'Calling the whole line "low" hides the two steps a singer would need.',
        'Notes that feel close together must be the same pitch, even when the second note is slightly higher. '
        'That fails because same means no audible change at all. A small lift is still up. '
        'If you label a slight rise as same, the path you write cannot be hummed back. '
        'Test it: hum both notes and keep the word up whenever the second note climbs.',
        'Hum a low note, hum that same low note again, then jump to a much higher note. '
        'Write the two directions in order and say which pair stayed still. '
        'This path is not the middle-up-same example and not the high-lower-lower practice. '
        'Your page should show same, then up.',
    ),
    L(
        's5-music-y9-w02-l1',
        ['beat', 'rhythm', 'pulse', 'rest'],
        'A steady beat is the even pulse you could walk or pat without speeding up or slowing down. '
        'A rhythm pattern is the mix of sounds and rests that rides on that pulse, so some beats carry a sound and some stay empty or carry two quick sounds. '
        'The beat can stay perfectly even while the rhythm changes. That is why they are different ideas, not two names for clapping. '
        'This lesson uses body percussion only: knee pats, claps, stamps, and finger clicks. No tracks and no instruments are required. '
        'Separating beat from rhythm lets you keep a group together while the pattern stays interesting.',
        'Pat your knees on four even counts and keep that pat going as the beat. '
        'For the rhythm, clap on count 1, leave count 2 silent, clap twice quickly during count 3, and leave count 4 silent. '
        'The knee pat never waits and never doubles, so it is the steady beat. '
        'The claps and the empty counts are the rhythm pattern because their durations are not all equal. '
        'Say "beat" for the pats and "rhythm" for the clap pattern before you try to do both together.',
        'Stamp an even four-count beat with one foot while you tap your shoulders on count 1, rest on count 2, tap once on count 3, and tap twice quickly on count 4. Which part is the steady beat, and which part is the rhythm pattern?',
        'A strong answer calls the even foot stamps the beat and the shoulder taps with their rest the rhythm. '
        'The stamps stay one sound per count. The shoulders do not: count 2 is a rest and count 4 has two taps. '
        'Doing both at once does not glue them into one idea. '
        'You can stop the shoulders and the beat still walks on.',
        'Any clapping is the beat, so a pattern of long and short claps is the same thing as a steady pulse. '
        'That fails when the claps are uneven, because a beat does not stretch and shrink from count to count. '
        'Uneven claps are rhythm. The beat is the even grid underneath, which you may pat even when a clap is missing. '
        'If the sounds speed up and slow down, you have not found the beat yet.',
        'Click your fingers on every count of a slow four, and clap only on counts 1 and 4. '
        'Write one sentence naming the finger clicks as the beat and the two claps as the rhythm, and say what is silent on counts 2 and 3. '
        'Do not copy the knee-pat pattern or the shoulder-tap pattern. '
        'If clicking hurts, pat your chest for the beat instead and say so on the page.',
    ),
    L(
        's5-music-y9-w02-l2',
        ['tempo', 'dynamics', 'mood', 'choice'],
        'Tempo is the speed of the beat, from slow to fast, and dynamics are the loudness, from soft to loud. '
        'They are expressive choices: the same body pattern can feel cautious, urgent, heavy, or gentle when you change only speed or only volume. '
        'A choice needs a reason. You name the tempo, name the dynamics, and say what mood that pair suggests to you in this example. '
        'Fast is not locked to happy, and loud is not locked to angry. The mood comes from the combination and from the picture you are making. '
        'You can perform every example with pats, stamps, or a hum, then write the reason in pencil.',
        'Pat your knees four times at a slow tempo and a soft dynamic, as if you are crossing a dark room. '
        'Pat the same four knee sounds again, now fast and loud, as if you need a friend at the other end of a yard. '
        'The rhythm did not change: four single pats. Tempo changed from slow to fast, and dynamics changed from soft to loud. '
        'The first version can feel careful. The second can feel urgent. Those moods are effects of the choices, not new notes. '
        'Write "tempo" and "dynamics" on two lines so you do not blend speed into volume.',
        'Start with eight quiet finger clicks that gradually get faster, then switch to four slow loud stamps. What happens to the mood, and which choice, tempo or dynamics, does each half use?',
        'A strong answer separates speed from volume and ties each half to a mood with a because. '
        'The clicks stay soft while the tempo quickens, so the mood can tighten or flutter without becoming a shout. '
        'The stamps are both slower and louder, so the mood can turn heavy or final. '
        'Saying only "it got more exciting" never names the choice that caused the change.',
        'Fast music is always happy and loud music is always angry, so each speed and volume has one fixed mood. '
        'That fails because the same fast tempo can feel playful in a game or nervous in a chase, and a loud sound can feel proud, warning, or simply clear. '
        'A mood word without the tempo or dynamic that supports it is a guess. '
        'Match the word to the choice you actually performed.',
        'Hum one comfortable pitch three ways: slow and soft, then fast and soft, then slow and loud. '
        'Keep the pitch the same so the only changes are tempo and dynamics. '
        'Write two mood sentences, each naming which choice changed and why the feeling shifted. '
        'This hum task is not the knee-pat pair and not the click-then-stamp practice.',
    ),
    L(
        's5-music-y9-w03-l1',
        ['timbre', 'voice', 'wood', 'skin'],
        'Timbre is the tone colour that lets you tell sound-makers apart when pitch and duration match. '
        'This lesson uses four families you can hear in a house: voice, wood, metal, and skin. '
        'Voice carries breath and a vowel or hum. Wood often gives a dry knock that stops quickly. Metal often rings after the hit. Skin, meaning a stretched surface such as a balloon or your own thigh, gives a dull thud. '
        'Identify the family from the sound description. Do not use brand names, logos, or a picture of a shop instrument. '
        'Timbre matters because two notes can share a pitch and still be different music.',
        'Four short sounds, each about one count long: a person sings "ooh" on one note, a wooden spoon knocks a wooden chair, a metal spoon taps a metal pot lid, and an open palm strikes a balloon. '
        'The sung "ooh" is voice because you hear breath and a vowel with a clear pitch. '
        'The chair knock is wood because the sound is dry and dies at once. '
        'The pot lid is metal because a bright ring continues after the spoon leaves. '
        'The balloon is skin because the thud is dull and does not ring. Same duration, four timbres.',
        'Sort these described sounds into voice, wood, metal, or skin, and name one clue for each: a whispered "mmm", two pencils tapped together, a bunch of keys shaken once, and a palm pat on your thigh. What family is each sound?',
        'A strong answer matches whisper to voice, pencils to wood, keys to metal, and the thigh pat to skin, with a clue that is about the sound rather than a product name. '
        'The whisper has breath and no ring. The pencils knock and stop. The keys jangle and shimmer. The thigh thud is soft and dull. '
        'If two answers share a family, the clues must still explain why. '
        'A brand or a shop label is not a clue you can hear.',
        'If two sounds are both short knocks, they have the same timbre, so wood and metal belong in one family. '
        'That fails because a wooden knock usually stops dead while a metal knock leaves a ring. '
        'The length of the ring is a timbre clue even when the hits are equally short. '
        'Listen past the attack and describe what remains.',
        'Name the family and one heard clue for each new sound: you sing the word "noon", you knock a wooden door, you tap a metal lid with a fork, and you drum two fingers on a balloon. '
        'Do not reuse the chair, the pot, the pencils, or the keys. '
        'Write four lines, with no brand names. '
        'If a lid does not ring, say what you actually heard and choose the family that matches that sound.',
    ),
    L(
        's5-music-y9-w03-l2',
        ['texture', 'layer', 'single', 'combined'],
        'Texture is how many different parts sound at the same time. One line means a single part by itself. Two layered parts mean two different jobs happening together, such as a steady tap under a spoken rhythm. '
        'You can tap a pulse while a partner speaks, or, if you are alone, play a voice memo you made of your own speaking and tap with it. '
        'Do not use a link, a stream, or anyone else\'s track. Pencil can also show the two layers as two rows. '
        'People in the room do not count. Only sounding parts count, so one person can make two layers and two silent friends still make none. '
        'Hearing texture stops you from calling every group performance "the same thickness".',
        'Tap a steady four-beat pulse on your chest while you say "walk walk run-and walk" across those same four beats. '
        'Alone, the sentence would be one line. Alone, the chest tap would be one line. '
        'Together they are two layers because the tap stays even while the words stretch and hurry. '
        'Point to your chest for the pulse layer and to your mouth for the speech layer. '
        'On paper, draw two rows labelled pulse and words so the combination is visible.',
        'A partner taps even knee pulses while you speak "drip, drip-drip, splash" across four beats. Do you hear one line or two layers, and what is each part doing?',
        'A strong answer says this is two layers, names the knee tap as the even pulse, and names the spoken drip pattern as the second part. '
        'The words are not the same as the taps: "drip-drip" puts two syllables on one beat and "splash" lands once. '
        'If you are alone, record only your own speaking, then tap the knees with that memo, and say that on the page. '
        'Calling it one line would erase a part that a listener can still follow.',
        'Two people in the room always create two-part texture, even when only one of them is making a sound. '
        'That fails because texture counts parts you can hear, not bodies nearby. '
        'One speaker with no pulse is a single line. One musician tapping and speaking can build a combined texture alone. '
        'Ask "what is sounding?" before you count heads.',
        'Tap a slow pulse on the table with one hand while you say "tick, tock, tick-tock, stop" over four beats. '
        'Write whether the texture is single or combined, and name the two layers. '
        'Use neither the walk words nor the drip words. '
        'If you need a memo, record this new sentence yourself, then tap along, and attach no web address.',
    ),
    L(
        's5-music-y9-w04-l1',
        ['structure', 'section', 'repeat', 'contrast'],
        'Structure is the order of sections, and this lesson uses two labels only. Section A is one musical idea. Section B is a different idea you can hear. '
        'If the first idea comes back unchanged, it is still A, because same material keeps the same letter. '
        'Different can mean the words, the rhythm, or both. A new line on the page is not automatically B. '
        'You will use a short original chant, spoken or softly sung, then label what you heard. '
        'Structure lets a listener predict a return or notice a real change.',
        'Chant A as "Rain on the roof, rain on the roof", using the same rhythm both times. '
        'Chant B as "Thunder roll and then stop", with a longer word on "roll" and a stop at the end. '
        'The form is A then B. B is not a repeat, because the words and the rhythm both change. '
        'Clap the rhythm of each line. The roof line splits into two matching halves. The thunder line does not. '
        'Write A and B in boxes and jot the one difference you clapped.',
        'Perform "Boots in the hall, boots in the hall" and then "Quiet now, coats down". Which line is section A, which is section B, and what is one difference you can hear?',
        'A strong answer labels the boots line as A because it states one idea and repeats it, and labels the coats line as B because the words and rhythm are new. '
        'One real difference is enough: the second line does not echo "boots in the hall", and its rhythm is a short call plus two words rather than a doubled phrase. '
        'Saying "the second line is B because it is second" would also label an exact repeat as B, which is wrong. '
        'Quote a word from each section as evidence.',
        'Any second line is section B, even when it copies the first line exactly in words and rhythm. '
        'That fails because an exact copy is more of section A, not a contrast. '
        'B is reserved for material that sounds different. '
        'If you cannot name a heard change, do not spend the letter B.',
        'Create and label this new chant, not the rain chant and not the boots chant: A is "Kettle click, kettle click" and B is "Steam up, lid down, wait". '
        'Write the form as A then B and state one difference in words or rhythm. '
        'Perform it aloud once, then mark the repeated half inside A. '
        'Your evidence should mention click or steam so a reader knows which section you mean.',
    ),
    L(
        's5-music-y9-w04-l2',
        ['order', 'map', 'event', 'sequence'],
        'A listening map puts a sound story in time order: what happens first, what happens next, and what happens last. '
        'This lesson uses an original four-event story, so your map needs four boxes, not a single picture of the loudest moment. '
        'Silence can be one of the four events. Skipping it breaks the sequence a performer would follow. '
        'You may draw simple marks or write a phrase in each box. Either way, another person should be able to replay the story from your page. '
        'Order matters more than decoration, because a map is a timeline.',
        'Story in order: first, three soft finger clicks; next, two door-knocks close together; later, about two counts of silence; last, a low hum that fades away. '
        'Box 1 gets the clicks, box 2 the knocks, box 3 the silence, and box 4 the fading hum. '
        'The silence stays in the third box even though it is quiet, because it is an event with duration. '
        'The hum is last, so it does not jump to the front for being easier to notice. '
        'Read the four boxes aloud in order and check that nothing swapped places.',
        'Map this different story from start to finish: a high hum, then four fast claps, then one loud stamp, then silence. What belongs in first, next, later, and last?',
        'A strong answer keeps the high hum first, the four fast claps next, the loud stamp later, and the silence last. '
        'Each box names the sound, not a mood alone. Silence is last, so it is not dropped for being quiet and not moved earlier. '
        'The stamp is loud, but loudness does not earn the first box. '
        'A reader who performs your map should stamp only after the claps.',
        'The loudest event should be drawn first because it is the most important, even when it happened last. '
        'That fails because a listening map follows time, not a ranking of excitement. '
        'Put the loud stamp, ring, or shout in the box that matches when you heard it. '
        'Importance can be noted in words inside the correct box, without moving the box.',
        'Draw or describe a four-box map for this new story: four spoon taps on a cup, then a whispered "shhh", then a wooden chair scrape, then one metal-lid ring. '
        'Label the boxes first, next, later, and last. '
        'Do not reuse the finger clicks, the door-knocks, the high hum, or the stamp story. '
        'Include the whisper even though it is soft.',
    ),
    L(
        's5-music-y9-w05-l1',
        ['motif', 'compare', 'contrast', 'difference'],
        'A motif in this lesson is one original idea that lasts four beats. Comparing two motifs means naming one element that differs, such as rhythm, pitch, or dynamics, and pointing to the beat where you hear it. '
        'Equal length does not make two motifs the same. Both can last four beats and still disagree in one element. '
        'You only need one true difference, but it must be hearable, not a guess about a composer or a style. '
        'Keep the beat steady in your body while you perform each motif, so you do not confuse a tempo change with a rhythm change. '
        'A precise comparison is more useful than a long list of vague praises.',
        'Motif 1 is four medium claps, one on each beat. Motif 2 is clap, rest, clap, clap, still on the same walking beat. '
        'Both motifs last four beats and use claps, so tempo and instrument family are not the difference. '
        'The element that differs is rhythm: beat 2 sounds in motif 1 and is silent in motif 2. '
        'Say "rhythm, beat 2" rather than "they are a bit different". '
        'Perform motif 1, stop, then perform motif 2, so the missing clap is obvious.',
        'Motif 1 is four hums on one pitch, one hum per beat. Motif 2 is hum, hum, higher hum, higher hum, at the same speed. Which single element differs, and where do you hear it?',
        'A strong answer names pitch, not rhythm, because every beat still has one hum. '
        'The change starts at beat 3, where the pitch moves up and then stays up for beat 4. '
        'Beats 1 and 2 match, so the motifs are not different all the way through. '
        'Writing "the tune changed" is weaker than saying the pitch rises on beat 3.',
        'If both motifs last four beats, every element matches, so there is nothing useful to compare. '
        'That fails because duration of the whole motif can match while rhythm, pitch, or dynamics do not. '
        'Four beats is the frame. The element inside the frame can still change. '
        'Look beat by beat before you decide the motifs are twins.',
        'Compare two new knee-pat motifs on the same slow beat. Motif 1 is four soft pats. Motif 2 is four loud pats. '
        'Name the one element that differs and the evidence that rhythm and tempo stayed the same. '
        'The element is dynamics. Do not reuse the clap-rest motif or the rising hum motif. '
        'Write the word loud or soft beside each motif.',
    ),
    L(
        's5-music-y9-w05-l2',
        ['label', 'evidence', 'limit', 'march'],
        'A style label is a limited claim you can defend from the sound, not a decoration that makes the answer look finished. '
        'You may say this description fits a march because of a steady beat, when the beat is even and feels like walking in step, especially if accents land in a regular place. '
        'Fits means the description is consistent with that label. It does not mean no other label could ever apply, and it does not smuggle in a culture or a history. '
        'Do not invent cultural, historical, or Aboriginal musical facts. This lesson does not teach those facts, and a sound made in your kitchen does not contain them. '
        'If you were not given a reliable source, stop at the elements you can hear.',
        'Description: eight even knee pats, no speeding up, with a slightly stronger pat on beats 1 and 3. '
        'A careful label is: this description fits a march because of a steady beat and regular accents, like walking in step. '
        'The limit sits in the next sentence: I am not naming a people, a place, a ceremony, or a historical story, because this example never gave that information. '
        'The evidence is only the even tempo and the accents on 1 and 3. '
        'Take away the steady beat and the march label would no longer be honest.',
        'This new description is a slow soft hum that wavers, with long uneven gaps and no walking pulse. Does the label march fit, and what must you refuse to invent?',
        'A strong answer rejects march because there is no steady walking beat, and it says the uneven gaps are the evidence. '
        'It may describe tempo as slow and dynamics as soft without borrowing a style word that the sound does not support. '
        'It also states the limit: no cultural, historical, or Aboriginal musical fact is added, because none was supplied. '
        'A rejected label with a reason is a better listening response than a confident invention.',
        'Once you know one style word, you should attach a culture or a history so the sentence sounds complete. '
        'That fails because a culture or a history that you were not given is an invented fact, not evidence. '
        'Completeness here means the label matches the beat you heard and the limit is spoken aloud. '
        'Leave the unknown out on purpose.',
        'Judge a fresh description that is not the knee-pat march and not the wavering hum: fast even claps with an accent on every beat, more like running in step than walking. '
        'Decide whether march still fits or whether the running tempo makes the label weak, and give the beat evidence. '
        'Add one sentence naming what you will not invent about culture or history. '
        'Use only this clap description as your sound evidence.',
    ),
    L(
        's5-music-y9-w06-l1',
        ['element', 'evidence', 'effect', 'listener'],
        'A written listening response has three parts in this order: the element, the evidence from the sound description, and the effect on the listener. '
        'An element is a musical feature such as dynamics, pitch direction, duration, timbre, texture, or structure. '
        'Evidence uses details from the description you were given, not a new story you wish were there. '
        'Effect says what that evidence does to a listener, such as surprise, calm, or a clearer pulse. '
        'One tight paragraph with all three parts is stronger than a list of praise words.',
        'Description: four slow soft wooden knocks, then one loud metal ring. '
        'Response: the element is dynamics. The evidence is that the knocks are soft and the ring is loud, with timbre also shifting from wood to metal. '
        'The effect is that the loud ring startles the ear after the quiet knocks, so the last event feels like a sudden arrival. '
        'The sentence works because a reader can point to "soft" and "loud" in the description. '
        'No performer name or culture is added, because the description has none.',
        'Using this description only, write an element, a piece of evidence, and an effect: a voice hums three notes moving down, and each note is longer than the one before it. What is one accurate response?',
        'A strong answer names pitch direction or duration, quotes the downward move or the lengthening notes as evidence, and gives an effect such as a feeling of sinking or of time stretching. '
        'Both elements are fair if the evidence matches the one you chose. '
        'The effect must follow that evidence: longer notes can make the descent feel heavier, but you should say so. '
        'The word interesting, by itself, has none of the three parts.',
        'A listening response is finished when you write that the piece is interesting, because the effect is obvious to everyone. '
        'That fails because interesting names no element and borrows no evidence from the description. '
        'Two listeners can both say interesting and still be talking about different features. '
        'Replace it with element, evidence, and effect.',
        'Write a three-part response to this new description: two layers sound together, a steady thigh-pat pulse under the spoken words "tip tap tip-tap stop". '
        'Use texture as the element, quote both layers as evidence, and state an effect on the listener. '
        'Do not answer with the wooden knocks or the descending hum. '
        'Keep people, places, and histories out unless the description itself included them, which it does not.',
    ),
    L(
        's5-music-y9-w06-l2',
        ['log', 'household', 'repair', 'notice'],
        'A listening log records household or self-made sounds with musical elements, not a shopping list of object names. '
        'Each entry should notice at least two elements you can defend, such as pitch, duration, beat, rhythm, tempo, dynamics, timbre, texture, or order. '
        'Self-made sounds count. Listening is the noticing, even when your own hands made the sound. '
        'This last lesson also repairs one wrong idea in writing, so the error is named, corrected, and explained. '
        'You need no purchased music and no online audio. A pencil and the room you are in are the materials.',
        'Worked log: footsteps in a hallway, four steps. Elements: the steps make a steady beat at a medium tempo, and each step has a short duration. '
        'Worked repair of a different error: the claim "a soft sound has no pitch" fails on a quiet fridge hum, because you can still match its low pitch. '
        'Soft is dynamics. Pitch can stay present when the volume drops. '
        'The log names heard features, and the repair keeps one element from swallowing another. '
        'Neither sentence is copied onto the independent page as your own sounds.',
        'Log a dripping tap you can hear or imitate, using two elements, then repair this wrong idea: every repeated sound is a steady beat. What should the log and the repair include?',
        'A strong answer describes the drip with two elements, for example short duration and an uneven rhythm if the gaps change, and then repairs the beat claim. '
        'A repeated sound is a steady beat only when the gaps are even. A speeding or pausing drip is rhythm, not a reliable pulse. '
        'The repair must say the wrong idea, the correction, and the drip evidence that proves it. '
        'Writing "tap" with no element is a label, not a log.',
        'A listening log is complete when it lists object names, so kettle, chair, and voice are a finished entry. '
        'That fails because names do not tell pitch, duration, loudness, or order. '
        'A chair can scrape, knock, or stay silent. The log has to say which sound happened and which elements you noticed. '
        'Add the elements beside any object you keep.',
        'Choose three household or self-made sounds that are not footsteps and not a dripping tap, such as a zipper, a mug set on a bench, and three hummed notes you invent. '
        'For each sound write one log sentence with two elements you actually notice. '
        'Then repair this separate wrong idea: if I made the sound myself, it cannot count as listening. '
        'Explain why that repair matters for a homeschool log that uses your own claps, hums, and kitchen sounds.',
    ),
]


def V(left_title, left_text, right_title, right_text, alt, caption):
    return pair_visual(left_title, left_text, right_title, right_text, alt, caption)


VISUALS = {
    's5-music-y9-w01-l1': [
        V('Sound', 'Clap or hum you can hear', 'Silence', 'Timed gap with no sound',
          'Two boxes contrast a heard clap or hum with a timed silent gap.',
          'Silence is a duration, not a skipped blank.'),
        V('Pitch', 'How high or low the hum sits', 'Duration', 'How long the sound lasts',
          'Two boxes contrast pitch of a hum with the duration of a sound.',
          'Name pitch and duration as different facts.'),
    ],
    's5-music-y9-w01-l2': [
        V('Up', 'The next hum is higher', 'Down', 'The next hum is lower',
          'Two boxes show an upward hum change beside a downward hum change.',
          'Direction compares a note with the one before it.'),
        V('Same', 'No pitch change is heard', 'Path', 'Up, down, or same in order',
          'Two boxes contrast a repeated pitch with a three-note direction path.',
          'Same is a direction, not a leftover high note.'),
    ],
    's5-music-y9-w02-l1': [
        V('Beat', 'Even pats you could walk to', 'Rhythm', 'Long, short, and silent counts',
          'Two boxes contrast an even walking beat with an uneven rhythm pattern.',
          'The beat can stay even while the rhythm changes.'),
        V('Sound', 'A body sound on a count', 'Rest', 'A count with no body sound',
          'Two boxes contrast a body-percussion sound with a silent rest.',
          'Rests belong in the rhythm, not outside it.'),
    ],
    's5-music-y9-w02-l2': [
        V('Tempo', 'Slow beat or fast beat', 'Dynamics', 'Soft sound or loud sound',
          'Two boxes separate tempo choices from dynamics choices.',
          'Speed and loudness are different expressive choices.'),
        V('Soft slow', 'Careful, quiet knee pats', 'Loud fast', 'Urgent, strong knee pats',
          'Two boxes contrast a soft slow pattern with a loud fast pattern.',
          'The same pats change mood when tempo and dynamics change.'),
    ],
    's5-music-y9-w03-l1': [
        V('Voice', 'Breath and a vowel or hum', 'Wood', 'Dry knock that stops fast',
          'Two boxes contrast a voice timbre with a dry wooden knock.',
          'Identify voice and wood from the sound, not a brand.'),
        V('Metal', 'A hit that leaves a ring', 'Skin', 'Dull thud on a stretched surface',
          'Two boxes contrast a ringing metal hit with a dull skin thud.',
          'Metal often rings and skin usually thuds.'),
    ],
    's5-music-y9-w03-l2': [
        V('One line', 'Only the spoken rhythm', 'Two layers', 'Pulse tap plus spoken rhythm',
          'Two boxes contrast a single spoken line with a pulse under speech.',
          'Texture counts sounding layers, not people in the room.'),
        V('Pulse', 'Even tap on chest or knees', 'Speech', 'Words with their own rhythm',
          'Two boxes name the pulse layer beside the spoken rhythm layer.',
          'Together the tap and the words make combined texture.'),
    ],
    's5-music-y9-w04-l1': [
        V('Section A', 'Same chant heard again', 'Section B', 'A chant that sounds different',
          'Two boxes contrast a repeated section A with a different section B.',
          'B is a heard contrast, not merely the second line.'),
        V('Same', 'Words and rhythm return', 'Different', 'Words or rhythm change',
          'Two boxes contrast a same section with a different section.',
          'An exact repeat keeps the letter A.'),
    ],
    's5-music-y9-w04-l2': [
        V('First', 'Event 1 opens the story', 'Next', 'Event 2 follows at once',
          'Two boxes show the first sound event beside the next event.',
          'A listening map starts at the beginning, not the loudest moment.'),
        V('Later', 'Event 3, even if silent', 'Last', 'Event 4 closes the story',
          'Two boxes show the third event, which may be silence, beside the last event.',
          'Four boxes stay in time order from first to last.'),
    ],
    's5-music-y9-w05-l1': [
        V('Motif 1', 'Sound on all four beats', 'Motif 2', 'Beat 2 is a rest',
          'Two boxes compare a four-clap motif with a motif that rests on beat 2.',
          'Same length can still hide a rhythm difference.'),
        V('Same frame', 'Both motifs last four beats', 'One change', 'Name the element that moved',
          'Two boxes contrast a shared four-beat frame with one differing element.',
          'Compare by naming one element and the beat where it changes.'),
    ],
    's5-music-y9-w05-l2': [
        V('Evidence', 'Even beat and regular accents', 'Label', 'Fits a march if the beat walks',
          'Two boxes link steady-beat evidence to a limited march label.',
          'A style label is only as strong as the beat evidence.'),
        V('Allowed', 'Say what the sound supports', 'Not allowed', 'Do not invent culture or history',
          'Two boxes contrast an evidence-based label with facts you must not invent.',
          'Stop at the elements you can hear when no source was given.'),
    ],
    's5-music-y9-w06-l1': [
        V('Element', 'Name the feature you mean', 'Evidence', 'Quote the sound description',
          'Two boxes pair a named musical element with evidence from the description.',
          'Evidence must come from the description you were given.'),
        V('Effect', 'What the listener experiences', 'Response', 'Element plus evidence plus effect',
          'Two boxes show the listener effect beside a complete three-part response.',
          'A finished response has all three parts.'),
    ],
    's5-music-y9-w06-l2': [
        V('Object name', 'Kettle alone is not a log', 'Two elements', 'Pitch, duration, or dynamics',
          'Two boxes contrast a bare object name with a log that names two elements.',
          'A listening log records elements, not a list of things.'),
        V('Wrong idea', 'Name the misconception', 'Repair', 'Correct it with heard evidence',
          'Two boxes contrast a named wrong idea with a repair that uses evidence.',
          'A repair states the error, the correction, and why it works.'),
    ],
}


def _guard():
    seen = set()
    for spec in LESSONS:
        if spec['vocab'] is None or len(spec['vocab']) != 4:
            raise SystemExit(f'{spec["seed_key"]}: vocab must be four words')
        task = spec['independent']
        for key in ('principle', 'model', 'guided', 'feedback', 'misconception'):
            if task in spec[key]:
                raise SystemExit(f'{spec["seed_key"]}: independent text leaked into {key}')
        blob = '\n'.join(spec[k] for k in (
            'principle', 'model', 'guided', 'feedback', 'misconception', 'independent'))
        if 'http' in blob or 'www.' in blob:
            raise SystemExit(f'{spec["seed_key"]}: unexpected link')
        norm = ' '.join(blob.lower().split())
        if norm in seen:
            raise SystemExit(f'{spec["seed_key"]}: duplicated lesson text')
        seen.add(norm)
        if spec['seed_key'] not in VISUALS or len(VISUALS[spec['seed_key']]) != 2:
            raise SystemExit(f'{spec["seed_key"]}: two visuals required')
    if len(LESSONS) != 12:
        raise SystemExit('expected 12 lessons')


def main():
    _guard()
    written = write_elective_batch(
        LESSONS, VISUALS, subject='arts', source_url=SOURCE, source_note=NOTE, out_dir=OUT)
    print('COUNT', len(written))
    return written


if __name__ == '__main__':
    main()
