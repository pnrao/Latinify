var arabicMaps = { itrans: {
    // Alef forms (vowel carriers)
    'ا': 'a', 'آ': 'A', 'أ': 'a', 'إ': 'i', 'ؤ': 'w', 'ئ': 'y',

    // Consonants
    'ب': 'b', 'پ': 'p',
    'ت': 't', 'ٹ': 'T', 'ة': 't', // ة = ta marbuta
    'ث': 's',
    'ج': 'j', 'چ': 'ch',
    'ح': 'h', 'خ': 'kh',
    'د': 'd', 'ڈ': 'D',
    'ذ': 'z',
    'ر': 'r', 'ڑ': 'R',
    'ز': 'z', 'ژ': 'zh',
    'س': 's', 'ش': 'sh',
    'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z',
    'ع': "'", // ain - glottal stop
    'غ': 'gh',
    'ف': 'f', 'ق': 'q',
    '\u06A9': 'k', '\u0643': 'k', // ک (Urdu kaf) and ك (Arabic kaf)
    'گ': 'g',
    'ل': 'l', 'م': 'm', 'ن': 'n',
    'ں': 'ⁿ', // noon ghunna (nasalization)
    'و': 'w',
    '\u06C1': 'h', '\u0647': 'h', '\u06BE': 'h', // ہ (Urdu he), ه (Arabic he), ھ (do chashmi he)
    'ء': "'", // hamza
    '\u06CC': 'y', '\u064A': 'y', '\u0649': 'a', // ی (Urdu ye), ي (Arabic ye), ى (alef maksura)
    '\u06D2': 'e', // ے bari ye

    // Harakat and diacritical marks — in modifier range U+064B–U+065F
    '\u064E': 'a', '\u064F': 'u', '\u0650': 'i', // fatha, damma, kasra
    '\u064B': 'an', '\u064C': 'un', '\u064D': 'in', // tanwin forms
    '\u0651': '', '\u0652': '', // shadda (gemination), sukun (no vowel)
    '\u0653': '', '\u0654': "'", '\u0655': "'", // maddah, hamza above, hamza below
    '\u0656': 'i', '\u0657': 'u', // subscript alef (Kashmiri i), inverted damma (u)
    '\u0658': 'ⁿ', '\u0659': '', '\u065A': '', '\u065B': '', // noon ghunna mark, rare Quranic marks
    '\u065C': '', '\u065D': '', '\u065E': '', '\u065F': '', // rare Quranic marks

    // Kashmiri letters
    '\u0620': 'y', '\u06C4': 'o', // ؠ (Kashmiri yeh), ۄ (Kashmiri waw with ring)

    // Urdu/Nastaliq variants
    '\u06C2': 'h', '\u06C3': 't', // ۂ (he goal with hamza), ۃ (teh marbuta goal)

    // Superscript alef — long vowel mark
    '\u0670': 'a',

    // Sindhi/extended consonants (Arabic Extended-A block U+0750–U+077F)
    '\u0683': 'ɲ', '\u0768': 'ɲ', // ڃ nyeh, ݨ nye — palatal nasal
    '\u0750': 'b', '\u0751': 'b', '\u0752': 'b', '\u0753': 'b', '\u0754': 'b', '\u0755': 'b', '\u0756': 'b', // beh variants
    '\u0757': 'h', '\u0758': 'h', // hah variants
    '\u0759': 'd', '\u075A': 'd', // dal variants
    '\u075B': 'r', // reh with stroke
    '\u075C': 's', // seen with four dots
    '\u075D': "'", '\u075E': "'", '\u075F': "'", // ain variants
    '\u0760': 'f', '\u0761': 'f', // fa variants
    '\u0762': 'k', '\u0763': 'k', '\u0764': 'k', // keheh variants
    '\u0765': 'm', '\u0766': 'm', // meem variants
    '\u0767': 'n', '\u0769': 'n', // noon variants
    '\u076A': 'l', // lam with bar
    '\u076B': 'r', '\u076C': 'r', // reh variants
    '\u076D': 's', // seen variant
    '\u076E': 'h', '\u076F': 'h', '\u0770': 's', '\u0771': 'r', '\u0772': 'h', // hah/seen/reh variants
    '\u0773': '', '\u0774': '', '\u0775': '', '\u0776': '', '\u0777': '', // Quranic marks
    '\u0778': '', '\u0779': '', '\u077A': '', '\u077B': '', '\u077C': '', '\u077D': '', '\u077E': '', '\u077F': '', // Quranic/liturgical marks

    // Pashto consonants
    '\u067C': 'T', '\u0681': 'dz', '\u0685': 'ts', '\u0689': 'D', '\u068C': 'd',
    '\u0693': 'R', '\u0696': 'zh', '\u069A': 'sh', '\u06AB': 'g', '\u06BC': 'N',

    // Additional vowels (Kurdish, Pashto, Uyghur)
    '\u0672': 'a', '\u06C6': 'o', '\u06C7': 'u',
    '\u06CD': 'ai', '\u06D0': 'e', '\u06D5': 'ä',

    // Arabic punctuation
    '\u066A': '%', '\u066B': '.', '\u066C': ',',

    // Tatweel (kashida) — visual lengthening, no phonetic value
    '\u0640': '',

    // Punctuation
    '\u060C': ',', '\u061B': ';', '\u061F': '?', // Arabic comma, semicolon, question mark
    '\u06D4': '. ', // Urdu full stop

    // Eastern Arabic / Urdu numerals
    '\u06F0': '0', '\u06F1': '1', '\u06F2': '2', '\u06F3': '3', '\u06F4': '4',
    '\u06F5': '5', '\u06F6': '6', '\u06F7': '7', '\u06F8': '8', '\u06F9': '9',

    // Arabic-Indic numerals
    '\u0660': '0', '\u0661': '1', '\u0662': '2', '\u0663': '3', '\u0664': '4',
    '\u0665': '5', '\u0666': '6', '\u0667': '7', '\u0668': '8', '\u0669': '9',

    ' ': ' '
}, iso: {}, ipa: {} };
