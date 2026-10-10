export type StaticWordEntry = {
  word: string;
  parts: string;
  tip: string;
};

type LessonWordBank = Record<string, { focus: string; words: StaticWordEntry[] }>;

const lesson = (focus: string, words: StaticWordEntry[]) => ({ focus, words });
const word = (value: string, parts: string, tip: string): StaticWordEntry => ({ word: value, parts, tip });

export const WORD_BANK_LESSONS: LessonWordBank = {
  "s2-eng-w01-l1-spelling-strategies": lesson("Sounds and syllables", [
    word("rabbit", "rab-bit", "double b after the short vowel a"),
    word("ribbon", "rib-bon", "double b in the middle, just like rabbit"),
    word("butterfly", "but-ter-fly", "three beats, with a double t in the middle"),
    word("sunshine", "sun + shine", "two whole words joined together"),
    word("elephant", "el-e-phant", "the ph says f"),
  ]),
  "s2-eng-w01-l2-sentence-builder": lesson("Sounds and syllables", [
    word("sentence", "sen-tence", "the ce at the end says s, like in fence"),
    word("question", "ques-tion", "the tion at the end says shun"),
    word("capital", "cap-i-tal", "three beats, and the middle one is a quiet i"),
    word("comma", "com-ma", "double m in the middle"),
    word("apostrophe", "a-pos-tro-phe", "four beats, and the ph says f"),
  ]),
  "s2-eng-w01-l3-reading-expression": lesson("Sounds and syllables", [
    word("lighthouse", "light + house", "a compound word, and the igh makes the long i sound"),
    word("evening", "eve-ning", "two beats, ending in ing"),
    word("polished", "pol-ished", "the sh sound is spelt with a digraph"),
    word("whisper", "whis-per", "the wh at the start, and the er at the end"),
    word("expression", "ex-pres-sion", "double s, and the sion says shun"),
  ]),
  "s2-eng-w01-l4-show-dont-tell": lesson("Sounds and syllables", [
    word("shadow", "shad-ow", "the ow at the end says oh"),
    word("creaking", "creak-ing", "the ea says ee, then the ing suffix"),
    word("moonlight", "moon + light", "a compound word with the igh sound"),
    word("trembled", "trem-bled", "two beats, ending in ed"),
    word("enormous", "e-nor-mous", "three beats, ending in ous"),
  ]),
  "s2-eng-w01-l1-reading-expression": lesson("Sounds and syllables", [
    word("wonderful", "won-der-ful", "three beats, and the ending is ful with one l"),
    word("adventure", "ad-ven-ture", "three beats, and the ture at the end says cher"),
    word("expression", "ex-pres-sion", "double s, and the sion says shun"),
    word("excellent", "ex-cel-lent", "double l in the middle"),
    word("remember", "re-mem-ber", "three beats, with an m in the middle"),
    word("beautiful", "beau-ti-ful", "the beau at the start says byoo, and the ending is ful with one l"),
  ]),
};

const normalizeWord = (raw: string) =>
  Array.from(String(raw || "").trim())
    .filter((ch) => /[A-Za-z]/.test(ch) || ch === "'" || ch === "-")
    .join("")
    .toLowerCase();

const BY_WORD = new Map<string, StaticWordEntry>();

for (const lessonData of Object.values(WORD_BANK_LESSONS)) {
  for (const entry of lessonData.words) {
    const key = normalizeWord(entry.word);
    if (!BY_WORD.has(key)) BY_WORD.set(key, entry);
  }
}

export const getStaticWordEntry = (word: string, seedKey?: string | null) => {
  const key = normalizeWord(word);
  if (!key) return null;
  const lessonEntry = seedKey
    ? WORD_BANK_LESSONS[seedKey]?.words.find((entry) => normalizeWord(entry.word) === key) || null
    : null;
  return lessonEntry || BY_WORD.get(key) || null;
};

export const getStaticWordHint = (word: string, seedKey?: string | null) => getStaticWordEntry(word, seedKey)?.tip || null;
