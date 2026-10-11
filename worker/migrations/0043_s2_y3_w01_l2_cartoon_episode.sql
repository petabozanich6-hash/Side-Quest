-- Year 3, Week 1, Lesson 2: pilot cartoon episode "Pip and Juno fix a sentence".
-- Puts the episode at the top of teach step 1 (visual_before). It is played by CartoonEpisode.jsx through QuestVisual.
-- This replaces the earlier SVG visual_before on step 1 only. All other lesson content is untouched.
-- Requires the frontend change in the same pull request. Original script, no external media.
UPDATE lessons
SET data = json_set(data, '$.teach_steps[0].visual_before', json('{
  "episode": {
    "title": "Pip and Juno: The Missing Piece",
    "transcript": "Pip wrote a message that said Ran down the hill. Juno explained that a sentence needs who or what it is about and what they did, plus a capital letter and an end mark. They fixed a fragment, split a run-on, added detail one piece at a time, and finished by reading aloud to check.",
    "scenes": [
      {"bg": "park", "lines": [
        {"who": "pip", "text": "Hi! I am Pip. I wrote a message for my friend, but she did not understand it."},
        {"who": "juno", "text": "Hello, Pip! I am Juno. Let us read it aloud. What did you write?"},
        {"who": "pip", "text": "I wrote: ran down the hill.", "blocks": [{"t": "ran down the hill.", "c": "bad"}]},
        {"who": "juno", "text": "Hmm. Who ran down the hill? The words do not tell us. That is called a fragment, because a piece is missing."},
        {"who": "juno", "text": "A sentence needs two parts. First, who or what it is about. Second, what they did.", "blocks": [{"t": "Who or what?", "c": "who"}, {"t": "Did what?", "c": "did"}]},
        {"who": "pip", "text": "So I need to say who ran! The boy ran down the hill.", "blocks": [{"t": "The boy", "c": "who"}, {"t": "ran down the hill", "c": "did"}, {"t": ".", "c": "mark"}]}
      ]},
      {"bg": "room", "lines": [
        {"who": "juno", "text": "Now check the rules. A sentence starts with a capital letter, and it ends with a full stop, a question mark or an exclamation mark.", "blocks": [{"t": "The", "c": "mark"}, {"t": "boy ran down the hill", "c": "plain"}, {"t": ".", "c": "mark"}]},
        {"who": "pip", "text": "Here is my second message: the dog barked the cat ran away the boy laughed.", "blocks": [{"t": "the dog barked the cat ran away the boy laughed.", "c": "bad"}]},
        {"who": "juno", "text": "That is a run-on. Too many ideas are squashed together. Take a breath where each idea stops."},
        {"who": "pip", "text": "I can split it into three sentences!", "blocks": [{"t": "The dog barked.", "c": "det"}, {"t": "The cat ran away.", "c": "det"}, {"t": "The boy laughed.", "c": "det"}]},
        {"who": "juno", "text": "Or you can join two ideas with a joining word, like and, but or so.", "blocks": [{"t": "The dog barked,", "c": "det"}, {"t": "and", "c": "mark"}, {"t": "the cat ran away.", "c": "det"}]}
      ]},
      {"bg": "evening", "lines": [
        {"who": "pip", "text": "Can I make my sentence more interesting?", "blocks": [{"t": "The dog ran.", "c": "plain"}]},
        {"who": "juno", "text": "Yes! Add one detail at a time. Where did it run?", "blocks": [{"t": "The dog ran", "c": "plain"}, {"t": "across the park.", "c": "det"}]},
        {"who": "juno", "text": "When did it run? And what kind of dog was it?", "blocks": [{"t": "After lunch,", "c": "det"}, {"t": "the", "c": "plain"}, {"t": "brown", "c": "det"}, {"t": "dog ran across the park.", "c": "plain"}]},
        {"who": "pip", "text": "That paints a picture! How do I know my sentence is finished?"},
        {"who": "juno", "text": "Read it aloud, then check three things. A capital letter and an end mark. Who or what, and what they did. And does it make complete sense?", "blocks": [{"t": "1 Capital letter and end mark", "c": "who"}, {"t": "2 Who and did what", "c": "did"}, {"t": "3 Makes sense", "c": "det"}]},
        {"who": "pip", "text": "Now my friend understands! Thanks, Juno. See you next time, Sentence Builders!"}
      ]}
    ]
  }
}'))
WHERE seed_key = 's2-eng-y3-w01-l2';
