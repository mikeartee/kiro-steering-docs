# Metadata Field Reference

This document provides a complete reference for all frontmatter metadata fields used in steering documents.

## Overview

Steering documents use YAML frontmatter to provide metadata that enables intelligent document recommendation. The recommendation system in the Steering Docs Browser extension uses this metadata to match documents to user workspaces.

## Required Fields

### title

**Type:** String
**Required:** Yes
**Description:** A clear, descriptive title for the document.

**Example:**
```yaml
title: "React Component Best Practices"
```

**Guidelines:**
- Use title case
- Be specific and descriptive
- Keep under 60 characters when possible
- Don't include the word "Steering" or "Document"

### description

**Type:** String
**Required:** Yes
**Description:** A brief one or two sentence description of what the document covers.

**Example:**
```yaml
description: "Best practices and patterns for writing maintainable React components"
```

**Guidelines:**
- Keep concise (under 150 characters)
- Focus on what the document helps with
- Use plain language, avoid jargon
- Complete sentences

### tags

**Type:** Array of strings
**Required:** Yes (minimum 2)
**Description:** Tags for categorization and search.

**Example:**
```yaml
tags:
  - react
  - components
  - best-practices
```

**Common tags:**
- Language names: `javascript`, `typescript`, `python`, `bash`
- Frameworks: `react`, `vue`, `express`, `django`, `fastapi`
- Categories: `testing`, `security`, `formatting`, `best-practices`
- Purposes: `code-generation`, `code-quality`, `workflow`

**Guidelines:**
- Use lowercase
- Use hyphens for multi-word tags (e.g., `best-practices`)
- Include at least 2 tags
- Be specific but not overly granular
- Include both general and specific tags

## Recommendation Metadata Fields

### applicableTo

**Type:** Array of project type strings
**Required:** No (but recommended)
**Description:** Indicates which types of projects this document applies to.

**Valid values:**
- `web-app` - Web applications
- `library` - Reusable libraries and npm packages
- `cli-tool` - Command-line tools
- `api-server` - Backend API servers
- `vscode-extension` - VS Code extensions

**Example:**
```yaml
applicableTo:
  - web-app
  - library
```

**How it's used:**
The recommendation system detects project type by analyzing:
- Dependencies in package.json
- File structure and patterns
- Build configuration

Documents with matching project types get higher recommendation scores.

**When to use:**
- Use for documents that apply to specific project architectures
- Include multiple types if the document is broadly applicable
- Omit only if the document is truly universal

### requiredDependencies

**Type:** Array of strings
**Required:** No (but required for framework documents)
**Description:** npm package names that indicate this document is relevant.

**Example:**
```yaml
requiredDependencies:
  - react
  - typescript
```

**How it's used:**
The recommendation system checks the user's `package.json` for these dependencies. Documents whose required dependencies are present get boosted in recommendations.

**Guidelines:**
- Use exact npm package names
- Include only direct dependencies (not transitive)
- Framework documents MUST have this field
- Language documents for TypeScript should include `typescript`
- Python/Ruby documents can omit this (no npm equivalent)

**Examples by category:**

**React documents:**
```yaml
requiredDependencies:
  - react
```

**TypeScript documents:**
```yaml
requiredDependencies:
  - typescript
```

**Express documents:**
```yaml
requiredDependencies:
  - express
```

**Testing documents (Jest):**
```yaml
requiredDependencies:
  - jest
```

**When to omit:**
- Language-agnostic documents
- General best practices
- Python/Ruby specific documents (no npm packages)
- Documents that apply regardless of dependencies

### filePatterns

**Type:** Array of glob pattern strings
**Required:** No
**Description:** Glob patterns indicating which files this document is relevant for.

**Example:**
```yaml
filePatterns:
  - "**/*.tsx"
  - "components/**/*"
  - "src/components/**/*.tsx"
```

**How it's used:**
The recommendation system checks if the user's workspace contains files matching these patterns. Documents with matching patterns get higher scores, especially when the user is editing a matching file.

**Common patterns:**

**Language-specific:**
```yaml
# JavaScript
filePatterns:
  - "**/*.js"
  - "**/*.mjs"
  - "**/*.cjs"

# TypeScript
filePatterns:
  - "**/*.ts"
  - "**/*.tsx"

# Python
filePatterns:
  - "**/*.py"

# CSS
filePatterns:
  - "**/*.css"
  - "**/*.scss"
  - "**/*.sass"
```

**Component patterns:**
```yaml
filePatterns:
  - "components/**/*.jsx"
  - "components/**/*.tsx"
  - "src/components/**/*"
```

**Test patterns:**
```yaml
filePatterns:
  - "**/*.test.ts"
  - "**/*.test.js"
  - "**/*.spec.ts"
  - "**/*.spec.js"
  - "tests/**/*"
  - "__tests__/**/*"
```

