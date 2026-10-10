export type SpellingWord = {
  word: string;
  parts: string;
  tip: string;
};

export type SpellingCheck = {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
};

export type SpellingSegment = {
  focus: string;
  teaching: string;
  words: SpellingWord[];
  check: SpellingCheck[];
};

const word = (w: string, parts: string, tip: string): SpellingWord => ({ word: w, parts, tip });
const check = (
  question: string,
  options: string[],
  correct_index: number,
  explanation: string
): SpellingCheck => ({ question, options, correct_index, explanation });

export const SPELLING_W1: Record<string, SpellingSegment> = {
  "s2-eng-w01-l1-spelling-strategies": {
    focus: "Sounds and syllables",
    teaching:
      "A syllable is one beat in a word. Say the word and feel your chin drop: it drops once for each beat. Spell one syllable at a time and a long word becomes a few short ones.\n\nListen for a short vowel followed by another syllable. The middle of the word often has a double letter: rab-bit, rib-bon, mit-ten. Compound words are two whole words joined together, so spell each part and join them: sun + shine = sunshine.",
    words: [
      word("rabbit", "rab-bit", "double b after the short vowel a"),
      word("ribbon", "rib-bon", "double b in the middle, just like rabbit"),
      word("butterfly", "but-ter-fly", "three beats, with a double t in the middle"),
      word("sunshine", "sun + shine", "two whole words joined together"),
      word("elephant", "el-e-phant", "the ph says f"),
    ],
    check: [
      check(
        "Which word has a double letter in the middle?",
        ["rabbit", "elephant", "sunshine"],
        0,
        "rab-bit has a double b."
      ),
    ],
  },
  "s2-eng-w01-l2-sentence-builder": {
    focus: "Sounds and syllables",
    teaching:
      "Writers split long words into syllables so they can spell them one chunk at a time. Tap out the beats, write each chunk, then read the whole word back to check it.\n\nToday's words are the language of sentences. Each one is long, so say it slowly and listen for every beat.",
    words: [
      word("sentence", "sen-tence", "the ce at the end says s, like in fence"),
      word("question", "ques-tion", "the tion at the end says shun"),
      word("capital", "cap-i-tal", "three beats, and the middle one is a quiet i"),
      word("comma", "com-ma", "double m in the middle"),
      word("apostrophe", "a-pos-tro-phe", "four beats, and the ph says f"),
    ],
    check: [
      check("How many syllables are in 'capital'?", ["2", "3", "4"], 1, "cap-i-tal has three beats."),
    ],
  },
  "s2-eng-w01-l3-reading-expression": {
    focus: "Sounds and syllables",
    teaching:
      "Reading and spelling use the same skill in opposite directions. When you read, you join the sounds and syllables. When you spell, you break the word back into sounds and syllables.\n\nCompound words are easy to read and easy to spell once you spot the two small words inside them.",
    words: [
      word("lighthouse", "light + house", "a compound word, and the igh makes the long i sound"),
      word("evening", "eve-ning", "two beats, ending in ing"),
      word("polished", "pol-ished", "the sh sound is spelt with a digraph"),
      word("whisper", "whis-per", "the wh at the start, and the er at the end"),
      word("expression", "ex-pres-sion", "double s, and the sion says shun"),
    ],
    check: [
      check("Which word is a compound word?", ["lighthouse", "evening", "whisper"], 0, "light + house."),
    ],
  },
  "s2-eng-w01-l4-show-dont-tell": {
    focus: "Sounds and syllables",
    teaching:
      "Strong verbs and precise describing words are often longer words, so syllables help you spell them. Break the word into beats, spell each beat, and look out for double letters and digraphs.\n\nBefore you hand in your description, underline any long word and check it one syllable at a time.",
    words: [
      word("shadow", "shad-ow", "the ow at the end says oh"),
      word("creaking", "creak-ing", "the ea says ee, then the ing suffix"),
      word("moonlight", "moon + light", "a compound word with the igh sound"),
      word("trembled", "trem-bled", "two beats, ending in ed"),
      word("enormous", "e-nor-mous", "three beats, ending in ous"),
    ],
    check: [
      check("How many syllables are in 'enormous'?", ["2", "3", "4"], 1, "e-nor-mous has three beats."),
    ],
  },
};

export const SPELLING_LIVE: Record<string, SpellingSegment> = {
  "s2-eng-w01-l1-reading-expression": {
    focus: "Sounds and syllables",
    teaching:
      "A syllable is one beat in a word. Say the word and feel your chin drop: it drops once for each beat. Spell one syllable at a time and a long word becomes a few short ones.\n\nReading and spelling use the same skill in opposite directions. When you read, you join the syllables. When you spell, you split the word back into syllables, write each chunk, then read the whole word back to check it.",
    words: [
      word("wonderful", "won-der-ful", "three beats, and the ending is ful with one l"),
      word("adventure", "ad-ven-ture", "three beats, and the ture at the end says cher"),
      word("expression", "ex-pres-sion", "double s, and the sion says shun"),
      word("excellent", "ex-cel-lent", "double l in the middle"),
      word("remember", "re-mem-ber", "three beats, with an m in the middle"),
      word(
        "beautiful",
        "beau-ti-ful",
        "the beau at the start says byoo, and the ending is ful with one l"
      ),
    ],
    check: [
      check(
        "How many syllables are in 'beautiful'?",
        ["2", "3", "4"],
        1,
        "beau-ti-ful has three beats."
      ),
    ],
  },
};

export const ALL_SPELLING: Record<string, SpellingSegment> = {
  ...SPELLING_W1,
  ...SPELLING_LIVE,
};

export function applySpelling<T extends { seed_key?: string | null }>(lesson: T): T & { spelling?: SpellingSegment } {
  const spelling = lesson?.seed_key ? ALL_SPELLING[lesson.seed_key] : undefined;
  return spelling ? { ...lesson, spelling } : (lesson as T & { spelling?: SpellingSegment });
}
