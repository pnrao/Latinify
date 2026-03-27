// Telugu transliteration table, indexed by (codepoint - 0x0C00)
// Each entry: [itrans, iso, ipa] — null = pass through original character
// IPA uses plain a as inherent vowel — consistently pronounced in Telugu.
var teluguTable = (function () {
  const t = new Array(0x80).fill(null);

  t[0x00] = ['ⁿ', 'ṁ', 'ñ'];
  t[0x01] = ['ⁿ', 'ṁ', 'ñ'];
  t[0x02] = ['ᵐ', 'ṃ', 'n'];
  t[0x03] = ['H', 'ḥ', 'h'];
  t[0x04] = ['ᵐ', 'ṃ', 'n'];

  t[0x05] = ['a', 'a', 'a'];
  t[0x06] = ['A', 'ā', 'aː'];
  t[0x07] = ['i', 'i', 'i'];
  t[0x08] = ['I', 'ī', 'iː'];
  t[0x09] = ['u', 'u', 'u'];
  t[0x0a] = ['U', 'ū', 'uː'];
  t[0x0b] = ['ri', 'ṛ', 'ri'];
  t[0x0c] = ['li', 'ḷ', 'li'];
  t[0x0e] = ['e', 'e', 'e'];
  t[0x0f] = ['E', 'ē', 'eː'];
  t[0x10] = ['ai', 'ai', 'aj'];
  t[0x12] = ['o', 'o', 'o'];
  t[0x13] = ['O', 'ō', 'oː'];
  t[0x14] = ['au', 'au', 'aʋ'];

  t[0x15] = ['ka', 'ka', 'ka'];
  t[0x16] = ['kha', 'kha', 'kʰa'];
  t[0x17] = ['ga', 'ga', 'ɡa'];
  t[0x18] = ['gha', 'gha', 'ɡʱa'];
  t[0x19] = ['gna', 'ṅa', 'ŋa'];
  t[0x1a] = ['cha', 'ca', 'tʃa'];
  t[0x1b] = ['Cha', 'cha', 'tʃʰa'];
  t[0x1c] = ['ja', 'ja', 'dʒa'];
  t[0x1d] = ['jha', 'jha', 'dʒʱa'];
  t[0x1e] = ['jna', 'ña', 'ɲa'];
  t[0x1f] = ['Ta', 'ṭa', 'ʈa'];
  t[0x20] = ['Tha', 'ṭha', 'ʈʰa'];
  t[0x21] = ['Da', 'ḍa', 'ɖa'];
  t[0x22] = ['Dha', 'ḍha', 'ɖʱa'];
  t[0x23] = ['Na', 'ṇa', 'ɳa'];
  t[0x24] = ['ta', 'ta', 'ta'];
  t[0x25] = ['tha', 'tha', 'tʰa'];
  t[0x26] = ['da', 'da', 'da'];
  t[0x27] = ['dha', 'dha', 'dʱa'];
  t[0x28] = ['na', 'na', 'na'];
  t[0x2a] = ['pa', 'pa', 'pa'];
  t[0x2b] = ['pha', 'pha', 'pʰa'];
  t[0x2c] = ['ba', 'ba', 'ba'];
  t[0x2d] = ['bha', 'bha', 'bʱa'];
  t[0x2e] = ['ma', 'ma', 'ma'];
  t[0x2f] = ['ya', 'ya', 'ja'];
  t[0x30] = ['ra', 'ra', 'ra'];
  t[0x31] = ['Ra', 'ṟa', 'ɽa'];
  t[0x32] = ['la', 'la', 'la'];
  t[0x33] = ['La', 'ḷa', 'ɭa'];
  t[0x34] = ['LLLa', 'ḻa', 'ɻa'];
  t[0x35] = ['va', 'va', 'ʋa'];
  t[0x36] = ['sha', 'śa', 'ʃa'];
  t[0x37] = ['Sha', 'ṣa', 'ʂa'];
  t[0x38] = ['sa', 'sa', 'sa'];
  t[0x39] = ['ha', 'ha', 'ɦa'];

  t[0x3d] = ["'", "'", "'"];

  t[0x3e] = ['A', 'ā', 'aː'];
  t[0x3f] = ['i', 'i', 'i'];
  t[0x40] = ['I', 'ī', 'iː'];
  t[0x41] = ['u', 'u', 'u'];
  t[0x42] = ['U', 'ū', 'uː'];
  t[0x43] = ['ri', 'ṛ', 'ri'];
  t[0x44] = ['ri', 'ṝ', 'riː'];
  t[0x46] = ['e', 'e', 'e'];
  t[0x47] = ['E', 'ē', 'eː'];
  t[0x48] = ['ai', 'ai', 'aj'];
  t[0x4a] = ['o', 'o', 'o'];
  t[0x4b] = ['O', 'ō', 'oː'];
  t[0x4c] = ['au', 'au', 'aʋ'];
  t[0x4d] = ['', '', ''];          // virama — suppresses inherent vowel

  t[0x55] = ['', '', ''];          // length mark — stripped, vowel sign codepoints handle length
  t[0x56] = ['', '', ''];          // AI length mark — same

  t[0x58] = ['tsa', 'tsa', 'tsa'];
  t[0x59] = ['dza', 'dza', 'dza'];
  t[0x5a] = ['Ra', 'ṟa', 'ɽa'];
  t[0x5d] = ['na', 'na', 'na'];

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

  t[0x78] = [' 0', ' 0', ' 0'];
  t[0x79] = ['¼', '¼', '¼'];
  t[0x7a] = ['½', '½', '½'];
  t[0x7b] = ['¾', '¾', '¾'];
  t[0x7c] = ['¹⁄₁₆', '¹⁄₁₆', '¹⁄₁₆'];
  t[0x7d] = ['⅛', '⅛', '⅛'];
  t[0x7e] = ['³⁄₁₆', '³⁄₁₆', '³⁄₁₆'];
  // t[0x7f] Tuumu (తూము) — traditional unit of dry measure, pass through

  return t;
})();
