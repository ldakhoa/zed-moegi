import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convertUI, convertSyntax, convertVariant } from './convert.mjs';

test('convertUI maps editor.background and editor.foreground', () => {
  const result = convertUI({
    'editor.background': '#ffffff',
    'editor.foreground': '#222222',
  });
  assert.equal(result['editor.background'], '#ffffff');
  assert.equal(result['editor.foreground'], '#222222');
});

test('convertUI maps terminal ANSI colors', () => {
  const result = convertUI({
    'terminal.ansiRed': '#ff0000',
    'terminal.ansiBrightBlue': '#0000ff',
  });
  assert.equal(result['terminal.ansi.red'], '#ff0000');
  assert.equal(result['terminal.ansi.bright_blue'], '#0000ff');
});

test('convertUI omits keys not in the mapping table', () => {
  const result = convertUI({
    'editor.background': '#fff',
    'someUnmappedKey': '#000',
  });
  assert.equal(result['editor.background'], '#fff');
  assert.equal(result['someUnmappedKey'], undefined);
});

test('convertSyntax maps comment scope to Zed comment token', () => {
  const result = convertSyntax([
    { scope: 'comment', settings: { foreground: '#888888', fontStyle: 'italic' } },
  ]);
  assert.deepEqual(result.comment, { color: '#888888', font_style: 'italic' });
});

test('convertSyntax handles array scope and comma-separated scope strings', () => {
  const result = convertSyntax([
    { scope: ['keyword.control', 'keyword.other'], settings: { foreground: '#aabbcc' } },
    { scope: 'string, string.quoted', settings: { foreground: '#ddeeff' } },
  ]);
  assert.equal(result.keyword.color, '#aabbcc');
  assert.equal(result.string.color, '#ddeeff');
});

test('convertSyntax preserves bold via font_weight', () => {
  const result = convertSyntax([
    { scope: 'markup.bold', settings: { foreground: '#000', fontStyle: 'bold' } },
  ]);
  assert.equal(result['emphasis.strong'].font_weight, 700);
});

test('convertSyntax picks the most general scope when multiple rules match', () => {
  // Both 'string' and 'string.quoted' map to Zed 'string'. Order in SYNTAX_MAP
  // puts 'string' first, so it wins.
  const result = convertSyntax([
    { scope: 'string.quoted', settings: { foreground: '#222' } },
    { scope: 'string', settings: { foreground: '#111' } },
  ]);
  assert.equal(result.string.color, '#111');
});

test('convertVariant assembles a full Zed theme entry', () => {
  const upstream = {
    name: 'Moegi Light',
    type: 'light',
    colors: { 'editor.background': '#fafafa', 'editor.foreground': '#333' },
    tokenColors: [
      { scope: 'comment', settings: { foreground: '#888', fontStyle: 'italic' } },
    ],
  };
  const result = convertVariant(upstream, 'Moegi Light');
  assert.equal(result.name, 'Moegi Light');
  assert.equal(result.appearance, 'light');
  assert.equal(result.style['editor.background'], '#fafafa');
  assert.equal(result.style.syntax.comment.color, '#888');
});

test('convertSyntax does not crash on rules without settings', () => {
  const result = convertSyntax([
    { name: 'Section header', scope: 'comment' },
    { scope: 'comment', settings: { foreground: '#999' } },
  ]);
  assert.equal(result.comment.color, '#999');
});

test('convertSyntax skips bold-only rules and finds later rule with foreground', () => {
  const result = convertSyntax([
    { scope: 'keyword', settings: { fontStyle: 'bold' } },
    { scope: 'keyword', settings: { foreground: '#abc' } },
  ]);
  assert.equal(result.keyword.color, '#abc');
});

test('convertVariant handles 3-digit hex by expanding before appending alpha', () => {
  const upstream = {
    type: 'dark',
    colors: { 'editor.foreground': '#abc' },
    tokenColors: [{ scope: 'keyword', settings: { foreground: '#fff' } }],
  };
  const result = convertVariant(upstream, 'X');
  assert.equal(result.style.predictive, '#aabbcc66');
  assert.equal(result.style.players[0].selection, '#ffffff33');
});
