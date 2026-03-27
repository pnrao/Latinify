// Gurmukhi transliteration table, indexed by (codepoint - 0x0A00)
// Each entry: [itrans, iso, ipa] — null = pass through original character
// IPA uses modifier schwa (ᵃ) as inherent vowel marker.
var gurmukhiTable = (function () {
  const t = new Array(0x80).fill(null);
  t[0x01] = ['ⁿ', 'ṁ', 'ñ'];
  t[0x02] = ['ⁿ', 'ṃ', 'n'];
  t[0x03] = ['H', 'ḥ', 'h'];
  t[0x05] = ['a', 'a', 'a'];
  t[0x06] = ['A', 'ā', 'aː'];
  t[0x07] = ['i', 'i', 'i'];
  t[0x08] = ['I', 'ī', 'iː'];
  t[0x09] = ['u', 'u', 'u'];
  t[0x0a] = ['U', 'ū', 'uː'];
  t[0x0f] = ['e', 'e', 'eː'];
  t[0x10] = ['ai', 'ai', 'ɛː'];
  t[0x13] = ['o', 'o', 'oː'];
  t[0x14] = ['au', 'au', 'ɔː'];
  t[0x15] = ['ka', 'ka', 'kᵃ'];
  t[0x16] = ['kha', 'kha', 'kʰᵃ'];
  t[0x17] = ['ga', 'ga', 'ɡᵃ'];
  t[0x18] = ['gha', 'gha', 'ɡʱᵃ'];
  t[0x19] = ['gna', 'ṅa', 'ŋᵃ'];
  t[0x1a] = ['cha', 'ca', 'tʃᵃ'];
  t[0x1b] = ['Cha', 'cha', 'tʃʰᵃ'];
  t[0x1c] = ['ja', 'ja', 'dʒᵃ'];
  t[0x1d] = ['jha', 'jha', 'dʒʱᵃ'];
  t[0x1e] = ['jna', 'ña', 'ɲᵃ'];
  t[0x1f] = ['Ta', 'ṭa', 'ʈᵃ'];
  t[0x20] = ['Tha', 'ṭha', 'ʈʰᵃ'];
  t[0x21] = ['Da', 'ḍa', 'ɖᵃ'];
  t[0x22] = ['Dha', 'ḍha', 'ɖʱᵃ'];
  t[0x23] = ['Na', 'ṇa', 'ɳᵃ'];
  t[0x24] = ['ta', 'ta', 'tᵃ'];
  t[0x25] = ['tha', 'tha', 'tʰᵃ'];
  t[0x26] = ['da', 'da', 'dᵃ'];
  t[0x27] = ['dha', 'dha', 'dʱᵃ'];
  t[0x28] = ['na', 'na', 'nᵃ'];
  t[0x2a] = ['pa', 'pa', 'pᵃ'];
  t[0x2b] = ['pha', 'pha', 'pʰᵃ'];
  t[0x2c] = ['ba', 'ba', 'bᵃ'];
  t[0x2d] = ['bha', 'bha', 'bʱᵃ'];
  t[0x2e] = ['ma', 'ma', 'mᵃ'];
  t[0x2f] = ['ya', 'ya', 'jᵃ'];
  t[0x30] = ['ra', 'ra', 'rᵃ'];
  t[0x32] = ['la', 'la', 'lᵃ'];
  t[0x33] = ['La', 'ḷa', 'ɭᵃ'];
  t[0x35] = ['va', 'va', 'ʋᵃ'];
  t[0x36] = ['sha', 'śa', 'ʃᵃ'];
  t[0x38] = ['sa', 'sa', 'sᵃ'];
  t[0x39] = ['ha', 'ha', 'ɦᵃ'];
  // Nukta (0x3C) handled procedurally — leave null
  t[0x3e] = ['A', 'ā', 'aː'];
  t[0x3f] = ['i', 'i', 'i'];
  t[0x40] = ['I', 'ī', 'iː'];
  t[0x41] = ['u', 'u', 'u'];
  t[0x42] = ['U', 'ū', 'uː'];
  t[0x47] = ['e', 'e', 'eː'];
  t[0x48] = ['ai', 'ai', 'ɛː'];
  t[0x4b] = ['o', 'o', 'oː'];
  t[0x4c] = ['au', 'au', 'ɔː'];
  t[0x4d] = ['', '', ''];        // virama — suppresses inherent vowel
  t[0x51] = ['', '', ''];        // Udaat — Vedic tone mark, suppressed like Devanagari udatta
  t[0x59] = ['qa', 'qa', 'qᵃ'];
  t[0x5a] = ['Gha', 'Gha', 'ɣᵃ'];
  t[0x5b] = ['za', 'za', 'zᵃ'];
  t[0x5c] = ['Ra', 'ṛa', 'ɽᵃ'];
  t[0x5e] = ['fa', 'fa', 'fᵃ'];
  t[0x66] = ['0', '0', '0'];
  t[0x67] = ['1', '1', '1'];
  t[0x68] = ['2', '2', '2'];
  t[0x69] = ['3', '3', '3'];
  t[0x6a] = ['4', '4', '4'];
  t[0x6b] = ['5', '5', '5'];
  t[0x6c] = ['6', '6', '6'];
  t[0x6d] = ['7', '7', '7'];
  t[0x6e] = ['8', '8', '8'];
  t[0x6f] = ['9', '9', '9'];
  t[0x70] = ['ⁿ', 'ṃ', 'n'];
  // t[0x71] addak — handled programmatically in content.js, not reached here
  // t[0x72] IRI, t[0x73] URA, t[0x75] YAKASH — base carrier letters, pass through
  // t[0x74] Ek Onkar (ੴ) — sacred Sikh symbol, pass through
  t[0x76] = ['.', '.', '.'];

  return t;
})();
