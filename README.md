# context-runes-aci

ACI (Agentic Coder Interface) integrations for [context-runes](https://github.com/darkrymit/context-runes). Connects the [context-runes-cli](https://github.com/darkrymit/context-runes-cli) to AI coding tools, providing skills for manual enricher access and — where native hook systems are available — automatic context injection.

Currently supported: **Claude Code** (full native integration via `UserPromptSubmit` hook + skills). Other AI tools with skill or prompt-injection support may use the included skills directly against the CLI.

## Prerequisites

All enricher logic is delegated to the CLI. Install it first:

```bash
npm install -g @darkrymit/context-runes
crunes --version
```

## Installation

### Claude Code

```bash
/plugin marketplace add https://github.com/darkrymit/context-runes-aci
/plugin install context-runes-aci
```

Run `/reload-plugins` to activate in the current session.

### Other AI tools

Copy or reference the skills from the `skills/` directory. As long as your tool supports invoking CLI commands, the skills work against `crunes` directly.

## Usage in Claude Code

With the plugin active, use the included skills to interact with enrichers:

- **context-runes-list** — discover what enrichers are available in the current project
- **context-runes-query** — fetch enricher output mid-conversation
- **context-runes-create** — scaffold a new enricher

Additionally, the `UserPromptSubmit` hook automatically resolves `$key(args)` tokens and injects enricher output as XML context before Claude sees your prompt:

```xml
<context title="Setup Guide" id="setup">
### Install
1. Clone the repo
2. npm install
</context>
```

## Project Setup

Enrichers live in your project, not in this repo. In each project you want to use context-runes:

```bash
crunes init
crunes create docs --format markdown
```

See [context-runes-cli](https://github.com/darkrymit/context-runes-cli) for the full enricher authoring guide.

## How It Works (Claude Code)

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
