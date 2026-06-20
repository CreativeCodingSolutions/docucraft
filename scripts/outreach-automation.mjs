#!/usr/bin/env node
/* DocuCraft PR Outreach Automation
 *
 * Scans GitHub for repos that would benefit from DocuCraft's auto PR descriptions,
 * and opens issues suggesting the action.
 */

import { writeFileSync, existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "..");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const CONTACTED_FILE = join(PROJECT_ROOT, "docs", "operations", "contacted-repos.json");
const RESULTS_FILE = join(PROJECT_ROOT, "docs", "operations", "outreach-results-v2.md");

const ALREADY_CONTACTED = new Set([
  "AIEraDev/clypra-studio",
  "memforks-dev/memforks",
  "patrick91/latest.cat",
  "tonygoldcrest/drum-hero",
  "blenderskool/react-code-block",
]);

async function ghApi(path, method = "GET", data = null) {
  const url = `https://api.github.com${path}`;
  const headers = {
    "User-Agent": "DocuCraft-Outreach/1.0",
    Accept: "application/vnd.github.v3+json",
  };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

  const opts = { method, headers };
  if (data) {
    opts.body = JSON.stringify(data);
    headers["Content-Type"] = "application/json";
  }

  const resp = await fetch(url, opts);
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    console.error(`  HTTP ${resp.status} for ${path}: ${text.slice(0, 200)}`);
    return null;
  }
  return resp.json();
}

async function searchRepos(query, maxResults = 30) {
  const q = encodeURIComponent(query);
  const result = await ghApi(
    `/search/repositories?q=${q}&per_page=${Math.min(maxResults, 100)}&sort=updated&order=desc`
  );
  if (result && result.items) {
    console.log(`  Found ${result.items.length} repos for query: ${query}`);
    return result.items;
  }
  return [];
}

async function getRecentPRs(fullName, limit = 30) {
  const result = await ghApi(
    `/repos/${fullName}/pulls?state=all&per_page=${limit}&sort=updated&direction=desc`
  );
  return Array.isArray(result) ? result : [];
}

function isPRDescriptionWeak(pr) {
  const body = (pr.body || "").trim();
  if (!body) return true;
  if (body.length < 20) return true;
  const commonWeak = [
    "fixes", "minor fix", "small fix", "updated", "updated.",
    "changes", "wip", "draft", "updates", "bump"
  ];
  if (commonWeak.includes(body.toLowerCase().trim())) return true;
  return false;
}

async function weakPrPct(repoFullName) {
  const prs = await getRecentPRs(repoFullName, 30);
  if (!prs || prs.length === 0) return [0, 0, 0];
  const weakCount = prs.filter(isPRDescriptionWeak).length;
  return [weakCount / prs.length, weakCount, prs.length];
}

function generateIssueBody(repoName, weakPct, weakCount, totalPrs) {
  const pct = Math.round(weakPct * 100);
  let intro;
  if (pct >= 70)
    intro = `I noticed that **${pct}%** of recent PRs in ${repoName} have minimal or empty descriptions.`;
  else if (pct >= 40)
    intro = `I noticed that a significant portion of recent PRs in ${repoName} have minimal descriptions.`;
  else
    intro = `I noticed some PRs in ${repoName} could benefit from better descriptions.`;

  return `## Suggestion: Auto-generate PR descriptions with DocuCraft

${intro}

Good PR descriptions help reviewers understand changes faster, improve project documentation, and make release notes easier to generate.

**[DocuCraft](https://github.com/CreativeCodingSolutions/docucraft)** is a free, open-source GitHub Action that automatically generates structured PR descriptions by analyzing the diff.

### What it does

- **Analyzes** every file changed in a PR
- **Categorizes** changes (source code, configuration, documentation, etc.)
- **Generates** a structured summary — no more empty or "fixes" descriptions
- **Zero config** — add one YAML file and you're done

### Setup (30 seconds)

\`\`\`yaml
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
          github-token: \${{ secrets.GITHUB_TOKEN }}
\`\`\`

### Why DocuCraft

- **100% free and open source** — MIT license
- **Works with existing workflows** — just add one step
- **Available on GitHub Marketplace** — one-click setup
- **Lightweight** — pure composite action, no runtime deps

Here's what I found analyzing ${repoName}: **${weakCount}/${totalPrs}** recent PRs had weak or empty descriptions. DocuCraft would help your team ship better PRs without any extra effort.

Would this be useful for your project? Happy to answer any questions.

---

*🤖 This is an automated suggestion. I'm part of the DocuCraft team trying to help the open-source community improve PR quality.*`;
}

