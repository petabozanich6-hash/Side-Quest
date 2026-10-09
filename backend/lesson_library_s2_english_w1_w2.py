"""Shared helpers for the Stage 2 English lesson modules.

This module holds only the builder functions used by the Stage 2 English lesson files.
It contains no lesson data and does not change LESSON_LIBRARY_VERSION.

Optional extras (all old lessons keep working without them):
  _step(..., visual=..., visual_before=...)  attach a visual (or list of visuals) to a teaching step.
      visual_before shows straight under the explanation. If only visual is given, it is shown there too,
      so the picture is visible without the child having to click anything.
  build(..., parent_check="", worked_visuals=None)  parent_check is shown to parents only;
                                                     worked_visuals are shown with the worked example.
A visual is {"svg": "<svg ...>", "alt": "...", "caption": "..."} or {"src": url, "alt": ..., "caption": ...}.
"""


def _q(q, opts, idx, why):
    return {"question": q, "type": "multiple_choice", "options": opts, "correct_index": idx, "explanation": why}


def _visual(svg=None, alt="", caption="", src=None):
    v = {"alt": alt, "caption": caption}
    if svg:
        v["svg"] = svg
    if src:
        v["src"] = src
    return v


def _step(icon, title, explain, example, notice, chk, visual=None, visual_before=None):
    q, opts, idx, why = chk
    step = {"icon": icon, "title": title, "explain": explain, "example": example, "notice": notice,
            "check": {"question": q, "options": opts, "correct_index": idx, "explanation": why}}
    if visual and not visual_before:
        visual_before = visual
        visual = None
    if visual:
        step["visual"] = visual
    if visual_before:
        step["visual_before"] = visual_before
    return step


def _video(title, vid, prompt, offline, chk):
    q, opts, idx, why = chk
    return {"type": "video", "title": title, "url": f"https://www.youtube.com/watch?v={vid}",
            "embed_url": f"https://www.youtube-nocookie.com/embed/{vid}", "prompt": prompt,
            "offline_alternative": offline,
            "check": {"question": q, "options": opts, "correct_index": idx, "explanation": why}}


def _article(title, url):
    return {"type": "article", "title": title, "url": url}


def _sort(title, instr, buckets, items):
    return {"title": title, "instructions": instr, "buckets": buckets, "items": [{"text": t, "answer": a} for t, a in items]}


def _wc(q, opts, idx, why):
    return {"question": q, "options": opts, "correct_index": idx, "explanation": why}


def build(key, title, mission, subject, codes, notes, intention, criteria, vocab, materials, prior,
          teaching, steps, worked, guided, independent, response, selfcheck, quiz, evidence, extension, cards,
          resources, sort_activity, word_challenges, planner, mistakes, challenges, answer_key,
          parent_check="", worked_visuals=None):
    lesson = {
        "seed_key": key, "library": True, "stage": "S2", "year_level": "Stage 2", "learning_area": "English",
        "subject": subject, "title": title, "child_mission": mission, "duration_minutes": 60, "pass_mark": 0.9,
        "outcome_codes": codes, "outcome_notes": notes, "learning_intention": intention,
        "success_criteria": criteria + ["I can score 90% or more on the Quest check."],
        "key_vocabulary": vocab, "materials": materials, "prior_knowledge": prior,
        "explicit_teaching": teaching + "\n\nCommon mistakes to watch for:\n" + "\n".join("- " + m for m in mistakes),
        "teach_steps": steps, "worked_example": worked, "guided_practice": guided, "independent_task": independent,
        "response_prompt": response, "self_check": selfcheck,
        "accessibility_notes": "Allow dictation or typing. Break the written task into two sittings. Reduce the length by a third if needed. Pause the videos as often as you like.",
        "interactive_activities": [{"type": "flip_cards", "title": "Quest Codex: key terms",
                                    "cards": [{"front": f, "back": b} for f, b in cards]}],
        "sort_activity": sort_activity, "word_challenges": word_challenges,
        "steps": [
            {"title": "Step 1: Accept the quest", "detail": "Read your mission and the learning goals.", "duration_minutes": 5},
            {"title": "Step 2: Learn the map", "detail": "Six short lessons, each with a full explanation, examples and a quick try.", "duration_minutes": 20},
            {"title": "Step 3: Practise the craft", "detail": "Watch the videos and answer the checks, flip the key-term cards, then complete the sorting and word challenges.", "duration_minutes": 10},
            {"title": "Step 4: Apply it", "detail": "Work through the guided practice, plan, then complete the independent task.", "duration_minutes": 15},
            {"title": "Step 5: Quest check", "detail": "Answer the 10-question check. You need 9 out of 10.", "duration_minutes": 5},
            {"title": "Step 6: Hand it in", "detail": "Check your work against the success criteria and submit your evidence.", "duration_minutes": 5},
        ],
        "resources": resources, "quiz": quiz,
        "reflection_prompts": ["What was the trickiest part today?", "What will you do differently next time?"],
        "evidence_instructions": evidence,
        "parent_notes": "Practice lesson only. Quiz scores are formative; competency is decided by the fortnightly mini exam. Check the written task against the success criteria. Video check questions test the main idea so they can be answered if a video is unavailable.\n\nAnswer key for the guided practice:\n" + answer_key + "\n\nVerify the outcome mapping against the NESA English K-10 syllabus.",
        "source_note": "Outcome codes from the NSW English K-10 Syllabus (NESA 2022), Stage 2. Parent to verify alignment on curriculum.nsw.edu.au.",
        "offline_alternative": "Complete all written tasks on paper and read the questions aloud. Videos can be skipped if the worked example is read aloud.",
        "extension": extension, "follow_up_challenges": challenges,
    }
    if parent_check:
        lesson["parent_check"] = parent_check
        lesson["parent_notes"] = lesson["parent_notes"] + "\n\nParent check:\n" + parent_check
    if worked_visuals:
        lesson["worked_visuals"] = worked_visuals
    if planner:
        lesson["planner_fields"] = planner
    return lesson
