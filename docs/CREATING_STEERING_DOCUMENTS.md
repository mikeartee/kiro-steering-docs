# Creating Effective Steering Documents

This guide will help you create high-quality steering documents that provide immediate value to Kiro users.

## What Makes a Great Steering Document

A great steering document:

- **Works immediately** - No setup required for basic functionality
- **Solves real problems** - Addresses common pain points developers face
- **Is beginner-friendly** - Clear and accessible to newcomers
- **Focuses on essentials** - Covers 3-4 core issues, not everything
- **Provides clear examples** - Shows before/after code comparisons
- **Allows customization** - Easy to adapt to specific needs

## The Proven Pattern

### Required Structure

Every steering document should follow this structure:

1. **Frontmatter** - Metadata about the document
2. **Core Principle** - One sentence explaining the purpose
3. **RULES** - Non-negotiable requirements using MUST/MUST NOT language
4. **How Kiro Will Write [Language]** - Specific behavior guidance
5. **What This Prevents** - Problems solved
6. **Simple Examples** - Before/after code samples
7. **Customization** - Note about adaptability
8. **Optional Tools** - External validation (clearly optional)

### Why This Pattern Works

This structure has been tested across multiple steering documents and consistently produces documents that:

- Users can understand in 2 minutes
- Work without any setup
- Provide immediate value
- Are easy to customize

## Step-by-Step Creation Process

### Step 1: Identify the Problem

Start by identifying a specific problem you want to solve:

**Good problem statements**:

- "Kiro sometimes forgets semicolons in JavaScript"
- "Python indentation errors break code"
- "Inconsistent import organization makes code hard to read"

**Poor problem statements**:

- "JavaScript needs better quality" (too vague)
- "We need comprehensive TypeScript coverage" (too broad)

### Step 2: Write Strong RULES Section

Create a RULES section with 5 non-negotiable requirements using MUST/MUST NOT language:

**Why "RULES" works better than "Instructions"**:

- Non-negotiable, must be followed
- Implies authority and consequences
- Binary: follow or don't
- Triggers stronger compliance response in LLMs

**RULES format**:

```markdown
## RULES

You MUST follow these rules when creating or editing [language] files:

1. You MUST [specific requirement]
2. You MUST [another requirement]
3. You MUST [verification step]
4. You MUST NOT [specific prohibition]
5. You MUST NOT [another prohibition]
```

**Example for JavaScript**:

```markdown
## RULES

You MUST follow these rules when creating or editing JavaScript files:

1. You MUST include semicolons at the end of all statements
2. You MUST use single quotes for strings (unless escaping is needed)
3. You MUST use 2-space indentation consistently
4. You MUST organize imports with external packages first, then local imports
5. You MUST use const/let instead of var
```

**Strong vs Weak language**:

- WEAK: "Try to include semicolons for consistency"
- STRONG: "You MUST include semicolons at the end of all statements"
- WEAK: "When creating markdown files, follow this workflow..."
- STRONG: "You MUST run getDiagnostics after creating any markdown file"

### Step 3: Choose 3-4 Core Patterns

Pick the 3-4 most important patterns to demonstrate in "How Kiro Will Write" section:

**Example for JavaScript**:

1. Semicolons and quotes
2. Indentation
3. Import organization
4. Variable declarations

**Don't try to cover**:

- Every possible edge case
- Framework-specific patterns (save for separate docs)
- Advanced optimization techniques
- Controversial or opinionated patterns

### Step 4: Write Clear Examples

For each rule, provide a clear before/after example:

**Good example format**:

````markdown
**Semicolons**: Always include semicolons at the end of statements

```javascript
// Kiro will write:
const name = 'John';
const age = 30;

// Not:
const name = 'John'
const age = 30
```
````

**Poor example format**:

````markdown
Use semicolons in JavaScript.

```javascript
const name = 'John';
```
````

### Step 4: Test Your Document

Before submitting, test your steering document:

1. Copy it to `.kiro/steering/test-[language].md`
2. Ask Kiro to write typical code for that language
3. Verify Kiro follows your rules
4. Note what works and what doesn't
5. Refine your examples and wording
6. Delete the test file

### Step 5: Write Supporting Sections

Complete the remaining sections:

**Core Principle**: One clear sentence

