# Steering Document Syntax Reference

Complete reference for steering document syntax, frontmatter fields, and markdown formatting.

## Document Structure

Every steering document follows this structure:

```markdown
---
[frontmatter fields]
---

## Core Principle

[One sentence]

## How Kiro Will Write [Language]

[Specific rules with examples]

## What This Prevents

[Bullet list]

## [Optional sections]

[Additional content]

```

## Frontmatter Reference

### Required Fields

#### title

**Type**: String
**Required**: Yes
**Description**: Clear, descriptive title for the steering document

**Format**: `"[Language/Framework] [Purpose] Standards"`

**Examples**:

```yaml
title: "JavaScript Code Quality Standards"
title: "Python Formatting Guidelines"
title: "React Component Patterns"

```

**Best Practices**:

- Keep under 60 characters

- Be specific about what the document covers

- Use title case

- Include the language/framework name

#### description

**Type**: String
**Required**: Yes
**Description**: One-sentence summary of what the steering document does

**Format**: Under 150 characters

**Examples**:

```yaml
description: "Guides Kiro to write consistent, error-free JavaScript code"
description: "Ensures Python code follows PEP 8 indentation and naming standards"
description: "Provides React component structure and hooks best practices"

```

**Best Practices**:

- Start with an action verb ("Guides", "Ensures", "Provides")

- Mention the specific benefit

- Keep it concise and clear

- Avoid jargon

#### tags

**Type**: Array of strings
**Required**: Yes
**Description**: Keywords for categorization and search

**Format**: At least 2 tags, lowercase, hyphen-separated

**Examples**:

```yaml
tags: ["javascript", "formatting", "code-generation"]
tags: ["python", "pep8", "indentation"]
tags: ["react", "components", "hooks"]

```

**Best Practices**:

- Include the primary language/framework

- Add functional tags (formatting, testing, security)

- Use existing tags from TAGS.md when possible

- Keep tags relevant and specific

#### inclusion

**Type**: String
**Required**: Yes
**Description**: When this steering document should be active

**Values**: `always` or `manual`

**Examples**:

```yaml
inclusion: always  # Active by default
inclusion: manual  # Only active when user includes it

```

**Best Practices**:

- Use `always` for general language formatting rules

- Use `manual` for opinionated or project-specific rules

- Use `manual` for framework-specific rules that might conflict

### Optional Fields

#### category

**Type**: String
**Required**: No
**Description**: Category folder where document lives

**Examples**:

```yaml
category: "code-quality"
category: "testing"
category: "security"
category: "frameworks"
category: "workflows"

```

#### author

**Type**: String
**Required**: No
**Description**: GitHub username of the document creator

**Examples**:

```yaml
author: "octocat"
author: "your-github-username"

```

#### version

**Type**: String
**Required**: No
**Description**: Semantic version of the document

**Format**: `"MAJOR.MINOR.PATCH"`

**Examples**:

```yaml
version: "1.0.0"
version: "2.1.0"

```

**Best Practices**:

- Start at 1.0.0

- Increment MAJOR for breaking changes

- Increment MINOR for new features

- Increment PATCH for bug fixes

#### kiro_version

**Type**: String
**Required**: No
**Description**: Minimum Kiro version required

**Format**: `">=X.Y.Z"` or `"^X.Y.Z"`

**Examples**:

```yaml
kiro_version: ">=1.0.0"
kiro_version: "^2.0.0"

```

#### dependencies

**Type**: Array of strings
**Required**: No
**Description**: Other steering documents required

**Examples**:

```yaml
dependencies: []
dependencies: ["javascript-formatting.md"]
dependencies: ["typescript-formatting.md", "react-patterns.md"]

```

#### file_references

**Type**: Array of strings
**Required**: No
**Description**: External files referenced by this steering document

**Examples**:

```yaml
file_references: []
file_references: ["package.json", ".eslintrc.js"]
file_references: [".prettierrc", "tsconfig.json"]

```

