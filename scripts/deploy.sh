#!/usr/bin/env bash
set -euo pipefail

echo "=== DocuCraft Deployment Setup ==="
echo ""

# Check prerequisites
echo "=== Checking prerequisites ==="
command -v gh >/dev/null 2>&1 || { echo "Missing: gh (GitHub CLI)"; exit 1; }
command -v vercel >/dev/null 2>&1 || { echo "Missing: vercel (Vercel CLI)"; exit 1; }
command -v supabase >/dev/null 2>&1 || { echo "Missing: supabase (Supabase CLI)"; exit 1; }
command -v railway >/dev/null 2>&1 || { echo "Missing: railway (Railway CLI)"; exit 1; }
echo "All prerequisites installed."
echo ""

echo "=== Step 1: Create a Supabase project ==="
echo "1. Go to https://supabase.com/dashboard/projects"
echo "2. Click 'New Project'"
echo "3. Name: docucraft"
echo "4. Set a strong database password"
echo "5. Choose region closest to you"
echo "6. After creation, go to Project Settings > API"
echo "7. Copy: Project URL, anon key, service_role key"
echo ""

echo "=== Step 2: Create a GitHub App ==="
echo "1. Go to https://github.com/settings/apps/new"
echo "2. GitHub App name: DocuCraft"
echo "3. Homepage URL: https://docucraft.dev"
echo "4. Webhook URL: https://docucraft.dev/api/github/webhook"
echo "5. Webhook secret: generate with: openssl rand -hex 32"
echo "6. Permissions:"
echo "   - Pull requests: Read & Write"
echo "   - Contents: Read-only"
echo "   - Metadata: Read-only"
echo "   - Checks: Read & Write"
echo "7. Subscribe to events: Pull request"
echo "8. Where can this App be installed?: Any account"
echo "9. After creation, generate a private key"
echo "10. Copy: App ID, Client ID, Client Secret, Private Key, Webhook Secret"
echo ""

echo "=== Step 3: Set up Vercel deployment ==="
echo "vercel login"
echo "vercel link --project docucraft"
echo "vercel env add NEXT_PUBLIC_SUPABASE_URL"
echo "vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "vercel env add SUPABASE_SERVICE_ROLE_KEY"
echo "vercel env add GITHUB_APP_ID"
echo "vercel env add GITHUB_APP_CLIENT_ID"
echo "vercel env add GITHUB_APP_CLIENT_SECRET"
echo "vercel env add GITHUB_APP_PRIVATE_KEY"
echo "vercel env add GITHUB_APP_WEBHOOK_SECRET"
echo "vercel env add OPENAI_API_KEY"
echo "vercel env add NEXT_PUBLIC_APP_URL"
echo "vercel --prod"
echo ""

echo "=== Step 4: Deploy Supabase migrations ==="
echo "supabase link --project-ref <your-project-ref>"
echo "supabase db push"
echo ""

echo "=== Step 5: Update Railway environment variables ==="
echo "railway login"
echo "railway link"
echo "railway variables --set NEXT_PUBLIC_SUPABASE_URL=..."
echo "railway variables --set SUPABASE_SERVICE_ROLE_KEY=..."
echo "railway variables --set GITHUB_APP_PRIVATE_KEY=..."
echo "# ... set all other vars ..."
echo ""

echo "=== Step 6: Install the GitHub App ==="
echo "1. Go to your GitHub App's public page"
echo "2. Click 'Install' on your account/org"
echo "3. Select repos to grant access"
echo ""

echo "=== Done! ==="
echo "Your DocuCraft instance should now be live."
echo "Test it by opening a PR on a connected repo."
