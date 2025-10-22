---
title: "Markdown Quality Standards"
description: "Prevents markdown formatting issues and MD047 errors automatically"
tags: ["markdown", "quality", "linting", "formatting"]
inclusion: always
---

## Markdown Quality Standards

## 🚨 CRITICAL: fsWrite text MUST end with empty line 🚨

## Core Principle: Get It Right the First Time

**Never create markdown files with formatting issues.** Always produce clean, properly formatted markdown that passes all linting checks on the first attempt. This prevents wasted time, backtracking, and credit consumption from fixing avoidable issues.

## Mandatory Workflow

When creating or editing any .md files, follow this exact sequence:

1. **Write properly formatted content** following the standards below
2. **fsWrite(text="content\n\n")** - ALWAYS include empty line in text parameter (NEVER forget this - prevents MD047)
3. **Run getDiagnostics immediately** after creating/editing
4. **Fix any remaining issues in the same operation** - never proceed with linting errors

## Formatting Requirements

### File Structure

- **Empty line at end**: Always include an empty line after your last content line
- **Simple prevention**: End fsWrite text with an empty line to avoid MD047 errors
- **Consistent heading hierarchy**: Use proper H1 → H2 → H3 progression
- **Unique headings**: Each heading must be unique (avoid duplicate text)
- **Proper headings**: Use heading syntax, not bold text for section titles

### Spacing Rules

- **Blank lines around headings**: Add blank lines before and after all headings
- **Blank lines around lists**: Required for MD032 compliance
- **Consistent paragraph spacing**: Single blank line between paragraphs
- **No multiple consecutive blank lines**: Never use multiple blank lines in a row (causes MD012 errors)

### Content Standards

- **Clear, descriptive headings**: Make headings self-explanatory
- **Proper list formatting**: Use consistent bullet/number styles
- **Code block formatting**: Use proper fencing with language tags

## Standard Template

```markdown
# Document Title

## Main Section

Content paragraph with proper spacing.

### Subsection

- List item with proper spacing
- Another list item

More content here.

## Another Section

Final content.
```

## Efficiency Rules

- **Zero tolerance for formatting issues**: Fix everything before proceeding
- **Immediate diagnostics**: Always check after file operations
- **Handle MD047 systematically**: Use the strReplace method for trailing newlines
- **Single-pass completion**: Get it right the first time, every time
- **Prevent rework**: Proper formatting saves time and credits

## Tool-Specific Instructions

### For fsWrite

Always include exactly one empty line at the end of your content:

```python
WRONG: fsWrite(path="file.md", text="Final sentence.")
WRONG: fsWrite(path="file.md", text="Final sentence.\n\n\n")  # Multiple blank lines
RIGHT: fsWrite(path="file.md", text="Final sentence.\n\n")
```

The text should end with your content, then exactly one empty line (`\n\n`). Do not add extra spaces, newlines, or blank lines after `\n\n` as this creates multiple consecutive blank lines and triggers MD012 errors.

### For MD047 Errors (Reliable Method)

When getDiagnostics shows MD047, use strReplace with literal empty line in newStr:

```python
strReplace(path="file.md", oldStr="last line content", newStr="last line content.

")
```

The newStr must end with an actual empty line (line break in the string), not `\n`.

## 🚨 FINAL REMINDERS 🚨

- **MD047 Prevention**: Always end fsWrite text with `\n\n` (one empty line) or you WILL get MD047 errors
- **MD012 Prevention**: Never add extra blank lines after `\n\n` or you WILL get MD012 errors (multiple consecutive blank lines)
- **The pattern**: `text="Your last line of content.\n\n"` - nothing after the second `\n`
