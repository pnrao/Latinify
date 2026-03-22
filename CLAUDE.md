# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Published Extension

https://chromewebstore.google.com/detail/indic-script-to-itrans-au/hkijmljcghoacjaacifcocadkikmakeg

## What This Is

Latinify is a Chrome extension (Manifest V3) that transliterates Indic scripts to the Latin script using ITRANS notation, running entirely locally in the browser. Supported scripts: Devanagari, Kannada, Malayalam, Odia, Telugu.

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

**Settings keys** (stored in `chrome.storage.sync`): `devanagari`, `kannada`, `malayalam`, `odia`, `telugu` (booleans, default `true`), `indicateScript` (boolean, default `true`), `showStats` (boolean, default `false`).

## Transliteration Logic (`content.js`)

Each script has a Unicode range and a mapping object (`devanagariToITRANS`, `kannadaToITRANS`, etc.). The core function is `appendTransliteratedChar`, which handles:
- **Matras** (vowel signs): strip the implicit inherent vowel (`ₐ` or `a`) from the preceding consonant before appending the matra.
- **Nukta**: modify the preceding consonant via `handleNukta` (e.g., `jₐ` → `zₐ`).
- **Virama** (`्`/`್`/`్`/`୍`): mapped to `''`, effectively joining consonants into conjuncts.

When `indicateScript` is on, transliterated words are wrapped in `<span class="transliterated-{script}">` which `styles.css` underlines in a script-specific color.

## Adding a New Script

1. Define Unicode range constants (`_START`, `_END`, `_MODIFIER_START`, `_MODIFIER_END`, `_NUKTA`).
2. Add a mapping object `{script}ToITRANS`.
3. Add a branch in `transliterateToITRANS` and in `initTransliteration`'s settings guard.
4. Add a checkbox in `popup.html` (keep scripts in alphabetical order), wire it in `popup.js` (same order throughout).
5. Add a `.transliterated-{script}` color class in `styles.css`.
