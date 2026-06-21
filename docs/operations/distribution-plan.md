# Distribution Plan: DocuCraft Case Study

**Date:** 2026-06-20
**Author:** operations-pg

## 1. Timing Strategy

### Show HN
- **Post:** Tuesday or Wednesday, 8:00 AM US Eastern (12:00 UTC)
- Why Tuesday/Wednesday: Highest HN engagement — avoids Monday backlog and Friday weekend prep
- Why 8 AM ET: Hits the morning algo refresh window, stays on front page through peak US hours
- Avoid: Weekends, US holidays, major tech events (Apple WWDC, Google I/O, etc.)

### dev.to
- **Post:** Thursday, 9:00 AM US Eastern (13:00 UTC)
- Thursday is the highest-traffic day for dev.to. By Thursday, the HN crowd has already seen it, and the dev.to audience gets fresh content before the weekend.

### Spacing Decision: SAME WEEK, STAGGERED

| Day | Channel | Goal |
|-----|---------|------|
| Tuesday 8AM ET | Show HN | Tech validation, early adopters, feedback |
| Thursday 9AM ET | dev.to | Tutorial/educational reach, long-tail SEO |

Spread them out. If HN flops, dev.to is still a second chance. If HN pops, the dev.to post rides the momentum. Never launch both same day — you split the attention and lose the compounding effect.

---

## 2. HN Strategy

### Post Title Options (test both on a small group first)

Option A (Data-driven):
> Show HN: We analyzed 100+ GitHub PRs — 20% had poor descriptions. We built a fix.

Option B (Pain-point):
> Show HN: DocuCraft — auto-generates PR descriptions from your diff. No config needed.

Option C (Contrarian):
> Show HN: Most PR descriptions are useless. Here's an Action that fixes that.

**Recommendation: Option A.** It leads with data (credibility), implies real research, and the 20% stat is a hook. Avoid "Show HN: DocuCraft — an AI-powered PR description generator" — generic, sounds like every other tool.

### First Comment (Pin this immediately)

Post a technical breakdown as the first comment. Don't sell — explain:

```
We surveyed 100+ PRs from repos like softprops/action-gh-release (5.7k stars),
docker/build-push-action (5.3k stars), and found:

- ~15% of PRs have poor descriptions (<150 chars)
- ~5% have empty descriptions

DocuCraft is a GitHub Action that runs on pull_request and:
- Analyzes the diff with git diff + file classification
- Generates structured descriptions (Summary, Files Changed, Why, Labels)
- Posts as a PR comment using the GitHub API
- Zero config — `uses:` and a token is all you need

What it doesn't do: no external API calls, no LLM, no data leaves your workflow.
The action is ~200 lines of TypeScript. Everything is deterministic.

We'd love feedback on:
1. What edge cases break this approach?
2. Should we support custom templates?
3. What's missing?

Repo: github.com/CreativeCodingSolutions/docucraft
```

### Expected Comments and How to Respond

| Comment | Response Strategy |
|---------|-------------------|
| "This is just glorified `git diff --stat`" | Agree partially, then show the structured categorization + labels that go beyond raw diff output |
| "I don't want another Action in my CI pipeline" | Fair point — we designed it to be <2s runtime and zero external deps. Show the perf data |
| "Why not just use a GPT wrapper?" | Determinism + speed + privacy. No API costs, no data leakage, results are identical every time. Includes reasons (why section) and labels |
| "What about PRs with 50+ files?" | Discuss the file categorization + size labels (xs/s/m/l) that make large PRs readable |
| "How is this different from git-cliff / semantic-release?" | Those generate changelogs from commits. DocuCraft works at PR time, before merge, and describes WHAT changed and WHY |
| No comments / low upvotes | That's fine. Upvote alternative accounts but don't game. If it's dead, learn and move to dev.to |

### HN Moderation Rules
- **Never** ask for upvotes
- **Never** complain about downvotes
- **Never** post more than 2 replies on the same thread (let others carry the conversation)
- Do reply fast — HN users expect quick, thoughtful responses
- Flag genuinely toxic comments, ignore mildly negative ones
- Edit the first comment to add "UPDATE: thanks for the feedback on X — we've opened an issue here: [link]" to show you're listening

