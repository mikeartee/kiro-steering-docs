# Kiro Steering Documents

A community-driven collection of reusable steering documents for Kiro. Discover, share, and contribute patterns that enhance your development workflow.

## Quick Navigation

- [Browse by Category](#browse-by-category)
- [Search by Tag](#search-by-tag)
- [All Documents](#all-documents)
- [How to Use](#how-to-use)
- [Contributing](#contributing)
- [Documentation](#documentation)

## Browse by Category

Explore steering documents organized by functional area:

- **[Code Quality](categories/code-quality/)** - Formatting, linting, and code standards
- **[Testing](categories/testing/)** - Test coverage and quality standards
- **[Security](categories/security/)** - Security best practices and vulnerability prevention
- **[Frameworks](categories/frameworks/)** - Framework-specific patterns and conventions
- **[Workflows](categories/workflows/)** - CI/CD, Git hooks, and automation

## Search by Tag

Find documents by technology, purpose, or use case. See [TAGS.md](TAGS.md) for the complete tag taxonomy.

### Languages

- [JavaScript](#javascript) | [TypeScript](#typescript) | [Python](#python) | [CSS](#css) | [JSON](#json) | [Markdown](#markdown)

### Purposes

- [Formatting](#formatting) | [Code Generation](#code-generation) | [Testing](#testing) | [Security](#security) | [Documentation](#documentation)

### Tools & Frameworks

- [React](#react) | [ESLint](#eslint) | [Prettier](#prettier) | [Git](#git)

## All Documents

Comprehensive searchable index of all available steering documents:

| Document | Category | Description | Tags |
|----------|----------|-------------|------|
| [CSS Formatting](code-formatting/css-formatting.md) | Code Quality | Property ordering, naming conventions, consistent spacing | `css`, `scss`, `formatting`, `styles` |
| [JavaScript Formatting](code-formatting/javascript-formatting.md) | Code Quality | Semicolons, quotes, indentation, import organization | `javascript`, `formatting`, `eslint`, `code-generation` |
| [JSON Formatting](code-formatting/json-formatting.md) | Code Quality | Consistent indentation, key ordering, proper formatting | `json`, `formatting`, `config` |
| [Markdown Formatting](code-formatting/markdown-formatting.md) | Code Quality | Formatting standards, heading hierarchy, list formatting | `markdown`, `documentation`, `formatting` |
| [Python Formatting](code-formatting/python-formatting.md) | Code Quality | PEP 8 compliance, import organization, naming conventions | `python`, `formatting`, `pep8`, `code-generation` |
| [TypeScript Formatting](code-formatting/typescript-formatting.md) | Code Quality | Type annotations, interfaces, import organization | `typescript`, `formatting`, `types`, `code-generation` |

### Tag Reference

#### JavaScript

Documents tagged with `javascript`:

- [JavaScript Formatting](code-formatting/javascript-formatting.md) - Consistent JavaScript code style

#### TypeScript

Documents tagged with `typescript`:

- [TypeScript Formatting](code-formatting/typescript-formatting.md) - Strong typing and TypeScript standards

#### Python

Documents tagged with `python`:

- [Python Formatting](code-formatting/python-formatting.md) - Clean, readable Python code

#### CSS

Documents tagged with `css`:

- [CSS Formatting](code-formatting/css-formatting.md) - Organized CSS with consistent properties

#### JSON

Documents tagged with `json`:

- [JSON Formatting](code-formatting/json-formatting.md) - Consistent JSON structure

#### Markdown

Documents tagged with `markdown`:

- [Markdown Formatting](code-formatting/markdown-formatting.md) - Clean markdown documentation

#### Formatting

Documents tagged with `formatting`:

- [CSS Formatting](code-formatting/css-formatting.md)
- [JavaScript Formatting](code-formatting/javascript-formatting.md)
- [JSON Formatting](code-formatting/json-formatting.md)
- [Markdown Formatting](code-formatting/markdown-formatting.md)
- [Python Formatting](code-formatting/python-formatting.md)
- [TypeScript Formatting](code-formatting/typescript-formatting.md)

#### Code Generation

Documents tagged with `code-generation`:

- [JavaScript Formatting](code-formatting/javascript-formatting.md)
- [Python Formatting](code-formatting/python-formatting.md)
- [TypeScript Formatting](code-formatting/typescript-formatting.md)

#### Documentation

Documents tagged with `documentation`:

- [Markdown Formatting](code-formatting/markdown-formatting.md)

#### ESLint

Documents tagged with `eslint`:

- [JavaScript Formatting](code-formatting/javascript-formatting.md)

#### Testing

Documents tagged with `testing`:

- *Coming soon* - Test coverage and quality standards

#### Security

Documents tagged with `security`:

- *Coming soon* - Security best practices and patterns

#### React

Documents tagged with `react`:

- *Coming soon* - React component patterns and conventions

#### Git

Documents tagged with `git`:

- *Coming soon* - Git workflow and commit standards

#### Prettier

Documents tagged with `prettier`:

- *Coming soon* - Prettier configuration patterns

### Coming Soon

### Infrastructure as Code *(Coming Soon)*

- **Terraform** - Resource organization, naming conventions, variable structure
- **Pulumi** - Resource patterns, stack organization, configuration management
- **CloudFormation** - Template structure, parameter organization, output formatting
- **Ansible** - Playbook structure, task organization, variable management

### Shell & Scripting *(Coming Soon)*

- **Bash** - Function structure, error handling, variable naming, best practices
- **PowerShell** - Cmdlet patterns, parameter organization, pipeline usage
- **Zsh** - Modern shell scripting patterns, function organization

### Configuration Files *(Coming Soon)*

- **YAML** - Indentation standards, key ordering, comment formatting
- **TOML** - Section organization, key formatting, value structure
- **Docker** - Dockerfile best practices, layer optimization, security patterns
- **Docker Compose** - Service organization, network patterns, volume management

### Database & Query Languages *(Coming Soon)*

- **SQL** - Query formatting, capitalization standards, indentation patterns
- **GraphQL** - Schema organization, query structure, resolver patterns
- **MongoDB** - Query patterns, aggregation pipelines, index optimization

### Framework-Specific *(Coming Soon)*

- **React** - Component structure, prop ordering, hook patterns, JSX formatting
- **Vue** - Template organization, composition API patterns, component structure
- **Express** - Route organization, middleware patterns, error handling
- **FastAPI** - Endpoint structure, dependency injection, response formatting

## How to Use

### Quick Start

1. **Browse**: Use the [category navigation](#browse-by-category) or [tag search](#search-by-tag) to find documents
2. **Copy**: Download or copy the steering document to your `.kiro/steering/` directory
3. **Use**: Kiro automatically applies the steering rules when generating code
4. **Customize**: Modify the document to match your team's preferences

### Installation Example

```bash
# Copy a steering document to your project
cp code-formatting/javascript-formatting.md .kiro/steering/

# Or copy multiple documents
cp code-formatting/*.md .kiro/steering/
```

### Finding the Right Document

**By Language**: Use the [tag reference](#tag-reference) to find all documents for your language

**By Purpose**: Browse [categories](#browse-by-category) to find documents by functional area

**By Framework**: Check the [frameworks category](categories/frameworks/) for framework-specific patterns

### Combining Documents

Steering documents work together. A typical setup might include:

```bash
.kiro/steering/
├── javascript-formatting.md    # Base language formatting
├── react-patterns.md           # Framework-specific patterns
├── test-coverage.md            # Testing standards
└── git-hooks.md                # Workflow automation
```

## Contributing

We welcome contributions! Share your steering documents to help the community.

### How to Contribute

1. **Fork** this repository
2. **Choose** the appropriate category for your document
3. **Use** the [template](templates/steering-document-template.md) for consistency
4. **Add** proper tags and metadata
5. **Submit** a pull request

See our [contribution guidelines](CONTRIBUTING.md) for detailed instructions.

### What Makes a Good Contribution

- **Focused**: Addresses a specific need or pattern
- **Tested**: Works in real projects
- **Documented**: Clear examples and usage instructions
- **Tagged**: Proper tags for discoverability

### Adding Tags

When contributing, include relevant tags:

- **Language tags**: `javascript`, `python`, `typescript`, etc.
- **Purpose tags**: `formatting`, `testing`, `security`, etc.
- **Tool tags**: `eslint`, `prettier`, `git`, etc.
- **Framework tags**: `react`, `vue`, `django`, etc.

## Documentation

Comprehensive guides for creating and contributing steering documents:

### For Contributors

- **[Creating Steering Documents](docs/CREATING_STEERING_DOCUMENTS.md)** - Complete guide to creating effective steering documents
- **[Examples: Good and Bad](docs/EXAMPLES_GOOD_AND_BAD.md)** - Learn from real examples of well-crafted and problematic documents
- **[Syntax Reference](docs/SYNTAX_REFERENCE.md)** - Complete reference for frontmatter, markdown, and formatting
- **[Quality Checklist](.github/QUALITY_CHECKLIST.md)** - Pre-submission checklist for contributors

### For Reviewers

- **[Reviewer Guidelines](.github/REVIEWER_GUIDELINES.md)** - Comprehensive review process and quality standards
- **[Quality Checklist](.github/QUALITY_CHECKLIST.md)** - Quick reference for reviewing contributions

### Templates and Tools

- **[Steering Document Template](templates/steering-document-template.md)** - Template for creating new documents
- **[Validation Tools](tools/)** - Scripts for validating steering documents

## Related Resources

- [Tag Taxonomy](TAGS.md) - Complete tag reference and guidelines
- [Templates](templates/) - Templates for creating new steering documents
- [Examples](examples/) - Complete example setups (coming soon)
- [Tools](tools/) - Validation and utility scripts
- [Contribution Guide](CONTRIBUTING.md) - Detailed contribution instructions
- [Roadmap](ROADMAP.md) - Project roadmap and future plans
- [Code of Conduct](CODE_OF_CONDUCT.md) - Community guidelines

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Community

- **Issues**: Report problems or request new steering documents
- **Discussions**: Share ideas and ask questions
- **Pull Requests**: Contribute your own steering documents
- **Security**: See [SECURITY.md](SECURITY.md) for reporting vulnerabilities
- **Maintainers**: See [MAINTAINERS.md](MAINTAINERS.md) for maintainer guidelines

---

**Note**: This is a community-driven project. Steering documents are provided as-is and should be reviewed and tested before use in production environments.
