# Quality Standards Checklist

Quick reference for contributors and reviewers to ensure steering documents meet quality standards.

## Pre-Submission Checklist (For Contributors)

Before submitting your PR, verify:

### Metadata

- [ ] Frontmatter includes `title`
- [ ] Frontmatter includes `description` (under 150 characters)
- [ ] Frontmatter includes `tags` (at least 2 relevant tags)
- [ ] Frontmatter includes `inclusion: always` or `inclusion: manual`
- [ ] Title is unique and descriptive
- [ ] Category placement is correct

### Required Sections

- [ ] **Core Principle** - One sentence explaining what this steering does
- [ ] **How Kiro Will Write [Language]** - Specific behavior guidance
- [ ] **What This Prevents** - Bullet list of problems solved
- [ ] **Simple Examples** - At least 2-3 before/after code samples
- [ ] **Customization** - Note that it's a starting point
- [ ] **Optional Tools** - External validation tools clearly marked optional

### Code Examples

- [ ] Examples use proper markdown code fencing with language tags
- [ ] Examples follow "Kiro will write" / "Not" format
- [ ] Examples are realistic and practical
- [ ] Code is syntactically correct
- [ ] Examples demonstrate common use cases (not edge cases)

### Quality Standards

- [ ] Document is beginner-friendly
- [ ] Focuses on 3-4 core issues (not comprehensive)
- [ ] External tools are optional, not required
- [ ] No broken links or references
- [ ] Tested in a real Kiro project
- [ ] Markdown passes linting (run validation)

### Integration

- [ ] Document added to appropriate category folder
- [ ] Category README updated with new document
- [ ] Tags added to TAGS.md (if new tags)
- [ ] No merge conflicts with main branch

## Review Checklist (For Reviewers)

### Initial Check

- [ ] PR description is clear
- [ ] Automated checks pass
- [ ] Document follows template structure
- [ ] No obvious formatting issues

### Content Review

- [ ] All metadata fields present and valid
- [ ] All required sections exist
- [ ] Examples are clear and correct
- [ ] Document is focused (not too comprehensive)
- [ ] External tools are truly optional
- [ ] Beginner-friendly language used

### Testing

- [ ] Copy document to `.kiro/steering/` and test
- [ ] Verify examples work as described
- [ ] Check that Kiro follows the guidance
- [ ] Validate markdown formatting

### Integration Check

- [ ] Document in correct category
- [ ] Category README updated
- [ ] TAGS.md updated (if needed)
- [ ] No duplicate content

### Final Approval

- [ ] All feedback addressed
- [ ] No merge conflicts
- [ ] CI/CD checks pass
- [ ] Ready to merge

## Common Issues Reference

### Issue: Too Comprehensive

**Problem**: Document tries to cover everything
**Fix**: Focus on 3-4 most common issues

### Issue: Setup Barrier

**Problem**: External tools required before steering works
**Fix**: Make tools optional, ensure immediate value

### Issue: Framework Overload

**Problem**: Multiple frameworks in one document
**Fix**: Split into separate framework-specific documents

### Issue: Poor Examples

**Problem**: Examples unclear or don't match rules
**Fix**: Use clear before/after format with realistic code

### Issue: Configuration Hell

**Problem**: Too many options provided
**Fix**: Show one sensible default, mention customization

## Quick Links

- [Reviewer Guidelines](REVIEWER_GUIDELINES.md) - Full review process
- [Steering Document Template](../templates/steering-document-template.md) - Template to follow
- [Contributing Guide](../CONTRIBUTING.md) - How to contribute
- [TAGS.md](../TAGS.md) - Available tags