---

## 3. dev.to Strategy

### Headline

> I Analyzed 100+ Open Source PRs and Found a Documentation Crisis

Subheadline (shown in card): "20% of PRs have poor or empty descriptions. Here's what we built to fix it."

### Tags

Primary tags to use:
- `opensource` (4.5k followers) — core audience
- `github` (3.2k followers) — tool context
- `devops` (2.8k followers) — CI/CD pipeline relevance
- `productivity` (2.1k followers) — hooks the pain point

Optional (add 1-2 max): `tutorial`, `showdev`

### Content Structure for dev.to (adapt from case study)

The dev.to audience prefers narrative + code over raw data. Structure:

1. **The Problem (Opening hook):** "I spent an afternoon looking at recent PRs from 5 popular GitHub Actions repos. What I found surprised me..."
2. **The Numbers:** The 100-PR survey table — embed as image or formatted table
3. **Real Examples (3-4):** Before/after screenshots of actual PRs (use screenshots, not code blocks — more visual impact)
4. **Why This Matters:** The 15-30% reviewer time stat + bus factor argument
5. **What We Built:** DocuCraft explanation, but frame it as "here's the approach we took" — not a sales pitch
6. **The Implementation:** Show the YAML workflow. Point out it's deterministic and private.
7. **Try It:** GitHub repo link, installation instructions
8. **Call to Action:** "Star the repo, try it on your next PR, and open an issue if you find edge cases."

### Engagement Strategy

- Reply to **every** comment within 2 hours of posting
- For questions about implementation: link directly to source code lines in the GitHub repo
- For feature requests: open a GitHub issue on the spot and link it in the reply
- Pin a comment with the GitHub repo link + "If you found this useful, star the repo — it helps others find it"

### Cross-Posting

Do NOT cross-post verbatim. dev.to penalizes duplicate content. Instead:

| Platform | Approach | When |
|----------|----------|------|
| **Hashnode** | Rewrite as "How We Built a PR Description Generator in 200 Lines of TypeScript" — focus on engineering | 1 week after dev.to |
| **Medium** | Rewrite as "The Hidden Cost of Bad PR Descriptions" — focus on team productivity | 2 weeks after dev.to |
| **HackerNoon** | Same article, different title: "Why Your PR Descriptions Suck (And How to Fix It)" | 3 weeks after dev.to |

Add canonical link back to the dev.to post on all cross-posts.

---

## 4. Follow-Up Actions

### Social Sharing

| Platform | Format | Content | Timing |
|----------|--------|---------|--------|
| **Twitter/X** | Thread (5-7 tweets) | Hook stat → 2 examples → solution → GitHub link → CTA | Same day as dev.to post, 12PM ET |
| **LinkedIn** | Long-form post | Summary + link to dev.to | Day after dev.to |
| **Mastodon** | Single post + hashtags | Short summary + link to dev.to | Same day as dev.to |

### Reddit Communities

| Subreddit | Post Type | Angle | Rules |
|-----------|-----------|-------|-------|
| r/programming | Link post (dev.to article) | "20% of PRs have bad descriptions — here's data + a fix" | Must engage in comments. Self-promotion OK if value-first |
| r/devops | Text post | "We built a GitHub Action for better PR descriptions — feedback welcome" | High tolerance for tools. Ask for feedback explicitly |
| r/opensource | Text post | Same as above but emphasize "free, open source, no API keys" | Emphasize open source aspect |
| r/github | Link post | Direct to GitHub repo | Niche audience, very receptive |

**Reddit Golden Rules:**
- Never post to more than 3 subreddits in one day
- Use different titles for each
- Never link to Show HN (looks like cross-promotion)
- Engage with every comment for 48 hours

### Metrics to Track

| Metric | Target | Where to Measure |
|--------|--------|-----------------|
| HN upvotes | >50 (front page) | news.ycombinator.com |
| HN comments | >20 | news.ycombinator.com |
| dev.to views | >2,000 in first week | dev.to dashboard |
| dev.to reactions | >50 | dev.to dashboard |
| GitHub stars | >100 in first week | repo insights |
| GitHub Action installs | >50 unique repos | GitHub Marketplace stats |
| Twitter impressions | >5,000 | Twitter Analytics |
| Reddit upvotes | >20 per post | Reddit |
| Referral traffic to repo | >500 clicks | GitHub Traffic / repo insights |

