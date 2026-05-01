const UI_MAP = {
  // Core editor
  'editor.background': 'editor.background',
  'editor.foreground': 'editor.foreground',
  'editor.lineHighlightBackground': 'editor.active_line.background',
  'editor.selectionBackground': 'editor.selection.background',
  'editor.findMatchBackground': 'search.match_background',
  'editorLineNumber.foreground': 'editor.line_number',
  'editorLineNumber.activeForeground': 'editor.active_line_number',
  'editorCursor.foreground': 'editor.cursor',
  'editorIndentGuide.background': 'editor.indent_guide',
  'editorIndentGuide.activeBackground': 'editor.indent_guide_active',
  'editorWhitespace.foreground': 'editor.invisible',
  'editorBracketMatch.background': 'editor.document_highlight.read_background',

  // Surfaces
  'panel.background': 'panel.background',
  'panel.border': 'border',
  'sideBar.background': 'panel.background',
  'titleBar.activeBackground': 'title_bar.background',
  'statusBar.background': 'status_bar.background',
  'statusBar.foreground': 'text',
  'tab.activeBackground': 'tab_bar.background',
  'tab.inactiveBackground': 'tab.inactive_background',
  'tab.activeForeground': 'tab.active_foreground',
  'tab.inactiveForeground': 'tab.inactive_foreground',
  'editorGroupHeader.tabsBackground': 'tab_bar.background',
  'scrollbarSlider.background': 'scrollbar.thumb.background',
  'scrollbarSlider.hoverBackground': 'scrollbar.thumb.hover_background',

  // Text & accents
  'foreground': 'text',
  'descriptionForeground': 'text.muted',
  'errorForeground': 'error',
  'focusBorder': 'border.focused',

  // Git
  'gitDecoration.modifiedResourceForeground': 'version_control.modified',
  'gitDecoration.addedResourceForeground': 'version_control.added',
  'gitDecoration.deletedResourceForeground': 'version_control.deleted',
  'gitDecoration.untrackedResourceForeground': 'version_control.added',
  'gitDecoration.ignoredResourceForeground': 'version_control.ignored',
  'gitDecoration.conflictingResourceForeground': 'version_control.conflict',

  // Terminal ANSI
  'terminal.foreground': 'terminal.foreground',
  'terminal.background': 'terminal.background',
  'terminal.ansiBlack': 'terminal.ansi.black',
  'terminal.ansiRed': 'terminal.ansi.red',
  'terminal.ansiGreen': 'terminal.ansi.green',
  'terminal.ansiYellow': 'terminal.ansi.yellow',
  'terminal.ansiBlue': 'terminal.ansi.blue',
  'terminal.ansiMagenta': 'terminal.ansi.magenta',
  'terminal.ansiCyan': 'terminal.ansi.cyan',
  'terminal.ansiWhite': 'terminal.ansi.white',
  'terminal.ansiBrightBlack': 'terminal.ansi.bright_black',
  'terminal.ansiBrightRed': 'terminal.ansi.bright_red',
  'terminal.ansiBrightGreen': 'terminal.ansi.bright_green',
  'terminal.ansiBrightYellow': 'terminal.ansi.bright_yellow',
  'terminal.ansiBrightBlue': 'terminal.ansi.bright_blue',
  'terminal.ansiBrightMagenta': 'terminal.ansi.bright_magenta',
  'terminal.ansiBrightCyan': 'terminal.ansi.bright_cyan',
  'terminal.ansiBrightWhite': 'terminal.ansi.bright_white',
};

export function convertUI(vscodeColors) {
  const out = {};
  for (const [vk, zk] of Object.entries(UI_MAP)) {
    if (vscodeColors[vk] != null) out[zk] = vscodeColors[vk];
  }
  return out;
}

