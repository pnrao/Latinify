// Pure transliteration logic — no Chrome or DOM dependencies.
// Loaded as a plain content script (globals available) and also via vm in cli.js.

var ARABIC_START          = '\u0600';
var ARABIC_END            = '\u077F';
var ARABIC_MODIFIER_START = '\u064B';
var ARABIC_MODIFIER_END   = '\u065F';

var INDIC_START = '\u0900';
var INDIC_END   = '\u0DFF';

// One entry per Indic script block, in Unicode order (index = (cp - 0x0900) >> 7).
var indicScripts = [
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

var nuktaReplacements = [
    // ITRANS (0) — ₐ-style (Devanagari/Gujarati) and a-style (other scripts)
    { 'kₐ': 'qₐ', 'khₐ': 'qhₐ', 'jₐ': 'zₐ', 'phₐ': 'fₐ',
      'kₒ': 'qₒ', 'khₒ': 'qhₒ', 'jₒ': 'zₒ', 'phₒ': 'fₒ',
      'ka': 'qa', 'kha': 'qha', 'ja': 'za', 'pha': 'fa',
      'Da': 'Ra', 'ra': 'Ra', 'la': 'La', 'sa': 'sha' },
    // ISO (1) — words like पढ़ाई use ḍa→ṛa
    { 'ka': 'qa', 'kha': 'qha', 'ja': 'za', 'pha': 'fa',
      'ḍa': 'ṛa', 'ḍha': 'ṛha', 'ra': 'ṛa', 'la': 'ḷa', 'sa': 'śa' },
    // IPA (2)
    { 'kᵃ': 'qᵃ', 'kʰᵃ': 'xᵃ', 'ɡᵃ': 'ɣᵃ', 'dʒᵃ': 'zᵃ', 'pʰᵃ': 'fᵃ',
      'ɖᵃ': 'ɽᵃ', 'ɖʱᵃ': 'ɽʱᵃ', 'rᵃ': 'ɽᵃ', 'lᵃ': 'ɭᵃ', 'sᵃ': 'ʃᵃ',
      'ka': 'qa', 'kʰa': 'xa', 'ɡa': 'ɣa', 'dʒa': 'za', 'pʰa': 'fa',
      'ɖa': 'ɽa', 'ɖʱa': 'ɽʱa', 'ra': 'ɽa', 'la': 'ɭa', 'sa': 'ʃa',
      'kᵓ': 'qᵓ', 'kʰᵓ': 'xᵓ', 'ɡᵓ': 'ɣᵓ', 'dʒᵓ': 'zᵓ', 'pʰᵓ': 'fᵓ',
      'ɖᵓ': 'ɽᵓ', 'ɖʱᵓ': 'ɽʱᵓ', 'rᵓ': 'ɽᵓ', 'lᵓ': 'ɭᵓ', 'sᵓ': 'ʃᵓ',
      'kɔ': 'qɔ', 'kʰɔ': 'xɔ', 'ɡɔ': 'ɣɔ', 'dʒɔ': 'zɔ', 'pʰɔ': 'fɔ',
      'ɖɔ': 'ɽɔ', 'ɖʱɔ': 'ɽʱɔ', 'rɔ': 'ɽɔ', 'lɔ': 'ɭɔ', 'sɔ': 'ʃɔ' },
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
        if (prev.endsWith('ₐ') || prev.endsWith('ₒ') || prev.endsWith('a') || prev.endsWith('ᵃ') || prev.endsWith('ᵓ') || prev.endsWith('ɔ')) {
            replacementText[replacementText.length - 1] = prev.slice(0, -1);
        }
    }
    replacementText.push(mapped != null ? mapped : sourceText[i]);
}

function wrapWordWithSpan(word, script) {
    return `<span class="transliterated-${script}">${word}</span>`;
}

// Transliterate text to Latin. settings keys: arabic, bengali, devanagari,
// gujarati, gurmukhi, kannada, malayalam, odia, sinhala, tamil, telugu
// (booleans), indicateScript (boolean), scheme ('itrans'|'iso'|'ipa').
function transliterateToLatin(text, settings) {
    if (!text || typeof text !== 'string') {
        return text;
    }

    // Explicitly check if all settings are false
    if (settings.bengali === false && settings.devanagari === false && settings.gujarati === false &&
        settings.gurmukhi === false && settings.kannada === false && settings.sinhala === false &&
        settings.tamil === false && settings.telugu === false && settings.odia === false &&
        settings.malayalam === false && settings.arabic === false) {
        return text;
    }

    const schemeIdx = settings.scheme === 'iso' ? 1 : settings.scheme === 'ipa' ? 2 : 0;

    let replacement = [];
    let currentScript = null;
    let currentWord = [];

    function flushCurrentWord() {
        if (currentWord.length > 0) {
            if (settings.indicateScript) {
                replacement.push(wrapWordWithSpan(currentWord.join(''), currentScript));
            } else {
                replacement.push(currentWord.join(''));
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
                    appendTransliteratedChar(text, i, currentWord, arabicTable, 0x0600, ARABIC_MODIFIER_START, ARABIC_MODIFIER_END, null, schemeIdx);
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
