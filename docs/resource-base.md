# Side Quest resource base (all subjects)

This file is the project's memory of outside resources. Read it before building or editing any lesson, in any subject. Update it in the same pull request whenever a resource is added, verified, or rejected.

## Rules agreed with the parent

- We write our own lessons. Outside resources support a lesson; they never replace it.
- Free resources only. No games. Interactive simulations are allowed as open tools to explore, not as games.
- Approved sources: YouTube, Khan Academy, BBC Bitesize, Oak National Academy, PhET. Twinkl links are allowed for the parent only (the parent has an account); do not embed or copy Twinkl files.
- The site is family-only but has a login. Khan Academy requires its notice ("All Khan Academy content is available for free at www.khanacademy.org") to show before login, and its content must not be framed with ads or placed behind a paid wall.
- Every resource needs an instruction for what to do if it cannot be embedded or will not load (fallback). Templates are at the end of this file.
- Never invent a URL or video id. Only add a resource after its exact page has been opened.
- Mark each resource `seen` (page contents checked) or `description` (title and snippet only; open or play it once before relying on it).

## Source notes

| Source | Use | Embedding and licence notes |
|---|---|---|
| Khan Academy | Videos and articles, all subjects | Embedding allowed for non-commercial use with attribution; no framing with ads or behind a paid login |
| BBC Bitesize | Videos, guides, quizzes (skip games) | Link only; no embedding terms found |
| Oak National Academy | Lessons, slides, videos | Free; Collection 1 is non-commercial educational use; Collection 2 is Open Government Licence v3.0; lesson videos cannot be downloaded, so use links or Oak's own player |
| PhET | Interactive science and maths simulations (explore screens, not game screens) | CC BY-NC 4.0; free non-commercial use and redistribution with attribution |
| YouTube | Embedded videos | Embed with a check question; add only ids whose page or transcript has been read |
| Twinkl | Parent-only links and printables | Link only; do not embed or copy |

## Other free sources found (not yet approved for embedding)

- ABC Education (Australian Curriculum videos; use videos only, not its games)
- NRICH, University of Cambridge (problem-solving tasks, free for parents)
- Math Antics (free videos with worksheets)
- The Math Learning Center (free virtual number line, fractions, geoboard tools)
- Illustrative Mathematics (CC BY) and EngageNY (CC BY-NC-SA) for maths content ideas
- HEA Australia free resources list, and Origo at Home (Australian home-education support)
- NSW Department of Education home schooling pages: syllabus templates, Curriculum Reform advice, parent literacy and numeracy pages. Link for parents only; the Department's stage resources are staff-only or school-only, and no reuse terms were found, so do not copy or embed them
- NSW Curriculum (curriculum.nsw.edu.au) for official syllabus text and outcome codes

## Excluded

Prodigy, Matific, Mathletics, Mathseeds and any other game or paid platform. Scootle needs teacher registration. Top Ten Maths is paid.

## Verified log

| Subject | Lesson (seed key) | Provider | Title | URL | Use | Status |
|---|---|---|---|---|---|---|
| Maths | s2-math-w04-l1, l2 | BBC Bitesize | Times tables 1-12 (skip games and songs) | https://www.bbc.co.uk/bitesize/articles/z97rdnb | Link | description |
| Maths | s2-math-w04-l1, l3 | BBC Bitesize | Year 4 Maths: Multiplying and dividing | https://www.bbc.co.uk/bitesize/topics/zm36g2p | Link, parent led | description |
| Maths | s2-math-w04-l2 | PhET | Area Model Multiplication (explore screens) | https://phet.colorado.edu/en/simulations/area-model-multiplication | Link; direct player https://phet.colorado.edu/sims/html/area-model-multiplication/latest/area-model-multiplication_en.html | description |

## Pending leads (exact URL still needed)

- Oak National Academy, Year 4: "Represent counting in sixes as the 6 times table" (maths week 4, lesson 1)
- Khan Academy Grade 3: multiplication of 6, 7, 8 and 9 videos (maths week 4)
- YouTube: no video ids verified yet in any maths lesson
- Maths weeks 1 to 3 and 5 to 10, and all other subjects: nothing gathered yet

## Fallback templates (copy into each resource)

- Page or video: "If it will not play or show here, open the link in a new tab. If it is still blocked or has moved, skip it, reread the lesson steps named above, and answer the check question from the lesson text."
- Simulation: "If it will not load on this device, open it on its own page. If it still will not run, do the same job on paper (for example, draw a rectangle for each multiplication, split it in two, add the part areas)."

## Lesson data format

The English pass-2 files attach a `resources` list to each lesson with videos (title, id, prompt, offline fallback, check question, verified status) and links (type article, url, instructions, find, checkpoint, parent_led). Follow that format for every subject.
