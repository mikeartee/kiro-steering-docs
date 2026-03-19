# Code Formatting Steering Documents

Steering documents focused on code formatting standards and quality enforcement. Part of the [Code Quality](../practices/code-quality/) practice area.

## Quick Navigation

- [Browse All Practices](../practices/)

- [Search by Tag](../#search-by-tag)

- [Main README](../)

## Available Documents

| Document | Description | Tags |
|----------|-------------|------|
| [CSS Formatting](markup/css-formatting.md) | Property ordering, naming conventions, consistent spacing | `css`, `scss`, `formatting`, `styles` |
| [JavaScript Formatting](languages/javascript-formatting.md) | Semicolons, quotes, indentation, import organization | `javascript`, `formatting`, `eslint`, `code-generation` |
| [JSON Formatting](data-formats/json-formatting.md) | Consistent indentation, key ordering, proper formatting | `json`, `formatting`, `config` |
| [Markdown Formatting](markup/markdown-formatting.md) | Formatting standards, heading hierarchy, list formatting | `markdown`, `documentation`, `formatting` |
| [Python Formatting](languages/python-formatting.md) | PEP 8 compliance, import organization, naming conventions | `python`, `formatting`, `pep8`, `code-generation` |
| [TypeScript Formatting](languages/typescript-formatting.md) | Type annotations, interfaces, import organization | `typescript`, `formatting`, `types`, `code-generation` |

## Usage

### Quick Start

Copy any document to your `.kiro/steering/` directory:

```bash
# Copy a single document
cp code-formatting/languages/javascript-formatting.md .kiro/steering/

# Copy all formatting documents
cp code-formatting/{languages,markup,data-formats,infrastructure}/*.md .kiro/steering/

```

### Combining Documents

These documents work well together. A typical setup:

```bash
.kiro/steering/
├── javascript-formatting.md    # For .js files
├── typescript-formatting.md    # For .ts/.tsx files
├── json-formatting.md          # For config files
└── markdown-formatting.md      # For documentation

```

## Related Documents

### By Language

- **JavaScript**: [JavaScript Formatting](languages/javascript-formatting.md)

- **TypeScript**: [TypeScript Formatting](languages/typescript-formatting.md)

- **Python**: [Python Formatting](languages/python-formatting.md)

- **CSS/SCSS**: [CSS Formatting](markup/css-formatting.md)

### By Purpose

- **Code Generation**: [JavaScript](languages/javascript-formatting.md), [TypeScript](languages/typescript-formatting.md), [Python](languages/python-formatting.md)

- **Configuration**: [JSON Formatting](data-formats/json-formatting.md)

- **Documentation**: [Markdown Formatting](markup/markdown-formatting.md)

### Other Practices

- [Testing](../practices/testing/) - Test quality and coverage

- [Security](../practices/security/) - Security best practices

- [Frameworks](../practices/frameworks/) - Framework-specific patterns

- [Workflows](../practices/workflows/) - CI/CD and automation

## Contributing

Have a code formatting steering document to share? See our [contribution guidelines](../CONTRIBUTING.md) for how to submit new documents or improvements.
