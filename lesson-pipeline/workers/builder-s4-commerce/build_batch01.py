#!/usr/bin/env python3
"""Year 7 Commerce batch 01: consumer choices (12 lessons)."""
import sys
from pathlib import Path

ROOT = Path('/Users/petab/Side-Quest/.worktrees/parallel-workers')
sys.path.insert(0, str(ROOT / 'scripts/gold-pipeline'))
from elective_batch import write_elective_batch
from written_bundle import pair_visual

CODE = 'CO5-DEC-01'
SUBJECT = 'hsie'
SOURCE = 'https://curriculum.nsw.edu.au/learning-areas/hsie/commerce-7-10-2024/outcomes'
NOTE = (
    'Proposed Year 7 Commerce alignment to Commerce 7–10 (2024) outcome CO5-DEC-01. '
    'The syllabus says Stage 4 may adjust Stage 5 outcomes (CO4-ADJ-01). '
    'Content-point mapping pending. Not NESA verified. Not financial advice.'
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
        's5-commerce-y9-w01-l1',
        ['need', 'want', 'choice', 'priority'],
        'A need is something required for health and basic participation, such as food, shelter, and a way to get to school. '
        'A want is something you would like but can live safely without, such as a branded drink or a new game. '
        'The same object can sit in either group depending on the situation: a jumper is a need on a cold morning and a second fashionable jumper may be a want. '
        'Sorting needs and wants is the first consumer skill because money spent on a want is then unavailable for a need.',
        'Ari has $20. Lunch for the week is not yet packed, and a poster is on sale for $18. Lunch is the need. The poster is a want. '
        'Buying the poster first would leave $2, which does not cover lunches. The decision puts the need first.',
        'Sort these into need or want for a student who already owns one warm jumper: a second hoodie with a logo, bus fare to school, a new phone case, and a packed lunch.',
        'Bus fare and packed lunch are needs for getting to school and eating. The logo hoodie and phone case are wants if a jumper and a working phone already exist.',
        'Calling every purchase a need because you feel like having it. Feeling is not the same test as health or being able to take part in school.',
        'List four things your household might buy this week. Mark two needs and two wants, and write one sentence on what happens if the wants are bought first. Use examples other than Ari’s poster.',
    ),
    spec(
        's5-commerce-y9-w01-l2',
        ['goods', 'services', 'consumer', 'payment'],
        'Goods are physical items you can keep, such as a water bottle or a loaf of bread. '
        'Services are actions someone does for you, such as a haircut, a bus ride, or a lesson. '
        'You pay for both, but a service is used as it happens and cannot be put on a shelf afterwards. '
        'Knowing the difference stops a budget from treating a weekly bus trip as if it were an object you still own.',
        'A $4 bus ride is a service: you pay for the trip, and afterwards you have arrived, not a product in your bag. '
        'A $4 bread roll is a good: you can hold it. Both cost $4, but only the roll remains as an item.',
        'Label each as a good or a service: a haircut, a notebook, a cinema ticket, and a pair of socks.',
        'Haircut and cinema ticket are services (someone provides an experience you use then). Notebook and socks are goods you keep.',
        'Calling a bus ticket a good because the paper or app receipt is physical. The receipt is a record. The purchase is the ride.',
        'Write two goods and two services a Year 7 student might pay for in a month, other than bread and the bus. Say which one is gone once it has been used.',
    ),
    spec(
        's5-commerce-y9-w02-l1',
        ['scarcity', 'opportunity cost', 'alternative', 'trade-off'],
        'Scarcity means you cannot buy every option, because money, time or stock is limited. '
        'Opportunity cost is the next best alternative you give up when you choose. It is one alternative, not every other thing in the shop. '
        'If you spend $15 on one item, the opportunity cost is the other $15 item you ranked second, not the entire catalogue.',
        'Sam has exactly $15. Option A is a durable water bottle for $15. Option B is three $5 takeaway snacks. '
        'Sam chooses the bottle. The opportunity cost is the three snacks, because that was the next best use of the same $15. Check: $5 × 3 = $15, so both options use the full amount.',
        'Kim has $15 and chooses a jumper on sale for $15 instead of a $15 museum ticket. What is the opportunity cost, and what is it not?',
        'The opportunity cost is the museum visit, the next best alternative given up. It is not “everything else Kim might ever want”, and it is not $0 just because the jumper was on sale.',
        'Thinking opportunity cost is the price tag plus the other item’s price, so $15 + $15 = $30. You only spend the $15 once. The cost of the choice is what you did not get.',
        'You have $15. Choose between a $15 second-hand calculator you need for maths and a $15 cap. State your choice and name the opportunity cost in one sentence. Show that both options cost $15.',
    ),
    spec(
        's5-commerce-y9-w02-l2',
        ['influence', 'advertising', 'habit', 'notice'],
        'A consumer choice is rarely made in a vacuum. Advertising, friends and habit all push a decision. '
        'Noticing an influence does not mean the choice is wrong. It means you can ask whether the reason is the product’s use or someone else’s message. '
        'A useful test: if the logo were removed, would you still want it for the job it does?',
        'An ad shows a famous athlete with a particular drink. Jo buys it at lunch instead of water from home. '
        'The influence is the athlete ad, not thirst alone, because water was already available. Jo can still buy the drink, but the reason should be honest: taste, not “the athlete proves it is better”.',
        'A friend says everyone is buying a particular pencil case. You already own a case that closes. Name the influence and one question that tests it.',
        'The influence is the friend’s group. The test question is whether your current case fails at its job. If it closes and carries your pens, the new case is a want driven by belonging, not a failed tool.',
        'Believing that any advertised product is automatically better quality. An advertisement is paid communication, not a test result.',
        'Describe a recent want of your own. Name one influence (ad, friend or habit) and write the question you would ask before buying. Do not use the athlete drink example.',
    ),
    spec(
        's5-commerce-y9-w03-l1',
        ['criteria', 'price', 'purpose', 'durability'],
        'Comparing products needs criteria decided before you look at the brighter packet. '
        'Useful criteria for a water bottle are price, purpose (does it hold a school day’s water) and durability (will the lid still seal after a month). '
        'Invented classroom products are enough. You do not need a real brand, and a brand name is not evidence of quality.',
        'Bottle North: $12, 600 mL, lid cracked in the shop sample. Bottle South: $16, 750 mL, intact lid, thicker wall. '
        'If the criterion “must last the term” ranks above “cheapest”, South fits better even though it costs $4 more. $16 − $12 = $4.',
        'Compare Pencil Pack A ($3, leads snap in the packet) and Pack B ($5, leads intact, 12 pencils). Which is the better buy if the criterion is “works for a month of homework”, and what is the price difference?',
        'Pack B. A snapped lead fails the purpose. The difference is $5 − $3 = $2. Cheapest fails when the criterion is a working pencil, not the lowest tag.',
        'Choosing only by the biggest discount sticker. A discount on an item that does not do the job is still a poor buy.',
        'Create two invented lunch boxes with price, size and one durability fact. Pick one using criteria you state first. Show any subtraction you use.',
    ),
    spec(
        's5-commerce-y9-w03-l2',
        ['value', 'leak', 'replacement', 'cost'],
        'Value is what you get for what you give up, not the smallest price. '
        'A cheap bottle that leaks can cost more once you replace it and replace ruined pages. '
        'Add the replacement into the real cost before you call something a bargain.',
        'Bottle Cheap is $6 and leaks in week 2, so a second bottle costs another $6. Real cost for the month: $6 + $6 = $12, plus a wet workbook. '
        'Bottle Seal is $12 and does not leak. Over the same month Seal costs $12 and keeps the books dry. Cheap was not cheaper once replaced.',
        'A $4 USB drive fails after one week. A replacement is another $4. A $9 drive keeps working. Compare the real cost of two cheap drives with the $9 drive.',
        'Two cheap drives cost $4 + $4 = $8, and you still had a failure in between. The $9 drive costs $1 more than those two replacements but avoids the lost file. Value includes whether the item keeps working, not only the first tag.',
        'Saying “it was only $6” after you have already bought a second one. The first price is not the whole cost.',
        'A $7 umbrella turns inside out on the first windy day. A replacement is $7. A $15 umbrella lasts the term. Calculate the two-umbrella cost and say which option has better value for a rainy term. Use this umbrella case, not the bottle.',
    ),
    spec(
        's5-commerce-y9-w04-l1',
        ['budget', 'income', 'expense', 'left'],
        'A budget is a plan for a limited amount of money before you spend it. '
        'Income here is the amount you have, such as $12 for school snacks this week. Expenses are what you plan to spend. '
        'What is left is income minus expenses. If expenses are bigger than income, the plan does not work and something has to be cut.',
        'Income: $12 for the week. Plan: four school days at $2 a day is 4 × $2 = $8. Left: $12 − $8 = $4, which can stay unspent or cover a Friday piece of fruit. '
        'A plan of $4 a day would be 4 × $4 = $16, and $16 is more than $12, so that plan fails.',
        'You have $10 for five school days. You want a $1.50 snack each day. Does the plan fit? Show the multiplication and the subtraction or the amount over.',
        'Five days at $1.50 is 5 × $1.50 = $7.50. Left: $10.00 − $7.50 = $2.50. The plan fits, with $2.50 unspent.',
        'Adding the daily amount instead of multiplying by the number of days, or ignoring a day. The budget has to cover every day you claimed.',
        'Make a snack budget with $16 income and a $3 item on three days only. Show the total expense and what is left. Do not reuse the $2 plan.',
    ),
    spec(
        's5-commerce-y9-w04-l2',
        ['saving', 'target', 'weekly', 'check'],
        'Saving for a goal needs a target, a weekly amount you can actually keep, and a count of weeks. '
        'Weeks needed is target divided by the weekly amount, if that amount stays the same. '
        'Check by multiplying weeks by the weekly amount. The product should equal the target. This is a plan, not advice to buy a particular product.',
        'Target: a $24 set of art pencils. Weekly saving: $4 from the snack money left over. Weeks: $24 ÷ $4 = 6. Check: 6 × $4 = $24. '
        'If only $3 a week can be saved, weeks become $24 ÷ $3 = 8, and 8 × $3 = $24. The goal moves later when the weekly amount drops.',
        'Target $36 for a class excursion. You can save $6 a week. How many weeks, and what is the check multiplication?',
        '36 ÷ 6 = 6 weeks. Check: 6 × $6 = $36. The plan reaches the target in six weeks if the $6 is saved every week.',
        'Dividing the wrong way, such as 6 ÷ 36, or forgetting to check with multiplication. Also, treating a wish as saved money before it is set aside.',
        'New target: $20 for a second-hand novel. Weekly amount: $5. Calculate the weeks and the check. Then say what changes if one week you save $0 and the other weeks stay at $5.',
    ),
    spec(
        's5-commerce-y9-w05-l1',
        ['faulty', 'seller', 'remedy', 'proof'],
        'When a new item is faulty, the general consumer idea in Australia is that you go back to the seller, not only to the manufacturer, and you can ask for a repair, replacement or refund. '
        'This lesson does not quote a section number of the Australian Consumer Law. Rules change in their detail, so a parent checks the current official advice before a real complaint. '
        'Proof helps: the receipt, the date, and a clear description of the fault. “I changed my mind” is a different situation from “the zip failed on day two”.',
        'A school bag’s zip splits on day two. You still have the receipt. The fault is the zip, not a change of taste. '
        'The next step is to take the bag and receipt to the shop and describe the fault. A parent can go with you. You do not need to invent a law number to explain the problem.',
        'A jumper is the wrong colour and you simply prefer blue. Is that the same as a split zip? What should you say at the counter?',
        'No. A colour preference is a change of mind. The shop may help as a courtesy, but it is not the same as a faulty zip. Say what is actually true: you prefer a different colour. Do not pretend it broke.',
        'Inventing a statute number or threatening a fine you cannot explain. A clear, true description of the fault is the skill.',
        'Write a four-sentence script for returning a calculator whose screen went blank on the first day. Include the proof you would bring. State that a parent should confirm the current rule. Do not invent a section number.',
    ),
    spec(
        's5-commerce-y9-w05-l2',
        ['pressure', 'urgency', 'claim', 'pause'],
        'Pressure selling tries to shrink your thinking time. Common signs are “only today”, “everyone is buying”, and a price that looks too good without a clear good or service. '
        'The skill is recognition and a pause, not a set of tricks for pressuring someone else. '
        'A pause question is: what exactly am I buying, what does it cost in total, and what happens if I wait until tomorrow?',
        'A pop-up says a game currency pack is 90% off for the next ten minutes and hides the final dollar amount. '
        'Signs: a short timer and a missing total. The pause is to close it, write the real price if you can find it, and decide tomorrow. Urgency is the seller’s tool, not proof of value.',
        'A message says “pay a bond today or lose your spot” for a weekend sport you have not checked with a parent. Which sign is this, and what is the safe pause?',
        'The sign is urgency plus a payment demand. The pause is to stop, show a parent, and confirm the organisation is real before any money moves. Speed is not evidence.',
        'Teaching how to copy a pressure message to sell to classmates. This lesson only practises spotting and slowing down.',
        'Write three pressure signs you might see online and the pause question you would use for each. Do not include instructions for deceiving a buyer.',
    ),
    spec(
        's5-commerce-y9-w06-l1',
        ['options', 'criteria', 'decision', 'reason'],
        'A decision record makes a choice inspectable. It lists the options, the criteria, the choice, and the reason linked to a criterion. '
        '“I just wanted it” is a feeling, not a finished record. The reason should name which criterion won. '
        'If two criteria conflict, the record says which one you ranked higher and what you gave up.',
        'Options: walk (free, 35 minutes) or bus ($4, 15 minutes). Criteria: arrive on time, spend little. '
        'If the bell is in 20 minutes, the bus wins on time and the opportunity cost is the $4. If you have 40 minutes, walking wins on cost. The record states the situation first.',
        'Options for a project folder: $2 card folder or $8 plastic folder. Criteria: keep pages dry, spend under $5. Which choice fits both criteria, or which criterion must you drop?',
        'The $2 folder fits the budget but may fail “dry” in rain. The $8 folder fails “under $5” because $8 > $5. You cannot meet both unless you change a criterion. A honest record says which criterion you rank first.',
        'Writing the choice with no options and no criterion. A record can be checked by someone else only if the reason is visible.',
        'Complete a decision record for getting to training: bicycle or car lift. Give two criteria, a choice, and the opportunity cost. Use times or costs you state clearly.',
    ),
    spec(
        's5-commerce-y9-w06-l2',
        ['budget', 'second-hand', 'new', 'justify'],
        'An independent consumer decision uses new numbers, not a copy of the worked example. '
        'Here the choice is sports shoes. New shoes cost $60. Second-hand shoes in good condition cost $25 and still fit the sport. '
        'The budget is $40. A decision record should show that $60 is over budget and $25 is inside it, then judge condition, not only price.',
        'Budget $40. New: $60, which is $60 − $40 = $20 over budget, so it does not fit. Second-hand: $25, and $40 − $25 = $15 left. '
        'If the second-hand pair has intact soles and the right size, it meets the budget and the purpose. If the soles are worn through, the low price fails the purpose and you do not buy them just because $25 is small.',
        'New headphones are $45. Second-hand ones are $18 and one earcup is cracked. Your budget is $30. What can you buy inside the budget, and why might you still refuse the second-hand pair?',
        'Both might be refused: $45 is $15 over a $30 budget, and the cracked earcup fails the purpose. Being inside the budget is not enough if the item does not work. Waiting and saving is a valid decision.',
        'Buying the $60 shoes and saying the budget was “about $40”. A budget only works if the price is actually at or under the amount you set.',
        'New decision: a calculator at $22 new or $8 at a stall with missing buttons. Budget $15. Write the record with both subtractions or comparisons, the choice, and one criterion besides price.',
    ),
]

