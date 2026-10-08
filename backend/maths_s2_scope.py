"""Stage 2 Maths 50-week scope map and coverage check.

Time basis: NESA K-6 advice sets Mathematics at a minimum of 20% of teaching time, about 4.75 hours in a
23.75 hour week. Plan: 4 x 60 minute lessons plus 1 x 45 minute consolidation lesson per week.
50 weeks x 5 lessons = 250 lessons.

DRAFT for parent review. Run this file directly to check coverage.
"""
from nsw_outcomes_stage2_maths import STAGE2_MATHS_OUTCOMES

LESSONS_PER_WEEK = 5
LESSON_MINUTES = [60, 60, 60, 60, 45]

# (first_week, last_week, unit title, primary codes)
SCOPE = [
    (1, 4, "Place value to tens of thousands", ["MA2-RN-01"]),
    (5, 8, "Addition and subtraction strategies", ["MA2-AR-01"]),
    (9, 10, "Missing values in addition and subtraction", ["MA2-AR-02"]),
    (11, 16, "Multiplication and division structure to 10 x 10", ["MA2-MR-01"]),
    (17, 18, "Missing values in multiplication and division", ["MA2-MR-02"]),
    (19, 22, "Fractions on a number line", ["MA2-PF-01"]),
    (23, 25, "Decimals to 2 places and money", ["MA2-RN-02"]),
    (26, 28, "Length: m, cm, mm, and perimeter", ["MA2-GM-02"]),
    (29, 30, "Mass: kg and g", ["MA2-NSM-01"]),
    (31, 33, "Capacity and volume", ["MA2-3DS-02"]),
    (34, 36, "Area: square cm and square m", ["MA2-2DS-03"]),
    (37, 39, "Time: analog, digital, seconds", ["MA2-NSM-02"]),
    (40, 40, "Grid maps and directions", ["MA2-GM-01"]),
    (41, 41, "Angles against a right angle", ["MA2-GM-03"]),
    (42, 43, "Comparing and classifying 2D shapes", ["MA2-2DS-01"]),
    (44, 44, "Transformations, combining and splitting shapes", ["MA2-2DS-02"]),
    (45, 46, "3D objects, models and nets", ["MA2-3DS-01"]),
    (47, 47, "Collecting data and scaled graphs", ["MA2-DATA-01"]),
    (48, 48, "Interpreting tables, dot plots and column graphs", ["MA2-DATA-02"]),
    (49, 49, "Chance experiments", ["MA2-CHAN-01"]),
    (50, 50, "Revision and problem solving", sorted(STAGE2_MATHS_OUTCOMES)),
]


def week_unit(week):
    for a, b, title, codes in SCOPE:
        if a <= week <= b:
            return title, codes
    raise ValueError(f"week {week} not covered")


def check_coverage():
    problems = []
    seen_weeks = []
    for a, b, title, codes in SCOPE:
        seen_weeks.extend(range(a, b + 1))
        for c in codes:
            if c not in STAGE2_MATHS_OUTCOMES:
                problems.append(f"unknown code {c} in '{title}'")
    if sorted(seen_weeks) != list(range(1, 51)):
        problems.append("weeks 1-50 are not covered exactly once")
    covered = {c for _, _, _, codes in SCOPE for c in codes}
    for c in STAGE2_MATHS_OUTCOMES:
        if c not in covered:
            problems.append(f"outcome {c} has no lesson")
    return problems


if __name__ == "__main__":
    issues = check_coverage()
    print("OK: all 20 outcomes covered, weeks 1-50 complete" if not issues else "\n".join(issues))
    raise SystemExit(1 if issues else 0)
