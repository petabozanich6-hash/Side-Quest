"""Stage 2 English, Block B, week 10: pass 2 (videos and external links).
Attaches embedded videos and straight-to-the-page external links to the four lessons from pass 1.
Import LESSONS from this module (not from lesson_library_s2_english_b_wk10) when registering in pass 3.

Video status: each video notes how it was checked. 'description' means title and description only;
play each once before relying on it. Every video check question tests the main idea, so it can be
answered from the lesson text if a video is unavailable.

External links use type 'article' (so existing rendering keeps working) plus extra fields:
instructions (what to do on the page), find (what to look for), checkpoint (a question to answer)
and parent_led (True when the page is written for older students).
"""
from lesson_library_s2_english_w1_w2 import _video
from lesson_library_s2_english_b_wk10 import B10L1, B10L2, B10L3, B10L4


def _link(title, url, instructions, find, checkpoint, parent_led=False):
    return {"type": "article", "title": title, "url": url, "external": True, "instructions": instructions,
            "find": find, "checkpoint": checkpoint, "parent_led": parent_led}


def _v(title, vid, prompt, offline, chk, verified):
    v = _video(title, vid, prompt, offline, chk)
    v["verified"] = verified
    return v


B10L1["resources"] = [
    _v("Imagery in Poetry: how poems create mental pictures", "TFpxHlzasY0",
       "Watch once. Pause when the video names a sense and say which line used it. Then say in your own words what imagery does for a reader.",
       "Reread step 1 and step 2 of the lesson and say the five senses aloud.",
       ("What does imagery help a reader do?", ["picture and sense a moment in their mind", "count syllables", "find rhymes"], 0,
        "Imagery uses the senses to create vivid mental pictures."), "description"),
    _link("BBC Teach: Making pictures with words",
          "https://www.bbc.co.uk/teach/class-clips-video/articles/zj2skmn",
          "Open the link and press play on the clip. Poet Joseph Coelho talks about describing things so the reader can picture them. Pause and write down one phrase that made a picture.",
          "A descriptive phrase and the sense it uses.",
          "Which sense does your phrase use, and what do you picture?"),
    _link("BBC Bitesize: What is imagery? (older students, read with a parent)",
          "https://www.bbc.co.uk/bitesize/articles/zf46trd",
          "A parent reads the first section aloud. Find the line that says what imagery is, then find one of the poem's images.",
          "The definition: language that creates pictures and appeals to the senses.",
          "Say that definition in your own words.", parent_led=True),
]

B10L2["resources"] = [
    _v("Free Verse Poetry for Kids", "b-kQby_EH-o",
       "Watch once. Listen for what makes a poem free verse. Pause at the examples and notice where each line ends.",
       "Reread step 1 and step 2 of the lesson.",
       ("A free verse poem...", ["has no set rhyme scheme or regular rhythm", "must have 5-7-5 syllables", "must rhyme"], 0,
        "Free verse lets the poet choose the shape."), "description"),
    _v("Haiku Poetry for Kids", "zZVGnx-82sc",
       "Watch once. Clap the syllables when the video does. Then count your own haiku lines the same way.",
       "Reread step 4 and step 5 of the lesson and clap the syllables of the example.",
       ("A haiku in English usually follows which pattern?", ["5, 7, 5 syllables", "4, 4, 4 syllables", "10, 10 syllables"], 0,
        "A haiku is three lines of 5, 7 and 5 syllables."), "description"),
    _link("BBC Teach: Understanding different poetry formats",
          "https://www.bbc.co.uk/teach/class-clips-video/articles/zfvkt39",
          "Open the link and play the clip. Joseph Coelho looks at forms including haiku. Pause on the haiku part and count the syllables in each line.",
          "The haiku example and its three lines.",
          "How many syllables are in each of the three lines?"),
    _link("BBC Bitesize: Limericks and haiku (older students, read with a parent)",
          "https://www.bbc.co.uk/bitesize/articles/z9jpn9q",
          "A parent reads the haiku section aloud. Find how haiku are built, then compare one example with your own haiku.",
          "The haiku rules and one example.",
          "Does your haiku follow the same rules? How do you know?", parent_led=True),
]

B10L3["resources"] = [
    _v("Simile and Metaphor for Kids", "uSeoHD_km0o",
       "Watch once. When the video asks simile or metaphor, pause and answer before it does.",
       "Reread step 2 and step 3 of the lesson.",
       ("What is the difference between a simile and a metaphor?", ["a simile uses like or as; a metaphor says one thing is another", "a simile rhymes; a metaphor does not", "there is no difference"], 0,
        "Similes use like or as; metaphors say one thing is another."), "transcript"),
    _v("What Are Similes and Metaphors? (KS2 English)", "kGzW7yU0cOU",
       "Watch once. Notice how the video finds the comparison in each example and says what it shows.",
       "Reread step 5 of the lesson.",
       ("Why do writers use similes and metaphors?", ["to help the reader build a picture in their mind", "to make a poem longer", "to count syllables"], 0,
        "Comparisons help readers picture what is described."), "transcript"),
    _link("BBC Bitesize: What are metaphors and similes?",
          "https://www.bbc.co.uk/bitesize/articles/zrk4ydm",
          "Open the link. Read 'What is a metaphor?' and 'What is a simile?', then try to spot the comparisons in the examples.",
          "The example 'Jess is dynamite' and the example 'as graceful as a gazelle'.",
          "Which of the two examples is a metaphor and which is a simile? How can you tell?"),
]

B10L4["resources"] = [
    _v("Latin and Greek Root Words (Language Skills for Kids)", "jWyX8vl6kMs",
       "Watch once. Pause each time a root is explained and write the root and its meaning on a card.",
       "Reread step 2 and step 3 of the lesson.",
       ("What does knowing a root help you do?", ["work out the meaning of unfamiliar words", "spell every word perfectly", "avoid dictionaries"], 0,
        "Roots help you decode word meanings."), "description"),
    _v("Latin and Greek roots and affixes (Khan Academy)", "fiaPqgwJFo4",
       "Watch once. Notice how a long word is split into parts. Try splitting one of this week's words the same way.",
       "Reread step 4 and step 5 of the lesson.",
       ("Roots and affixes help because they...", ["unlock the meaning of many words", "make words shorter", "change the spelling rules"], 0,
        "Word parts help you work out meanings."), "description"),
]

LESSONS = [B10L1, B10L2, B10L3, B10L4]
