# Latinify

Can you speak Hindi but struggle to read Devanagari? Understand Tamil but not the script? Follow Urdu conversations but can't read Arabic letters?

Latinify automatically converts Arabic, Bengali, Gujarati, Hindi, Kannada, Malayalam, Marathi, Nepali, Odia, Pashto, Persian, Punjabi, Sinhala, Tamil, Telugu, Urdu, and more to familiar Latin letters — on any website, instantly, without sending your data anywhere.

Works on news sites, Wikipedia, YouTube closed captions, social media, and anywhere else text appears in the browser.

## Supported Scripts

- Arabic (Urdu, Persian, Pashto, Kashmiri, etc.)
- Bengali (Bengali, Assamese, etc.)
- Devanagari (Hindi, Marathi, etc.)
- Gujarati
- Gurmukhi (Punjabi)
- Kannada
- Malayalam
- Odia
- Sinhala
- Tamil
- Telugu

## Features

- All transliteration is done locally. Fast.
- Three romanization schemes: ITRANS, ISO (15919 for Indic, 233 for Arabic), and IPA.
- For Arabic-script languages, unvowelled text (no harakat) will have short vowels missing, as they are not written. This is expected.
- On right-to-left pages, the page layout can optionally be flipped to left-to-right. This is best-effort and some elements may remain RTL.

### ITRANS scheme

- At the expense of one-to-one correspondence (strict ITRANS), we prefer common conventions.
- Avoids replacements like ǝ , ɔ , ~, .N, RRi, etc., making the transliterated text easier for a lay reader.
- Schwa is denoted as ₐ in Devanagari and Gujarati, making it easier to ignore.
- Schwa is denoted as 'a' in Gurmukhi, Kannada, Malayalam, Odia, Telugu, as it is usually pronounced.
- In Bengali, the inherent vowel is ɔ, not ə. It is denoted as ₒ.
- Long vowels are denoted with uppercase: Examples: rAma (राम, ರಾಮ), sItA (सीता, ಸೀತಾ), Enu/En (ಏನು, ஏன்), ODu (ಓಡು, ஓடு).
- Nasal signs are denoted as ⁿ or ᵐ, depending on the script and the letter.

### ISO scheme

- For Indic scripts, follows ISO 15919. The inherent vowel in consonants is written as plain `a` (e.g., `ka`), as the standard prescribes — contrast with `kₐ` in ITRANS and `kᵃ` in IPA.
- For Arabic-script languages, follows ISO 233 and its extensions.

### IPA scheme

- Aims for phonetic accuracy rather than lay readability.
- The inherent vowel uses a modifier symbol rather than a full IPA vowel when it is frequently dropped and its elision is unpredictable: `ᵃ` (modifier a) for Devanagari, Gujarati, and Gurmukhi; `ᵓ` (modifier open-o) for /ɔ/ in Bengali.
- When the inherent vowel is consistently pronounced, the full symbol is used: `ɔ` for Odia, `a` for Sinhala, Tamil, Telugu, Kannada, and Malayalam.
- Short i, u, and the inherent schwa are written as `i`, `u`, and `a`, not `ɪ`, `ʊ`, and `ə`. Vowel quality distinctions (centralized/lowered vs close, mid-central vs open) are language-dependent and inconsistently applied even in academic sources; length (`iː`, `uː`, `aː`) is what matters cross-linguistically.

## Limitations

- This extension does not detect the language. Doing so would require capabilities beyond a lightweight extension.
- Schwa deletion for Bengali, Hindi and Marathi is left as an exercise to the reader. Sanskrit, often written in Devanagari, retains the schwa. For example, in Hindi, धड़कने → dhaD**a**kne (verb) or धड़कनें → dhaDk**a**neⁿ (noun). Without deeper linguistic analysis, it's not possible to determine which ₐ of धड़क should be deleted.
- Terminal consonants in Kannada that are not affixed with a vowel sign should ideally be transliterated to 'A', but are treated the same as non-terminal consonants.
- There is no straightforward way to map anusvaras. They are sometimes pronounced as nasal vowels (आँखें), or 'n' (चिंता, ఉంది), or 'ŋ' (अंकुर, తెలంగాణ), or 'm' (संभव, దేశం), or dropped entirely (हैं in casual speech).

## Requesting More Scripts

If you'd like support for additional scripts, open an issue on GitHub.

## Privacy

- No data is collected.
- No data is sent to any remote server.
- All text replacements are done locally by the extension.
