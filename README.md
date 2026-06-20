# DocuCraft — Auto PR Descriptions

DocuCraft automatically generates structured PR descriptions from your pull request diffs. Works as a **GitHub Action** — no servers, no database, no configuration needed.

## Usage

Add this to `.github/workflows/docucraft.yml`:

```yaml
name: DocuCraft

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: CreativeCodingSolutions/docucraft@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

That's it. Every PR will get a generated description.

## Features

- **Zero config** — add the workflow file, done
- **No API keys** — works out of the box with template mode
- **AI mode** — optional OpenAI integration for smarter descriptions
- **Works on every PR** — open, synchronize, reopened
- **No servers** — runs entirely in GitHub Actions

## AI Mode (Optional)

Add your OpenAI API key as a repository secret and enable AI mode:

```yaml
- uses: CreativeCodingSolutions/docucraft@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    mode: ai
    openai-api-key: ${{ secrets.OPENAI_API_KEY }}
```

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `github-token` | Yes | — | `secrets.GITHUB_TOKEN` |
| `openai-api-key` | No | — | OpenAI API key for AI mode |
| `openai-model` | No | `gpt-4o-mini` | OpenAI model name |
| `mode` | No | `template` | `template` or `ai` |
| `update-title` | No | `false` | Update PR title too |
| `template-style` | No | `standard` | `standard`, `detailed`, or `minimal` |

## Outputs

| Output | Description |
|--------|-------------|
| `description` | The generated PR description text |

### Template Styles

**Standard** (default): Categorizes files into Source Code, Configuration, Tests, Documentation, and Assets. Generates a summary with file count and change categories.

**Detailed**: Everything in standard, plus a diff preview section showing the first 3000 characters of the diff.

**Minimal**: Simple file list with summary — no categorization, no diff preview. Best for small PRs.

## Why DocuCraft?

- Stop writing "fixed stuff" PR descriptions
- Consistent documentation across your team
- Works on public AND private repos
- Free and open source

## Website

https://creativecodingsolutions.github.io/docucraft/
