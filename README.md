# context-runes-aci

Claude Code ACI (Agentic Coder Interface) plugin for [context-runes](https://github.com/darkrymit/context-runes). Intercepts `UserPromptSubmit` events, resolves `$key(args)` tokens in prompts, and injects enricher output as XML `additionalContext` before the LLM sees your message.

## Prerequisites

The plugin delegates all enricher logic to the CLI. Install it first:

```bash
npm install -g @darkrymit/context-runes
```

Verify it is in your PATH:

```bash
crunes --version
```

## Installation

```bash
/plugin marketplace add https://github.com/darkrymit/context-runes-aci
/plugin install context-runes-aci
```

Claude Code registers the hook automatically. Run `/reload-plugins` to activate in the current session.

## Usage

With the plugin active, any `$key` or `$key(arg1, arg2)` token in your prompt triggers a context lookup:

```
Review the $docs setup section
Explain the $api(v2) auth flow
```

The hook resolves each token by calling `crunes query <key> [args...] --format json`, then wraps each returned section in an XML block:

```xml
<context title="Setup Guide" id="setup">
### Install
1. Clone the repo
2. npm install
</context>
```

This XML is appended as `additionalContext` — invisible to you, but available to the LLM.

## Project Setup

Enrichers live in your project, not in the plugin. In each project you want to use context-runes:

```bash
crunes init
crunes create docs --format markdown
```

See [@darkrymit/context-runes](https://github.com/darkrymit/context-runes-cli) for the full enricher authoring guide.

## How It Works

```
UserPromptSubmit
  → hook-wrapper.js reads stdin JSON { prompt: "..." }
  → parses $key(args) tokens
  → for each token: spawnSync('crunes', ['query', key, ...args, '--format', 'json'])
  → iterates Section[] JSON output
  → builds <name title="..." ...>content</name> XML per section
  → emits { hookSpecificOutput: { additionalContext: "..." } }
```

## License

MIT — [Tamerlan Hurbanov (DarkRymit)](https://github.com/darkrymit)
