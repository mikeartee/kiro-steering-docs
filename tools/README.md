# Validation Tools

This directory contains tools for validating steering documents in the repository.

## validate-steering.py

A Python script that validates steering documents for proper format, required fields, and compliance with Kiro steering documentation standards.

### Features

- **Frontmatter validation**: Checks required fields, data types, and valid values

- **YAML syntax validation**: Ensures proper YAML formatting in frontmatter

- **File reference validation**: Verifies that referenced files exist

- **Markdown structure validation**: Checks for required sections

- **Batch validation**: Can validate entire directories of steering documents

### Requirements

- Python 3.6+

- PyYAML library

### Installation

```bash
pip install PyYAML

```

### Usage

#### Validate a single file

```bash
python tools/validate-steering.py path/to/steering-document.md

```

#### Validate all files in a directory

```bash
python tools/validate-steering.py categories/code-quality/

```

#### Get help

```bash
python tools/validate-steering.py --help

```

### Validation Rules

#### Required Frontmatter Fields

- `title` (string): Clear, descriptive title

- `description` (string): One-line explanation of the steering document

- `category` (string): Must be one of: code-quality, testing, security, frameworks, workflows

- `tags` (list): List of relevant tags for discoverability

- `inclusion` (string): Must be one of: always, fileMatch, manual

#### Optional Frontmatter Fields

- `author` (string): GitHub username or name

- `version` (string): Version number (e.g., "1.0.0")

- `kiro_version` (string): Minimum Kiro version (e.g., ">=1.0.0")

- `dependencies` (list): List of dependencies

- `file_references` (list): List of files referenced by this steering document

#### Required Markdown Sections

- **Core Principle**: Explains what the steering document does

- **How Kiro Will Write**: Specific rules and examples

- **What This Prevents**: List of problems solved

### Example Output

#### Valid file

```text
✓ categories/code-quality/javascript-standards.md is valid

```

#### File with errors

```text
Validation errors in categories/code-quality/broken-example.md:
  categories/code-quality/broken-example.md [MISSING_REQUIRED_FIELD] Required field 'title' is missing
  categories/code-quality/broken-example.md [INVALID_CATEGORY] Category 'invalid-category' is not valid. Must be one of: code-quality, testing, security, frameworks, workflows
  categories/code-quality/broken-example.md [MISSING_SECTION] Required section 'Core Principle' is missing

```

### Integration with CI/CD

You can use this tool in GitHub Actions or other CI/CD systems to automatically validate contributions:

```yaml

- name: Validate steering documents
  run: python tools/validate-steering.py categories/

```

### Exit Codes

- `0`: All validations passed

- `1`: Validation errors found or script error

### Contributing

To add new validation rules:

1. Modify the `SteeringValidator` class in `validate-steering.py`

2. Add appropriate error types and messages

3. Test with both valid and invalid examples

4. Update this documentation
