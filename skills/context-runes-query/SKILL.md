---
name: Context Runes Query
description: Do NOT use when a prompt contains $key(args) tokens (e.g., $m(chat)) — in Claude Code those are already resolved by the UserPromptSubmit hook and injected as context before the message arrives. Use ONLY when the user explicitly says to query or fetch an enricher/rune directly (e.g., "query the docs enricher", "run crunes", "fetch enricher output") or when you want to inspect enricher/rune output mid-conversation.
version: 1.0.0
---

# Context Runes Query

To fetch the output of an enricher manually:

```bash
crunes query <key> [arg1 arg2 ...]
```

**Examples:**

- `crunes query docs` — fetch the default output for the `docs` enricher
- `crunes query api v2` — pass `v2` as an argument to the `api` enricher

In Claude Code, `$key(args)` tokens in prompts are resolved automatically by the `UserPromptSubmit` hook. Use this skill only when the user explicitly asks to inspect enricher output mid-conversation.

## Plain Output

Pass `--plain` / `-p` to suppress ANSI colors in error/info messages — useful when capturing output in AI context:

```bash
crunes -p query docs
crunes -p query api --format json
```
