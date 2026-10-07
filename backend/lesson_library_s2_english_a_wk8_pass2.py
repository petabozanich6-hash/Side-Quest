"""Stage 2 English, Block A, week 8: pass 2 (external links).
The base module already embeds one video each in lessons 1, 2 and 3 (R9-ONtB1GBY, nSu0lvaoSOI, t8q2Bx8q4L0).
Those ids came from search and have not been checked on playback or by transcript in this audit.
This module adds external links and gives lesson 4 its first resources. Import LESSONS from here when registering.
Gaps: lesson 4 has no embeddable video, only two links.
The lesson 3 video covers commas in lists only. The comma after an opening clause is covered by the
Bitesize complex sentence link added here.
"""
from lesson_library_s2_english_a_wk8 import A8L1, A8L2, A8L3, A8L4
from lesson_library_s2_english_b_wk10_pass2 import _link

A8L1["resources"] = list(A8L1.get("resources", [])) + [
    _link("BBC Bitesize: What are the first, second and third person?",
          "https://www.bbc.co.uk/bitesize/articles/zxdhsg8",
          "Read the first person and third person sections with your parent. Skip the second person section for now, as the lesson covers only first and third. Then try the rewriting activity: change the first-person sentences to third person and the third-person sentences to first person.",
          "First person uses I and puts you inside the story. Third person uses a name or he or she.",
          "What pronouns change when you rewrite 'I saw two messy monsters' in the third person?"),
]

A8L2["resources"] = list(A8L2.get("resources", [])) + [
    _link("BBC Bitesize: Editing and redrafting",
          "https://www.bbc.co.uk/bitesize/articles/zmbr47h",
          "Read the redrafting checklist (content, structure, vocabulary and language), then the proofreading tips. Choose two tips to use on your own paragraph, such as reading it aloud or reading it backwards.",
          "Redrafting comes first, and proofreading is done at the end of the redrafting process.",
          "Which proofreading tip will you try first, and why?"),
]

A8L3["resources"] = list(A8L3.get("resources", [])) + [
    _link("BBC Bitesize: How to use commas in a list",
          "https://www.bbc.co.uk/bitesize/articles/zjs8wty",
          "Read the page and notice that every item gets a comma except the last two, which are joined by and. Then write your own list of four items and punctuate it.",
          "A comma separates each item in the list, except the last two, which are joined by 'and'.",
          "Which two items in a list are not separated by a comma?"),
    _link("BBC Bitesize: How to write a complex sentence",
          "https://www.bbc.co.uk/bitesize/articles/z2cp7yc",
          "Use this page for the opening clause part of the lesson. Find an example with the subordinate clause at the start and check where the comma goes. Then move the clause in one of your own sentences to the front.",
          "The subordinate clause adds detail and needs the main clause to make sense.",
          "Where does the comma go when the subordinate clause comes first?"),
]

A8L4["resources"] = list(A8L4.get("resources", [])) + [
    _link("BBC Bitesize: Their, they're or there?",
          "https://www.bbc.co.uk/bitesize/articles/zk2c92p",
          "Watch the short clip on the page and read the three meanings. Then do the activity: write nine sentences, three each for their, they're and there.",
          "Their means it belongs to them. They're is short for they are. There refers to a place.",
          "What does the apostrophe in they're show?"),
    _link("BBC Teach: KS2 English: Homophones",
          "https://www.bbc.co.uk/teach/class-clips-video/articles/z732t39",
          "Watch the animated film with your parent. It introduces homophones and then explains their, there and they're with ways to remember which to use. Pause after each word and say your own sentence.",
          "Homophones sound the same but have different meanings and often different spellings.",
          "Which memory strategy from the film will you use for there?"),
]

LESSONS = [A8L1, A8L2, A8L3, A8L4]
