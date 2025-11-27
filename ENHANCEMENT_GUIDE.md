# Frontmatter Enhancement Guide

This guide explains how to use the frontmatter enhancement system to add recommendation metadata to steering documents.

## Overview

The frontmatter enhancement system automatically adds recommendation metadata to steering documents. This metadata enables the Steering Docs Browser extension to intelligently match documents to user workspaces based on:

- **Required Dependencies**: npm packages or frameworks the document applies to
- **Applicable Project Types**: Types of projects (web-app, library, cli-tool, api-server, vscode-extension)
- **File Patterns**: Glob patterns indicating which files the document is relevant for
- **Tags**: Descriptive tags for categorization and search

## Running the Enhancement Script

### Basic Usage

To enhance all steering documents in the current directory:

```bash
npm run enhance-frontmatter
```

### Dry-Run Mode (Preview Changes)

To preview what changes would be made without writing to files:

```bash
npm run enhance-frontmatter -- --dry-run
```

### Custom Repository Path

To enhance documents in a different directory:

```bash
npm run enhance-frontmatter -- --path /path/to/repository
```

### Help

To see all available options:

```bash
npm run enhance-frontmatter -- --help
```

## Validating Frontmatter

### Running Validation

To validate that all documents have complete and correct frontmatter:

```bash
npm run validate-frontmatter
```

Validation checks for:
- Valid YAML syntax
- Required fields (title, description)
- Minimum number of tags (at least 2)
- Framework documents have requiredDependencies
- All frontmatter is parseable

### Validation in CI/CD

The validation script exits with code 1 if any documents fail validation, making it suitable for CI/CD pipelines.

## Frontmatter Fields

### Required Fields

Every steering document must have:

- **title**: A clear, descriptive title for the document
- **description**: A brief description of what the document covers
- **tags**: An array of at least 2 tags

### Recommendation Metadata Fields

The enhancement system adds these fields:

#### requiredDependencies

An array of npm package names that indicate when this document is relevant.

```yaml
requiredDependencies:
  - react
  - typescript
```

**When to use:**
- For framework-specific documents (React, Vue, Express, etc.)
- For TypeScript documents
- For documents about specific tools or libraries

**When to omit:**
- For language-agnostic documents
- For general best practices that apply everywhere

#### applicableTo

An array of project types this document applies to. Valid values:
- `web-app`: Web applications
- `library`: Reusable libraries and packages
- `cli-tool`: Command-line tools
- `api-server`: Backend API servers
- `vscode-extension`: VS Code extensions

```yaml
applicableTo:
  - web-app
  - library
```

#### filePatterns

An array of glob patterns indicating which files this document is relevant for.

```yaml
filePatterns:
  - "**/*.tsx"
  - "components/**/*"
```

**Common patterns:**
- `**/*.js` - JavaScript files
- `**/*.ts`, `**/*.tsx` - TypeScript files
- `**/*.py` - Python files
- `components/**/*` - Component directories
- `**/*.test.ts` - Test files

## How the Enhancement System Works

### Document Scanning

The system scans these directories:
- `code-formatting/` - Code formatting rules
- `practices/` - Best practice documents
- `agents/` - Agent configuration documents

It excludes:
- `docs/` directory
- `templates/` directory
- Root documentation files (README.md, CONTRIBUTING.md, etc.)

### Metadata Analysis

For each document, the system:

1. **Parses existing frontmatter** - Preserves all existing fields
2. **Analyzes document path and content** - Determines category and subcategory
3. **Applies metadata rules** - Matches against language, framework, and practice rules
4. **Enhances tags** - Adds relevant tags while preserving existing ones
5. **Merges metadata** - Combines new metadata with existing frontmatter
6. **Validates** - Ensures YAML is valid and required fields are present
7. **Writes document** - Saves updated document with proper formatting

### Metadata Rules

#### Language Rules

Documents in `code-formatting/languages/` get metadata based on the language:

- **JavaScript**: Applies to web-app, library, cli-tool, api-server
- **TypeScript**: Applies to all project types, requires `typescript` dependency
- **Python**: Applies to web-app, library, cli-tool, api-server
- **CSS**: Applies to web-app only
- **JSON**: Applies to all project types

