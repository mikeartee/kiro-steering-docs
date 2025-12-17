# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of this project seriously. If you discover a security vulnerability, please follow these steps:

### For Security Issues

**DO NOT** open a public issue. Instead:

1. **Email**: Send details to the maintainers (check repository for contact info)

2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if you have one)

### What to Expect

- **Acknowledgment**: Within 24 hours

- **Initial Assessment**: Within 3 business days

- **Status Updates**: Every 5 business days

- **Fix Timeline**: Depends on severity
  - Critical: Within 7 days
  - High: Within 14 days
  - Medium: Within 30 days
  - Low: Next regular release

### Disclosure Policy

- We will coordinate disclosure timing with you

- We prefer coordinated disclosure after a fix is available

- We will credit you in the security advisory (unless you prefer anonymity)

## Security Best Practices

### For Users

When using steering documents from this repository:

1. **Review Content**: Always review steering documents before using them

2. **Test First**: Test in a non-production environment

3. **Keep Updated**: Use the latest versions of documents

4. **Report Issues**: Report any security concerns you find

### For Contributors

When contributing steering documents:

1. **No Secrets**: Never include API keys, passwords, or secrets

2. **Safe Examples**: Use placeholder values in examples

3. **Validate Input**: Include input validation in examples

4. **Security Focus**: Consider security implications of patterns

## Known Security Considerations

### Steering Documents

- Steering documents guide code generation but don't execute code

- Always review generated code before committing

- Be cautious with documents from unknown sources

- Test documents in isolated environments first

### Repository Infrastructure

- GitHub Actions workflows are reviewed before merge

- Dependencies are monitored via Dependabot

- Markdown linting prevents some injection attacks

- No executable code in steering documents

## Security Updates

Security updates will be announced via:

- GitHub Security Advisories

- Repository releases

- README updates (for critical issues)

## Scope

This security policy covers:

- The repository infrastructure

- Validation tools and scripts

- Documentation and templates

- Community processes

This policy does NOT cover:

- Third-party tools referenced in documents

- User implementations of steering documents

- External dependencies (report to their maintainers)

## Questions?

If you have questions about this security policy:

- Open a discussion (for general questions)

- Email maintainers (for sensitive matters)

---

Thank you for helping keep this project secure!
