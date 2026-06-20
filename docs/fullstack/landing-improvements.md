# Landing Page Improvements

## Sections Added

### 1. Before / After PR Comparison (`PRCompare.tsx`)
- **Location**: Landing page, between Features and CompareSection
- **What it does**: Side-by-side slider comparing a bad PR description ("fixed stuff") vs DocuCraft's structured output
- **Implementation**: Custom slider component using mouse/touch events, similar pattern to existing Compare UI but renders markdown text instead of images
- **UX**: Drag slider left/right to reveal before (left) vs after (right) — immediately sells the value proposition

### 2. Quick Start (`QuickStart.tsx`)
- **Location**: Landing page, after CompareSection and before HowItWorks
- **What it does**: Two copy-pasteable YAML snippets in side-by-side cards
  - Left: Minimal 3-line workflow (quick start, zero config)
  - Right: Full workflow with auto-labeling and detailed style
- **UX**: Each card has a Copy button that writes to clipboard, syntax-highlighted code blocks

## action.yml Fix

### Output from both modes
- **Problem**: `outputs.description` only referenced `steps.generate.outputs.description` (template mode). AI mode set its output on `steps.generate-ai.outputs.description` but the main output didn't fall back to it.
- **Fix**: Added a new `set-output` step that reads from template step first, falls back to AI step. Both `outputs.description` and the "Update PR body" step now reference `steps.set-output.outputs.description`.

## Dogfooding

### Fix: action.yml output handling (this PR)
- Ensures downstream workflow steps can reliably use `steps.docucraft.outputs.description` regardless of whether template or AI mode was used

### Fix: README Quick Start line count
- Changed "Copy this 5-line workflow" to "Copy this workflow" — the YAML block is 15 lines, not 5
