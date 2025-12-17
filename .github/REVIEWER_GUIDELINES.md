# Reviewer Guidelines

## Purpose

This document provides guidelines for reviewing contributions to the Kiro Steering Documentation Repository. Our goal is to maintain high-quality, useful steering documents while fostering a welcoming community.

## Review Philosophy

- **Be constructive**: Focus on helping contributors improve their submissions

- **Be specific**: Point to exact issues and suggest concrete improvements

- **Be encouraging**: Recognize good work and thank contributors for their time

- **Be consistent**: Apply quality standards fairly across all contributions

## Quality Standards Checklist

### Required Elements

Use this checklist when reviewing new steering documents:

#### Metadata Validation

- [ ] Frontmatter includes all required fields:
  - [ ] `title` - Clear, descriptive title
  - [ ] `description` - One-sentence summary of what the steering does
  - [ ] `tags` - At least 2 relevant tags
  - [ ] `inclusion` - Set to `always` or `manual`

- [ ] Title is unique and not duplicated in the repository

- [ ] Description is concise (under 150 characters)

- [ ] Tags match existing tags in TAGS.md or new tags are justified

- [ ] Category placement is appropriate

#### Content Quality

- [ ] **Core Principle section exists** - One clear sentence explaining the steering's purpose

- [ ] **"How Kiro Will Write" section exists** - Specific behavior guidance with examples

- [ ] **"What This Prevents" section exists** - Bullet list of problems solved

- [ ] **Examples are provided** - At least 2-3 before/after code samples

- [ ] **Customization section exists** - Notes that it's a starting point

- [ ] **Optional tools section** - External validation tools clearly marked as optional

#### Code Examples

- [ ] Examples use proper markdown code fencing with language tags

- [ ] Examples follow "Kiro will write" / "Not" format

- [ ] Examples are realistic and practical

- [ ] Code in examples is syntactically correct

- [ ] Examples demonstrate the most common use cases

#### Documentation Completeness

- [ ] Document is beginner-friendly and doesn't assume advanced knowledge

- [ ] Installation/setup instructions are clear (if applicable)

- [ ] Document focuses on 3-4 core issues, not comprehensive coverage

- [ ] External tools are truly optional, not required for basic functionality

- [ ] No broken links or references

#### Testing Verification

- [ ] Contributor confirms document was tested in a real project

- [ ] Examples work as documented

- [ ] No obvious errors or typos

- [ ] Markdown passes linting checks

### Common Issues to Watch For

#### The "Wikipedia Trap"

- Document tries to be comprehensive instead of focused

- Too many rules or edge cases covered

- **Fix**: Ask contributor to focus on 3-4 most common issues

#### The "Setup Barrier"

- External tools are required before steering works

- Complex installation steps needed

- **Fix**: Make external tools optional, ensure steering works immediately

#### The "Framework Overload"

- Multiple frameworks mixed in one document

- React, Vue, Angular examples all in one file

- **Fix**: Suggest splitting into separate framework-specific documents

#### The "Configuration Hell"

- Too many configuration options provided

- Multiple competing approaches shown

- **Fix**: Pick one sensible default, mention customization is possible

#### Poor Examples

- Examples are too simple or too complex

- No clear before/after comparison

- Examples don't match the stated rules

- **Fix**: Request clearer, more practical examples

## Review Process

### Initial Review (Within 48 Hours)

1. **Acknowledge the PR**: Thank the contributor and let them know review is in progress

2. **Run automated checks**: Ensure CI/CD validation passes

3. **Quick scan**: Check if document follows basic template structure

4. **Early feedback**: If major issues exist, provide early guidance to save time

### Detailed Review

1. **Use the checklist**: Go through the Quality Standards Checklist systematically

2. **Test the document**: Copy it to `.kiro/steering/` and test with Kiro

3. **Verify examples**: Ensure code examples are correct and work as described

4. **Check integration**: Verify document is added to category README and TAGS.md

5. **Provide feedback**: Use GitHub's review feature with specific line comments

### Feedback Guidelines

#### Good Feedback Examples

✅ "The examples in the 'Function Definitions' section are great! Could you add one more example showing async/await patterns?"

✅ "The frontmatter is missing the `inclusion` field. Please add `inclusion: always` to make this steering document active by default."

✅ "This is really useful! However, the document covers 8 different rules. Could we focus on the 3-4 most important ones to keep it beginner-friendly?"

#### Poor Feedback Examples

❌ "This needs work." (Too vague)

❌ "You should know better than to include React examples here." (Condescending)

❌ "This is wrong." (Not constructive, no explanation)

### Approval Criteria

Approve the PR when:

- [ ] All required checklist items are satisfied

- [ ] Contributor has addressed all review feedback

- [ ] Document has been tested and works as described

- [ ] No merge conflicts exist

- [ ] CI/CD checks pass

### Requesting Changes

When requesting changes:

1. **Be specific**: Point to exact lines and explain what needs to change

2. **Explain why**: Help contributor understand the reasoning

3. **Suggest solutions**: Provide examples of how to fix issues

4. **Set expectations**: Let contributor know if changes are minor or major

### Merging

After approval:

1. **Final check**: Ensure all automated checks pass

2. **Merge**: Use "Squash and merge" for clean history

3. **Thank contributor**: Leave a comment thanking them for their contribution

4. **Close related issues**: Link and close any related issues

## Handling Edge Cases

### Duplicate Documents

If a similar document already exists:

1. Check if the new document offers unique value

2. Consider if documents should be merged

3. Discuss with contributor about differentiation or consolidation

### Controversial Approaches

If a document promotes a controversial coding style:

1. Ensure it's clearly marked as opinionated

2. Verify it solves real problems

3. Consider adding a note about alternative approaches

4. Focus on whether it's useful, not whether you personally agree

### Low-Quality Submissions

If a submission doesn't meet minimum standards:

1. Provide constructive feedback with specific improvements needed

2. Offer to help if contributor is new to open source

3. If contributor is unresponsive after 2 weeks, close with kind explanation

4. Leave door open for resubmission after improvements

### Incomplete Submissions

If a PR is submitted as "work in progress":

1. Ask contributor to mark as draft PR

2. Provide early feedback if requested

3. Wait for contributor to mark as ready for review

## Community Feedback System

### Rating and Feedback

While we don't have automated ratings yet, encourage community feedback through:

- GitHub issues for problems with specific documents

- Discussions for general feedback

- PR comments for improvement suggestions

### Tracking Document Quality

Monitor:

- Issue reports about specific documents

- Usage patterns (if analytics available)

- Community discussions about document effectiveness

- Contributor engagement and repeat contributions

## Reviewer Responsibilities

As a reviewer, you are responsible for:

- **Timely reviews**: Respond to PRs within 48 hours

- **Quality maintenance**: Ensure standards are consistently applied

- **Community building**: Foster a welcoming environment

- **Documentation**: Keep these guidelines updated based on learnings

- **Mentorship**: Help new contributors improve their submissions

## Getting Help

If you're unsure about a review decision:

- Tag other maintainers for second opinions

- Discuss in maintainer channels

- Refer to existing high-quality documents as examples

- When in doubt, err on the side of being helpful and encouraging

## Continuous Improvement

These guidelines will evolve. If you notice patterns or have suggestions:

- Open an issue to discuss guideline improvements

- Propose changes via PR to this document

- Share learnings in maintainer discussions
