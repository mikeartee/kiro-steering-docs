---
title: "Git Commit Standards"
description: "Guides Kiro to write clear, conventional commit messages that follow best practices"
category: "practices"
tags: ["git", "commits", "conventional-commits", "version-control"]
inclusion: always
version: "1.0.0"
---

## Core Principle

**Kiro writes clear, structured commit messages following conventional commit format.** This steering document ensures commit messages are informative, consistent, and useful for project history and automation.

## How Kiro Will Write Commit Messages

### Conventional Commit Format

**Structured messages**: Follow the conventional commit specification

```bash
# Kiro will write:
feat: add user authentication with JWT tokens

Implement JWT-based authentication system with login and logout endpoints.
Includes token refresh mechanism and middleware for protected routes.

# Not:
added auth stuff
```

### Commit Type Prefixes

**Clear categorization**: Use standard prefixes to indicate change type

```bash
# Kiro will write:
feat: add password reset functionality
fix: resolve memory leak in user session handler
docs: update API documentation for auth endpoints
style: format code according to ESLint rules
refactor: simplify user validation logic
test: add unit tests for authentication service
chore: update dependencies to latest versions
perf: optimize database query performance

# Not:
update stuff
changes
fixed it
```

### Subject Line Rules

**Concise and descriptive**: Keep subject lines clear and under 50 characters when possible

```bash
# Kiro will write:
feat: add email verification for new users
fix: prevent duplicate user registration
docs: add installation guide to README

# Not:
feat: I added a really cool new feature that allows users to verify their email addresses when they sign up for the first time
fix: fixed a bug
update
```

### Imperative Mood

**Command form**: Use imperative present tense in subject line

```bash
# Kiro will write:
fix: resolve null pointer exception in user service
feat: add pagination to user list endpoint
refactor: extract validation logic to separate module

# Not:
fix: resolved null pointer exception
feat: added pagination
refactor: extracted validation logic
```

### Body Content

**Detailed explanation**: Provide context and reasoning in the commit body

```bash
# Kiro will write:
fix: prevent race condition in order processing

The order processing system was experiencing race conditions when
multiple requests tried to update the same order simultaneously.

This fix implements optimistic locking using version numbers to
ensure data consistency and prevent lost updates.

Closes #123

# Not:
fix: order bug

fixed the bug
```

### Breaking Changes

**Clear indication**: Mark breaking changes explicitly

```bash
# Kiro will write:
feat!: change API response format to include metadata

BREAKING CHANGE: API responses now include a metadata object.
All clients must update to handle the new response structure.

Before:
{
  "users": [...]
}

After:
{
  "data": {
    "users": [...]
  },
  "metadata": {
    "total": 100,
    "page": 1
  }
}

# Not:
feat: update API
```

### Scope Usage

**Optional context**: Add scope to provide additional context

```bash
# Kiro will write:
feat(auth): add two-factor authentication
fix(api): resolve CORS issue for production domain
docs(readme): add troubleshooting section
test(user): add integration tests for user creation

# Not:
feat: add stuff to auth
```

### Footer References

**Link to issues**: Reference related issues and pull requests

```bash
# Kiro will write:
fix: resolve database connection timeout

Increase connection pool size and add retry logic for failed connections.

Fixes #456
Related to #123, #789

# Not:
fix: database issue
```

## What This Prevents

- **Unclear project history** from vague commit messages
- **Difficult debugging** when trying to understand when changes were made
- **Broken automation** that relies on commit message parsing
- **Poor collaboration** from inconsistent commit practices
- **Lost context** about why changes were made

## Simple Examples

### Before/After: Feature Addition

```bash
# Before:
added new feature

# After:
feat: add user profile customization

Allow users to customize their profile with avatar, bio, and theme preferences.
Includes new API endpoints and UI components for profile management.

Closes #234
```

### Before/After: Bug Fix

```bash
# Before:
fix bug

# After:
fix: resolve incorrect tax calculation for international orders

Tax calculation was using domestic rates for all orders. Now correctly
applies international tax rules based on shipping destination.

Fixes #567
```

### Before/After: Documentation

```bash
# Before:
updated docs

# After:
docs: add API authentication guide

Include step-by-step instructions for implementing API authentication,
with code examples in JavaScript, Python, and cURL.
```

### Before/After: Refactoring

```bash
# Before:
cleaned up code

# After:
refactor: extract email service to separate module

Move email-related functionality from user service to dedicated email service.
Improves code organization and makes email logic reusable across the application.
```

## Customization

This is a starting point for Git commit standards. You can customize by:

- Adding project-specific commit types
- Defining required vs optional scopes
- Setting team-specific conventions
- Adding custom footer keywords

## Related Documents

- [Code Review Standards](../code-quality/code-review-standards.md) - Code quality practices

## Optional: Validation with External Tools

Want to enforce these standards automatically? Consider these tools:

### Git Commit Tools (Optional)

```bash
# Commitlint for validating commit messages
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Husky for Git hooks
npm install --save-dev husky

# Commitizen for interactive commit creation
npm install --save-dev commitizen cz-conventional-changelog
```

### Sample Commitlint Configuration (Optional)

Create `commitlint.config.js`:

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf']
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-max-length': [2, 'always', 72]
  }
};
```

**Note**: These tools help enforce standards but aren't required for the steering document to work.
