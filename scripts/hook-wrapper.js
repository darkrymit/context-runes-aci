'use strict';

const { spawnSync } = require('child_process');

let stdinData = '';
process.stdin.on('data', chunk => (stdinData += chunk));
process.stdin.on('end', () => {
  try {
    main(stdinData);
  } catch (err) {
    process.stderr.write(`[context-runes] Fatal: ${err.message}\n`);
    emit('');
  }
});

function main(raw) {
  let prompt = '';
  try {
    const input = JSON.parse(raw);
    prompt = input.prompt || '';
  } catch {
    // stdin not JSON or empty — no tokens to parse
  }

  const xmlBlocks = [];

  // Matches $key or $key(arg1, arg2)
  const tokenRegex = /\$([\w-]+)(?:\(([^)]*)\))?/g;
  let match;

  while ((match = tokenRegex.exec(prompt)) !== null) {
    const key = match[1];
    const rawArgs = match[2] || '';
    const args = rawArgs.split(',').map(a => a.trim()).filter(Boolean);

    const result = spawnSync('crunes', ['query', key, ...args, '--format', 'json'], {
      encoding: 'utf8',
      cwd: process.cwd(),
      shell: true,
    });

    if (result.error || result.status !== 0) {
      process.stderr.write(
        `[context-runes] Enricher "${key}" failed: ${result.stderr || (result.error && result.error.message) || 'unknown error'}\n`
      );
      continue;
    }

    let sections;
    try {
      sections = JSON.parse(result.stdout);
    } catch (err) {
      process.stderr.write(`[context-runes] Enricher "${key}" returned invalid JSON: ${err.message}\n`);
      continue;
    }

    if (!Array.isArray(sections)) {
      process.stderr.write(`[context-runes] Enricher "${key}" returned unexpected JSON shape\n`);
      continue;
    }

    for (const section of sections) {
      const block = renderSectionToXml(section);
      if (block) xmlBlocks.push(block);
    }
  }

  emit(xmlBlocks.join('\n\n'));
}

function renderSectionToXml(section) {
  const content = renderData(section.data);
  const trimmed = content && content.replace(/^(\r?\n)+|(\r?\n)+$/g, '');
  if (!trimmed) return null;

  // Build attribute string: title comes first (if present), then attrs
  const allAttrs = {};
  if (section.title) allAttrs.title = section.title;
  if (section.attrs) Object.assign(allAttrs, section.attrs);

  const attrStr = Object.entries(allAttrs)
    .map(([k, v]) => `${k}="${String(v).replace(/"/g, '&quot;')}"`)
    .join(' ');

  const name = section.name || 'context';
  const openTag = attrStr ? `<${name} ${attrStr}>` : `<${name}>`;
  return `${openTag}\n${trimmed}\n</${name}>`;
}

function renderData(data) {
  if (!data) return null;
  if (data.type === 'markdown') return data.content ?? null;
  if (data.type === 'tree') return renderTree(data.root);
  return null;
}

function renderTree(root) {
  if (!root) return null;
  const lines = [`${root.name.padEnd(12)}${root.description}`];
  appendChildren(root.children || [], '', lines);
  return lines.join('\n');
}

function appendChildren(children, prefix, lines) {
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const isLast = i === children.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const childPrefix = prefix + (isLast ? '    ' : '│   ');
    lines.push(`${prefix}${connector}${child.name.padEnd(12)}${child.description}`);
    appendChildren(child.children || [], childPrefix, lines);
  }
}

function emit(additionalContext) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext,
    },
  }));
}
