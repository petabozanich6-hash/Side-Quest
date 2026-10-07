"""Stage 2 English, Block B, week 9: pass 2 (external links).
The base module already embeds videos in every lesson (two each in L1 and L4).
Transcript-checked: lOUnhSMGdOo, 5Mrb6wzbWmM, rQuWqcVzqUU. Still to check on playback: 5hGyLcNBZoM, GYIVwQdlmiw, f9fy4NREF-E.
This module adds BBC Bitesize and BBC Teach links. Import LESSONS from here when registering.
Known content issues in the base file (not changed here):
- L4 step 6 says to find four homophone mistakes in the paragraph, but its answer lists seven corrections.
- L4 step 3 'SEA has EA like ocean waves' is a weak memory trick.
- L1 and L2 Bitesize pages are KS1 or Scottish second level, so the child may find them easy. Use them as quick revision.
"""
from lesson_library_s2_english_b_wk9 import B9L1, B9L2, B9L3, B9L4
from lesson_library_s2_english_b_wk10_pass2 import _link

B9L1["resources"] = list(B9L1.get("resources", [])) + [
    _link("BBC Bitesize: What is a rhyme scheme?",
          "https://www.bbc.co.uk/bitesize/articles/z83g2nb",
          "Read how to label end words with letters, then label the scheme of your parent-chosen poem. Check it against the ABAB example on the page.",
          "Label rhyming end words with the same letter. A poem where lines 1 and 3 rhyme and lines 2 and 4 rhyme is ABAB.",
          "What letters would you give a poem whose first and third lines rhyme?"),
    _link("BBC Bitesize: Rhyming poetry",
          "https://www.bbc.co.uk/bitesize/articles/z3jt7yc",
          "Watch the rhyme scheme video, then read the reminder that rhyme depends on sound and not spelling. Skip the writing activity until Lesson 2.",
          "Words that rhyme have the same end sound, even if the letters differ.",
          "Can two words rhyme when their spelling endings differ?"),
]

B9L2["resources"] = list(B9L2.get("resources", [])) + [
    _link("BBC Bitesize: Rhyming poetry (writing activity)",
          "https://www.bbc.co.uk/bitesize/articles/z3jt7yc",
          "Use the later activities: choose an animal, list rhyming pairs, then write a four-line AABB poem with one pair at the end of lines one and two and the other at lines three and four.",
          "Choose rhyming pairs first and use them as end words.",
          "Which two pairs will you use as your end words?"),
    _link("BBC Bitesize: Writing poetry",
          "https://www.bbc.co.uk/bitesize/articles/zsbsxbk",
          "Watch the short clip, then answer the questions about rhythm, rhyme scheme and alliteration for the Christina Rossetti poem. Use her poem as a model for your own nature poem.",
          "Poems often have rhythm like a beat in music and can use rhyme and alliteration.",
          "Is the rhythm of the Rossetti poem slow or fast, and why?"),
]

B9L3["resources"] = list(B9L3.get("resources", [])) + [
    _link("BBC Bitesize: What is onomatopoeia?",
          "https://www.bbc.co.uk/bitesize/articles/z8t3g82",
          "Watch the video, then do the zoo activity: list at least eight noises, then write a poem of at least five lines with a different sound word in each. Add alliteration if you can.",
          "Onomatopoeia is a word that sounds like what it means, such as thud, crash, bang and buzz.",
          "Which sound word in your list sounds most like its noise?"),
]

B9L4["resources"] = list(B9L4.get("resources", [])) + [
    _link("BBC Bitesize: Their, they're or there?",
          "https://www.bbc.co.uk/bitesize/articles/zk2c92p",
          "Watch the clip, then do the nine-sentence activity: three each for their, they're and there. Use this for the common trio, which is not in this week's six pairs.",
          "Their means belonging to them, they're means they are, and there refers to a place.",
          "What do the letters in they're stand for?"),
    _link("BBC Teach: KS2 English: Homophones",
          "https://www.bbc.co.uk/teach/class-clips-video/articles/z732t39",
          "Watch the animated film, which uses ball and bawl as an example before moving to their, there and they're with ways to remember each. Pick one of its memory strategies for a pair from this week.",
          "Homophones sound the same but often differ in spelling and meaning, so you must choose the right one.",
          "Which strategy will help you remember write and right?"),
]

LESSONS = [B9L1, B9L2, B9L3, B9L4]