**API patterns:**
```yaml
filePatterns:
  - "routes/**/*.ts"
  - "api/**/*.ts"
  - "controllers/**/*.ts"
```

**Guidelines:**
- Use glob syntax (`**` for any directory depth, `*` for any characters)
- Include all relevant variations
- Don't be too specific (e.g., avoid hardcoding exact paths)
- Order from most to least specific
- Omit if document applies to all files or no specific pattern

## Optional Fields

### category

**Type:** String
**Required:** No
**Description:** High-level category for the document.

**Common values:**
- `code-formatting`
- `code-quality`
- `testing`
- `security`
- `workflow`

**Example:**
```yaml
category: "code-quality"
```

### inclusion

**Type:** String
**Required:** No
**Description:** When to include this document in recommendations.

**Valid values:**
- `always` - Always include in recommendations
- `contextual` - Only include when context matches
- `manual` - Only show when explicitly requested

**Example:**
```yaml
inclusion: always
```

## Complete Examples

### Example 1: React Component Document

```yaml
---
title: "React Component Best Practices"
description: "Patterns and conventions for writing maintainable React components"
category: "code-quality"
tags:
  - react
  - components
  - best-practices
  - code-quality
inclusion: contextual
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

### Example 2: TypeScript Formatting Document

```yaml
---
title: "TypeScript Code Formatting"
description: "Code formatting standards and conventions for TypeScript"
category: "code-formatting"
tags:
  - typescript
  - formatting
  - code-generation
inclusion: always
applicableTo:
  - web-app
  - library
  - cli-tool
  - api-server
  - vscode-extension
requiredDependencies:
  - typescript
filePatterns:
  - "**/*.ts"
  - "**/*.tsx"
---
```

### Example 3: Testing Best Practices Document

```yaml
---
title: "Testing Best Practices"
description: "General testing strategies and patterns for all project types"
category: "testing"
tags:
  - testing
  - best-practices
  - quality
inclusion: always
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

### Example 4: Python Formatting Document

```yaml
---
title: "Python Code Formatting"
description: "PEP 8 compliant code formatting for Python"
category: "code-formatting"
tags:
  - python
  - formatting
  - code-generation
inclusion: always
applicableTo:
  - web-app
  - library
  - cli-tool
  - api-server
filePatterns:
  - "**/*.py"
---
```

Note: No `requiredDependencies` since Python doesn't use npm.

### Example 5: Security Best Practices Document

```yaml
---
title: "Security Best Practices"
description: "Essential security practices for web applications"
category: "security"
tags:
  - security
  - best-practices
  - web
inclusion: always
applicableTo:
  - web-app
  - api-server
---
```

Note: No `filePatterns` or `requiredDependencies` since this applies broadly.

## How the Recommendation System Uses Metadata

The Steering Docs Browser extension scores documents based on multiple signals:

1. **Dependency Matching** (High weight)
   - Checks if `requiredDependencies` are in user's `package.json`
   - Documents with matching dependencies get significant boost

2. **Project Type Matching** (High weight)
   - Detects user's project type
   - Documents in `applicableTo` get boosted

3. **File Pattern Matching** (Medium weight)
   - Checks if workspace contains matching files
   - Especially relevant when user is editing a matching file

4. **Tag Matching** (Low weight)
   - User can filter by tags
   - Tags used for search and categorization

5. **Inclusion Setting** (Modifier)
   - `always`: Always visible in recommendations
   - `contextual`: Only shown when other signals match
   - `manual`: Only shown when explicitly requested

The system combines these signals to produce a relevance score, then displays documents sorted by score.

## Migration and Enhancement

If you have existing documents without this metadata, use the enhancement tool:

```bash
# Preview changes
npm run enhance-frontmatter -- --dry-run

# Apply changes
npm run enhance-frontmatter

# Validate results
npm run validate-frontmatter
```

See [ENHANCEMENT_GUIDE.md](ENHANCEMENT_GUIDE.md) for details.

## Validation Rules

The validation system enforces these rules:

1. **Required fields present**: title, description, tags
2. **Minimum tags**: At least 2 tags required
3. **Valid YAML**: All frontmatter must parse correctly
4. **Framework documents**: Must have `requiredDependencies`
5. **Valid enum values**: Project types must be from allowed list

Run validation:
```bash
npm run validate-frontmatter
```

## Best Practices

1. **Be specific**: More metadata = better recommendations
2. **Test your patterns**: Verify glob patterns match intended files
3. **Keep tags focused**: 3-5 tags is usually ideal
4. **Update when changing content**: If document scope changes, update metadata
5. **Use the enhancement tool**: Let automation handle initial metadata
6. **Validate regularly**: Run validation in CI/CD
