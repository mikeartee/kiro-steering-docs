# Kiro Steering Documents

A simple collection of useful steering documents for Kiro. Copy what you need, modify as needed.

## Available Documents

### Code Formatting

- **[CSS/SCSS](code-formatting/css-formatting.md)** - Property ordering, naming conventions, consistent spacing
- **[JavaScript](code-formatting/javascript-formatting.md)** - Semicolons, quotes, indentation, import organization
- **[JSON](code-formatting/json-formatting.md)** - Consistent indentation, key ordering, proper formatting
- **[Markdown](code-formatting/markdown-formatting.md)** - Formatting standards, heading hierarchy, list formatting
- **[Python](code-formatting/python-formatting.md)** - PEP 8 compliance, import organization, naming conventions
- **[TypeScript](code-formatting/typescript-formatting.md)** - Type annotations, interfaces, import organization

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

1. Browse the folders in this repo
2. Copy the `.md` file you want into your `.kiro/steering/` directory
3. Restart Kiro or reload your workspace
4. That's it!

## Contributing

Got a steering document that's been useful? Just:

1. Fork this repo
2. Add your `.md` file to the appropriate folder
3. Make sure it has a clear title and description at the top
4. Submit a pull request

Keep it simple - we're not trying to be comprehensive, just useful.

## Template

```markdown
---
title: "Your Steering Document Name"
description: "What this does in one sentence"
---

# Your Steering Document

Brief explanation of what this steering document does.

## Installation

Any setup steps needed.

## Usage

How it works in practice.

Your steering content goes here...
```
