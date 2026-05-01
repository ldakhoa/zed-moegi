import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { convertVariant } from './lib/convert.mjs';

const SRC = 'scratch/upstream';
const OUT = 'themes/moegi.json';

const VARIANTS = [
  { file: 'moegi-light-color-theme.json',         name: 'Moegi Light' },
  { file: 'moegi-light-vitesse-color-theme.json', name: 'Moegi Light Vitesse' },
  { file: 'moegi-dawn-color-theme.json',          name: 'Moegi Dawn' },
  { file: 'moegi-dark-color-theme.json',          name: 'Moegi Dark' },
  { file: 'moegi-dark-vitesse-color-theme.json',  name: 'Moegi Dark Vitesse' },
  { file: 'moegi-black-color-theme.json',         name: 'Moegi Black' },
  { file: 'moegi-black-zen-color-theme.json',     name: 'Moegi Black Zen' },
  { file: 'moegi-iris-color-theme.json',          name: 'Moegi Iris' },
  { file: 'moegi-space-color-theme.json',         name: 'Moegi Space' },
];

const themes = VARIANTS.map(v => {
  const raw = readFileSync(join(SRC, v.file), 'utf8');
  // Strip comments from JSON (both // and /* */ style)
  let cleaned = raw.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  // Strip trailing commas before closing braces/brackets
  cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
  const upstream = JSON.parse(cleaned);
  return convertVariant(upstream, v.name);
});

const family = {
  $schema: 'https://zed.dev/schema/themes/v0.2.0.json',
  name: 'Moegi',
  author: 'moegi-design (ported by ldakhoa1308)',
  themes,
};

writeFileSync(OUT, JSON.stringify(family, null, 2) + '\n');
console.log(`Wrote ${OUT} with ${themes.length} variants:`);
for (const t of themes) console.log(`  ${t.appearance.padEnd(5)} ${t.name}`);
