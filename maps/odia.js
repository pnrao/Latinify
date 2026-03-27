// Odia transliteration table, indexed by (codepoint - 0x0B00)
// Each entry: [itrans, iso, ipa] — null = pass through original character
// IPA uses plain ɔ as inherent vowel — /ɔ/ is consistently pronounced in Odia (unlike Bengali where it is often dropped).
var odiaTable = (function () {
  const t = new Array(0x80).fill(null);
  t[0x01] = ['ⁿ', 'ṁ', 'ñ'];
  t[0x02] = ['ⁿ', 'ṃ', 'n'];
  t[0x03] = ['H', 'ḥ', 'h'];

  t[0x05] = ['a', 'a', 'ɔ'];
  t[0x06] = ['A', 'ā', 'aː'];
  t[0x07] = ['i', 'i', 'i'];
  t[0x08] = ['I', 'ī', 'iː'];
  t[0x09] = ['u', 'u', 'u'];
  t[0x0a] = ['U', 'ū', 'uː'];
  t[0x0b] = ['ri', 'ṛ', 'ri'];
  t[0x0c] = ['li', 'ḷ', 'li'];
  t[0x0f] = ['e', 'e', 'eː'];
  t[0x10] = ['ai', 'ai', 'ɛː'];
  t[0x13] = ['o', 'o', 'oː'];
  t[0x14] = ['au', 'au', 'ɔː'];

  t[0x15] = ['ka', 'ka', 'kɔ'];
  t[0x16] = ['kha', 'kha', 'kʰɔ'];
  t[0x17] = ['ga', 'ga', 'ɡɔ'];
  t[0x18] = ['gha', 'gha', 'ɡʱɔ'];
  t[0x19] = ['gna', 'ṅa', 'ŋɔ'];
  t[0x1a] = ['cha', 'ca', 'tʃɔ'];
  t[0x1b] = ['Cha', 'cha', 'tʃʰɔ'];
  t[0x1c] = ['ja', 'ja', 'dʒɔ'];
  t[0x1d] = ['jha', 'jha', 'dʒʱɔ'];
  t[0x1e] = ['jna', 'ña', 'ɲɔ'];
  t[0x1f] = ['Ta', 'ṭa', 'ʈɔ'];
  t[0x20] = ['Tha', 'ṭha', 'ʈʰɔ'];
  t[0x21] = ['Da', 'ḍa', 'ɖɔ'];
  t[0x22] = ['Dha', 'ḍha', 'ɖʱɔ'];
  t[0x23] = ['Na', 'ṇa', 'ɳɔ'];
  t[0x24] = ['ta', 'ta', 'tɔ'];
  t[0x25] = ['tha', 'tha', 'tʰɔ'];
  t[0x26] = ['da', 'da', 'dɔ'];
  t[0x27] = ['dha', 'dha', 'dʱɔ'];
  t[0x28] = ['na', 'na', 'nɔ'];
  t[0x2a] = ['pa', 'pa', 'pɔ'];
  t[0x2b] = ['pha', 'pha', 'pʰɔ'];
  t[0x2c] = ['ba', 'ba', 'bɔ'];
  t[0x2d] = ['bha', 'bha', 'bʱɔ'];
  t[0x2e] = ['ma', 'ma', 'mɔ'];
  t[0x2f] = ['ya', 'ya', 'jɔ'];
  t[0x30] = ['ra', 'ra', 'rɔ'];
  t[0x32] = ['la', 'la', 'lɔ'];
  t[0x33] = ['La', 'ḷa', 'ɭɔ'];
  t[0x35] = ['va', 'va', 'ʋɔ'];
  t[0x36] = ['sha', 'śa', 'ʃɔ'];
  t[0x37] = ['Sha', 'ṣa', 'ʂɔ'];
  t[0x38] = ['sa', 'sa', 'sɔ'];
  t[0x39] = ['ha', 'ha', 'ɦɔ'];
  // Nukta (0x3C) handled procedurally — leave null
  t[0x3d] = ["'", "'", "'"];

  t[0x3e] = ['A', 'ā', 'aː'];
  t[0x3f] = ['i', 'i', 'i'];
  t[0x40] = ['I', 'ī', 'iː'];
  t[0x41] = ['u', 'u', 'u'];
  t[0x42] = ['U', 'ū', 'uː'];
  t[0x43] = ['ri', 'ṛ', 'ri'];
  t[0x44] = ['ri', 'ṝ', 'riː'];
  t[0x47] = ['e', 'e', 'eː'];
  t[0x48] = ['ai', 'ai', 'ɛː'];
  t[0x4b] = ['o', 'o', 'oː'];
  t[0x4c] = ['au', 'au', 'ɔː'];
  t[0x4d] = ['', '', ''];        // virama — suppresses inherent vowel

  t[0x5c] = ['Ra', 'ṛa', 'ɽɔ'];
  t[0x5d] = ['Rha', 'ṛha', 'ɽʱɔ'];
  t[0x5f] = ['ya', 'ya', 'jɔ'];

  t[0x60] = ['ri', 'ṝ', 'riː'];
  t[0x61] = ['li', 'ḹ', 'liː'];
  t[0x62] = ['li', 'ḷ', 'li'];
  t[0x63] = ['li', 'ḹ', 'liː'];

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

  // t[0x70] Isshar — religious symbol, pass through
  t[0x71] = ['wa', 'va', 'wa'];
  t[0x72] = ['¼', '¼', '¼'];
  t[0x73] = ['½', '½', '½'];
  t[0x74] = ['¾', '¾', '¾'];
  t[0x75] = ['¹⁄₁₆', '¹⁄₁₆', '¹⁄₁₆'];
  t[0x76] = ['⅛', '⅛', '⅛'];
  t[0x77] = ['³⁄₁₆', '³⁄₁₆', '³⁄₁₆'];

  return t;
})();
