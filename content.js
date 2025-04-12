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

    const SKIPPED_NODES = ['script', 'style', 'textarea', 'input'];

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
        'ఋ': 'RRi', 'ౠ': 'RRI', 'ఎ': 'e', 'ఏ': 'ee', 'ఐ': 'ai', 'ఒ': 'o', 'ఓ': 'oo', 'ఔ': 'au',

        // Consonants
        'క': 'ka', 'ఖ': 'kha', 'గ': 'ga', 'ఘ': 'gha', 'ఙ': 'nga',
        'చ': 'cha', 'ఛ': 'Cha', 'జ': 'ja', 'ఝ': 'jha', 'ఞ': 'jna',
        'ట': 'Ta', 'ఠ': 'Tha', 'డ': 'Da', 'ఢ': 'Dha', 'ణ': 'Na',
        'త': 'ta', 'థ': 'tha', 'ద': 'da', 'ధ': 'dha', 'న': 'na',
        'ప': 'pa', 'ఫ': 'pha', 'బ': 'ba', 'భ': 'bha', 'మ': 'ma',
        'య': 'ya', 'ర': 'ra', 'ల': 'la', 'వ': 'va', 'శ': 'sha',
        'ష': 'Sha', 'స': 'sa', 'హ': 'ha', 'ళ': 'La', 'క్ష': 'kSha',

        // Matras (Vowel signs)
        'ా': 'aa', 'ి': 'i', 'ీ': 'ii', 'ు': 'u', 'ూ': 'uu',
        'ె': 'e', 'ే': 'ee', 'ై': 'ai', 'ొ': 'o', 'ో': 'oo', 'ౌ': 'au',

        // Additional marks
        '్': '', 'ం': 'ᵐ', 'ః': 'H',

        // Numerals
        '౦': '0', '౧': '1', '౨': '2', '౩': '3', '౪': '4',
        '౫': '5', '౬': '6', '౭': '7', '౮': '8', '౯': '9',

        // Others
        '।': '. ', '॥': '. ',
        ' ': ' '
    };

    let settings = { devanagari: undefined, kannada: undefined, telugu: undefined };
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
            'ka': 'qa', 'kha': 'qha', 'ja': 'za', 'pha': 'fa'
            // words like पढ़ाई, चौड़ा seem to be pronounced as if the nukta is not there
        };
        if (nuktaReplacements[prevLetter]) {
            replacementText[replacementText.length - 1] = nuktaReplacements[prevLetter];
        }
    }

    function appendTransliteratedChar(sourceText, i, replacementText, mapping, matraStart, matraEnd, nukta) {
        const prevLetter = replacementText.length > 0 ? replacementText[replacementText.length - 1] : '';
        if (sourceText[i] >= matraStart && sourceText[i] <= matraEnd) {
            if (replacementText.length > 0 && (prevLetter.endsWith('ₐ') || prevLetter.endsWith('a'))) {
                replacementText[replacementText.length - 1] = prevLetter.slice(0, -1);
            }
            replacementText.push(mapping[sourceText[i]]);
        } else if (sourceText[i] == nukta) {
            handleNukta(prevLetter, replacementText);
        } else { // discrete letter
            replacementText.push(mapping[sourceText[i]] || sourceText[i]);
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
        if (settings.devanagari === false && settings.kannada === false &&
            settings.telugu === false) {
            log('Skipping transliteration: all scripts disabled');
            return text;
        }

        let replacement = [];
        let currentScript = null;
        let currentWord = [];

        function flushCurrentWord() {
            if (currentWord.length > 0) {
                replacement.push(wrapWordWithSpan(currentWord.join(""), currentScript));
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

    // Function to process text nodes
    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE && hasIndic(node.nodeValue)) {
            if (node.parentNode && node.parentNode.hasAttribute('data-transliterated')) {
                log('Skipping already processed text node:', node.nodeValue);
                return; // Skip already processed nodes
            }
            const transliteratedText = transliterateToITRANS(node.nodeValue);
            if (node.nodeValue !== transliteratedText) {
                log('Transliterating text node:', {
                    original: node.nodeValue,
                    transliterated: transliteratedText
                });
                const span = document.createElement('span');
                span.className = 'transliterated';
                span.innerHTML = transliteratedText;
                node.replaceWith(span);
            } else {
                // Debug log for failed transliteration
                log('Failed transliteration. Analysis:', {
                    text: node.nodeValue,
                    chars: Array.from(node.nodeValue).map(c => ({
                        char: c,
                        unicode: c.charCodeAt(0).toString(16),
                        inDevanagari: c >= DEVANAGARI_START && c <= DEVANAGARI_END,
                        inKannada: c >= KANNADA_START && c <= KANNADA_END,
                        inTelugu: c >= TELUGU_START && c <= TELUGU_END,
                        mapped: devanagariToITRANS[c] || kannadaToITRANS[c] || teluguToITRANS[c]
                    }))
                });
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && !SKIPPED_NODES.includes(node.nodeName.toLowerCase())) {
            if (node.hasAttribute('data-transliterated')) {
                log('Skipping already processed element node:', node);
                return; // Skip already processed nodes
            }
            // log('Processing element node:', node);
            Array.from(node.childNodes).forEach(processNode);
            if (node.childNodes.length > 0) {
                node.setAttribute('data-transliterated', 'true'); // Mark the element as processed only after its children are processed
            }
        }
    }

    function initTransliteration() {
        if (document.body) {
            const startTime = performance.now();

            processNode(document.body);
            const endLoadTime = performance.now();
            const loadTime = endLoadTime - startTime;
            console.log(`Transliteration (at load) completed in ${loadTime.toFixed(2)}ms.`);

            // Set up a MutationObserver to handle dynamically added content
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                log('Processing dynamically added node:', node);
                                processNode(node);
                            }
                        });
                    } else if (mutation.type === 'characterData') {
                        log('Processing dynamically changed text node:', mutation.target);
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

            const endMutationObserverTime = performance.now() - startTime;
            console.log(`Transliteration (mutations) completed in ${endMutationObserverTime.toFixed(2)}ms.`);
        } else {
            // If body isn't ready yet, retry after a short delay
            log('Document body not ready. Retrying initialization.');
            setTimeout(initTransliteration, 10);
        }
    }

    // Load settings before initializing
    chrome.storage.sync.get(['devanagari', 'kannada', 'telugu'], (result) => {
        settings = {
            devanagari: result.devanagari !== false,
            kannada: result.kannada !== false,
            telugu: result.telugu !== false
        };
        log('Settings initialized:', settings);
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
