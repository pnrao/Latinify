# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Published Extension

https://chromewebstore.google.com/detail/indic-script-to-itrans-au/hkijmljcghoacjaacifcocadkikmakeg

## What This Is

Latinify is a Chrome extension (Manifest V3) that transliterates Indic scripts to the Latin script using ITRANS conventions, and Arabic script using standard romanization, running entirely locally in the browser. Supported scripts: Arabic (Urdu, Persian, etc.), Bengali, Devanagari, Gujarati, Gurmukhi, Kannada, Malayalam, Odia, Sinhala, Tamil, Telugu.

## Development

There is no build step. Load the extension directly in Chrome:
- Open `chrome://extensions/`
- Enable "Developer mode"
- Click "Load unpacked" and select this directory

To test changes to `content.js` or `styles.css`, reload the extension at `chrome://extensions/` and refresh the target page.

## Architecture

The extension has two runtime contexts:

**Content script** (`content.js`): Injected into every page. Walks the DOM and replaces Indic text nodes in place. Uses a `MutationObserver` to handle dynamically added content. Settings are loaded from `chrome.storage.sync` at init and updated via `chrome.runtime.onMessage` when the popup changes them. Already-processed nodes are marked with `data-transliterated` attribute or `.transliterated` class to avoid re-processing.

**Popup** (`popup.html` + `popup.js`): Per-script toggles plus "Indicate Original Script" and "Show Stats" options. On change, saves to `chrome.storage.sync` and sends a `settingsChanged` message to the active tab.

**Settings keys** (stored in `chrome.storage.sync`): `arabic`, `bengali`, `devanagari`, `gujarati`, `gurmukhi`, `kannada`, `malayalam`, `odia`, `sinhala`, `tamil`, `telugu` (booleans, default `true`), `flipRtl` (boolean, default `true`), `indicateScript` (boolean, default `true`), `showStats` (boolean, default `false`), `scheme` (string `'itrans'`/`'iso'`/`'ipa'`, default `'itrans'`).

## Transliteration Logic (`content.js`)

**Maps** live in the `maps/` directory. Each script has a file (`maps/devanagari.js`, `maps/kannada.js`, etc.) that exports a `{script}Table` — a flat array of 0x80 entries indexed by `(codepoint - scriptStart)`. Each non-null entry is a 3-element array `[itrans, iso, ipa]` for the three supported romanization schemes.

`maps/indic.js` merges all ten per-script tables into a single `indicTable` (0x500 entries) covering U+0900–U+0DFF. Dispatch is via the `indicScripts` array in `content.js`: `indicScripts[(cp - 0x0900) >> 7]` gives the script descriptor (`{ key, matraStart, matraEnd, nukta, ... }`).

The active scheme index (`schemeIdx`) is derived from `settings.scheme`: `'iso'` → 1, `'ipa'` → 2, anything else → 0 (ITRANS).

The core function `appendTransliteratedChar(sourceText, i, replacementText, table, scriptStartCP, matraStart, matraEnd, nukta, schemeIdx)` handles:
- **Matras** (vowel signs): strip the implicit inherent vowel (`ₐ` or `a`) from the preceding consonant before appending the matra.
- **Nukta**: modify the preceding consonant via `handleNukta(replacementText, schemeIdx)` using the `nuktaReplacements` array (one object per scheme).
- **Virama** (`्`/`್`/`్`/`୍`): mapped to `''`, effectively joining consonants into conjuncts.

The top-level function is `transliterateToLatin` (not `transliterateToITRANS`).

When `indicateScript` is on, transliterated words are wrapped in `<span class="transliterated-{script}">` which `styles.css` underlines in a script-specific color.

## Adding a New Script

1. Create `maps/{script}.js` exporting a `{script}Table` (flat array, 0x80 entries, each `[itrans, iso, ipa]` or `null`).
2. Register it in `maps/indic.js`: add to the `sources` array in Unicode order.
3. Add a descriptor to the `indicScripts` array in `content.js` (in Unicode order): `{ key, matraStart, matraEnd, nukta }`.
4. Add a branch guard in `transliterateToLatin`'s all-scripts-disabled check.
5. Add a checkbox in `popup.html` (keep scripts in alphabetical order), wire it in `popup.js` (same order throughout).
6. Add a `.transliterated-{script}` color class in `styles.css`.
