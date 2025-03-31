(function () {
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
        'ज़': 'zₐ', 'फ़': 'fₐ',

        // nukta consonants
        'क़': 'qₐ', 'ख़': 'qhₐ', 'ग़': 'gₐ', 'ज़': 'zₐ', 'ड़': 'rₐ', 'ढ़': 'rhₐ', 'फ़': 'fₐ', 'य़': 'yyₐ',

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
        'ॅ': 'e', 'ॉ': 'o',

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
        'ೞ': 'fa',

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

    let settings = { devanagari: undefined, kannada: undefined };
    // When we had set the above to true, it was always transliterating some
    // sections of the page.The settings were not taking effect.
    // XXX: I'd like some explanation for this behaviour.

    // Function to transliterate text to ITRANS
    function transliterateToITRANS(text) {
        if (!text || typeof text !== 'string') {
            // console.log("nontext = " + typeof text);
            return text;
        }
        if (settings.devanagari == false && settings.kannada == false)
            return text;

        let replacement = [];
        for (let i = 0; i < text.length; i++) {
            if (settings.devanagari && text[i] >= '\u0900' && text[i] <= '\u097F') {
                if (text[i] >= '\u0904' && text[i] <= '\u0939') { // discrete letter
                    replacement.push(devanagariToITRANS[text[i]]);
                } else if (text[i] >= '\u093E' && text[i] <= '\u094F') { // matra or halant
                    if (replacement.at(-1).endsWith('ₐ')) {
                        replacement[replacement.length - 1] = replacement.at(-1).slice(0, -1);
                    }
                    replacement.push(devanagariToITRANS[text[i]]);
                } else if (text[i] == '\u093C') { // nukta
                    switch (replacement.at(-1)) {
                        case 'kₐ':
                            replacement[replacement.length - 1] = 'qₐ';
                            break;
                        case 'khₐ':
                            replacement[replacement.length - 1] = 'qhₐ';
                            break;
                        case 'jₐ':
                            replacement[replacement.length - 1] = 'zₐ';
                            break;
                        case 'phₐ':
                            replacement[replacement.length - 1] = 'fₐ';
                            break;
                        default:
                            // words like पढ़ाई, चौड़ा seem to be pronounced as if the nukta is not there
                            break;
                    }
                } else {
                    replacement.push(devanagariToITRANS[text[i]]);
                }
            } else if (settings.kannada && text[i] >= '\u0C80' && text[i] <= '\u0CFF') {
                if (text[i] >= '\u0C85' && text[i] <= '\u0CB9') { // discrete letter
                    replacement.push(kannadaToITRANS[text[i]]);
                } else if (text[i] >= '\u0CBE' && text[i] <= '\u0CCD') { // matra or halant
                    if (replacement.at(-1).endsWith('a')) {
                        replacement[replacement.length - 1] = replacement.at(-1).slice(0, -1);
                    }
                    replacement.push(kannadaToITRANS[text[i]]);
                } else if (text[i] == '\u0CBC') { // nukta
                    // XXX: I haven't seen nukta in Kannada, so guessing at this
                    switch (replacement.at(-1)) {
                        case 'ka':
                            replacement[replacement.length - 1] = 'qa';
                            break;
                        case 'kha':
                            replacement[replacement.length - 1] = 'qha';
                            break;
                        case 'ja':
                            replacement[replacement.length - 1] = 'za';
                            break;
                        case 'pha':
                            replacement[replacement.length - 1] = 'fa';
                            break;
                        default:
                            break;
                    }
                } else {
                    replacement.push(kannadaToITRANS[text[i]]);
                }
            } else {
                replacement.push(text[i]);
            }
        }
        return replacement.join("");
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
            const startTime = performance.now();
            processNode(document.body);

            // Set up a MutationObserver to handle dynamically added content
            const observer = new MutationObserver((mutations) => {
                const dynamicStartTime = performance.now();
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            processNode(node);
                        });
                    } else if (mutation.type === 'characterData') {
                        processNode(mutation.target);
                    }
                });
                const dynamicTime = performance.now() - dynamicStartTime;
                // console.log(`Transliteration (dynamic): ${dynamicTime.toFixed(2)}ms`);
                // ^ this time too short, so not logging it
            });

            // Start observing the document
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });

            const totalTime = performance.now() - startTime;
            console.log(`Transliteration (at load): ${totalTime.toFixed(2)}ms`);
        } else {
            // If body isn't ready yet, retry after a short delay
            setTimeout(initTransliteration, 10);
        }
    }

    // Load settings before initializing
    chrome.storage.sync.get(['devanagari', 'kannada'], (result) => {
        settings = {
            devanagari: result.devanagari !== undefined ? result.devanagari : true,
            kannada: result.kannada !== undefined ? result.kannada : true
        };
        // console.log("Devanagari: " + settings.devanagari + ", Kannada: " + settings.kannada);
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
