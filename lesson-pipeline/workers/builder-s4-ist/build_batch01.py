#!/usr/bin/env python3
"""Year 7 IST batch 01: digital basics and data (12 lessons)."""
import sys
from pathlib import Path

ROOT = Path('/Users/petab/Side-Quest/.worktrees/parallel-workers')
sys.path.insert(0, str(ROOT / 'scripts/gold-pipeline'))
from elective_batch import write_elective_batch
from written_bundle import pair_visual

CODE = 'IST5-DAT-01'
SUBJECT = 'technology'
SOURCE = 'https://curriculum.nsw.edu.au/learning-areas/tas/information-software-technology-7-10-2025/outcomes'
NOTE = (
    'Proposed Year 7 IST alignment. Official outcome codes must match the published IST syllabus page; '
    'catalogue codes preferred when present. Verification pending. Not a hacking guide. '
    'Follow school acceptable-use rules.'
)
OUT = ROOT / 'lesson-pipeline/workers/builder-s4-ist/authored'


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
        's5-information-software-technology-y9-w01-l1',
        ['data', 'information', 'context', 'meaning'],
        'Data are raw facts or signals (numbers, clicks, sensor readings). '
        'Information is data given context and meaning so a person can use it. '
        'The same number can be useless alone and useful once labelled.',
        'The digits 16 alone are data. “16 °C on the classroom thermometer at 9 am” is information because unit, place, and time give meaning.',
        'Sort: “72”, “heart rate 72 bpm after walking”, “blue”. Which are data only, and which are information?',
        '“72” and “blue” are bare data. “Heart rate 72 bpm after walking” is information with context.',
        'Calling any spreadsheet “information” even when columns are unlabelled. Without context it stays raw data.',
        'Write one data-only example and rewrite it as information by adding unit, time, or place. School-safe examples only.',
    ),
    spec(
        's5-information-software-technology-y9-w01-l2',
        ['bit', 'byte', 'digital', 'represent'],
        'Digital systems represent data with bits (0 or 1). Eight bits make one byte — a common small chunk for text characters and tiny files. '
        'Bigger files use thousands (KB) or millions (MB) of bytes. Exact sizes vary by format.',
        'The letter A in simple encoding can be stored in one byte. '
        'A short plain-text note of 200 characters is roughly 200 bytes before formatting — much smaller than a photo of several MB.',
        'Order from smallest to largest typical size: 1 bit, 1 byte, 1 megabyte photo.',
        '1 bit < 1 byte (8 bits) < 1 megabyte photo.',
        'Thinking a bit and a byte are the same size. A byte is a group of bits.',
        'Explain to a Year 6 student the difference between a bit and a byte in two sentences, with one size comparison to a photo.',
    ),
    spec(
        's5-information-software-technology-y9-w02-l1',
        ['input', 'process', 'output', 'store'],
        'Computing systems follow input → process → output, often with storage. '
        'Input devices collect data; processing transforms it; output presents results; storage keeps data for later.',
        'Typing a search (input) → software finds matches (process) → results list (output), with history optionally stored. '
        'A thermometer app: sensor input → convert to °C → display number.',
        'Label input/process/output for: pressing a calculator keys for 12 × 4 and seeing 48.',
        'Input: keys 12, ×, 4. Process: multiply. Output: 48 on screen.',
        'Calling the screen an input because you look at it. Looking is using output; typing/tapping is input.',
        'Describe a school-safe device using input, process, output, and whether anything is stored. Do not describe hacking.',
    ),
    spec(
        's5-information-software-technology-y9-w02-l2',
        ['hardware', 'software', 'firmware', 'together'],
        'Hardware is the physical parts you can touch. Software is the instructions that tell hardware what to do. '
        'They work together: software without hardware cannot run; hardware without software is inert for most tasks.',
        'A laptop (hardware) runs a browser (software) to show a webpage. '
        'Updating the browser changes software; replacing a cracked screen changes hardware.',
        'Classify: keyboard, operating system, speaker, spreadsheet app.',
        'Keyboard and speaker are hardware. Operating system and spreadsheet app are software.',
        'Saying Wi-Fi is only hardware. Wi-Fi needs radios (hardware) and protocols/drivers (software).',
        'List three hardware and three software items in a school computer setup. One sentence on how one pair works together.',
    ),
    spec(
        's5-information-software-technology-y9-w03-l1',
        ['file', 'folder', 'path', 'extension'],
        'Files store data; folders organise files. A path shows the location through folders. '
        'An extension (such as .txt or .png) hints at the format so software knows how to open it. '
        'Renaming carelessly can make a file harder to open.',
        'Path: Documents/Science/results.txt — folders Documents → Science, file results, extension .txt for plain text. '
        'Changing only the visible name without the extension keeps the type; deleting .txt may confuse some programs.',
        'Read path Photos/Camp/day1.png. Name the folders, file, and likely type.',
        'Folders Photos then Camp; file day1; .png suggests an image.',
        'Believing the extension is decoration. It is a clue the system uses.',
        'Write a sensible path for a maths assignment file and explain each part of the path.',
    ),
    spec(
        's5-information-software-technology-y9-w03-l2',
        ['backup', 'copy', 'version', 'loss'],
        'A backup is a second copy stored separately so a lost or broken device does not destroy the only version. '
        'Cloud or USB copies only count if they actually exist and you can restore them. '
        'Version names (v1, v2) prevent overwriting the good draft by mistake.',
        'Saving essay-v2.docx to school drive and keeping essay-v1.docx avoids losing the earlier draft when edits go wrong. '
        'Only having the file on a phone with a cracked screen and no copy is a single point of failure.',
        'Which is a real backup: the same file opened twice on one laptop, or a copy on a school drive plus the laptop?',
        'A copy on school drive plus the laptop is a backup pattern; two windows on one device are not separate storage.',
        'Assuming “I emailed it to myself once years ago” without checking the attachment still opens.',
        'Describe a backup plan for a project due Friday with two locations and one version-naming rule.',
    ),
    spec(
        's5-information-software-technology-y9-w04-l1',
        ['table', 'field', 'record', 'sort'],
        'A data table organises records (rows) and fields (columns). '
        'Sorting rearranges rows by a field; it does not invent new facts. '
        'Clean field names make sorting and filtering reliable.',
        'A class table with fields Name, House, Points can sort by Points descending to see ranks. '
        'Sorting does not change how many points anyone earned.',
        'In a table of books with fields Title and Year, what does sorting by Year ascending do?',
        'It lists rows from earliest year to latest; titles stay attached to their years.',
        'Thinking sort deletes rows that are not first. Sort reorders; it should keep all records.',
        'Design a three-field table for a sport carnival (example fields). Show what sorting by one field would help a teacher see.',
    ),
    spec(
        's5-information-software-technology-y9-w04-l2',
        ['filter', 'query', 'criteria', 'subset'],
        'Filtering shows only rows that match criteria, creating a subset view. '
        'Good criteria are exact enough to answer the question without hiding needed rows by accident.',
        'Filter House = “Blue” to list Blue competitors only. '
        'Filter Points ≥ 10 to see who already reached a milestone. Both leave other data stored — just hidden in the view.',
        'You need students who scored under 5. Which criterion fits: Points < 5, or Points > 50?',
        'Points < 5 matches scores under five.',
        'Filtering and then saving over the only file so unmatched rows are destroyed. Use a view or a new export; keep the full table.',
        'Write two filter criteria for a library table (Genre, Available). State which question each filter answers.',
    ),
    spec(
        's5-information-software-technology-y9-w05-l1',
        ['accuracy', 'validation', 'range', 'typo'],
        'Accurate data is correct for the real world. Validation rules catch impossible values (age 200, empty required name). '
        'Typos and wrong units break decisions even when charts look neat.',
        'A form rejects Temperature = 900 °C for a classroom logger because the range check is 0–50 °C. '
        'That validation does not insult the user — it prevents garbage data.',
        'Which value should fail a Year 7 height field measured in cm: 160, or 1600?',
        '1600 cm fails a sensible human-height range; 160 cm is plausible.',
        'Turning validation off because it is annoying, then trusting every chart afterward.',
        'Invent three fields for a club signup and one validation rule for each (required / range / format).',
    ),
    spec(
        's5-information-software-technology-y9-w05-l2',
        ['bias', 'sample', 'missing', 'question'],
        'Data can be biased if the sample leaves people out, questions lead answers, or missing values are ignored. '
        'Ask who was counted, who was not, and what the question assumed.',
        'Surveying only the robotics club about “favourite school subject” biases toward tech interest. '
        'A fairer sample includes more groups — or the report must admit the limit.',
        'A poll at the canteen queue asks “Don’t you agree the canteen is too slow?” Why is the question problematic?',
        'It leads the answer toward yes and samples only people already waiting — two bias risks.',
        'Publishing a big percentage without saying how few people answered.',
        'Rewrite a biased question to a neutral one and name one sample limit you would report.',
    ),
    spec(
        's5-information-software-technology-y9-w06-l1',
        ['privacy', 'personal data', 'consent', 'minimise'],
        'Personal data identifies someone (name, photo, student ID, location history). '
        'Collect only what you need, keep it secure, and follow school consent rules. '
        'Projects should minimise data — not scrape “everything just in case.”',
        'A lost-property app needs item description and room — not every student’s home address. '
        'Publishing full names with photos publicly needs clear permission pathways.',
        'Which dataset is more privacy-sensible for a class temperature project: anonymous room averages, or named student home addresses?',
        'Anonymous room averages — home addresses are unnecessary personal data for that goal.',
        'Copying a classmate’s password to “help them finish.” That breaks privacy and school rules.',
        'List data your group wants for a school-safe project. Cross out anything not required and justify one deletion.',
    ),
    spec(
        's5-information-software-technology-y9-w06-l2',
        ['password', 'unique', 'manager', 'sharing'],
        'Strong practice: unique passwords, not shared, long and hard to guess; use school-approved managers if provided. '
        'Never embed passwords in shared screenshots or slideshows. '
        'Teachers reset portals through official channels — not through classmates.',
        'Using the same password “Soccer1” on every site means one leak opens many doors. '
        'A unique passphrase per important account limits the blast radius.',
        'Safer response if a friend asks for your login: refuse and suggest official reset help, or hand over the password once?',
        'Refuse and use official help. Sharing logins breaks rules and safety.',
        'Writing passwords on a sticky note under the keyboard as the main strategy.',
        'Create a four-rule password poster for your class (unique, length, no sharing, official resets). No real passwords written.',
    ),
]

