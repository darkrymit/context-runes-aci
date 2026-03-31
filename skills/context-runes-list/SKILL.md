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

This reads `.context-runes/config.json` and prints all registered enricher keys with their file paths.

If the project has no config yet, run `crunes init` to create one.
