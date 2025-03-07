# latinify

Many written languages in India are hard for most Indians to understand due to their scripts. For example, many understand conversational Hindi but can't read Hindi written in Devanagari script.

This Chrome extension helps by converting text in Indic scripts to ITRANS.

## Supported Languages

- Devanagari (Hindi, Marathi, etc.)
- Kannada
- More coming soon...

## Features

- Avoids replacements like ǝ, ~, .N, RRi, etc., making the transliterated text easier for a lay reader.
- Schwa is denoted as ₐ in Devanagari, making it easier to ignore.
- Schwa is denoted as 'a' in Kannada, as it is usually pronounced.
- Nasal signs are denoted as ⁿ or ᵐ, depending on the script and the letter.

## Limitations

- This extension does not detect the language. Doing so would require capabilities beyond a lightweight extension.
- Schwa deletion for Hindi and Marathi is left as an exercise to the reader. For example, धड़कनें could be transliterated to dhₐDₐkne (verb) or dhₐDkₐne (noun). Without deeper linguistic analysis, it's not possible to determine which ₐ should be deleted. Sanskrit, usually written in Devanagari, retains the schwa.
- Terminal consonants in Kannada that are not affixed with a vowel sign should ideally be transliterated to 'aa', but are treated the same as non-terminal consonants.
