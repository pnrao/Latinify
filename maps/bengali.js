var bengaliMaps = { itrans: {
    // Vowels
    'অ': 'a', 'আ': 'A', 'ই': 'i', 'ঈ': 'I', 'উ': 'u', 'ঊ': 'U',
    'ঋ': 'ri', 'ৠ': 'ri', 'ঌ': 'li', 'ৡ': 'li',
    'এ': 'e', 'ঐ': 'ai', 'ও': 'o', 'ঔ': 'au',

    // Consonants
    'ক': 'kₒ', 'খ': 'khₒ', 'গ': 'gₒ', 'ঘ': 'ghₒ', 'ঙ': 'ŋₒ',
    'চ': 'chₒ', 'ছ': 'Chₒ', 'জ': 'jₒ', 'ঝ': 'jhₒ', 'ঞ': 'jnₒ',
    'ট': 'Tₒ', 'ঠ': 'Thₒ', 'ড': 'Dₒ', 'ঢ': 'Dhₒ', 'ণ': 'Nₒ',
    'ত': 'tₒ', 'থ': 'thₒ', 'দ': 'dₒ', 'ধ': 'dhₒ', 'ন': 'nₒ',
    'প': 'pₒ', 'ফ': 'phₒ', 'ব': 'bₒ', 'ভ': 'bhₒ', 'ম': 'mₒ',
    'য': 'yₒ', 'র': 'rₒ', 'ল': 'lₒ', 'শ': 'shₒ', 'ষ': 'Shₒ', 'স': 'sₒ', 'হ': 'hₒ',
    '\u09A1\u09BC': 'Rₒ', '\u09A2\u09BC': 'Rhₒ', '\u09AF\u09BC': 'yₒ', // ড় ঢ় য়
    'ৰ': 'rₒ', 'ৱ': 'wₒ', // Assamese ra, wa
    'ৎ': 't', // khanda ta: terminal consonant without inherent vowel

    // Matras (Vowel signs)
    'া': 'A', 'ি': 'i', 'ী': 'I', 'ু': 'u', 'ূ': 'U',
    'ৃ': 'ri', 'ৄ': 'ri',
    'ে': 'e', 'ৈ': 'ai', 'ো': 'o', 'ৌ': 'au',

    // Vocalic L matras (outside matra range, treated as discrete)
    'ৢ': 'li', 'ৣ': 'li',

    // Additional marks
    '্': '', 'ং': 'ⁿ', 'ঃ': 'H', 'ঁ': 'ⁿ',
    '়': '', // Nukta
    'ঽ': "'", // Avagraha

    // Numerals
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',

    // Currency
    '৲': 'Rs', '৳': 'INR',

    // Fractions (anna subdivisions, denominator 16)
    '৴': ' 1/16', '৵': '⅛', '৶': ' 3/16', '৷': '¼', '৸': ' 15/16', '৹': '16',

    // Others
    '।': '. ', '॥': '. ',
    '৺': '¶',
    ' ': ' '
}, iso: {}, ipa: {} };
