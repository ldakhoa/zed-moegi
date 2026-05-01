# Moegi for Zed

A port of the [Moegi VSCode theme](https://github.com/moegi-design/vscode-theme) to [Zed](https://zed.dev). All nine variants included.

## Variants

| Light                | Dark                  |
| -------------------- | --------------------- |
| Moegi Light          | Moegi Dark            |
| Moegi Light Vitesse  | Moegi Dark Vitesse    |
| Moegi Dawn           | Moegi Black           |
| Moegi Iris           | Moegi Black Zen       |
|                      | Moegi Space           |

## Install

### From the Zed extension registry

(Once published) Open the Extensions panel (`cmd+shift+x`), search for `Moegi`, click Install.

### As a development extension

```bash
git clone https://github.com/ldakhoa1308/zed-moegi.git
```

Then in Zed: Extensions panel → `Install Dev Extension` → select the cloned directory.

## Regenerating themes from upstream

The committed `themes/moegi.json` is generated from upstream VSCode theme files by `scripts/build-themes.mjs`. To resync:

```bash
mkdir -p scratch/upstream
BASE="https://raw.githubusercontent.com/moegi-design/vscode-theme/main/themes"
for f in moegi-black-color-theme moegi-black-zen-color-theme moegi-dark-color-theme moegi-dark-vitesse-color-theme moegi-dawn-color-theme moegi-iris-color-theme moegi-light-color-theme moegi-light-vitesse-color-theme moegi-space-color-theme; do
  curl -fsSL "$BASE/$f.json" -o "scratch/upstream/$f.json"
done
node scripts/build-themes.mjs
```

Tests: `node --test scripts/lib/convert.test.mjs`.

## Credit & license

- Original theme: [moegi-design/vscode-theme](https://github.com/moegi-design/vscode-theme)
- Zed port: ldakhoa1308
- License: MIT (see `LICENSE`)
