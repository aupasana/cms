// devanagari-to-iast.js

export const consonants = {
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ṅ',
  'च': 'c', 'छ': 'ch', 'ज': 'j', 'झ': 'jh', 'ञ': 'ñ',
  'ट': 'ṭ', 'ठ': 'ṭh', 'ड': 'ḍ', 'ढ': 'ḍh', 'ण': 'ṇ',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
  'श': 'ś', 'ष': 'ṣ', 'स': 's', 'ह': 'h'
};

export const vowels = {
  'अ': 'a', 'आ': 'ā', 'इ': 'i', 'ई': 'ī',
  'उ': 'u', 'ऊ': 'ū', 'ऋ': 'ṛ', 'ॠ': 'ṝ',
  'ऌ': 'ḷ', 'ॡ': 'ḹ',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au'
};

export const matras = {
  'ा': 'ā', 'ि': 'i', 'ी': 'ī',
  'ु': 'u', 'ू': 'ū',
  'ृ': 'ṛ', 'ॄ': 'ṝ', 'ॢ': 'ḷ', 'ॣ': 'ḹ',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au'
};

export const marks = {
  'ं': 'ṃ', 'ः': 'ḥ', 'ँ': '̃'
};

export const virama = '्';

/**
 * Transliterate Devanagari text to IAST.
 * @param {string} text - Input string in Devanagari
 * @returns {string} Transliterated text in IAST
 */
export function devToIAST(text) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (vowels[ch]) {
      // Independent vowel
      result += vowels[ch];
    } else if (consonants[ch]) {
      const cons = consonants[ch];
      const next = text[i + 1];

      if (next && matras[next]) {
        // Consonant + matra
        result += cons + matras[next];
        i++;
      } else if (next === virama) {
        // Consonant + virama (no vowel)
        result += cons;
        i++;
      } else {
        // Consonant with inherent 'a'
        result += cons + 'a';
      }
    } else if (matras[ch]) {
      // Orphaned matra (rare)
      result += matras[ch];
    } else if (marks[ch]) {
      result += marks[ch];
    } else {
      // Default: keep unchanged
      result += ch;
    }
  }
  return result;
}
