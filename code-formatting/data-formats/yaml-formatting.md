---
title: "YAML Formatting Standards"
description: "Guides Kiro to write clean, properly indented YAML configuration files"
category: "code-quality"
tags: ["yaml", "formatting", "config", "devops"]
inclusion: always
---

## Core Principle

**Kiro writes clean, consistently formatted YAML that prevents indentation errors and maintains readable configuration structure.**

## How Kiro Will Write YAML

### Indentation

**2-space indentation**: Consistent spacing for all nested structures

```yaml
# Kiro will write:
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    environment:
      NODE_ENV: production

# Not:
services:
    web:
        image: nginx:latest
        ports:
        - "80:80"
```

### Key Formatting

**Consistent key-value spacing**: Space after colon, no space before

```yaml
# Kiro will write:
database:
  host: localhost
  port: 5432
  name: myapp
  credentials:
    username: admin
    password: secret

# Not:
database:
  host : localhost
  port:5432
  name:myapp
```

### List Formatting

**Clear list structure**: Consistent dash placement and indentation

```yaml
# Kiro will write:
dependencies:
  - express
  - mongoose
  - dotenv

features:
  - name: authentication
    enabled: true
  - name: caching
    enabled: false

# Not:
dependencies:
- express
- mongoose
- dotenv

features:
- name: authentication
  enabled: true
- name: caching
  enabled: false
```

### String Quoting

**Quote when necessary**: Use quotes for special characters or ambiguous values

```yaml
# Kiro will write:
message: "Hello, World!"
version: "1.0.0"
port: 8080
enabled: true
description: Simple message

# Not:
message: Hello, World!
version: 1.0.0
port: "8080"
enabled: "true"
```

## What This Prevents

- Indentation errors that break YAML parsing
- Inconsistent formatting across configuration files
- Ambiguous value types (strings vs numbers vs booleans)
- Hard-to-read nested structures
- Merge conflicts from inconsistent spacing

## Customization

This is a starting point! You can modify these rules by editing this steering document:

- Adjust indentation from 2 spaces to 4 spaces if preferred
- Change quoting preferences for strings
- Modify list formatting style
- Add project-specific conventions

## Optional: Validation with External Tools

Want to validate that generated YAML follows these standards? Add these tools:

### Quick Setup (Optional)

```bash
npm install --save-dev prettier prettier-plugin-yaml
# or
pip install yamllint
```

**Note**: These tools validate the YAML after Kiro writes it, but aren't required for the steering document to work.
