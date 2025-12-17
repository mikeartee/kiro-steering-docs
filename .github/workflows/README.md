# GitHub Actions Workflows

This directory contains automated validation workflows for the Kiro Steering Documentation Repository.

## Workflows

### validate-pr.yml

Runs on every pull request to validate contributions before merging.

**Validation checks:**

- **Markdown Linting**: Uses markdownlint-cli2 to check markdown formatting

- **Steering Document Validation**: Runs the Python validation script to check metadata and structure

- **Format Checking**: Verifies proper file endings and no trailing whitespace

- **Frontmatter Validation**: Ensures all steering documents have valid YAML frontmatter

- **Link Checking**: Validates internal links are not broken

- **Summary**: Aggregates results from all checks

**Triggers:**

- Pull requests to `main` or `develop` branches

- Only when markdown files or related paths are modified

### ci.yml

Runs on push to main branch for continuous validation.

**Validation checks:**

- **Repository Validation**: Runs full validation suite on the entire repository

- **Example Code Testing**: Extracts and validates code examples from markdown files
  - JavaScript/TypeScript syntax validation using Node.js
  - Python syntax validation using AST parser

**Triggers:**

- Push to `main` branch

- Manual workflow dispatch

## Configuration Files

### .markdownlint.json

Defines markdown linting rules:

- ATX-style headings (# syntax)

- Dash-style unordered lists

- 2-space indentation for nested lists

- Line length checking disabled (MD013)

- Allows duplicate headings if not siblings (MD024)

- Allows inline HTML (MD033)

- First line doesn't need to be H1 (MD041)

## Local Testing

You can run these checks locally before submitting a pull request:

### Markdown Linting

```bash
# Install markdownlint-cli2
npm install -g markdownlint-cli2

# Run linting
markdownlint-cli2 "**/*.md" "!node_modules/**"

```

### Steering Document Validation

```bash
# Install Python dependencies
pip install -r tools/requirements.txt

# Run validation
python tools/validate-steering.py

```

### Format Checking

```bash
# Check file endings
find . -name "*.md" -not -path "./node_modules/*" -not -path "./.git/*" -exec sh -c 'test -n "$(tail -c 1 "$1")" && echo "Missing newline: $1"' _ {} \;

# Check trailing whitespace
grep -r --include="*.md" --exclude-dir=node_modules --exclude-dir=.git " $" .

```

## Troubleshooting

### Markdown Linting Failures

Common issues:

- **MD047**: Files must end with a newline

- **MD012**: Multiple consecutive blank lines

- **MD032**: Lists must be surrounded by blank lines

### Validation Script Failures

Check the validation script output for specific errors:

- Missing required frontmatter fields

- Invalid YAML syntax

- Missing referenced files

### Example Code Failures

If code examples fail validation:

- Ensure code blocks have proper language tags

- Verify syntax is correct for the language

- Check that examples are complete and not fragments

## Contributing

When adding new workflows:

1. Test locally first using `act` or similar tools

2. Document the workflow purpose and triggers

3. Add appropriate error messages for failures

4. Update this README with new workflow information
