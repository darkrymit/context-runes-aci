---
name: Context Runes Create
description: Use this skill when the user wants to add a new enricher to their project (e.g., "create a context rune for docs", "add a new enricher", "scaffold an enricher for the API").
version: 1.0.0
---

# Context Runes Create

To scaffold a new enricher and register it in one step:

```bash
crunes create <key> --format markdown   # or --format tree
```

This creates `.context-runes/enrichers/<key>.js` and registers it in `.context-runes/config.json`.

## Enricher API

The generated file uses this signature:

```js
export function generate(dir, args, utils) {
  // dir   — absolute path to the project root
  // args  — string[] passed from $key(arg1, arg2)
  // utils — { md, tree, section } helpers
}
```

## Return Formats

**Markdown** — freeform markdown string:

```js
return { type: 'markdown', content: utils.md.h3('Title') + utils.md.ul(['item']) };
```

**Tree** — hierarchical ASCII tree:

```js
return { type: 'tree', root: utils.tree.node('root', 'description', [
  utils.tree.node('child', 'child description'),
]) };
```

**Multiple sections** — return an array to emit multiple named context blocks:

```js
return [
  utils.section('context', data, { title: 'Section Title', attrs: { id: 'value' } }),
];
```
