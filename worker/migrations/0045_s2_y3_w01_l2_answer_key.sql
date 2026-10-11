-- Year 3, Week 1, Lesson 2: add the missing answer key, parent check and self check
--
-- Lesson 2 was built before the frontend's full field list was checked, so it went
-- without these three parent-facing fields. Lessons 3 and 4 have all three. This
-- migration adds them to the existing row by patching only the new keys, leaving
-- the rest of the lesson data untouched.
--
-- The quiz answer string is generated from the lesson's own quiz data, so it cannot
-- drift out of step with the questions. Questions 9 and 10 are short answer and
-- carry their own sample answer and marking guide.

UPDATE lessons
SET data = json_patch(data, '{
  "answer_key": "Guided practice: Part A who or what: the baby, did what: laughed at the funny face. Part B Where did you put the keys? Part C any complete sentence with a naming part, such as The rabbit jumped over the log. Part D any complete sentence with a doing part, such as The tall old tree grew beside the fence.\n\nIndependent task: Parts 1 to 3 check that sentences are complete and correctly marked. Part 4 splits the run-on into separate sentences with capital letters and end marks. Parts 5 to 7 are the written sentence work. Mark the spelling of the week''s words separately from the sentence structure, so a good sentence with a spelling slip still counts as a good sentence.\n\nQuiz answers: multiple choice 1A, 2B, 3C, 4A, 5A, 6C, 7B, 8A. Questions 9 and 10 are short answer; the sample answer and marking guide are shown with each question, and any complete sentence with a naming part, a doing part and the right end mark is correct.",
  "parent_check": "Check that every written sentence has a capital letter, a naming part, a doing part and an end mark. Read each sentence aloud together and ask whether it sounds finished. Mark the quiz out of ten; nine or more means the lesson has landed.",
  "self_check": "By the end of this lesson you should have found the naming part and the doing part in sentences, chosen the right end mark, fixed fragments and run-ons, and written at least five clear sentences of your own that start with a capital letter and finish with an end mark.",
  "coming_soon": null
}')
WHERE seed_key = 's2-eng-y3-w01-l2';
