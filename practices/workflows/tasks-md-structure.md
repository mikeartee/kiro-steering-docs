---
title: Tasks.md Structure Standards
description: Guides Kiro to create well-structured tasks.md files with mandatory protocols and development principles
category: workflows
tags:
  - tasks
  - implementation
  - workflow
  - spec
  - planning
inclusion: fileMatch
fileMatchPattern: "**/tasks.md"
applicableTo:
  - web-app
  - library
  - cli-tool
  - api-server
  - vscode-extension
version: 1.0.0
---

## Core Principle

**Kiro creates tasks.md files with consistent structure, mandatory protocols, and clear development principles.** This ensures implementation plans are actionable, safe, and follow established quality standards.

## How Kiro Will Write tasks.md Files

### Required Header Structure

Every tasks.md file MUST begin with these sections in order:

```markdown
# Implementation Plan: {Feature Name}

## ⚠️ MANDATORY - READ BEFORE EVERY TASK ⚠️

**YOU MUST FOLLOW THESE RULES FOR EVERY TASK:**

1. **Shell Commands**: Use `controlPwshProcess` ONLY. NEVER use `executePwsh`.
2. **Gap Analysis**: Perform TWO gap analysis passes BEFORE marking any task complete.
3. **Show Your Work**: Gap analysis must be visible in your response.

If you skip any of these, you have violated the protocol.

---

## Overview

{Brief description of what this implementation plan covers}

## Development Principles

**IMPORTANT**: Follow these principles strictly during implementation:

1. **Build ugly and working before making it clean**
   - Get it working first
   - Refactor later if needed
   - Don't optimize prematurely

2. **If something isn't specified, ask - don't invent**
   - No assumptions
   - No "improvements"
   - No "I noticed we could also..."

3. **Build exactly what's specified. Nothing more.**
   - No extra features
   - No extra abstractions
   - No extra config options

4. **Stop and ask if stuck for 10+ minutes**
   - Don't waste time debugging hallucinated APIs
   - Use Context7 to check library docs
   - Ask for clarification on ambiguous requirements

5. **Property tests are optional for MVP**
   - Tasks marked with `*` can be skipped
   - Focus on getting core functionality working
   - Add comprehensive tests in v2

## Non-Requirements (What NOT to Build)

To maintain simplicity and focus, this implementation explicitly **DOES NOT** include:

{List items with ❌ prefix for things NOT to build}

**System Characteristics:**

{List items with ✅ prefix for what IS being built}

## Context7 MCP Usage (CRITICAL)

**Before writing ANY code that uses a library, query Context7 for current documentation.**

**Required libraries to query Context7 for:**
{List of libraries relevant to this feature}

**Don't assume you know the API. Don't use outdated patterns. Check Context7 first.**

---

## Tasks

{Task list follows}
```

### Task List Format

Tasks use checkbox syntax with status indicators:

```markdown
## Tasks

- [ ] 1. First task description
  - [ ] 1.1 Subtask one
  - [ ] 1.2 Subtask two
- [ ] 2. Second task description
- [ ]\* 3. Optional task (asterisk indicates optional)
```

**Status indicators:**

- `[ ]` - Not started
- `[-]` - In progress
- `[x]` - Completed
- `[~]` - Queued
- `[ ]\*` or `[ ]*` - Optional task (can be skipped)

### Non-Requirements Section

Always include a "Non-Requirements" section to prevent scope creep:

```markdown
## Non-Requirements (What NOT to Build)

❌ Feature that's out of scope
❌ Premature optimization
❌ External service integration (unless specified)
❌ Configuration for things with one obvious answer
❌ Abstractions "for future flexibility"
❌ Features "we might need later"
```

### Context7 Section

Include Context7 guidance when external libraries are involved:

```markdown
## Context7 MCP Usage (CRITICAL)

**Before writing ANY code that uses a library, query Context7 for current documentation.**

**Required libraries to query Context7 for:**
- `library-name` - What to query for

**Example Context7 queries:**
- "library-name configuration and setup"
- "library-name specific feature usage"
```

## What This Prevents

- **Scope creep** from undefined boundaries
- **Wasted time** from debugging without proper analysis
- **Broken builds** from using wrong shell commands
- **Incomplete tasks** from skipping gap analysis
- **Outdated code** from not checking current library docs
- **Over-engineering** from building unspecified features

## Customization

Adapt these sections for your specific project:

- **Non-Requirements**: List what's explicitly out of scope for your feature
- **Context7 libraries**: List the specific libraries your feature uses
- **System Characteristics**: Define what IS being built
- **Overview**: Describe your specific implementation

## Related Documents

- [Development Guidelines](development-guidelines.md) - Core development protocols
- [Git Commit Standards](git-commit-standards.md) - Commit message format
