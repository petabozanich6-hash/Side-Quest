"""Shared D1 Written Core bundle assembler for Stage 2 program lessons."""
from episode_support import room_episode

CURRICULUM_SOURCE = {
    'english': 'https://curriculum.nsw.edu.au/learning-areas/english/english-k-10-2022/outcomes',
    'mathematics': 'https://curriculum.nsw.edu.au/learning-areas/mathematics/mathematics-k-10-2022/outcomes',
}


def esc(t):
    return (t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;'))


def pair_visual(left_title, left_text, right_title, right_text, alt, caption):
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 150">'
        f'<rect x="10" y="12" width="310" height="126" rx="14" fill="#fff4ea" stroke="#b87445"/>'
        f'<rect x="340" y="12" width="310" height="126" rx="14" fill="#e8f5ed" stroke="#297a61"/>'
        f'<g font-size="16" fill="#263948">'
        f'<text x="28" y="42">{esc(left_title)}</text>'
        f'<text x="28" y="78">{esc(left_text[:42])}</text>'
        f'<text x="358" y="42">{esc(right_title)}</text>'
        f'<text x="358" y="78">{esc(right_text[:42])}</text>'
        f'</g></svg>')
    return dict(svg=svg, alt=alt, caption=caption)


def expand_stages(rule, model, prompt, answer, pitfall, subject='english'):
    if subject == 'mathematics':
        return [
            ('Understand and model', rule, model, prompt, answer, pitfall),
            ('Show the working',
             'Make the method visible: name the values, places or steps you used and say why that step is valid.',
             model + ' Look at each number, place or distance that carries the method.',
             'Write the key numbers from the model and say what each one represents in the method.',
             'The most useful working names the quantities and the reason for each step, not only the final answer.',
             'Writing only the final answer without working does not show the method.'),
            ('Test a misconception',
             'Use an intentionally incorrect attempt as a comparison. Name its specific mathematical error, then show the corrected working.',
             pitfall + ' Here is a more productive model: ' + model,
             'Describe why the warned-against approach gives the wrong value or meaning, then write corrected working.',
             answer,
             'Changing the answer without repairing the method does not fix the error. ' + pitfall),
            ('Transfer to a new problem',
             'Use the method on new numbers or a new context, not a copy of the worked example. Review accuracy and units or places.',
             rule + ' Now choose different numbers to show you can transfer the method.',
             'Solve one fresh problem that uses the same skill and write a short reason for your answer.',
             'The new problem should use the same method as the model, but contain different numbers.',
             'Repeating the worked example cannot show transfer to new numbers.'),
        ]
    return [
        ('Understand and model', rule, model, prompt, answer, pitfall),
        ('Explain the evidence',
         'Make your choice visible: select the exact detail in the model that demonstrates the skill, and describe what it does for a reader.',
         model + ' Think about how this word or relationship creates meaning.',
         'Underline or quote one precise detail in the model and explain its effect.',
         'The most useful evidence is a specific choice in the example, followed by an explanation of the effect on meaning.',
         'Saying a choice is good without naming the actual detail does not show understanding.'),
        ('Test a misconception',
         'Use an intentionally incorrect attempt as a comparison. Name its specific error, then show how a revision fixes that error.',
         pitfall + ' Here is a more productive model: ' + model,
         'Describe why the warned-against approach would weaken your work, then write a corrected version.',
         answer,
         'A superficial change in length or appearance does not repair meaning. ' + pitfall),
        ('Transfer to an independent example',
         'Use the method on a new topic, not a reworded copy of the example. Review the result for accuracy and reader clarity.',
         rule + ' Now choose different people, facts or text to show you can transfer the idea.',
         'Make one fresh example demonstrating the skill and explain your main choice.',
         'The new example should meet the same purpose as the model, but contain original material.',
         'Repeating the worked example cannot show transfer to new content.'),
    ]


