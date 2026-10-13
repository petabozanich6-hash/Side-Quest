#!/usr/bin/env python3
"""Year 7 Commerce batch 02: personal finance and budgeting (12 lessons).

Invented classroom dollars only. Not financial advice. No real bank products,
no investment tips, and no instructions for demanding fees from anyone.
"""
import sys
from pathlib import Path

ROOT = Path('/Users/petab/Side-Quest/.worktrees/parallel-workers')
sys.path.insert(0, str(ROOT / 'scripts/gold-pipeline'))
from elective_batch import write_elective_batch
from written_bundle import pair_visual

CODE = 'CO5-FIN-01'
SUBJECT = 'hsie'
SOURCE = 'https://curriculum.nsw.edu.au/learning-areas/hsie/commerce-7-10-2024/outcomes'
NOTE = (
    'Proposed Year 7 alignment to CO5-FIN-01. Stage 4 may adjust Stage 5 outcomes '
    '(CO4-ADJ-01). Pending mapping. Not NESA verified. Not financial advice. '
    'Figures are invented classroom dollars.'
)
OUT = ROOT / 'lesson-pipeline/workers/builder-s4-commerce/authored'


def spec(seed, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(
        seed_key=seed, code=CODE, subject=SUBJECT, vocab=vocab,
        principle=principle, model=model, guided=guided, feedback=feedback,
        misconception=misconception, independent=independent,
    )


def visuals(left, right, alt, caption, left2, right2, alt2, caption2):
    return [
        pair_visual(left[0], left[1], right[0], right[1], alt, caption),
        pair_visual(left2[0], left2[1], right2[0], right2[1], alt2, caption2),
    ]


LESSONS = [
    spec(
        's5-commerce-y9-w11-l1',
        ['income', 'expense', 'left over', 'subtraction'],
        'Income is money that comes in during the plan, and an expense is money that goes out. '
        'Pocket money is income for this classroom week. Planned expenses are the amounts you intend to pay before the week starts. '
        'What is left is income minus the planned expenses, written as a subtraction so each dollar is visible. '
        'A plan that names both sides can be checked by another person. These are invented classroom dollars, not financial advice and not a real bank balance.',
        'Pocket money of $20 minus planned expenses of $14 leaves 20-14=6. '
        'That is the same as $20 − $14 = $6. '
        'The $20 is income. The $14 is the expense total. The $6 is what the plan has left, not a second income.',
        'A classmate receives $18 pocket money and plans $11 of expenses. What amount is left, and which subtraction shows it?',
        'Left is $7, because 18-11=7. The $18 is income and the $11 is the planned expense, so the remainder is $7.',
        'Treating the whole $20 pocket money as the amount left, and never subtracting the $14 expense.',
        'New pocket-money plan: income $16 and one planned expense total of $9. Write the subtraction and state what is left. Use this $16 plan, not the $20 plan.',
    ),
    spec(
        's5-commerce-y9-w11-l2',
        ['need', 'want', 'weekly plan', 'remainder'],
        'A weekly plan puts a need ahead of a want when the same income cannot be spent twice. '
        'Lunch is a need in this lesson because it is the meal for the school day. A keyring or similar extra is a want. '
        'Pay or reserve the need first, then see what remains before you decide on the want. '
        'The order is a planning rule for limited income. It is not financial advice, and the dollars are invented.',
        'Weekly income of $15 puts the lunch need of $8 first, so 15-8=7 remains. '
        'That is the same as $15 − $8 = $7. '
        'A $9 keyring is a want. It does not fit in the $7 that remains, because $9 is more than $7. The need stays first and the want waits.',
        'Weekly income is $22. The need is a $9 train fare. The want is an $8 comic. How much remains after the need, and does the comic fit?',
        'After the fare, $13 remains because 22-9=13. The $8 comic fits, because 13-8=5 would still remain. The fare, which is the need, is planned first.',
        'Buying the want first because it feels urgent, and expecting the lunch cost to shrink afterwards.',
        'New weekly plan: income $19, a $6 bus fare as the need, and a $15 game credit as the want. Show what remains after the need and say whether the want fits. Do not reuse the $15 lunch plan.',
    ),
    spec(
        's5-commerce-y9-w12-l1',
        ['tracking', 'spend', 'plan total', 'under'],
        'Tracking means writing each spend when it happens, then adding the lines and comparing the total with the plan. '
        'Three written amounts can be checked. A remembered jumble cannot. '
        'Under the plan means the tracked total is smaller than the planned amount, and the gap is plan minus actual. '
        'Over the plan means the tracked total is larger. Invented classroom dollars only. This is not financial advice.',
        'Spends of $3, $4 and $2 total 3+4+2=9, which is under a $12 plan by 12-9=3. '
        'The same additions are $3 + $4 + $2 = $9 and $12 − $9 = $3. '
        'Each spend is written before it is added. The $3 gap is plan minus tracked total.',
        'Three tracked spends are $5, $1 and $6. The plan is $15. What is the tracked total, and by how much is it under or over the plan?',
        'The tracked total is $12 because 5+1+6=12. The $15 plan is under by $3 because 15-12=3.',
        'Dropping the $2 line and still claiming the list was compared with the $12 plan.',
        'New tracking list: spends of $4, $4 and $7 against a $10 plan. Add the three spends, then state whether the total is under or over the plan and by how much. Do not reuse $3, $4 and $2.',
    ),
    spec(
        's5-commerce-y9-w12-l2',
        ['surplus', 'shortfall', 'balanced plan', 'difference'],
        'Compare what you planned to spend with what you actually spent. '
        'If the two amounts are equal, the result is neither a surplus nor a shortfall. '
        'A surplus means you spent less than the plan. A shortfall means you spent more than the plan. '
        'The label comes from the subtraction, not from a feeling about the week. Invented classroom dollars. Not financial advice.',
        'On a $10 plan, spending $10 is neither because 10-10=0, and spending $13 is a $3 shortfall because 13-10=3. '
        'Spending $7 on that same plan is a $3 surplus because 10-7=3. '
        'Equal is neither, more spent is a shortfall, and less spent is a surplus.',
        'A plan is $16. One week the spend is $16. Another week the spend is $19. What is each result called, and what subtraction shows the second result?',
        'Spent $16 on a $16 plan is neither, because 16-16=0. Spent $19 is a $3 shortfall, because 19-16=3.',
        'Calling an exact match a shortfall, because nothing was left over after spending the planned $10.',
        'New comparison: the plan is $14. One week spent $11 and another week spent $18. Label each week as surplus, shortfall or neither, and show both subtractions. Do not reuse the $10 plan.',
    ),
    spec(
        's5-commerce-y9-w13-l1',
        ['saving', 'weekly amount', 'weeks', 'check'],
        'A saving plan names a target amount and a weekly amount that stays the same in the classroom story. '
        'Weeks needed is the target divided by the weekly amount. '
        'The check multiplies those weeks by the weekly amount, and the product should equal the target. '
        'This is arithmetic for an invented goal, not advice to buy a product or to invest. Not financial advice.',
        'Saving $5 a week toward $40 takes 40/5=8 weeks, and the check 8*5=40 matches the goal. '
        'Eight times five dollars is forty dollars. '
        'If the $5 is set aside each week for those 8 weeks, the plan reaches $40. A wish without the weekly amount is not yet a saving plan.',
        'A different goal is $28, saved at $4 a week. How many weeks does the plan take, and what multiplication checks it?',
        'The plan takes 7 weeks because 28/4=7. The check is 7*4=28, which matches the $28 goal.',
        'Dividing the weekly amount by the goal, as in 5/40, and calling that fraction the number of weeks.',
        'New saving plan: $6 a week toward a $30 goal. Calculate the weeks and the multiplication check. Do not reuse the $40 goal or the $5 weekly amount.',
    ),
    spec(
        's5-commerce-y9-w13-l2',
        ['unexpected cost', 'surplus', 'subtraction', 'updated plan'],
        'An unexpected cost is a spend that was not in the original plan. '
        'If the plan had a surplus, the unexpected cost is subtracted from that surplus to see what remains. '
        'The subtraction has to be written. Adding the cost onto the surplus would invent money that is not there. '
        'Invented classroom dollars only. This is not financial advice and not a reason to hide a bill.',
        'A $6 surplus minus an unexpected $6 cost is 6-6=0, so the surplus becomes $0. '
        'That is the same as $6 − $6 = $0. '
        'The unexpected cost used the whole surplus. The plan does not still have $6 spare, and it does not grow to $12.',
        'A plan had a surplus of $9. An unexpected cost of $4 arrives. What is the updated surplus, and which subtraction shows it?',
        'The updated surplus is $5 because 9-4=5. The $4 cost is taken off the $9 surplus, so $5 of surplus remains.',
        'Adding the unexpected cost to the surplus, so 6+6 is treated as a new surplus of $12.',
        'New update: the surplus was $12 and an unexpected stationery cost is $5. Show the subtraction and the updated surplus. Do not reuse the $6 cost.',
    ),
    spec(
        's5-commerce-y9-w14-l1',
        ['cash', 'supervised card', 'tap', 'expense'],
        'Cash is notes and coins you hand over. A card that a parent supervises is another way to pay, and the money is still real. '
        'A tap records an expense for the amount of the tap. It does not become zero because the notes stayed in a wallet. '
        'The same amount is written in the budget whether it left as cash or as a supervised tap. '
        'This lesson does not name a bank or a card product, and it is not advice to get a card. Invented classroom dollars. Not financial advice.',
        'A $7 tap on a parent-supervised card is a $7 expense, the same as paying $7 in cash. '
        'If the week started with $15, both payments leave 15-7=8. '
        'The payment method changes the object you hold. It does not change the $7 expense.',
        'One snack is a $4 cash payment and another snack is a $4 tap on a parent-supervised card. What expense do you record for each payment?',
        'Record a $4 expense for the cash snack and a $4 expense for the tap. The tap is not a $0 line.',
        'Recording the tap as $0 because the notes and coins never left the wallet.',
        'New week: start with $18. Record one $5 cash purchase and one $3 tap on a parent-supervised card. Show each expense and what is left. Do not reuse the $7 tap.',
    ),
    spec(
        's5-commerce-y9-w14-l2',
        ['lay-by', 'fee', 'total', 'waiting cost'],
        'In this classroom lay-by, the shop holds an item while you pay, and an extra fee is added for the arrangement. '
        'The total is the item price plus that fee. The fee is the cost of waiting. '
        'Do not turn the fee into an interest rate. No rate is given, so none is invented. '
        'A real shop would have its own terms, which a parent would read. These dollars are invented. This is not financial advice and not a suggestion to use lay-by.',
        'A $10 lay-by item plus a $2 fee totals 10+2=12, so waiting costs $2. '
        'That is the same as $10 + $2 = $12. '
        'The item alone is not the whole price. No interest rate is used or invented.',
        'Another classroom lay-by has an item of $8 and a waiting fee of $3. What is the total, and what is the cost of waiting?',
        'The total is $11 because 8+3=11. Waiting costs the $3 fee. The $3 is not an interest rate.',
        'Inventing an interest rate from the $2 fee, or leaving the total at $10 and ignoring the fee.',
        'New lay-by: the item is $15 and the extra fee is $4. Show the total and name the waiting cost. State that you are not inventing an interest rate. Do not reuse the $10 item.',
    ),
    spec(
        's5-commerce-y9-w15-l1',
        ['plan comparison', 'monthly amount', 'once-only fee', 'question'],
        'Two invented phone plans can be compared only with the figures that are given. '
        'A monthly amount is paid each month. A once-only amount is added once in the period you are costing. '
        'Over the same number of months, write each plan as a calculation before you say which costs more. '
        'If the totals match, the price does not choose for you. You still ask what is included and what a later month would cost. '
        'These are not real phone companies. Not financial advice, and not a recommendation to join either plan.',
        'Over 2 months Plan A is 10*2=$20 and Plan B is 6*2+8=$20, so the cost matches. '
        'Plan A is $10 per month, and 10*2=20. Plan B is $6 per month plus $8 once, and 6*2=12, then 12+8=20. '
        'The 2-month cost is the same. You would still ask what each plan includes, whether a parent agrees, and what month 3 would cost if the monthly amounts continued and the $8 were not charged again. '
        'Under that assumption only, month 3 would add $10 to A and $6 to B, so 3 months would be 10*3=$30 for A and 6*3+8=$26 for B. The offers do not state that assumption, so you ask before treating it as the price.',
        'Plan C costs $8 per month. Plan D costs $5 per month plus $6 once. What does each plan cost over 2 months?',
        'Over 2 months both cost $16: Plan C is 8*2=$16 and Plan D is 5*2+6=$16 because 5*2=10 and 10+6=16. The matching total still leaves questions about what is included and what a later month costs.',
        'Calling Plan B cheaper because $6 is less than $10, and ignoring the once-only $8.',
        'New pair: Plan E is $9 a month and Plan F is $4 a month plus $7 once. Calculate both costs over 2 months, say which 2-month total is smaller and by how much, and name one question you would still ask. Do not reuse Plan A or Plan B.',
    ),
    spec(
        's5-commerce-y9-w15-l2',
        ['fee demand', 'pause', 'parent', 'recognition'],
        'Some messages push you to pay a fee today. The commerce skill in this lesson is recognition, then a pause. '
        'A demand for speed is not proof that the fee is real or that you must pay. '
        'The safe actions are to pause and show a parent before any money moves. '
        'This lesson does not teach anyone how to write, send or improve a fee demand. Invented classroom message only. Not financial advice.',
        'A message demanding a fee today is a cue to pause and show a parent before any payment. '
        'The classroom message says: "Pay a $4 fee today or the booking closes." '
        'You do not pay from the message, and you do not reply with personal details. Showing a parent is the next step. This is recognition only.',
        'A note says: "Transfer $6 before lunch or lose the team list." What do you notice, and what do you do?',
        'Pause and show a parent, because the note demands a fee today. You do not transfer the $6 from the note.',
        'Paying at once because the message says the fee is due today.',
        'New case: name two signs that a message is pushing a fee today, then write the two actions pause and show a parent. Do not write a message that asks someone else for money.',
    ),
    spec(
        's5-commerce-y9-w16-l1',
        ['fortnight', 'income', 'two expenses', 'left'],
        'A fortnight is two weeks treated as one planning period. '
        'Income is the money for that whole fortnight. Each expense is subtracted, not just the first one. '
        'You can subtract in a chain or add the expenses and then subtract once. Both paths must land on the same amount left. '
        'Invented classroom dollars. Not financial advice and not a payslip from a real job.',
        'Fortnight income of $30 minus expenses of $12 and $9 leaves 30-12-9=$9. '
        'The check adds the expenses first: 12+9=21, then 30-21=9. '
        'Both paths leave $9. Skipping the $9 expense would leave the wrong remainder.',
        'Fortnight income is $40. The expenses are $15 and $11. What is left? Show a chain or an add-then-subtract path.',
        'Left is $14 because 40-15-11=$14. The check is 15+11=26 and 40-26=14.',
        'Subtracting only the first expense, so 30-12 is treated as the amount left and the $9 is ignored.',
        'New fortnight: income $28, with expenses of $10 and $7. Show the expense addition and the subtraction from income, and state what is left. Do not reuse the $30 income.',
    ),
    spec(
        's5-commerce-y9-w16-l2',
        ['budget', 'need', 'want', 'opportunity cost'],
        'An independent budget lists income, a need, a want and a saving amount, then subtracts each one from the income. '
        'What is left is the remainder after all three subtractions. '
        'The opportunity cost of the want is the next best use of that want’s dollars, not the remainder left over. '
        'Name that next best use in the plan so the cost of the choice is visible. Invented classroom dollars. Not financial advice.',
        'Income of $25 minus a $10 need, a $6 want and $4 saving leaves 25-10-6-4=$5. '
        'The check is 10+6+4=20 and 25-20=5. '
        'In this plan the next best use of the $6 comic was extra saving, so the opportunity cost of the want is that $6 of saving. Saving would have been 4+6=10 if the comic were not bought. The $5 left is the remainder, not the opportunity cost.',
        'Income is $30, the need is $12, the want is $8 of stickers, and saving is $5. What is left, and what is the opportunity cost of the stickers if the next best use of the $8 was extra saving?',
        'Left is $5 because 30-12-8-5=$5, and the check is 12+8+5=25 and 30-25=5. The opportunity cost of the stickers is that $8 of extra saving, not the $5 remainder.',
        'Calling the $5 left over the opportunity cost of the want.',
        'New budget: income $22, a $9 need, a $5 poster as the want, and $3 of saving. Show what is left with a subtraction chain, and name the opportunity cost of the poster as the next best use of that $5. Do not reuse the $25 comic budget.',
    ),
]

VISUALS = {
    's5-commerce-y9-w11-l1': visuals(
        ('Income', 'pocket money $20'), ('Expenses', 'planned $14'),
        'Pocket money of $20 sits beside planned expenses of $14.',
        'Income and the planned expense are separate amounts.',
        ('Working', '20-14=6'), ('Left', '$6'),
        'Subtracting 14 from 20 leaves 6.',
        'The amount left is the result of the subtraction.',
    ),
    's5-commerce-y9-w11-l2': visuals(
        ('Need first', 'lunch $8'), ('Income', '$15'),
        'Lunch of $8 is taken from weekly income of $15 before a want.',
        'The need is planned before the want.',
        ('After lunch', '15-8=7'), ('Want', '$9 does not fit'),
        'Seven dollars remain, which is less than a nine-dollar want.',
        'The want waits when it is larger than the remainder.',
    ),
    's5-commerce-y9-w12-l1': visuals(
        ('Three spends', '$3, $4, $2'), ('Total', '3+4+2=9'),
        'Three written spends add to nine dollars.',
        'Write each spend, then add.',
        ('Plan', '$12'), ('Under by', '12-9=3'),
        'The nine-dollar total is three dollars under the twelve-dollar plan.',
        'Under means the plan minus the tracked total.',
    ),
    's5-commerce-y9-w12-l2': visuals(
        ('Spent $10', '10-10=0'), ('Label', 'neither'),
        'Spending the same as the ten-dollar plan is neither surplus nor shortfall.',
        'A zero difference is neither.',
        ('Spent $13', '13-10=3'), ('Label', '$3 shortfall'),
        'Spending thirteen dollars against a ten-dollar plan is a three-dollar shortfall.',
        'A shortfall is the amount spent over the plan.',
    ),
    's5-commerce-y9-w13-l1': visuals(
        ('Goal', '$40'), ('Each week', '$5'),
        'A forty-dollar goal is paired with five dollars saved each week.',
        'Weeks come from dividing the goal by the weekly amount.',
        ('Divide', '40/5=8 weeks'), ('Check', '8*5=40'),
        'Eight weeks times five dollars returns the forty-dollar goal.',
        'The multiplication check must match the target.',
    ),
    's5-commerce-y9-w13-l2': visuals(
        ('Surplus', '$6'), ('Unexpected', 'cost $6'),
        'A six-dollar surplus meets an unexpected six-dollar cost.',
        'The cost is subtracted from the surplus.',
        ('Working', '6-6=0'), ('Updated', 'surplus $0'),
        'Six minus six leaves a surplus of zero.',
        'Adding the cost would invent money.',
    ),
    's5-commerce-y9-w14-l1': visuals(
        ('Cash', 'hand over $7'), ('Tap', 'also $7'),
        'Seven dollars in cash and a seven-dollar tap are the same expense.',
        'A parent-supervised card is still real money.',
        ('Start', '$15'), ('After $7', '15-7=8'),
        'Either payment of seven dollars leaves eight from a fifteen-dollar start.',
        'The method of paying does not erase the expense.',
    ),
    's5-commerce-y9-w14-l2': visuals(
        ('Item', '$10'), ('Fee', 'extra $2'),
        'The lay-by item is ten dollars and the extra fee is two dollars.',
        'The fee is added. It is not an interest rate.',
        ('Total', '10+2=12'), ('Waiting costs', '$2'),
        'Ten plus two is twelve, and waiting costs the two-dollar fee.',
        'No interest rate is invented from the fee.',
    ),
    's5-commerce-y9-w15-l1': visuals(
        ('Plan A', '10*2=$20'), ('Plan B', '6*2+8=$20'),
        'Over two months Plan A is twenty dollars and Plan B is also twenty dollars.',
        'The same two-month cost does not end the comparison.',
        ('Same cost', 'both $20'), ('Still ask', 'included? later month?'),
        'Matching totals leave questions about what is included and a later month.',
        'Ask before treating one invented plan as the better buy.',
    ),
    's5-commerce-y9-w15-l2': visuals(
        ('Message', 'fee due today'), ('Notice', 'a fee demand'),
        'A message that demands a fee today is recognised and not obeyed on the spot.',
        'Recognition is the skill. Speed is not proof.',
        ('First', 'pause'), ('Then', 'show a parent'),
        'Pause, then show a parent, before any money moves.',
        'This lesson does not teach anyone to send a fee demand.',
    ),
    's5-commerce-y9-w16-l1': visuals(
        ('Income', 'fortnight $30'), ('Expenses', '$12 and $9'),
        'Fortnight income of thirty dollars has two expenses, twelve and nine.',
        'Both expenses belong in the plan.',
        ('Chain', '30-12-9=$9'), ('Check', '30-21=9'),
        'The chain leaves nine dollars, and thirty minus twenty-one also leaves nine.',
        'Two paths should agree.',
    ),
    's5-commerce-y9-w16-l2': visuals(
        ('Income $25', 'need $10, want $6'), ('Saving', '$4'),
        'Income of twenty-five dollars covers a ten-dollar need, a six-dollar want and four dollars of saving.',
        'Each part is subtracted.',
        ('Left', '25-10-6-4=$5'), ('Want costs', 'the next best $6'),
        'Five dollars remain. The opportunity cost of the want is the next best use of six dollars.',
        'The remainder is not the opportunity cost.',
    ),
}


if __name__ == '__main__':
    written = write_elective_batch(
        LESSONS, VISUALS, subject=SUBJECT, source_url=SOURCE, source_note=NOTE, out_dir=OUT,
    )
    print({'wrote': len(written), 'seeds': written})
