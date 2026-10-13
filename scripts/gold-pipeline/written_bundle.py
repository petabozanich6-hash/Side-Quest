"""Shared D1 Written Core bundle assembler for Stage 2 program lessons."""
from episode_support import room_episode
from assessment_quiz import build_skill_quiz, shuffle_teach_check

CURRICULUM_SOURCE = {
    'english': 'https://curriculum.nsw.edu.au/learning-areas/english/english-k-10-2022/outcomes',
    'mathematics': 'https://curriculum.nsw.edu.au/learning-areas/mathematics/mathematics-k-10-2022/outcomes',
    'science': 'https://curriculum.nsw.edu.au/learning-areas/science/science-and-technology-k-6-2024/outcomes',
    'hsie': 'https://curriculum.nsw.edu.au/learning-areas/hsie/hsie-k-6-2024/outcomes',
    'pdhpe': 'https://curriculum.nsw.edu.au/learning-areas/pdhpe/pdhpe-k-6-2024/outcomes',
    'arts': 'https://curriculum.nsw.edu.au/learning-areas/creative-arts/creative-arts-k-6-2024/outcomes',
    'technology': 'https://curriculum.nsw.edu.au/learning-areas/tas/technology-mandatory-7-8-2019/outcomes',
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
    if subject == 'pdhpe':
        return [
            ('Understand and demonstrate', rule, model, prompt, answer, pitfall),
            ('Show the reasoning',
             'Make the PDHPE idea visible: name the body cue, safety rule or wellbeing strategy you used and say why it helps you or others.',
             model + ' Look at each cue, rule or choice that carries the idea.',
             'List the key cues, rules or choices from the example and say what each one does for safety, health or relationships.',
             'The most useful reasoning names the cue, rule or strategy and the reason it helps, not only a label such as "good".',
             'Writing only a final label without a reason does not show PDHPE thinking.'),
            ('Test a misconception',
             'Use an intentionally unsafe or unhelpful choice as a comparison. Name the specific PDHPE error, then show the safer or more respectful choice.',
             pitfall + ' Here is a more helpful example: ' + model,
             'Describe why the warned-against choice does not work, then write a safer, kinder or healthier choice with a reason.',
             answer,
             'Changing the wording without changing the choice does not fix the error. ' + pitfall),
            ('Transfer to a new situation',
             'Use the same PDHPE idea in a new place, game or situation, not a copy of the example. Review safety, fairness and inclusion.',
             rule + ' Now choose a different situation to show you can transfer the idea.',
             'Describe or practise one fresh situation that uses the same skill and write a short reason for your choice.',
             'The new situation should use the same PDHPE idea as the example, but happen in a different place or with different people.',
             'Repeating the worked example cannot show transfer to a new situation.'),
        ]
    if subject == 'arts':
        return [
            ('Understand and demonstrate', rule, model, prompt, answer, pitfall),
            ('Show the artistic choice',
             'Make the arts idea visible: name the element, technique or performance choice you used and say what effect it creates.',
             model + ' Look at each line, sound, movement or role choice that carries the idea.',
             'List the key artistic choices from the example and say what each one does for the audience or artwork.',
             'The most useful response names the element or technique and its effect, not only “it looks nice”.',
             'Writing only a final praise word without naming a choice does not show arts thinking.'),
            ('Test a misconception',
             'Use an intentionally weak or disrespectful arts choice as a comparison. Name the specific error, then show a clearer or more respectful choice.',
             pitfall + ' Here is a more helpful example: ' + model,
             'Describe why the warned-against choice weakens the work, then write a stronger choice with a reason.',
             answer,
             'Changing the decoration without changing the artistic idea does not fix the error. ' + pitfall),
            ('Transfer to a new artwork or performance',
             'Use the same arts idea in a new artwork, song, drama or dance, not a copy of the example. Review clarity, safety and respectful practice.',
             rule + ' Now choose a different subject or piece to show you can transfer the idea.',
             'Make or describe one fresh example that uses the same skill and write a short reason for your main choice.',
             'The new example should use the same arts idea as the model, but with different content or material.',
             'Repeating the worked example cannot show transfer to a new artwork or performance.'),
        ]
    if subject in ('science', 'hsie', 'technology'):
        idea_word = 'science' if subject == 'science' else ('technology' if subject == 'technology' else 'HSIE')
        transfer_name = 'investigation' if subject in ('science', 'technology') else 'inquiry'
        return [
            ('Understand and model', rule, model, prompt, answer, pitfall),
            ('Show the evidence',
             f'Make the {idea_word} idea visible: name the observation, source or example you used and say why it supports the claim.',
             model + ' Look at each observation, source detail or example that carries the idea.',
             'List the key observations, sources or steps from the model and say what each one shows.',
             'The most useful record names the evidence and the reason it supports the claim, not only a label.',
             f'Writing only a final label without evidence does not show {idea_word} thinking.'),
            ('Test a misconception',
             f'Use an intentionally incorrect claim as a comparison. Name its specific {idea_word} error, then show the corrected evidence-based claim.',
             pitfall + ' Here is a more productive model: ' + model,
             'Describe why the warned-against claim fails, then write a corrected claim with evidence.',
             answer,
             'Changing the wording without repairing the evidence does not fix the error. ' + pitfall),
            (f'Transfer to a new {transfer_name}',
             f'Use the same {idea_word} idea on a new place, person, source or context, not a copy of the worked example. Review accuracy of evidence.',
             rule + ' Now choose a different example to show you can transfer the idea.',
             'Inquire into or describe one fresh example that uses the same skill and write a short evidence-based reason.',
             f'The new example should use the same {idea_word} idea as the model, but contain different evidence.',
             'Repeating the worked example cannot show transfer to new evidence.'),
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
    elif subject == 'science':
        vocab = spec.get('vocab') or ['observation', 'evidence', 'test', 'accuracy']
    elif subject == 'hsie':
        vocab = spec.get('vocab') or ['community', 'source', 'place', 'respect']
    elif subject == 'pdhpe':
        vocab = spec.get('vocab') or ['movement', 'health', 'safety', 'respect']
    elif subject == 'arts':
        vocab = spec.get('vocab') or ['element', 'technique', 'effect', 'audience']
    elif subject == 'technology':
        vocab = spec.get('vocab') or ['design', 'criteria', 'safety', 'evaluate']
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
    if subject == 'mathematics':
        materials = ['Paper or typed answer space', 'Pencil', 'Optional: place-value chart or number line']
    elif subject == 'science':
        materials = ['Paper or typed answer space', 'Pencil', 'Optional: safe everyday objects for observation']
    elif subject == 'hsie':
        materials = ['Paper or typed answer space', 'Pencil', 'Optional: local map, photo or interview notes']
    elif subject == 'pdhpe':
        materials = ['Paper or typed answer space', 'Pencil',
                     'Clear, safe movement space with an adult nearby for any physical activity',
                     'Optional: soft ball, cushion or water bottle']
    elif subject == 'arts':
        materials = ['Paper or typed answer space', 'Pencil',
                     'Optional: scrap paper, crayons, safe classroom instruments or clear movement space with an adult nearby']
    elif subject == 'technology':
        materials = ['Paper or typed answer space', 'Pencil',
                     'Optional: safe classroom tools/materials under teacher supervision',
                     'Device only when the lesson requires digital work']
    else:
        materials = ['Paper or typed answer space', 'Pencil']
    if subject == 'mathematics':
        source_note = ('Proposed Stage 2 NESA mathematics alignment using verified outcome code wording '
                       'where recorded in lesson-pipeline/sources; content-point mapping remains pending.')
    elif subject == 'science':
        source_note = ('Proposed Stage 2 NESA Science and Technology alignment using catalogue outcome codes; '
                       'content-point mapping remains pending.')
    elif subject == 'hsie':
        source_note = ('Proposed Stage 2 NESA HSIE alignment using catalogue outcome codes (HS2-*); '
                       'content-point mapping and local First Nations protocols remain pending human review.')
    elif subject == 'pdhpe':
        source_note = ('Proposed Stage 2 NESA PDHPE alignment using catalogue outcome codes (PH2-*); '
                       'content-point mapping remains pending human review. Physical activities are optional, '
                       'adult-supervised and adaptable; no child is required to share personal details.')
    elif subject == 'arts':
        source_note = ('Proposed Stage 2 NESA Creative Arts alignment using catalogue outcome codes (CA2-*); '
                       'content-point mapping remains pending. First Nations arts content requires local '
                       'Aboriginal educator or Custodian guidance before acceptance; do not invent sacred designs.')
    elif subject == 'technology':
        source_note = ('Proposed Stage 4 NESA Technology Mandatory alignment using catalogue outcome codes (TM4-*); '
                       'content-point mapping remains pending. Practical work requires teacher safety supervision.')
    else:
        source_note = 'Proposed Stage 2 NESA alignment; verify content points before acceptance.'
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
        elif subject in ('science', 'technology'):
            why = ('This helps the learner base claims on observation, fair tests and design evidence, '
                   'rather than guessing from a picture alone. Keep every claim linked to what was seen, measured or tested against criteria.')
            how = (
                'Read the worked example and name the observations, properties, criteria or test steps that carry the idea. '
                'Before looking at the correction, make your own attempt using the exact question provided. '
                'Compare your record with the feedback: did you use the same skill and show your evidence? '
                'If a result is uncertain, identify what would have to be observed or tested again. '
                'One deliberate, evidence-based revision is more useful than writing a longer answer. '
                'For practical technology work, follow teacher safety rules for tools, food and devices.')
            wrong_opts = ['A claim unrelated to the observation, test or criteria.', 'An answer copied without understanding.',
                          'A guess with no evidence.']
            fix = 'Correct the claim, criteria use or method, not just the neatness of the diagram.'
            ep = [
                ('pip', 'I can see the example, but I am not sure which observation or criterion matters most.'),
                ('juno', 'Name the observations, criteria or test steps that carry the idea before you decide.'),
                ('pip', 'I will try the prompt myself, then compare with the feedback.'),
                ('juno', 'Pause here. Use this model: ' + model[:120] + ' Then write your own evidence.', True),
            ]
        elif subject == 'hsie':
            why = ('This helps the learner base claims on sources, places and respectful community knowledge, '
                   'rather than guessing from a single picture. Keep every claim linked to evidence.')
            how = (
                'Read the worked example and name the sources, map features or community examples that carry the idea. '
                'Before looking at the correction, make your own attempt using the exact question provided. '
                'Compare your record with the feedback: did you use the same skill and show your evidence? '
                'If a detail is uncertain, identify what source you would need next. '
                'One deliberate, evidence-based revision is more useful than writing a longer answer.')
            wrong_opts = ['A claim unrelated to the source or place.', 'An answer copied without understanding.',
                          'A guess with no evidence.']
            fix = 'Correct the claim or use of sources, not just the neatness of the poster.'
            ep = [
                ('pip', 'I can see the example, but I am not sure which source or place detail matters most.'),
                ('juno', 'Name the sources, map features or community examples that carry the idea before you decide.'),
                ('pip', 'I will try the prompt myself, then compare with the feedback.'),
                ('juno', 'Pause here. Use this model: ' + model[:120] + ' Then write your own evidence.', True),
            ]
        elif subject == 'pdhpe':
            why = ('This helps the learner make safe, healthy and respectful choices using clear cues and reasons, '
                   'rather than guessing or copying others. Every choice keeps bodies safe and includes everyone.')
            how = (
                'Read the worked example and name the cues, rules or choices that carry the idea. '
                'Before looking at the correction, make your own attempt using the exact question provided. '
                'For any movement, use a clear space, ask an adult to be nearby, move at your own comfortable level '
                'and stop if anything hurts or feels unsafe. You may always choose a gentler version or only describe the movement. '
                'One deliberate, reasoned change is more useful than a longer answer.')
            wrong_opts = ['A choice unrelated to safety, health or respect.', 'An answer copied without understanding.',
                          'A guess with no reason.']
            fix = 'Change the choice or strategy, not just the wording.'
            ep = [
                ('pip', 'I can see the example, but I am not sure which cue or rule matters most.'),
                ('juno', 'Name the cues, rules or choices that keep everyone safe and included before you decide.'),
                ('pip', 'I will try the prompt myself, then compare with the feedback.'),
                ('juno', 'Pause here. Use this example: ' + model[:120] + ' Then write your own reasons.', True),
            ]
        elif subject == 'arts':
            why = ('This helps the learner make intentional visual, music, drama or dance choices and name their effect, '
                   'rather than saying an artwork is simply “nice”. Keep every claim linked to an element or technique.')
            how = (
                'Read the worked example and name the elements, techniques or performance choices that carry the idea. '
                'Before looking at the correction, make your own attempt using the exact question provided. '
                'For movement or instruments, use a clear space, ask an adult to be nearby and stop if anything feels unsafe. '
                'You may always describe a choice instead of performing it. '
                'One deliberate artistic choice with a named effect is more useful than a longer praise sentence.')
            wrong_opts = ['A comment that only says it looks nice with no element named.',
                          'An answer copied without understanding.',
                          'A guess with no artistic reason.']
            fix = 'Name the element or technique and its effect, not just decoration.'
            ep = [
                ('pip', 'I can see the example, but I am not sure which artistic choice matters most.'),
                ('juno', 'Name the element, technique or performance choice and the effect it creates before you decide.'),
                ('pip', 'I will try the prompt myself, then compare with the feedback.'),
                ('juno', 'Pause here. Use this example: ' + model[:120] + ' Then write your own artistic reason.', True),
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
        check_expl = idea + (
            ' Supported working follows the actual numbers and purpose of the task.'
            if subject == 'mathematics' else
            ' Supported records follow the actual observations, criteria and purpose of the task.'
            if subject in ('science', 'technology') else
            ' Supported records follow the actual sources and purpose of the task.'
            if subject == 'hsie' else
            ' Supported choices follow the actual cues, rules and purpose of the task.'
            if subject == 'pdhpe' else
            ' Supported responses name the element or technique and its effect.'
            if subject == 'arts' else
            ' A supported explanation follows the actual words and purpose of the task.')
        teach.append(dict(
            title=heading, icon='📖', explain=explain,
            example='WORKED MODEL\n' + demonstration + '\n\nTRY FIRST\n' + attempt + '\n\nFEEDBACK\n' + fb,
            notice=error + ' ' + fix,
            check=shuffle_teach_check(
                f'Which choice best shows accurate use of this idea about {vocab[0]}?',
                idea, wrong_opts, check_expl, spec['seed_key'], i)))
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
    elif subject in ('science', 'technology'):
        domain = 'technology/design' if subject == 'technology' else 'science'
        l['worked_example'] = 'WORK THROUGH THIS\n' + model + '\n\nWrite what makes this example accurate, naming the observations, criteria, properties or test steps used.'
        l['guided_practice'] = 'PRACTISE BEFORE READING THE FEEDBACK\n' + prompt + '\n\nFEEDBACK\n' + answer + '\n\nWATCH FOR\n' + pitfall
        l['independent_task'] = 'INDEPENDENT EVIDENCE\n' + task + '\n\nWrite a short reflection naming one observation, criterion or step you corrected and why.'
        l['response_prompt'] = 'Include your independent evidence and reflection, with reasons where requested.'
        distractors = [
            'Ignore the observation or criteria and invent a more exciting result.',
            'Copy the model objects and call that independent work.',
            'Treat a missing measurement or test as if it were recorded.',
            'Skip the fair-test or criteria idea because the first guess looked neat.']
        sa1_q = f'Investigate, design or describe a fresh example that uses the central {domain} skill. Show evidence and name the observations or criteria that matter.'
        sa2_q = f'Name one likely {domain} misconception for this topic, correct it and say why the correction works.'
        sa1_guide = 'Require independently produced relevant evidence with accurate reasoning and named observations or criteria.'
        sa2_guide = 'Require an actual misconception plus corrected claim and an evidence-linked reason.'
        hint_set = [
            ('Today you will practise ' + vocab[0] + '.',
             'Read the mission before you start observing, designing or testing.',
             'Keep the property, criterion or variable you are studying in view.'),
            ('Read the stage title and find the worked model.',
             'Name one exact observation, criterion or test step before you decide.',
             'Try the small prompt before opening the comparison.'),
            ('Return to the model and list the key observations or criteria.',
             'Say what each observation or criterion shows about the idea.',
             'A final label alone is weaker than recorded evidence.'),
            ('Compare a weak claim with stronger evidence.',
             'Change the claim or method, not only how neat the drawing looks.',
             'Name the mistake you are repairing.'),
            ('Choose a fresh object or context that still uses the same skill.',
             'Write one reason in your own words.',
             'Do not retype the worked model as your answer.'),
            ('Study how the first demonstration is built.',
             'Point to the observation, criterion or step that carries the idea.',
             'Then write the reason without copying every sentence.'),
            ('Attempt the guided prompt without looking ahead.',
             'Afterwards, compare your evidence with the feedback.',
             'Adjust anything that does not match the method.'),
            ('Follow every part of the independent instructions.',
             'Include original evidence and a short reason.',
             'Save work that shows the skill on new objects or data.'),
            ('Read every option before you choose.',
             'Eliminate answers that ignore observations, criteria or fair tests.',
             'Prefer accurate evidence over a guess that merely looks neat.'),
            ('Confirm that your evidence and reason are both present.',
             'Proofread labels, measurements and sequence of steps.',
             'Make sure the final evidence matches the lesson purpose.'),
        ]
        extension = f'Apply the same {domain} idea to a new object or material, then compare two pieces of evidence for strength.'
    elif subject == 'hsie':
        l['worked_example'] = 'WORK THROUGH THIS\n' + model + '\n\nWrite what makes this example accurate, naming the sources, places or community details used.'
        l['guided_practice'] = 'PRACTISE BEFORE READING THE FEEDBACK\n' + prompt + '\n\nFEEDBACK\n' + answer + '\n\nWATCH FOR\n' + pitfall
        l['independent_task'] = 'INDEPENDENT EVIDENCE\n' + task + '\n\nWrite a short reflection naming one source or idea you corrected and why.'
        l['response_prompt'] = 'Include your independent evidence and reflection, with reasons where requested.'
        distractors = [
            'Ignore the source and invent a more exciting story.',
            'Copy the model places and call that independent work.',
            'Treat a missing fact as if it were recorded in a source.',
            'Skip respectful protocols because the first idea looked neat.']
        sa1_q = 'Inquire into or describe a fresh example that uses the central skill. Show evidence and name the sources or places that matter.'
        sa2_q = 'Name one likely misconception for this HSIE topic, correct it and say why the correction works.'
        sa1_guide = 'Require independently produced relevant evidence with accurate reasoning and named sources or places.'
        sa2_guide = 'Require an actual misconception plus corrected claim and an evidence-linked reason.'
        hint_set = [
            ('Today you will practise ' + vocab[0] + '.',
             'Read the mission before you start mapping or using sources.',
             'Keep the place, people or source you are studying in view.'),
            ('Read the stage title and find the worked model.',
             'Name one exact source detail or place feature before you decide.',
             'Try the small prompt before opening the comparison.'),
            ('Return to the model and list the key evidence.',
             'Say what each source or place detail shows about the idea.',
             'A final label alone is weaker than recorded evidence.'),
            ('Compare a weak claim with stronger evidence.',
             'Change the claim or use of sources, not only how neat the poster looks.',
             'Name the mistake you are repairing.'),
            ('Choose a fresh place, person or source that still uses the same skill.',
             'Write one reason in your own words.',
             'Do not retype the worked model as your answer.'),
            ('Study how the first demonstration is built.',
             'Point to the source or place detail that carries the idea.',
             'Then write the reason without copying every sentence.'),
            ('Attempt the guided prompt without looking ahead.',
             'Afterwards, compare your evidence with the feedback.',
             'Adjust anything that does not match the method.'),
            ('Follow every part of the independent instructions.',
             'Include original evidence and a short reason.',
             'Save work that shows the skill on new sources or places.'),
            ('Read every option before you choose.',
             'Eliminate answers that ignore sources or respectful practice.',
             'Prefer accurate evidence over a guess that merely looks neat.'),
            ('Confirm that your evidence and reason are both present.',
             'Proofread names, places, dates and sequence.',
             'Make sure the final evidence matches the lesson purpose.'),
        ]
        extension = 'Apply the same HSIE idea to a new place or source, then compare two pieces of evidence for strength.'
    elif subject == 'pdhpe':
        l['worked_example'] = 'WORK THROUGH THIS\n' + model + '\n\nWrite what makes this example safe, healthy or respectful, naming the cues, rules or choices used.'
        l['guided_practice'] = 'PRACTISE BEFORE READING THE FEEDBACK\n' + prompt + '\n\nFEEDBACK\n' + answer + '\n\nWATCH FOR\n' + pitfall
        l['independent_task'] = 'INDEPENDENT EVIDENCE\n' + task + '\n\nWrite a short reflection naming one choice you changed and why. Any movement is optional, adult-supervised and can be done in a gentler way or described instead.'
        l['response_prompt'] = 'Include your independent evidence and reflection, with reasons where requested. Share only what you feel comfortable sharing.'
        distractors = [
            'Ignore the safety rule because the first idea looked exciting.',
            'Copy the example and call that independent work.',
            'Treat a skipped permission or safety step as if it did not matter.',
            'Leave someone out because the game felt easier that way.']
        sa1_q = 'Describe or practise a fresh situation that uses the central skill. Name the cues, rules or choices that keep everyone safe and included.'
        sa2_q = 'Name one likely misconception or unsafe choice for this topic, correct it and say why the correction is safer, healthier or more respectful.'
        sa1_guide = 'Require independently produced relevant evidence with accurate reasoning and named cues, rules or choices.'
        sa2_guide = 'Require an actual misconception plus a corrected choice and a reason linked to safety, health or respect.'
        hint_set = [
            ('Today you will practise ' + vocab[0] + '.',
             'Read the mission before you start moving or deciding.',
             'Keep your own safety and everyone\'s inclusion in view.'),
            ('Read the stage title and find the worked example.',
             'Name one exact cue, rule or choice before you decide.',
             'Think through the small prompt before opening the comparison.'),
            ('Return to the example and list the key cues.',
             'Say what each cue does for safety, health or friendship.',
             'A final label alone is weaker than a stated reason.'),
            ('Compare an unsafe or unkind choice with a better one.',
             'Change the choice or strategy, not only the words.',
             'Name the mistake you are repairing.'),
            ('Choose a fresh place, game or situation that still uses the same skill.',
             'Write one reason in your own words.',
             'Do not retype the worked example as your answer.'),
            ('Study how the first demonstration is built.',
             'Point to the cue or rule that carries the idea.',
             'Then write the reason without copying every sentence.'),
            ('Attempt the guided prompt without looking ahead.',
             'Afterwards, compare your reasons with the feedback.',
             'Adjust anything that does not keep everyone safe and included.'),
            ('Follow every part of the independent instructions.',
             'Include original reasons and a short reflection.',
             'Save work that shows the skill in a new situation.'),
            ('Read every option before you choose.',
             'Eliminate answers that ignore safety, consent or inclusion.',
             'Prefer a reasoned, respectful choice over one that merely looks fun.'),
            ('Confirm that your reasons and reflection are both present.',
             'Proofread names, steps and safety words.',
             'Make sure the final evidence matches the lesson purpose.'),
        ]
        extension = 'Apply the same idea to a new game or situation, then compare two choices for safety and inclusion.'
    elif subject == 'arts':
        l['worked_example'] = 'WORK THROUGH THIS\n' + model + '\n\nWrite what makes this example effective, naming the element, technique or performance choice and its effect.'
        l['guided_practice'] = 'PRACTISE BEFORE READING THE FEEDBACK\n' + prompt + '\n\nFEEDBACK\n' + answer + '\n\nWATCH FOR\n' + pitfall
        l['independent_task'] = 'INDEPENDENT EVIDENCE\n' + task + '\n\nWrite a short reflection naming one artistic choice you changed and why. Movement or instrument work is optional, adult-supervised and can be described instead.'
        l['response_prompt'] = 'Include your independent artwork or performance notes and reflection, with reasons where requested.'
        distractors = [
            'Say it looks nice with no element or technique named.',
            'Copy the example artwork or script and call that independent work.',
            'Invent a sacred First Nations design without permission or guidance.',
            'Skip safety or respectful audience behaviour because the piece felt exciting.']
        sa1_q = 'Make or describe a fresh artwork or performance that uses the central skill. Name the element or technique and its effect.'
        sa2_q = 'Name one likely arts misconception for this topic, correct it and say why the correction strengthens the work or shows respect.'
        sa1_guide = 'Require independently produced relevant work with a named element/technique and effect.'
        sa2_guide = 'Require an actual misconception plus corrected choice and an arts-linked reason.'
        hint_set = [
            ('Today you will practise ' + vocab[0] + '.',
             'Read the mission before you start making or performing.',
             'Keep the audience effect of your choice in view.'),
            ('Read the stage title and find the worked example.',
             'Name one exact element, technique or cue before you decide.',
             'Think through the small prompt before opening the comparison.'),
            ('Return to the example and list the key artistic choices.',
             'Say what each choice does for the artwork or audience.',
             'A final praise word alone is weaker than a named effect.'),
            ('Compare a weak choice with a stronger one.',
             'Change the element or technique, not only the decoration.',
             'Name the mistake you are repairing.'),
            ('Choose a fresh subject or piece that still uses the same skill.',
             'Write one reason in your own words.',
             'Do not retype the worked example as your answer.'),
            ('Study how the first demonstration is built.',
             'Point to the element or technique that carries the idea.',
             'Then write the reason without copying every sentence.'),
            ('Attempt the guided prompt without looking ahead.',
             'Afterwards, compare your reasons with the feedback.',
             'Adjust anything that does not name an effect clearly.'),
            ('Follow every part of the independent instructions.',
             'Include original work notes and a short reflection.',
             'Save work that shows the skill on new material.'),
            ('Read every option before you choose.',
             'Eliminate answers that ignore elements, safety or respectful practice.',
             'Prefer a named artistic reason over a guess that merely looks colourful.'),
            ('Confirm that your choice and reason are both present.',
             'Proofread element names and safety notes.',
             'Make sure the final evidence matches the lesson purpose.'),
        ]
        extension = 'Apply the same arts idea to a new artwork or performance, then compare two choices for clarity of effect.'
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

    # Prefer author-supplied assessment items when present; otherwise build skill quizzes.
    if isinstance(spec.get('assessment'), list) and len(spec['assessment']) >= 10:
        q = list(spec['assessment'])
    else:
        q = build_skill_quiz(
            spec['seed_key'], subject, rule, model, prompt, answer, pitfall, task, vocab,
            distractors, stages=stages)
    # Keep sa1_q/sa2_q locals available for parent notes even when quiz is rebuilt.
    sa_items = [item for item in q if item.get('type') == 'short_answer']
    sample1 = sa_items[0]['sample_answer'] if sa_items else ('Original demonstration: ' + model)
    sample2 = sa_items[1]['sample_answer'] if len(sa_items) > 1 else (
        'Common error: ' + pitfall + ' Correction: ' + answer)
    l['quiz'] = q
    l['parent_notes'] = (
        'Parent: Marking guidance for the independent task: ' + task[:220] +
        ' Accept equivalent original responses that show the same skill.\n\n'
        'Parent: Written model 1: ' + sample1 + '\n\n'
        'Parent: Written model 2: ' + sample2 + '\n\n'
        'Parent: Likely misconception: ' + pitfall +
        ' Keep sample answers out of the child role.'
        '\n\nParent: Short-answer focus 1: ' + (sa_items[0]['question'] if sa_items else sa1_q) +
        '\n\nParent: Short-answer focus 2: ' + (sa_items[1]['question'] if len(sa_items) > 1 else sa2_q) +
        '\n\nParent: Marking notes: ' + (sa_items[0].get('marking_guide') if sa_items else sa1_guide) +
        ' / ' + (sa_items[1].get('marking_guide') if len(sa_items) > 1 else sa2_guide) + '.')
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
