---
title: "Steering Document Creation Guidelines"
description: "Guides creation of effective, beginner-friendly steering documents"
inclusion: always
---

## Core Principle: Kiro-First, Starter-Friendly

**When creating steering documents, focus on guiding Kiro's behavior directly rather than requiring external tool setup.** Make documents immediately useful for beginners while allowing advanced users to build on the foundation.

## The Proven Pattern

### Structure That Works

**Required sections in this order:**

1. **Clear frontmatter** with title, description, tags, inclusion setting
2. **Core Principle** - one sentence explaining what this steering does
3. **How Kiro Will Write [Language/Framework]** - specific behavior guidance
4. **What This Prevents** - bullet list of problems solved
5. **Simple examples** - before/after code samples
6. **Customization** - brief note that it's a starting point
7. **Optional external tools** - validation tools, clearly marked optional

### Frontmatter Template

```yaml
---
title: "[Language] Code Quality Standards"
description: "Guides Kiro to write consistent, error-free [language] code"
tags: ["language", "formatting", "code-generation"]
inclusion: always
---
```

## Writing Guidelines

### Use "Kiro Will Write" Format

**Do this:**

```markdown
**Semicolons**: Always include semicolons at the end of statements

```javascript
// Kiro will write:
const name = 'John';

// Not:
const name = 'John'
```

```markdown

**Don't do this:**
```markdown
You should use semicolons in JavaScript for consistency.
```

### Focus on Immediate Value

**Do this:**

- Start with rules that work without any setup
- Make external tools clearly optional
- Provide copy-paste ready examples

**Don't do this:**

- Require npm install or pip install before the steering works
- Assume specific project structures
- Make external tools seem mandatory

### Keep It Starter-Friendly

**Do this:**

- Cover 3-4 essential formatting rules
- Use simple, clear examples
- Explain WHY when it prevents errors

**Don't do this:**

- Try to cover every possible use case
- Include framework-specific sections (save for separate docs)
- Overwhelm with configuration options

## Testing Your Steering Document

### Create a Test File

Always test your steering document by creating a simple test file:

```markdown
1. Create test-[language].ext file
2. Ask Kiro to write typical code for that language
3. Verify the steering rules are followed
4. Delete the test file
5. Document what worked and what didn't
```

### Validation Checklist

**Before publishing, verify:**

- [ ] Works immediately without external tool setup
- [ ] Beginner can copy/paste and get value
- [ ] Examples show clear before/after patterns
- [ ] External tools are marked as optional
- [ ] Covers 3-4 core formatting issues, not everything
- [ ] Uses "Kiro will write" format consistently
- [ ] Includes proper markdown formatting (run getDiagnostics)

## Common Mistakes to Avoid

### The "Wikipedia Trap"

- Don't try to be comprehensive
- Focus on the most common pain points
- Save advanced topics for separate steering docs

### The "Setup Barrier"

- Don't require tool installation for basic functionality
- Make external validation truly optional
- Steering should work in any environment

### The "Framework Overload"

- Don't include Django, React, FastAPI examples in one doc
- Create separate steering docs for specific frameworks
- Keep the base language doc framework-agnostic

### The "Configuration Hell"

- Don't provide 10 different configuration options
- Pick sensible defaults and mention they're customizable
- Show one working example, not every possibility

## Language-Specific Priorities

### JavaScript/TypeScript

- Semicolons, quotes, indentation
- Import organization
- Basic error prevention

### Python

- 4-space indentation (critical - breaks without it)
- Import organization
- snake_case/PascalCase naming
- Basic exception handling

### CSS/SCSS

- Property organization
- Consistent indentation
- Naming conventions

### JSON/YAML

- Consistent formatting
- Proper nesting
- Quote usage

## External Tool Integration

### The Optional Pattern

**Always use this structure:**

```markdown
## Optional: Validation with External Tools

Want to validate that generated code follows these standards? Add these tools:

### Quick Setup (Optional)
```bash
npm install --save-dev eslint prettier
```

**Note**: These tools validate the code after Kiro writes it, but aren't required for the steering document to work.

```markdown

### Never Make Tools Mandatory

**Don't do this:**
```markdown
## Setup Required

First, install these tools:
```bash
npm install eslint prettier
```

Then configure your .eslintrc.js...

```markdown

## Success Metrics

**A good steering document:**
- Works immediately when copied to `.kiro/steering/`
- Improves code quality without user configuration
- Can be understood by a beginner in 2 minutes
- Prevents the most common formatting errors for that language
- Allows advanced users to customize easily

**Test with this question:** "If a beginner copied this steering document right now, would they get immediate value without confusion or setup?"

If the answer is no, simplify further.
