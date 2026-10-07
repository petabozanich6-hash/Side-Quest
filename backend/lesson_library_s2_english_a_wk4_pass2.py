"""Stage 2 English, Block A, week 4: pass 2 (external links).
The base module already embeds videos in every lesson (two in L3).
Video ids came from search and must still be checked on playback: 341a-wTgFi0, Rfj4yFosaOw, QiZxIBHg9uc, 4Rm9l6y3-WY, CU4ucOYDedk.
This module adds BBC Bitesize links. Import LESSONS from here when registering.
Known content issues in the base file (not changed here):
- L1 step 3 'Look, say, do, feel' is fine, but the L1 model answer for 'Trait for She stayed behind to clean the whole kitchen alone' accepts 'helpful or hard-working', which is a judgement call. Accept either.
- L2 model answer sorter text has 'Dont touch that button' without the apostrophe. Fix to Don't.
- L3 step 2 lists 'has/had' under being verbs. Fine, but 'has' is often a helping verb. Not a fault.
- L4 step 3 says some letters are not joined 'after j, y, g'. This depends on the handwriting style, so the parent should follow their school's style.
- L4 video shows a cursive ladder-letter family. Check that the style matches the school's.
"""
from lesson_library_s2_english_a_wk4 import A4L1, A4L2, A4L3, A4L4
from lesson_library_s2_english_b_wk10_pass2 import _link

A4L1["resources"] = list(A4L1.get("resources", [])) + [
    _link("BBC Bitesize: Describing and creating characters",
          "https://www.bbc.co.uk/bitesize/articles/zg2tqfr",
          "Read how to build a character from name, job, clothing, appearance, home and likes and dislikes. Fill in the six-section planner for a new character, then use it for your description.",
          "Good characters have descriptive language and a personality, not just a list of features.",
          "Which of the six sections will help you show a trait?"),
]

A4L2["resources"] = list(A4L2.get("resources", [])) + [
    _link("BBC Bitesize: How to engage the reader in a story opening",
          "https://www.bbc.co.uk/bitesize/articles/zrkr2sg",
          "Read about narrative hooks and the ways to open: an unusual narrative voice, an unanswered question, an unusual event, or starting in the middle of dialogue. Match each to the techniques you learned today.",
          "A narrative hook grabs the reader right from the start, so they want to keep reading.",
          "Which hook technique makes you want to read on most?"),
    _link("BBC Bitesize: Openings and endings",
          "https://www.bbc.co.uk/bitesize/guides/zy722hv/revision/4",
          "Skim this one for the reminder that an opening should introduce the character and setting. It is written for older students, so read only the opening section.",
          "Use your opening to introduce your characters and the setting.",
          "What does your opening tell us about the character and setting?"),
]

A4L3["resources"] = list(A4L3.get("resources", [])) + [
    _link("BBC Bitesize: What are past, present and future tense?",
          "https://www.bbc.co.uk/bitesize/articles/z3dbg82",
          "Watch the video and do the activity. Notice the 'Moop will ate ice cream' mix-up, where will is future and ate is past, then write three sentences: one about yesterday, one about now and one about tomorrow.",
          "You can tell the tense of a sentence by looking at the verb. Mismatched tenses make a sentence incorrect.",
          "What is wrong with a sentence that mixes will and ate?"),
    _link("BBC Bitesize: Verbs and how to use them",
          "https://www.bbc.co.uk/bitesize/articles/z34tjfr",
          "Work through the page on verbs, tenses and auxiliary (helping) verbs. This links to your verb group work.",
          "Verbs can be in different tenses and sometimes need helping verbs to make sense.",
          "Which helping verb did you use in your verb group?"),
]

A4L4["resources"] = list(A4L4.get("resources", [])) + [
    _link("BBC Bitesize: Handwriting, joining letters",
          "https://www.bbc.co.uk/bitesize/articles/z87t2v4",
          "Read about long ladder letters (l, i, t, u, j, y) and curly caterpillar letters (c, o, a, s), then write each word on the list four times, finishing with the tongue twister.",
          "Curly caterpillar letters start with the curl. Sit with both feet on the floor, back straight and paper at an angle.",
          "Which letter family does the letter d belong to?"),
]

LESSONS = [A4L1, A4L2, A4L3, A4L4]
