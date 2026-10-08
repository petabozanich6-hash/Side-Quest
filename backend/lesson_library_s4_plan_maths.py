"""Stage 4 Mathematics placeholder plan: 50 weeks x 5 lessons = 250 lessons, every one with its own title.

Replaces the Maths part of lesson_library_s4_placeholders.py. Seed keys keep the same format
(s4-maths-wNN-lN), and this module is registered before the old placeholders, so each key here wins.
Even-numbered weeks end with a fortnightly mini exam in lesson 5 (carried over from the old plan, an assumption).
The 45-minute slot is lesson 5, as before. Built lessons (separate modules, registered earlier) win over these.

TO BUILD A LESSON: write its module (lesson_library_s4_maths_wNN_lN.py), register it in lesson_library.py
LESSON_MODULES before this module. Nothing else needs changing.
Unit titles, lesson titles and the outcome mapping are a DRAFT to refine against NSW sample scope and sequences.
Outcome codes (MA4-...) came from NESA-based sources and should be re-checked.
"""
from lesson_library_s4_builder import build_s4, _q

AREA = "Mathematics"
PREFIX = "maths"
SOURCE = "NSW Mathematics K-10 Syllabus (2022), Stage 4"
WM = "MAO-WM-01"
_TEXT = "PLACEHOLDER. Full teaching content for this lesson will be added later."

