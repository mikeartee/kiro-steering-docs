# Steering Document Practices

Browse steering documents organized by functional area. Each practice area contains specialized steering documents that help Kiro generate better code for specific purposes.

## Available Practices

### [Code Quality](code-quality/)

Maintain consistent code standards, formatting, and linting rules across your projects.

**Focus areas:**

- Language-specific formatting (JavaScript, TypeScript, Python, etc.)

- Code style conventions

- Syntax error prevention

- Consistent indentation and structure

**Best for:** Establishing baseline code quality standards for any project

---

### [Testing](testing/)

Guide test creation, coverage standards, and testing best practices.

**Focus areas:**

- Test coverage expectations

- Unit and integration testing patterns

- Test quality standards

- Framework-specific testing

**Best for:** Teams establishing testing standards and practices

---

### [Security](security/)

Enforce security best practices and prevent common vulnerabilities.

**Focus areas:**

- Input validation and sanitization

- Authentication and authorization

- Secure API development

- Dependency security

**Best for:** Projects requiring security-conscious code generation

---

### [Frameworks](frameworks/)

Framework-specific development patterns and conventions.

**Focus areas:**

- React, Vue, Angular patterns

- Express.js, Django, FastAPI conventions

- Framework best practices

- Component architecture

**Best for:** Projects using specific frameworks or libraries

---

### [Workflows](workflows/)

Development workflow automation and CI/CD integration.

**Focus areas:**

- Git hooks and commit standards

- CI/CD pipeline setup

- Code review automation

- Release management

**Best for:** Teams automating development processes

## How to Use Practices

### Browse by Need

1. Identify your primary need (code quality, testing, security, etc.)

2. Navigate to the relevant practice area

3. Review available steering documents

4. Copy documents to your `.kiro/steering/` directory

### Combine Practices

Steering documents from different practice areas work together:

```bash
.kiro/steering/
├── javascript-formatting.md    # Code Quality
├── react-patterns.md           # Frameworks
├── test-coverage.md            # Testing
└── git-hooks.md                # Workflows

```

### Start Simple

New to steering documents? Start with:

1. One code quality document for your primary language

2. Add framework-specific documents if applicable

3. Expand to testing and workflows as needed

## Quick Links

- [Main README](../README.md) - Project overview and getting started

- [Contributing](../CONTRIBUTING.md) - Submit your own steering documents

- [Templates](../templates/) - Templates for creating new documents

- [Examples](../examples/) - Complete example setups

## Need Help?

- Can't find what you need? [Open an issue](https://github.com/your-repo/issues)

- Want to contribute? See [contribution guidelines](../CONTRIBUTING.md)

- Have questions? Check existing [discussions](https://github.com/your-repo/discussions)
