// Gujarati transliteration table, indexed by (codepoint - 0x0A80)
// Each entry: [itrans, iso, ipa] — null = pass through original character
// Note: Gujarati ITRANS uses subscript-a (ₐ) as inherent vowel marker; IPA uses modifier schwa (ᵃ).
var gujaratiTable = (function () {
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
  t[0x0b] = ['ri', 'ṛ', 'ri'];
  t[0x0c] = ['li', 'ḷ', 'li'];
  t[0x0d] = ['e', 'æ', 'ɛ'];
  t[0x0f] = ['e', 'e', 'eː'];
  t[0x10] = ['ai', 'ai', 'ɛː'];
  t[0x11] = ['o', 'o', 'ɔ'];
  t[0x13] = ['o', 'o', 'oː'];
  t[0x14] = ['au', 'au', 'ɔː'];

  t[0x15] = ['kₐ', 'ka', 'kᵃ'];
  t[0x16] = ['khₐ', 'kha', 'kʰᵃ'];
  t[0x17] = ['gₐ', 'ga', 'ɡᵃ'];
  t[0x18] = ['ghₐ', 'gha', 'ɡʱᵃ'];
  t[0x19] = ['gnₐ', 'ṅa', 'ŋᵃ'];
  t[0x1a] = ['chₐ', 'ca', 'tʃᵃ'];
  t[0x1b] = ['Chₐ', 'cha', 'tʃʰᵃ'];
  t[0x1c] = ['jₐ', 'ja', 'dʒᵃ'];
  t[0x1d] = ['jhₐ', 'jha', 'dʒʱᵃ'];
  t[0x1e] = ['jnₐ', 'ña', 'ɲᵃ'];
  t[0x1f] = ['Tₐ', 'ṭa', 'ʈᵃ'];
  t[0x20] = ['Thₐ', 'ṭha', 'ʈʰᵃ'];
  t[0x21] = ['Dₐ', 'ḍa', 'ɖᵃ'];
  t[0x22] = ['Dhₐ', 'ḍha', 'ɖʱᵃ'];
  t[0x23] = ['Nₐ', 'ṇa', 'ɳᵃ'];
  t[0x24] = ['tₐ', 'ta', 'tᵃ'];
  t[0x25] = ['thₐ', 'tha', 'tʰᵃ'];
  t[0x26] = ['dₐ', 'da', 'dᵃ'];
  t[0x27] = ['dhₐ', 'dha', 'dʱᵃ'];
  t[0x28] = ['nₐ', 'na', 'nᵃ'];
  t[0x2a] = ['pₐ', 'pa', 'pᵃ'];
  t[0x2b] = ['phₐ', 'pha', 'pʰᵃ'];
  t[0x2c] = ['bₐ', 'ba', 'bᵃ'];
  t[0x2d] = ['bhₐ', 'bha', 'bʱᵃ'];
  t[0x2e] = ['mₐ', 'ma', 'mᵃ'];
  t[0x2f] = ['yₐ', 'ya', 'jᵃ'];
  t[0x30] = ['rₐ', 'ra', 'rᵃ'];
  t[0x32] = ['lₐ', 'la', 'lᵃ'];
  t[0x33] = ['Lₐ', 'ḷa', 'ɭᵃ'];
  t[0x35] = ['vₐ', 'va', 'ʋᵃ'];
  t[0x36] = ['shₐ', 'śa', 'ʃᵃ'];
  t[0x37] = ['Shₐ', 'ṣa', 'ʂᵃ'];
  t[0x38] = ['sₐ', 'sa', 'sᵃ'];
  t[0x39] = ['hₐ', 'ha', 'ɦᵃ'];
  // Nukta (0x3C) handled procedurally — leave null
  t[0x3d] = ["'", "'", "'"];

  t[0x3e] = ['A', 'ā', 'aː'];
  t[0x3f] = ['i', 'i', 'i'];
  t[0x40] = ['I', 'ī', 'iː'];
  t[0x41] = ['u', 'u', 'u'];
  t[0x42] = ['U', 'ū', 'uː'];
  t[0x43] = ['ri', 'ṛ', 'ri'];
  t[0x44] = ['ri', 'ṝ', 'riː'];
  t[0x45] = ['e', 'æ', 'ɛ'];
  t[0x47] = ['e', 'e', 'eː'];
  t[0x48] = ['ai', 'ai', 'ɛː'];
  t[0x49] = ['o', 'o', 'ɔ'];
  t[0x4b] = ['o', 'o', 'oː'];
  t[0x4c] = ['au', 'au', 'ɔː'];
  t[0x4d] = ['', '', ''];        // virama — suppresses inherent vowel

  // 0x50 (Gujarati OM) — sacred symbol, pass through
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

  t[0x70] = ['.', '.', '.'];
  t[0x71] = ['Rs.', 'Rs.', 'Rs.'];
  t[0x79] = ['zhₐ', 'ḻa', 'ɻᵃ'];

  return t;
})();