#### Framework Rules

Documents about specific frameworks get framework-specific metadata:

- **React**: Requires `react` dependency, component patterns
- **Vue**: Requires `vue` dependency, component patterns
- **Express**: Requires `express` dependency, API server patterns
- **Django/FastAPI**: Python frameworks with appropriate patterns

#### Practice Rules

Documents in `practices/` get metadata based on the practice category:

- **Testing**: Applies to all project types, test file patterns
- **Security**: Applies to most project types, no specific patterns
- **Code Quality**: Applies to all project types
- **Workflow**: Applies to all project types

## Examples

### Example 1: Language Document

**Before:**
```yaml
---
title: "JavaScript Formatting"
description: "Code formatting rules for JavaScript"
tags: ["javascript"]
---
```

**After:**
```yaml
---
title: "JavaScript Formatting"
description: "Code formatting rules for JavaScript"
tags:
  - javascript
  - formatting
  - code-generation
applicableTo:
  - web-app
  - library
  - cli-tool
  - api-server
filePatterns:
  - "**/*.js"
  - "**/*.mjs"
  - "**/*.cjs"
---
```

### Example 2: Framework Document

**Before:**
```yaml
---
title: "React Component Best Practices"
description: "Best practices for writing React components"
tags: ["react", "components"]
---
```

**After:**
```yaml
---
title: "React Component Best Practices"
description: "Best practices for writing React components"
tags:
  - react
  - components
  - best-practices
applicableTo:
  - web-app
  - library
requiredDependencies:
  - react
filePatterns:
  - "components/**/*.jsx"
  - "components/**/*.tsx"
  - "src/components/**/*"
---
```

### Example 3: Practice Document

**Before:**
```yaml
---
title: "Testing Best Practices"
description: "General testing best practices"
tags: ["testing", "quality"]
---
```

**After:**
```yaml
---
title: "Testing Best Practices"
description: "General testing best practices"
tags:
  - testing
  - quality
  - best-practices
applicableTo:
  - web-app
  - library
  - cli-tool
  - api-server
  - vscode-extension
filePatterns:
  - "**/*.test.ts"
  - "**/*.test.js"
  - "**/*.spec.ts"
  - "**/*.spec.js"
  - "tests/**/*"
---
```

## Troubleshooting

### Invalid YAML Errors

If you see "Invalid YAML" errors:
1. Check for proper indentation (use 2 spaces, not tabs)
2. Ensure strings with special characters are quoted
3. Verify array syntax is correct

### Missing Required Fields

If validation fails for missing fields:
1. Ensure every document has `title`, `description`, and `tags`
2. Add at least 2 tags to each document
3. Framework documents must have `requiredDependencies`

### Documents Not Being Enhanced

If documents aren't being processed:
1. Verify they're in `code-formatting/`, `practices/`, or `agents/` directories
2. Check they're not in excluded directories (`docs/`, `templates/`)
3. Ensure they have `.md` extension

## Backup and Recovery

The system automatically creates backups before modifying files:
- Backups are stored in `.backup/` subdirectories
- Each backup includes a timestamp
- To restore, copy the backup file back to its original location

## Best Practices

1. **Run dry-run first**: Always preview changes with `--dry-run` before applying
2. **Validate after enhancement**: Run `npm run validate-frontmatter` after enhancing
3. **Review samples**: Manually review a few enhanced documents from each category
4. **Version control**: Commit changes in logical groups (e.g., by category)
5. **Preserve custom fields**: The system preserves all existing frontmatter fields

## Integration with Recommendation System

The Steering Docs Browser extension uses this metadata to:

1. **Match by dependencies**: Shows documents for packages in `package.json`
2. **Match by project type**: Detects project type and shows relevant documents
3. **Match by files**: Suggests documents when editing matching file types
4. **Filter by tags**: Allows users to filter by tags
5. **Rank results**: Scores documents based on multiple matching signals

Better metadata = better recommendations!
