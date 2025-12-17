# Contributing

Thanks for wanting to share your steering documents!

## What We Want

- Steering documents that you actually use and find helpful

- Clear, working examples

- Simple setup instructions

## What We Don't Want

- Overly complex configurations

- Untested steering documents

- Academic examples that nobody would actually use

## How to Contribute

1. Fork this repo

2. Add your steering document to the right folder (create it if needed)

3. Make sure it has frontmatter with title and description

4. Test it in a real project first

5. Review the [Quality Checklist](.github/QUALITY_CHECKLIST.md) before submitting

6. Submit a pull request with a brief description

**Quick Links**:

- [Quality Checklist](.github/QUALITY_CHECKLIST.md) - Pre-submission checklist

- [Steering Document Template](templates/steering-document-template.md) - Template to follow

- [Reviewer Guidelines](.github/REVIEWER_GUIDELINES.md) - How PRs are reviewed

## Format

All steering documents require proper frontmatter with recommendation metadata. See the [Enhancement Guide](ENHANCEMENT_GUIDE.md) for details.

### Required Frontmatter Fields

```yaml
---
title: "Descriptive Title"
description: "One sentence about what this does"
tags: ["tag1", "tag2"]  # At least 2 tags required
---

```

### Recommendation Metadata

Framework-specific and language-specific documents should include additional metadata:

```yaml
---
title: "React Component Best Practices"
description: "Best practices for writing React components"
tags: ["react", "components", "best-practices"]
applicableTo: ["web-app", "library"]
requiredDependencies: ["react"]
filePatterns: ["components/**/*.tsx", "src/components/**/*"]
---

```

**Metadata fields:**

- `applicableTo`: Project types (web-app, library, cli-tool, api-server, vscode-extension)

- `requiredDependencies`: npm packages this document applies to

- `filePatterns`: Glob patterns for relevant files

### Running the Enhancement Tool

You can use the enhancement tool to automatically add metadata:

```bash
npm run enhance-frontmatter -- --dry-run

```

See [ENHANCEMENT_GUIDE.md](ENHANCEMENT_GUIDE.md) for complete documentation.

### Validation

Before submitting a PR, validate your frontmatter:

```bash
npm run validate-frontmatter

```

This checks for:

- Valid YAML syntax

- Required fields (title, description, tags)

- At least 2 tags per document

- Framework documents have requiredDependencies

That's it. Keep it simple and useful.
