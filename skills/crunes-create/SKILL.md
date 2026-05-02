---
name: crunes-create
description: Use this skill when the user wants to add a new rune to their project (e.g., "create a context rune for docs", "add a new rune", "scaffold a rune for the API").
---

# Context Runes Create

To scaffold a new rune and register it in one step:

```bash
crunes create <key> --format markdown   # or --format tree
```

This creates `.crunes/runes/<key>.js` and registers it in `.crunes/config.json`.

Optionally, attach human-readable metadata so it appears in `crunes list`:

```bash
crunes create <key> --format markdown \
  --name "API Overview" \
  --description "Summarises public API endpoints and their signatures"
```

In interactive mode (`crunes create` without flags), name and description are prompted as optional fields.

To skip all prompts (e.g. from a script or AI agent), pass `--yes` / `-y` — all required fields must then be provided as flags, and optional ones are simply omitted:

```bash
crunes -y create docs --format markdown --name "Docs" --description "Project documentation overview"
```

Add `--plain` / `-p` to suppress ANSI colors in the success/error output:

```bash
crunes -y -p create docs --format markdown
```

## Config Entry Format

The rune is registered in `.crunes/config.json`. A plain path string is valid, but an object allows metadata:

```json
{
  "runes": {
    "api": {
      "path": ".crunes/runes/api.js",
      "name": "API Overview",
      "description": "Summarises public API endpoints and their signatures"
    }
  }
}
```

You can add or edit `name` and `description` directly in the config file at any time — no re-scaffolding needed.

## Rune API

The generated file uses this signature:

```js
export function generate(dir, args, utils, opts) {
  // dir          — absolute path to the project root
  // args         — string[] passed from $key=arg1,arg2
  // utils        — { md, tree, section } helpers
  // opts.sections — string[]|null — requested section names (null = all); use as a performance hint
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