```markdown
## Core Principle

**Kiro writes clean, consistently formatted JavaScript that prevents common syntax errors.**
```

**What This Prevents**: Bullet list of problems

```markdown
## What This Prevents

- Syntax errors from missing semicolons
- Inconsistent indentation that makes code hard to read
- Import chaos with scattered dependencies
- Common typos in variable names
```

**Customization**: Brief note

```markdown
## Customization

This is a starting point! You can modify these rules by editing this steering document:

- Change single quotes to double quotes if preferred
- Adjust indentation from 2 spaces to 4 spaces
- Modify import organization patterns
```

**Optional Tools**: Clearly marked as optional

````markdown
## Optional: Validation with External Tools

Want to validate that generated code follows these standards? Add these tools:

### Quick Setup (Optional)

```bash
npm install --save-dev eslint prettier
```

**Note**: These tools validate the code after Kiro writes it, but aren't required for the steering document to work.
````

## Common Mistakes to Avoid

### The "Wikipedia Trap"

**Mistake**: Trying to create a comprehensive reference

```markdown
## How Kiro Will Write JavaScript

### Variables (15 rules)
### Functions (20 rules)
### Classes (18 rules)
### Async/Await (12 rules)
...
```

**Fix**: Focus on 3-4 essential rules

```markdown
## How Kiro Will Write JavaScript

### Code Style
- Semicolons
- Quotes
- Indentation

### Import Organization
- Group and sort imports
```

### The "Setup Barrier"

**Mistake**: Requiring tools before steering works

```text
## Setup Required

First, install these tools:
npm install eslint prettier

Then configure your .eslintrc.js...
```

**Fix**: Make tools optional

````markdown
## Optional: Validation with External Tools

Want to validate? Add these tools:

```bash
npm install --save-dev eslint prettier
```

**Note**: These tools validate the code after Kiro writes it, but aren't required for the steering document to work.
````

### The "Framework Overload"

**Mistake**: Mixing multiple frameworks

```markdown
## How Kiro Will Write JavaScript

### React Components
[React examples]

### Vue Components
[Vue examples]

### Angular Components
[Angular examples]
```

**Fix**: Create separate documents

- `react-component-patterns.md`
- `vue-component-patterns.md`
- `angular-component-patterns.md`

### The "Configuration Hell"

**Mistake**: Providing too many options

```markdown
## Configuration Options

You can configure this 10 different ways:

1. Option A with settings X, Y, Z
2. Option B with settings...
[8 more options]
```

**Fix**: Show one sensible default

```markdown
## Customization

This is a starting point with sensible defaults. You can modify any rules to match your team's preferences.
```

### Poor Examples

**Mistake**: Examples that don't clearly show the difference

````markdown
```javascript
// Good
function example() { return true; }
```
````

**Fix**: Clear before/after comparison

````markdown
```javascript
// Kiro will write:
function example() {
  return true;
}

// Not:
function example(){return true;}
```
````

## Language-Specific Priorities

### JavaScript/TypeScript

Focus on:

- Semicolons, quotes, indentation
- Import organization
- Basic error prevention

Avoid:

- Framework-specific patterns
- Build tool configuration
- Advanced TypeScript generics

### Python

Focus on:

- 4-space indentation (critical!)
- Import organization
- Naming conventions (snake_case/PascalCase)
- Basic exception handling

Avoid:

- Framework-specific patterns (Django, Flask, etc.)
- Advanced decorators
- Metaclass patterns

### CSS/SCSS

Focus on:

- Property organization
- Consistent indentation
- Naming conventions

Avoid:

- Framework-specific utilities (Tailwind, Bootstrap)
- Complex preprocessor features
- Browser-specific hacks

### JSON/YAML

Focus on:

- Consistent formatting
- Proper nesting
- Quote usage

Avoid:

- Schema validation (separate concern)
- Complex transformations
- Tool-specific extensions

## Examples of Good vs. Bad Steering Documents

### Good Example: Python Formatting

**Why it's good**:

- Focuses on 4 essential rules
- Clear before/after examples
- Works immediately
- External tools are optional
- Beginner-friendly

**Structure**:

