# Tag Taxonomy

Comprehensive tag reference for all steering documents in this repository. Use tags to find documents by language, purpose, tool, or framework.

## Tag Categories

### Language Tags

Tags for programming languages and markup languages:

| Tag | Description | Documents |
|-----|-------------|-----------|
| `javascript` | JavaScript language | [JavaScript Formatting](code-formatting/javascript-formatting.md) |
| `typescript` | TypeScript language | [TypeScript Formatting](code-formatting/typescript-formatting.md) |
| `python` | Python language | [Python Formatting](code-formatting/python-formatting.md) |
| `css` | CSS/SCSS styling | [CSS Formatting](code-formatting/css-formatting.md) |
| `scss` | SCSS preprocessor | [CSS Formatting](code-formatting/css-formatting.md) |
| `json` | JSON data format | [JSON Formatting](code-formatting/json-formatting.md) |
| `markdown` | Markdown markup | [Markdown Formatting](code-formatting/markdown-formatting.md) |
| `html` | HTML markup | *Coming soon* |
| `sql` | SQL queries | *Coming soon* |
| `bash` | Bash scripting | *Coming soon* |
| `yaml` | YAML configuration | *Coming soon* |

### Purpose Tags

Tags for document purpose and functionality:

| Tag | Description | Documents |
|-----|-------------|-----------|
| `formatting` | Code formatting rules | All code-formatting documents |
| `code-generation` | Guides code generation | [JavaScript](code-formatting/javascript-formatting.md), [TypeScript](code-formatting/typescript-formatting.md), [Python](code-formatting/python-formatting.md) |
| `documentation` | Documentation standards | [Markdown Formatting](code-formatting/markdown-formatting.md) |
| `testing` | Testing standards | *Coming soon* |
| `security` | Security practices | *Coming soon* |
| `performance` | Performance optimization | *Coming soon* |
| `accessibility` | Accessibility standards | *Coming soon* |

### Tool Tags

Tags for development tools and utilities:

| Tag | Description | Documents |
|-----|-------------|-----------|
| `eslint` | ESLint linting | [JavaScript Formatting](code-formatting/javascript-formatting.md) |
| `prettier` | Prettier formatting | *Coming soon* |
| `git` | Git version control | *Coming soon* |
| `github-actions` | GitHub Actions CI/CD | *Coming soon* |
| `docker` | Docker containers | *Coming soon* |
| `webpack` | Webpack bundling | *Coming soon* |
| `vite` | Vite build tool | *Coming soon* |

### Framework Tags

Tags for frameworks and libraries:

| Tag | Description | Documents |
|-----|-------------|-----------|
| `react` | React framework | *Coming soon* |
| `vue` | Vue.js framework | *Coming soon* |
| `angular` | Angular framework | *Coming soon* |
| `express` | Express.js | *Coming soon* |
| `fastapi` | FastAPI | *Coming soon* |
| `django` | Django | *Coming soon* |
| `nextjs` | Next.js | *Coming soon* |

### Standard Tags

Tags for coding standards and conventions:

| Tag | Description | Documents |
|-----|-------------|-----------|
| `pep8` | Python PEP 8 standard | [Python Formatting](code-formatting/python-formatting.md) |
| `types` | Type systems | [TypeScript Formatting](code-formatting/typescript-formatting.md) |
| `config` | Configuration files | [JSON Formatting](code-formatting/json-formatting.md) |
| `styles` | Styling standards | [CSS Formatting](code-formatting/css-formatting.md) |

## Using Tags

### Finding Documents by Tag

1. **Browse this document** to see all documents with a specific tag
2. **Use the main README** [tag search](README.md#search-by-tag) for quick navigation
3. **Check category READMEs** for tag-filtered lists within categories

### Tag Combinations

Find documents by combining tags:

- `javascript` + `formatting` = JavaScript formatting documents
- `python` + `code-generation` = Python code generation guides
- `typescript` + `types` = TypeScript type system documents

### Adding Tags to New Documents

When contributing, include relevant tags in your document's frontmatter:

```yaml
---
title: "Your Document Title"
description: "Brief description"
tags: ["language", "purpose", "tool", "framework"]
---
```

## Tag Guidelines

### Choosing Tags

- **Be specific**: Use precise tags that describe the document
- **Use existing tags**: Check this taxonomy before creating new tags
- **Limit quantity**: Use 3-5 relevant tags per document
- **Include language**: Always tag with the primary language

### Tag Naming Conventions

- **Lowercase**: All tags use lowercase letters
- **Hyphens**: Use hyphens for multi-word tags (e.g., `github-actions`)
- **No spaces**: Never use spaces in tags
- **Descriptive**: Tags should be self-explanatory

## Contributing Tags

When adding new tags:

1. Check if an existing tag covers your need
2. Propose new tags in your pull request
3. Update this taxonomy document
4. Add the tag to relevant category READMEs

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Tag Statistics

Current tag distribution:

- **Language tags**: 7 active, 4 planned
- **Purpose tags**: 3 active, 4 planned
- **Tool tags**: 1 active, 6 planned
- **Framework tags**: 0 active, 7 planned
- **Standard tags**: 4 active

Total documents: 6 active, many more planned

---

**Last updated**: This taxonomy is maintained as new documents are added to the repository.