const SYNTAX_MAP = [
  { zed: 'comment', scopes: ['comment'] },
  { zed: 'comment.doc', scopes: ['comment.block.documentation'] },
  { zed: 'string', scopes: ['string', 'string.quoted'] },
  { zed: 'string.escape', scopes: ['constant.character.escape'] },
  { zed: 'string.regex', scopes: ['string.regexp'] },
  { zed: 'number', scopes: ['constant.numeric'] },
  { zed: 'boolean', scopes: ['constant.language.boolean'] },
  { zed: 'constant', scopes: ['constant.language', 'support.constant'] },
  { zed: 'keyword', scopes: ['keyword', 'keyword.control'] },
  { zed: 'operator', scopes: ['keyword.operator'] },
  { zed: 'function', scopes: ['entity.name.function', 'meta.function-call', 'support.function'] },
  { zed: 'function.method', scopes: ['entity.name.function.member'] },
  { zed: 'type', scopes: ['entity.name.type', 'support.type', 'storage.type'] },
  { zed: 'type.builtin', scopes: ['support.type.primitive'] },
  { zed: 'variable', scopes: ['variable', 'variable.other'] },
  { zed: 'variable.special', scopes: ['variable.language.this', 'variable.language.self'] },
  { zed: 'property', scopes: ['variable.other.property', 'meta.object-literal.key'] },
  { zed: 'tag', scopes: ['entity.name.tag'] },
  { zed: 'attribute', scopes: ['entity.other.attribute-name'] },
  { zed: 'punctuation', scopes: ['punctuation'] },
  { zed: 'punctuation.bracket', scopes: ['punctuation.section.brackets', 'punctuation.section.braces', 'punctuation.section.parens'] },
  { zed: 'punctuation.delimiter', scopes: ['punctuation.separator', 'punctuation.terminator'] },
  { zed: 'link_text', scopes: ['markup.underline.link'] },
  { zed: 'link_uri', scopes: ['markup.underline.link'] },
  { zed: 'emphasis', scopes: ['markup.italic'] },
  { zed: 'emphasis.strong', scopes: ['markup.bold'] },
  { zed: 'title', scopes: ['markup.heading'] },
  { zed: 'embedded', scopes: ['meta.embedded'] },
  { zed: 'preproc', scopes: ['meta.preprocessor'] },
  { zed: 'hint', scopes: ['entity.name.label'] },
];

function findRule(tokenColors, scope) {
  for (const rule of tokenColors) {
    const ruleScopes = Array.isArray(rule.scope) ? rule.scope : (rule.scope ? [rule.scope] : []);
    if (ruleScopes.some(s => s.split(',').map(x => x.trim()).includes(scope))) {
      return rule;
    }
  }
  return null;
}

function styleFromRule(rule) {
  const style = {};
  if (rule.settings.foreground) style.color = rule.settings.foreground;
  if (rule.settings.fontStyle) {
    const fs = rule.settings.fontStyle;
    if (fs.includes('italic')) style.font_style = 'italic';
    if (fs.includes('bold')) style.font_weight = 700;
  }
  return style;
}

export function convertSyntax(tokenColors) {
  const out = {};
  for (const { zed, scopes } of SYNTAX_MAP) {
    for (const scope of scopes) {
      const rule = findRule(tokenColors, scope);
      if (rule && rule.settings.foreground) {
        out[zed] = styleFromRule(rule);
        break;
      }
    }
  }
  return out;
}

export function convertVariant(vscodeTheme, name) {
  const ui = convertUI(vscodeTheme.colors || {});
  const syntax = convertSyntax(vscodeTheme.tokenColors || []);
  const fg = ui['editor.foreground'] || '#000000';

  // Players: cycle accent colors. Player 0 is local cursor.
  const accents = [
    syntax.keyword?.color,
    syntax.function?.color,
    syntax.string?.color,
    syntax.type?.color,
    syntax.number?.color,
    syntax.tag?.color,
    syntax.attribute?.color,
    syntax.constant?.color,
  ].filter(Boolean);
  const players = Array.from({ length: 8 }, (_, i) => {
    const c = accents[i % Math.max(accents.length, 1)] || fg;
    return { cursor: c, background: c, selection: c + '33' };
  });

  return {
    name,
    appearance: vscodeTheme.type === 'light' ? 'light' : 'dark',
    style: {
      ...ui,
      'editor.foreground': fg,
      predictive: fg + '66',
      players,
      syntax,
    },
  };
}
