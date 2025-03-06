// This script runs when the page loads
const SCRIPT_BLOCKS = {
    // Devanagari
    '\u0900-\u097F': 'Devanagari',
    // Bengali
    '\u0980-\u09FF': 'Bengali',
    // Gurmukhi (Punjabi)
    '\u0A00-\u0A7F': 'Gurmukhi',
    // Gujarati
    '\u0A80-\u0AFF': 'Gujarati',
    // Oriya
    '\u0B00-\u0B7F': 'Oriya',
    // Tamil
    '\u0B80-\u0BFF': 'Tamil',
    // Telugu
    '\u0C00-\u0C7F': 'Telugu',
    // Kannada
    '\u0C80-\u0CFF': 'Kannada',
    // Malayalam
    '\u0D00-\u0D7F': 'Malayalam'
};

// Map of common characters for Devanagari to ITRANS
const DEVANAGARI_TO_ITRANS = {
    // Vowels
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ii', 'उ': 'u', 'ऊ': 'uu',
    'ऋ': 'RRi', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',

    // Consonants
    'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'Ga',
    'च': 'cha', 'छ': 'Cha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'Ja',
    'ट': 'Ta', 'ठ': 'Tha', 'ड': 'Da', 'ढ': 'Dha', 'ण': 'Na',
    'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
    'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
    'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va', 'श': 'sha',
    'ष': 'Sha', 'स': 'sa', 'ह': 'ha', 'क्ष': 'kSha', 'ज्ञ': 'GYa',

    // Matras (vowel signs)
    'ा': 'aa', 'ि': 'i', 'ी': 'ii', 'ु': 'u', 'ू': 'uu',
    'ृ': 'Ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',

    // Other signs
    '्': '', 'ं': '.n', 'ः': 'H', 'ँ': '.N',
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
};

// Maps for other scripts would be added here
const BENGALI_TO_ITRANS = {
    // Basic Bengali to ITRANS mappings
    'অ': 'a', 'আ': 'aa', 'ই': 'i', 'ঈ': 'ii', 'উ': 'u', 'ঊ': 'uu',
    'ঋ': 'RRi', 'এ': 'e', 'ঐ': 'ai', 'ও': 'o', 'ঔ': 'au',

    'ক': 'ka', 'খ': 'kha', 'গ': 'ga', 'ঘ': 'gha', 'ঙ': 'Ga',
    'চ': 'cha', 'ছ': 'Cha', 'জ': 'ja', 'ঝ': 'jha', 'ঞ': 'Ja',
    'ট': 'Ta', 'ঠ': 'Tha', 'ড': 'Da', 'ঢ': 'Dha', 'ণ': 'Na',
    'ত': 'ta', 'থ': 'tha', 'দ': 'da', 'ধ': 'dha', 'ন': 'na',
    'প': 'pa', 'ফ': 'pha', 'ব': 'ba', 'ভ': 'bha', 'ম': 'ma',
    'য': 'ya', 'র': 'ra', 'ল': 'la', 'শ': 'sha', 'ষ': 'Sha', 'স': 'sa', 'হ': 'ha',

    // Vowel signs
    'া': 'aa', 'ি': 'i', 'ী': 'ii', 'ু': 'u', 'ূ': 'uu',
    'ৃ': 'Ri', 'ে': 'e', 'ৈ': 'ai', 'ো': 'o', 'ৌ': 'au',

    // Other signs
    '্': '', 'ং': '.n', 'ঃ': 'H', 'ঁ': '.N',
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
};

// More script mappings would be added similarly

// Default settings
let settings = {
    convertAll: true,
    showOriginal: true
};

// Load settings when the script starts
chrome.storage.sync.get({
    convertAll: true,
    showOriginal: true
}, function (items) {
    settings = items;
    // Run conversion with loaded settings
    convertAllIndicText();
});

// Listen for settings updates
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "updateSettings") {
        settings.convertAll = request.convertAll;
        settings.showOriginal = request.showOriginal;
        // Re-run conversion with new settings
        convertAllIndicText();
    }
});

