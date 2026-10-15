"""Extract ACT BSSS 2026 official accredited senior COURSE choices.
The official course register provides course NAMES and course CLASSIFICATIONS,
not a public unique numeric outcome ID. Do not fabricate one.
The PDF has one multi-column A/T/M/V grid over two pages, a separate H grid,
and R participation *unit groups* (not counted in the declared 113 courses).
Source: https://www.bsss.act.edu.au/act_senior_secondary_system/curriculum/act_bsss_curriculum_and_course_register
"""
import json
import re
import sys
import urllib.request
from datetime import date
from pathlib import Path

URL = "https://www.bsss.act.edu.au/__data/assets/pdf_file/0003/610644/ACT_BSSS_Course_Register_2026.pdf"
OUT = Path(__file__).resolve().parent.parent / "src/data/act-bsss-2026-courses-review.json"
CATEGORIES = [
    "Mathematics", "English", "Humanities and Social Science", "Science", "Language",
    "Commerce", "The Arts", "Health, Outdoor and PE", "Industry and Services",
    "Integrated Learning", "Technologies",
]
VALID_CLASSES = {"A", "T", "M", "V", "H"}
CLASS_TEXT = re.compile(r"^(?:[ATMVH](?:/[ATMVH]){0,3}|[ATMVH])$")
def norm(value):
    return re.sub(r"\s+", " ", str(value or "").replace("\u00ad", "")).strip()

def parse_cell(raw, framework, source_page):
    value = norm(raw)
    if not value or value in {"Framework", "A/T/M/V Courses", "H Courses"}:
        return None
    if framework == "H":
        if not re.search(r"\bH Course\b", value):
            return None
        name = re.sub(r"^(?:UC|UNSW) H Course\s+", "", value).strip()
        if not name or name == value:
            return None
        return {"name": name, "classifications": ["H"], "issuer": value.split(" H Course")[0],
                "identifier_kind": "senior_course_title_and_classification",
                "official_course_code": None, "pdf_page": source_page}
    words = value.split(" ")
    # Only trust a classification printed at the end of the SAME grid cell.
    # It may be A/T/M, A/T/M/V, A/M or just T.
    suffix = words[-1] if words else ""
    if not CLASS_TEXT.fullmatch(suffix) or suffix == "H":
        return None
    name = " ".join(words[:-1]).strip()
    if not name or len(name) > 100:
        return None
    classes = suffix.split("/")
    if len(set(classes)) != len(classes) or any(x not in VALID_CLASSES for x in classes):
        return None
    return {"name": name, "classifications": classes, "issuer": "ACT BSSS",
            "identifier_kind": "senior_course_title_and_classification",
            "official_course_code": None, "pdf_page": source_page}

def extract():
    import pdfplumber
    request = urllib.request.Request(URL, headers={"User-Agent": "SideQuestCurriculumResearch/1.0",
        "Accept": "application/pdf"})
    with urllib.request.urlopen(request, timeout=35) as response:
        document = response.read()
    if not document.startswith(b"%PDF"):
        raise RuntimeError("ACT BSSS official register did not return a PDF")
    import io
    found = {}
    skipped = []
    all_cells = 0
    with pdfplumber.open(io.BytesIO(document)) as pdf:
        if len(pdf.pages) < 10:
            raise RuntimeError("ACT BSSS course register PDF unexpectedly short")
        overview = pdf.pages[2].extract_text() or ""
        expected = re.search(r"113 unique courses", overview)
        if not expected:
            raise RuntimeError("ACT official register 113-course control count not found")
        for page_idx in (4,5):
            page = pdf.pages[page_idx]
            tables = page.extract_tables(table_settings={
                "vertical_strategy": "lines", "horizontal_strategy": "lines",
                "intersection_tolerance": 5,
            })
            if not tables:
                raise RuntimeError(f"No table grid found on PDF page {page_idx+1}")
            for table in tables:
                header = None
                for row_idx,row in enumerate(table):
                    if not row: continue
                    joined = " ".join(norm(x) for x in row)
                    if "Mathematics" in joined and "Technologies" in joined:
                        header = row
                        continue
                    if header is None:
                        continue
                    # Typical table: column 0 is vertical "A/T/M/V Courses",
                    # columns 1..11 are distinct learning frameworks.
                    for i,cell in enumerate(row[1:12]):
                        if not cell: continue
                        all_cells += 1
                        group = CATEGORIES[i]
                        text = norm(cell)
                        framework = "H" if " H Course " in " "+text+" " or text.startswith(("UC H Course","UNSW H Course")) else "A/T/M/V"
                        rec = parse_cell(cell, framework, page_idx+1)
                        if not rec:
                            if text and "Framework" not in text: skipped.append({"page":page_idx+1,"text":text[:120]})
                            continue
                        rec.update({"learning_area":group, "source_url":URL,
                                    "register_version": "20.02.2026",
                                    "applicable_year": 2026, "jurisdiction": "ACT"})
                        key = (rec["name"].lower(), tuple(rec["classifications"]))
                        if key in found:
                            if found[key]["learning_area"] != group:
                                found[key].setdefault("also_in_frameworks",[]).append(group)
                        else: found[key] = rec
    courses=sorted(found.values(),key=lambda x:(x["learning_area"],x["name"]))
    result={"authority":"ACT Board of Senior Secondary Studies (BSSS)","source_url":URL,
        "version":"20.02.2026","current_year":2026,"extracted_at":date.today().isoformat(),
        "identifier_kind":"senior_course_title_and_classification",
        "complete": len(courses)==113 and len(skipped)==0,
        "summary":{"declared_unique_courses":113,"parsed_distinct_entries":len(courses),
                   "rejected_populated_cells":len(skipped),"considered_cells":all_cells},
        "courses":courses,"unparsed_cells":skipped}
    OUT.write_text(json.dumps(result,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    print("ACT BSSS COURSE REGISTER "+json.dumps(result["summary"]))
    if skipped:print("REVIEW UNPARSED: "+json.dumps(skipped[:20]))
    if len(courses)!=113 or len(skipped)!=0:
        raise RuntimeError("ACT BSSS 113-course completeness requirement not met; review-only file, DO NOT attach as complete")
    print("All 113 official course names and classifications extracted; no fake numeric codes.")
if __name__ == "__main__":
    extract()
