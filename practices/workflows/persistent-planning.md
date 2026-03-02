---
title: Persistent Planning Workflow
description: Guides Kiro to maintain planning files that survive context resets, preventing repeated mistakes and lost progress on multi-step tasks
category: workflows
tags:
  - planning
  - workflow
  - context
  - tasks
  - best-practices
inclusion: manual
contextKey: "@persistent-planning"
applicableTo:
  - web-app
  - library
  - cli-tool
  - api-server
  - vscode-extension
version: 1.0.0
---

# Persistent Planning Workflow

## Core Principle

**For exploratory, multi-step tasks where you're not in a formal Kiro IDE spec flow — debugging sessions, research spikes, open-ended investigations — Kiro creates and maintains three planning files before starting work. These files survive context resets, prevent repeated mistakes, and ensure you never rediscover a dead end you already explored.**

## RULES

You MUST follow these rules for any task with more than two steps:

1. You MUST create `task_plan.md`, `findings.md`, and `progress.md` before starting work
2. You MUST re-read `task_plan.md` before making any major implementation decision
3. You MUST log all errors and dead ends in `findings.md` so they are not repeated
4. You MUST update `progress.md` after each significant step
5. You MUST NOT start implementation until `task_plan.md` exists and is complete

## The Three Files

### task_plan.md

The authoritative source of what needs to be done and in what order.

```text
# Task Plan: {Feature or Task Name}

## Goal

One sentence describing what done looks like.

## Approach

Brief description of the chosen implementation strategy and why.

## Steps

- [ ] 1. First step
- [ ] 2. Second step
- [ ] 3. Third step

## Out of Scope

- Thing we are explicitly not doing
- Another thing to avoid scope creep

## Open Questions

- Question that needs answering before step X
```

### findings.md

A running log of research, decisions, and dead ends. The most important file for preventing repeated mistakes.

```text
# Findings: {Feature or Task Name}

## Key Decisions

- **Decision**: Why we chose approach X over Y
- **Decision**: Why library Z was ruled out

## Dead Ends (Do Not Retry)

- Tried approach A — failed because of reason B
- Tried library C — incompatible with D

## Research Notes

- Relevant API behavior discovered during investigation
- Edge case found that affects step 3
```

### progress.md

Current status at a glance. Useful when resuming after a context reset.

```text
# Progress: {Feature or Task Name}

## Status

In progress / Blocked / Complete

## Last Completed Step

Step 2 — description of what was done

## Next Action

Step 3 — description of what to do next

## Blockers

- Waiting on X before Y can proceed
```

## How Kiro Will Write Persistent Planning Files

### Starting a Task

Before writing any code, Kiro will:

1. Create all three files with the task name filled in
2. Populate `task_plan.md` with goal, approach, steps, and out-of-scope items
3. Note any open questions that need answering first
4. Only then begin implementation

### During a Task

As work progresses, Kiro will:

- Check off completed steps in `task_plan.md`
- Log any dead ends or surprising findings in `findings.md` immediately
- Update `progress.md` after each meaningful step
- Re-read `task_plan.md` before any decision that affects scope or approach

### After a Context Reset

When resuming work, Kiro will:

1. Read `progress.md` first to orient to current state
2. Read `findings.md` to avoid repeating mistakes
3. Read `task_plan.md` to confirm the next step
4. Continue from where progress left off

## What This Prevents

- **Repeated mistakes** from not logging dead ends and failed approaches
- **Context loss** when long sessions reset or switch focus
- **Scope creep** from not defining out-of-scope items upfront
- **Disorientation** when resuming work after a break
- **Rework** from forgetting decisions that were already made

## Simple Example

### Before (no planning files)

```text
Session 1: Tried approach A, failed, switched to B, made progress
Session 2: Context reset. Tried approach A again. Failed again.
           Wasted an hour rediscovering what session 1 already knew.
```

### After (with planning files)

```text
Session 1: Created task_plan.md, findings.md, progress.md.
           Tried approach A, logged failure in findings.md.
           Switched to B, updated progress.md.
Session 2: Read progress.md — immediately oriented.
           Read findings.md — approach A ruled out, skip it.
           Continued from step 3 without any repeated work.
```

## Customization

These files can live anywhere that makes sense for your project — project root, a `planning/` directory, or alongside the feature being built. The names can be adjusted to fit team conventions. What matters is that all three exist and are kept current.

## Related Documents

- [Development Guidelines](development-guidelines.md) - Gap analysis and debugging protocols
- [Tasks.md Structure](tasks-md-structure.md) - Structured implementation task lists
