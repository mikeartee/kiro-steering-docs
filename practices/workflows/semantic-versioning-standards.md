---
title: Semantic Versioning Standards
description: Guides Kiro to follow semantic versioning best practices for version bumping and release management
category: workflows
tags:
  - versioning
  - semver
  - release
  - changelog
  - workflow
  - best-practices
inclusion: always
applicableTo:
  - web-app
  - library
  - cli-tool
  - api-server
  - vscode-extension
version: 1.0.0
---

## Core Principle

**Kiro follows semantic versioning (SemVer) to communicate the impact of changes clearly.** This steering document ensures version numbers are meaningful, changelogs are maintained, and releases are predictable.

## RULES

You MUST follow these rules when versioning:

1. You MUST bump the version BEFORE creating a release or package
2. You MUST NOT reuse or overwrite existing version numbers
3. You MUST use semantic versioning format (MAJOR.MINOR.PATCH)
4. You MUST update CHANGELOG.md with every version bump
5. You MUST preserve previous releases for rollback capability

## How Kiro Will Write Version Updates

### Version Format

**MAJOR.MINOR.PATCH**: Each number has specific meaning

```text
# Kiro will use:
1.0.0 → 1.0.1  (patch: bug fix)
1.0.1 → 1.1.0  (minor: new feature)
1.1.0 → 2.0.0  (major: breaking change)

# Not:
1.0.0 → 1.0.0.1  (invalid format)
1.0.0 → 1.0     (missing patch)
v1.0.0          (prefix in version field - use only in tags)
```

### When to Bump PATCH (0.0.X)

**Bug fixes and minor corrections**: No new features, no breaking changes

```text
# Kiro will bump PATCH for:
- Bug fixes
- Documentation corrections
- Typo fixes
- Minor refactoring with no behavior changes
- Dependency updates (non-breaking)
- Performance improvements (no API changes)

# Example:
1.2.3 → 1.2.4
```

### When to Bump MINOR (0.X.0)

**New features**: Backward-compatible additions

```text
# Kiro will bump MINOR for:
- New features
- New API endpoints or methods
- New configuration options
- New optional parameters
- Deprecation notices (not removals)
- Significant internal improvements

# Example:
1.2.4 → 1.3.0  (patch resets to 0)
```

### When to Bump MAJOR (X.0.0)

**Breaking changes**: Incompatible API or behavior changes

```text
# Kiro will bump MAJOR for:
- Breaking API changes
- Removed features or endpoints
- Changed default behavior
- Renamed public methods or properties
- Changed required parameters
- Dropped support for platforms/versions

# Example:
1.3.0 → 2.0.0  (minor and patch reset to 0)
```

### Changelog Updates

**Document every change**: Keep CHANGELOG.md current

```markdown
# Kiro will write:

## [1.3.0] - 2024-01-15

### Added
- New user authentication endpoint
- Support for OAuth2 providers

### Changed
- Improved error messages for validation failures

### Fixed
- Memory leak in session handler

## [1.2.4] - 2024-01-10

### Fixed
- Incorrect date formatting in reports
```

### Pre-release Versions

**Alpha, beta, and release candidates**: Use standard suffixes

```text
# Kiro will use:
1.0.0-alpha.1   (early development)
1.0.0-beta.1    (feature complete, testing)
1.0.0-rc.1      (release candidate)

# Precedence:
1.0.0-alpha.1 < 1.0.0-beta.1 < 1.0.0-rc.1 < 1.0.0
```

### Release Workflow

**Consistent process**: Follow the same steps every release

```bash
# Kiro will follow this workflow:

# 1. Update version in package.json (or equivalent)
# 2. Update CHANGELOG.md with new version section
# 3. Run tests to verify everything works
# 4. Build/compile the project
# 5. Create git tag for the version
# 6. Push changes and tag
# 7. Create release artifacts

# Example commands:
npm version patch  # or minor, or major
git push origin main --tags
```

## What This Prevents

- **Version confusion** from inconsistent numbering
- **Breaking user code** without clear communication
- **Lost releases** from overwritten versions
- **Unclear history** from missing changelog entries
- **Rollback failures** from missing previous versions

## Simple Examples

### Before/After: Version Decision

```text
# Before (unclear):
"I made some changes, let's call it version 2"

# After (semantic):
"I added a new feature (backward compatible) → bump MINOR
Current: 1.2.3 → New: 1.3.0"
```

### Before/After: Changelog Entry

```markdown
# Before (vague):
## v2
- Updates and fixes

# After (detailed):
## [2.0.0] - 2024-01-20

### Breaking Changes
- Renamed `getUser()` to `fetchUser()` for consistency
- Removed deprecated `legacyAuth` option

### Added
- New `refreshToken()` method

### Fixed
- Race condition in concurrent requests
```

### Before/After: Release Process

```bash
# Before (ad-hoc):
npm publish  # hope the version is right

# After (systematic):
# 1. Verify current version
npm version  # shows 1.2.3

# 2. Decide bump type based on changes
npm version minor  # bumps to 1.3.0, creates commit and tag

# 3. Update changelog (if not automated)
# 4. Push with tags
git push origin main --tags

# 5. Publish
npm publish
```

## Version Decision Guide

Use this quick reference:

| Change Type | Version Bump | Example |
|-------------|--------------|---------|
| Bug fix | PATCH | 1.0.0 → 1.0.1 |
| New feature (compatible) | MINOR | 1.0.1 → 1.1.0 |
| Breaking change | MAJOR | 1.1.0 → 2.0.0 |
| Documentation only | PATCH | 1.0.0 → 1.0.1 |
| Deprecation notice | MINOR | 1.0.0 → 1.1.0 |
| Deprecation removal | MAJOR | 1.1.0 → 2.0.0 |
| Security fix | PATCH | 1.0.0 → 1.0.1 |
| Performance improvement | PATCH | 1.0.0 → 1.0.1 |

## Customization

This is a starting point for versioning standards. You can customize by:

- Adding project-specific release checklists
- Defining automated version bump triggers
- Including platform-specific packaging steps
- Adding approval workflows for major versions

## Related Documents

- [Git Commit Standards](./git-commit-standards.md) - Commit message conventions
- [Development Guidelines](./development-guidelines.md) - Development workflow practices