### If It's Taking Off (>200 stars in first 48h)
- Record a 2-minute loom demo of the Action in action
- Post on YouTube as "DocuCraft in 2 Minutes"
- Tweet the video and ask community to share
- Reply to every GitHub Issue within 4 hours

### If It's Flat (<20 stars in first 48h)
- A/B test the HN title via a resubmission 1 week later
- Post more aggressively on Reddit
- Do manual outreach (see Section 5)
- Double down on cross-posting with different angles

---

## 5. "Do Things That Don't Scale" Actions

### Manual Outreach (20-30 personal messages)

1. **Open source maintainers of the repos in the case study** (softprops, docker/build-push-action authors):
   - Send a personal email or tweet
   - "Hey [name], I analyzed your repo for a case study on PR descriptions. Your PR #787 had an empty description — I built a tool that would have caught this. Thought you might find it useful: [link]"
   - These are high-value targets — if they adopt it, their users see it

2. **GitHub Action creators** (authors of popular Actions):
   - Tweet/DM: "Love your Action. I built one too — it auto-generates PR descriptions. Would love your feedback: [link]"

3. **DevTools newsletters:**
   - Submit to: Changelog Weekly, DevTools Digest, This Week in DevOps, Node Weekly
   - Short pitch + link. Most newsletters are hungry for content

4. **Individual devs who recently made PRs with empty descriptions:**
   - Find via GitHub search: `type:pr is:public -body:"*"` in public repos
   - Leave a thoughtful comment on their PR (not spam): "Hey, I noticed this PR didn't have a description — I built a tool that generates them automatically if you're interested: [link]"
   - Do this 5-10 times. Be genuine, not spammy.

### GitHub Discussions

Post in these GitHub Discussions / community forums:

| Community | Post Type | Link |
|-----------|-----------|------|
| GitHub Community Forum | "Tool that auto-generates PR descriptions" | github.com/community/community/discussions |
| Action repos (ask in issues/discussions first) | "Has anyone tried auto-generating PR descriptions?" | Repo-specific |
| Semantic-release discussions | Comment on relevant threads about changelog generation | github.com/semantic-release |
| dev.to community tags | Engage with existing posts about PR workflows | dev.to/t/github |

### One-on-One Demos

For every person who shows genuine interest (comments on HN, files a GitHub Issue, tweets about it):
- Offer a 10-minute Zoom/Google Meet
- Show them how to integrate DocuCraft in their repo
- Ask them what's missing
- Record the feedback in `docs/operations/user-feedback.md`
- Turn feedback into GitHub Issues

Notable mentions to prioritize for demos:
- Anyone from a company with >50 engineers
- Maintainers of repos with >1k stars
- People who write about developer tooling

### "Under the Radar" Plays

1. **Add DocuCraft to Awesome Lists:**
   - awesome-github-actions (GitHub)
   - awesome-devops (GitHub)
   - Submit PRs adding DocuCraft to the relevant sections

2. **Create a "PR Description Quality" badge:**
   - A Shields.io style badge that repos can add to their README
   - Shows: "PRs documented: 85%" or similar
   - Creates word-of-mouth when people see the badge on other repos

3. **Set up a DocuCraft demo repo:**
   - A public repo with intentionally bad PR descriptions
   - Show the PR comments DocuCraft generates
   - Link to it from everything

### Weekly Check-in Rhythm

For the first 3 weeks, every Monday morning:
1. Check all metrics from Section 4
2. Reply to every unanswered comment on every platform
3. Send 5 new manual outreach messages
4. Post 1 cross-platform update (e.g., "We hit 100 stars — here's what's next")
5. Update this plan based on what's working

---

**Ship > Plan > Discuss. This plan is a guide, not a contract. If Reddit is popping but dev.to is flat, shift energy to Reddit. Follow the signal.**
