"""Stage 2 Mathematics outcome codes (NSW Mathematics K-10 Syllabus, NESA 2022).

STATUS: VERIFIED. The 20 content codes below match the NESA outcomes page on curriculum.nsw.edu.au
(checked Oct 2026). MAO-WM-01 (Working mathematically) is the cross-stage process outcome and is
attached to every Maths lesson. Descriptions are short plain-language focus-area labels, not the
official wording.

Note: backend/nsw_outcomes.py still holds the older MA2-RWN-01/02 codes. The current syllabus uses
MA2-RN-01/02 for place value, so those seed rows should be retired.
"""

VERIFIED = True
SOURCE = "NSW Mathematics K-10 Syllabus (NESA 2022), Stage 2"

WORKING_MATHEMATICALLY = "MAO-WM-01"

STAGE2_MATHS_OUTCOMES = {
    "MA2-RN-01": "Representing numbers: place value for whole numbers",
    "MA2-RN-02": "Representing numbers: decimals and money",
    "MA2-AR-01": "Additive relations: mental and written addition and subtraction strategies",
    "MA2-AR-02": "Additive relations: missing values and equivalence in addition and subtraction",
    "MA2-MR-01": "Multiplicative relations: multiplication and division structure and facts",
    "MA2-MR-02": "Multiplicative relations: missing values in multiplication and division",
    "MA2-PF-01": "Partitioning and fractions: fractions on a number line",
    "MA2-GM-01": "Geometric measure: position, grid maps and directions",
    "MA2-GM-02": "Geometric measure: length and perimeter",
    "MA2-GM-03": "Geometric measure: angles",
    "MA2-NSM-01": "Non-spatial measure: mass",
    "MA2-NSM-02": "Non-spatial measure: time",
    "MA2-2DS-01": "Two-dimensional spatial structure: comparing and classifying shapes",
    "MA2-2DS-02": "Two-dimensional spatial structure: transformations, combining and splitting",
    "MA2-2DS-03": "Two-dimensional spatial structure: area",
    "MA2-3DS-01": "Three-dimensional spatial structure: objects, models and nets",
    "MA2-3DS-02": "Three-dimensional spatial structure: capacity and volume",
    "MA2-CHAN-01": "Chance: experiments and likelihood",
    "MA2-DATA-01": "Data: collecting data and constructing displays",
    "MA2-DATA-02": "Data: interpreting tables and graphs",
    "MAO-WM-01": "Working mathematically: reasoning, communicating and solving problems (applies across all content)",
}
