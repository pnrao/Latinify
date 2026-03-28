const LOGGING_ENABLED = false;
    const REPLACEABLE_SCRIPT_START = '\u0600';
    const REPLACEABLE_SCRIPT_END = '\u0DFF';

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
        const el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
        if (!el || !el.getAttribute) return false;
        if (el.isContentEditable) return true;
        const role = el.getAttribute('role');
        return role === 'textbox' || role === 'searchbox' || role === 'combobox' || role === 'spinbutton';
    }

    // Function to process text nodes; returns true if any transliteration occurred
    function processNode(node) {
        // Skip editable content to avoid interfering with user input
        if (isNodeEditable(node)) return false;

        if (node.nodeType === Node.TEXT_NODE && hasReplaceableScript(node.nodeValue)) {
            if (node.parentNode && node.parentNode.classList.contains('transliterated')) {
                // log('Skipping already processed text node:', node.nodeValue);
                return false; // Skip already processed nodes
            }
            const transliteratedText = transliterateToLatin(node.nodeValue, settings);
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
                return true;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && !SKIPPED_NODES.includes(node.nodeName.toLowerCase())) {
            if (node.hasAttribute('data-transliterated') || node.classList.contains('transliterated')) {
                // log('Skipping already processed element node:', node);
                return false; // Skip already processed nodes
            }
            // log('Processing element node:', node);
            let changed = false;
            Array.from(node.childNodes).forEach(child => { if (processNode(child)) changed = true; });
            if (node.childNodes.length > 0) {
                node.setAttribute('data-transliterated', 'true'); // Mark the element as processed only after its children are processed
            }
            return changed;
        }
        return false;
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

            const changed = processNode(document.body);
            const endLoadTime = performance.now();
            const loadTime = endLoadTime - startTime;
            console.log(`Transliteration (at load) completed in ${loadTime.toFixed(2)}ms.`);
            if (changed) updateOverlay(loadTime);

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
                            if (processNode(node)) processed = true;
                        });
                    } else if (mutation.type === 'characterData') {
                        // Ignore changes to our own nodes
                        if (mutation.target.parentNode && (mutation.target.parentNode.classList.contains('transliterated') || mutation.target.parentNode.id === 'latinify-stats-overlay')) {
                            return;
                        }
                        log('Processing dynamically changed text node:', mutation.target);
                        if (processNode(mutation.target)) processed = true;
                    }
                });

                if (processed) {
                    applyDirectionOverride();
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