VISUALS = {
    's5-commerce-y9-w01-l1': visuals(
        ('Need', 'lunch for the week'), ('Want', '$18 poster'),
        'Lunch is the need and the poster is the want when only $20 is available.',
        'Put the need first when money cannot cover both.',
        ('$20', 'poster takes $18'), ('Left', 'only $2'),
        'After an $18 poster, $2 remains, which does not buy the week of lunches.',
        'Spending the want first removes the need.',
    ),
    's5-commerce-y9-w01-l2': visuals(
        ('Good', '$4 bread roll'), ('Service', '$4 bus ride'),
        'A bread roll is a good you keep; a bus ride is a service you use.',
        'The same price can buy a thing or an action.',
        ('Afterwards', 'roll still in the bag'), ('Afterwards', 'trip is over'),
        'The roll remains; the ride does not sit on a shelf.',
        'A receipt is a record, not the service itself.',
    ),
    's5-commerce-y9-w02-l1': visuals(
        ('Choose', '$15 bottle'), ('Give up', 'three $5 snacks'),
        'Choosing the $15 bottle gives up three $5 snacks.',
        'Opportunity cost is the next best alternative.',
        ('Check', '$5 × 3 = $15'), ('Not', '$15 + $15'),
        'Both options cost $15; you do not add the prices together.',
        'You spend the $15 once.',
    ),
    's5-commerce-y9-w02-l2': visuals(
        ('Influence', 'athlete on the ad'), ('Test', 'water already here'),
        'The athlete ad is an influence when water was already available.',
        'Notice the push before you call it thirst.',
        ('Friend says', 'everyone has one'), ('Test', 'does mine still work?'),
        'A friend’s trend is tested by whether your current item still does the job.',
        'An advertisement is not a quality test.',
    ),
    's5-commerce-y9-w03-l1': visuals(
        ('North $12', 'cracked lid'), ('South $16', 'lid intact'),
        'The dearer bottle has the lid that still seals.',
        'Durability can outrank the lower price.',
        ('Difference', '$16 − $12 = $4'), ('Criterion', 'must last the term'),
        'South costs $4 more and meets the lasting-lid criterion.',
        'A discount sticker is not a criterion.',
    ),
    's5-commerce-y9-w03-l2': visuals(
        ('Cheap path', '$6 + $6 = $12'), ('Seal path', '$12 once'),
        'Two cheap bottles cost $12, the same as one bottle that does not leak.',
        'Add the replacement before calling a price a bargain.',
        ('Also', 'wet workbook'), ('Seal', 'books stay dry'),
        'The leak adds damage, not only another purchase.',
        'The first price tag is not the whole cost.',
    ),
    's5-commerce-y9-w04-l1': visuals(
        ('Income', '$12 for snacks'), ('Plan', '4 × $2 = $8'),
        'Four days at $2 uses $8 of the $12.',
        'Multiply the daily amount by the number of days.',
        ('Left', '$12 − $8 = $4'), ('Fails', '4 × $4 = $16'),
        '$4 a day would need $16, which is more than $12.',
        'Expenses cannot exceed the money you have.',
    ),
    's5-commerce-y9-w04-l2': visuals(
        ('Target', '$24 pencils'), ('Plan', '$4 × 6 weeks'),
        'Saving $4 a week reaches $24 in 6 weeks.',
        'Divide the target by the weekly amount, then multiply to check.',
        ('Check', '6 × $4 = $24'), ('If $3', '8 weeks'),
        'Dropping to $3 a week stretches the plan to 8 weeks.',
        'A wish is not saved until the money is set aside.',
    ),
    's5-commerce-y9-w05-l1': visuals(
        ('Fault', 'zip splits day two'), ('Proof', 'receipt and bag'),
        'A split zip is a fault; take the bag and receipt back to the seller.',
        'Describe the fault truly. A parent checks the current rule.',
        ('Not a fault', 'prefer blue'), ('Do not', 'invent a law number'),
        'Changing your mind about colour is different from a broken zip.',
        'No made-up section numbers.',
    ),
    's5-commerce-y9-w05-l2': visuals(
        ('Sign', '10-minute timer'), ('Pause', 'decide tomorrow'),
        'A countdown is a pressure sign; closing it and waiting is the pause.',
        'Urgency is not proof of value.',
        ('Hidden', 'no dollar total'), ('Ask', 'what am I buying?'),
        'Find the real total before any payment.',
        'This lesson spots pressure. It does not teach you to pressure others.',
    ),
    's5-commerce-y9-w06-l1': visuals(
        ('20 minutes', 'bus wins on time'), ('40 minutes', 'walk wins on cost'),
        'The same two options change winner when the time available changes.',
        'State the situation before the choice.',
        ('$8 folder', 'over a $5 cap'), ('$2 folder', 'may fail rain'),
        'Eight dollars breaks a five-dollar limit; two dollars may fail the dry-pages test.',
        'Say which criterion you ranked first.',
    ),
    's5-commerce-y9-w06-l2': visuals(
        ('New shoes', '$60 is $20 over'), ('Second-hand', '$25 leaves $15'),
        'On a $40 budget, $60 shoes are $20 over and $25 shoes leave $15.',
        'Compare each price with the budget.',
        ('Soles worn', 'price is not enough'), ('Intact size', 'purpose met'),
        'A low price fails if the soles are worn through.',
        'Inside the budget and fit for purpose are both required.',
    ),
}


if __name__ == '__main__':
    written = write_elective_batch(
        LESSONS, VISUALS, subject=SUBJECT, source_url=SOURCE, source_note=NOTE, out_dir=OUT,
    )
    print({'wrote': len(written), 'seeds': written})
