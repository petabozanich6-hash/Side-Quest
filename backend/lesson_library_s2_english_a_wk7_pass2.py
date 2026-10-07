"""Stage 2 English, Block A, week 7: pass 2 (external links).
The base module already embeds one video each in lessons 2, 3 and 4 (lcD6ijirN2g, qxTTQ8t7OcY, U_6mfwXe3Bo).
Those ids came from search and have not been checked on playback or by transcript in this audit.
This module adds external links and a lesson 1 resource. Import LESSONS from here when registering.
Gaps: lesson 1 has no embeddable video, only a link to a page for teachers' use (Kidzovo).
The Kidzovo page was seen by description only. Open it once before relying on it.
"""
from lesson_library_s2_english_a_wk7 import A7L1, A7L2, A7L3, A7L4
from lesson_library_s2_english_b_wk10_pass2 import _link

A7L1["resources"] = list(A7L1.get("resources", [])) + [
    _link("Kidzovo: Crafting Thoughtful Endings for Narrative Writing",
          "https://kidzovo.com/videos/crafting-thoughtful-endings-for-narrative-writing/",
          "Open the page and watch the video with your parent. Listen for how the teacher ties up loose ends and adds a reflection. Then reread your own ending and add one reflection sentence.",
          "Tying up loose ends and reflecting on the events of the story.",
          "What does the teacher add to an ending to show how the story has changed the character?"),
    _link("BBC Bitesize: How to plan your story",
          "https://www.bbc.co.uk/bitesize/articles/zqmkh39",
          "Read the section on the resolution and the ending. Notice how the resolution answers the problem and the ending can include a twist. Compare it with the four ending types in the lesson.",
          "The resolution step and the ending step, including the idea of an unexpected twist.",
          "How does the knight in the example solve the problem?"),
]

A7L2["resources"] = list(A7L2.get("resources", [])) + [
    _link("BBC Bitesize: Story writing: planning a story",
          "https://www.bbc.co.uk/bitesize/articles/zrsxhbk",
          "Watch the planning video on the page, then read the story mountain tips. Compare the story mountain with your own paragraph plan and note where they match: opening, build up, problem, resolution and ending.",
          "The five parts of the story mountain and the note-taking plan (short notes, not full sentences).",
          "Which part of the story mountain matches your complication?"),
]

A7L3["resources"] = list(A7L3.get("resources", [])) + [
    _link("BBC Bitesize: How to write a complex sentence",
          "https://www.bbc.co.uk/bitesize/articles/z2cp7yc",
          "Read the page with your parent. Look at the three examples of a subordinate clause at the start, middle and end of a sentence. Write your own three versions of one sentence.",
          "Subordinate clauses need the main clause to make sense, and they begin with a conjunction such as although, because or when.",
          "Where can the subordinate clause go in a sentence?"),
]

A7L4["resources"] = list(A7L4.get("resources", [])) + [
    _link("BBC Bitesize: Prefixes and suffixes (Year 2)",
          "https://www.bbc.co.uk/bitesize/topics/z7tdp9q",
          "Open the page and find the clip on how to use the suffix -ly. Watch it once, then write three new -ly words and use each in a sentence.",
          "How adding -ly changes the meaning of a word.",
          "What does -ly do to the word 'quick'?"),
]

LESSONS = [A7L1, A7L2, A7L3, A7L4]
