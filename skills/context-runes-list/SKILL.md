---
name: Context Runes List
description: Use this skill when the user asks what context-runes enrichers are available in the current project (e.g., "what runes do I have?", "list available enrichers", "what context is defined?").
version: 1.0.0
---

# Context Runes List

To discover all enrichers registered in the current project:

```bash
crunes list
```

This reads `.context-runes/config.json` and prints all registered enricher keys with their name, description, and file path.

If the project has no config yet, run `crunes init` to create one.

## Config Format

Each enricher entry can be a plain path string or an object with optional metadata:

```json
{
  "enrichers": {
    "docs": ".context-runes/enrichers/docs.js",
    "api": {
      "path": ".context-runes/enrichers/api.js",
      "name": "API Overview",
      "description": "Summarises public API endpoints and their signatures"
    }
  }
}
```

`name` and `description` are shown as columns in `crunes list` and help users and AI agents understand what each enricher provides without running it.

## JSON Output

Use `--format json` to get a machine-readable array:

```bash
crunes list --format json
```

Each entry has the shape `{ key, path, name, description }` (name and description are `null` when not set).

## Plain Output

Pass `--plain` / `-p` to get tab-separated output instead of a styled table — useful for piping or AI context:

```bash
crunes -p list
crunes -p list --format json
```

Each line: `key\tname\tdescription\tpath`
