"""Stage 2 English, Block A, week 5: pass 2 (videos and external links).
Import LESSONS from this module when registering. Helpers come from the week 10 pass 2 module.
Video status: 'transcript' means the transcript excerpt was seen and matches the lesson;
'description' means title and description only (play once before relying on it).
Lesson 1 (setting and atmosphere) and lesson 4 (synonyms for said and walked) still need
a dedicated external link; none has been verified yet.
"""
from lesson_library_s2_english_a_wk5 import A5L1, A5L2, A5L3, A5L4
from lesson_library_s2_english_b_wk10_pass2 import _link, _v

A5L2["resources"] = [
    _v("Writing Videos for Kids: Show, Don't Tell", "WYAg1FU-zHQ",
       "Watch once. Listen for when it is fine to tell and when to show. Then think of one feeling and say how you would show it.",
       "Reread step 1 and step 2 of the lesson.",
       ("What does 'show, don't tell' ask a writer to do?", ["let the reader see what is happening through actions, speech and reactions", "use as few words as possible", "always name the feeling"], 0,
        "Showing uses what characters do, say and how they react."), "transcript"),
    _v("Creative Writing For Kids: Show Don't Tell", "rMd1ycgA-iQ",
       "Watch once. Notice how the writer shares information through how a character feels about a place instead of listing details.",
       "Reread step 4 and step 5 of the lesson.",
       ("Which is a better way to show a room?", ["say how the character feels about what is in it", "list every object", "write one long sentence"], 0,
        "Describing a character's feelings about things shows more than a list."), "transcript"),
]

A5L3["resources"] = [
    _v("Adverbs for Kids (Learn and Play Online)", "VW8JCk_kuyY",
       "Watch once. Listen for the questions adverbs answer: how, when, where and how often.",
       "Reread step 1 and step 2 of the lesson.",
       ("Adverbs add detail by telling us...", ["how, when, where or how often something happens", "who the characters are", "how a story ends"], 0,
        "Adverbs tell us how, when, where or how often."), "transcript"),
    _v("Adverbs for Kids: How, When, Where, and How Often", "Enaeun07_ZQ",
       "Watch once. For each example, ask yourself which verb the adverb is describing.",
       "Reread step 3 of the lesson.",
       ("In 'Oliver waited patiently', which word is the adverb?", ["patiently", "waited", "Oliver"], 0,
        "Patiently tells us how Oliver waited."), "transcript"),
    _link("BBC Bitesize: Learn about adverbs and how to use them in a sentence",
          "https://www.bbc.co.uk/bitesize/articles/zgtn239",
          "Open the link and read the sections on adverbs of manner, time and place. Then find the part about moving an adverb to the start of a sentence and the comma that follows it.",
          "The example 'Susan waited patiently for her pizza' and the sentence 'Suddenly, the lights went out'.",
          "Why is there a comma after 'Suddenly'?"),
]

A5L4["resources"] = [
    _v("Synonyms for Kids (Grammar for Elementary Students)", "hFFW9zKJ5os",
       "Watch once. Then think of a synonym for big, happy and small before you move on.",
       "Reread step 1 of the lesson.",
       ("Synonyms are words that...", ["have the same or nearly the same meaning", "have opposite meanings", "sound the same"], 0,
        "Synonyms mean the same or nearly the same."), "transcript"),
    _v("Synonyms for Kids (Learning Videos For Kids)", "Jrn3jegWUAA",
       "Watch once. Notice how synonyms help us say exactly what we mean. Pick one pair and use it in a sentence.",
       "Reread step 2 and step 3 of the lesson.",
       ("Why do writers use synonyms?", ["to describe things better and avoid repeating words", "to make words rhyme", "to shorten sentences"], 0,
        "Synonyms help express ideas more precisely."), "transcript"),
]

LESSONS = [A5L1, A5L2, A5L3, A5L4]
