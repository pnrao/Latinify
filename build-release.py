#!/usr/bin/env python3
"""Generate Chrome Web Store assets: plain-text description and extension zip."""

import json
import os
import re
import sys
import zipfile

def convert(text):
    lines = []
    for line in text.splitlines():
        # Headings → UPPERCASE
        m = re.match(r'^#{1,6}\s+(.*)', line)
        if m:
            lines.append(m.group(1).upper())
            continue

        # Bullet - → •
        line = re.sub(r'^- ', '• ', line)

        # Strip **bold**
        line = re.sub(r'\*\*(.+?)\*\*', r'\1', line)

        # Strip [text](url) → text
        line = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', line)

        lines.append(line)

    return '\n'.join(lines)

src = sys.argv[1] if len(sys.argv) > 1 else 'README.md'
root = os.path.dirname(os.path.abspath(src))

# Store description
with open(src) as f:
    text = f.read()

basename = os.path.splitext(os.path.basename(src))[0] + '.txt'
desc_path = os.path.join('/tmp', basename)
with open(desc_path, 'w') as f:
    f.write(convert(text))
print(desc_path)

# Extension zip
with open(os.path.join(root, 'manifest.json')) as f:
    version = json.load(f)['version']

zip_name = f'latinify-{version}.zip'
zip_path = os.path.join('/tmp', zip_name)

EXTENSION_FILES = [
    'manifest.json',
    'content.js',
    'popup.html',
    'popup.js',
    'styles.css',
]

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    for name in EXTENSION_FILES:
        zf.write(os.path.join(root, name), name)
    images_dir = os.path.join(root, 'images')
    for img in os.listdir(images_dir):
        zf.write(os.path.join(images_dir, img), os.path.join('images', img))

print(zip_path)