## Content Sections

### Core Principle

**Required**: Yes
**Format**: One clear sentence explaining the purpose

**Template**:

```markdown
## Core Principle

**[Brief description of what this steering does and why it matters]**

```

**Examples**:

```markdown
## Core Principle

**Kiro writes clean, consistently formatted JavaScript that prevents common syntax errors.**

```

```markdown
## Core Principle

**This steering document guides Kiro to write Python code that follows basic standards and avoids common syntax errors.**

```

**Best Practices**:

- Keep it to one sentence

- Make it bold for emphasis

- Focus on the benefit, not just the rules

- Be specific about what it does

### How Kiro Will Write [Language]

**Required**: Yes
**Format**: Subsections with rules and examples

**Template**:

```markdown
## How Kiro Will Write [Language]

### [Rule Category 1]

**[Specific Rule]**: [Clear description]

```[language]
// Kiro will write:
[good example]

// Not:
[bad example]

```

### [Rule Category 2]

[More rules...]

```text
(end of template)

```

**Examples**:

```markdown
## How Kiro Will Write JavaScript

### Code Style

**Semicolons**: Always include semicolons at the end of statements

```javascript
// Kiro will write:
const name = 'John';

// Not:
const name = 'John'

```

```text
(end of example)

```

**Best Practices**:

- Use 3-4 rule categories maximum

- Each rule should have a clear before/after example

- Use code fencing with language tags

- Use "Kiro will write" / "Not" format consistently

- Keep examples realistic and practical

### What This Prevents

**Required**: Yes
**Format**: Bullet list of problems solved

**Template**:

```markdown
## What This Prevents

- [Specific problem 1]

- [Specific problem 2]

- [Specific problem 3]

- [Specific problem 4]

```

**Examples**:

```markdown
## What This Prevents

- Syntax errors from missing semicolons

- Inconsistent indentation that makes code hard to read

- Import chaos with scattered dependencies

- Common typos in variable names

```

**Best Practices**:

- List 3-5 specific problems

- Focus on real issues developers face

- Be concrete, not vague

- Explain the impact

### Customization

**Required**: Yes
**Format**: Brief note about adaptability

**Template**:

```markdown
## Customization

This is a starting point! You can modify these rules by editing this steering document:

- [Customization option 1]

- [Customization option 2]

- [Customization option 3]

```

**Examples**:

```markdown
## Customization

This is a starting point! You can modify these rules by editing this steering document:

- Change single quotes to double quotes if preferred

- Adjust indentation from 2 spaces to 4 spaces

- Modify import organization patterns

```

**Best Practices**:

- Keep it brief

- Mention 2-3 common customizations

- Encourage users to adapt to their needs

- Don't overwhelm with options

### Optional: Validation with External Tools

**Required**: No (but recommended)
**Format**: Clearly marked as optional

**Template**:

````markdown
## Optional: Validation with External Tools

Want to validate that generated code follows these standards? Add these tools:

### Quick Setup (Optional)

```bash
[installation command]

```

**Note**: These tools validate the code after Kiro writes it, but aren't required for the steering document to work.

````

**Examples**:

````markdown
## Optional: Validation with External Tools

Want to validate that generated code follows these standards? Add these tools:

### Quick Setup (Optional)

```bash
npm install --save-dev eslint prettier

```

**Note**: These tools validate the code after Kiro writes it, but aren't required for the steering document to work.

````

**Best Practices**:

- Always mark as "Optional"

- Include the note about not being required

- Keep setup instructions simple

- Only include essential tools

## Markdown Formatting

### Code Blocks

**Always use fenced code blocks with language tags**:

````markdown

```javascript
const example = 'code';

```

````

**Supported languages**:

- `javascript` / `js`

- `typescript` / `ts`

- `python` / `py`

- `css` / `scss`

- `json`

- `yaml`

- `bash` / `sh`

- `markdown` / `md`

### Comments in Code Examples

