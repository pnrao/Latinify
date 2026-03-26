// Telugu transliteration table, indexed by (codepoint - 0x0C00)
// Each entry: [itrans, iso, ipa] — null = pass through original character
var teluguTable = (function() {
    const t = new Array(0x80).fill(null);

    t[0x00] = ['ⁿ',   'ṁ',  null];
    t[0x01] = ['ⁿ',   'ṁ',  null];
    t[0x02] = ['ᵐ',   'ṃ',  null];
    t[0x03] = ['H',   'ḥ',  null];
    t[0x04] = ['ᵐ',   'ṃ',  null];

    t[0x05] = ['a',   'a',  null];
    t[0x06] = ['A',   'ā',  null];
    t[0x07] = ['i',   'i',  null];
    t[0x08] = ['I',   'ī',  null];
    t[0x09] = ['u',   'u',  null];
    t[0x0A] = ['U',   'ū',  null];
    t[0x0B] = ['ri',  'ṛ',  null];
    t[0x0C] = ['li',  'ḷ',  null];
    t[0x0E] = ['e',   'e',  null];
    t[0x0F] = ['E',   'ē',  null];
    t[0x10] = ['ai',  'ai', null];
    t[0x12] = ['o',   'o',  null];
    t[0x13] = ['O',   'ō',  null];
    t[0x14] = ['au',  'au', null];

    t[0x15] = ['ka',  'ka',  null];
    t[0x16] = ['kha', 'kha', null];
    t[0x17] = ['ga',  'ga',  null];
    t[0x18] = ['gha', 'gha', null];
    t[0x19] = ['gna', 'ṅa',  null];
    t[0x1A] = ['cha', 'ca',  null];
    t[0x1B] = ['Cha', 'cha', null];
    t[0x1C] = ['ja',  'ja',  null];
    t[0x1D] = ['jha', 'jha', null];
    t[0x1E] = ['jna', 'ña',  null];
    t[0x1F] = ['Ta',  'ṭa',  null];
    t[0x20] = ['Tha', 'ṭha', null];
    t[0x21] = ['Da',  'ḍa',  null];
    t[0x22] = ['Dha', 'ḍha', null];
    t[0x23] = ['Na',  'ṇa',  null];
    t[0x24] = ['ta',  'ta',  null];
    t[0x25] = ['tha', 'tha', null];
    t[0x26] = ['da',  'da',  null];
    t[0x27] = ['dha', 'dha', null];
    t[0x28] = ['na',  'na',  null];
    t[0x2A] = ['pa',  'pa',  null];
    t[0x2B] = ['pha', 'pha', null];
    t[0x2C] = ['ba',  'ba',  null];
    t[0x2D] = ['bha', 'bha', null];
    t[0x2E] = ['ma',  'ma',  null];
    t[0x2F] = ['ya',  'ya',  null];
    t[0x30] = ['ra',  'ra',  null];
    t[0x31] = ['rra', 'ṟa',  null];
    t[0x32] = ['la',  'la',  null];
    t[0x33] = ['La',  'ḷa',  null];
    t[0x34] = ['LLLa','ḻa',  null];
    t[0x35] = ['va',  'va',  null];
    t[0x36] = ['sha', 'śa',  null];
    t[0x37] = ['Sha', 'ṣa',  null];
    t[0x38] = ['sa',  'sa',  null];
    t[0x39] = ['ha',  'ha',  null];

    t[0x3D] = ["'",   "'",   null];

    t[0x3E] = ['A',   'ā',  null];
    t[0x3F] = ['i',   'i',  null];
    t[0x40] = ['I',   'ī',  null];
    t[0x41] = ['u',   'u',  null];
    t[0x42] = ['U',   'ū',  null];
    t[0x43] = ['ri',  'ṛ',  null];
    t[0x44] = ['ri',  'ṝ',  null];
    t[0x46] = ['e',   'e',  null];
    t[0x47] = ['E',   'ē',  null];
    t[0x48] = ['ai',  'ai', null];
    t[0x4A] = ['o',   'o',  null];
    t[0x4B] = ['O',   'ō',  null];
    t[0x4C] = ['au',  'au', null];
    t[0x4D] = ['',    '',   null];

    t[0x55] = ['',    '',   null];
    t[0x56] = ['',    '',   null];

    t[0x58] = ['tsa', null, null];
    t[0x59] = ['dza', null, null];
    t[0x5A] = ['rra', null, null];
    t[0x5D] = ['na',  null, null];

    t[0x60] = ['ri',  'ṝ',  null];
    t[0x61] = ['li',  'ḹ',  null];
    t[0x62] = ['li',  'ḷ',  null];
    t[0x63] = ['li',  'ḹ',  null];

    t[0x66] = ['0', '0', null];
    t[0x67] = ['1', '1', null];
    t[0x68] = ['2', '2', null];
    t[0x69] = ['3', '3', null];
    t[0x6A] = ['4', '4', null];
    t[0x6B] = ['5', '5', null];
    t[0x6C] = ['6', '6', null];
    t[0x6D] = ['7', '7', null];
    t[0x6E] = ['8', '8', null];
    t[0x6F] = ['9', '9', null];

    t[0x78] = [' 0',    ' 0',    null];
    t[0x79] = ['¼',     '¼',     null];
    t[0x7A] = ['½',     '½',     null];
    t[0x7B] = ['¾',     '¾',     null];
    t[0x7C] = [' 1/16', ' 1/16', null];
    t[0x7D] = ['⅛',     '⅛',     null];
    t[0x7E] = [' 3/16', ' 3/16', null];

    return t;
})();
