// content.js
(function () {
    // Mapping of Devanagari Unicode characters to ITRANS
    const devanagariToITRANS = {
        // Vowels
        'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ii', 'उ': 'u', 'ऊ': 'uu',
        'ऋ': 'RRi', 'ॠ': 'RRI', 'ऌ': 'LLi', 'ॡ': 'LLI',
        'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',

        // Consonants
        'क': 'kₐ', 'ख': 'khₐ', 'ग': 'gₐ', 'घ': 'ghₐ', 'ङ': 'gnₐ',
        'च': 'chₐ', 'छ': 'Chₐ', 'ज': 'jₐ', 'झ': 'jhₐ', 'ञ': 'jnₐ',
        'ट': 'Tₐ', 'ठ': 'Thₐ', 'ड': 'Dₐ', 'ढ': 'Dhₐ', 'ण': 'Nₐ',
        'त': 'tₐ', 'थ': 'thₐ', 'द': 'dₐ', 'ध': 'dhₐ', 'न': 'nₐ',
        'प': 'pₐ', 'फ': 'phₐ', 'ब': 'bₐ', 'भ': 'bhₐ', 'म': 'mₐ',
        'य': 'yₐ', 'र': 'rₐ', 'ल': 'lₐ', 'व': 'vₐ', 'श': 'shₐ',
        'ष': 'Shₐ', 'स': 'sₐ', 'ह': 'hₐ', 'ळ': 'Lₐ',
        'ज़': 'zₐ', 'फ़': 'fₐ',

        // Conjunct Consonants (Special Cases)
        'क्ष': 'kshₐ',
        'ज्ञ': 'gyₐ',

        // Matras (Vowel signs)
        'ा': 'aa', 'ि': 'i', 'ी': 'ii', 'ु': 'u', 'ू': 'uu',
        'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ृ': 'ri',
        'ॄ': 'RRI', 'ॢ': 'LLi', 'ॣ': 'LLI',

        // Additional marks
        '्': '', 'ं': 'ⁿ', 'ः': 'H', 'ँ': 'ⁿ',
        '़': '', // Nukta

        // Numerals
        '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
        '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',

        // Others
        '।': '. ', '॥': '. ',
        ' ': ' '
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

        // Numerals
        '೦': '0', '೧': '1', '೨': '2', '೩': '3', '೪': '4',
        '೫': '5', '೬': '6', '೭': '7', '೮': '8', '೯': '9',

        // Others
        '।': '. ', '॥': '. ',
        ' ': ' '
    };

    let settings = { devanagari: true, kannada: true };

    // Function to transliterate text to ITRANS
    function transliterateToITRANS(text) {
        if (!text || typeof text !== 'string') return text;

        // Check if text contains Devanagari or Kannada
        const indicPattern = /[\u0900-\u097F\u0C80-\u0CFF]/;
        if (!indicPattern.test(text)) return text;

        // Improved transliteration algorithm
        let result = '';
        let i = 0;
        while (i < text.length) {
            const char = text[i];
            let foundMatch = false;

            // Only transliterate if script is enabled
            const isDevanagari = /[\u0900-\u097F]/.test(char);
            const isKannada = /[\u0C80-\u0CFF]/.test(char);

            if ((!isDevanagari || settings.devanagari) && (!isKannada || settings.kannada)) {
                // Handle Nukta first for Devanagari
                if (i < text.length - 1 && text[i + 1] === '़') {
                    if (char === 'ज') {
                        if (i + 2 < text.length && ['ा', 'ि', 'ी', 'ु', 'ू', 'े', 'ै', 'ो', 'ौ', 'ृ', 'ॄ', 'ॢ', 'ॣ'].includes(text[i + 2])) {
                            result += 'z';
                        } else {
                            result += 'zₐ';
                        }
                        i += 2; // Skip the consonant and the nukta
                        foundMatch = true;
                    } else if (char === 'फ') {
                        if (i + 2 < text.length && ['ा', 'ि', 'ी', 'ु', 'ू', 'े', 'ै', 'ो', 'ौ', 'ृ', 'ॄ', 'ॢ', 'ॣ'].includes(text[i + 2])) {
                            result += 'f';
                        } else {
                            result += 'fₐ';
                        }
                        i += 2; // Skip the consonant and the nukta
                        foundMatch = true;
                    } else {
                        result += devanagariToITRANS[text[i]];
                        i += 2;
                        foundMatch = true;
                    }
                }
                // Check for Matras (Vowel signs)
                if (!foundMatch && i < text.length - 1 && ['ा', 'ि', 'ी', 'ु', 'ू', 'े', 'ै', 'ो', 'ौ', 'ृ', 'ॄ', 'ॢ', 'ॣ', 'ಾ', 'ಿ', 'ೀ', 'ು', 'ೂ', 'ೆ', 'ೇ', 'ೈ', 'ೊ', 'ೋ', 'ೌ', 'ೃ', 'ೄ'].includes(text[i + 1])) {
                    // Remove the trailing 'ₐ' if present for Devanagari
                    if (devanagariToITRANS[char] && devanagariToITRANS[char].endsWith('ₐ')) {
                        result += devanagariToITRANS[char].slice(0, -1);
                        // Remove the trailing 'a' if present for Kannada
                    } else if (kannadaToITRANS[char] && kannadaToITRANS[char].endsWith('a')) {
                        result += kannadaToITRANS[char].slice(0, -1);
                    } else {
                        result += devanagariToITRANS[char] || kannadaToITRANS[char];
                    }
                    // Append matra
                    result += devanagariToITRANS[text[i + 1]] || kannadaToITRANS[text[i + 1]];
                    i += 2; // Skip the matra
                    foundMatch = true;
                }
                // Handle consonants followed by halant (virama)
                if (!foundMatch && i < text.length - 1 && (text[i + 1] === '्' || text[i + 1] === '್')) {
                    // Get the consonant without the inherent 'ₐ' for Devanagari
                    if (devanagariToITRANS[char]) {
                        const consonant = devanagariToITRANS[char];
                        if (consonant && consonant.endsWith('ₐ')) {
                            result += consonant.slice(0, -1);
                        } else {
                            result += consonant;
                        }
                        // Get the consonant without the inherent 'a' for Kannada
                    } else if (kannadaToITRANS[char]) {
                        const consonant = kannadaToITRANS[char];
                        if (consonant && consonant.endsWith('a')) {
                            result += consonant.slice(0, -1);
                        } else {
                            result += consonant;
                        }
                    }
                    i += 2; // Skip the halant
                    foundMatch = true;
                }
                // Check for special two-character sequences first:
                if (!foundMatch && i + 1 < text.length) {
                    const twoChar = text.substring(i, i + 2);
                    if (devanagariToITRANS[twoChar]) {
                        result += devanagariToITRANS[twoChar];
                        i += 2;
                        foundMatch = true;
                    } else if (kannadaToITRANS[twoChar]) {
                        result += kannadaToITRANS[twoChar];
                        i += 2;
                        foundMatch = true;
                    }
                }
                // Regular character
                if (!foundMatch && (devanagariToITRANS[char] || kannadaToITRANS[char])) {
                    result += devanagariToITRANS[char] || kannadaToITRANS[char];
                    i++;
                    foundMatch = true;
                }
                // Non-Devanagari and Non-Kannada character
                if (!foundMatch) {
                    result += char;
                    i++;
                }
            } else {
                result += char;
                i++;
            }
        }
        return result;
    }

    // Function to process text nodes
    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const originalText = node.nodeValue;
            if (originalText && originalText.trim()) {
                const transliteratedText = transliterateToITRANS(originalText);
                if (originalText !== transliteratedText) {
                    node.nodeValue = transliteratedText;
                }
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Skip script, style, and form elements
            const nodeName = node.nodeName.toLowerCase();
            if (nodeName === 'script' || nodeName === 'style' || nodeName === 'textarea' || nodeName === 'input') {
                return;
            }

            // Process child nodes
            for (let i = 0; i < node.childNodes.length; i++) {
                processNode(node.childNodes[i]);
            }
        }
    }

    // Wait for DOM to be fully loaded
    function initTransliteration() {
        if (document.body) {
            console.log("Devanagari to ITRANS: Starting transliteration...");
            processNode(document.body);

            // Set up a MutationObserver to handle dynamically added content
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            processNode(node);
                        });
                    } else if (mutation.type === 'characterData') {
                        processNode(mutation.target);
                    }
                });
            });

            // Start observing the document
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });

            console.log("Devanagari to ITRANS: Observer initialized");
        } else {
            // If body isn't ready yet, retry after a short delay
            setTimeout(initTransliteration, 10);
        }
    }

    // Load settings before initializing
    chrome.storage.sync.get(['devanagari', 'kannada'], (result) => {
        settings = {
            devanagari: result.devanagari !== false,
            kannada: result.kannada !== false
        };
        initTransliteration();
    });

    // Listen for settings changes
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'settingsChanged') {
            settings = message.settings;
            processNode(document.body);
        }
    });

    // Make sure DOM is loaded before processing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTransliteration);
    } else {
        initTransliteration();
    }
})();
