"""Verified NSW Stage 2 (Years 3-4) outcome codes.

Codes checked against published NESA code lists (curriculum.nsw.edu.au and
third-party code indexes). The short labels are plain-language topic labels
written for this app, NOT official NESA wording. Parent must verify the exact
outcome wording on curriculum.nsw.edu.au before relying on it for registration.

Known problems in nsw_outcomes.py (Stage 2 Maths) that this file corrects:
  MA2-RWN-01 / MA2-RWN-02 do not exist; the real codes are MA2-RN-01 / MA2-RN-02.
  MA2-DATA-01 is data collection; MA2-DATA-02 is data display.
  Missing: AR-02, MR-02, GM-02, GM-03, NSM-01, NSM-02, 2DS-02, 2DS-03, 3DS-01,
  3DS-02, CHAN-01, DATA-02, MAO-WM-01.
  English: EN2-CWT is three outcomes (01 imaginative, 02 informative, 03 persuasive);
  EN2-REFLU-01 and EN2-HANDW-02 were missing.
"""

VERIFIED_VERSION = 1
SOURCE_EN = "NSW English K-10 Syllabus (NESA 2022)"
SOURCE_MA = "NSW Mathematics K-10 Syllabus (NESA 2022)"

STAGE2_ENGLISH = [
    ("EN2-OLC-01", "Oral language: interacting, understanding and presenting to familiar audiences"),
    ("EN2-REFLU-01", "Reading fluency: accuracy, automaticity, rate and expression matched to purpose"),
    ("EN2-RECOM-01", "Reading comprehension of texts for a wide range of purposes"),
    ("EN2-VOCAB-01", "Vocabulary: Tier 1, 2 and 3 words through interaction, wide reading and writing"),
    ("EN2-UARL-01", "Understanding and responding to literature: how ideas are represented"),
    ("EN2-CWT-01", "Creating written texts: imaginative"),
    ("EN2-CWT-02", "Creating written texts: informative"),
    ("EN2-CWT-03", "Creating written texts: persuasive"),
    ("EN2-SPELL-01", "Spelling: select, apply and describe spelling strategies"),
    ("EN2-HANDW-01", "Handwriting: legible joined letters"),
    ("EN2-HANDW-02", "Using digital technologies to create texts"),
]

STAGE2_MATHS = [
    ("MA2-RN-01", "Representing numbers: place value and the role of zero (whole numbers)"),
    ("MA2-RN-02", "Representing numbers: decimals and place value"),
    ("MA2-AR-01", "Addition and subtraction strategies"),
    ("MA2-AR-02", "Addition and subtraction: missing values and relationships"),
    ("MA2-MR-01", "Multiplicative relations: multiplication and division facts"),
    ("MA2-MR-02", "Multiplicative relations: solving multiplication and division problems"),
    ("MA2-PF-01", "Part-whole: fractions"),
    ("MA2-GM-01", "Position, direction and movement on maps and grids"),
    ("MA2-GM-02", "Length"),
    ("MA2-GM-03", "Angles"),
    ("MA2-NSM-01", "Mass and capacity"),
    ("MA2-NSM-02", "Time"),
    ("MA2-2DS-01", "Two-dimensional shapes: properties and classification"),
    ("MA2-2DS-02", "Two-dimensional shapes: transformations"),
    ("MA2-2DS-03", "Area"),
    ("MA2-3DS-01", "Three-dimensional shapes"),
    ("MA2-3DS-02", "Volume"),
    ("MA2-DATA-01", "Data: collecting and organising"),
    ("MA2-DATA-02", "Data: displaying and interpreting"),
    ("MA2-CHAN-01", "Chance experiments"),
    ("MAO-WM-01", "Working mathematically (all stages)"),
]

STAGE2_VERIFIED_OUTCOMES = (
    [{"code": c, "stage": "S2", "learning_area": "English", "description": d, "source": SOURCE_EN} for c, d in STAGE2_ENGLISH]
    + [{"code": c, "stage": "S2", "learning_area": "Mathematics", "description": d, "source": SOURCE_MA} for c, d in STAGE2_MATHS]
)
