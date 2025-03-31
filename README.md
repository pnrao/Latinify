# Latinify

Many written languages in India are hard for most Indians to understand due to their scripts. For example, many understand conversational Hindi but can't read Hindi written in the Devanagari script.

This Chrome extension helps by converting text in Indic scripts to the Latin script using the [ITRANS](https://en.wikipedia.org/wiki/ITRANS) schema.

## Supported Languages

- Devanagari (Hindi, Marathi, etc.)
- Kannada
- More coming soon...

## Features

- All transliteration is done locally. Fast.
- The goal of ITRANS is to convert Latin text faithfully to Indic scripts, whereas the goal of this extension is readability in the Latin script. At the expense of one-to-one correspondence (strict ITRANS), we prefer common conventions.
- Avoids replacements like ǝ, ~, .N, RRi, etc., making the transliterated text easier for a lay reader.
- Schwa is denoted as ₐ in Devanagari, making it easier to ignore.
- Schwa is denoted as 'a' in Kannada, as it is usually pronounced.
- Nasal signs are denoted as ⁿ or ᵐ, depending on the script and the letter.

## Limitations

- This extension does not detect the language. Doing so would require capabilities beyond a lightweight extension.
- Schwa deletion for Hindi and Marathi is left as an exercise to the reader. Sanskrit, often written in Devanagari, retains the schwa. For example, धड़कनें in Hindi could be transliterated to dhₐD**ₐ**kne (verb) or dhₐDk**ₐ**ne (noun). Without deeper linguistic analysis, it's not possible to determine which ₐ should be deleted.
- Terminal consonants in Kannada that are not affixed with a vowel sign should ideally be transliterated to 'aa', but are treated the same as non-terminal consonants.

## Privacy

- No data is collected.
- No data is sent to any remote server.
- All text replacements are done locally by the extension.
