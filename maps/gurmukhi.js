var gurmukhiMaps = { itrans: {
    // Vowels
    'ਅ': 'a', 'ਆ': 'A', 'ਇ': 'i', 'ਈ': 'I', 'ਉ': 'u', 'ਊ': 'U',
    'ਏ': 'e', 'ਐ': 'ai', 'ਓ': 'o', 'ਔ': 'au',

    // Carrier letters (silent base; following matra provides the vowel)
    'ੳ': '', 'ੲ': '',

    // Consonants
    'ਕ': 'ka', 'ਖ': 'kha', 'ਗ': 'ga', 'ਘ': 'gha', 'ਙ': 'gna',
    'ਚ': 'cha', 'ਛ': 'Cha', 'ਜ': 'ja', 'ਝ': 'jha', 'ਞ': 'jna',
    'ਟ': 'Ta', 'ਠ': 'Tha', 'ਡ': 'Da', 'ਢ': 'Dha', 'ਣ': 'Na',
    'ਤ': 'ta', 'ਥ': 'tha', 'ਦ': 'da', 'ਧ': 'dha', 'ਨ': 'na',
    'ਪ': 'pa', 'ਫ': 'pha', 'ਬ': 'ba', 'ਭ': 'bha', 'ਮ': 'ma',
    'ਯ': 'ya', 'ਰ': 'ra', 'ਲ': 'la', 'ਲ਼': 'La', '\u0A33': 'La', // \u0A33 = ਲ਼ precomposed
    'ਵ': 'va', 'ਸ਼': 'sha', '\u0A36': 'sha', 'ਸ': 'sa', 'ਹ': 'ha', // \u0A36 = ਸ਼ precomposed

    // Nukta consonants (loanwords from Persian/Arabic); decomposed and precomposed forms
    'ਖ਼': 'qa', '\u0A59': 'qa',   // \u0A59 = ਖ਼ precomposed
    'ਗ਼': 'Gha', '\u0A5A': 'Gha', // \u0A5A = ਗ਼ precomposed
    'ਜ਼': 'za', '\u0A5B': 'za',   // \u0A5B = ਜ਼ precomposed
    'ਰ਼': 'Ra', '\u0A5C': 'Ra',   // \u0A5C = ੜ precomposed
    'ਫ਼': 'fa', '\u0A5E': 'fa',   // \u0A5E = ਫ਼ precomposed

    // Matras (vowel signs)
    'ਾ': 'A', 'ਿ': 'i', 'ੀ': 'I', 'ੁ': 'u', 'ੂ': 'U',
    'ੇ': 'e', 'ੈ': 'ai', 'ੋ': 'o', 'ੌ': 'au',
    '੍': '',

    // Additional marks
    'ਁ': 'ⁿ', 'ਂ': 'ⁿ', 'ਃ': 'H', 'ੰ': 'ⁿ',
    'ੱ': '', // addak (gemination marker; doubling of following consonant not handled)
    'ੑ': '', '\u0A75': '', '੶': '.', // udaat (tone mark), yakash, abbreviation sign

    // Sacred symbol
    // ੴ Gurmukhi Ek Onkar — auspicious symbol, passed through unchanged

    // Numerals
    '੦': '0', '੧': '1', '੨': '2', '੩': '3', '੪': '4',
    '੫': '5', '੬': '6', '੭': '7', '੮': '8', '੯': '9',

    // Others
    '।': '. ', '॥': '. ',
    ' ': ' '
}, iso: {}, ipa: {} };
