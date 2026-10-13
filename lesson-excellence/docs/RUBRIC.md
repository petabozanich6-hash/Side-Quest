# Lesson Quality Rubric

Ten dimensions, each scored **0-4**. Maximum total **40**.

## Scale
| Score | Meaning |
|---|---|
| 0 | Absent or unusable. |
| 1 | Present but weak: vague, inaccurate, or inconsistent. Needs rewrite. |
| 2 | Adequate: usable by a motivated teacher, with clear gaps. |
| 3 | Strong: complete and sound, with minor improvements possible. |
| 4 | Exemplary: could be a model for other lessons. |

## Dimensions and descriptors
| Dimension | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| **Clarity** | Confusing, jargon, run-on text | Understandable but dense or uneven | Plain language, one idea at a time | Plain, precise, vocabulary defined, short sentences, concrete representation |
| **Objective measurability** | Vague verbs (understand, know) | Some measurable, some vague | All start with measurable verbs | Measurable, specific criteria, and each is assessed by a formative check |
| **Conceptual accuracy** | Errors present | Minor errors or ambiguities | Accurate, examples verified | Accurate, anticipates misconceptions, reviewer-verified |
| **Scaffolding** | No modelling | Examples but abrupt jump to practice | Worked -> guided -> independent | As 3, plus hints, prerequisite checks and activation |
| **Practice quality** | Few or repetitive items | Enough items, one difficulty | Varied items with answers | Foundation / core / stretch, rationales, spaced retrieval |
| **Feedback quality** | Answers only | Answers with brief reasons | Rationales on checks, misconceptions addressed | Rationale + wrong-answer feedback + remediation steps |
| **Assessment alignment** | Checks unrelated to objectives | Partial coverage | Every objective has a check | Every objective checked, with explicit mastery evidence and threshold |
| **Cognitive load** | Overloaded | Too many ideas or long text | <= 3 objectives, <= 5 key points | As 3, plus short sentences and realistic time |
| **Inclusivity** | Excludes or stereotypes | Neutral but no support | Accessible language and vocabulary | Explicit access notes, multiple representations, neutral contexts |
| **Transfer** | Isolated skill | Extension only | Extension with success criteria | Extension, new-context tasks and spaced retrieval |

## Promotion thresholds
| Tier | Requirements |
|---|---|
| **draft** | Anything below *good*, or fails schema validation. |
| **good** | Schema-valid, total >= 28/40, every dimension >= 2. |
| **excellent** | Schema-valid, total >= 36/40, every dimension >= 3, **and** human-reviewed (`conceptual_accuracy` supplied). |

Machine-readable form: `rubric.json`. `scripts/lib/score.mjs` scores each dimension 0-4 with structural checks
(counts, coverage, measurable verbs, sentence length, presence of rationales/hints). It is a proxy: human reviewers
confirm real accuracy, clarity and inclusivity, and record scores in a reviews file:

```json
{ "<lesson_id>": { "conceptual_accuracy": 4, "clarity": 3 } }
```

Pass with `--reviews reviews.json`. Reviewer scores override automated ones for the named dimensions.
