#!/usr/bin/env python3
"""DocuCraft PR Outreach Automation

Scans GitHub for repos that would benefit from DocuCraft's auto PR descriptions,
and opens issues suggesting the action.
"""

import json
import os
import sys
import time
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime
from typing import Any

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")
REPO = "CreativeCodingSolutions/docucraft"
CONTACTED_FILE = os.path.join(os.path.dirname(__file__), "..", "docs", "operations", "contacted-repos.json")
RESULTS_FILE = os.path.join(os.path.dirname(__file__), "..", "docs", "operations", "outreach-results-v2.md")
USER_AGENT = "DocuCraft-Outreach/1.0"

# Repos already contacted
ALREADY_CONTACTED = {
    "AIEraDev/clypra-studio",
    "memforks-dev/memforks",
    "patrick91/latest.cat",
    "tonygoldcrest/drum-hero",
    "blenderskool/react-code-block",
}

def gh_api(path: str, method: str = "GET", data: dict | None = None) -> dict[str, Any] | list[Any]:
    """Call GitHub API with proper auth and return parsed JSON."""
    url = f"https://api.github.com{path}"
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "application/vnd.github.v3+json",
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"

    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode())
            if isinstance(result, dict) and "message" in result and "status" not in result:
                print(f"  API Error: {result['message']}")
                return []
            return result
    except urllib.error.HTTPError as e:
        print(f"  HTTP {e.code}: {e.reason}")
        return []
    except Exception as e:
        print(f"  Error: {e}")
        return []


def search_repos(query: str, max_results: int = 30) -> list[dict[str, Any]]:
    """Search GitHub repos by query."""
    q = urllib.parse.quote(query)
    results = gh_api(f"/search/repositories?q={q}&per_page={min(max_results, 100)}&sort=updated&order=desc")
    if isinstance(results, dict):
        items = results.get("items", [])
        print(f"  Found {len(items)} repos for query: {query}")
        return items
    return []


def get_recent_prs(full_name: str, limit: int = 30) -> list[dict[str, Any]]:
    """Get recent PRs for a repo, filtering for PRs with weak descriptions."""
    results = gh_api(f"/repos/{full_name}/pulls?state=all&per_page={limit}&sort=updated&direction=desc")
    if isinstance(results, list):
        return results
    return []


def is_pr_description_weak(pr: dict[str, Any]) -> bool:
    """Check if a PR has a weak or empty description."""
    body = (pr.get("body") or "").strip()
    title = pr.get("title", "")
    if not body:
        return True
    if len(body) < 20:
        return True
    common_weak = [
        "fixes", "minor fix", "small fix", "updated", "updated.",
        "changes", "wip", "draft", "updates", "bump"
    ]
    for phrase in common_weak:
        if body.lower().strip() == phrase:
            return True
    return False


def weak_pr_pct(repo_full_name: str) -> tuple[float, int, int]:
    """Calculate percentage of recent PRs with weak descriptions."""
    prs = get_recent_prs(repo_full_name, limit=30)
    if not prs:
        return 0.0, 0, 0
    weak_count = sum(1 for pr in prs if is_pr_description_weak(pr))
    return weak_count / len(prs), weak_count, len(prs)


