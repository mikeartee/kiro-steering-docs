# Kiro Steering Docs

A community library of reusable steering documents for Kiro. This context covers the library's own vocabulary — especially the Semantic Anchors work — so contributors and agents use consistent terms.

## Language

**Steering Document**:
A markdown file copied into a consumer's `.kiro/steering/` that gives Kiro persistent guidance.
_Avoid_: rule file, config

**Semantic Anchor**:
An established, attributable term that activates knowledge already in an LLM's training data.
_Avoid_: keyword, magic word

**Semantic Contract**:
A project-scoped definition of what a term means in this repo, by composing anchors or shipping a custom definition.
_Avoid_: convention (overloaded with team/company conventions)

**Composition Contract**:
A semantic contract that bundles two or more established anchors under one Kiro-scoped name.
_Avoid_: bundle, preset

**Local-Definition Contract**:
A semantic contract that names a house convention with no upstream anchor and ships its full definition in-repo.

**Delta**:
The part of a convention that diverges from an anchor's canonical definition, and so must be written out.

**Dead Label**:
A coined name used without a shipped definition and absent from training data — activates nothing.
_Avoid_: fake anchor

**Anchor Validity Test**:
The bar a term must clear to be an anchor — Precise, Rich, Consistent, Attributable — checked by asking a model what it associates with the term.

**Tier Classification**:
The three-way sort of steering content — Tier 1 (anchor exists, prose redundant), Tier 2 (anchor + delta), Tier 3 (no anchor, content is the signal).

**Category**:
A top-level directory in this repo AND a required frontmatter value validated against a fixed enum in `tools/validate-steering.py`. The two must stay in sync.
_Avoid_: section, folder (when precision matters)

## Relationships

- A **Semantic Contract** is either a **Composition Contract** or a **Local-Definition Contract**
- A **Composition Contract** references one or more **Semantic Anchors**
- A **Local-Definition Contract** exists because no **Semantic Anchor** covers a **Tier 3** convention
- A **Tier 1** or **Tier 2** doc maps to an existing **Semantic Anchor**; a **Tier 3** doc does not
- A new **Category** requires updating both `categories.json` and the validator's `VALID_CATEGORIES`

## Example dialogue

> **Contributor:** "Can we shrink the markdown doc to an anchor?"
> **Maintainer:** "No — markdown formatting is **Tier 3**. There's no **Semantic Anchor** for our MD047/MD012 rules, so naming it would be a **Dead Label**. It has to be a **Local-Definition Contract** that ships the rules."

## Flagged ambiguities

- "conventions" was avoided as a category name — it collides with team/company conventions. Resolved: the category is **semantic-anchors**.
- "category" means two synced things (a directory and a frontmatter enum value). Resolved: both must be updated together.
