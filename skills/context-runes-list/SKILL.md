---
name: context-runes-list
description: Use this skill when the user asks what context-runes runes are available in the current project (e.g., "what runes do I have?", "list available runes", "what context is defined?").
---

# Context Runes List

To discover all runes registered in the current project:

```bash
crunes list
```

This reads `.context-runes/config.json` and prints all registered rune keys with their name, description, and file path.

If the project has no config yet, run `crunes init` to create one.

## Config Format

Each rune entry can be a plain path string or an object with optional metadata:

```json
{
  "runes": {
    "docs": ".context-runes/runes/docs.js",
    "api": {
      "path": ".context-runes/runes/api.js",
      "name": "API Overview",
      "description": "Summarises public API endpoints and their signatures"
    }
  }
}
```

`name` and `description` are shown as columns in `crunes list` and help users and AI agents understand what each rune provides without running it.

## Plain Output

Pass `--plain` / `-p` to get tab-separated output instead of a styled table — useful for piping or AI context:

```bash
crunes -p list
crunes -p list --format json
```

Each line: `key\tname\tdescription\tpath`