```markdown
## Core Principle
Clean, readable Python that follows basic standards

## How Kiro Will Write Python
- 4-space indentation
- Import organization
- Naming conventions
- Basic error handling

## What This Prevents
- Indentation errors
- Import chaos
- Naming inconsistencies
```

### Bad Example: Comprehensive JavaScript Guide

**Why it's bad**:

- Tries to cover everything (50+ rules)
- Requires ESLint setup before working
- Mixes React, Node.js, and vanilla JS
- Too complex for beginners
- No clear focus

**Structure**:

```markdown
## Setup
Install ESLint, Prettier, and 10 plugins...

## 50 JavaScript Rules
[Overwhelming list of every possible rule]

## React Patterns
[Framework-specific content]

## Node.js Patterns
[More framework-specific content]
```

## Testing Your Steering Document

### Manual Testing Process

1. **Create test file**: Copy your steering document to `.kiro/steering/`
2. **Test basic functionality**: Ask Kiro to write simple code
3. **Test edge cases**: Try more complex scenarios
4. **Verify examples**: Ensure your examples match Kiro's output
5. **Check beginner experience**: Can someone new understand it?
6. **Remove test file**: Clean up after testing

### What to Test

- [ ] Kiro follows the rules you specified
- [ ] Examples in the document match Kiro's actual output
- [ ] Document works without external tool setup
- [ ] Beginner can understand and use it
- [ ] Rules don't conflict with each other
- [ ] Markdown formatting is correct

### Common Testing Issues

**Issue**: Kiro doesn't follow your rules

**Possible causes**:

- Rules are too vague or ambiguous
- Examples don't clearly show the pattern
- Rules conflict with each other

**Fix**: Make rules more specific and examples clearer

**Issue**: Examples don't match Kiro's output

**Possible causes**:

- Examples are outdated
- Rules don't actually guide Kiro's behavior
- Examples show ideal state, not realistic output

**Fix**: Update examples to match actual Kiro behavior

## Frontmatter Reference

### Required Fields

```yaml
---
title: "[Language] Code Quality Standards"
description: "Guides Kiro to write consistent, error-free [language] code"
tags: ["language", "formatting", "code-generation"]
inclusion: always
---
```

### Optional Fields

```yaml
---
category: "code-quality"
author: "your-github-username"
version: "1.0.0"
kiro_version: ">=1.0.0"
dependencies: []
file_references: ["package.json", ".eslintrc.js"]
---
```

### Field Descriptions

- **title**: Clear, descriptive title (required)
- **description**: One-sentence summary under 150 characters (required)
- **tags**: At least 2 relevant tags (required)
- **inclusion**: `always` or `manual` (required)
- **category**: Folder where document lives (optional)
- **author**: Your GitHub username (optional)
- **version**: Semantic version (optional)
- **kiro_version**: Minimum Kiro version (optional)
- **dependencies**: Other steering docs required (optional)
- **file_references**: External files referenced (optional)

## Getting Feedback

### Before Submitting

1. Test your document thoroughly
2. Review the [Quality Checklist](../.github/QUALITY_CHECKLIST.md)
3. Ask a colleague to review
4. Ensure all examples work

### After Submitting

1. Respond to reviewer feedback promptly
2. Be open to suggestions
3. Test requested changes
4. Ask questions if feedback is unclear

### Iterating on Feedback

Reviewers might ask you to:

- Focus on fewer rules
- Clarify examples
- Make external tools more clearly optional
- Split into multiple documents
- Add more examples

This is normal! The goal is to create the best possible document.

## Success Metrics

Your steering document is successful if:

- [ ] A beginner can use it immediately without confusion
- [ ] It solves a real problem developers face
- [ ] Examples are clear and match Kiro's behavior
- [ ] It works without external tool setup
- [ ] Users can customize it easily
- [ ] It focuses on essentials, not everything

## Next Steps

1. Review the [Steering Document Template](../templates/steering-document-template.md)
2. Check out [existing steering documents](../categories/) for inspiration
3. Read the [Quality Checklist](../.github/QUALITY_CHECKLIST.md)
4. Create your steering document
5. Test it thoroughly
6. Submit a pull request

## Getting Help

If you need help creating a steering document:

- Open an issue with the "question" label
- Review existing documents for patterns
- Ask in discussions
- Tag maintainers for guidance

We're here to help you create great steering documents!