UNITS = [
    (1, 3, "Integers", ["MA4-INT-C-01"], [
        "Exploring positive and negative numbers", "Adding integers on the number line", "Adding integers with the same signs",
        "Adding integers with different signs", "Zero pairs and the integer chip model", "Subtracting integers on the number line",
        "Subtracting a negative integer", "Addition and subtraction patterns and rules", "Mixed addition and subtraction problems",
        "Multiplying integers", "Dividing integers", "Order of operations with integers",
        "Integers in context: temperature, money and elevation", "Integer problem solving and unit review"]),
    (4, 9, "Fractions, decimals and percentages", ["MA4-FRC-C-01"], [
        "Factors, multiples and equivalent fractions", "Simplifying fractions", "Comparing and ordering fractions",
        "Improper fractions and mixed numbers", "Adding fractions with different denominators",
        "Subtracting fractions with different denominators", "Adding and subtracting mixed numbers", "Multiplying fractions",
        "Dividing fractions", "Fractions of quantities", "Multiplying and dividing mixed numbers", "Fraction problem solving",
        "Place value and decimal notation", "Ordering and rounding decimals", "Adding and subtracting decimals",
        "Multiplying decimals", "Dividing decimals", "Converting fractions to decimals", "Converting decimals to fractions",
        "Introducing percentages", "Converting between fractions, decimals and percentages", "Finding a percentage of a quantity",
        "Expressing one quantity as a percentage of another", "Percentage increase and decrease", "Discounts and GST",
        "Money and best buys with percentages", "Fractions, decimals and percentages review"]),
    (10, 11, "Indices", ["MA4-IND-C-01"], [
        "Index notation and powers", "Squares, square roots, cubes and cube roots", "Multiplying powers with the same base",
        "Dividing powers with the same base", "Power of a power", "The zero index", "Index laws mixed practice",
        "Scientific notation for large and small numbers", "Indices problem solving and review"]),
    (12, 14, "Ratios and rates", ["MA4-RAT-C-01"], [
        "Introducing ratios", "Simplifying ratios", "Equivalent ratios and missing values", "Dividing a quantity in a given ratio",
        "Ratio problems", "Introducing rates", "Unit rates and the unitary method", "Speed as a rate", "Converting rate units",
        "Comparing rates and best buys", "Scale drawings and maps", "Ratio and rate problem solving", "Ratios and rates review"]),
    (15, 19, "Algebraic techniques", ["MA4-ALG-C-01"], [
        "Patterns and the idea of a variable", "Algebraic notation", "Substituting into expressions", "Substituting into formulas",
        "Like terms and unlike terms", "Adding and subtracting algebraic terms", "Multiplying algebraic terms",
        "Dividing algebraic terms", "Simplifying algebraic expressions", "Expanding using the distributive law",
        "Expanding with negative terms", "Highest common factor of terms", "Factorising using a common factor",
        "Expanding and simplifying together", "Algebraic fractions with numerical denominators",
        "Index laws with algebraic terms", "Writing expressions from words", "Writing expressions from diagrams and contexts",
        "Using formulas in real contexts", "Algebra problem solving", "Error analysis: spotting algebra mistakes",
        "Algebraic techniques review", "Algebra extension: number puzzles and reasoning"]),
    (20, 22, "Equations", ["MA4-EQU-C-01"], [
        "What is an equation? The balance model", "One-step equations: addition and subtraction",
        "One-step equations: multiplication and division", "Two-step equations", "Equations with brackets",
        "Equations with variables on both sides", "Equations with fractions", "Checking solutions by substitution",
        "Writing equations from word problems", "Solving worded problems with equations", "Equations with negative numbers",
        "Introducing inequalities", "Equations review and problem solving"]),
    (23, 26, "Linear relationships", ["MA4-LIN-C-01"], [
        "The Cartesian plane", "Plotting points in four quadrants", "Number patterns and tables of values",
        "Rules for number patterns", "Graphing linear relationships from tables", "From rule to graph",
        "Gradient as a rate of change", "Calculating gradient from two points", "The y-intercept", "The equation y = mx + b",
        "Graphing lines using gradient and intercept", "Horizontal and vertical lines", "Direct proportion and lines through the origin",
        "Linear relationships in real contexts", "Reading and interpreting linear graphs", "Comparing linear relationships",
        "Parallel lines on the number plane", "Linear relationships review and problem solving"]),
    (27, 29, "Angle relationships", ["MA4-ANG-C-01"], [
        "Naming and measuring angles", "Types of angles and estimating", "Angles at a point and on a straight line",
        "Vertically opposite angles", "Complementary and supplementary angles", "Corresponding angles in parallel lines",
        "Alternate angles in parallel lines", "Co-interior angles in parallel lines", "Finding unknown angles with parallel lines",
        "Testing for parallel lines", "The angle sum of a triangle", "The exterior angle of a triangle",
        "The angle sum of a quadrilateral", "Angle reasoning and review"]),
    (30, 32, "Geometrical figures", ["MA4-GEO-C-01"], [
        "Classifying triangles", "Properties of triangles", "Classifying quadrilaterals", "Properties of parallelograms and rhombuses",
        "Properties of rectangles, squares, trapeziums and kites", "Congruent figures", "Tests for congruent triangles",
        "Constructing shapes with a ruler and protractor", "Constructions with compasses", "Polygons and their angle sums",
        "Transformations: translation, reflection and rotation", "Geometric reasoning and explaining",
        "Geometrical figures review"]),
    (33, 35, "Length", ["MA4-LEN-C-01"], [
        "Units of length and converting", "Estimating and measuring length", "Perimeter of polygons", "Perimeter of composite shapes",
        "Circumference and the meaning of pi", "Circumference of circles", "Arc length, semicircles and quarter circles",
        "Perimeter of composite shapes with curves", "Finding unknown side lengths from perimeter", "Perimeter and algebra",
        "Length problems in context", "Measurement accuracy and rounding", "Length problem solving", "Length review"]),
    (36, 38, "Area", ["MA4-ARE-C-01"], [
        "Units of area and converting", "Area of rectangles and squares", "Area of triangles", "Area of parallelograms",
        "Area of rhombuses and kites", "Area of trapeziums", "Area of composite shapes", "Area of circles",
        "Area of sectors and semicircles", "Area of composite shapes with circles", "Area and perimeter problems",
        "Area in context: land, rooms and costs", "Area review"]),
    (39, 41, "Volume", ["MA4-VOL-C-01"], [
        "Units of volume and capacity", "Volume of rectangular prisms", "Volume of cubes and cuboids",
        "Volume of prisms using the cross-section", "Volume of triangular prisms", "Volume of cylinders",
        "Capacity and converting between kL, L and mL", "Volume of composite solids", "Surface area of prisms", "Nets of solids",
        "Surface area of cylinders", "Volume problems in context", "Volume and capacity problem solving", "Volume review"]),
    (42, 43, "Pythagoras' theorem", ["MA4-PYT-C-01"], [
        "Right-angled triangles and the hypotenuse", "Discovering Pythagoras' theorem", "Finding the hypotenuse",
        "Finding a shorter side", "Pythagorean triads", "Testing for right angles", "Pythagoras in context problems",
        "Pythagoras in two-step problems", "Pythagoras' theorem review"]),
    (44, 47, "Data", ["MA4-DAT-C-01", "MA4-DAT-C-02"], [
        "Types of data: categorical and numerical", "Collecting data: surveys and questions", "Sampling and bias",
        "Frequency tables and tallies", "Column graphs and picture graphs", "Dot plots and stem-and-leaf plots",
        "Histograms and frequency polygons", "Sector graphs", "The mean", "The median and mode", "Range and outliers",
        "Choosing the best measure of centre", "Comparing two data sets", "Back-to-back stem-and-leaf plots",
        "Line graphs and trends", "Misleading graphs", "Data investigation: planning and presenting", "Data review"]),
    (48, 50, "Probability", ["MA4-PRO-C-01"], [
        "Chance language and likelihood", "The probability scale from 0 to 1", "Theoretical probability of single events",
        "Sample spaces and listing outcomes", "Complementary events", "Experimental probability and relative frequency",
        "Comparing experimental and theoretical probability", "Venn diagrams", "Two-way tables",
        "Tree diagrams for two-step events", "Probability simulations", "Probability in real contexts",
        "Probability and final course review"]),
]


