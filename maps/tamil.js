// Tamil transliteration table, indexed by (codepoint - 0x0B80)
// Each entry: [itrans, iso, ipa] — null = pass through original character
// IPA uses plain a as inherent vowel — consistently pronounced in Tamil.
var tamilTable = (function () {
  const t = new Array(0x80).fill(null);
  t[0x02] = ['ᵐ', 'ṃ', 'n'];
  t[0x03] = ['H', 'ḥ', 'ʔ'];    // aytham — glottal stop, not a Sanskrit visarga

  t[0x05] = ['a', 'a', 'a'];
  t[0x06] = ['A', 'ā', 'aː'];
  t[0x07] = ['i', 'i', 'i'];
  t[0x08] = ['I', 'ī', 'iː'];
  t[0x09] = ['u', 'u', 'u'];
  t[0x0a] = ['U', 'ū', 'uː'];
  t[0x0e] = ['e', 'e', 'e'];
  t[0x0f] = ['E', 'ē', 'eː'];
  t[0x10] = ['ai', 'ai', 'aj'];
  t[0x12] = ['o', 'o', 'o'];
  t[0x13] = ['O', 'ō', 'oː'];
  t[0x14] = ['au', 'au', 'aʋ'];

  t[0x15] = ['ka', 'ka', 'ka'];
  t[0x19] = ['ŋa', 'ṅa', 'ŋa'];
  t[0x1a] = ['cha', 'ca', 'tʃa'];
  t[0x1c] = ['ja', 'ja', 'dʒa'];
  t[0x1e] = ['ɲa', 'ña', 'ɲa'];
  t[0x1f] = ['Ta', 'ṭa', 'ʈa'];
  t[0x23] = ['Na', 'ṇa', 'ɳa'];
  t[0x24] = ['ta', 'ta', 'ta'];
  t[0x28] = ['na', 'na', 'na'];
  t[0x29] = ['na', 'ṉa', 'na'];
  t[0x2a] = ['pa', 'pa', 'pa'];
  t[0x2e] = ['ma', 'ma', 'ma'];
  t[0x2f] = ['ya', 'ya', 'ja'];
  t[0x30] = ['ra', 'ra', 'ɾa'];
  t[0x31] = ['Ra', 'ṟa', 'ra'];
  t[0x32] = ['la', 'la', 'la'];
  t[0x33] = ['La', 'ḷa', 'ɭa'];
  t[0x34] = ['Lha', 'ḻa', 'ɻa'];
  t[0x35] = ['va', 'va', 'ʋa'];
  t[0x36] = ['sha', 'śa', 'ʃa'];
  t[0x37] = ['Sha', 'ṣa', 'ʂa'];
  t[0x38] = ['sa', 'sa', 'sa'];
  t[0x39] = ['ha', 'ha', 'ɦa'];

  t[0x3e] = ['A', 'ā', 'aː'];
  t[0x3f] = ['i', 'i', 'i'];
  t[0x40] = ['I', 'ī', 'iː'];
  t[0x41] = ['u', 'u', 'u'];
  t[0x42] = ['U', 'ū', 'uː'];
  t[0x46] = ['e', 'e', 'e'];
  t[0x47] = ['E', 'ē', 'eː'];
  t[0x48] = ['ai', 'ai', 'aj'];
  t[0x4a] = ['o', 'o', 'o'];
  t[0x4b] = ['O', 'ō', 'oː'];
  t[0x4c] = ['au', 'au', 'aʋ'];
  t[0x4d] = ['', '', ''];          // virama (pulli) — suppresses inherent vowel
  t[0x57] = ['au', 'au', 'aʋ'];

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
  t[0x70] = ['10', '10', '10'];
  t[0x71] = ['100', '100', '100'];
  t[0x72] = ['1000', '1000', '1000'];
  t[0x73] = ['day', 'day', 'day'];
  t[0x74] = ['month', 'month', 'month'];
  t[0x75] = ['year', 'year', 'year'];
  t[0x76] = ['dr.', 'dr.', 'dr.'];
  t[0x77] = ['cr.', 'cr.', 'cr.'];
  t[0x78] = ['do.', 'do.', 'do.'];
  t[0x79] = ['INR', 'INR', 'INR'];
  t[0x7a] = ['#', '#', '#'];

  return t;
})();
