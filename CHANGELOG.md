# Changelog

## 1.5 - unreleased

- NEW: Bengali script
- NEW: Gujarati script
- NEW: Gurmukhi script
- NEW: Malayalam script
- NEW: Sinhala script
- NEW: Tamil script
- CHANGE: Velar nasal (ङ, ங, etc.) now rendered as ŋ instead of nga
- CHANGE: Vocalic R and L (ऋ, ऌ, etc.) now rendered as ri/li instead of RRi/LLi
- FIX: Telugu vocalic R matra (ృ) was not being transliterated
- FIX: unmapped rarely used characters

## 1.4 - 2025-11-27

- NEW: Odia script
- NEW: Toggle for squiggly lines (decoration)
- CHANGE: Reduced stats overlay timeout to 500ms
- CHANGE: Solid lines instead of squiggly, to reduce visual noise
- FIX: race condition that forced transliteration on static sites

## 1.3 - 2025-11-19

- NEW: Performance overlay to track transliteration time (toggleable in popup)
- NEW: squiggly underlines to indicate the original script
- NEW: Telugu script
- CHANGE: Transliteration modularized to accommodate more scripts
- FIX: Page freeze/infinite loop on dynamic sites (e.g. Twitter)
- FIX: "Receiving end does not exist" error in popup

## 1.2 - 2025-04-01

- CHANGE: Transliteration logic
- FIX: Handling of nukta
- FIX: Edge cases caused by modern punctuation

## 1.1 - 2025-03-20

- NEW: Settings to toggle per-script transliteration
- CHANGE: Icon to be vivid
- FIX: Handling of chandra

## 1.0 - 2025-03-11

- Initial release of the transliteration script for Devanagari and Kannada scripts.
