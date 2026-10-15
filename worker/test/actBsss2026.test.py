import unittest
import importlib.util
from pathlib import Path

SPEC = importlib.util.spec_from_file_location("act_import", Path(__file__).resolve().parent.parent / "scripts/import-act-bsss-2026.py")
module = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(module)

class ActBsssExtractionTests(unittest.TestCase):
    def test_single_course_name_and_classifications(self):
        row = module.parse_cell("Advanced\nModern\nLanguages\nA/T/M", "A/T/M/V", 5)
        self.assertEqual(row["name"], "Advanced Modern Languages")
        self.assertEqual(row["classifications"], ["A","T","M"])
        self.assertIsNone(row["official_course_code"])
        self.assertEqual(row["identifier_kind"], "senior_course_title_and_classification")

    def test_vet_and_disability_pathways_are_not_dropped(self):
        self.assertEqual(module.parse_cell("Hospitality A/M/T/V", "A/T/M/V", 5)["classifications"], ["A","M","T","V"])
        self.assertEqual(module.parse_cell("Bridging Numeracy A/M", "A/T/M/V", 5)["classifications"], ["A","M"])

    def test_h_courses_keep_provider_and_real_course_name(self):
        row=module.parse_cell("UNSW H Course\nSystems Architecture", "H", 6)
        self.assertEqual(row["issuer"],"UNSW")
        self.assertEqual(row["name"],"Systems Architecture")
        self.assertEqual(row["classifications"],["H"])

    def test_not_an_outcome_code(self):
        self.assertIsNone(module.parse_cell("R Units", "A/T/M/V",6))
        self.assertIsNone(module.parse_cell("Mathematics", "A/T/M/V",5))
        self.assertIsNone(module.parse_cell("Course Not Listed", "H",5))

if __name__ == "__main__": unittest.main()
