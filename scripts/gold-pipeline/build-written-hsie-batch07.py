#!/usr/bin/env python3
"""Year 3 HSIE Written Core batch 07: inquiry project close w37-l1 through w40-l2 (8)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

HIS, ACH, GEO = 'HS2-HIS-01', 'HS2-ACH-01', 'HS2-GEO-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='hsie', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-hsie-y3-w37-l1',HIS,['source','record','author','paraphrase'],
  'Good sources are chosen by asking who made them, when, why and whether they can be trusted. Each source is recorded with its title, author or creator, date and where it was found. Paraphrasing means putting ideas in your own words and naming the source, instead of copying.',
  'Example source record: Title: "Main Street, 1985" photograph; Creator: unknown, held by the local history room; Date: 1985; Where found: local library; What it shows: a bakery and a bus stop. Paraphrase: "The photo shows a bakery next to a bus stop."',
  'Which source is more reliable for the date a school opened: a school history written by the school, or a comment on a website with no author?',
  'The school history, because it names who made it and was written by people with records. The unnamed comment cannot be traced.',
  'Copying sentences without naming the source passes off someone else\'s work as your own.',
  'Find three sources for your inquiry question. Complete a source record for each with creator, date and where found, and write one paraphrased fact from each. Add one question about how far you trust each source.'),
L('s2-hsie-y3-w37-l2',HIS,['sort','pattern','fact','opinion'],
  'Sorting information into categories helps find patterns and gaps. Facts can be checked in sources, while opinions are what people think or feel. Comparing sources shows where they agree and where they differ.',
  'Example: for the library inquiry, notes are sorted into buildings, services and people. A pattern appears: more services were added after 2000. Fact: "The library opened a children\'s section in 1998." Opinion: "The old library was nicer."',
  'Sort into fact or opinion: the library opened in 1962; the old library was friendlier; the council paid for a new roof.',
  'Facts: opened in 1962; council paid for a new roof. Opinion: the old library was friendlier.',
  'Treating a strong opinion as proven fact weakens the conclusion of an inquiry.',
  'Sort your notes into three categories. Mark each fact or opinion, write one pattern and one gap, and compare two sources: where do they agree and differ?'),
L('s2-hsie-y3-w38-l1',HIS,['conclusion','evidence','limit','confidence'],
  'A conclusion answers the inquiry question using evidence. It names the strongest evidence, states how sure you are and explains the limits, such as too few sources. A good conclusion can also suggest a new question.',
  'Example conclusion: "The library has changed since 1990 mainly by adding services. Evidence: two photos show a new computer room and the librarian said the children\'s section opened in 1998. A limit is that we only had two photos, so we cannot say when each change happened."',
  'Which conclusion is stronger: "The library is better now" or "The library has more services than in 1990, because the librarian and two photos show new rooms"?',
  'The second, because it answers the question with named evidence. The first is an opinion with no evidence.',
  'A conclusion that overclaims, such as saying something happened everywhere from one source, is not supported by the evidence.',
  'Write a conclusion for your inquiry that answers the main question with two pieces of evidence, one limit and one new question. Mark how confident you are and why.'),
L('s2-hsie-y3-w38-l2',HIS,['presentation','structure','visual','audience'],
  'A clear presentation has a title, the question, how you found out, the main findings shown with a labelled visual, a conclusion and a list of sources. Use short text, large labels and keep the audience in mind.',
  'Example slide plan: 1 title and question; 2 sources used; 3 labelled photo comparison; 4 timeline of changes; 5 conclusion and limit; 6 sources list. Each slide has no more than three short sentences.',
  'Which slide has too much text: a slide with five paragraphs, or a labelled timeline with six dates? What would you change?',
  'The five-paragraph slide has too much text. Replace it with three short points or a labelled visual.',
  'Putting every note on the slides makes them hard to read and hides the main finding.',
  'Create a presentation or poster with title, question, sources, one labelled visual, conclusion and sources list. Use no more than three short sentences per section.'),
L('s2-hsie-y3-w39-l1',HIS,['rehearsal','voice','pace','feedback'],
  'Rehearsing helps speakers use a clear voice, a steady pace, eye contact and a good timing. Feedback is most useful when it names something that worked and one thing to improve, such as two stars and a wish.',
  'Example rehearsal: a student reads their conclusion aloud to a partner in three minutes, speaking slowly and pausing at each slide. Partner feedback: Star: loud and clear voice. Star: good photo. Wish: look up from the notes more.',
  'Write two stars and a wish for a partner who spoke clearly but read the whole talk from the page.',
  'Stars: clear voice and a good explanation of the evidence. Wish: look up more and use short notes instead of reading every word.',
  'Giving feedback such as "good" does not help the speaker improve.',
  'Rehearse your presentation twice with a family member or partner and time it. Collect two stars and a wish each time, make one change and write what improved.'),
L('s2-hsie-y3-w39-l2',HIS,['present','listen','question','respect'],
  'When presenting an inquiry, speakers share their question, evidence and conclusion clearly. Audiences listen respectfully, ask questions that relate to the evidence and use kind words. If a speaker does not know an answer, they say so and suggest how they could find out.',
  'Example: after a presentation a classmate asks, "What was the evidence for the new computer room?" The speaker answers, "Photo two from 2005 shows it." A second question is harder: "I do not know yet, but I could ask the librarian."',
  'A listener asks something the speaker cannot answer. What is a respectful and honest reply?',
  '"I do not know yet, but I could find out by asking the librarian or checking another source."',
  'Making up an answer to avoid saying "I do not know" damages trust in your evidence.',
  'Present your inquiry to an audience such as family, class or friends. Invite two questions and write what you answered with evidence and what you would investigate next.'),
L('s2-hsie-y3-w40-l1',HIS,['reflect','strength','goal','evidence'],
  'Reflection looks back at what was learned, which skills grew and what to do next. A reflection uses evidence from work, such as a map, a source record or a presentation, to show strengths and a next goal.',
  'Example reflection: "My strength was using sources, shown by my source records in week 37. My next goal is to ask better follow-up questions during an interview. Evidence: the interview notes where my questions were all closed."',
  'Choose one piece of your work and write a strength and a next goal with the evidence.',
  'The strength and goal must each point to a named piece of work, for example a map, a timeline or a source record.',
  'Saying "I was good at everything" with no evidence does not help you improve.',
  'Choose four pieces of HSIE work from different units. For each write the skill it shows, one strength and one next goal. Choose the piece you are proudest of and give a reason.'),
L('s2-hsie-y3-w40-l2',HIS,['celebrate','thank','review','future'],
  'A good end to the year reviews the main ideas of each unit, thanks the people who helped and sets goals for next year. Celebration should be honest about what was achieved and respectful of people\'s contributions, including community members and Custodians who shared knowledge.',
  'Example summary: Unit 1 local history; Unit 2 First Nations Peoples and Country with respect and protocols; Unit 3 places; Unit 4 people and environments; Unit 5 rules and fairness; Unit 6 remembrance; Unit 7 cultures; Unit 8 inquiry. Thank-you notes go to the librarian and the Aboriginal education officer who helped.',
  'Name one person who helped your learning this year and one way you could thank them.',
  'For example, the librarian who helped find sources, thanked by a written note that names the help.',
  'Listing what you enjoyed without naming the learning or the people who helped misses the purpose of a review.',
  'Write a short year review letter naming one idea from each of the eight units, one thank-you and one goal for next year. Share it with an adult.'),
]

VISUALS = {
 's2-hsie-y3-w37-l1': [pair_visual('Record','title, creator, date, where','Paraphrase','own words and name the source','A source record and paraphrase.','Record every source.'),
  pair_visual('Reliable','named maker, records','Unknown','comment with no author','Reliable and unclear sources.','Ask who made it and when.')],
 's2-hsie-y3-w37-l2': [pair_visual('Fact','opened in 1962','Opinion','the old one was friendlier','Fact and opinion.','Facts can be traced to sources.'),
  pair_visual('Pattern','more services after 2000','Gap','no dates for the roof','Patterns and gaps.','Gaps show what to ask next.')],
 's2-hsie-y3-w38-l1': [pair_visual('Strong','names two photos and an interview','Weak','"it is better now"','Strong and weak conclusions.','Name the evidence.'),
  pair_visual('Limit','only two photos','Next','new question to ask','Limits and next questions.','Say how sure you are.')],
 's2-hsie-y3-w38-l2': [pair_visual('Slides','title, sources, visual, conclusion','Too much','five paragraphs','Presentation structure.','Three short sentences at most.'),
  pair_visual('Labelled','timeline with six dates','Sources','list on the last slide','Visual and source list.','Label every visual.')],
 's2-hsie-y3-w39-l1': [pair_visual('Star','loud and clear voice','Wish','look up more','Two stars and a wish.','Be specific.'),
  pair_visual('Pace','slow, pause at each slide','Time','three minutes','Pace and timing.','Rehearse aloud.')],
 's2-hsie-y3-w39-l2': [pair_visual('Question','What was the evidence?','Answer','Photo two from 2005','Question and evidence answer.','Answer from evidence.'),
  pair_visual('Unsure','I do not know yet','Next','ask the librarian','An honest reply.','Never make up an answer.')],
 's2-hsie-y3-w40-l1': [pair_visual('Strength','source records, week 37','Goal','better follow-up questions','Strength and goal with evidence.','Point to named work.'),
  pair_visual('Proud','one piece and a reason','Units','four pieces from four units','Choosing pieces to reflect on.','Cover different units.')],
 's2-hsie-y3-w40-l2': [pair_visual('Eight units','history to inquiry','Thank','librarian, educators','Reviewing the year and thanking helpers.','Name each helper.'),
  pair_visual('Goal','one for next year','Letter','shared with an adult','A year review letter.','Be honest about achievements.')],
}

def create():
    assert len(LESSONS) == 8
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
