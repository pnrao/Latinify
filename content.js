const LOGGING_ENABLED = false;
    const REPLACEABLE_SCRIPT_START = '\u0600';
    const REPLACEABLE_SCRIPT_END = '\u0DFF';

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

    const TAMIL_START = '\u0B80';
    const TAMIL_END = '\u0BFF';
    const TAMIL_MODIFIER_START = '\u0BBE';
    const TAMIL_MODIFIER_END = '\u0BCD';
    const TAMIL_NUKTA = null;

    const MALAYALAM_START = '\u0D00';
    const MALAYALAM_END = '\u0D7F';
    const MALAYALAM_MODIFIER_START = '\u0D3E';
    const MALAYALAM_MODIFIER_END = '\u0D63';
    const MALAYALAM_NUKTA = null; // Malayalam does not have a nukta equivalent

    const SINHALA_START = '\u0D80';
    const SINHALA_END = '\u0DFF';
    const SINHALA_MODIFIER_START = '\u0DCA'; // hal kirima (virama)
    const SINHALA_MODIFIER_END = '\u0DDF';
    const SINHALA_NUKTA = null;

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

    const ARABIC_START = '\u0600';
    const ARABIC_END = '\u077F'; // extended to cover Arabic Extended-A block (U+0750–U+077F)
    const ARABIC_MODIFIER_START = '\u064B'; // tanwin fath (first harakat)
    const ARABIC_MODIFIER_END = '\u065F';   // extended to cover all Arabic diacritical marks
    const ARABIC_NUKTA = null;

    const BENGALI_START = '\u0980';
    const BENGALI_END = '\u09FF';
    const BENGALI_MODIFIER_START = '\u09BE';
    const BENGALI_MODIFIER_END = '\u09CD'; // stop before nukta consonants ড় ঢ় য় (U+09DC-09DF)
    const BENGALI_NUKTA = '\u09BC';

    const SKIPPED_NODES = ['script', 'style', 'textarea', 'input', 'noscript', 'iframe', 'object', 'embed', 'audio', 'video', 'select', 'button', 'code', 'pre'];


    let settings = { bengali: undefined, devanagari: undefined, gujarati: undefined, gurmukhi: undefined, kannada: undefined, sinhala: undefined, tamil: undefined, telugu: undefined, odia: undefined, malayalam: undefined, arabic: undefined, flipRtl: undefined, indicateScript: undefined, scheme: undefined };
    // When we had set the above to true, it was always transliterating some
    // sections of the page.The settings were not taking effect.
    // XXX: I'd like some explanation for this behaviour.

    function log(...args) {
        if (LOGGING_ENABLED) {
            console.log(...args);
        }
    }

    const nuktaReplacements = [
        // ITRANS (0) — ₐ-style (Devanagari/Gujarati) and a-style (other scripts)
        { 'kₐ': 'qₐ', 'khₐ': 'qhₐ', 'jₐ': 'zₐ', 'phₐ': 'fₐ',
          'kₒ': 'qₒ', 'khₒ': 'qhₒ', 'jₒ': 'zₒ', 'phₒ': 'fₒ',
          'ka': 'qa', 'kha': 'qha', 'ja': 'za', 'pha': 'fa',
          'Da': 'Ra', 'ra': 'Ra', 'la': 'La', 'sa': 'sha' },
        // ISO (1) — words like पढ़ाई use ḍa→ṛa
        { 'ka': 'qa', 'kha': 'qha', 'ja': 'za', 'pha': 'fa',
          'ḍa': 'ṛa', 'ḍha': 'ṛha', 'ra': 'ṛa', 'la': 'ḷa', 'sa': 'śa' },
        // IPA (2)
        {}
    ];

    function handleNukta(replacementText, schemeIdx) {
        if (replacementText.length === 0) return;
        const prevLetter = replacementText[replacementText.length - 1];
        const replacement = nuktaReplacements[schemeIdx][prevLetter];
        if (replacement !== undefined) {
            replacementText[replacementText.length - 1] = replacement;
        }
    }

    function appendTransliteratedChar(sourceText, i, replacementText, table, scriptStartCP, matraStart, matraEnd, nukta, schemeIdx) {
        if (nukta && sourceText[i] === nukta) {
            handleNukta(replacementText, schemeIdx);
            return;
        }
        const offset = sourceText.charCodeAt(i) - scriptStartCP;
        const entry = table[offset];
        const mapped = entry != null ? entry[schemeIdx] : null;
        if (sourceText[i] >= matraStart && sourceText[i] <= matraEnd && replacementText.length > 0) {
            const prev = replacementText[replacementText.length - 1];
            if (prev.endsWith('ₐ') || prev.endsWith('ₒ') || prev.endsWith('a')) {
                replacementText[replacementText.length - 1] = prev.slice(0, -1);
            }
        }
        replacementText.push(mapped != null ? mapped : sourceText[i]);
    }

    function wrapWordWithSpan(word, script) {
        return `<span class="transliterated-${script}">${word}</span>`;
    }

    // Function to transliterate text to Latin
    function transliterateToLatin(text) {
        if (!text || typeof text !== 'string') {
            return text;
        }

        // Explicitly check if all settings are false
        if (settings.bengali === false && settings.devanagari === false && settings.gujarati === false &&
            settings.gurmukhi === false && settings.kannada === false && settings.sinhala === false &&
            settings.tamil === false && settings.telugu === false && settings.odia === false &&
            settings.malayalam === false && settings.arabic === false) {
            log('Skipping transliteration: all scripts disabled');
            return text;
        }

        const schemeIdx = settings.scheme === 'iso' ? 1 : settings.scheme === 'ipa' ? 2 : 0;

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
            if (settings.arabic !== false && text[i] >= ARABIC_START && text[i] <= ARABIC_END) {
                if (currentScript !== 'arabic') {
                    flushCurrentWord();
                    currentScript = 'arabic';
                }
                if (text[i] === '\u0651' && currentWord.length > 0) {
                    // Shadda: gemination — repeat the previous consonant
                    currentWord.push(currentWord[currentWord.length - 1]);
                } else {
                    appendTransliteratedChar(text, i, currentWord, arabicTable, 0x0600, ARABIC_MODIFIER_START, ARABIC_MODIFIER_END, ARABIC_NUKTA, schemeIdx);
                }
            } else if (settings.devanagari !== false && text[i] >= DEVANAGARI_START && text[i] <= DEVANAGARI_END) {
                if (currentScript !== 'devanagari') {
                    flushCurrentWord();
                    currentScript = 'devanagari';
                }
                appendTransliteratedChar(text, i, currentWord, devanagariTable, 0x0900, DEVANAGARI_MODIFIER_START, DEVANAGARI_MODIFIER_END, DEVANAGARI_NUKTA, schemeIdx);
            } else if (settings.kannada !== false && text[i] >= KANNADA_START && text[i] <= KANNADA_END) {
                if (currentScript !== 'kannada') {
                    flushCurrentWord();
                    currentScript = 'kannada';
                }
                appendTransliteratedChar(text, i, currentWord, kannadaTable, 0x0C80, KANNADA_MODIFIER_START, KANNADA_MODIFIER_END, KANNADA_NUKTA, schemeIdx);
            } else if (settings.telugu !== false && text[i] >= TELUGU_START && text[i] <= TELUGU_END) {
                if (currentScript !== 'telugu') {
                    flushCurrentWord();
                    currentScript = 'telugu';
                }
                appendTransliteratedChar(text, i, currentWord, teluguTable, 0x0C00, TELUGU_MODIFIER_START, TELUGU_MODIFIER_END, TELUGU_NUKTA, schemeIdx);
            } else if (settings.odia !== false && text[i] >= ODIA_START && text[i] <= ODIA_END) {
                if (currentScript !== 'odia') {
                    flushCurrentWord();
                    currentScript = 'odia';
                }
                appendTransliteratedChar(text, i, currentWord, odiaTable, 0x0B00, ODIA_MODIFIER_START, ODIA_MODIFIER_END, ODIA_NUKTA, schemeIdx);
            } else if (settings.malayalam !== false && text[i] >= MALAYALAM_START && text[i] <= MALAYALAM_END) {
                if (currentScript !== 'malayalam') {
                    flushCurrentWord();
                    currentScript = 'malayalam';
                }
                appendTransliteratedChar(text, i, currentWord, malayalamTable, 0x0D00, MALAYALAM_MODIFIER_START, MALAYALAM_MODIFIER_END, MALAYALAM_NUKTA, schemeIdx);
            } else if (settings.sinhala !== false && text[i] >= SINHALA_START && text[i] <= SINHALA_END) {
                if (currentScript !== 'sinhala') {
                    flushCurrentWord();
                    currentScript = 'sinhala';
                }
                appendTransliteratedChar(text, i, currentWord, sinhalaTable, 0x0D80, SINHALA_MODIFIER_START, SINHALA_MODIFIER_END, SINHALA_NUKTA, schemeIdx);
            } else if (settings.gujarati !== false && text[i] >= GUJARATI_START && text[i] <= GUJARATI_END) {
                if (currentScript !== 'gujarati') {
                    flushCurrentWord();
                    currentScript = 'gujarati';
                }
                appendTransliteratedChar(text, i, currentWord, gujaratiTable, 0x0A80, GUJARATI_MODIFIER_START, GUJARATI_MODIFIER_END, GUJARATI_NUKTA, schemeIdx);
            } else if (settings.gurmukhi !== false && text[i] >= GURMUKHI_START && text[i] <= GURMUKHI_END) {
                if (currentScript !== 'gurmukhi') {
                    flushCurrentWord();
                    currentScript = 'gurmukhi';
                }
                if (text[i] === GURMUKHI_ADDAK) {
                    const nextEntry = gurmukhiTable[text.charCodeAt(i + 1) - 0x0A00];
                    const next = nextEntry ? nextEntry[schemeIdx] : null;
                    if (next) currentWord.push(next.slice(0, -1)); // strip inherent 'a', doubling the consonant
                } else {
                    appendTransliteratedChar(text, i, currentWord, gurmukhiTable, 0x0A00, GURMUKHI_MODIFIER_START, GURMUKHI_MODIFIER_END, GURMUKHI_NUKTA, schemeIdx);
                }
            } else if (settings.tamil !== false && text[i] >= TAMIL_START && text[i] <= TAMIL_END) {
                if (currentScript !== 'tamil') {
                    flushCurrentWord();
                    currentScript = 'tamil';
                }
                appendTransliteratedChar(text, i, currentWord, tamilTable, 0x0B80, TAMIL_MODIFIER_START, TAMIL_MODIFIER_END, TAMIL_NUKTA, schemeIdx);
            } else if (settings.bengali !== false && text[i] >= BENGALI_START && text[i] <= BENGALI_END) {
                if (currentScript !== 'bengali') {
                    flushCurrentWord();
                    currentScript = 'bengali';
                }
                appendTransliteratedChar(text, i, currentWord, bengaliTable, 0x0980, BENGALI_MODIFIER_START, BENGALI_MODIFIER_END, BENGALI_NUKTA, schemeIdx);
            } else {
                flushCurrentWord();
                currentScript = null;
                replacement.push(text[i]);
            }
        }
        flushCurrentWord();

        return replacement.join('');
    }

    function hasReplaceableScript(text) {
        for (let char of text) {
            if (char >= REPLACEABLE_SCRIPT_START && char <= REPLACEABLE_SCRIPT_END) {
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

        if (node.nodeType === Node.TEXT_NODE && hasReplaceableScript(node.nodeValue)) {
            if (node.parentNode && node.parentNode.classList.contains('transliterated')) {
                // log('Skipping already processed text node:', node.nodeValue);
                return; // Skip already processed nodes
            }
            const transliteratedText = transliterateToLatin(node.nodeValue);
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
                    // However, since the text is now Latin, hasReplaceableScript() will return false,
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


    function applyDirectionOverride() {
        const htmlEl = document.documentElement;
        const isRtl = htmlEl.dir === 'rtl' || getComputedStyle(htmlEl).direction === 'rtl';
        if (settings.arabic !== false && settings.flipRtl !== false && isRtl) {
            document.querySelectorAll('[dir="rtl"]').forEach(el => {
                el.setAttribute('data-latinify-dir', 'rtl');
                el.dir = 'ltr';
            });
        } else if (settings.arabic === false || settings.flipRtl === false) {
            document.querySelectorAll('[data-latinify-dir="rtl"]').forEach(el => {
                el.dir = 'rtl';
                el.removeAttribute('data-latinify-dir');
            });
        }
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
                            // Ignore our own nodes to prevent loops
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.classList.contains('transliterated') || node.hasAttribute('data-transliterated') || node.id === 'latinify-stats-overlay') {
                                    return;
                                }
                            } else if (node.nodeType === Node.TEXT_NODE) {
                                if (node.parentNode && (node.parentNode.classList.contains('transliterated') || node.parentNode.id === 'latinify-stats-overlay')) {
                                    return;
                                }
                            }
                            log('Processing dynamically added node:', node);
                            processNode(node);
                            processed = true;
                        });
                    } else if (mutation.type === 'characterData') {
                        // Ignore changes to our own nodes
                        if (mutation.target.parentNode && (mutation.target.parentNode.classList.contains('transliterated') || mutation.target.parentNode.id === 'latinify-stats-overlay')) {
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
        sinhala: true,
        tamil: true,
        odia: true,
        telugu: true,
        malayalam: true,
        arabic: true,
        flipRtl: true,
        indicateScript: true,
        showStats: false,
        scheme: 'itrans'
    }, (result) => {
        settings = {
            bengali: result.bengali,
            devanagari: result.devanagari,
            gujarati: result.gujarati,
            gurmukhi: result.gurmukhi,
            kannada: result.kannada,
            sinhala: result.sinhala,
            tamil: result.tamil,
            odia: result.odia,
            telugu: result.telugu,
            malayalam: result.malayalam,
            arabic: result.arabic,
            flipRtl: result.flipRtl,
            indicateScript: result.indicateScript,
            showStats: result.showStats,
            scheme: result.scheme
        };
        log('Settings initialized:', settings);
        applyDirectionOverride();
        document.documentElement.classList.toggle('latinify-indicate', settings.indicateScript !== false);
        initTransliteration();
    });

    // Listen for settings changes
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'settingsChanged') {
            settings = message.settings;
            applyDirectionOverride();
            document.documentElement.classList.toggle('latinify-indicate', settings.indicateScript !== false);
            // Reset total time if stats are disabled then enabled?
            // Or just keep tracking? Let's keep tracking but only show if enabled.
            if (!settings.showStats) {
                const overlay = document.getElementById('latinify-stats-overlay');
                if (overlay) overlay.classList.remove('visible');
            }
            processNode(document.body);
        }
    });

