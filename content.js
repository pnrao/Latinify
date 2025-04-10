(function () {
    'use strict';
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

    let settings = { devanagari: undefined, kannada: undefined };
    // When we had set the above to true, it was always transliterating some
    // sections of the page.The settings were not taking effect.
    // XXX: I'd like some explanation for this behaviour.

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

    // Function to transliterate text to ITRANS
    function transliterateToITRANS(text) {
        if (!text || typeof text !== 'string') {
            return text;
        }
        if (!settings.devanagari && !settings.kannada) {
            return text;
        }

        let replacement = [];
        for (let i = 0; i < text.length; i++) {
            if (settings.devanagari && text[i] >= DEVANAGARI_START && text[i] <= DEVANAGARI_END) {
                appendTransliteratedChar(text, i, replacement, devanagariToITRANS, DEVANAGARI_MODIFIER_START, DEVANAGARI_MODIFIER_END, DEVANAGARI_NUKTA);
            } else if (settings.kannada && text[i] >= KANNADA_START && text[i] <= KANNADA_END) {
                appendTransliteratedChar(text, i, replacement, kannadaToITRANS, KANNADA_MODIFIER_START, KANNADA_MODIFIER_END, KANNADA_NUKTA);
            } else {
                replacement.push(text[i]);
            }
        }
        return replacement.join("");
    }

    // Function to process text nodes
    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
            const transliteratedText = transliterateToITRANS(node.nodeValue);
            if (node.nodeValue !== transliteratedText) {
                node.nodeValue = transliteratedText;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && !SKIPPED_NODES.includes(node.nodeName.toLowerCase())) {
            Array.from(node.childNodes).forEach(processNode);
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
