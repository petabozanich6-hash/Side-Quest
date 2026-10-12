#!/usr/bin/env python3
"""Year 4 PDHPE Written Core batch 07: w37-l1 through w40-l2 (8). Heart rate, habits, reflection."""
from pdhpe_y4_support import L, pair_visual, write_batch

MSP, IHW, SMI, RRS1, RRS2 = 'PH2-MSP-01', 'PH2-IHW-01', 'PH2-SMI-01', 'PH2-RRS-01', 'PH2-RRS-02'

LESSONS = [
L('s2-pdhpe-y4-w37-l1', IHW, ['heart rate', 'pulse', 'activity', 'intensity'],
  'Heart rate rises with harder activity; feeling pulse at wrist/neck (gently) shows intensity differences between rest and exercise.',
  'Example: resting count vs after star jumps; higher after activity.',
  'Predict heart rate order: lying rest, walking, sprinting.',
  'Rest lowest; walk mid; sprint highest (typical).',
  'Pressing very hard on the neck is unsafe — use gentle touch as taught.',
  'Measure gentle pulse at rest and after two activities. Table results and intensity words.'),
L('s2-pdhpe-y4-w37-l2', IHW, ['measure', 'compare', 'recover', 'cool down'],
  'Measuring heart rate in activities compares work and recovery; cool-downs help heart rate ease toward rest.',
  'Example: work set → 1-minute walk cool → pulse closer to rest.',
  'Why include a cool-down after hard effort?',
  'Helps body recover gradually and can feel better/safer.',
  'Stopping suddenly forever without cool-down can feel awful for some people.',
  'Complete a work/cool/rest pulse log for three activities. Note recovery observation.'),
L('s2-pdhpe-y4-w38-l1', IHW, ['lifestyle', 'active', 'plan', 'week'],
  'Active lifestyle planning spreads movement across the week: play, PE, travel by walking, family activities — realistic for the student’s life.',
  'Example week grid with ticks for active minutes; indoor options for wet days.',
  'Suggest three active ideas that need little equipment.',
  'Skipping; dancing to music; playground games — any three.',
  'Plans that require expensive clubs only can exclude students.',
  'Draft a weekly active plan with wet-day backups. Share with a carer if helpful.'),
L('s2-pdhpe-y4-w38-l2', IHW, ['personal', 'plan', 'goal', 'track'],
  'Creating a personal activity plan sets a movement goal, scheduled slots and a simple tracking tick chart for two weeks.',
  'Example: 20 minutes play after school Mon–Fri; tick chart on fridge.',
  'Write a two-week goal with a tracking method.',
  'Any specific minutes/days + ticks/diary.',
  'A plan never reviewed will fade.',
  'Make and start a two-week personal plan. Mid-week check: adjust one barrier.'),
L('s2-pdhpe-y4-w39-l1', IHW, ['screen', 'sleep', 'exercise', 'balance'],
  'Balancing screen time, sleep and exercise means protecting sleep hours, choosing active breaks and using screens with family rules.',
  'Example: screens off before bed; outdoor play after school; weekend hike.',
  'Why can heavy late screens make mornings harder?',
  'They can delay sleep and reduce rest quality.',
  'All screens are not equal — schoolwork differs from endless scrolling, but sleep still matters.',
  'Audit one day: screen, sleep, move minutes. Propose one balance improvement with a carer.'),
L('s2-pdhpe-y4-w39-l2', IHW, ['habit', 'challenge', 'track', 'celebrate'],
  'A healthy habits challenge tracks small daily actions (water, move, sleep routine, kind act) and celebrates consistency, not perfection.',
  'Example 7-day card with four habits; miss one ≠ fail — restart next day.',
  'Design four habits for a week challenge and a kindness rule (no body talk).',
  'Any four supportive habits + no body-shaming rule.',
  'Challenges that rank thinnest/fastest are harmful.',
  'Run a 7-day habits challenge. Reflect wins and one restart strategy.'),
L('s2-pdhpe-y4-w40-l1', IHW, ['reflect', 'skill', 'strand', 'growth'],
  'Stage 2 PDHPE reflection names growth in wellbeing, movement, relationships, safety and healthy habits with evidence.',
  'Example: I can use I-messages; my PB throw improved; I know my safety network.',
  'Write one growth statement for movement and one for relationships/safety with evidence.',
  'Any two evidenced statements.',
  'Vague “I’m healthier” without examples is weak.',
  'Complete a reflection matrix across five PDHPE strands with strength + next step each.'),
L('s2-pdhpe-y4-w40-l2', IHW, ['celebrate', 'thanks', 'goal', 'share'],
  'Celebration recognises strategies, teamwork and safe choices; thanks helpers; sets one forward goal.',
  'Example card: strategy (fair play), evidence (peer marshal score), thanks coach/carer, next goal.',
  'Name one strategy worth celebrating and one next goal.',
  'Any strategy + actionable goal.',
  'Only ranking the “fittest” ignores wider PDHPE learning.',
  'Write and share a celebration card: strategy, evidence, thanks, next goal.'),
]

VISUALS = {
 's2-pdhpe-y4-w37-l1': [pair_visual('Pulse','gentle check','Intensity','rises with work','Heart rate ideas.','Gentle touch only.'),
  pair_visual('Rest vs work','table','Risk','press neck hard','Pulse table.','Intensity words.')],
 's2-pdhpe-y4-w37-l2': [pair_visual('Work','then cool','Recover','toward rest','Heart rate activities.','Cool-down helps.'),
  pair_visual('Log three','recovery note','Risk','stop dead always','Work/cool log.','Observe recover.')],
 's2-pdhpe-y4-w38-l1': [pair_visual('Week grid','active ticks','Wet-day','indoor options','Active lifestyle.','Low-cost ideas.'),
  pair_visual('Draft week','backups','Risk','expensive only','Week plan.','Carer share OK.')],
 's2-pdhpe-y4-w38-l2': [pair_visual('Goal','scheduled','Track','tick chart','Personal activity plan.','Review and adjust.'),
  pair_visual('Two weeks','mid check','Risk','never review','Personal plan.','Barrier adjust.')],
 's2-pdhpe-y4-w39-l1': [pair_visual('Sleep','protect hours','Screens','family rules','Balance habits.','Late screens affect sleep.'),
  pair_visual('Day audit','one improve','Risk','screens all night','Balance audit.','Carer talk.')],
 's2-pdhpe-y4-w39-l2': [pair_visual('Daily habits','small actions','Celebrate','consistency','Habits challenge.','No body ranking.'),
  pair_visual('7-day card','restart','Risk','thin/fast contest','Week challenge.','Kindness rule.')],
 's2-pdhpe-y4-w40-l1': [pair_visual('Growth','with evidence','Strands','five areas','Year reflection.','Examples required.'),
  pair_visual('Matrix','next steps','Risk','vague healthier','Reflection matrix.','Evidence notes.')],
 's2-pdhpe-y4-w40-l2': [pair_visual('Celebrate','strategy','Thanks','helpers','Celebration.','Wider than fittest.'),
  pair_visual('Card','share','Risk','only rank fitness','Celebration card.','Next goal.')],
}

def create():
    write_batch(LESSONS, VISUALS, expected_count=8)

if __name__ == '__main__':
    create()
