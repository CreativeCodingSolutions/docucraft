#!/usr/bin/env bash
set -euo pipefail

# Bump comments for 23 outreach issues
# Run from projects/docucraft/

BUMP_MSG=$(cat <<'EOF'
Hi! Following up on my previous suggestion about DocuCraft. Just wanted to gently check if you had a chance to look at it. It's a free, open-source GitHub Action that auto-generates PR descriptions from diffs — zero config, just add one step to your workflow.

Would love to hear any thoughts! Happy to help with setup if needed.

https://github.com/CreativeCodingSolutions/docucraft
EOF
)

bump_issue() {
  local repo="$1"
  local number="$2"
  echo "--- Bumping $repo#$number ---"
  if gh issue comment "$number" --repo "$repo" --body "$BUMP_MSG" 2>&1; then
    echo "✓ $repo#$number bumped"
  else
    echo "✗ Failed to bump $repo#$number"
  fi
}

bump_issue "MohammadBahemmat/V2ray-Collector" 8
bump_issue "ipitio/backage" 43
bump_issue "LindseyB/dummy" 26
bump_issue "DoubleGremlin181/DoubleGremlin181" 14
bump_issue "melogabriel/tinfoil-shops-status" 26
bump_issue "Sabyasachi-Seal/Repository_Views" 7
bump_issue "orenlab/codeclone" 38
bump_issue "Samsung/Universum" 865
bump_issue "membrowse/membrowse-action" 163
bump_issue "hyrfilm/skivvy" 73
bump_issue "Khabib73/YATL" 127
bump_issue "SAP/InfraBox" 613
bump_issue "mmkal/artifact.ci" 23
bump_issue "nrwl/nx-recipes" 103
bump_issue "helsinki-systems/nc4nix" 16
bump_issue "omnistrate-oss/omnistrate-ctl" 668
bump_issue "bitrise-io/stepman" 390
bump_issue "bob-cd/wendy" 26
bump_issue "bitrise-io/envman" 252
bump_issue "hashmap-kz/relimpact" 78
bump_issue "CodSpeedHQ/codspeed" 419
bump_issue "loadingalias/cargo-rail" 13
bump_issue "blake-mealey/mantle" 249

echo ""
echo "=== All 23 bumps attempted ==="
