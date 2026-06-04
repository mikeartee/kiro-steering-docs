# Make `semantic-anchors` a first-class category rather than reusing an existing one

We added `semantic-anchors` as a new top-level category — registering it in `categories.json`, adding it to `VALID_CATEGORIES` in `tools/validate-steering.py`, and wiring the folder into both CI workflows — instead of placing the new docs under an existing category like `workflows`. We did this so the category name is accurate and CI-enforced, accepting that it edits shared tooling inside an otherwise additive, docs-only contribution.

## Status

accepted

## Considered Options

- **Reuse `workflows`** (zero tooling change): the docs would declare a misleading `category: workflows` to satisfy the validator's fixed enum. Rejected — inaccurate, and it hides a genuinely new kind of content.
- **Relax the validator** so `semantic-anchors` docs skip the category/section checks. Rejected — weakens a shared quality gate.
- **First-class category** (chosen): accurate, discoverable, and enforced by the same checks as every other category.

## Consequences

- `categories.json` and `tools/validate-steering.py` must stay in sync whenever categories change; they are now two sources of the same truth.
- The required-section check still applies, so both new docs must carry `## Core Principle`, `## How Kiro Will Write …`, and `## What This Prevents` (see the doc framing in the requirements).
- A pre-existing CI quirk was observed but deliberately left untouched: `validate-pr.yml` runs `validate-steering.py categories`, but no `categories/` directory exists. Tracked separately, not fixed here.
