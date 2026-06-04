# Semantic Anchors Validation Report

Validation gate for PRD #3 (issue #6). This report records three checks against
the two wave-1 semantic-anchors documents: anchor recognition (Part A), tooling
gates (Part B), and an additive-only audit (Part C).

Documents under review:

- `semantic-anchors/using-semantic-anchors.md`
- `semantic-anchors/semantic-contracts-for-kiro.md`

## Part A: Anchor Recognition Check

Each referenced term was assessed against the Anchor Validity Test (Precise,
Rich, Consistent, Attributable). The assessor is a current LLM judging from its
own training knowledge, as required by R6.5. A term PASSES when it names one
well-bounded concept, expands into substantial reusable detail, is agreed on by
independent sources, and traces to a nameable specification, author, or
community.

| Anchor                | Attribution               | Verdict |
| --------------------- | ------------------------- | ------- |
| Cockburn Use Cases    | Alistair Cockburn         | PASS    |
| EARS                  | Mavin et al., Rolls-Royce | PASS    |
| Gherkin               | Dan North / Cucumber      | PASS    |
| C4 Diagrams           | Simon Brown               | PASS    |
| ADR                   | Michael Nygard            | PASS    |
| Conventional Commits  | conventionalcommits.org   | PASS    |
| Semantic Versioning   | Tom Preston-Werner        | PASS    |

### Cockburn Use Cases

The term activates Alistair Cockburn's "Writing Effective Use Cases": primary
and supporting actors, goals, scope, goal levels (sea-level, fish, kite), the
main success scenario, extensions, preconditions, and stakeholder interests. It
is precise, richly detailed, consistently described across sources, and
attributable to a named author and book. Verdict: PASS.

### EARS (Easy Approach to Requirements Syntax)

The term activates the EARS templates from Alistair Mavin and colleagues at
Rolls-Royce: ubiquitous, event-driven (WHEN), state-driven (WHILE), unwanted
behavior (IF/THEN), and optional-feature (WHERE) requirements, all in the
"the system SHALL" form. It is precise, rich, consistent, and attributable.
Verdict: PASS.

### Gherkin (Given/When/Then)

The term activates the Gherkin language used by Cucumber and BDD: Feature,
Scenario, Given/When/Then/And/But steps, scenario outlines, and executable
specifications tied to step definitions. It is precise, rich, consistent across
the BDD community, and attributable. Verdict: PASS.

### C4 Diagrams (Simon Brown)

The term activates Simon Brown's C4 model: the System Context, Container,
Component, and Code abstraction levels for describing software architecture at
increasing zoom, plus its tooling such as Structurizr. It is precise, rich,
consistent, and attributable. Verdict: PASS.

### ADR / Architecture Decision Records (Michael Nygard)

The term activates Michael Nygard's lightweight decision record: a short,
numbered file per significant decision capturing Title, Status, Context,
Decision, and Consequences, stored alongside the code. It is precise, rich,
consistent, and attributable. Verdict: PASS.

### Conventional Commits

The term activates the Conventional Commits specification: the
`type(scope): description` header, types such as feat and fix, the
`BREAKING CHANGE` footer, and the mapping from commit types to SemVer bumps. It
is precise, rich, consistent, and attributable to a published spec. Verdict:
PASS.

### Semantic Versioning (SemVer)

The term activates Tom Preston-Werner's SemVer specification: the
MAJOR.MINOR.PATCH scheme, the rules for breaking changes, backward-compatible
features, and fixes, plus pre-release and build-metadata suffixes. It is
precise, rich, consistent, and attributable. Verdict: PASS.

### Part A Outcome

All seven referenced terms PASS the Anchor Validity Test. No findings were
raised, and no anchor needs replacement or conversion to a local-definition
contract. This confirms the documents reference only genuine, recognized
semantic anchors.

## Part B: Tooling Gates

### Gate 1: Steering Validator

Command run from the worktree root:

```text
python tools/validate-steering.py semantic-anchors
```

Result (exit code 0):

```text
✓ semantic-anchors\semantic-contracts-for-kiro.md is valid
✓ semantic-anchors\using-semantic-anchors.md is valid

✓ All files are valid
```

Gate 1: PASS.

### Gate 2: Markdown Lint

The repository pins `markdownlint-cli@0.43.0` (see `package.json` and the
`DavidAnson/markdownlint-cli2-action` CI step), and the rule set is defined in
`.markdownlint.json`. Running the repository's pinned linter:

```text
npx markdownlint-cli@0.43.0 "semantic-anchors/**/*.md" "README.md"
```

Result: exit code 0, no errors. The two semantic-anchors documents and the
README pass cleanly under the enforced rule set.

A newer `markdownlint-cli2@0.22.1` (auto-fetched by `npx`) additionally reports
39 `MD060/table-column-style` findings, all in pre-existing `README.md` tables.
`MD060` is a rule introduced after the repository's pinned linter version and is
not part of the enforced configuration. Zero findings fall in either
semantic-anchors document. This is noted for transparency and does not affect
the gate.

Gate 2: PASS.

## Part C: Additive-Only Check

Command run from the worktree root:

```text
git diff --name-status main...HEAD
```

Changed paths:

```text
M       .github/workflows/ci.yml
M       .github/workflows/validate-pr.yml
M       .gitignore
A       AGENTS.md
A       CONTEXT.md
M       README.md
M       categories.json
A       docs/adr/0001-semantic-anchors-first-class-category.md
A       docs/agents/domain.md
A       docs/agents/issue-tracker.md
A       docs/agents/project-board.md
A       docs/agents/ship-style.md
A       docs/agents/triage-labels.md
A       semantic-anchors/README.md
A       semantic-anchors/semantic-contracts-for-kiro.md
A       semantic-anchors/using-semantic-anchors.md
M       tools/validate-steering.py
```

Every changed path falls inside the allowed set: under `semantic-anchors/`,
`README.md` (index rows only), `categories.json`, `tools/validate-steering.py`,
the two CI workflows, `AGENTS.md`, `CONTEXT.md`, `docs/adr/**`, `docs/agents/**`,
and `.gitignore`. The `README.md` change adds only a category bullet and two
index table rows for the new documents.

No file under `practices/`, `code-formatting/`, or `agents/` was modified.

Part C: PASS (additive only).

## Overall Verdict

PASS. All seven anchors are recognized, both tooling gates pass under the
repository's enforced configuration, and the feature is additive only with no
existing steering document modified.
