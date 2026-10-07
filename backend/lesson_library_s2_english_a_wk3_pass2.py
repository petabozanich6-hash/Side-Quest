"""Stage 2 English, Block A, week 3: pass 2 (external links).
The base module already embeds videos in every lesson (two each in L1 and L2).
Video ids came from search and must still be checked on playback: bXG_2wxFPC0, cYqmNO6gr2Y, HAVW3b7E0TI, dNzusPXfq24, gQsZr8yrsno, fgQ7jurdxF4.
This module adds BBC Bitesize and BBC Teach links. Import LESSONS from here when registering.
Known content issues in the base file (not changed here):
- L4 step 5 lists 'busy + ness = business'. Business is a different word (said BIZ-ness). The -ness word is busyness. Replace the example.
- L4 step 5 lists 'worry + less = worryless (rare)' and 'enjoy + ment'. Neither is a good example. Remove them.
- L4 step 4 lists 'cleanness' and 'meanness'. Both are valid but 'cleanness' is rare. Consider 'fitness' or 'greatness'.
- Bitesize and BBC Teach pages label the stages as a story mountain (opening, build up, problem, resolution, ending). Our lessons use orientation, complication, climax and resolution. Tell the child the two sets match up.
"""
from lesson_library_s2_english_a_wk3 import A3L1, A3L2, A3L3, A3L4
from lesson_library_s2_english_b_wk10_pass2 import _link

A3L1["resources"] = list(A3L1.get("resources", [])) + [
    _link("BBC Bitesize: How is a story structured?",
          "https://www.bbc.co.uk/bitesize/articles/zwmt4qt",
          "Read how a story mountain has an opening, build up, problem, resolution and ending. Match each to our four stages: orientation is the opening, complication is the build up, climax is the problem at the peak, and resolution is the resolution and ending.",
          "Most stories follow a structure often drawn as a story mountain.",
          "Which part of the mountain is the most thrilling?"),
]

A3L2["resources"] = list(A3L2.get("resources", [])) + [
    _link("BBC Bitesize: How to plan your story",
          "https://www.bbc.co.uk/bitesize/articles/zqmkh39",
          "Watch the clip, then follow the activity to draw a story mountain and write short notes at each label. Notes only, not full sentences yet.",
          "Writers plan before they write so they know what is going to happen.",
          "What questions does the page ask you to answer at the opening?"),
    _link("BBC Bitesize: Story writing, planning a story",
          "https://www.bbc.co.uk/bitesize/articles/zrsxhbk",
          "Optional extension. It covers story types and a story mountain plan, and is aimed at older children, so read it with your parent.",
          "A story mountain plan helps you follow your plan as you write.",
          "What would you put at the peak of your own story mountain?"),
]

A3L3["resources"] = list(A3L3.get("resources", [])) + [
    _link("BBC Teach: KS2 / KS3 English Language: Nouns and Noun Phrases",
          "https://www.bbc.co.uk/teach/class-clips-video/articles/zbr392p",
          "Watch farmer Frank bake an unusual cake and learn about nouns, proper nouns and noun phrases. Then try expanding nouns with words before and after, as in the lesson. 'Noun phrase' means the same as our 'noun group'.",
          "Noun phrases make writing sound more interesting.",
          "Can you expand the noun 'cake' with words before and after it?"),
]

A3L4["resources"] = list(A3L4.get("resources", [])) + [
    _link("BBC Bitesize: Prefixes and suffixes (KS2 topic)",
          "https://www.bbc.co.uk/bitesize/topics/zqqsw6f",
          "Browse the suffix videos and activities for extra practice. Choose one that covers -ful, -less or -ness, and skip the prefix ones for now.",
          "Suffixes change the meaning or job of a base word.",
          "Which of -ful, -less or -ness did you find hardest to spell?"),
]

LESSONS = [A3L1, A3L2, A3L3, A3L4]
