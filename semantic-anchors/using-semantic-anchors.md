---
title: Using Semantic Anchors
description: Guides Kiro to name established methods instead of describing them, spelling out only the delta
category: semantic-anchors
tags:
  - semantic-anchors
  - steering
  - prompt-engineering
  - token-efficiency
inclusion: manual
version: 1.0.0
---

## Core Principle

**Kiro names an established concept instead of re-describing it, and spells out only the delta where your project diverges from the canonical definition.** A model already carries a rich, shared understanding of well-known methods. Saying "Conventional Commits" loads that whole specification in two words. Re-explaining it in a paragraph wastes tokens, invites drift, and can contradict what the model already knows.

A semantic anchor is a term that reliably triggers a large, agreed-upon body of knowledge in the model. Steering documents get shorter, sharper, and easier to maintain when they lean on anchors and reserve prose for the parts a model cannot guess.

## RULES

You MUST follow these rules when writing steering content with semantic anchors:

1. You MUST name an established method by its canonical term instead of describing its rules from scratch.

2. You MUST spell out only the delta: the specific ways your project diverges from the anchor's canonical definition.

3. You MUST run the Anchor Validity Test (Precise, Rich, Consistent, Attributable) before treating a term as an anchor.

4. You MUST verify a model recognizes an anchor by asking it what concepts it associates with the term BEFORE relying on it.

5. You MUST NOT reduce content that requires deterministic validation (markdownlint rule IDs, JSON or YAML shape) to a bare anchor name.

## How Kiro Will Write With Semantic Anchors

### Name It, Don't Describe It

**Replace a long instruction with the anchor that triggers it**: When a model already knows the method, the name is the instruction.

```text
# Before (prose, ~55 words):
When you write commit messages, start with a type such as feat, fix, or
docs, add an optional scope in parentheses, then a colon and a short
imperative summary, leave a blank line, write a body that explains what
changed and why, and flag breaking changes with an exclamation mark or a
BREAKING CHANGE footer.

# After (anchor, 3 words):
Follow Conventional Commits.
```

Both instructions produce the same behavior from a model that knows the spec. The anchor version costs a fraction of the tokens and never drifts out of sync with the upstream definition.

### Spell Out Only the Delta

**Name the anchor, then state the divergence**: Keep the canonical definition implicit and make only your house-specific change explicit.

```text
# Anchor + delta:
Follow Conventional Commits, with one change: every commit footer MUST
include the Jira ticket ID (for example, "Refs: PROJ-123").
```

Here the convention matches Conventional Commits almost entirely. The only thing the model could not have guessed is the required Jira footer, so that single delta is the only thing written out.

### The Anchor Validity Test

**A term is a usable anchor only if it passes four checks**:

1. **Precise**: it points to one specific, well-bounded concept rather than a vague aspiration.

2. **Rich**: it unpacks into substantial detail the model can apply, not just a label.

3. **Consistent**: independent sources agree on what it means, so the definition is stable.

4. **Attributable**: it traces to a nameable specification, author, or community you can point to.

Terms that fail this test only look like instructions. Two examples that are NOT anchors:

- **"best practices"**: fails Precise and Consistent. Everyone agrees it sounds good, but no two readers expand it into the same rules.

- **"make it simple"**: fails Rich and Attributable. It carries a mood, not a method, and points to no shared body of knowledge.

A third common offender is **"TLDR"**: it signals brevity but defines no concrete behavior, so it fails Precise and Rich. When a term fails the test, write the behavior out instead of pretending the name carries it.

### Three-Tier Classification

**Classify every steering rule before deciding how to write it**: The tier tells you whether to name, name-plus-delta, or write it all out. The examples below are drawn from this repository.

- **Tier 1 — an established anchor exists and prose is redundant.** Name the anchor and stop. The repository's `practices/workflows/git-commit-standards.md` is Conventional Commits; `practices/workflows/semantic-versioning-standards.md` is SemVer. A model already knows both specifications in full.

- **Tier 2 — an anchor exists but your project adds a delta.** Name the anchor, then state only the divergence. The repository's `code-formatting/languages/python-formatting.md` is PEP 8 plus a few house specifics; `practices/testing/testing-best-practices.md` is the Testing Pyramid plus the house rule "don't over-test".

- **Tier 3 — no anchor exists, so the content itself is the signal.** Write it out in full, because there is nothing for the model to recall. The repository's markdown formatting docs depend on specific markdownlint MD-rule IDs and the getDiagnostics workflow; the JSON and YAML formatting docs encode arbitrary house choices (indent width, key ordering) that no spec dictates.

### Keep Deterministic Content Written Out

**Never anchor away a rule that a tool must verify byte for byte**: Tier 3 content is non-negotiable. Markdownlint rule IDs such as MD047 and MD012, and the exact shape of JSON or YAML output, must stay spelled out in the steering document. A bare anchor name cannot be checked by a linter, and the model has no canonical source to reconstruct your specific choices. Reducing this content to a label silently drops the rule.

### Verify Recognition Before You Rely on an Anchor

**Ask the model what it knows, then trust the name**: Before you replace a paragraph with an anchor, prompt the model with a question like "What concepts and rules do you associate with the term X?" Read the answer. If it returns the detail you expected, the anchor is safe to use. If it returns something vague, partial, or wrong, the term is not a reliable anchor for that model. Keep the prose until the term proves itself.

## What This Prevents

- **Token waste** from re-describing methods the model already knows in full.

- **Definition drift** where a hand-written paraphrase slowly contradicts the upstream specification.

- **False anchors** from vague terms like "best practices" that read like instructions but carry no shared meaning.

- **Silent rule loss** from collapsing deterministic, tool-checked content into a name a linter cannot verify.

- **Misplaced trust** in a term the model does not actually recognize.

## Simple Examples

### Before/After: A Versioning Rule (Tier 1)

```text
# Before (prose):
Use a three-part version number. Increase the first part for breaking
changes, the second for backward-compatible features, and the third for
backward-compatible bug fixes.

# After (anchor):
Follow SemVer.
```

### Before/After: A Formatting Rule With a Delta (Tier 2)

```text
# Before (prose):
Indent with four spaces, group imports as standard library, third party,
then local, keep lines reasonably short, and use snake_case for functions.

# After (anchor + delta):
Follow PEP 8, with one delta: cap lines at 100 characters instead of 79.
```

### When NOT to Anchor (Tier 3)

```text
# Keep this written out; there is no anchor and a linter must verify it:
End every markdown file with exactly one trailing newline (MD047) and
never use multiple consecutive blank lines (MD012).
```

## Customization

This is a starting point for applying semantic anchors in your own steering documents. You can extend it by:

- Building a short project glossary of anchors your team relies on, with their deltas.

- Recording which anchors your chosen model recognized during the verification step.

- Adding domain-specific anchors (for example, a framework convention or an internal standard) once they pass the Anchor Validity Test.

## Attribution and Further Reading

This technique is adapted from the [Semantic Anchors catalog](https://llm-coding.github.io/Semantic-Anchors/) by Ralf D. Müller and the LLM Coding community, and from the AWS Builder Center article [Semantic Anchors + Kiro Steering: Name It, Don't Describe It](https://builder.aws.com/content/3EaYQWyHxuupPXSl8x2e5qktcIw/semantic-anchors-kiro-steering-name-it-dont-describe-it) by Jörn Krüger. The summaries here are paraphrased; see the original sources for the full catalog and walkthrough.
