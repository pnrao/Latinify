(function () {
    'use strict';
    const LOGGING_ENABLED = false;
    const INDIC_START = '\u0900';
    const INDIC_END = '\u0DFF';

    const DEVANAGARI_START = '\u0900';
    const DEVANAGARI_END = '\u097F';
    const DEVANAGARI_MODIFIER_START = '\u093E';
    const DEVANAGARI_MODIFIER_END = '\u094F';
    const DEVANAGARI_NUKTA = '\u093C';

    const KANNADA_START = '\u0C80';
    const KANNADA_END = '\u0CFF';
    const KANNADA_MODIFIER_START = '\u0CBE';
    const KANNADA_MODIFIER_END = '\u0CCD';
    const KANNADA_NUKTA = '\u0CBC';

    const TELUGU_START = '\u0C00';
    const TELUGU_END = '\u0C7F';
    const TELUGU_MODIFIER_START = '\u0C3E';
    const TELUGU_MODIFIER_END = '\u0C56';
    const TELUGU_NUKTA = null; // Telugu does not have a nukta equivalent

    const ODIA_START = '\u0B00';
    const ODIA_END = '\u0B7F';
    const ODIA_MODIFIER_START = '\u0B3E';
    const ODIA_MODIFIER_END = '\u0B57';
    const ODIA_NUKTA = '\u0B3C';

    const MALAYALAM_START = '\u0D00';
    const MALAYALAM_END = '\u0D7F';
    const MALAYALAM_MODIFIER_START = '\u0D3E';
    const MALAYALAM_MODIFIER_END = '\u0D63';
    const MALAYALAM_NUKTA = null; // Malayalam does not have a nukta equivalent

    const GUJARATI_START = '\u0A80';
    const GUJARATI_END = '\u0AFF';
    const GUJARATI_MODIFIER_START = '\u0ABE';
    const GUJARATI_MODIFIER_END = '\u0AE3';
    const GUJARATI_NUKTA = '\u0ABC';

    const GURMUKHI_START = '\u0A00';
    const GURMUKHI_END = '\u0A7F';
    const GURMUKHI_MODIFIER_START = '\u0A3E';
    const GURMUKHI_MODIFIER_END = '\u0A4D';
    const GURMUKHI_NUKTA = '\u0A3C';
    const GURMUKHI_ADDAK = '\u0A71';

    const BENGALI_START = '\u0980';
    const BENGALI_END = '\u09FF';
    const BENGALI_MODIFIER_START = '\u09BE';
    const BENGALI_MODIFIER_END = '\u09CD'; // stop before nukta consonants ড় ঢ় য় (U+09DC-09DF)
    const BENGALI_NUKTA = '\u09BC';

    const SKIPPED_NODES = ['script', 'style', 'textarea', 'input', 'noscript', 'iframe', 'object', 'embed', 'audio', 'video', 'select', 'button', 'code', 'pre'];

    // Mapping of Devanagari Unicode characters to ITRANS
    const devanagariToITRANS = {
        // Vowels
        'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ii', 'उ': 'u', 'ऊ': 'uu',
        'ऋ': 'RRi', 'ॠ': 'RRI', 'ऌ': 'LLi', 'ॡ': 'LLI',
        'ए': 'e', 'ऐ': 'ai', 'ऑ': 'o', 'ओ': 'o', 'औ': 'au',

        // Consonants
        'क': 'kₐ', 'ख': 'khₐ', 'ग': 'gₐ', 'घ': 'ghₐ', 'ङ': 'gnₐ',
        'च': 'chₐ', 'छ': 'Chₐ', 'ज': 'jₐ', 'झ': 'jhₐ', 'ञ': 'jnₐ',
        'ट': 'Tₐ', 'ठ': 'Thₐ', 'ड': 'Dₐ', 'ढ': 'Dhₐ', 'ण': 'Nₐ',
        'त': 'tₐ', 'थ': 'thₐ', 'द': 'dₐ', 'ध': 'dhₐ', 'न': 'nₐ',
        'प': 'pₐ', 'फ': 'phₐ', 'ब': 'bₐ', 'भ': 'bhₐ', 'म': 'mₐ',
        'य': 'yₐ', 'र': 'rₐ', 'ल': 'lₐ', 'व': 'vₐ', 'श': 'shₐ',
        'ष': 'Shₐ', 'स': 'sₐ', 'ह': 'hₐ', 'ळ': 'Lₐ',
        '\u091C\u093C': 'zₐ', '\u092B\u093C': 'fₐ', // ज़ फ़

        // nukta consonants
        'क़': 'qₐ', 'ख़': 'qhₐ', 'ग़': 'gₐ', 'ज़': 'zₐ', 'ड़': 'rₐ', 'ढ़': 'rhₐ', 'फ़': 'fₐ', 'य़': 'yyₐ',

        // Conjunct Consonants (Special Cases)
        '\u0915\u094D\u0937': 'kshₐ', // क्ष
        '\u091C\u094D\u091E': 'gyₐ', // ज्ञ

        // Matras (Vowel signs)
        'ा': 'aa', 'ि': 'i', 'ी': 'ii', 'ु': 'u', 'ू': 'uu',
        'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ृ': 'ri',
        'ॄ': 'RRI', 'ॢ': 'LLi', 'ॣ': 'LLI',

        // Additional marks
        '्': '', 'ं': 'ⁿ', 'ः': 'H', 'ँ': 'ⁿ',
        '़': '', // Nukta
        'ॅ': 'e', 'ॉ': 'o',

        // Numerals
        '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
        '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',

        // Others
        '।': '. ', '॥': '. ',
        ' ': ' '

        // we don't remap ॐ because this is interepreted as a religious symbol, and not part of any word
    };

    // Mapping of Kannada Unicode characters to ITRANS
    const kannadaToITRANS = {
        // Vowels
        'ಅ': 'a', 'ಆ': 'aa', 'ಇ': 'i', 'ಈ': 'ii', 'ಉ': 'u', 'ಊ': 'uu',
        'ಋ': 'RRi', 'ೠ': 'RRI', 'ಎ': 'e', 'ಏ': 'ee', 'ಐ': 'ai', 'ಒ': 'o', 'ಓ': 'oo', 'ಔ': 'au',

        // Consonants
        'ಕ': 'ka', 'ಖ': 'kha', 'ಗ': 'ga', 'ಘ': 'gha', 'ಙ': 'gna',
        'ಚ': 'cha', 'ಛ': 'Cha', 'ಜ': 'ja', 'ಝ': 'jha', 'ಞ': 'jna',
        'ಟ': 'Ta', 'ಠ': 'Tha', 'ಡ': 'Da', 'ಢ': 'Dha', 'ಣ': 'Na',
        'ತ': 'ta', 'ಥ': 'tha', 'ದ': 'da', 'ಧ': 'dha', 'ನ': 'na',
        'ಪ': 'pa', 'ಫ': 'pha', 'ಬ': 'ba', 'ಭ': 'bha', 'ಮ': 'ma',
        'ಯ': 'ya', 'ರ': 'ra', 'ಲ': 'la', 'ವ': 'va', 'ಶ': 'sha',
        'ಷ': 'Sha', 'ಸ': 'sa', 'ಹ': 'ha', 'ಳ': 'La', 'ೞ': 'LLa',

        // Matras (Vowel signs)
        'ಾ': 'aa', 'ಿ': 'i', 'ೀ': 'ii', 'ು': 'u', 'ೂ': 'uu',
        'ೆ': 'e', 'ೇ': 'ee', 'ೈ': 'ai', 'ೊ': 'o', 'ೋ': 'oo', 'ೌ': 'au', 'ೃ': 'ru', 'ೄ': 'RRI',

        // Additional marks
        '್': '', 'ಂ': 'ⁿ', 'ಃ': 'H',
        'ೆ': 'e', 'ೊ': 'o',

        // Numerals
        '೦': '0', '೧': '1', '೨': '2', '೩': '3', '೪': '4',
        '೫': '5', '೬': '6', '೭': '7', '೮': '8', '೯': '9',

        // Others
        '।': '. ', '॥': '. ',
        ' ': ' '
    };

    // Mapping of Telugu Unicode characters to ITRANS
    const teluguToITRANS = {
        // Vowels
        'అ': 'a', 'ఆ': 'aa', 'ఇ': 'i', 'ఈ': 'ii', 'ఉ': 'u', 'ఊ': 'uu',
        'ఋ': 'RRi', 'ౠ': 'RRI', 'ఌ': 'LLi', 'ౡ': 'LLI', 'ఎ': 'e', 'ఏ': 'ee', 'ఐ': 'ai', 'ఒ': 'o', 'ఓ': 'oo', 'ఔ': 'au',

        // Chandrabindu, avagraha
        'ఁ': 'ⁿ', 'ఽ': "'",

        // Consonants
        'క': 'ka', 'ఖ': 'kha', 'గ': 'ga', 'ఘ': 'gha', 'ఙ': 'nga',
        'చ': 'cha', 'ఛ': 'Cha', 'జ': 'ja', 'ఝ': 'jha', 'ఞ': 'jna',
        'ట': 'Ta', 'ఠ': 'Tha', 'డ': 'Da', 'ఢ': 'Dha', 'ణ': 'Na',
        'త': 'ta', 'థ': 'tha', 'ద': 'da', 'ధ': 'dha', 'న': 'na',
        'ప': 'pa', 'ఫ': 'pha', 'బ': 'ba', 'భ': 'bha', 'మ': 'ma',
        'య': 'ya', 'ర': 'ra', 'ల': 'la', 'వ': 'va', 'శ': 'sha',
        'ష': 'Sha', 'స': 'sa', 'హ': 'ha', 'ళ': 'La', 'ఱ': 'rra', 'ఴ': 'LLLa', '\u0C15\u0C4D\u0C37': 'kSha', // క్ష
        'ౘ': 'tsa', 'ౙ': 'dza', 'ౚ': 'rra', 'ౝ': 'na',

        // Matras (Vowel signs)
        'ా': 'aa', 'ి': 'i', 'ీ': 'ii', 'ు': 'u', 'ూ': 'uu',
        'ృ': 'RRi', 'ౄ': 'RRI',
        'ె': 'e', 'ే': 'ee', 'ై': 'ai', 'ొ': 'o', 'ో': 'oo', 'ౌ': 'au',
        'ౢ': 'LLi', 'ౣ': 'LLI',

        // Additional marks
        '్': '', 'ం': 'ᵐ', 'ః': 'H',

        // Numerals
        '౦': '0', '౧': '1', '౨': '2', '౩': '3', '౪': '4',
        '౫': '5', '౬': '6', '౭': '7', '౮': '8', '౯': '9',

        // Fractions
        '౸': ' 0', '౹': '¼', '౺': '½', '౻': '¾',
        '౼': ' 1/16', '౽': '⅛', '౾': ' 3/16',

        // Others
        '।': '. ', '॥': '. ',
        ' ': ' '
    };

    // Mapping of Odia Unicode characters to ITRANS
    const odiaToITRANS = {
        // Vowels
        'ଅ': 'a', 'ଆ': 'aa', 'ଇ': 'i', 'ଈ': 'ii', 'ଉ': 'u', 'ଊ': 'uu',
        'ଋ': 'RRi', 'ୠ': 'RRI', 'ଌ': 'LLi', 'ୡ': 'LLI',
        'ଏ': 'e', 'ଐ': 'ai', 'ଓ': 'o', 'ଔ': 'au',

        // Consonants
        'କ': 'ka', 'ଖ': 'kha', 'ଗ': 'ga', 'ଘ': 'gha', 'ଙ': 'nga',
        'ଚ': 'cha', 'ଛ': 'Cha', 'ଜ': 'ja', 'ଝ': 'jha', 'ଞ': 'jna',
        'ଟ': 'Ta', 'ଠ': 'Tha', 'ଡ': 'Da', 'ଢ': 'Dha', 'ଣ': 'Na',
        'ଡ଼': 'Ra', 'ଢ଼': 'Rha',
        'ତ': 'ta', 'ଥ': 'tha', 'ଦ': 'da', 'ଧ': 'dha', 'ନ': 'na',
        'ପ': 'pa', 'ଫ': 'pha', 'ବ': 'ba', 'ଭ': 'bha', 'ମ': 'ma',
        'ଯ': 'ya', 'ୟ': 'ya', 'ର': 'ra', 'ଲ': 'la', 'ଳ': 'La', 'ଵ': 'va', 'ୱ': 'wa',
        'ଶ': 'sha', 'ଷ': 'Sha', 'ସ': 'sa', 'ହ': 'ha',

        // Matras (Vowel signs)
        'ା': 'aa', 'ି': 'i', 'ୀ': 'ii', 'ୁ': 'u', 'ୂ': 'uu',
        'ୃ': 'RRi', 'ୄ': 'RRI', 'ୢ': 'LLi', 'ୣ': 'LLI',
        'େ': 'e', 'ୈ': 'ai', 'ୋ': 'o', 'ୌ': 'au',

        // Additional marks
        '୍': '', 'ଂ': 'ⁿ', 'ଃ': 'H', 'ଁ': 'ⁿ',
        '଼': '', // Nukta
        'ଽ': '', // Avagraha
        '୰': '', // ORIYA ISSHAR (rare) - ignore
        '୲': '¼', '୳': '½', '୴': '¾', // fractions: 1/4, 1/2, 3/4
        '୵': ' 1/16', '୶': '⅛', '୷': ' 3/16', // fractions as ASCII strings

        // Numerals
        '୦': '0', '୧': '1', '୨': '2', '୩': '3', '୪': '4',
        '୫': '5', '୬': '6', '୭': '7', '୮': '8', '୯': '9',

        // Others
        '।': '. ', '॥': '. ',
        ' ': ' '
    };

    // Mapping of Malayalam Unicode characters to ITRANS
    const malayalamToITRANS = {
        // Vowels
        'അ': 'a', 'ആ': 'aa', 'ഇ': 'i', 'ഈ': 'ii', 'ഉ': 'u', 'ഊ': 'uu',
        'ഋ': 'RRi', 'ൠ': 'RRI', 'ഌ': 'LLi', 'ൡ': 'LLI', 'ൟ': 'ii',
        'എ': 'e', 'ഏ': 'ee', 'ഐ': 'ai', 'ഒ': 'o', 'ഓ': 'oo', 'ഔ': 'au',

        // Consonants
        'ക': 'ka', 'ഖ': 'kha', 'ഗ': 'ga', 'ഘ': 'gha', 'ങ': 'nga',
        'ച': 'cha', 'ഛ': 'Cha', 'ജ': 'ja', 'ഝ': 'jha', 'ഞ': 'jna',
        'ട': 'Ta', 'ഠ': 'Tha', 'ഡ': 'Da', 'ഢ': 'Dha', 'ണ': 'Na',
        'ത': 'ta', 'ഥ': 'tha', 'ദ': 'da', 'ധ': 'dha', 'ന': 'na', 'ഩ': 'na',
        'പ': 'pa', 'ഫ': 'pha', 'ബ': 'ba', 'ഭ': 'bha', 'മ': 'ma',
        'യ': 'ya', 'ര': 'ra', 'റ': 'Ra', 'ല': 'la', 'ള': 'La', 'ഴ': 'Lha',
        'വ': 'va', 'ശ': 'sha', 'ഷ': 'Sha', 'സ': 'sa', 'ഹ': 'ha',

        // Chillu letters (pure consonants, no inherent vowel)
        'ൺ': 'N', 'ൻ': 'n', 'ർ': 'r', 'ൎ': 'r', 'ൽ': 'l', 'ൾ': 'L', 'ൿ': 'k',

        // Matras (Vowel signs)
        'ാ': 'aa', 'ി': 'i', 'ീ': 'ii', 'ു': 'u', 'ൂ': 'uu',
        'ൃ': 'ru', 'ൄ': 'RRI', 'ൢ': 'LLi', 'ൣ': 'LLI',
        'െ': 'e', 'േ': 'ee', 'ൈ': 'ai',
        'ൊ': 'o', 'ോ': 'oo', 'ൌ': 'au', 'ൗ': 'au',

        // Additional marks
        '്': '', 'ം': 'ᵐ', 'ഃ': 'H', 'ഁ': 'ⁿ', 'ഀ': 'ⁿ', 'ഄ': 'ⁿ', 'ഽ': "'",

        // Numerals
        '൦': '0', '൧': '1', '൨': '2', '൩': '3', '൪': '4',
        '൫': '5', '൬': '6', '൭': '7', '൮': '8', '൯': '9',

        // Traditional number symbols
        '൰': '10', '൱': '100', '൲': '1000',

        // Fractions
        '൳': '¼', '൴': '½', '൵': '¾',
        '൶': ' 1/16', '൷': '⅛', '൸': ' 3/16',

        // Archaic fractions
        '൘': ' 1/160', '൙': ' 1/40', '൚': ' 3/80',
        '൛': ' 1/20', '൜': ' 1/10', '൝': ' 3/20', '൞': '⅕',

        // Others
        '।': '. ', '॥': '. ',
        '൏': '¶',
        ' ': ' '
    };

    // Mapping of Gurmukhi Unicode characters to ITRANS
    const gurmukhiToITRANS = {
        // Vowels
        'ਅ': 'a', 'ਆ': 'aa', 'ਇ': 'i', 'ਈ': 'ii', 'ਉ': 'u', 'ਊ': 'uu',
        'ਏ': 'e', 'ਐ': 'ai', 'ਓ': 'o', 'ਔ': 'au',

        // Carrier letters (silent base; following matra provides the vowel)
        'ੳ': '', 'ੲ': '',

        // Consonants
        'ਕ': 'ka', 'ਖ': 'kha', 'ਗ': 'ga', 'ਘ': 'gha', 'ਙ': 'nga',
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
        'ਾ': 'aa', 'ਿ': 'i', 'ੀ': 'ii', 'ੁ': 'u', 'ੂ': 'uu',
        'ੇ': 'e', 'ੈ': 'ai', 'ੋ': 'o', 'ੌ': 'au',
        '੍': '',

        // Additional marks
        'ਁ': 'ⁿ', 'ਂ': 'ⁿ', 'ਃ': 'H', 'ੰ': 'ⁿ',
        'ੱ': '', // addak (gemination marker; doubling of following consonant not handled)
        'ੑ': '', '\u0A75': '', '੶': '.', // udaat (tone mark), yakash, abbreviation sign

        // Sacred symbol
        'ੴ': 'Ik Onkar',

        // Numerals
        '੦': '0', '੧': '1', '੨': '2', '੩': '3', '੪': '4',
        '੫': '5', '੬': '6', '੭': '7', '੮': '8', '੯': '9',

        // Others
        '।': '. ', '॥': '. ',
        ' ': ' '
    };

    // Mapping of Bengali Unicode characters to ITRANS
    const bengaliToITRANS = {
        // Vowels
        'অ': 'a', 'আ': 'aa', 'ই': 'i', 'ঈ': 'ii', 'উ': 'u', 'ঊ': 'uu',
        'ঋ': 'RRi', 'ৠ': 'RRI', 'ঌ': 'LLi', 'ৡ': 'LLI',
        'এ': 'e', 'ঐ': 'ai', 'ও': 'o', 'ঔ': 'au',

        // Consonants
        'ক': 'kₒ', 'খ': 'khₒ', 'গ': 'gₒ', 'ঘ': 'ghₒ', 'ঙ': 'gnₒ',
        'চ': 'chₒ', 'ছ': 'Chₒ', 'জ': 'jₒ', 'ঝ': 'jhₒ', 'ঞ': 'jnₒ',
        'ট': 'Tₒ', 'ঠ': 'Thₒ', 'ড': 'Dₒ', 'ঢ': 'Dhₒ', 'ণ': 'Nₒ',
        'ত': 'tₒ', 'থ': 'thₒ', 'দ': 'dₒ', 'ধ': 'dhₒ', 'ন': 'nₒ',
        'প': 'pₒ', 'ফ': 'phₒ', 'ব': 'bₒ', 'ভ': 'bhₒ', 'ম': 'mₒ',
        'য': 'yₒ', 'র': 'rₒ', 'ল': 'lₒ', 'শ': 'shₒ', 'ষ': 'Shₒ', 'স': 'sₒ', 'হ': 'hₒ',
        '\u09A1\u09BC': 'Rₒ', '\u09A2\u09BC': 'Rhₒ', '\u09AF\u09BC': 'yₒ', // ড় ঢ় য়
        'ৎ': 't', // khanda ta: terminal consonant without inherent vowel

        // Matras (Vowel signs)
        'া': 'aa', 'ি': 'i', 'ী': 'ii', 'ু': 'u', 'ূ': 'uu',
        'ৃ': 'ri', 'ৄ': 'RRI',
        'ে': 'e', 'ৈ': 'ai', 'ো': 'o', 'ৌ': 'au',

        // Vocalic L matras (outside matra range, treated as discrete)
        'ৢ': 'LLi', 'ৣ': 'LLI',

        // Additional marks
        '্': '', 'ং': 'ⁿ', 'ঃ': 'H', 'ঁ': 'ⁿ',
        '়': '', // Nukta
        'ঽ': "'", // Avagraha

        // Numerals
        '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
        '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',

        // Currency
        '৲': 'Rs', '৳': '₹',

        // Fractions (anna subdivisions, denominator 16)
        '৴': ' 1/16', '৵': '⅛', '৶': ' 3/16', '৷': '¼', '৸': ' 15/16', '৹': '16',

        // Others
        '।': '. ', '॥': '. ',
        '৺': '¶',
        ' ': ' '
    };

    // Mapping of Gujarati Unicode characters to ITRANS
    const gujaratiToITRANS = {
        // Vowels
        'અ': 'a', 'આ': 'aa', 'ઇ': 'i', 'ઈ': 'ii', 'ઉ': 'u', 'ઊ': 'uu',
        'ઋ': 'RRi', 'ૠ': 'RRI', 'ઌ': 'LLi', 'ૡ': 'LLI',
        'ઍ': 'e', 'એ': 'e', 'ઐ': 'ai', 'ઑ': 'o', 'ઓ': 'o', 'ઔ': 'au',

        // Consonants
        'ક': 'kₐ', 'ખ': 'khₐ', 'ગ': 'gₐ', 'ઘ': 'ghₐ', 'ઙ': 'gnₐ',
        'ચ': 'chₐ', 'છ': 'Chₐ', 'જ': 'jₐ', 'ઝ': 'jhₐ', 'ઞ': 'jnₐ',
        'ટ': 'Tₐ', 'ઠ': 'Thₐ', 'ડ': 'Dₐ', 'ઢ': 'Dhₐ', 'ણ': 'Nₐ',
        'ત': 'tₐ', 'થ': 'thₐ', 'દ': 'dₐ', 'ધ': 'dhₐ', 'ન': 'nₐ',
        'પ': 'pₐ', 'ફ': 'phₐ', 'બ': 'bₐ', 'ભ': 'bhₐ', 'મ': 'mₐ',
        'ય': 'yₐ', 'ર': 'rₐ', 'લ': 'lₐ', 'ળ': 'Lₐ', 'વ': 'vₐ',
        'શ': 'shₐ', 'ષ': 'Shₐ', 'સ': 'sₐ', 'હ': 'hₐ',

        // Matras (Vowel signs)
        'ા': 'aa', 'િ': 'i', 'ી': 'ii', 'ુ': 'u', 'ૂ': 'uu',
        'ૃ': 'ri', 'ૄ': 'RRI', 'ૅ': 'e', 'ૢ': 'LLi', 'ૣ': 'LLI',
        'ે': 'e', 'ૈ': 'ai', 'ૉ': 'o', 'ો': 'o', 'ૌ': 'au',

        // Additional marks
        '્': '', 'ં': 'ⁿ', 'ઃ': 'H', 'ઁ': 'ⁿ',
        '઼': '', // Nukta
        'ઽ': "'", // Avagraha

        // Numerals
        '૦': '0', '૧': '1', '૨': '2', '૩': '3', '૪': '4',
        '૫': '5', '૬': '6', '૭': '7', '૮': '8', '૯': '9',

        // Others
        '।': '. ', '॥': '. ',
        ' ': ' '
    };

    let settings = { bengali: undefined, devanagari: undefined, gujarati: undefined, gurmukhi: undefined, kannada: undefined, telugu: undefined, odia: undefined, malayalam: undefined, indicateScript: undefined };
    // When we had set the above to true, it was always transliterating some
    // sections of the page.The settings were not taking effect.
    // XXX: I'd like some explanation for this behaviour.

    function log(...args) {
        if (LOGGING_ENABLED) {
            console.log(...args);
        }
    }

    function handleNukta(prevLetter, replacementText) {
        const nuktaReplacements = {
            'kₐ': 'qₐ', 'khₐ': 'qhₐ', 'jₐ': 'zₐ', 'phₐ': 'fₐ',
            'kₒ': 'qₒ', 'khₒ': 'qhₒ', 'jₒ': 'zₒ', 'phₒ': 'fₒ',
            'ka': 'qa', 'kha': 'qha', 'ja': 'za', 'pha': 'fa',
            'ra': 'Ra', 'la': 'La', 'sa': 'sha' // Gurmukhi nukta combinations
            // words like पढ़ाई, चौड़ा seem to be pronounced as if the nukta is not there
        };
        if (nuktaReplacements[prevLetter]) {
            replacementText[replacementText.length - 1] = nuktaReplacements[prevLetter];
        }
    }

    function appendTransliteratedChar(sourceText, i, replacementText, mapping, matraStart, matraEnd, nukta) {
        const prevLetter = replacementText.length > 0 ? replacementText[replacementText.length - 1] : '';
        if (sourceText[i] >= matraStart && sourceText[i] <= matraEnd) {
            if (replacementText.length > 0 && (prevLetter.endsWith('ₐ') || prevLetter.endsWith('ₒ') || prevLetter.endsWith('a'))) {
                replacementText[replacementText.length - 1] = prevLetter.slice(0, -1);
            }
            replacementText.push(mapping[sourceText[i]]);
        } else if (sourceText[i] == nukta) {
            handleNukta(prevLetter, replacementText);
        } else { // discrete letter
            const mapped = mapping[sourceText[i]];
            replacementText.push(mapped !== undefined ? mapped : sourceText[i]);
        }
    }

    function wrapWordWithSpan(word, script) {
        return `<span class="transliterated-${script}">${word}</span>`;
    }

    // Function to transliterate text to ITRANS
    function transliterateToITRANS(text) {
        if (!text || typeof text !== 'string') {
            return text;
        }

        // Explicitly check if all settings are false
        if (settings.bengali === false && settings.devanagari === false && settings.gujarati === false &&
            settings.gurmukhi === false && settings.kannada === false && settings.telugu === false &&
            settings.odia === false && settings.malayalam === false) {
            log('Skipping transliteration: all scripts disabled');
            return text;
        }

        let replacement = [];
        let currentScript = null;
        let currentWord = [];

        function flushCurrentWord() {
            if (currentWord.length > 0) {
                if (settings.indicateScript) {
                    replacement.push(wrapWordWithSpan(currentWord.join(""), currentScript));
                } else {
                    replacement.push(currentWord.join(""));
                }
                currentWord = [];
            }
        }

        for (let i = 0; i < text.length; i++) {
            if (settings.devanagari !== false && text[i] >= DEVANAGARI_START && text[i] <= DEVANAGARI_END) {
                if (currentScript !== 'devanagari') {
                    flushCurrentWord();
                    currentScript = 'devanagari';
                }
                appendTransliteratedChar(text, i, currentWord, devanagariToITRANS, DEVANAGARI_MODIFIER_START, DEVANAGARI_MODIFIER_END, DEVANAGARI_NUKTA);
            } else if (settings.kannada !== false && text[i] >= KANNADA_START && text[i] <= KANNADA_END) {
                if (currentScript !== 'kannada') {
                    flushCurrentWord();
                    currentScript = 'kannada';
                }
                appendTransliteratedChar(text, i, currentWord, kannadaToITRANS, KANNADA_MODIFIER_START, KANNADA_MODIFIER_END, KANNADA_NUKTA);
            } else if (settings.telugu !== false && text[i] >= TELUGU_START && text[i] <= TELUGU_END) {
                if (currentScript !== 'telugu') {
                    flushCurrentWord();
                    currentScript = 'telugu';
                }
                appendTransliteratedChar(text, i, currentWord, teluguToITRANS, TELUGU_MODIFIER_START, TELUGU_MODIFIER_END, TELUGU_NUKTA);
            } else if (settings.odia !== false && text[i] >= ODIA_START && text[i] <= ODIA_END) {
                if (currentScript !== 'odia') {
                    flushCurrentWord();
                    currentScript = 'odia';
                }
                appendTransliteratedChar(text, i, currentWord, odiaToITRANS, ODIA_MODIFIER_START, ODIA_MODIFIER_END, ODIA_NUKTA);
            } else if (settings.malayalam !== false && text[i] >= MALAYALAM_START && text[i] <= MALAYALAM_END) {
                if (currentScript !== 'malayalam') {
                    flushCurrentWord();
                    currentScript = 'malayalam';
                }
                appendTransliteratedChar(text, i, currentWord, malayalamToITRANS, MALAYALAM_MODIFIER_START, MALAYALAM_MODIFIER_END, MALAYALAM_NUKTA);
            } else if (settings.gujarati !== false && text[i] >= GUJARATI_START && text[i] <= GUJARATI_END) {
                if (currentScript !== 'gujarati') {
                    flushCurrentWord();
                    currentScript = 'gujarati';
                }
                appendTransliteratedChar(text, i, currentWord, gujaratiToITRANS, GUJARATI_MODIFIER_START, GUJARATI_MODIFIER_END, GUJARATI_NUKTA);
            } else if (settings.gurmukhi !== false && text[i] >= GURMUKHI_START && text[i] <= GURMUKHI_END) {
                if (currentScript !== 'gurmukhi') {
                    flushCurrentWord();
                    currentScript = 'gurmukhi';
                }
                if (text[i] === GURMUKHI_ADDAK) {
                    const next = gurmukhiToITRANS[text[i + 1]];
                    if (next) currentWord.push(next.slice(0, -1)); // strip inherent 'a', doubling the consonant
                } else {
                    appendTransliteratedChar(text, i, currentWord, gurmukhiToITRANS, GURMUKHI_MODIFIER_START, GURMUKHI_MODIFIER_END, GURMUKHI_NUKTA);
                }
            } else if (settings.bengali !== false && text[i] >= BENGALI_START && text[i] <= BENGALI_END) {
                if (currentScript !== 'bengali') {
                    flushCurrentWord();
                    currentScript = 'bengali';
                }
                appendTransliteratedChar(text, i, currentWord, bengaliToITRANS, BENGALI_MODIFIER_START, BENGALI_MODIFIER_END, BENGALI_NUKTA);
            } else {
                flushCurrentWord();
                currentScript = null;
                replacement.push(text[i]);
            }
        }
        flushCurrentWord();

        return replacement.join('');
    }

    function hasIndic(text) {
        for (let char of text) {
            if (char >= INDIC_START && char <= INDIC_END) {
                return true;
            }
        }
        return false;
    }

    // Helper to check if a node is editable
    function isNodeEditable(node) {
        if (node.isContentEditable) return true;
        if (node.nodeType === Node.TEXT_NODE && node.parentElement && node.parentElement.isContentEditable) return true;
        return false;
    }

    // Function to process text nodes
    function processNode(node) {
        // Skip editable content to avoid interfering with user input
        if (isNodeEditable(node)) return;

        if (node.nodeType === Node.TEXT_NODE && hasIndic(node.nodeValue)) {
            if (node.parentNode && node.parentNode.hasAttribute('data-transliterated')) {
                // log('Skipping already processed text node:', node.nodeValue);
                return; // Skip already processed nodes
            }
            const transliteratedText = transliterateToITRANS(node.nodeValue);
            if (node.nodeValue !== transliteratedText) {
                log('Transliterating text node:', {
                    original: node.nodeValue,
                    transliterated: transliteratedText
                });
                if (settings.indicateScript) {
                    const span = document.createElement('span');
                    span.className = 'transliterated';
                    span.setAttribute('data-transliterated', 'true'); // Mark immediately to prevent re-processing
                    span.innerHTML = transliteratedText;
                    node.replaceWith(span);
                } else {
                    node.nodeValue = transliteratedText;
                    // We can't easily mark a text node as processed without a wrapper.
                    // However, since the text is now Latin, hasIndic() will return false,
                    // so it won't be processed again anyway.
                }
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && !SKIPPED_NODES.includes(node.nodeName.toLowerCase())) {
            if (node.hasAttribute('data-transliterated') || node.classList.contains('transliterated')) {
                // log('Skipping already processed element node:', node);
                return; // Skip already processed nodes
            }
            // log('Processing element node:', node);
            Array.from(node.childNodes).forEach(processNode);
            if (node.childNodes.length > 0) {
                node.setAttribute('data-transliterated', 'true'); // Mark the element as processed only after its children are processed
            }
        }
    }

    let totalTransliterationTime = 0;
    let overlayTimeout;

    function createOverlay() {
        let overlay = document.getElementById('latinify-stats-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'latinify-stats-overlay';
            document.body.appendChild(overlay);
        }
        return overlay;
    }

    function updateOverlay(timeAdded) {
        if (!settings.showStats) return;

        totalTransliterationTime += timeAdded;
        const overlay = createOverlay();
        overlay.textContent = `Transliteration: ${totalTransliterationTime.toFixed()}ms`;
        overlay.classList.add('visible');

        clearTimeout(overlayTimeout);
        overlayTimeout = setTimeout(() => {
            overlay.classList.remove('visible');
        }, 500);
    }

    function initTransliteration() {
        if (document.body) {
            const startTime = performance.now();

            processNode(document.body);
            const endLoadTime = performance.now();
            const loadTime = endLoadTime - startTime;
            console.log(`Transliteration (at load) completed in ${loadTime.toFixed(2)}ms.`);
            updateOverlay(loadTime);

            // Set up a MutationObserver to handle dynamically added content
            const observer = new MutationObserver((mutations) => {
                const mutationStartTime = performance.now();
                let processed = false;

                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                // Optimization: Ignore our own nodes to prevent loops
                                if (node.classList.contains('transliterated') || node.hasAttribute('data-transliterated') || node.id === 'latinify-stats-overlay') {
                                    return;
                                }
                                log('Processing dynamically added node:', node);
                                processNode(node);
                                processed = true;
                            }
                        });
                    } else if (mutation.type === 'characterData') {
                        // Ignore changes to our own nodes
                        if (mutation.target.parentNode && (mutation.target.parentNode.classList.contains('transliterated') || mutation.target.parentNode.hasAttribute('data-transliterated'))) {
                            return;
                        }
                        log('Processing dynamically changed text node:', mutation.target);
                        processNode(mutation.target);
                        processed = true;
                    }
                });

                if (processed) {
                    const mutationEndTime = performance.now();
                    updateOverlay(mutationEndTime - mutationStartTime);
                }
            });

            // Start observing the document
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });

            const endMutationObserverTime = performance.now() - startTime;
            console.log(`Transliteration (mutations) completed in ${endMutationObserverTime.toFixed(2)}ms.`);
        } else {
            // If body isn't ready yet, retry after a short delay
            log('Document body not ready. Retrying initialization.');
            setTimeout(initTransliteration, 10);
        }
    }

    // Load settings before initializing
    chrome.storage.sync.get({
        bengali: true,
        devanagari: true,
        gujarati: true,
        gurmukhi: true,
        kannada: true,
        odia: true,
        telugu: true,
        malayalam: true,
        indicateScript: true,
        showStats: false
    }, (result) => {
        settings = {
            bengali: result.bengali,
            devanagari: result.devanagari,
            gujarati: result.gujarati,
            gurmukhi: result.gurmukhi,
            kannada: result.kannada,
            odia: result.odia,
            telugu: result.telugu,
            malayalam: result.malayalam,
            indicateScript: result.indicateScript,
            showStats: result.showStats
        };
        log('Settings initialized:', settings);
        initTransliteration();
    });

    // Listen for settings changes
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'settingsChanged') {
            settings = message.settings;
            // Reset total time if stats are disabled then enabled?
            // Or just keep tracking? Let's keep tracking but only show if enabled.
            if (!settings.showStats) {
                const overlay = document.getElementById('latinify-stats-overlay');
                if (overlay) overlay.classList.remove('visible');
            }
            processNode(document.body);
        }
    });

})();
