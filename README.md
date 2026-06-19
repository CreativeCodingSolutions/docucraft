# DocuCraft — AI Documentation from Your GitHub Repos

DocuCraft automatically generates PR descriptions, changelogs, and documentation from your GitHub repositories.

## Phase 0: PR Pilot

The initial release ("PR Pilot") focuses on two core features:
- **Auto PR Descriptions** — Every pull request gets a clear, well-structured description generated from code changes
- **Changelog Generation** — Generate release notes from merged PRs with one click

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS v4, shadcn/ui
- **Backend:** Next.js API routes (serverless)
- **Database:** Supabase (Postgres)
- **AI:** OpenAI (GPT-4o-mini)
- **Auth:** GitHub App OAuth
- **Deployment:** Vercel (frontend + API), Railway (background tasks), Supabase (DB)

## Getting Started

```bash
# Copy environment variables
cp .env.example .env.local

# Fill in your credentials:
# - Supabase project URL and keys
# - GitHub App credentials
# - OpenAI API key

# Run development server
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `GITHUB_APP_ID` | GitHub App ID |
| `GITHUB_APP_CLIENT_ID` | GitHub App client ID |
| `GITHUB_APP_CLIENT_SECRET` | GitHub App client secret |
| `GITHUB_APP_PRIVATE_KEY` | GitHub App private key |
| `GITHUB_APP_WEBHOOK_SECRET` | GitHub App webhook secret |
| `OPENAI_API_KEY` | OpenAI API key |
| `OPENAI_MODEL` | OpenAI model (default: gpt-4o-mini) |
| `NEXT_PUBLIC_APP_URL` | App URL (http://localhost:3000 for dev) |

## Architecture

1. **GitHub App** receives `pull_request` webhook events
2. **Webhook handler** fetches PR diff, generates AI description via OpenAI
3. **AI description** posted as PR comment and stored in Supabase
4. **Dashboard** displays repos, PRs, and generated changelogs
5. **Changelog generation** groups merged PRs and generates release notes

## Pricing

- **Free** — Open source repos
- **$29/mo Pro** — Individual developers, private repos
- **$79/mo Team** — Small teams, multiple installations

## License

MIT
