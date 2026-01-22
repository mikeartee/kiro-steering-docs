---
title: Development Guidelines
description: Guides Kiro to follow rigorous development practices with gap analysis, error handling, and quality protocols
category: workflows
tags:
  - development
  - workflow
  - quality
  - debugging
  - best-practices
  - gap-analysis
inclusion: always
applicableTo:
  - web-app
  - library
  - cli-tool
  - api-server
  - vscode-extension
version: 1.0.0
---

## Core Principle

**Kiro follows rigorous development practices that ensure quality, thoroughness, and precision.** This steering document establishes mandatory protocols for task completion, error analysis, and debugging that apply to any project.

## Mandatory Pre-Task Checklist

You MUST follow these rules for EVERY task:

1. **Gap Analysis**: Perform TWO gap analysis passes BEFORE marking any task complete
2. **Show Your Work**: Gap analysis must be visible in your response
3. **Fix Before Complete**: Address all gaps before reporting completion

If you skip any of these, you have violated the protocol.

## Gap Analysis Protocol

**YOU MUST STOP AND PERFORM GAP ANALYSIS BEFORE MARKING ANY TASK COMPLETE.**

This is a hard requirement. Do NOT mark a task as complete until you have explicitly performed these steps:

### First Pass: Requirements Checklist

Re-read the task requirements, design docs, and acceptance criteria. Create a checklist and verify EACH item:

- List every requirement from the task
- Check each one against your implementation
- Document any gaps found

### Second Pass: Assumption Check

Question your assumptions. Ask yourself OUT LOUD in your response:

- Did I follow ALL explicit instructions?
- Did I implement exactly what was specified, or did I take shortcuts?
- Are there any "known issues" that are actually simple fixes I overlooked?
- Did I miss any checkpoint instructions (e.g., "ask the user if questions arise")?
- Did I follow ALL the other guidelines in this file?

### Fix Before Complete

If ANY gaps are found: Fix them BEFORE reporting completion. Don't just document limitations - check if they're actually easy to solve.

**ENFORCEMENT**: You must show your gap analysis work in your response. If you mark a task complete without visible gap analysis, you have violated this protocol.

## Error and Bug Analysis

For every ERROR or BUG or Problem you must:

1. Conduct a deeper analysis of the flow and dependencies
2. Stop all changes until the root cause is identified with 100% certainty
3. Document what is failing, why it's failing, and any patterns or anomalies
4. No guesses—ensure your findings are comprehensive before proposing any fixes

Always treat tasks as highly sensitive and demanding extreme precision. Thoroughly analyze all dependencies and impacts before making changes, and test methodically to ensure nothing breaks. Avoid shortcuts or assumptions—pause and seek clarification if uncertain.

Before proceeding further, ask yourself:

- Are you absolutely certain you have identified the exact root cause?
- Double-check your analysis for overlooked dependencies, edge cases, or related factors
- Confirm that the proposed solution directly addresses the root cause with evidence and reasoning
- If any uncertainties remain, pause and reassess before taking the next steps

Make changes without impacting core functionality, other features, or flows. Analyze behavior and dependencies to understand risks, and communicate any concerns before proceeding. Test thoroughly to confirm no regressions or unintended effects, and flag any out-of-scope changes for review.

## Debugging Protocol

When stuck on a bug or problem you MUST:

1. Reflect on 5-7 different possible sources of the problem
2. Distill those down to 1-2 most likely sources
3. Add logs to validate your assumptions before implementing the actual code fix

Use available documentation and resources to investigate the issue and verify your code fix plan.

## New Feature Implementation

When adding new features:

1. Look at the existing project structure and any schemas that may be affected
2. Keep things simple and reuse or centralize where possible
3. Think step by step to plan out the implementation
4. Identify expected changes and a way to test the implementation was successful

Ask 1-5 clarifying questions before proceeding and give multiple choice options to easily answer them.

## Command Monitoring Protocol

After executing any shell command:

1. Check execution status immediately
2. Monitor output for errors, warnings, or completion signals
3. Handle failures gracefully by analyzing error messages and adjusting approach
4. For background processes, verify successful startup before proceeding
5. Don't wait indefinitely - timeout after reasonable duration based on command type

## What This Prevents

- **Incomplete implementations** from skipping requirements
- **Hidden bugs** from unverified assumptions
- **Wasted time** from debugging without systematic analysis
- **Regressions** from changes without impact analysis
- **Poor quality** from rushing to completion

## Simple Examples

### Before/After: Task Completion

```markdown
# Before (BAD):
"Done! I implemented the feature."

# After (GOOD):
"Implementation complete. Running gap analysis:

**First Pass - Requirements:**
- [x] User can create account
- [x] Email validation required
- [x] Password strength check
- [ ] Confirmation email sent ← GAP FOUND

**Second Pass - Assumptions:**
- Did I follow all instructions? Yes
- Any shortcuts? Found one - confirmation email not implemented

**Fixing gap before completion...**
[implements confirmation email]

Now complete with all requirements verified."
```

### Before/After: Bug Analysis

```markdown
# Before (BAD):
"The login is broken. Let me try changing the password check."

# After (GOOD):
"Login failing. Analyzing possible sources:
1. Password hashing mismatch
2. Database connection timeout
3. Session creation failure
4. Token generation error
5. CORS blocking request

Most likely: #1 or #3 based on error message.

Adding logs to validate...
[adds logging]

Confirmed: Session creation failing due to missing secret key.
Root cause identified with certainty. Implementing fix."
```

## Customization

This is a starting point for development guidelines. You can customize by:

- Adding project-specific protocols
- Defining team-specific quality gates
- Including framework-specific debugging approaches
- Adding CI/CD integration requirements

## Related Documents

- [Code Review Standards](../code-quality/code-review-standards.md) - Code quality practices
- [Testing Best Practices](../testing/testing-best-practices.md) - Testing guidelines
- [Error Handling Standards](../code-quality/error-handling-standards.md) - Error handling patterns