async function openIssue(repoFullName, title, body) {
  const data = { title, body };
  const result = await ghApi(`/repos/${repoFullName}/issues`, "POST", data);
  if (result && result.html_url) return result;
  return null;
}

function shouldSkipRepo(repo) {
  const fullName = repo.full_name || "";

  if (ALREADY_CONTACTED.has(fullName)) return [true, "Already contacted"];
  if (repo.archived) return [true, "Archived"];
  if (repo.disabled) return [true, "Disabled"];

  const lang = (repo.language || "").toLowerCase();
  const skipLangs = ["html", "css", "scss", "shell", "batchfile"];
  if (skipLangs.includes(lang)) return [true, `Language ${repo.language} unlikely to use PR descriptions`];

  const topics = (repo.topics || []).map((t) => t.toLowerCase());
  if (topics.some((t) => ["documentation", "docs", "learning"].includes(t)))
    return [true, "Documentation/learning repo"];

  const desc = (repo.description || "").toLowerCase();
  const skipKeywords = ["book", "tutorial", "course", "template", "awesome"];
  if (skipKeywords.some((k) => desc.includes(k)))
    return [true, "Non-code project"];

  return [false, ""];
}

async function main() {
  if (!GITHUB_TOKEN) {
    console.error("ERROR: GITHUB_TOKEN environment variable not set");
    process.exit(1);
  }

  console.log("=".repeat(60));
  console.log("DocuCraft Outreach Automation");
  console.log(`Started at: ${new Date().toISOString()}`);
  console.log("=".repeat(60));

  const queries = [
    "stars:10..500 pushed:>2026-01-01 topic:github-actions",
    "stars:10..500 pushed:>2026-01-01 language:python topic:ci",
    "stars:10..500 pushed:>2026-01-01 language:javascript topic:ci",
    "stars:10..500 pushed:>2026-01-01 language:typescript topic:ci",
    "stars:10..500 pushed:>2026-01-01 language:go topic:ci",
    "stars:10..500 pushed:>2026-01-01 language:rust topic:ci",
  ];

  const seen = new Set();
  const candidates = [];

  for (const query of queries) {
    const repos = await searchRepos(query, 30);
    for (const repo of repos) {
      const fn = repo.full_name || "";
      if (!seen.has(fn)) {
        seen.add(fn);
        candidates.push(repo);
      }
    }
    await sleep(500);
  }

  console.log(`\nTotal unique candidates: ${candidates.length}`);
  console.log("=".repeat(60));

  const results = [];

  for (let i = 0; i < candidates.length; i++) {
    const repo = candidates[i];
    const fullName = repo.full_name || "";
    const stars = repo.stargazers_count || 0;

    const [skip, reason] = shouldSkipRepo(repo);
    if (skip) {
      console.log(`  [${i + 1}/${candidates.length}] SKIP ${fullName} (${stars}★) — ${reason}`);
      results.push({ repo: fullName, stars, action: "skipped", reason });
      continue;
    }

    process.stdout.write(`  [${i + 1}/${candidates.length}] ANALYZE ${fullName} (${stars}★)... `);

    const [weakPct, weakCount, totalPrs] = await weakPrPct(fullName);

    if (totalPrs < 3) {
      console.log(`SKIP — only ${totalPrs} recent PRs`);
      results.push({ repo: fullName, stars, action: "skipped", reason: `Only ${totalPrs} recent PRs` });
      await sleep(300);
      continue;
    }

    if (weakPct < 0.3) {
      console.log(`SKIP — only ${Math.round(weakPct * 100)}% weak PRs`);
      results.push({ repo: fullName, stars, action: "skipped", reason: `Only ${Math.round(weakPct * 100)}% weak PRs` });
      await sleep(300);
      continue;
    }

    console.log(`OPENING ISSUE (${Math.round(weakPct * 100)}% weak, ${weakCount}/${totalPrs})`);

    const title = `Suggestion: Auto-generate PR descriptions with DocuCraft (detected ${weakCount}/${totalPrs} PRs lacking descriptions)`;
    const body = generateIssueBody(fullName, weakPct, weakCount, totalPrs);

    const issue = await openIssue(fullName, title, body);
    if (issue) {
      const url = issue.html_url;
      console.log(`    ✅ Issue created: ${url}`);
      results.push({
        repo: fullName,
        stars,
        action: "issue_created",
        url,
        weakPct: Math.round(weakPct * 100),
        weakCount,
        totalPrs,
      });
    } else {
      console.log(`    ❌ Failed to create issue`);
      results.push({
        repo: fullName,
        stars,
        action: "failed",
        reason: "API error",
        weakPct: Math.round(weakPct * 100),
        weakCount,
        totalPrs,
      });
    }

    await sleep(1000);
  }

  console.log("\n" + "=".repeat(60));
  console.log("OUTREACH COMPLETE");
  console.log("=".repeat(60));

  const created = results.filter((r) => r.action === "issue_created");
  const skipped = results.filter((r) => r.action === "skipped");
  const failed = results.filter((r) => r.action === "failed");

  console.log(`Issues created: ${created.length}`);
  console.log(`Skipped: ${skipped.length}`);
  console.log(`Failed: ${failed.length}`);

  let out = `# DocuCraft Outreach Results v2\n\n`;
  out += `**Date:** ${new Date().toISOString()}\n\n`;
  out += `## Summary\n\n`;
  out += `| Action | Count |\n|--------|-------|\n`;
  out += `| Issues Created | ${created.length} |\n`;
  out += `| Skipped | ${skipped.length} |\n`;
  out += `| Failed | ${failed.length} |\n\n`;
  out += `## Issues Created\n\n`;
  out += `| # | Repo | Stars | Weak % | Issue |\n|---|------|-------|--------|-------|\n`;
  created.forEach((r, idx) => {
    out += `| ${idx + 1} | ${r.repo} | ${r.stars}★ | ${r.weakPct}% | [Link](${r.url}) |\n`;
  });
  out += `\n## Details\n\n`;
  results.forEach((r) => {
    if (r.action === "issue_created") {
      out += `- ✅ [${r.repo}](${r.url}) — ${r.weakPct}% weak PRs (${r.weakCount}/${r.totalPrs})\n`;
    } else if (r.action === "skipped") {
      out += `- ⏭️ ${r.repo} — ${r.reason}\n`;
    } else {
      out += `- ❌ ${r.repo} — ${r.reason}\n`;
    }
  });

  writeFileSync(RESULTS_FILE, out);
  console.log(`\nResults written to ${RESULTS_FILE}`);

  const contacted = {};
  results
    .filter((r) => r.action === "issue_created")
    .forEach((r) => {
      contacted[r.repo] = {
        stars: r.stars,
        url: r.url,
        timestamp: new Date().toISOString(),
      };
    });
  writeFileSync(CONTACTED_FILE, JSON.stringify(contacted, null, 2));
  console.log(`Contacted repos saved to ${CONTACTED_FILE}`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch(console.error);
