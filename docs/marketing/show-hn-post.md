# Show HN: DocuCraft – Auto-generate PR descriptions from diffs

~15% of PRs in popular open-source repos have no description at all. Another ~10% are one-liners that don't explain the *why*. I analyzed 100+ PRs across repos like `softprops/action-gh-release` (5.6k stars) and `docker/build-push-action` (5.3k stars) — roughly 1 in 7 PRs was empty.

Examples from the data:
- [#787](https://github.com/softprops/action-gh-release/pull/787): "Update the latest release" — 6 files, +90/-35, description: blank
- [#1550](https://github.com/docker/build-push-action/pull/1550): "mention Docker GitHub Builder in the README" — description: blank

I built DocuCraft to fix this. It's a GitHub Action that reads the diff on every PR and writes a structured description: summary, file-by-file breakdown, change categories, and labels. No API keys needed, no signup.

Check out the live demo at [#4 on the DocuCraft repo](https://github.com/CreativeCodingSolutions/docucraft/pull/4) — it auto-generated its own PR description:

```yaml
# .github/workflows/docucraft.yml
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

Free, open source, one file to add. [github.com/CreativeCodingSolutions/docucraft](https://github.com/CreativeCodingSolutions/docucraft)
