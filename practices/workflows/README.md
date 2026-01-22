# Workflows

Steering documents for development workflow automation, CI/CD integration, and process optimization.

## Overview

Workflow steering documents help automate and standardize development processes. These documents guide Kiro in setting up Git hooks, CI/CD pipelines, and other workflow automation.

## Available Documents

| Document | Description | Tags |
|----------|-------------|------|
| [Development Guidelines](development-guidelines.md) | Rigorous development practices with gap analysis and debugging protocols | `development`, `workflow`, `quality` |
| [Tasks.md Structure](tasks-md-structure.md) | Standards for creating well-structured implementation plans | `tasks`, `implementation`, `spec` |
| [Git Commit Standards](git-commit-standards.md) | Clear, conventional commit messages | `git`, `commits`, `workflow` |
| [API Development Patterns](api-development-patterns.md) | API design and implementation patterns | `api`, `rest`, `workflow` |
| [Environment Config](environment-config.md) | Environment configuration management | `config`, `environment`, `workflow` |
| [Logging Standards](logging-standards.md) | Logging patterns and best practices | `logging`, `debugging`, `workflow` |

## Usage Guidance

### Getting Started

Workflow steering documents will help you:

- Automate repetitive development tasks

- Enforce standards through automation

- Set up CI/CD pipelines

- Standardize team workflows

### Installation Example

```bash
# Copy a workflow steering document to your project
cp categories/workflows/git-hooks.md .kiro/steering/

```

### Workflow Integration

Workflow steering documents can help with:

- **Pre-commit**: Run linting and formatting before commits

- **CI/CD**: Automated testing and deployment

- **Code Review**: Automated checks on pull requests

- **Release**: Version management and changelog generation

### Best Practices

- Start with simple workflow automation

- Test workflow changes in a safe environment

- Document workflow requirements for team members

- Combine workflow steering with code quality standards

## Related Categories

- [Code Quality](../code-quality/) - Standards enforced by workflows

- [Testing](../testing/) - Automated testing in CI/CD

- [Security](../security/) - Security scanning in pipelines

## Contributing

Workflow automation patterns are valuable for improving team productivity. Share your workflow steering documents by following our [contribution guidelines](../../CONTRIBUTING.md).
