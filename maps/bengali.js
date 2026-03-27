// Bengali transliteration table, indexed by (codepoint - 0x0980)
// Each entry: [itrans, iso, ipa] — null = pass through original character
// Note: Bengali ITRANS uses subscript-o (ₒ) as inherent vowel marker; IPA uses modifier open-o (ᵓ).
// Bengali phonology: no vowel length distinction; আ=/a/, অ=/ɔ/; ঐ=/oi/, ঔ=/ou/; য=/dʒ/; ণ merged with ন.
var bengaliTable = (function () {
  const t = new Array(0x80).fill(null);
  // 0x00 (Bengali Anji) — ornamental character, not transliterated, shown as-is
  t[0x01] = ['ⁿ', 'ṁ', 'ñ'];
  t[0x02] = ['ⁿ', 'ṃ', 'n'];
  t[0x03] = ['H', 'ḥ', 'h'];

  t[0x05] = ['a', 'a', 'ɔ'];
  t[0x06] = ['A', 'ā', 'a'];
  t[0x07] = ['i', 'i', 'i'];
  t[0x08] = ['I', 'ī', 'i'];
  t[0x09] = ['u', 'u', 'u'];
  t[0x0a] = ['U', 'ū', 'u'];
  t[0x0b] = ['ri', 'ṛ', 'ri'];
  t[0x0c] = ['li', 'ḷ', 'li'];
  t[0x0f] = ['e', 'e', 'e'];
  t[0x10] = ['ai', 'ai', 'oi'];
  t[0x13] = ['o', 'o', 'o'];
  t[0x14] = ['au', 'au', 'ou'];

  t[0x15] = ['kₒ', 'ka', 'kᵓ'];
  t[0x16] = ['khₒ', 'kha', 'kʰᵓ'];
  t[0x17] = ['gₒ', 'ga', 'ɡᵓ'];
  t[0x18] = ['ghₒ', 'gha', 'ɡʱᵓ'];
  t[0x19] = ['ŋₒ', 'ṅa', 'ŋᵓ'];
  t[0x1a] = ['chₒ', 'ca', 'tʃᵓ'];
  t[0x1b] = ['Chₒ', 'cha', 'tʃʰᵓ'];
  t[0x1c] = ['jₒ', 'ja', 'dʒᵓ'];
  t[0x1d] = ['jhₒ', 'jha', 'dʒʱᵓ'];
  t[0x1e] = ['jnₒ', 'ña', 'ɲᵓ'];
  t[0x1f] = ['Tₒ', 'ṭa', 'ʈᵓ'];
  t[0x20] = ['Thₒ', 'ṭha', 'ʈʰᵓ'];
  t[0x21] = ['Dₒ', 'ḍa', 'ɖᵓ'];
  t[0x22] = ['Dhₒ', 'ḍha', 'ɖʱᵓ'];
  t[0x23] = ['Nₒ', 'ṇa', 'nᵓ'];
  t[0x24] = ['tₒ', 'ta', 'tᵓ'];
  t[0x25] = ['thₒ', 'tha', 'tʰᵓ'];
  t[0x26] = ['dₒ', 'da', 'dᵓ'];
  t[0x27] = ['dhₒ', 'dha', 'dʱᵓ'];
  t[0x28] = ['nₒ', 'na', 'nᵓ'];
  t[0x2a] = ['pₒ', 'pa', 'pᵓ'];
  t[0x2b] = ['phₒ', 'pha', 'pʰᵓ'];
  t[0x2c] = ['bₒ', 'ba', 'bᵓ'];
  t[0x2d] = ['bhₒ', 'bha', 'bʱᵓ'];
  t[0x2e] = ['mₒ', 'ma', 'mᵓ'];
  t[0x2f] = ['jₒ', 'ya', 'dʒᵓ'];  // য — /dʒ/ in Bengali, not /j/
  t[0x30] = ['rₒ', 'ra', 'rᵓ'];
  t[0x32] = ['lₒ', 'la', 'lᵓ'];
  t[0x36] = ['shₒ', 'śa', 'ʃᵓ'];
  t[0x37] = ['Shₒ', 'ṣa', 'ʃᵓ'];
  t[0x38] = ['sₒ', 'sa', 'sᵓ'];
  t[0x39] = ['hₒ', 'ha', 'ɦᵓ'];

  t[0x3d] = ["'", "'", "'"];

  t[0x3e] = ['A', 'ā', 'a'];
  t[0x3f] = ['i', 'i', 'i'];
  t[0x40] = ['I', 'ī', 'i'];
  t[0x41] = ['u', 'u', 'u'];
  t[0x42] = ['U', 'ū', 'u'];
  t[0x43] = ['ri', 'ṛ', 'ri'];
  t[0x44] = ['ri', 'ṝ', 'ri'];
  t[0x47] = ['e', 'e', 'e'];
  t[0x48] = ['ai', 'ai', 'oi'];
  t[0x4b] = ['o', 'o', 'o'];
  t[0x4c] = ['au', 'au', 'ou'];
  t[0x4d] = ['', '', ''];         // hasanta/virama — suppresses inherent vowel
  t[0x4e] = ['t', 't', 't'];

  t[0x57] = ['u', 'u', 'u'];
  t[0x5c] = ['Rₒ', 'ṛa', 'ɽᵓ'];
  t[0x5d] = ['Rhₒ', 'ṛha', 'ɽʱᵓ'];
  t[0x5f] = ['yₒ', 'ẏa', 'jᵓ'];  // য় — /j/, distinct from য /dʒ/

  t[0x60] = ['ri', 'ṝ', 'riː'];
  t[0x61] = ['li', 'ḹ', 'liː'];
  t[0x62] = ['li', 'ḷ', 'li'];
  t[0x63] = ['li', 'ḹ', 'li'];

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

  t[0x70] = ['rₒ', 'ra', 'rᵓ'];
  t[0x71] = ['wₒ', 'va', 'wᵓ'];
  t[0x72] = ['Rs', 'Rs', 'Rs'];
  t[0x73] = ['INR', 'INR', 'INR'];
  t[0x74] = ['¹⁄₁₆', '¹⁄₁₆', '¹⁄₁₆'];
  t[0x75] = ['⅛', '⅛', '⅛'];
  t[0x76] = ['³⁄₁₆', '³⁄₁₆', '³⁄₁₆'];
  t[0x77] = ['¼', '¼', '¼'];
  t[0x78] = ['¹⁵⁄₁₆', '¹⁵⁄₁₆', '¹⁵⁄₁₆'];
  t[0x79] = ['16', '16', '16'];
  t[0x7a] = ['¶', '¶', '¶'];
  t[0x7b] = ['.', '.', '.'];
  t[0x7c] = ['ⁿ', 'ṃ', 'n'];
  t[0x7d] = ['.', '.', '.'];
  t[0x7e] = ['', '', ''];         // Sandhi Mark — suppressed, like virama

  return t;
})();