def generate_issue_body(repo_name: str, weak_pct: float, weak_count: int, total_prs: int) -> str:
    """Generate a personalized issue body suggesting DocuCraft."""
    pct = round(weak_pct * 100)

    if pct >= 70:
        intro = f"I noticed that **{pct}%** of recent PRs in {repo_name} have minimal or empty descriptions."
    elif pct >= 40:
        intro = f"I noticed that a significant portion of recent PRs in {repo_name} have minimal descriptions."
    else:
        intro = f"I noticed some PRs in {repo_name} could benefit from better descriptions."

    return f"""## Suggestion: Auto-generate PR descriptions with DocuCraft

{intro}

Good PR descriptions help reviewers understand changes faster, improve project documentation, and make release notes easier to generate.

**[DocuCraft](https://github.com/CreativeCodingSolutions/docucraft)** is a free, open-source GitHub Action that automatically generates structured PR descriptions by analyzing the diff.

### What it does

- **Analyzes** every file changed in a PR
- **Categorizes** changes (source code, configuration, documentation, etc.)
- **Generates** a structured summary — no more empty or "fixes" descriptions
- **Zero config** — add one YAML file and you're done

### Setup (30 seconds)

```yaml
# .github/workflows/docucraft.yml
name: DocuCraft
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: CreativeCodingSolutions/docucraft@v1
        with:
          github-token: \${{{{ secrets.GITHUB_TOKEN }}}}
```

### Why DocuCraft

- **100% free and open source** — MIT license
- **Works with existing workflows** — just add one step
- **Available on GitHub Marketplace** — one-click setup
- **Lightweight** — pure composite action, no runtime deps

Here's what I found analyzing {repo_name}: **{weak_count}/{total_prs}** recent PRs had weak or empty descriptions. DocuCraft would help your team ship better PRs without any extra effort.

Would this be useful for your project? Happy to answer any questions.

---

*🤖 This is an automated suggestion. I'm part of the DocuCraft team trying to help the open-source community improve PR quality.*"""


def open_issue(repo_full_name: str, title: str, body: str) -> dict[str, Any] | None:
    """Open a GitHub issue suggesting DocuCraft."""
    data = {"title": title, "body": body}
    result = gh_api(f"/repos/{repo_full_name}/issues", method="POST", data=data)
    if isinstance(result, dict) and "html_url" in result:
        return result
    return None


def should_skip_repo(repo: dict[str, Any]) -> tuple[bool, str]:
    """Check if repo should be skipped. Returns (skip, reason)."""
    full_name = repo.get("full_name", "")

    if full_name in ALREADY_CONTACTED:
        return True, "Already contacted"

    if repo.get("archived", False):
        return True, "Archived"

    if repo.get("disabled", False):
        return True, "Disabled"

    language = repo.get("language") or ""
    if language and language.lower() in {"html", "css", "scss", "shell", "batchfile"}:
        return True, f"Language {language} unlikely to use PR descriptions"

    topics = [t.lower() for t in repo.get("topics", [])]
    if "documentation" in topics or "docs" in topics or "learning" in topics:
        return True, "Documentation/learning repo"

    description = (repo.get("description") or "").lower()
    skip_keywords = ["book", "tutorial", "course", "template", "awesome"]
    if any(k in description for k in skip_keywords):
        return True, "Non-code project (tutorial/awesome-list/book)"

    return False, ""


