import re, json, sys, pathlib


def parse(text):
    m = re.match(r"---\n(.*?)\n---\n(.*)", text, re.S)
    head, body = m.group(1), m.group(2)
    meta = {}
    for line in head.splitlines():
        k, v = line.split(":", 1)
        meta[k.strip()] = v.strip()
    secs, cur = {}, None
    for line in body.splitlines():
        if line.startswith("## "):
            cur = line[3:].strip().lower()
            secs[cur] = []
        elif cur is not None:
            secs[cur].append(line)

    def items(lines):
        return [l[2:].strip() for l in lines if l.startswith("- ")]

    def split(s):
        return [p.strip() for p in s.split("::")]

    out = {
        "code": meta["code"], "stage": int(meta["stage"]), "subject": meta["subject"],
        "week": int(meta["week"]), "lesson": int(meta["lesson"]), "title": meta["title"],
        "minutes": int(meta.get("minutes", 45)),
        "outcomes": [o.strip() for o in meta["outcomes"].split(",")],
    }
    out["warmup"] = [dict(zip(("q", "a"), split(i))) for i in items(secs["warm-up"])]
    teach, h, buf = [], None, []
    for l in secs["teach"]:
        if l.startswith("### "):
            if h:
                teach.append({"heading": h, "body": " ".join(buf).strip()})
            h, buf = l[4:].strip(), []
        elif l.strip():
            buf.append(l.strip())
    if h:
        teach.append({"heading": h, "body": " ".join(buf).strip()})
    out["teach"] = teach
    out["worked_examples"] = [dict(zip(("q", "steps", "a"), split(i))) for i in items(secs["worked examples"])]
    out["guided_practice"] = [dict(zip(("q", "hint", "a"), split(i))) for i in items(secs["guided practice"])]
    instr = next((l.split(":", 1)[1].strip() for l in secs["task"] if l.lower().startswith("instructions:")), "")
    pairs = [split(i) for i in items(secs["task"])]
    out["task"] = {"instructions": instr, "questions": [p[0] for p in pairs], "answers": [p[1] for p in pairs]}
    quiz = []
    for i in items(secs["quiz"]):
        q, opts, ans, ex = split(i)
        quiz.append({"q": q, "options": [o.strip() for o in opts.split("|")], "answer": ans, "explain": ex})
    out["quiz"] = quiz
    out["resources"] = {"video": meta.get("video", ""), "practice": meta.get("practice", ""), "worksheet": meta.get("worksheet", "")}
    return out


def validate(l):
    errs = []
    for k in ("warmup", "teach", "worked_examples", "guided_practice", "quiz"):
        if not l[k]:
            errs.append(k + " empty")
    if len(l["task"]["questions"]) != len(l["task"]["answers"]):
        errs.append("task mismatch")
    for q in l["quiz"]:
        if q["answer"] not in q["options"]:
            errs.append("quiz answer not in options: " + q["q"])
    return errs


if __name__ == "__main__":
    root = pathlib.Path(sys.argv[1])
    bad = 0
    for p in sorted(root.rglob("*.md")):
        if p.name.startswith("_") or p.name == "README.md":
            continue
        lesson = parse(p.read_text())
        errs = validate(lesson)
        if errs:
            bad += 1
            print("ERROR", p, errs)
        else:
            p.with_suffix(".json").write_text(json.dumps(lesson, indent=2))
    sys.exit(1 if bad else 0)