**Use language-appropriate comments**:

```javascript
// JavaScript comments
const example = 'value';

```

```python
# Python comments
example = 'value'

```

```css
/* CSS comments */
.example {
  color: blue;
}

```

### Before/After Format

**Always use this format for examples**:

````markdown

```[language]
// Kiro will write:
[good example]

// Not:
[bad example]

```

````

**Variations**:

- "Kiro will write" / "Not"

- "Good" / "Bad"

- "Do this" / "Don't do this"

**Best practice**: Use "Kiro will write" / "Not" for consistency

### Emphasis

**Use bold for rule names**:

```markdown
**Semicolons**: Always include semicolons

```

**Use bold for important notes**:

```markdown
**Note**: These tools are optional

```

### Lists

**Use bullet lists for problems and benefits**:

```markdown

- Problem 1

- Problem 2

- Problem 3

```

**Use numbered lists for steps**:

```markdown

1. Step 1

2. Step 2

3. Step 3

```

## Common Patterns

### Pattern: Language Formatting Document

```yaml
---
title: "[Language] Code Quality Standards"
description: "Guides Kiro to write consistent, error-free [language] code"
tags: ["language", "formatting", "code-generation"]
inclusion: always
---

```

### Pattern: Framework-Specific Document

```yaml
---
title: "[Framework] [Feature] Patterns"
description: "Provides [framework] [feature] best practices and structure"
tags: ["framework", "patterns", "components"]
inclusion: manual
---

```

### Pattern: Testing Document

```yaml
---
title: "[Language] Testing Standards"
description: "Ensures [language] tests follow best practices and conventions"
tags: ["language", "testing", "quality"]
inclusion: always
---

```

### Pattern: Security Document

```yaml
---
title: "[Language] Security Best Practices"
description: "Guides Kiro to write secure [language] code"
tags: ["language", "security", "best-practices"]
inclusion: always
---

```

## Validation

### Frontmatter Validation

Check that your frontmatter:

- [ ] Has all required fields (title, description, tags, inclusion)

- [ ] Uses proper YAML syntax

- [ ] Has at least 2 tags

- [ ] Has description under 150 characters

- [ ] Uses valid inclusion value (always or manual)

### Content Validation

Check that your content:

- [ ] Has Core Principle section

- [ ] Has "How Kiro Will Write" section

- [ ] Has "What This Prevents" section

- [ ] Has Customization section

- [ ] Has 3-4 rule categories with examples

- [ ] Uses proper code fencing with language tags

- [ ] Uses "Kiro will write" / "Not" format

### Markdown Validation

Check that your markdown:

- [ ] Has no linting errors

- [ ] Uses proper heading hierarchy

- [ ] Has blank lines around code blocks

- [ ] Has language tags on all code blocks

- [ ] Has no broken links

## Tools for Validation

### Markdown Linting

Use markdownlint to check formatting:

```bash
markdownlint your-document.md

```

### YAML Validation

Use yamllint to check frontmatter:

```bash
yamllint your-document.md

```

### Manual Testing

1. Copy document to `.kiro/steering/`

2. Ask Kiro to write code

3. Verify rules are followed

4. Check examples match output

## Quick Reference

### Minimal Valid Document

```yaml
---
title: "Example Standards"
description: "Guides Kiro to write example code"
tags: ["example", "formatting"]
inclusion: always
---

## Core Principle

**Brief description of what this does.**

## How Kiro Will Write Example

### Rule Category

**Specific Rule**: Description

```example
// Kiro will write:
good_example

// Not:
bad_example

```

## What This Prevents

- Problem 1

- Problem 2

## Customization

This is a starting point - modify as needed.

```text
(end of minimal example)

```

## Next Steps

1. Use this reference when creating your document

2. Validate your frontmatter and content

3. Test your document with Kiro

4. Review the [Quality Checklist](../.github/QUALITY_CHECKLIST.md)

5. Submit your pull request