def main():
    if not GITHUB_TOKEN:
        print("ERROR: GITHUB_TOKEN environment variable not set")
        print("Set it with: export GITHUB_TOKEN=ghp_xxx")
        sys.exit(1)

    print("=" * 60)
    print("DocuCraft Outreach Automation")
    print(f"Started at: {datetime.utcnow().isoformat()}Z")
    print("=" * 60)

    queries = [
        "stars:10..500 pushed:>2026-01-01 topic:github-actions",
        "stars:10..500 pushed:>2026-01-01 language:python topic:ci",
        "stars:10..500 pushed:>2026-01-01 language:javascript topic:ci",
        "stars:10..500 pushed:>2026-01-01 language:typescript topic:ci",
        "stars:10..500 pushed:>2026-01-01 language:go topic:ci",
        "stars:10..500 pushed:>2026-01-01 language:rust topic:ci",
    ]

    candidates = []
    seen = set()

    for query in queries:
        repos = search_repos(query, max_results=30)
        for repo in repos:
            full_name = repo.get("full_name", "")
            if full_name not in seen:
                seen.add(full_name)
                candidates.append(repo)
        time.sleep(0.5)

    print(f"\nTotal unique candidates: {len(candidates)}")
    print("=" * 60)

    results = []

    for i, repo in enumerate(candidates):
        full_name = repo.get("full_name", "")
        desc = (repo.get("description") or "")[:60]
        stars = repo.get("stargazers_count", 0)

        skip, reason = should_skip_repo(repo)
        if skip:
            print(f"  [{i+1}/{len(candidates)}] SKIP {full_name} ({stars}★) — {reason}")
            results.append({"repo": full_name, "stars": stars, "action": "skipped", "reason": reason})
            continue

        print(f"  [{i+1}/{len(candidates)}] ANALYZE {full_name} ({stars}★)...", end=" ", flush=True)

        weak_pct, weak_count, total_prs = weak_pr_pct(full_name)

        if total_prs < 3:
            print(f"SKIP — only {total_prs} recent PRs")
            results.append({"repo": full_name, "stars": stars, "action": "skipped", "reason": f"Only {total_prs} recent PRs"})
            time.sleep(0.3)
            continue

        if weak_pct < 0.3:
            print(f"SKIP — only {round(weak_pct*100)}% weak PRs")
            results.append({"repo": full_name, "stars": stars, "action": "skipped", "reason": f"Only {round(weak_pct*100)}% weak PRs"})
            time.sleep(0.3)
            continue

        print(f"OPENING ISSUE ({round(weak_pct*100)}% weak, {weak_count}/{total_prs})")

        title = f"Suggestion: Auto-generate PR descriptions with DocuCraft (detected {weak_count}/{total_prs} PRs lacking descriptions)"
        body = generate_issue_body(full_name, weak_pct, weak_count, total_prs)

        issue = open_issue(full_name, title, body)
        if issue:
            url = issue.get("html_url", "unknown")
            print(f"    ✅ Issue created: {url}")
            results.append({
                "repo": full_name,
                "stars": stars,
                "action": "issue_created",
                "url": url,
                "weak_pct": round(weak_pct * 100),
                "weak_count": weak_count,
                "total_prs": total_prs,
            })
        else:
            print(f"    ❌ Failed to create issue")
            results.append({
                "repo": full_name,
                "stars": stars,
                "action": "failed",
                "reason": "API error",
                "weak_pct": round(weak_pct * 100),
                "weak_count": weak_count,
                "total_prs": total_prs,
            })

        time.sleep(1)

    print("\n" + "=" * 60)
    print("OUTREACH COMPLETE")
    print("=" * 60)

    created = [r for r in results if r.get("action") == "issue_created"]
    skipped = [r for r in results if r.get("action") == "skipped"]
    failed = [r for r in results if r.get("action") == "failed"]

    print(f"Issues created: {len(created)}")
    print(f"Skipped: {len(skipped)}")
    print(f"Failed: {len(failed)}")

    out = []
    out.append(f"# DocuCraft Outreach Results v2\n")
    out.append(f"**Date:** {datetime.utcnow().isoformat()}Z\n")
    out.append(f"**Operator:** outreach-automation.py\n")
    out.append(f"\n## Summary\n\n")
    out.append(f"| Action | Count |\n|--------|-------|\n")
    out.append(f"| Issues Created | {len(created)} |\n")
    out.append(f"| Skipped | {len(skipped)} |\n")
    out.append(f"| Failed | {len(failed)} |\n")
    out.append(f"\n## Issues Created\n\n")
    out.append(f"| # | Repo | Stars | Weak % | Issue |\n|---|------|-------|--------|-------|\n")
    for idx, r in enumerate(created, 1):
        out.append(f"| {idx} | {r['repo']} | {r['stars']}★ | {r['weak_pct']}% | [Link]({r['url']}) |\n")
    out.append(f"\n## Details\n\n")
    for r in results:
        if r.get("action") == "issue_created":
            out.append(f"- ✅ [{r['repo']}]({r['url']}) — {r['weak_pct']}% weak PRs ({r['weak_count']}/{r['total_prs']})\n")
        elif r.get("action") == "skipped":
            out.append(f"- ⏭️ {r['repo']} — {r['reason']}\n")
        else:
            out.append(f"- ❌ {r['repo']} — {r['reason']}\n")

    with open(RESULTS_FILE, "w") as f:
        f.writelines(out)

    print(f"\nResults written to {RESULTS_FILE}")

    contacted = {r["repo"]: {"stars": r["stars"], "action": r["action"], "timestamp": datetime.utcnow().isoformat() + "Z"} for r in results if r.get("action") in ("issue_created",)}
    with open(CONTACTED_FILE, "w") as f:
        json.dump(contacted, f, indent=2)
    print(f"Contacted repos saved to {CONTACTED_FILE}")


if __name__ == "__main__":
    main()