SEEDS = [s['seed_key'] for s in LESSONS]
VISUALS = {
    's5-information-software-technology-y9-w01-l1': visuals(
        ('Data', '16'), ('Information', '16 °C at 9 am'),
        'Bare number versus labelled temperature reading.',
        'Context turns data into information.',
        ('Unlabelled', 'column'), ('Labelled', 'units'),
        'Labels and units create usable information.',
        'School-safe examples only.',
    ),
    's5-information-software-technology-y9-w01-l2': visuals(
        ('Bit', '0/1'), ('Byte', '8 bits'),
        'A byte groups eight bits.',
        'Bits build bytes; files use many bytes.',
        ('Text note', 'small'), ('Photo', 'MB'),
        'Photos usually dwarf plain text in size.',
        'Sizes are typical, not exact for every file.',
    ),
    's5-information-software-technology-y9-w02-l1': visuals(
        ('Input', 'keys'), ('Output', '48'),
        'Calculator keys in, result out.',
        'Input → process → output.',
        ('Process', 'multiply'), ('Store?', 'optional'),
        'Processing transforms inputs to outputs.',
        'No hacking content.',
    ),
    's5-information-software-technology-y9-w02-l2': visuals(
        ('Hardware', 'keyboard'), ('Software', 'browser'),
        'Touch the keyboard; run the browser.',
        'Hardware and software work together.',
        ('Repair screen', 'hardware'), ('Update app', 'software'),
        'Different changes target different layers.',
        'School computer examples.',
    ),
    's5-information-software-technology-y9-w03-l1': visuals(
        ('Folder', 'Science'), ('File', 'results.txt'),
        'Folder holds the text file with .txt type.',
        'Paths show location; extensions hint type.',
        ('Photos/Camp', 'day1.png'), ('Type', 'image'),
        'Read folders left to right in the path.',
        'Do not strip extensions carelessly.',
    ),
    's5-information-software-technology-y9-w03-l2': visuals(
        ('Copy A', 'laptop'), ('Copy B', 'school drive'),
        'Two locations mean a real backup pattern.',
        'Separate storage beats two windows on one device.',
        ('v1', 'kept'), ('v2', 'editing'),
        'Version names protect the earlier draft.',
        'Check that the backup actually opens.',
    ),
    's5-information-software-technology-y9-w04-l1': visuals(
        ('Record', 'row'), ('Field', 'column'),
        'Rows are records; columns are fields.',
        'Tables organise data for sorting.',
        ('Sort', 'by Points'), ('Ranks', 'appear'),
        'Sorting reorders; it does not invent scores.',
        'Keep field names clear.',
    ),
    's5-information-software-technology-y9-w04-l2': visuals(
        ('Filter', 'House=Blue'), ('Subset', 'view'),
        'Filter shows matching rows only.',
        'Criteria build a subset view.',
        ('Points < 5', 'select'), ('Others', 'hidden not deleted'),
        'Hidden rows should remain in the full table.',
        'Export carefully — keep the master file.',
    ),
    's5-information-software-technology-y9-w05-l1': visuals(
        ('Valid', '160 cm'), ('Reject', '1600 cm'),
        'Range checks catch impossible heights.',
        'Validation protects accuracy.',
        ('Required', 'name'), ('Empty', 'blocked'),
        'Required fields stop blank identities.',
        'Neat charts still fail on bad data.',
    ),
    's5-information-software-technology-y9-w05-l2': visuals(
        ('Biased sample', 'one club'), ('Fairer', 'many groups'),
        'Who you ask shapes the result.',
        'Report sample limits honestly.',
        ('Leading Q', 'Don’t you agree…'), ('Neutral Q', 'How fast…'),
        'Neutral wording reduces pressure to agree.',
        'Percentages need sample size context.',
    ),
    's5-information-software-technology-y9-w06-l1': visuals(
        ('Need', 'room + item'), ('Not need', 'home address'),
        'Collect only data the goal requires.',
        'Minimise personal data.',
        ('Consent', 'school rules'), ('Public post', 'permission'),
        'Photos and names need clear permission paths.',
        'Follow acceptable use.',
    ),
    's5-information-software-technology-y9-w06-l2': visuals(
        ('Unique', 'per account'), ('Reuse', 'risk spreads'),
        'One leaked reused password opens many doors.',
        'Unique passwords limit damage.',
        ('Share login', 'refuse'), ('Official reset', 'help'),
        'Do not share passwords with classmates.',
        'No real passwords on the poster.',
    ),
}


if __name__ == '__main__':
    written = write_elective_batch(
        LESSONS, VISUALS, subject=SUBJECT, source_url=SOURCE, source_note=NOTE, out_dir=OUT,
    )
    print({'wrote': len(written), 'seeds': written})