def _make(unit, week, slot, text, codes):
    minutes = 45 if slot == 4 else 60
    title = "Week %d, Lesson %d: %s" % (week, slot + 1, text)
    all_codes = list(codes) + [WM]
    notes = {c: "Draft mapping to be confirmed against the NESA syllabus." for c in all_codes}
    lesson = build_s4(
        "s4-%s-w%02d-l%d" % (PREFIX, week, slot + 1), title, "Placeholder: this lesson is still to be written.", unit,
        all_codes, notes, text, ["Placeholder."], ["Placeholder."], ["This lesson (everything you need is inside it)"],
        "To be added.", _TEXT + " Planned focus: " + text + ".", [], _TEXT, _TEXT, _TEXT, "To be added.", "To be added.",
        [_q("Placeholder check: choose the first answer.", ["Yes", "No"], 0, "Placeholder only.")], "To be added.", "To be added.",
        [], [], None, [], None, ["To be added."], ["To be added."], "To be added.",
        area=AREA, minutes=minutes, source=SOURCE)
    for key in ("sort_activity", "interactive_activities", "word_challenges", "planner_fields"):
        lesson.pop(key, None)
    lesson["is_placeholder"] = True
    return lesson


def _exam_text(week):
    spanned = [u for u in UNITS if u[0] <= week and u[1] >= week - 1]
    names = " and ".join(u[2] for u in spanned)
    codes = []
    for u in spanned:
        for c in u[3]:
            if c not in codes:
                codes.append(c)
    return "Fortnightly mini exam, weeks %d and %d (%s)" % (week - 1, week, names), codes, spanned[-1][2]


def _build_all():
    out = []
    for first, last, unit, codes, topics in UNITS:
        queue = list(topics)
        extra = 0
        for week in range(first, last + 1):
            for slot in range(5):
                if week % 2 == 0 and slot == 4:
                    text, exam_codes, exam_unit = _exam_text(week)
                    out.append(_make(exam_unit if exam_unit else unit, week, slot, text, exam_codes))
                    continue
                if queue:
                    text = queue.pop(0)
                else:
                    extra += 1
                    text = "%s: extra practice %d" % (unit, extra)
                out.append(_make(unit, week, slot, text, codes))
    return out


LESSONS = _build_all()

if __name__ == "__main__":
    keys = [lesson["seed_key"] for lesson in LESSONS]
    titles = [lesson["title"].split(": ", 1)[1] for lesson in LESSONS]
    assert len(keys) == len(set(keys)) == 250, len(keys)
    assert len(titles) == len(set(titles)), "repeated lesson titles"
    print("ok", len(keys))
