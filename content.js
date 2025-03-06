// content.js
(function () {
    // Mapping of Devanagari Unicode characters to ITRANS
    const devanagariToITRANS = {
        // Vowels
        'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ii', 'उ': 'u', 'ऊ': 'uu',
        'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'ऋ': 'RRi', 'ॠ': 'RRI',
        'ऌ': 'LLi', 'ॡ': 'LLI',

        // Consonants
        'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'gna',
        'च': 'cha', 'छ': 'Cha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'jna',
        'ट': 'Ta', 'ठ': 'Tha', 'ड': 'Da', 'ढ': 'Dha', 'ण': 'Na',
        'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
        'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
        'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va', 'श': 'sha',
        'ष': 'Sha', 'स': 'sa', 'ह': 'ha', 'ळ': 'La',

        // Conjunct Consonants (Special Cases)
        'क्ष': 'ksha',
        'ज्ञ': 'gya',

        // Matras (vowel signs)
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
        ' ': ' ' //Add support for spaces
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

            // Check if current character is in our mapping
            if (devanagariToITRANS.hasOwnProperty(char)) {
                // Handle consonants followed by halant (virama)
                if (i < text.length - 1 && text[i + 1] === '्') {
                    // Get the consonant without the inherent 'a'
                    const consonant = devanagariToITRANS[char];
                    if (consonant && consonant.endsWith('a')) {
                        result += consonant.slice(0, -1);
                    } else {
                        result += consonant;
                    }
                    i += 2; // Skip the halant
                }
                // Handle special conjuncts manually
                else if (char === 'क' && i < text.length - 2 && text[i + 1] === '्' && text[i + 2] === 'ष') {
                    result += 'ksha';
                    i += 3;
                }
                else if (char === 'ज' && i < text.length - 2 && text[i + 1] === '्' && text[i + 2] === 'ञ') {
                    result += 'gya';
                    i += 3;
                }
                // Regular character
                else {
                    result += devanagariToITRANS[char];
                    i++;
                }
            } else {
                // Non-Devanagari character
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