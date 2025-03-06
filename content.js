// content.js
(function () {
    // Mapping of Devanagari Unicode characters to ITRANS
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
        'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ृ': 'RRi',
        'ॄ': 'RRI', 'ॢ': 'LLi', 'ॣ': 'LLI',

        // Additional marks
        '्': '', 'ं': 'ᵐ', 'ः': 'H', 'ँ': 'ⁿ',

        // Numerals
        '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
        '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',

        // Others
        '।': '|', '॥': '||',
        ' ': ' '
    };

    // Function to transliterate Devanagari text to ITRANS
    function transliterateToITRANS(text) {
        if (!text || typeof text !== 'string') return text;

        // Check if text contains Devanagari
        const devanagariPattern = /[\u0900-\u097F]/;
        if (!devanagariPattern.test(text)) return text;

        // Improved transliteration algorithm
        let result = '';
        let i = 0;
        while (i < text.length) {
            const char = text[i];
            let foundMatch = false;
            // Check for Matras (Vowel signs)
            if (i < text.length - 1 && ['ा', 'ि', 'ी', 'ु', 'ू', 'े', 'ै', 'ो', 'ौ', 'ृ', 'ॄ', 'ॢ', 'ॣ'].includes(text[i + 1])) {
                // Get the consonant
                if (devanagariToITRANS[char]) {
                    const consonant = devanagariToITRANS[char];
                    if (consonant && consonant.endsWith('ₐ')) {
                        result += consonant.slice(0, -1); //Remove trailing 'ₐ'
                    } else {
                        result += consonant; //Not a consonant
                    }
                }
                // Append matra
                result += devanagariToITRANS[text[i + 1]];
                i += 2; // Skip the matra
                foundMatch = true;
            }
            // Handle consonants followed by halant (virama)
            if (!foundMatch && i < text.length - 1 && text[i + 1] === '्') {
                // Get the consonant without the inherent 'a'
                if (devanagariToITRANS[char]) {
                    const consonant = devanagariToITRANS[char];
                    if (consonant && consonant.endsWith('ₐ')) {
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
                }
            }
            // Regular character
            if (!foundMatch && devanagariToITRANS[char]) {
                result += devanagariToITRANS[char];
                i++;
                foundMatch = true;
            }
            // Non-Devanagari character
            if (!foundMatch) {
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

    // Make sure DOM is loaded before processing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTransliteration);
    } else {
        initTransliteration();
    }
})();