function detectScriptBlock(text) {
    for (const [range, name] of Object.entries(SCRIPT_BLOCKS)) {
        const [start, end] = range.split('-');
        const startCode = parseInt(start.slice(1), 16);
        const endCode = parseInt(end.slice(1), 16);

        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            if (charCode >= startCode && charCode <= endCode) {
                return name;
            }
        }
    }
    return null;
}

function getConversionMap(scriptName) {
    switch (scriptName) {
        case 'Devanagari':
            return DEVANAGARI_TO_ITRANS;
        case 'Bengali':
            return BENGALI_TO_ITRANS;
        // Add cases for other scripts
        default:
            return null;
    }
}

function convertToITRANS(text, conversionMap) {
    let result = '';

    // This is a simplified conversion that doesn't handle all the nuances of Indic scripts
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (conversionMap[char]) {
            result += conversionMap[char];
        } else {
            result += char;
        }
    }

    return result;
}

function hasIndicScript(text) {
    return detectScriptBlock(text) !== null;
}

function convertAllIndicText() {
    // Remove any previous conversions first
    const previousConversions = document.querySelectorAll('.itrans-converted');
    previousConversions.forEach(node => {
        if (node.dataset.originalNode) {
            try {
                const originalTextNode = document.createTextNode(node.dataset.originalText || '');
                node.parentNode.replaceChild(originalTextNode, node);
            } catch (e) {
                // In case of error, just remove the node
                node.remove();
            }
        } else {
            node.remove();
        }
    });

    // If conversion is disabled, exit
    if (!settings.convertAll) {
        return;
    }

    // Get all text nodes that might contain Indic script
    const textNodes = [];
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

    let node;
    while (node = walk.nextNode()) {
        // Skip empty nodes and nodes that are part of scripts, styles, etc.
        if (node.nodeValue.trim().length === 0) continue;
        if (node.parentNode.tagName === 'SCRIPT' ||
            node.parentNode.tagName === 'STYLE' ||
            node.parentNode.tagName === 'NOSCRIPT') continue;

        // Check if the node contains Indic script text
        if (hasIndicScript(node.nodeValue)) {
            textNodes.push(node);
        }
    }

    // Convert each text node
    for (const node of textNodes) {
        const text = node.nodeValue;
        const script = detectScriptBlock(text);
        const conversionMap = getConversionMap(script);

        if (!script || !conversionMap) continue;

        const itransText = convertToITRANS(text, conversionMap);

        // Create a new element to hold the converted text
        const wrapper = document.createElement('span');
        wrapper.className = 'itrans-converted';
        wrapper.dataset.originalText = text;
        wrapper.style.display = 'inline-block';
        wrapper.style.backgroundColor = '#f5f5f5';
        wrapper.style.padding = '2px 5px';
        wrapper.style.borderRadius = '3px';
        wrapper.style.margin = '2px 0';
        wrapper.style.lineHeight = '1.5';
        wrapper.style.fontFamily = 'Arial, sans-serif';

        // Add the script name and converted text
        if (settings.showOriginal) {
            wrapper.innerHTML = `<span style="color:#666;font-size:0.8em;">[${script}]</span> <span style="color:#333;">${itransText}</span>`;
            wrapper.title = text; // Show original text on hover
        } else {
            wrapper.innerHTML = `<span style="color:#666;font-size:0.8em;">[${script}]</span> <span style="color:#333;">${itransText}</span>`;
        }

        // Replace the original node with our new element
        node.parentNode.replaceChild(wrapper, node);
    }
}

// Run the conversion automatically when the page loads
window.addEventListener('load', function () {
    // Add a slight delay to ensure the page is fully loaded
    setTimeout(convertAllIndicText, 500);
});

// Also run when DOM content is loaded as a fallback
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(convertAllIndicText, 500);
});

// Observe DOM changes to handle dynamically loaded content
const observer = new MutationObserver(function (mutations) {
    let shouldRun = false;

    for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
            // Check if any added node might contain text
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE &&
                    (node.textContent.length > 20 || node.querySelectorAll('*').length > 5)) {
                    shouldRun = true;
                    break;
                }
            }
        }

        if (shouldRun) break;
    }

    if (shouldRun) {
        setTimeout(convertAllIndicText, 300);
    }
});

// Start observing DOM changes
observer.observe(document.body, {
    childList: true,
    subtree: true
});
