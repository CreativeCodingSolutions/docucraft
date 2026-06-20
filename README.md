# DocuCraft — Auto PR Descriptions

[![GitHub Stars](https://img.shields.io/badge/stars-★★★★☆-brightgreen?style=flat-square)](https://github.com/CreativeCodingSolutions/docucraft)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![GitHub Actions](https://img.shields.io/badge/GitHub-Actions-2088FF?style=flat-square&logo=github-actions)](https://github.com/CreativeCodingSolutions/docucraft/actions)

DocuCraft automatically generates structured PR descriptions from your pull request diffs. Works as a **GitHub Action** — no servers, no database, no configuration needed.

## 🚀 Quick Start

Copy this workflow into `.github/workflows/docucraft.yml`:

```yaml
name: DocuCraft
on: pull_request
permissions: { contents: read, pull-requests: write }
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: CreativeCodingSolutions/docucraft@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

That's it. Every PR gets a structured description automatically.

## 📋 What It Generates

**BEFORE** — A PR with no description:
> "fixed bug in login flow"

**AFTER** — DocuCraft generates this automatically:

![standard-what-it-generates](https://img.shields.io/badge/generated_by-DocuCraft-22c55e)
> **Summary:** 6 files changed — 2 bug fixes, 1 test update, 1 config change, 2 documentation updates
>
> **Files changed:**
> - `src/auth/login.ts` — Fix session token expiry check
> - `src/auth/login.test.ts` — Add expiry edge case tests
> - `src/config/auth.ts` — Bump default session timeout to 24h
> - `docs/auth-flow.md` — Update sequence diagram
> - `CHANGELOG.md` — Log session timeout change
>
> **Changes by category:**
> - 🐛 **Bug fixes:** Session expiry now correctly checks against UTC; race condition on concurrent logins resolved
> - ✅ **Tests:** Added coverage for token expiry edge cases
> - 📄 **Documentation:** Auth flow diagram updated to reflect new timeout
>
> **Labels:** `source`, `test`, `docs`, `size/s`

## 🎨 Template Styles

Choose the output that fits your team:

### Standard (default)

Categorizes files into Source Code, Configuration, Tests, Documentation, and Assets. Generates a summary with file count and change categories.

```
## Summary
3 files changed — 1 feature, 1 bug fix, 1 test update

## Files Changed
- src/api/users.ts — Added pagination support
- src/api/users.test.ts — Added pagination tests
- src/config/api.ts — Updated pagination defaults

## Changes by Category
✨ Features: Added pagination support
🐛 Bug fixes: Fixed off-by-one in fetchUsers
✅ Tests: Added pagination coverage
```

### Detailed

Everything in Standard, plus a diff preview showing the first 3000 characters of the diff — useful for reviewers who want context without switching tabs.

### Summary Only

Just the summary line — file count and change categories. No file list, no categorization. Best for teams that want a quick overview without clutter.

```
## Summary
3 files changed — 1 feature, 1 test update, 1 config change
```

### Minimal

A clean, simple file list with summary. No categorization, no diff preview. Best for small PRs or teams that prefer brevity.

```
## Summary
2 files changed — 1 fix

## Files Changed
- src/utils/format.ts
- src/utils/format.test.ts
```

## 📖 Usage

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

## 🔧 Features

- **Zero config** — add the workflow file, done
- **No API keys** — works out of the box with template mode
- **AI mode** — optional OpenAI integration for smarter descriptions
- **Custom templates** — use your own markdown template with placeholder variables
- **Changelog generation** — auto-generate changelog entries from merged PRs
- **Auto-labeling** — automatically labels PRs by file type (source, test, docs, config, etc.) and diff size
- **Works on every PR** — open, synchronize, reopened, closed
- **No servers** — runs entirely in GitHub Actions

## 🤖 AI Mode (Optional)

Add your OpenAI API key as a repository secret and enable AI mode:

```yaml
- uses: CreativeCodingSolutions/docucraft@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    mode: ai
    openai-api-key: ${{ secrets.OPENAI_API_KEY }}
```

## ⚙️ Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `github-token` | Yes | — | `secrets.GITHUB_TOKEN` |
| `openai-api-key` | No | — | OpenAI API key for AI mode |
| `openai-model` | No | `gpt-4o-mini` | OpenAI model name |
| `mode` | No | `template` | `template` or `ai` |
| `update-title` | No | `false` | Update PR title too |
| `template-style` | No | `standard` | `standard`, `detailed`, `minimal`, or `summary-only` |
| `custom-template` | No | — | Inline custom markdown template with `{{summary}}`, `{{files}}`, `{{changes}}`, `{{file_count}}` placeholders |
| `custom-template-file` | No | — | Path to a file in the repo containing a custom markdown template |
| `generate-changelog` | No | `false` | When `true`, generates changelog entries from merged PRs |
| `auto-label` | No | `false` | When `true`, automatically adds labels based on file types and diff size |
| `label-prefix` | No | `"` | Optional prefix for auto-generated labels (e.g. `area:` → `area:source`) |
| `size-labels` | No | `true` | When `auto-label` is true, adds size/xs/s/m/l/xl labels based on diff size |

## 📤 Outputs

| Output | Description |
|--------|-------------|
| `description` | The generated PR description text |
| `changelog-entry` | Changelog entry text (set when `generate-changelog=true` and PR is merged) |

### Custom Templates

Provide your own markdown template inline or via a file. Placeholder variables:

| Placeholder | Description |
|-------------|-------------|
| `{{summary}}` | Auto-generated summary (file count + categories) |
| `{{files}}` | List of all changed files (one per line) |
| `{{changes}}` | Categorized changes section (grouped by type) |
| `{{file_count}}` | Total number of changed files |

Inline template:

```yaml
- uses: CreativeCodingSolutions/docucraft@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    custom-template: |
      ## {{summary}}

      **Files changed:** {{file_count}}

      {{changes}}

      ---
      _Generated by DocuCraft_
```

Template from file:

```yaml
- uses: CreativeCodingSolutions/docucraft@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    custom-template-file: .github/docucraft-template.md
```

If both `custom-template` and `custom-template-file` are provided, `custom-template` takes priority.

## 📦 Changelog Generation

When `generate-changelog` is set to `true` and the PR is merged (closed event), DocuCraft generates a changelog entry:

```yaml
on:
  pull_request:
    types: [opened, synchronize, closed]

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: CreativeCodingSolutions/docucraft@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          generate-changelog: true
```

The changelog entry is available as the `changelog-entry` output. Use it in a subsequent step to update a `CHANGELOG.md` file or create a release.

## 🔍 Why DocuCraft?

- Stop writing "fixed stuff" PR descriptions
- Consistent documentation across your team
- Works on public AND private repos
- Free and open source

## 💡 Try It Now

1. Go to **any** GitHub repository (public or private)
2. Create `.github/workflows/docucraft.yml`
3. Paste the Quick Start workflow above
4. Open a PR — watch DocuCraft write the description

No signup, no API keys, no cost. It just works.

## 🎬 See DocuCraft in Action

DocuCraft wrote its own PR description on the very first test. View it live:

👉 [**PR #4 — "Demo: DocuCraft auto-generating PR descriptions"**](https://github.com/CreativeCodingSolutions/docucraft/pull/4)

## 📊 Real-World Case Study

We analyzed 100+ PRs across popular GitHub Actions repos and found ~15% had
poor or empty descriptions. DocuCraft fills this gap automatically.

**Before** (real PR #787 on softprops/action-gh-release, 5.6k ★):
> *(empty — 6 files changed, 90 additions, no description)*

**After** — DocuCraft generates:
```
## Summary
6 files changed — configuration cleanup, source improvements
- action.yml — Unified YAML string quoting for consistency
- .gitignore — Added .env to environment file protection
- src/github.ts — Enhanced GitHub API integration logic
```

[Read the full case study →](docs/marketing/case-study.md)

## 🌐 Website

https://creativecodingsolutions.github.io/docucraft/


