// Gujarati transliteration table, indexed by (codepoint - 0x0A80)
// Each entry: [itrans, iso, ipa] — null = pass through original character
// Note: Gujarati ITRANS uses subscript-a (ₐ) as inherent vowel marker.
var gujaratiTable = (function () {
  const t = new Array(0x80).fill(null);
  // 0x00 - unmapped
  t[0x01] = ['ⁿ', 'ṁ', null];
  t[0x02] = ['ⁿ', 'ṃ', null];
  t[0x03] = ['H', 'ḥ', null];

  t[0x05] = ['a', 'a', null];
  t[0x06] = ['A', 'ā', null];
  t[0x07] = ['i', 'i', null];
  t[0x08] = ['I', 'ī', null];
  t[0x09] = ['u', 'u', null];
  t[0x0a] = ['U', 'ū', null];
  t[0x0b] = ['ri', 'ṛ', null];
  t[0x0c] = ['li', 'ḷ', null];
  t[0x0d] = ['e', 'æ', null];
  t[0x0f] = ['e', 'e', null];
  t[0x10] = ['ai', 'ai', null];
  t[0x11] = ['o', 'o', null];
  t[0x13] = ['o', 'o', null];
  t[0x14] = ['au', 'au', null];

  t[0x15] = ['kₐ', 'ka', null];
  t[0x16] = ['khₐ', 'kha', null];
  t[0x17] = ['gₐ', 'ga', null];
  t[0x18] = ['ghₐ', 'gha', null];
  t[0x19] = ['gnₐ', 'ṅa', null];
  t[0x1a] = ['chₐ', 'ca', null];
  t[0x1b] = ['Chₐ', 'cha', null];
  t[0x1c] = ['jₐ', 'ja', null];
  t[0x1d] = ['jhₐ', 'jha', null];
  t[0x1e] = ['jnₐ', 'ña', null];
  t[0x1f] = ['Tₐ', 'ṭa', null];
  t[0x20] = ['Thₐ', 'ṭha', null];
  t[0x21] = ['Dₐ', 'ḍa', null];
  t[0x22] = ['Dhₐ', 'ḍha', null];
  t[0x23] = ['Nₐ', 'ṇa', null];
  t[0x24] = ['tₐ', 'ta', null];
  t[0x25] = ['thₐ', 'tha', null];
  t[0x26] = ['dₐ', 'da', null];
  t[0x27] = ['dhₐ', 'dha', null];
  t[0x28] = ['nₐ', 'na', null];
  t[0x2a] = ['pₐ', 'pa', null];
  t[0x2b] = ['phₐ', 'pha', null];
  t[0x2c] = ['bₐ', 'ba', null];
  t[0x2d] = ['bhₐ', 'bha', null];
  t[0x2e] = ['mₐ', 'ma', null];
  t[0x2f] = ['yₐ', 'ya', null];
  t[0x30] = ['rₐ', 'ra', null];
  t[0x32] = ['lₐ', 'la', null];
  t[0x33] = ['Lₐ', 'ḷa', null];
  t[0x35] = ['vₐ', 'va', null];
  t[0x36] = ['shₐ', 'śa', null];
  t[0x37] = ['Shₐ', 'ṣa', null];
  t[0x38] = ['sₐ', 'sa', null];
  t[0x39] = ['hₐ', 'ha', null];
  // Nukta (0x3C) handled procedurally — leave null
  t[0x3d] = ["'", "'", null];

  t[0x3e] = ['A', 'ā', null];
  t[0x3f] = ['i', 'i', null];
  t[0x40] = ['I', 'ī', null];
  t[0x41] = ['u', 'u', null];
  t[0x42] = ['U', 'ū', null];
  t[0x43] = ['ri', 'ṛ', null];
  t[0x44] = ['ri', 'ṝ', null];
  t[0x45] = ['e', 'æ', null];
  t[0x47] = ['e', 'e', null];
  t[0x48] = ['ai', 'ai', null];
  t[0x49] = ['o', 'o', null];
  t[0x4b] = ['o', 'o', null];
  t[0x4c] = ['au', 'au', null];
  t[0x4d] = ['', '', null]; // virama — suppresses inherent vowel

  t[0x62] = ['li', 'ḷ', null];
  t[0x63] = ['li', 'ḹ', null];

  t[0x66] = ['0', '0', null];
  t[0x67] = ['1', '1', null];
  t[0x68] = ['2', '2', null];
  t[0x69] = ['3', '3', null];
  t[0x6a] = ['4', '4', null];
  t[0x6b] = ['5', '5', null];
  t[0x6c] = ['6', '6', null];
  t[0x6d] = ['7', '7', null];
  t[0x6e] = ['8', '8', null];
  t[0x6f] = ['9', '9', null];

  t[0x79] = ['zhₐ', 'ḻa', null];

  return t;
})();
