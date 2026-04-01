---
name: Context Runes Query
description: Use this skill when the user explicitly asks to fetch or inspect the output of a specific context-runes enricher mid-conversation (e.g., "query the docs enricher", "fetch context for api"). If you are Claude Code: do NOT trigger this skill just because a prompt contains $key(args) tokens — those are resolved automatically by the UserPromptSubmit hook before reaching the LLM.
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
