# Code Quality

Steering documents that help maintain consistent code standards, formatting, and linting rules across your projects.

## Overview

Code quality steering documents guide Kiro to write clean, consistent code that follows established patterns and prevents common syntax errors. These documents focus on formatting, style conventions, and basic error prevention.

## Available Documents

| Document | Description | Languages | Tags |
|----------|-------------|-----------|------|
| [Code Review Standards](code-review-standards.md) | Best practices for writing reviewable, maintainable code | Multiple | `code-review`, `best-practices`, `standards` |
| [JavaScript Formatting](../../code-formatting/javascript-formatting.md) | Consistent JavaScript code style with semicolons, quotes, and indentation | JavaScript, TypeScript | `javascript`, `formatting`, `eslint` |
| [TypeScript Formatting](../../code-formatting/typescript-formatting.md) | Strong typing and TypeScript-specific formatting standards | TypeScript | `typescript`, `types`, `formatting` |
| [Python Formatting](../../code-formatting/python-formatting.md) | Clean, readable Python with proper indentation and naming | Python | `python`, `formatting`, `pep8` |
| [JSON Formatting](../../code-formatting/json-formatting.md) | Consistent JSON structure and formatting | JSON | `json`, `formatting`, `config` |
| [CSS Formatting](../../code-formatting/css-formatting.md) | Organized CSS with consistent property ordering | CSS, SCSS | `css`, `formatting`, `styles` |
| [Markdown Formatting](../../code-formatting/markdown-formatting.md) | Clean markdown with proper structure and linting | Markdown | `markdown`, `documentation` |

## Usage Guidance

### Getting Started

1. Choose a steering document that matches your project's language

2. Copy the document to your `.kiro/steering/` directory

3. Kiro will automatically apply these standards when generating code

### Installation Example

```bash
# Copy a steering document to your project
cp categories/code-quality/javascript-formatting.md .kiro/steering/

```

### Customization

All code quality steering documents are designed as starting points. You can:

- Modify formatting rules to match your team's preferences

- Add project-specific conventions

- Combine multiple steering documents for comprehensive coverage

### Best Practices

- Start with one language-specific document

- Test the steering rules with sample code generation

- Adjust rules based on your team's feedback

- Keep steering documents focused on one language or area

## Related Categories

- [Testing](../testing/) - Test quality and coverage standards

- [Frameworks](../frameworks/) - Framework-specific code patterns

- [Workflows](../workflows/) - Development workflow automation

## Contributing

Have a code quality steering document to share? See our [contribution guidelines](../../CONTRIBUTING.md) for how to submit new documents or improvements.
