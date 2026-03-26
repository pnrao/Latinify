const LOGGING_ENABLED = false;
    const REPLACEABLE_SCRIPT_START = '\u0600';
    const REPLACEABLE_SCRIPT_END = '\u0DFF';

    const INDIC_START = '\u0900';
    const INDIC_END   = '\u0DFF';

    const ARABIC_START          = '\u0600';
    const ARABIC_END            = '\u077F';
    const ARABIC_MODIFIER_START = '\u064B';
    const ARABIC_MODIFIER_END   = '\u065F';
    const ARABIC_NUKTA          = null;

    // One entry per Indic script block, in Unicode order (index = (cp - 0x0900) >> 7).
    const indicScripts = [
        { key: 'devanagari', matraStart: '\u093E', matraEnd: '\u094F', nukta: '\u093C' },
        { key: 'bengali',    matraStart: '\u09BE', matraEnd: '\u09CD', nukta: '\u09BC' },
        { key: 'gurmukhi',   matraStart: '\u0A3E', matraEnd: '\u0A4D', nukta: '\u0A3C', addak: '\u0A71' },
        { key: 'gujarati',   matraStart: '\u0ABE', matraEnd: '\u0AE3', nukta: '\u0ABC' },
        { key: 'odia',       matraStart: '\u0B3E', matraEnd: '\u0B57', nukta: '\u0B3C' },
        { key: 'tamil',      matraStart: '\u0BBE', matraEnd: '\u0BCD', nukta: null },
        { key: 'telugu',     matraStart: '\u0C3E', matraEnd: '\u0C56', nukta: null },
        { key: 'kannada',    matraStart: '\u0CBE', matraEnd: '\u0CCD', nukta: '\u0CBC' },
        { key: 'malayalam',  matraStart: '\u0D3E', matraEnd: '\u0D63', nukta: null },
        { key: 'sinhala',    matraStart: '\u0DCA', matraEnd: '\u0DDF', nukta: null },
    ];

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
            if (text[i] >= ARABIC_START && text[i] <= ARABIC_END) {
                if (settings.arabic === false) {
                    flushCurrentWord(); currentScript = null; replacement.push(text[i]);
                } else {
                    if (currentScript !== 'arabic') { flushCurrentWord(); currentScript = 'arabic'; }
                    if (text[i] === '\u0651' && currentWord.length > 0) {
                        currentWord.push(currentWord[currentWord.length - 1]);
                    } else {
                        appendTransliteratedChar(text, i, currentWord, arabicTable, 0x0600, ARABIC_MODIFIER_START, ARABIC_MODIFIER_END, ARABIC_NUKTA, schemeIdx);
                    }
                }
            } else if (text[i] >= INDIC_START && text[i] <= INDIC_END) {
                const script = indicScripts[(text.charCodeAt(i) - 0x0900) >> 7];
                if (settings[script.key] === false) {
                    flushCurrentWord(); currentScript = null; replacement.push(text[i]);
                } else {
                    if (currentScript !== script.key) { flushCurrentWord(); currentScript = script.key; }
                    if (script.addak && text[i] === script.addak) {
                        const nextEntry = indicTable[text.charCodeAt(i + 1) - 0x0900];
                        const next = nextEntry ? nextEntry[schemeIdx] : null;
                        if (next) currentWord.push(next.slice(0, -1));
                    } else {
                        appendTransliteratedChar(text, i, currentWord, indicTable, 0x0900, script.matraStart, script.matraEnd, script.nukta, schemeIdx);
                    }
                }
            } else {
                flushCurrentWord(); currentScript = null; replacement.push(text[i]);
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

