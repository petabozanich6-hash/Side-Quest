import { test } from "node:test";
import assert from "node:assert/strict";
import { extractIndex, extractCodes, inferStageFromCode, expectedStages } from "../scripts/import-nesa-review.mjs";

test("NESA inventory keeps current, future, legacy and life-skills versions separate", () => {
  const url = "https://curriculum.nsw.edu.au/stages/secondary";
  const html = '<a href="/stages/primary">Primary navigation</a>' +
    'Current syllabus <a href="/learning-areas/english/english-k-10-2022/overview">English K–10 (2022)</a> Teach in K–10 ' +
    'New syllabus <a href="/learning-areas/hsie/history-elective-7-10-2025/overview">History Elective 7–10 (2025)</a> New from 2028 ' +
    'Current syllabus <a href="https://www.nsw.gov.au/education-and-training/nesa/syllabuses/visual-design">Visual Design Stage 6 (CEC) (2000)</a> Teach in 11–12 ' +
    'New syllabus <a href="/learning-areas/hsie/ancient-history-life-skills-11-12-2024/overview">Ancient History Life Skills 11–12 (2024)</a> New from 2027';
  const rows = extractIndex(html, "secondary", url);
  assert.equal(rows.length, 4);
  assert.equal(rows[0].title, "English K–10 (2022)");
  assert.equal(rows[0].listed_as, "current");
  assert.equal(rows[1].listed_as, "upcoming");
  assert.equal(rows[1].applicable_from, 2028);
  assert.equal(rows[2].likely_kind, "cec");
  assert.equal(rows[2].outcomes_url, null, "legacy sources retained, never fabricated");
  assert.equal(rows[3].likely_kind, "life_skills");
  assert.equal(rows[3].version_year, 2024);
});

test("NESA parser extracts displayed official candidates, dedupes and keeps stage hint", () => {
  const src = "https://curriculum.nsw.edu.au/learning-areas/english/english-k-10-2022/outcomes";
  const html = '<html><a>ENE-FAKE-99</a><h1>Overview</h1><h2>Outcomes</h2><div>Early Stage 1</div>' +
    '<h3>ENE-PRINT-01</h3><p>Print conventions.</p><h3>ENE-PRINT-01</h3><div>Stage 2</div>' +
    '<h3>EN2-CWT-01</h3><p>Create texts.</p><h3>MAO-WM-01 Working mathematically</h3>' +
    '<script>const fake="ENE-FAKE-33"</script></html>';
  const rows = extractCodes(html, src);
  assert.deepEqual(rows.map(x => x.code), ["ENE-PRINT-01", "EN2-CWT-01", "MAO-WM-01"]);
  assert.equal(rows[0].stage_hint, "ES1");
  assert.equal(rows[1].stage_hint, "S2");
  assert.equal(rows[2].stage_hint, null, "MAO-WM applies across stages and must not be mislabelled");
  assert.ok(rows.every(x => x.official_outcomes_url === src));
});

test("No outcome codes are invented for an unpublished/in-development syllabus", () => {
  assert.deepEqual(extractCodes("<h2>Outcomes</h2><p>In development</p>", "https://curriculum.nsw.edu.au/test"), []);
});

test("NSW year and stage are derived from published identifiers, not the most recent UI tab", () => {
  assert.equal(inferStageFromCode("ENE-PRINT-01"), "ES1");
  assert.equal(inferStageFromCode("EN2-CWT-01"), "S2");
  assert.equal(inferStageFromCode("CA1-DAN-01"), "S1");
  assert.equal(inferStageFromCode("MA4-INT-C-01"), "S4");
  assert.equal(inferStageFromCode("MAO-WM-01"), null);
  assert.equal(inferStageFromCode("ENX1-U1-01", "English Extension 11–12 (2024)"), "S6");
  assert.equal(inferStageFromCode("MAEX2-01", "Mathematics Extension 2 11–12 (2024)"), "S6");
  assert.equal(inferStageFromCode("UNCLEAR-NAME-01"), null);
});

test("NSW syllabus stage coverage flags K–10 omissions before mapping", () => {
  assert.deepEqual(expectedStages("English K–10 (2022)"), ["ES1","S1","S2","S3","S4","S5"]);
  assert.deepEqual(expectedStages("Science 7–10 (2023)"), ["S4","S5"]);
  assert.deepEqual(expectedStages("Technology 7–8 (2023)"), ["S4"]);
  assert.deepEqual(expectedStages("English Advanced 11–12 (2024)"), ["S6"]);
  assert.deepEqual(expectedStages("Ceramics Stage 6 (CEC) (2000)"), ["S6"]);
});
