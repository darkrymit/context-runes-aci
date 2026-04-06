---
name: context-runes-use
description: Do NOT use when a prompt contains $key or $key=args or $key::section tokens — in Claude Code those are already resolved by the UserPromptSubmit hook and injected as context before the message arrives. Use ONLY when the user explicitly says to use or fetch a rune directly (e.g., "use the docs rune", "run crunes", "fetch rune output") or when you want to inspect rune output mid-conversation.
---

# Context Runes Use

To fetch the output of a rune manually:

```bash
crunes use <key-token> [-a <key-token>]...
```

## Key Token Format

```
key[=arg1,arg2][::section1,section2]
```

| Separator | Meaning |
|-----------|---------|
| `=` | Args (comma-separated) |
| `::` | Section filter (comma-separated) |
| `:` | Plugin key separator only (e.g. `my-plugin:runeKey`) |

**Examples:**

- `crunes use docs` — fetch all sections from the `docs` rune
- `crunes use api=v2` — pass `v2` as an argument to the `api` rune
- `crunes use api=v2::endpoints` — pass arg and only return the `endpoints` section
- `crunes use api::endpoints,errors` — section filter with no args
- `crunes use api=v2 -a git -a env::vars` — batch: three runes in one call

## Batch Use

Use `-a` to use multiple runes in a single invocation:

```bash
crunes use structure -a git -a env
crunes use api=v2::endpoints -a git::commits --format json
```

All sections are returned in order, combined into one output.

## Output Format

```bash
crunes use docs                  # markdown (default)
crunes use docs --format json    # JSON Section[] array
crunes -p use docs               # plain output (no ANSI)
```

## ACI Token Syntax

In prompts, tokens are resolved automatically by the `UserPromptSubmit` hook:

```
$key                      all sections
$key=arg1,arg2            with args
$key::section             section filter
$key=arg1::section1,section2  args + section filter
my-plugin:runeKey=arg     plugin rune with args
```

Use this skill only when the user explicitly asks to inspect rune output mid-conversation.

## Error Flags

```bash
crunes use api -a missing --fail-fast   # stop on first error
crunes use api -a missing               # default: run all, exit 1 if any failed
```
