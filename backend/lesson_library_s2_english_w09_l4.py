"""Stage 2 English, Week 9 Lesson 4: Handwriting for Labels and Captions (Handwriting).
The child learns to write neat, legible labels and captions: letters that sit on the baseline, tall letters and tails in the right places, even slope, even spacing, straight label lines, and a caption written on its own ruled line under a picture. The visuals are drawn as SVG by the helper functions below, so the child can see what neat and untidy writing look like.
Spelling: silent letters kn, wr, mb, gn: knife, knit, wrong, write, thumb, gnome.
Outcomes: EN2-HANDW-01 and EN2-SPELL-01, checked against lesson_library_s2_english_placeholders.py (Week 9, Lesson 4). EN2-HANDW-01 uses the wording in backend/nsw_outcomes.py, which that file says is plain language, so please check it against the NESA syllabus.
Video status: two videos attached. How To Create Titles, Illustrations, and Captions (YouTube 7bzq1LFqS_A) and Silent Letters (wr, gn, kn, mb, and mn) (YouTube uuhUOB5UxUI). Both were chosen from their titles and descriptions, so please watch each one before relying on it. No handwriting video attached: the handwriting videos found were from UK schools and may teach a different script from the one your child uses.
Facts used: none about animals. The wren is a simple drawing used only to practise labels, and no facts about wrens are taught. All example sentences are made up for practice.
This lesson does not teach a particular handwriting script. Use the style your child's school uses, with joins where your child has been taught them.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _visual, _video
from spelling_s2_w1 import _w, _c

WORDS = ["knife", "knit", "wrong", "write", "thumb", "gnome"]


def _guide_svg():
    p = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 330" font-family="Arial, sans-serif">',
        '<rect width="640" height="330" fill="#FFFDF6"/>',
    ]
    for word, base in (("thumb", 130), ("wrong", 275)):
        top, mid = base - 70, base - 50
        p.append(f'<line x1="60" y1="{top}" x2="380" y2="{top}" stroke="#C77B5B" stroke-width="1.5" stroke-dasharray="6 4"/>')
        p.append(f'<line x1="60" y1="{mid}" x2="380" y2="{mid}" stroke="#6B8A5B" stroke-width="1.5" stroke-dasharray="6 4"/>')
        p.append(f'<line x1="60" y1="{base}" x2="380" y2="{base}" stroke="#333" stroke-width="2"/>')
        p.append(f'<text x="90" y="{base}" font-size="96" fill="#1F3B2D">{word}</text>')
    notes = [
        ("top line: h and b reach here", 64, "#C77B5B"),
        ("middle line: u and m reach here", 86, "#4F7A3E"),
        ("baseline: every letter sits on it", 134, "#333333"),
        ("baseline: every letter sits on it", 279, "#333333"),
        ("tail: g drops below the baseline", 300, "#C0392B"),
    ]
    for text, y, colour in notes:
        p.append(f'<text x="395" y="{y}" font-size="14" font-weight="bold" fill="{colour}">{text}</text>')
    p.append('</svg>')
    return "".join(p)


def _space_svg():
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" font-family="Arial, sans-serif">'
        '<rect width="640" height="250" fill="#FFFDF6"/>'
        '<text x="30" y="34" font-size="16" font-weight="bold" fill="#4F7A3E">Good spacing</text>'
        '<line x1="30" y1="84" x2="610" y2="84" stroke="#333" stroke-width="1.5"/>'
        '<text x="30" y="80" font-size="38" fill="#1F3B2D" style="word-spacing:14px">the wren sat on a rock</text>'
        '<text x="30" y="140" font-size="16" font-weight="bold" fill="#C0392B">No gaps between words</text>'
        '<line x1="30" y1="190" x2="610" y2="190" stroke="#333" stroke-width="1.5"/>'
        '<text x="30" y="186" font-size="38" fill="#1F3B2D">thewrensatonarock</text>'
        '<text x="30" y="232" font-size="14" fill="#333">A good gap between words is about the width of one letter o.</text>'
        '</svg>'
    )


def _wren_svg(good=True, cap=False):
    h = 370 if cap else 330
    p = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 {h}" font-family="Arial, sans-serif">',
        f'<rect width="560" height="{h}" fill="#FFFDF6"/>',
        '<text x="280" y="28" text-anchor="middle" font-size="16" font-weight="bold" fill="#1F3B2D">A wren</text>',
        '<line x1="200" y1="278" x2="430" y2="278" stroke="#5A3E25" stroke-width="5" stroke-linecap="round"/>',
        '<line x1="282" y1="240" x2="280" y2="276" stroke="#3E2A18" stroke-width="3"/>',
        '<line x1="322" y1="240" x2="324" y2="276" stroke="#3E2A18" stroke-width="3"/>',
        '<polygon points="218,175 140,125 128,146 212,208" fill="#8A6240" stroke="#3E2A18" stroke-width="2"/>',
        '<ellipse cx="300" cy="190" rx="85" ry="55" fill="#A9825A" stroke="#3E2A18" stroke-width="2"/>',
        '<ellipse cx="290" cy="190" rx="48" ry="24" fill="#8A6240" stroke="#3E2A18" stroke-width="1.5"/>',
        '<circle cx="385" cy="140" r="34" fill="#A9825A" stroke="#3E2A18" stroke-width="2"/>',
        '<polygon points="415,132 455,140 415,148" fill="#6E5238" stroke="#3E2A18" stroke-width="2"/>',
        '<circle cx="396" cy="134" r="4" fill="#111"/>',
    ]
    labels = [("beak", 470, 70, 480, 76, 436, 140), ("wing", 230, 70, 250, 76, 290, 190), ("tail", 30, 100, 60, 106, 175, 162)]
    for i, (text, tx, ty, sx, sy, px, py) in enumerate(labels):
        if good:
            p.append(f'<line x1="{sx}" y1="{sy}" x2="{px}" y2="{py}" stroke="#C77B5B" stroke-width="2"/>')
            p.append(f'<circle cx="{px}" cy="{py}" r="4" fill="#C77B5B"/>')
            p.append(f'<text x="{tx}" y="{ty}" font-size="18" font-weight="bold" fill="#1F3B2D">{text}</text>')
        else:
            ex, ey = px + 30, py - 40
            size = (12, 22, 15)[i]
            angle = (-18, 14, -8)[i]
            p.append(f'<path d="M{sx},{sy} Q{(sx + ex) // 2 + 20},{(sy + ey) // 2 - 25} {ex},{ey}" fill="none" stroke="#C77B5B" stroke-width="2"/>')
            p.append(f'<text transform="rotate({angle} {tx} {ty})" x="{tx}" y="{ty}" font-size="{size}" font-weight="bold" fill="#1F3B2D">{text}</text>')
    if cap:
        p.append('<line x1="40" y1="352" x2="520" y2="352" stroke="#333" stroke-width="1.5"/>')
        p.append('<text x="40" y="348" font-size="16" fill="#1F3B2D">A drawing of a wren with its beak, wing and tail labelled.</text>')
    p.append('</svg>')
    return "".join(p)


V_GUIDE = _visual(
    _guide_svg(),
    "Two words written between guide lines. The word thumb sits on a solid baseline. The letters h and b reach the dotted top line, and the letters u and m reach the dotted middle line. The word wrong sits on its own baseline and the tail of the letter g drops below it. Notes on the right explain each line.",
    "Every letter sits on the baseline. Tall letters reach the top line, and tails drop below.",
)
V_SPACE = _visual(
    _space_svg(),
    "Two rows of writing. The first row says the wren sat on a rock with an even gap between the words and is marked good spacing. The second row has the same letters with no gaps and is marked no gaps between words.",
    "Leave a gap about the width of one letter o between words.",
)
V_LABELS_GOOD = _visual(
    _wren_svg(good=True),
    "A simple drawing of a wren with the title A wren. Three labels, beak, wing and tail, are written straight and the same size. Each label has a straight line that ends in a dot on the part it names.",
    "Neat labels: straight writing, the same size, and a line that ends on the part.",
)
V_LABELS_BAD = _visual(
    _wren_svg(good=False),
    "The same wren drawing with messy labels. The words beak, wing and tail are tilted and different sizes, and the curly label lines stop short of the parts they should name.",
    "Messy labels: tilted writing, different sizes, and lines that miss the part.",
)
V_CAPTION = _visual(
    _wren_svg(good=True, cap=True),
    "The neat wren drawing with a caption on a ruled line underneath: A drawing of a wren with its beak, wing and tail labelled.",
    "A caption sits under the picture on its own line, written as a full sentence.",
)

MODEL = (
    "MODEL PAGE: A LABELLED WREN\n\n"
    "Title: A wren\n"
    "Labels: beak, wing, tail (each written straight and the same size, with a ruled line that ends on its part).\n"
    "Caption under the picture: A drawing of a wren with its beak, wing and tail labelled.\n"
    "The wren is a simple practice drawing. No facts about wrens are taught in this lesson."
)

LESSON = build(
    "s2-eng-w09-l4-handwriting-labels-captions",
    "Handwriting for Labels and Captions",
    "Learn how to write neat, easy to read labels and captions, with letters sitting on the baseline, even spacing and straight label lines.",
    "Handwriting: labels and captions",
    ["EN2-HANDW-01", "EN2-SPELL-01"],
    {
        "EN2-HANDW-01": "Forms legible joined letters to develop handwriting fluency. This lesson focuses on neat letter size, slope and spacing when writing labels and captions for a report. (Wording taken from backend/nsw_outcomes.py. Please check it against the NESA syllabus.)",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling in a range of contexts. This week's focus is silent letters: kn, wr, mb and gn.",
    },
    "We are learning how to write neat labels and captions that are easy to read, and to spell words with silent letters.",
    [
        "I can explain why neat writing matters on a labelled diagram.",
        "I can make my letters sit on the baseline with tall letters and tails in the right places.",
        "I can keep my slope and letter size even.",
        "I can leave a gap about the width of one letter o between words.",
        "I can write a label with a straight line that ends on the part it names.",
        "I can write a caption as a full sentence on its own line under a picture.",
        "I can spell and use knife, knit, wrong, write, thumb and gnome.",
    ],
    ["baseline", "tail", "slope", "spacing", "join", "label", "caption", "legible"],
    ["This lesson (everything you need is inside it)", "Lined paper and a sharp pencil", "A ruler (for label lines)", "Coloured pencils (optional)"],
    "Child can read labels and captions on diagrams (Week 9 Lesson 1) and has written a report with visuals (Week 9 Lesson 2).",
    (
        "Neat handwriting is about being easy to read. On a labelled diagram, a label that is hard to read stops the diagram from doing its job. Good writing sits on the baseline, keeps letters a steady size and slope, leaves even gaps between words, and uses a ruler for straight label lines. A caption is written as a full sentence on its own line under the picture."
    ),
    [
        _step(
            "👀", "Why neat writing matters",
            "Think about the last time you tried to read someone else's messy note. You probably had to stop, squint and guess. A diagram works in the same way. Its labels are only helpful if the reader can read them straight away.\n\n"
            "Writers of information reports take care with their handwriting for exactly that reason. A label that is tilted, too small or too big, or has a line that stops short of the part, makes the reader work harder than they should. A caption that is squashed together is just as hard to read.\n\n"
            "The word for writing that is easy to read is legible. In this lesson you will learn five habits that make your labels and captions legible every time.",
            "Look at the two wren pictures. In the messy one the words are tilted and different sizes, and the label lines miss the parts. In the neat one every label is straight, the same size, and the line ends on the part.",
            "Neat writing is not about being fancy. It is about being easy to read.",
            ("What does legible mean?", ["Easy to read", "Very fast", "Written in colour"], 0, "Legible writing is easy to read."),
            visual=[V_LABELS_BAD, V_LABELS_GOOD],
        ),
        _step(
            "📐", "Size and the baseline",
            "Lined paper has a line for your letters to sit on. That line is called the baseline. Every letter should sit on it, the way houses sit on a street. Letters that float above it or sink below it make writing look wobbly.\n\n"
            "Letters come in different heights. Some are short, like u and m, and they reach about halfway up. Some are tall, like h and b, and they reach the top line. A few letters have a tail, like g, that drops below the baseline.\n\n"
            "Keeping each kind of letter the right height is what makes a word look neat. A tall letter that is only as tall as a short one can look like a different letter.",
            "Look at thumb. The letters t, h and b rise above the short letters u and m. All five letters sit on the baseline. In wrong, the g has a tail that drops below it.",
            "Check the baseline first. If your letters sit on it, half the job is done.",
            ("What do letters sit on?", ["The baseline", "The margin", "The top line"], 0, "Every letter sits on the baseline."),
            visual=[V_GUIDE],
        ),
        _step(
            "🔗", "Slope and joins",
            "Slope is the lean of your letters. Your writing can stand straight up or lean a little to one side, but all the letters in a piece of writing should lean the same way. When some lean left and some lean right, the writing looks messy even if each letter is well made.\n\n"
            "If you have been taught to join your letters, join them where the join is natural, and keep your pencil moving smoothly. Use the style your child's school uses. The joins should help your writing flow and should not make it harder to read.\n\n"
            "A quick check is to draw a few light lines through the tall letters. If the lines are roughly parallel, your slope is even.",
            "Imagine writing the word thumb three times. If all three copies lean the same way and are the same size, the slope is even. If the first leans right and the second leans left, the slope is not even.",
            "One lean, one size. Keep it the same all the way along the line.",
            ("What does it mean to keep an even slope?", ["All letters lean the same way", "All letters are different sizes", "All letters are joined"], 0, "An even slope means the letters lean the same way."),
            visual=[V_GUIDE],
        ),
        _step(
            "↔️", "Spacing between words",
            "Good spacing makes it easy to see where one word ends and the next begins. A good gap is about the width of one letter o. If the gap is too small, the words run into each other. If it is too big, the sentence falls apart.\n\n"
            "Spacing matters inside words too. Letters in the same word should be close enough to look like a team, but not so close that they touch or overlap when they should not.\n\n"
            "If you are not sure, try the o test. Imagine a small o fitting between your words. If it fits snugly, the gap is right.",
            "Compare the two rows. Both have the same letters. The first has gaps and is easy to read. The second has none, and you have to hunt for where each word begins.",
            "Use the o test between every pair of words.",
            ("About how big should the gap between words be?", ["The width of one letter o", "The width of the whole page", "No gap at all"], 0, "A gap about the width of one letter o is the right size."),
            visual=[V_SPACE],
        ),
        _step(
            "🏷️", "Writing a label",
            "A label names one part of a diagram. It needs to be short, so use only the word or words that name the part. Write it straight, not tilted, and make every label about the same size so the diagram looks tidy.\n\n"
            "Each label needs a label line. Use a ruler so that the line is straight, and end the line in a small dot right on the part you are naming. Do not let label lines cross each other, because that makes it hard to tell which label belongs to which part.\n\n"
            "Finally, put the labels around the picture and not on top of it, so the drawing stays clear.",
            "Look at the neat wren. The label beak is written straight. The line is ruled and ends in a dot on the beak. The other two labels are the same size and none of the lines cross.",
            "Ruler, dot, straight writing. Three steps for every label.",
            ("Where should a label line end?", ["On the part it names", "At the edge of the page", "Under the title"], 0, "The label line ends on the part the label names."),
            visual=[V_LABELS_GOOD],
        ),
        _step(
            "📝", "Writing a caption",
            "A caption sits under the picture on its own line. You can rule a faint pencil line to write on. Start with a capital letter and finish with a full stop, because a caption is a full sentence.\n\n"
            "Write the caption a little smaller than the title but still easy to read. Keep the letters on the baseline and leave the o gap between words. If the caption is too long to fit on one line, you may need to make it shorter. A good caption is short.\n\n"
            "Remember what you learned in Lesson 1. A good caption is a fact about the picture, usually in the present tense.",
            "The caption under the wren says: A drawing of a wren with its beak, wing and tail labelled. It starts with a capital, ends with a full stop, and sits on its own line under the picture.",
            "Capital letter, full stop, its own line, under the picture.",
            ("Where does a caption go?", ["Under the picture on its own line", "On top of the drawing", "On the back of the page"], 0, "A caption sits under the picture on its own line."),
            visual=[V_CAPTION],
        ),
        _step(
            "🔎", "Check and improve",
            "Good writers check their own work. After you finish a label or caption, run through four quick questions. Do my letters sit on the baseline? Are my letters an even size and slope? Is there a gap about the width of an o between words? Do my label lines end on the parts?\n\n"
            "If the answer to any question is not yet, find the one word or label that is hardest to read and write it again, more slowly. You do not have to redo the whole page.\n\n"
            "Being able to say what you changed is a skill too. For example, I made my g tail drop below the baseline, or I used a ruler for the label line.",
            "Imagine you look at your own labels and see that the word wing is tilted and its line stops short of the wing. You rewrite the word straight and extend the line to end in a dot on the wing. That one fix makes the label legible.",
            "Pick the worst word and fix that one first.",
            ("What should you do if one label is hard to read?", ["Write that label again more slowly", "Leave it", "Cover it up"], 0, "Fix the label that is hardest to read."),
            visual=[V_LABELS_BAD, V_CAPTION],
        ),
        _step(
            "🔤", "Spelling focus: silent letters",
            "This week your spelling words have letters that you write but do not say. They are called silent letters. Long ago people did say them, and the spelling stayed after the sound was lost.\n\n"
            "Here are the patterns. The k is silent in kn words: knife and knit. The w is silent in wr words: wrong and write. The b is silent after m at the end of thumb. The g is silent in gn words: gnome.\n\n"
            "A good way to remember is the silly voice method. Say k-nife, w-rong and thum-b with the silent letter pronounced, write what you said, then say the word normally.",
            "knife, knit, wrong, write, thumb, gnome.\n\nSay: k-nife. Write: knife.\nSay: w-rong. Write: wrong.\nSay: thum-b. Write: thumb.",
            "kn, wr, mb, gn: one letter is silent but you still write it.",
            ("Which word has a silent w?", ["wrong", "west", "wind"], 0, "The w in wrong is silent."),
        ),
    ],
    (
        "Let's look at the wren pages together and decide which writing is easy to read.\n\n"
        "First the messy page. I look at the labels. The word beak is tilted and small, wing is large and leans the other way, and tail is tilted too. The label lines are curly and none of them ends on its part. I have to guess which label belongs where. This page is not legible.\n\n"
        "Now the neat page. Each label is straight and about the same size. I can see that the lines were ruled, because they are straight, and each one ends in a dot on the beak, the wing or the tail. Under the picture, the caption sits on its own line: A drawing of a wren with its beak, wing and tail labelled. It starts with a capital letter and ends with a full stop.\n\n"
        "To check my own writing I use four questions. Do my letters sit on the baseline? Are they an even size and slope? Is there an o gap between words? Do my lines end on the parts? When I can say yes to all four, my writing is legible.\n\n"
        "Now it is your turn to write neat labels and captions of your own.\n\n" + MODEL
    ),
    (
        "Here we practise together. Read each part, then type your answers in the boxes on the next stage. You can open the 'Put it all together' stage again at any time to look at the guide lines, the spacing example and the wren pictures.\n\n"
        "Part A: look at the guide lines picture. Type the two letters in the word thumb that reach only the middle line, and say why the g in wrong is special.\n\n"
        "Part B: this sentence has no gaps: thewrensatonarock. Type it again with the correct gaps, a capital letter and a full stop.\n\n"
        "Part C: look at the neat wren. Type its three labels and the caption.\n\n"
        "Part D: type the missing silent letters to make five words: _nife, _rong, thum_, _nome, _nit."
    ),
    (
        "Now write and check your own labels and caption. Do the writing on paper and type your answers in the big box, numbering each one. You can look back at the pictures in the 'Put it all together' stage.\n\n"
        "1. Warm up: on lined paper, write each of your six spelling words three times, sitting on the baseline. Type the six words.\n\n"
        "2. Draw: on paper, draw a simple animal or object you know. Give it a title and four labels. Use a ruler for the label lines and end each line in a dot on its part. Type your title and your four labels.\n\n"
        "3. Caption: rule a faint line under your drawing and write a caption on it. Type your caption as a full sentence in the present tense.\n\n"
        "4. Check: look at your drawing and answer four questions with yes or not yet: letters on the baseline, even size and slope, an o gap between words, label lines ending on the parts. Type your four answers.\n\n"
        "5. Improve: pick the one word or label that is hardest to read and write it again more slowly. Type which one you chose and what you changed.\n\n"
        "6. Spelling: type one sentence each for knife, thumb and write. Write the words neatly on paper too."
    ),
    "Which of the four checks was hardest to get right in your writing, and what helped you improve it?",
    "Did I keep my letters on the baseline, make my slope and size even, leave an o gap between words, end my label lines on the parts, write my caption as a full sentence, and spell knife, knit, wrong, write, thumb and gnome correctly?",
    [
        _q("What do letters sit on?", ["The margin", "The baseline", "The top line", "The title"], 1, "Every letter sits on the baseline."),
        _q("In the word thumb, which letters reach only the middle line?", ["h and b", "t and h", "u and m", "b and m"], 2, "The letters u and m are short letters."),
        _q("What is special about the letter g in wrong?", ["It has no tail", "Its tail drops below the baseline", "It is the tallest letter", "It is joined to every letter"], 1, "The tail of the g drops below the baseline."),
        _q("About how big should the gap between words be?", ["No gap", "The width of one letter o", "The width of a whole word", "The width of the page"], 1, "A gap about the width of one letter o is right."),
        _q("What does a label do?", ["Names one part of a diagram", "Tells a story", "Gives the page number", "Ends the report"], 0, "A label names one part."),
        _q("Where should a label line end?", ["Under the title", "At the edge of the page", "In the caption", "On the part it names"], 3, "The line ends on the part that the label names."),
        _q("Which is the best caption for the wren drawing?", ["Cute!", "A drawing of a wren with its beak, wing and tail labelled.", "Picture 4", "I drew this yesterday."], 1, "A good caption is a clear full sentence about the picture."),
        _q("What tool helps make label lines straight?", ["An eraser", "A ruler", "A glue stick", "A highlighter"], 1, "A ruler makes label lines straight."),
        _q("Which word has a silent w?", ["wrong", "went", "wind", "west"], 0, "The w in wrong is silent."),
        _q("Which word is spelled correctly?", ["thum", "thumm", "thumb", "thoum"], 2, "Thumb has a silent b."),
    ],
    "Do your writing on paper, then type your answers in the practice boxes and in the big box, and submit them.",
    "Extension: choose a diagram in a book or on a website. Copy one label and one caption in your best handwriting, then swap with a family member and ask them to check it against the four questions.",
    [("baseline", "The line that your letters sit on"), ("tail", "The part of a letter, like g, that drops below the baseline"), ("slope", "The lean of your letters"), ("spacing", "The gaps between letters and words"), ("join", "A joining stroke between two letters"), ("label", "A word that names a part of a picture"), ("caption", "A short line of writing that explains a picture"), ("legible", "Easy to read")],
    [
        _video(
            "How To Create Titles, Illustrations, and Captions", "7bzq1LFqS_A",
            "Watch how a caption sits with an illustration and explains what it shows. Pause when the video writes its own caption and check it against our four questions.",
            "Ask your child what a caption is, then ask them to point to the caption in the video.",
            ("What does a caption do?", ["Explains what a picture shows", "Names the author", "Ends a story"], 0, "A caption explains what an illustration or photo shows."),
        ),
        _video(
            "Silent Letters (wr, gn, kn, mb, and mn)", "uuhUOB5UxUI",
            "Listen for where each silent letter team sits in a word. This lesson uses wr, gn, kn and mb, so you can skip the mn part.",
            "Ask your child to say a word from the video, then spell it aloud with the silent letter.",
            ("Where do you usually find mb in a word?", ["At the end", "At the start", "In the middle of every word"], 0, "The video says mb is at the end of words, like thumb."),
        ),
    ],
    _sort("Easy to read or hard to read?", "Sort each feature into easy to read or hard to read.", ["Easy to read", "Hard to read"], [("letters sit on the baseline", 0), ("words squashed together", 1), ("all letters lean the same way", 0), ("label lines that miss the part", 1), ("a gap about the width of one letter o between words", 0), ("letters of very different sizes", 1), ("label lines drawn with a ruler", 0), ("letters leaning both ways", 1)]),
    [
        _wc("Which is the line that letters sit on?", ["baseline", "caption", "label"], 0, "The baseline is the line your letters sit on."),
        _wc("Which means easy to read?", ["slope", "legible", "spacing"], 1, "Legible writing is easy to read."),
        _wc("Which names one part of a diagram?", ["title", "scale", "label"], 2, "A label names a part."),
        _wc("Which is a short line that explains a picture?", ["caption", "baseline", "join"], 0, "A caption explains a picture."),
        _wc("Which word is spelled correctly?", ["nife", "knife", "kniffe"], 1, "Knife has a silent k."),
        _wc("Which word is spelled correctly?", ["rite", "wrigt", "write"], 2, "Write has a silent w."),
        _wc("Which word is spelled correctly?", ["thumb", "thum", "thume"], 0, "Thumb has a silent b."),
        _wc("Which word is spelled correctly?", ["nome", "gnome", "gnoam"], 1, "Gnome has a silent g."),
    ],
    [
        {"key": "partA", "label": "Part A: letter heights", "hint": "The two short letters in thumb, and what is special about the g in wrong."},
        {"key": "partB", "label": "Part B: fix the spacing", "hint": "Rewrite thewrensatonarock with gaps, a capital and a full stop."},
        {"key": "partC", "label": "Part C: labels and caption", "hint": "The three labels and the caption from the neat wren picture."},
        {"key": "partD", "label": "Part D: silent letters", "hint": "The five words from _nife, _rong, thum_, _nome, _nit."},
    ],
    ["Letters floating above or sinking below the baseline", "Tilting some letters one way and some the other", "No gap, or a huge gap, between words", "Label lines that are curly or stop short of the part", "Writing a caption as a word or a story instead of a full sentence", "Leaving out the silent letter: nife, rong, thum, nome"],
    ["Write a label and caption for something in your home, using a ruler for the line.", "Practise your six spelling words by writing a neat sentence for each."],
    "Part A: u and m; the g has a tail that drops below the baseline. Part B: The wren sat on a rock. Part C: beak, wing, tail; accept A drawing of a wren with its beak, wing and tail labelled. or a similar present tense sentence. Part D: knife, wrong, thumb, gnome, knit. Main task 1: knife, knit, wrong, write, thumb, gnome. 2: accept any sensible title and four labels. 3: accept a full present tense sentence about the drawing. 4: accept honest yes or not yet answers for all four checks. 5: accept any sensible choice with a clear change, such as rewriting a word straight or ruling a line. 6: accept three sentences that use the words correctly. Quiz answers: the baseline; u and m; its tail drops below the baseline; the width of one letter o; names one part of a diagram; on the part it names; A drawing of a wren with its beak, wing and tail labelled.; a ruler; wrong; thumb.",
    parent_check=(
        "Look at the child's paper, not only the typed answers. Check that the letters sit on the baseline, the size and slope are fairly even, there is a gap about the width of one letter o between words, the label lines are ruled and end on the parts, and the caption is on its own line under the drawing as a full sentence with a capital letter and a full stop. Accept any sensible drawing and labels. For the check in task 4, honest answers matter more than yes. Praise one specific improvement, and ask your child to rewrite one word if you can see a clear problem."
    ),
    worked_visuals=[V_LABELS_BAD, V_LABELS_GOOD],
)

EXPLICIT_TEACHING = (
    "The big idea. Handwriting is not about being pretty. It is about being legible, which means a reader can read it straight away. In an information report, labels and captions are small pieces of writing that carry a lot of weight, because a diagram only works if its labels can be read. This lesson links neat handwriting to a real purpose. Your child is not writing neatly to please a teacher. They are writing neatly so that a diagram can do its job.\n\n"
    "How to open the lesson. Show your child the messy wren and the neat wren side by side, and ask which one they would rather learn from. Let them tell you why. They will usually name the problems themselves: the writing is tilted, the sizes are different, the lines miss the parts. Write those answers down, because they are the five habits of the lesson in your child's own words.\n\n"
    "Teaching size and the baseline. Every letter sits on the baseline. Short letters such as u and m reach the middle line, tall letters such as h and b reach the top line, and tails such as the one on g drop below the baseline. Have your child write thumb and wrong on lined paper and check each letter against the guide lines picture. If a child's tall and short letters look much the same, slow down and practise just that. A small habit, such as checking that every letter touches the baseline, changes how the whole page looks.\n\n"
    "Teaching slope and joins. The aim is one lean, one size. When letters lean in different directions the writing looks untidy even if each letter is well formed. This lesson does not teach a particular script, so use the style your child's school uses, with joins where your child has been taught them. If you are unsure which style that is, ask the school. A join should help the writing flow and should never make a word harder to read.\n\n"
    "Teaching spacing. A gap about the width of one letter o between words is a simple test that children can apply by themselves. Compare the two rows in the spacing picture. They contain exactly the same letters, but only one of them can be read at a glance. Ask your child to try the o test on a line of their own writing, and fix any gap that is too small or too large.\n\n"
    "Teaching labels. A label names one part, so it should be short. It is written straight, not tilted, and about the same size as the other labels. The label line is drawn with a ruler and ends in a dot on the part. Lines should not cross. Labels go around the picture, not on top of it. If your child's lines end near a part instead of on it, ask them which part the line points to, and they will usually see the problem and fix it.\n\n"
    "Teaching captions. A caption sits under the picture on its own line. It is a full sentence with a capital letter and a full stop, and it is a fact about the picture in the present tense, which is what your child learned in Lesson 1. Children who write a long caption often cannot fit it on the line. The fix is to make the caption shorter, which also makes it a better caption.\n\n"
    "Checking and improving. Teach your child to check their own work with four questions: letters on the baseline, even size and slope, an o gap between words, and label lines that end on the parts. If the answer to any question is not yet, they pick the one hardest word or label and rewrite it more slowly. Do not ask for the whole page to be redone. Rewriting one word is quick and shows your child that they can improve their own work. Praise honest checking, because a child who admits a problem can fix it.\n\n"
    "The spelling work. The silent letters in knife, knit, wrong, write, thumb and gnome are left over from a time when people pronounced them. Tell your child that story, because a reason makes a spelling easier to remember than a rule does. Then use the silly voice method: say k-nife, w-rong and thum-b with the silent letter pronounced, write exactly what you said, then say the word normally. Ask your child to write the words neatly on the baseline, so the spelling practice doubles as handwriting practice.\n\n"
    "What to watch for. If letters float or sink, return to the baseline and use a ruled line to help. If the slope wanders, slow down and aim for one lean. If words run together, use the o test. If label lines miss, ask which part each line points to. If a caption is a word or a story, ask for a full sentence that states a fact about the picture. Keep the pace relaxed. The lesson runs about an hour and splits well into two sittings, with the baseline, slope and spacing in the first and the labels, captions and spelling in the second. Because handwriting is practised on paper, please look at what your child wrote, not only at what they typed."
)
LESSON["explicit_teaching"] = EXPLICIT_TEACHING

LESSON["planner_title"] = "Guided practice answers"
LESSON["planner_intro"] = "Type your answer to each part of the guided practice. Write at least a few words in every box."

LESSON["spelling"] = {
    "focus": "Silent letters: kn, wr, mb, gn",
    "teaching": "In some words one letter is silent. The k is silent in knife and knit, the w in wrong and write, the b in thumb, and the g in gnome. Long ago people said these letters aloud, and the spelling stayed after the sound was lost. Say the word, then picture the silent letter as you write it.",
    "words": [
        _w("knife", "knife", "silent k at the start, a tool for cutting"),
        _w("knit", "knit", "silent k at the start, to make clothes from wool"),
        _w("wrong", "wrong", "silent w at the start, not right"),
        _w("write", "write", "silent w at the start, to put words on paper"),
        _w("thumb", "thumb", "silent b at the end, the short thick finger"),
        _w("gnome", "gnome", "silent g at the start, a small garden figure"),
    ],
    "check": [
        _c("Which word has a silent k?", ["knife", "kite", "king"], 0, "The k in knife is silent."),
        _c("Which word has a silent b?", ["bring", "thumb", "bend"], 1, "The b in thumb is silent."),
    ],
}
LESSON["spelling_focus"] = "Silent letters: kn, wr, mb, gn"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    assert all("visual" in s or "visual_before" in s for s in LESSON["teach_steps"][:7])
    assert all(v["svg"].startswith("<svg") and v["svg"].endswith("</svg>") for v in LESSON["worked_visuals"])
    print("W9 L4 ok", LESSON["seed_key"])
