"""Stage 2 English, Block A, week 6: pass 2 (videos and external links).
Import LESSONS from this module when registering. Helpers come from the week 10 pass 2 module.
Video status: 'transcript' means the transcript excerpt was seen and matches the lesson;
'description' means title and description only (play once before relying on it).
Gaps: lesson 1 (problem and complication) has no verified video or link.
Lessons 2 and 3 have no external link yet.
The video 'Nouns and noun groups' (0H_fb6zTueg) matched lesson 3 by transcript but its page
showed 'Video unavailable', so it was not used.
"""
from lesson_library_s2_english_a_wk6 import A6L1, A6L2, A6L3, A6L4
from lesson_library_s2_english_b_wk10_pass2 import _link, _v

A6L2["resources"] = [
    _v("Mr Redjeb's Creative Class: Creating Tension and Suspense", "P4HkHs2PF8k",
       "Watch once. Listen for the techniques: detailed description of the surroundings, short sharp sentences, the senses, and strong verbs. Pause on the list near the end and pick two to try.",
       "Reread step 1 to step 3 of the lesson.",
       ("What do short, sharp sentences do in a tense scene?", ["make the reader think about what is happening without giving an answer", "slow the story down with detail", "explain who the character is"], 0,
        "Short sentences make the reader wait and wonder."), "transcript"),
    _v("Creative writing: writing for suspense", "SckfHUPJmbM",
       "Watch once. It is a short video for younger viewers about techniques for building tension. Note one technique and try it in your scene.",
       "Reread step 4 of the lesson.",
       ("Which of these builds tension?", ["holding back the big reveal until after the build-up", "explaining everything at once", "ending with a recap"], 0,
        "Holding back the reveal keeps the reader in suspense."), "description"),
]

A6L3["resources"] = [
    _v("Let's Review Nouns, Verbs, and Adjectives", "U2l3BFthsD0",
       "Watch once. Listen for what an adjective does to a noun, then make up one adjective for each noun the video names.",
       "Reread step 1 of the lesson.",
       ("An adjective is a word that...", ["describes a noun", "shows an action", "names a place"], 0,
        "Adjectives describe nouns."), "transcript"),
]

A6L4["resources"] = [
    _v("Prefix for Kids: Prefixes Un-, Re-, Dis- (Mac Duff the Prefix Man)", "CgWj4e2AdLI",
       "Watch once. Listen for the meaning of un-, re- and dis-, then say one new word for each.",
       "Reread steps 2 to 4 of the lesson.",
       ("What does re- mean?", ["again", "not", "under"], 0,
        "Re- means again, as in rewrite."), "transcript"),
    _v("Prefixes re, un, bi, dis (English Grammar for 2nd Grade)", "txNARc6bCxI",
       "Watch once. Notice that a prefix goes before a base word and changes its meaning. Ignore bi- for this lesson.",
       "Reread step 1 of the lesson.",
       ("In 'disconnect', what is the prefix?", ["dis", "connect", "con"], 0,
        "Dis is added to the base word connect."), "description"),
    _link("BBC Bitesize: Using prefixes",
          "https://www.bbc.co.uk/bitesize/articles/z2gnm39",
          "Open the link and read the sections on un-, dis- and re-. Then read the note that not every prefix can go with every root word. Try the activity that matches prefixes to root words and write a sentence for each new word.",
          "The examples unhappy, disagree and reappear, and the warning that dis- cannot go on happy.",
          "Why can you add un- to happy but not dis-?"),
]

LESSONS = [A6L1, A6L2, A6L3, A6L4]