def default_visuals(seed, rule, model):
    left = rule[:40]
    right = model[:40]
    return [
        pair_visual('Teaching focus', left, 'Worked example', right,
                    f'Teaching focus for {seed} beside a short worked-example excerpt.',
                    'Compare the rule with the exact wording that demonstrates it.'),
        pair_visual('Guided prompt', 'Write your own attempt first', 'Then compare', 'Read the comparison carefully',
                    f'Guided attempt-then-compare organiser for {seed}.',
                    'Complete the prompt before reading the comparison comments.'),
    ]


def build_from_spec(base, spec, visuals=None, subject='english'):
    """spec keys: seed_key, code, principle, model, guided, feedback, misconception, independent; optional vocab list."""
    rule = spec['principle']
    model = spec['model']
    prompt = spec['guided']
    answer = spec['feedback']
    pitfall = spec['misconception']
    task = spec['independent']
    code = spec['code']
    subject = spec.get('subject') or subject
    if subject == 'mathematics':
        vocab = spec.get('vocab') or ['place value', 'working', 'method', 'accuracy']
    else:
        vocab = spec.get('vocab') or ['this skill', 'evidence', 'transfer', 'revision']
    stages = expand_stages(rule, model, prompt, answer, pitfall, subject=subject)
    visuals = list(visuals or default_visuals(spec['seed_key'], rule, model))

    l = {k: v for k, v in base.items() if k in (
        'seed_key', 'stage', 'learning_area', 'year_level', 'week', 'lesson_number',
        'lesson_role', 'unit_title', 'unit_number', 'week_in_unit', 'subject')}
    criteria = [
        f'I can use {vocab[0]} with a specific example from this lesson.',
        f'I can identify {vocab[1]} and explain why it matters.',
        f'I can practise {vocab[2]} independently on a new prompt.',
        f'I can notice {vocab[3]} needs and correct a likely mistake.',
    ]
    materials = (['Paper or typed answer space', 'Pencil', 'Optional: place-value chart or number line']
                 if subject == 'mathematics' else ['Paper or typed answer space', 'Pencil'])
    source_note = (
        'Proposed Stage 2 NESA mathematics alignment using verified outcome code wording where recorded in lesson-pipeline/sources; content-point mapping remains pending.'
        if subject == 'mathematics' else
        'Proposed Stage 2 NESA alignment; verify content points before acceptance.')
    l.update(
        title=base['title'], child_mission=rule, learning_intention=rule,
        success_criteria=criteria, duration_minutes=55,
        materials=materials,
        outcome_codes=[code], review_status='unreviewed',
        source_note=source_note,
        **{'pass': 1, 'pass_mark': 0.9}, coming_soon=None)

    teach = []; evidence = []
    for i, (heading, idea, demonstration, attempt, fb, error) in enumerate(stages):
        if subject == 'mathematics':
            why = ('This helps the learner choose methods based on place value, quantity and accurate working, '
                   'rather than guessing digits by shape alone. Keep every step justified.')
            how = (
                'Read the worked example and name the places, values or distances that carry the method. '
                'Before looking at the correction, make your own attempt using the exact question provided. '
                'Compare your working with the feedback: did you use the same skill and show your reasoning? '
                'If a digit or place is uncertain, identify what would have to be regrouped or counted again. '
                'One deliberate, justified revision is more useful than writing a longer answer.')
            wrong_opts = ['A calculation unrelated to the numbers given.', 'An answer copied without understanding.',
                          'A guess with no working.']
            fix = 'Correct the value or method, not just the appearance of the digits.'
            ep = [
                ('pip', 'I can see the example, but I am not sure which number or place matters most.'),
                ('juno', 'Name the places, values or distances that carry the method before you decide.'),
                ('pip', 'I will try the prompt myself, then compare with the feedback.'),
                ('juno', 'Pause here. Use this model: ' + model[:120] + ' Then write your own working.', True),
            ]
        else:
            why = ('This helps the learner make decisions based on specific language evidence, '
                   'rather than guess or copy someone else. Keep the meaning accurate and explain the choice.')
            how = (
                'Read the original example and locate the words or actions that support the idea. '
                'Before looking at the correction, make your own attempt using the exact question provided. '
                'Check your response against the feedback: did you address the same skill and show your reasoning? '
                'If a detail is uncertain, identify what would have to be checked. '
                'One deliberate, justified revision is more useful than making the answer longer.')
            wrong_opts = ['A claim unrelated to the text.', 'An answer copied without understanding.',
                          'A guess with no explanation.']
            fix = 'Correct the meaning, not just the appearance.'
            ep = [
                ('pip', 'I can see the example, but I am not sure which detail matters most.'),
                ('juno', 'Name the exact words or actions that carry the meaning before you decide.'),
                ('pip', 'I will try the prompt myself, then compare with the feedback.'),
                ('juno', 'Pause here. Use this model: ' + model[:120] + ' Then write your own attempt.', True),
            ]
        explain = idea + '\n\nWHY IT MATTERS\n' + why + '\n\nHOW TO WORK\n' + how
        teach.append(dict(
            title=heading, icon='📖', explain=explain,
            example='WORKED MODEL\n' + demonstration + '\n\nTRY FIRST\n' + attempt + '\n\nFEEDBACK\n' + fb,
            notice=error + ' ' + fix,
            check=dict(
                question='What should you demonstrate in this teaching stage?',
                options=[idea, *wrong_opts],
                correct_index=0,
                explanation=idea + (' Supported working follows the actual numbers and purpose of the task.'
                                    if subject == 'mathematics' else
                                    ' A supported explanation follows the actual words and purpose of the task.'))))
        evidence.append(dict(
            rule=idea, why=why, model=demonstration, misconception=error,
            fix=fix, guided_attempt=attempt, feedback=fb))

    teach[0]['visual'] = [visuals[0]]
    teach[1]['visual'] = [visuals[1]]
    teach[0]['visual_before'] = [room_episode('Talk through the first model', ep)]

    l['teach_steps'] = teach
    l['worked_visuals'] = visuals
    if subject == 'mathematics':
        l['worked_example'] = 'WORK THROUGH THIS\n' + model + '\n\nWrite what makes this example accurate, naming the places, values or distances used.'
        l['guided_practice'] = 'PRACTISE BEFORE READING THE FEEDBACK\n' + prompt + '\n\nFEEDBACK\n' + answer + '\n\nWATCH FOR\n' + pitfall
        l['independent_task'] = 'INDEPENDENT EVIDENCE\n' + task + '\n\nWrite a short reflection naming one step you corrected and why.'
        l['response_prompt'] = 'Include your independent working and reflection, with reasons where requested.'
        distractors = [
            'Ignore place value and read digits from left to right as ones only.',
            'Copy the model numbers and call that independent work.',
            'Treat a missing zero as if it does not change the value.',
            'Skip the working because the first guess looked neat.']
        sa1_q = 'Solve a fresh problem that uses the central skill. Show working and name the places or values that matter.'
        sa2_q = 'Name one likely calculation or place-value error, correct it and say why the correction works.'
        sa1_guide = 'Require independently produced relevant working with accurate reasoning and named places or values.'
        sa2_guide = 'Require an actual misconception plus corrected working and a method-linked reason.'
        hint_set = [
            ('Today you will practise ' + vocab[0] + '.',
             'Read the mission before you start calculating.',
             'Keep the place or unit you are working with in view.'),
            ('Read the stage title and find the worked model.',
             'Name one exact place, value or distance before you decide.',
             'Try the small prompt before opening the comparison.'),
            ('Return to the model and list the key numbers.',
             'Say what each number represents in the method.',
             'A final answer alone is weaker than labelled working.'),
            ('Compare a weak attempt with stronger working.',
             'Change the value or method, not only how neat it looks.',
             'Name the mistake you are repairing.'),
            ('Choose fresh numbers that still use the same skill.',
             'Write one reason in your own words.',
             'Do not retype the worked model as your answer.'),
            ('Study how the first demonstration is built.',
             'Point to the place or distance that carries the method.',
             'Then write the reason without copying every sentence.'),
            ('Attempt the guided prompt without looking ahead.',
             'Afterwards, compare your working with the feedback.',
             'Adjust anything that does not match the method.'),
            ('Follow every part of the independent instructions.',
             'Include original working and a short reason.',
             'Save work that shows the skill on new numbers.'),
            ('Read every option before you choose.',
             'Eliminate answers that ignore place value or working.',
             'Prefer accurate method over a guess that merely looks neat.'),
            ('Confirm that your working and reason are both present.',
             'Proofread digits, places and operation signs.',
             'Make sure the final evidence matches the lesson purpose.'),
        ]
        extension = 'Apply the same method to a larger number or a new context, then compare two solution paths for accuracy.'
    else:
        l['worked_example'] = 'WORK THROUGH THIS\n' + model + '\n\nExplain what makes this example accurate and effective, identifying its specific wording.'
        l['guided_practice'] = 'PRACTISE BEFORE READING THE FEEDBACK\n' + prompt + '\n\nFEEDBACK\n' + answer + '\n\nCHECK\n' + pitfall
        l['independent_task'] = 'INDEPENDENT EVIDENCE\n' + task + '\n\nWrite a short reflection describing one specific revision you made and why.'
        l['response_prompt'] = 'Include your independent task and reflection, with explanations where requested.'
        distractors = [
            'Ignore the words and invent a more exciting event.',
            'Copy the model word-for-word and call that independent work.',
            'Treat a missing detail as a stated fact.',
            'Skip the prompt because the first idea sounded good.']
        sa1_q = 'Produce a fresh example demonstrating the central skill, explaining the particular words or evidence that make it work.'
        sa2_q = 'Name one likely error in using this skill, correct it and explain why the correction helps.'
        sa1_guide = 'Require independently produced relevant work with accurate reasoning and a specific supporting detail.'
        sa2_guide = 'Require an actual misconception plus corrected example and purpose-linked explanation.'
        hint_set = [
            ('Today you will practise ' + vocab[0] + '.',
             'Read the mission before you start writing or speaking.',
             'Keep the audience and purpose in mind as you work.'),
            ('Read the stage title and find the worked model.',
             'Name one exact word or action before you decide.',
             'Try the small prompt before opening the comparison.'),
            ('Return to the model and underline one useful detail.',
             'Say what that detail helps a reader understand.',
             'A vague compliment is weaker than quoted evidence.'),
            ('Compare a weak attempt with a stronger revision.',
             'Change meaning or accuracy, not only length.',
             'Name the mistake you are repairing.'),
            ('Choose a fresh topic that still uses the same skill.',
             'Explain one decision in your own words.',
             'Do not retype the worked model as your answer.'),
            ('Study how the first demonstration is built.',
             'Point to the wording that carries the meaning.',
             'Then explain the choice without copying every sentence.'),
            ('Attempt the guided prompt without looking ahead.',
             'Afterwards, compare your reason with the feedback.',
             'Adjust anything that does not match the evidence.'),
            ('Follow every part of the independent instructions.',
             'Include an original response and a short reason.',
             'Save work that shows the skill on new content.'),
            ('Read every option before you choose.',
             'Eliminate answers that ignore the example.',
             'Prefer evidence over wording that merely sounds clever.'),
            ('Check that your response and reason are both present.',
             'Proofread names, sequence and punctuation.',
             'Make sure the final evidence matches the lesson purpose.'),
        ]
        extension = 'Apply the same strategy to an unfamiliar topic or audience, then compare the effect of two different choices.'

    q = []
    for i, st in enumerate(stages):
        q.append(dict(
            type='multiple_choice',
            question=f'Which idea is taught in the stage "{st[0]}"?',
            options=[st[1], st[5], distractors[i % 4], distractors[(i + 1) % 4]],
            correct_index=0,
            explanation=st[1] + ' The other choices avoid explaining the actual strategy.'))
    for i, st in enumerate(stages):
        q.append(dict(
            type='multiple_choice',
            question=f'After trying "{st[3][:80]}", which feedback is most useful?',
            options=[st[4], st[5], 'Any answer is equally supported.', 'There is no need to compare your attempt.'],
            correct_index=0,
            explanation=st[4] + (' Useful feedback uses the original numbers and method.'
                                 if subject == 'mathematics' else
                                 ' Useful feedback uses the original evidence or language point.')))
    sample1 = 'Original demonstration: ' + model
    sample2 = 'Common error: ' + pitfall + ' Correction: ' + answer
    q += [
        dict(type='short_answer', question=sa1_q, sample_answer=sample1,
             marking_guide=sa1_guide,
             explanation='Independent evidence, not repetition of the worked model, demonstrates the skill.'),
        dict(type='short_answer', question=sa2_q, sample_answer=sample2,
             marking_guide=sa2_guide,
             explanation=('A correction needs to change value or method, not just make the working longer.'
                          if subject == 'mathematics' else
                          'A correction needs to change meaning or accuracy, not just make the text longer.')),
    ]
    l['quiz'] = q
    l['parent_notes'] = (
        'Parent: Marking guidance for the independent task: ' + task[:220] +
        ' Accept equivalent original responses that show the same skill.\n\n'
        'Parent: Written model 1: ' + sample1 + '\n\n'
        'Parent: Written model 2: ' + sample2 + '\n\n'
        'Parent: Likely misconception: ' + pitfall +
        ' Keep sample answers out of the child role.')
    l['evidence_instructions'] = 'Save the independent response, specific revisions and both short-answer explanations; record oral evidence for speaking tasks.'
    l['offline_alternative'] = 'Use paper and pencil to complete the original task, then retain a photograph or short parent observation as evidence.'
    l['extension'] = extension

    keys = ['accept', 'teach0', 'teach1', 'teach2', 'teach3', 'learn', 'guided', 'write', 'quiz', 'submit']
    l['stage_hints'] = {k: list(v) for k, v in zip(keys, hint_set)}
    for key in ('resources', 'word_challenges', 'sort_activity', 'suspense_builder', 'planner_fields',
                'planner_title', 'planner_intro', 'spelling', 'spelling_focus', 'hoard_words',
                'follow_up_challenges', 'printable_resource', 'interactive_activities', 'explicit_teaching'):
        l[key] = None

    return dict(
        architecture='d1-worker', lesson=l,
        curriculum=[dict(
            code=code,
            source=CURRICULUM_SOURCE.get(subject, CURRICULUM_SOURCE['english']),
            verification_status='pending', lesson_evidence=rule,
            scope_limit='Single lesson: partial evidence. Cross-check existing card mapping and NESA content point. Official wording for MA2-RN-01 is recorded in lesson-pipeline/sources/nesa-ma2-rn-01.json where applicable.')],
        requirements=dict(
            teaching=evidence,
            practice=dict(model_inputs=[model], guided_inputs=[prompt], independent_inputs=[task]),
            visuals=[dict(alt=v['alt'], teaches=v['caption']) for v in visuals],
            review_questions=[
                'Check original Coming Soon outcome mapping against current NESA.',
                'Educationally review worked example, independent prompts and all 10 quiz answers.',
                'Verify Stage 2 age suitability and child/parent API answer privacy.',
                'Verify written learner progress saved and restored.',
                'Confirm diagrams teach this lesson idea rather than a generic process.',
            ]))
