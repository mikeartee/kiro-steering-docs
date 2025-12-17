# Maintainer Guidelines

This document provides guidelines for repository maintainers on managing contributions, releases, and community interactions.

## Maintainer Responsibilities

### Code Review

- Review pull requests within 3-5 business days

- Provide constructive, helpful feedback

- Test steering documents when possible

- Ensure contributions follow guidelines

- Check for quality and completeness

### Issue Management

- Triage new issues within 2 business days

- Label issues appropriately

- Close duplicates and link to originals

- Ask for clarification when needed

- Keep discussions focused and respectful

### Community Engagement

- Welcome new contributors

- Answer questions in discussions

- Highlight great contributions

- Foster an inclusive environment

- Enforce the Code of Conduct

## Review Checklist

### For New Steering Documents

- [ ] Follows the template structure

- [ ] Has complete frontmatter (title, description, category, tags)

- [ ] Includes clear usage examples

- [ ] Has installation instructions

- [ ] Markdown passes linting

- [ ] Tags are appropriate and added to TAGS.md

- [ ] Added to category README

- [ ] No broken links

- [ ] Examples are correct and tested

- [ ] Language is clear and accessible

### For Documentation Updates

- [ ] Changes are accurate

- [ ] Links still work

- [ ] Formatting is consistent

- [ ] No typos or grammar issues

- [ ] Updates related files if needed

### For Infrastructure Changes

- [ ] Changes are well-tested

- [ ] Documentation is updated

- [ ] No breaking changes (or clearly communicated)

- [ ] Backward compatibility considered

## Merging Pull Requests

### Requirements Before Merge

1. All CI checks pass

2. At least one maintainer approval

3. No unresolved conversations

4. Contributor has signed off (if required)

5. Branch is up to date with main

### Merge Process

1. Review the checklist above

2. Test the changes locally if needed

3. Provide feedback or approve

4. Squash and merge (for most PRs)

5. Use merge commit (for releases)

6. Delete the branch after merge

### Commit Message Format

```text
type(scope): brief description

Longer description if needed

Closes #123

```

Types: `feat`, `fix`, `docs`, `chore`, `refactor`

## Release Process

### Version Numbering

Follow Semantic Versioning (SemVer):

- **Major (v2.0.0)**: Breaking changes

- **Minor (v1.1.0)**: New features, backward compatible

- **Patch (v1.0.1)**: Bug fixes, backward compatible

### Creating a Release

1. Update version numbers in relevant files

2. Update CHANGELOG.md with release notes

3. Create a release branch: `release/v1.1.0`

4. Test thoroughly

5. Merge to main

6. Create GitHub release with tag

7. Announce in discussions

### Release Checklist

- [ ] All planned features/fixes are merged

- [ ] Documentation is up to date

- [ ] CHANGELOG.md is updated

- [ ] Version numbers are bumped

- [ ] All tests pass

- [ ] No critical bugs

- [ ] Release notes are written

- [ ] Tag is created

- [ ] GitHub release is published

## Issue Triage

### Labels to Use

- `bug` - Something isn't working

- `enhancement` - New feature or request

- `new-document` - Proposal for new steering document

- `documentation` - Documentation improvements

- `good-first-issue` - Good for newcomers

- `help-wanted` - Extra attention needed

- `question` - Further information requested

- `wontfix` - This will not be worked on

- `duplicate` - This issue already exists

### Priority Labels

- `priority-high` - Critical issues

- `priority-medium` - Important but not urgent

- `priority-low` - Nice to have

### Triage Process

1. Read the issue carefully

2. Ask for clarification if needed

3. Add appropriate labels

4. Link to related issues

5. Assign to milestone if applicable

6. Close if duplicate/invalid

## Community Management

### Welcoming New Contributors

- Thank them for their contribution

- Guide them through the process

- Be patient with mistakes

- Celebrate their first merged PR

### Handling Conflicts

- Stay calm and professional

- Focus on the issue, not the person

- Refer to Code of Conduct when needed

- Escalate to other maintainers if necessary

- Document decisions for transparency

### Recognizing Contributors

- Thank contributors in release notes

- Highlight great contributions in discussions

- Consider adding contributors to README

- Nominate active contributors as maintainers

## Security

### Handling Security Issues

- Security issues should be reported privately

- Respond within 24 hours

- Fix critical issues immediately

- Coordinate disclosure timing

- Credit reporter (if they agree)

### Security Best Practices

- Review dependencies regularly

- Keep GitHub Actions up to date

- Monitor for vulnerabilities

- Document security policies

## Automation

### GitHub Actions

- Monitor workflow runs

- Fix failing workflows promptly

- Update actions when needed

- Add new automation carefully

### Bots and Tools

- Configure Dependabot for updates

- Use markdown linting in CI

- Automate what makes sense

- Don't over-automate

## Communication

### Response Times

- Critical issues: Within 24 hours

- Pull requests: Within 3-5 business days

- General issues: Within 2 business days

- Discussions: Best effort

### Communication Style

- Be friendly and welcoming

- Use clear, simple language

- Provide examples when helpful

- Link to relevant documentation

- Thank people for their time

## Maintainer Meetings

### Frequency

- Monthly sync meetings

- Ad-hoc for urgent matters

- Async communication preferred

### Topics

- Review roadmap progress

- Discuss major decisions

- Plan releases

- Address community feedback

- Improve processes

## Stepping Down

If you need to step down as a maintainer:

1. Give at least 2 weeks notice

2. Document your ongoing work

3. Transfer responsibilities

4. Update maintainer list

5. Stay in touch if possible

## Becoming a Maintainer

Active contributors may be invited to become maintainers based on:

- Consistent, quality contributions

- Helpful community engagement

- Understanding of project goals

- Demonstrated responsibility

- Time commitment availability

## Questions?

If you have questions about these guidelines:

- Ask in maintainer discussions

- Propose changes via PR

- Reach out to existing maintainers

---

Thank you for maintaining this project and supporting the community!
