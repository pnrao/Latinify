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
// This is a simplified version; a full converter would need more mappings
const DEVANAGARI_TO_ITRANS = {
    // Vowels
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ii', 'उ': 'u', 'ऊ': 'uu',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',

    // Consonants
    'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'Ga',
    'च': 'cha', 'छ': 'Cha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'Ja',
    'ट': 'Ta', 'ठ': 'Tha', 'ड': 'Da', 'ढ': 'Dha', 'ण': 'Na',
    'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
    'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
    'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va', 'श': 'sha',
    'ष': 'Sha', 'स': 'sa', 'ह': 'ha',

    // Matras (vowel signs)
    'ा': 'aa', 'ि': 'i', 'ी': 'ii', 'ु': 'u', 'ू': 'uu',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',

    // Other signs
    '्': '', 'ं': '.n', 'ः': 'H'
};

// Maps for other scripts would be added here
const BENGALI_TO_ITRANS = {
    // Basic Bengali to ITRANS mappings
    'অ': 'a', 'আ': 'aa', 'ই': 'i', 'ঈ': 'ii', 'উ': 'u', 'ঊ': 'uu',
    'এ': 'e', 'ঐ': 'ai', 'ও': 'o', 'ঔ': 'au',

    'ক': 'ka', 'খ': 'kha', 'গ': 'ga', 'ঘ': 'gha', 'ঙ': 'Ga',
    'চ': 'cha', 'ছ': 'Cha', 'জ': 'ja', 'ঝ': 'jha', 'ঞ': 'Ja',
    'ট': 'Ta', 'ঠ': 'Tha', 'ড': 'Da', 'ঢ': 'Dha', 'ণ': 'Na',
    'ত': 'ta', 'থ': 'tha', 'দ': 'da', 'ধ': 'dha', 'ন': 'na',
    'প': 'pa', 'ফ': 'pha', 'ব': 'ba', 'ভ': 'bha', 'ম': 'ma',
    'য': 'ya', 'র': 'ra', 'ল': 'la', 'শ': 'sha', 'ষ': 'Sha', 'স': 'sa', 'হ': 'ha',

    // Vowel signs
    'া': 'aa', 'ি': 'i', 'ী': 'ii', 'ু': 'u', 'ূ': 'uu',
    'ে': 'e', 'ৈ': 'ai', 'ো': 'o', 'ৌ': 'au',

    // Other signs
    '্': '', 'ং': '.n', 'ঃ': 'H'
};

// More script mappings would be added similarly

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
    // A complete solution would need to handle conjunct characters, halants, etc.
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

function findLargestTextBlock() {
    // Get all text nodes in the document
    const textNodes = [];
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

    let node;
    while (node = walk.nextNode()) {
        if (node.nodeValue.trim().length > 0) {
            textNodes.push(node);
        }
    }

    // Find the largest contiguous block of Indic text
    let largestBlock = null;
    let largestLength = 0;
    let scriptName = null;

    for (const node of textNodes) {
        const text = node.nodeValue;
        const detectedScript = detectScriptBlock(text);

        if (detectedScript && text.length > largestLength) {
            largestBlock = node;
            largestLength = text.length;
            scriptName = detectedScript;
        }
    }

    return { node: largestBlock, script: scriptName };
}

function convertLargestIndicBlock() {
    const { node, script } = findLargestTextBlock();

    if (!node || !script) {
        console.log("No Indic script block found");
        return;
    }

    const conversionMap = getConversionMap(script);
    if (!conversionMap) {
        console.log(`Conversion for ${script} not yet implemented`);
        return;
    }

    const originalText = node.nodeValue;
    const itransText = convertToITRANS(originalText, conversionMap);

    // Create a new element to hold the converted text
    const wrapper = document.createElement('div');
    wrapper.className = 'itrans-converted';
    wrapper.style.backgroundColor = '#f0f0f0';
    wrapper.style.padding = '10px';
    wrapper.style.margin = '10px 0';
    wrapper.style.border = '1px solid #ccc';
    wrapper.style.borderRadius = '4px';

    // Add the script name and converted text
    wrapper.innerHTML = `<strong>[${script}]</strong> ${itransText}`;

    // Replace the original node with our new element
    node.parentNode.insertBefore(wrapper, node);
    node.parentNode.removeChild(node);

    console.log(`Converted ${script} text to ITRANS`);
}

// Run the conversion automatically when the page loads
window.addEventListener('load', function () {
    // Add a slight delay to ensure the page is fully loaded
    setTimeout(convertLargestIndicBlock, 500);
});

// Also run when DOM content is loaded as a fallback
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(convertLargestIndicBlock, 500);
});

// Observe DOM changes to handle dynamically loaded content
const observer = new MutationObserver(function (mutations) {
    // Only run if significant changes occurred
    let shouldRun = false;

    for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
            // Check if any added node might contain text
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE && node.textContent.length > 100) {
                    shouldRun = true;
                    break;
                }
            }
        }

        if (shouldRun) break;
    }

    if (shouldRun) {
        setTimeout(convertLargestIndicBlock, 500);
    }
});

// Start observing DOM changes
observer.observe(document.body, {
    childList: true,
    subtree: true
});