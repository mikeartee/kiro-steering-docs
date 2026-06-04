---
title: Semantic Contracts for Kiro
description: Publishes three reusable, Kiro-scoped semantic contracts mapped onto Kiro's native Requirements and Design spec workflow
category: semantic-anchors
tags:
  - semantic-anchors
  - semantic-contracts
  - kiro
  - specs
  - steering
inclusion: manual
version: 1.0.0
---

## Core Principle

**A Semantic Contract is a project-scoped definition of what a term means in this repository — pinned once, then reused by name.** A contract either composes established [semantic anchors](https://llm-coding.github.io/Semantic-Anchors/) into one repo term (a composition contract), or ships a custom definition for a house convention that has no upstream anchor (a local-definition contract).

Anchors work because the named method already lives in the model's training data: say "EARS" and Kiro recalls the syntax without being taught it. A coined contract name has no such backing, so it only works when its body travels with it. This document publishes three contracts for use inside Kiro's native spec workflow, where requirements and design live under `.kiro/specs/` and shared rules live under `.kiro/steering/`.

## The Iron Rule

**A coined contract name MUST always ship its definition in-repo, and MUST NEVER be used as a bare label.**

Unlike a real anchor, a coined name is absent from the model's training data. Drop a name like `Kiro Spec Requirements` into a prompt with nothing attached and it activates nothing — it is a dead label that steers Kiro nowhere. So every place a contract name appears, the steering or spec file must also carry the contract's body: the anchors it composes, or the full local definition.

You MUST follow these rules when working with semantic contracts:

- You MUST keep a contract's full body in-repo wherever its name is used

- You MUST list the upstream anchors a composition contract bundles

- You MUST ship the complete inline definition for a local-definition contract

- You MUST NOT reference a coined contract name as a bare label with no body

## What Is a Semantic Contract

### Composition contract

A composition contract gathers two or more existing anchors under one repository term. The anchors do the heavy lifting in the model; the contract name is shorthand for "all of these, together, in this repo's order." Because the shorthand is coined, the contract always restates which anchors it bundles.

### Local-definition contract

A local-definition contract covers a house convention that has no upstream anchor to name. There is nothing in the model to activate, so the contract ships the entire rule set inline. The repo is the single source of truth for that term.

## How Kiro Will Write Semantic Contracts

When a spec or steering file touches one of these areas, Kiro will name the contract and restate its body in the same place. Kiro will frame each contract against the matching phase of Kiro's native Requirements then Design spec workflow, not any external publishing toolchain.

```text
# Kiro will write:
Apply the Kiro Spec Requirements contract (anchors: Cockburn Use Cases,
EARS, Gherkin) — write each acceptance criterion in EARS.

# Not (dead label, no body):
Apply the Kiro Spec Requirements contract.
```

### Contract 1: Kiro Spec Requirements (composition)

This contract governs the Requirements phase, where Kiro already drafts acceptance criteria in EARS natively. It bundles three requirements anchors so a `requirements.md` reads consistently from goal to testable behavior.

Anchors it references:

- Cockburn Use Cases — actor and goal framing for each capability

- EARS (Easy Approach to Requirements Syntax) — the "WHEN/IF ... THEN the system SHALL ..." form Kiro writes for acceptance criteria

- Gherkin — Given/When/Then scenarios for concrete examples

How Kiro will write it: state the use case actor and goal, capture the rules as EARS acceptance criteria, and add Gherkin scenarios for the cases worth pinning by example.

```text
# Kiro will write (Requirements phase):
Use case: As a registered user, I want to reset my password.

Acceptance criteria (EARS):
- WHEN a user requests a reset THEN the system SHALL email a single-use link.
- IF the link is older than 30 minutes THEN the system SHALL reject it.

Scenario (Gherkin):
  Given an expired reset link
  When the user opens it
  Then they see a "link expired" message
```

### Contract 2: Kiro Spec Design (composition)

This contract governs the Design phase, where Kiro turns approved requirements into an architecture. It bundles two design anchors so a `design.md` shows both the shape of the system and the reasoning behind the choices.

Anchors it references:

- C4 Diagrams — Context, Container, Component, and Code views for describing structure at the right zoom level

- ADR (Architecture Decision Records, Michael Nygard) — one short record per significant decision, capturing context, the decision, and its consequences

How Kiro will write it: sketch the relevant C4 level for the change, then record each significant choice as an ADR so the design carries its own rationale.

```text
# Kiro will write (Design phase):
C4 (Container): Web app -> Auth API -> Token store (Redis).

ADR-007: Use single-use, time-boxed reset tokens
  Context: links were reusable and long-lived.
  Decision: 30-minute, single-use tokens stored server-side.
  Consequences: safer resets; needs a token store and cleanup job.
```

### Contract 3: Kiro Markdown Discipline (local-definition)

This is a house convention with no upstream anchor, so the full definition ships inline. It names the repository's markdownlint rules that matter most for steering docs, plus the verification step Kiro runs after writing markdown. Because this is a local-definition contract, the rules below are the contract — there is nothing else to look up.

The contract:

- MD047 — every markdown file ends with exactly one trailing newline

- MD012 — never use multiple consecutive blank lines

- MD032 — surround every list with blank lines (before the first item and after the last)

- Verification — run `getDiagnostics` after writing or editing any markdown file, and fix every reported issue before moving on

How Kiro will write it: produce clean markdown on the first pass, then confirm with `getDiagnostics` rather than relying on a later CI run to catch formatting slips.

```text
# Kiro will do:
1. Write the file with blank lines around headings, lists, and code fences.
2. End the file with exactly one trailing newline.
3. Run getDiagnostics and fix any MD047 / MD012 / MD032 findings.

# Not:
Write the file and commit without checking diagnostics.
```

## Inclusion and Opt-In

This document ships `inclusion: manual`, so it loads only when you reference it. That keeps contracts out of unrelated prompts and is the recommended default.

To make a contract activate automatically during spec work, switch the frontmatter to `fileMatch` and scope it to spec paths. The contract then loads only while those files are open or being edited:

```yaml
---
title: Semantic Contracts for Kiro
description: Reusable, Kiro-scoped semantic contracts for the spec workflow
category: semantic-anchors
tags:
  - semantic-anchors
  - semantic-contracts
inclusion: fileMatch
fileMatchPattern: ".kiro/specs/**"
---
```

The shipped default stays `manual`; treat the `fileMatch` form above as an opt-in you copy into your own `.kiro/steering/` when you want hands-free activation.

## What This Prevents

- **Dead labels** — coined names used with no body, which activate nothing in the model

- **Drifting definitions** — the same repo term meaning different things in different specs

- **Re-describing anchors** — re-explaining EARS, C4, or ADR in prose when naming them is enough

- **Phase mismatch** — requirements anchors leaking into design, or design anchors into requirements

- **Markdown rework** — MD047, MD012, and MD032 failures slipping through to CI

## Customization

This is a starting point with no required installs. You can adapt it by:

- Adding or swapping anchors inside the composition contracts to match your team's requirements and design style

- Defining new local-definition contracts for your own house conventions

- Switching a contract to `fileMatch` so it auto-activates during spec work

- Renaming contracts to your team's vocabulary, as long as the body always travels with the name

## Attribution

This document builds on the [Semantic Anchors catalog](https://llm-coding.github.io/Semantic-Anchors/) by Ralf D. Müller and the LLM Coding community, and specifically adapts its "Semantic Contracts" concept to Kiro's spec workflow. It was also informed by the AWS Builder Center article [Semantic Anchors + Kiro Steering: Name It, Don't Describe It](https://builder.aws.com/content/3EaYQWyHxuupPXSl8x2e5qktcIw/semantic-anchors-kiro-steering-name-it-dont-describe-it) by Jörn Krüger. Descriptions here are paraphrased rather than quoted.
