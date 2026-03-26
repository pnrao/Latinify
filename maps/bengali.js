// Bengali transliteration table, indexed by (codepoint - 0x0980)
// Each entry: [itrans, iso, ipa] — null = pass through original character
// Note: Bengali ITRANS uses subscript-o (ₒ) as inherent vowel marker.
var bengaliTable = (function () {
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
  t[0x0f] = ['e', 'e', null];
  t[0x10] = ['ai', 'ai', null];
  t[0x13] = ['o', 'o', null];
  t[0x14] = ['au', 'au', null];

  t[0x15] = ['kₒ', 'ka', null];
  t[0x16] = ['khₒ', 'kha', null];
  t[0x17] = ['gₒ', 'ga', null];
  t[0x18] = ['ghₒ', 'gha', null];
  t[0x19] = ['ŋₒ', 'ṅa', null];
  t[0x1a] = ['chₒ', 'ca', null];
  t[0x1b] = ['Chₒ', 'cha', null];
  t[0x1c] = ['jₒ', 'ja', null];
  t[0x1d] = ['jhₒ', 'jha', null];
  t[0x1e] = ['jnₒ', 'ña', null];
  t[0x1f] = ['Tₒ', 'ṭa', null];
  t[0x20] = ['Thₒ', 'ṭha', null];
  t[0x21] = ['Dₒ', 'ḍa', null];
  t[0x22] = ['Dhₒ', 'ḍha', null];
  t[0x23] = ['Nₒ', 'ṇa', null];
  t[0x24] = ['tₒ', 'ta', null];
  t[0x25] = ['thₒ', 'tha', null];
  t[0x26] = ['dₒ', 'da', null];
  t[0x27] = ['dhₒ', 'dha', null];
  t[0x28] = ['nₒ', 'na', null];
  t[0x2a] = ['pₒ', 'pa', null];
  t[0x2b] = ['phₒ', 'pha', null];
  t[0x2c] = ['bₒ', 'ba', null];
  t[0x2d] = ['bhₒ', 'bha', null];
  t[0x2e] = ['mₒ', 'ma', null];
  t[0x2f] = ['yₒ', 'ya', null];
  t[0x30] = ['rₒ', 'ra', null];
  t[0x32] = ['lₒ', 'la', null];
  t[0x36] = ['shₒ', 'śa', null];
  t[0x37] = ['Shₒ', 'ṣa', null];
  t[0x38] = ['sₒ', 'sa', null];
  t[0x39] = ['hₒ', 'ha', null];

  t[0x3d] = ["'", "'", null];

  t[0x3e] = ['A', 'ā', null];
  t[0x3f] = ['i', 'i', null];
  t[0x40] = ['I', 'ī', null];
  t[0x41] = ['u', 'u', null];
  t[0x42] = ['U', 'ū', null];
  t[0x43] = ['ri', 'ṛ', null];
  t[0x44] = ['ri', 'ṝ', null];
  t[0x47] = ['e', 'e', null];
  t[0x48] = ['ai', 'ai', null];
  t[0x4b] = ['o', 'o', null];
  t[0x4c] = ['au', 'au', null];
  t[0x4d] = ['', '', null]; // virama — suppresses inherent vowel
  t[0x4e] = ['t', 't', null];

  t[0x5c] = ['Rₒ', 'ṛa', null];
  t[0x5d] = ['Rhₒ', 'ṛha', null];
  t[0x5f] = ['yₒ', 'ya', null];

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

  t[0x70] = ['rₒ', 'ra', null];
  t[0x71] = ['wₒ', 'va', null];
  t[0x72] = ['Rs', 'Rs', null];
  t[0x73] = ['INR', 'INR', null];
  t[0x74] = [' 1/16', ' 1/16', null];
  t[0x75] = ['⅛', '⅛', null];
  t[0x76] = [' 3/16', ' 3/16', null];
  t[0x77] = ['¼', '¼', null];
  t[0x78] = [' 15/16', ' 15/16', null];
  t[0x79] = ['16', '16', null];
  t[0x7a] = ['¶', '¶', null];

  return t;
})();
