# Stage 2 Maths: 50-week scope (DRAFT for parent review)

## Time basis
NESA K-6 time advice: Mathematics is at least 20% of teaching time, about 4.75 hours in a 23.75 hour week.
Plan: four 60-minute lessons plus one 45-minute consolidation lesson each week (250 lessons).

## Open items before lessons are written
- Verify the 20 outcome codes in `backend/nsw_outcomes_stage2_maths.py` against curriculum.nsw.edu.au (currently from a secondary source).
- Retire the old MA2-RWN-01/02 rows in `backend/nsw_outcomes.py` once confirmed.
- Maths needs its own lesson builder: the English `build()` hardcodes learning_area English and English parent notes.

## Week map
| Weeks | Unit | Codes |
|---|---|---|
| 1-4 | Place value to tens of thousands | MA2-RN-01 |
| 5-8 | Addition and subtraction strategies | MA2-AR-01 |
| 9-10 | Missing values, addition and subtraction | MA2-AR-02 |
| 11-16 | Multiplication and division to 10 x 10 | MA2-MR-01 |
| 17-18 | Missing values, multiplication and division | MA2-MR-02 |
| 19-22 | Fractions on a number line | MA2-PF-01 |
| 23-25 | Decimals to 2 places and money | MA2-RN-02 |
| 26-28 | Length and perimeter | MA2-GM-02 |
| 29-30 | Mass | MA2-NSM-01 |
| 31-33 | Capacity and volume | MA2-3DS-02 |
| 34-36 | Area | MA2-2DS-03 |
| 37-39 | Time | MA2-NSM-02 |
| 40 | Grid maps and directions | MA2-GM-01 |
| 41 | Angles | MA2-GM-03 |
| 42-43 | Comparing 2D shapes | MA2-2DS-01 |
| 44 | Transformations, combining and splitting | MA2-2DS-02 |
| 45-46 | 3D objects, models and nets | MA2-3DS-01 |
| 47 | Collecting data, scaled graphs | MA2-DATA-01 |
| 48 | Interpreting data displays | MA2-DATA-02 |
| 49 | Chance experiments | MA2-CHAN-01 |
| 50 | Revision and problem solving | All |

Short blocks (weeks 29-30, 40-41, 44, 47-49) should include spaced review of number skills in the 45-minute lesson.

## Coverage check
Run `python backend/maths_s2_scope.py` from `backend/`. It fails if any of the 20 codes has no lesson or any week is missing.
