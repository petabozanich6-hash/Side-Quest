"""Audit every A4 page and form field of Side-Quest document proofs.

Run in the GitHub Document Studio PDF Proof workflow after:
    python -m pip install "PyMuPDF>=1.25,<1.30"
    python worker/scripts/auditDocumentProof.py document-proof
The proof corpus must contain the complete print/fillable range for all
eight jurisdictions. No customer information or external network is used.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import fitz


STATES = ("nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt")
EDITIONS = ("standard", "complete")
MODES = ("print", "fillable")


def fail(message: str) -> None:
    raise AssertionError(message)


def audit(path: Path) -> dict:
    doc = fitz.open(path)
    widgets = []
    for i, page in enumerate(doc):
        if abs(page.rect.width - 595) > 1 or abs(page.rect.height - 842) > 1:
            fail(f"{path.name} page {i+1}: not A4")
        words = page.get_text("words")
        if len(words) < 3:
            fail(f"{path.name} page {i+1}: nearly blank")
        for word in words:
            x0, y0, x1, y1 = word[:4]
            if x0 < 4 or x1 > 591 or y0 < 3 or y1 > 837:
                fail(f"{path.name} page {i+1}: clipped text bounds {word}")
        page_widgets = list(page.widgets() or ())
        for n, a in enumerate(page_widgets):
            r = a.rect
            if r.x0 < 35 or r.y0 < 40 or r.x1 > 560 or r.y1 > 790:
                fail(f"{path.name} page {i+1}: field {a.field_name} outside safe margins")
            for b in page_widgets[n+1:]:
                overlap = r & b.rect
                if not overlap.is_empty and overlap.get_area() > 2:
                    fail(f"{path.name} page {i+1}: overlapping fields: {a.field_name} and {b.field_name}")
        widgets.extend((i, w.field_name, w.field_type_string) for w in page_widgets)
    if not widgets and "fillable" in path.stem:
        fail(f"{path.name}: missing form fields")
    if widgets and "print" in path.stem:
        fail(f"{path.name}: print edition unexpectedly has form fields")
    if len({name for _, name, _ in widgets}) != len(widgets):
        fail(f"{path.name}: duplicate field IDs")
    summary = {"pages": len(doc), "fields": len(widgets)}
    if "fillable" in path.stem:
        text_edited = False
        checkbox_edited = False
        for page in doc:
            for w in page.widgets() or ():
                if w.field_type_string == "Text" and not text_edited:
                    w.field_value = "Side-Quest PDF write / save / reopen test"
                    w.update()
                    text_edited = True
                elif w.field_type_string == "CheckBox" and not checkbox_edited:
                    w.field_value = w.on_state()
                    w.update()
                    checkbox_edited = True
            if text_edited and checkbox_edited:
                break
        if not text_edited or not checkbox_edited:
            fail(f"{path.name}: missing editable text or checkbox fields")
        reopened = fitz.open(stream=doc.tobytes(garbage=3), filetype="pdf")
        values = [w.field_value for p in reopened for w in (p.widgets() or ())]
        if "Side-Quest PDF write / save / reopen test" not in values or "Yes" not in values:
            fail(f"{path.name}: field values did not survive save/reopen")
        reopened.close()
        summary["form_save_reopen"] = True
    doc.close()
    return summary


def main() -> None:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "document-proof")
    summary = {}
    for state in STATES:
        for edition in EDITIONS:
            group = {}
            for mode in MODES:
                filename = f"sidequest-{state}-year3-{edition}-{mode}.pdf"
                path = root / filename
                if not path.is_file():
                    fail(f"Missing PDF proof: {filename}")
                group[mode] = audit(path)
            if group["print"]["pages"] != group["fillable"]["pages"]:
                fail(f"{state}/{edition}: print and fillable pages differ")
            summary[f"{state}/{edition}"] = group
    # Check representative Year 7 documents in every jurisdiction, including
    # explicit NSW choice of two additional learning areas.
    for state in STATES:
        pair = {}
        for mode in MODES:
            filename = f"sidequest-{state}-year7-standard-{mode}.pdf"
            path = root / filename
            if not path.is_file():
                fail(f"Missing Year 7 PDF proof: {filename}")
            pair[mode] = audit(path)
        if pair["print"]["pages"] != pair["fillable"]["pages"]:
            fail(f"{state}/Year 7: print and fillable page counts differ")
        summary[f"{state}/year7"] = pair
    nsw_seven = fitz.open(root / "sidequest-nsw-year7-standard-print.pdf")
    text_nsw = "\\n".join(p.get_text() for p in nsw_seven)
    for required in ["Creative Arts", "Technology", "Two additional learning areas"]:
        if required not in text_nsw:
            fail(f"NSW Year 7: missing selected subject choice or label: {required}")
    nsw_seven.close()
    senior_pair = {}
    for mode in MODES:
        filename = f"sidequest-nsw-year11-standard-{mode}.pdf"
        path = root / filename
        if not path.is_file():
            fail(f"Missing senior secondary PDF proof: {filename}")
        senior_pair[mode] = audit(path)
    if senior_pair["print"]["pages"] != senior_pair["fillable"]["pages"]:
        fail("NSW Year 11: print and fillable page counts differ")
    summary["nsw/year11"] = senior_pair
    report = root / "pdf-audit.json"
    report.write_text(json.dumps({"validated": True, "documents": summary}, indent=2))
    print(f"PASS: {len(summary)*2} PDFs, all eight jurisdictions at Year 3 and Year 7, plus NSW Year 11, print+fillable, A4 bounds, fields and save/reopen tests")


if __name__ == "__main__":
    main()
