# Steering Document Templates

This directory contains templates for creating new steering documents for the Kiro community repository.

## Available Templates

### steering-document-template.md

The standard template for creating new steering documents. This template follows the proven pattern that ensures:

- Immediate usability without external tool setup

- Beginner-friendly with clear examples

- Proper frontmatter schema

- Consistent structure across all steering documents

## How to Use Templates

1. **Copy the template**: Start with `steering-document-template.md`

2. **Replace placeholders**: Fill in all `[bracketed placeholders]` with actual content

3. **Test your steering**: Create a test file and verify Kiro follows your rules

4. **Validate format**: Run diagnostics to ensure proper markdown formatting

5. **Submit contribution**: Follow the contribution guidelines in CONTRIBUTING.md

## Template Sections Explained

### Frontmatter

- **title**: Clear, descriptive title following the pattern "[Language] [Purpose] Standards"

- **description**: One-line explanation of what the steering does

- **category**: Choose from: code-quality, testing, security, frameworks, workflows

- **tags**: Relevant tags for discoverability (language, tools, concepts)

- **inclusion**: Set to "always" for general rules, "fileMatch" for specific file types

### Content Structure

1. **Core Principle**: One sentence explaining the steering's purpose

2. **How Kiro Will Write**: Specific rules with before/after examples

3. **What This Prevents**: Bullet list of problems solved

4. **Usage Examples**: Practical implementation guidance

5. **Customization**: Brief note about adaptability

6. **Optional Tools**: External validation tools (clearly marked optional)

## Quality Standards

Before submitting a steering document:

- [ ] Works immediately when copied to `.kiro/steering/`

- [ ] Includes 3-4 core rules (not comprehensive coverage)

- [ ] Uses "Kiro will write" format for examples

- [ ] External tools are clearly optional

- [ ] Passes markdown linting (run getDiagnostics)

- [ ] Tested with actual Kiro code generation

## Common Mistakes to Avoid

- **Don't require tool installation** for basic functionality

- **Don't try to be comprehensive** - focus on most common issues

- **Don't mix frameworks** - create separate docs for specific frameworks

- **Don't overwhelm with options** - provide sensible defaults

## Need Help?

- Check existing steering documents in the categories/ directory for examples

- Review the contribution guidelines in CONTRIBUTING.md

- Look at the steering-doc-creation.md guidelines for detailed best practices
