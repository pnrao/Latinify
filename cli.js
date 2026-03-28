#!/usr/bin/env node
// Latinify CLI — transliterate Indic/Arabic script text to Latin
// Usage:
//   echo "नमस्ते" | node cli.js
//   node cli.js --scheme iso "नमस्ते"
//   node cli.js --no-arabic --scheme ipa < file.txt

import { readFileSync } from 'fs';
import { createContext, runInContext } from 'vm';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load map files and shared transliteration logic into a VM context.
// This mirrors the browser's content-script load order in manifest.json.
const sandbox = {};
const ctx = createContext(sandbox);

for (const name of ['devanagari', 'bengali', 'gurmukhi', 'gujarati', 'odia',
                     'tamil', 'telugu', 'kannada', 'malayalam', 'sinhala', 'arabic']) {
    runInContext(readFileSync(join(__dirname, `maps/${name}.js`), 'utf8'), ctx);
}
runInContext(readFileSync(join(__dirname, 'maps/indic.js'), 'utf8'), ctx);
runInContext(readFileSync(join(__dirname, 'transliterate.js'), 'utf8'), ctx);

const { transliterateToLatin } = sandbox;

// --- CLI argument parsing ---

const ALL_SCRIPTS = ['arabic', 'bengali', 'devanagari', 'gujarati', 'gurmukhi',
                     'kannada', 'malayalam', 'odia', 'sinhala', 'tamil', 'telugu'];

function parseArgs(argv) {
    const settings = Object.fromEntries(ALL_SCRIPTS.map(s => [s, true]));
    let scheme = 'itrans';
    const positional = [];

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--itrans' || arg === '--iso' || arg === '--ipa') {
            scheme = arg.slice(2);
        } else if (arg.startsWith('--no-')) {
            const script = arg.slice(5);
            if (!(script in settings)) {
                console.error(`Unknown script: ${script}`);
                process.exit(1);
            }
            settings[script] = false;
        } else if (arg === '--help' || arg === '-h') {
            console.log([
                'Usage: node cli.js [OPTIONS] [TEXT]',
                '       echo TEXT | node cli.js [OPTIONS]',
                '',
                'Options:',
                '  --itrans | --iso | --ipa  Romanization scheme (default: itrans)',
                `  --no-<script>             Disable a script (${ALL_SCRIPTS.join(', ')})`,
                '  -h, --help                Show this help',
            ].join('\n'));
            process.exit(0);
        } else {
            positional.push(arg);
        }
    }

    return { settings: { ...settings, scheme }, text: positional.join(' ') || null };
}

async function main() {
    const { settings, text: argText } = parseArgs(process.argv.slice(2));

    let input;
    if (argText) {
        input = argText;
    } else {
        const chunks = [];
        for await (const chunk of process.stdin) chunks.push(chunk);
        input = Buffer.concat(chunks).toString('utf8');
    }

    const lines = input.split('\n');
    // strip trailing newline added by most shells
    if (lines.at(-1) === '') lines.pop();

    for (const line of lines) {
        process.stdout.write(transliterateToLatin(line, settings) + '\n');
    }
}

main().catch(err => { console.error(err.message); process.exit(1); });
