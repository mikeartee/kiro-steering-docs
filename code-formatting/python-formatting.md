---
title: "Python Code Quality Standards"
description: "Guides Kiro to write clean, consistent Python code"
tags: ["python", "formatting", "code-generation"]
inclusion: always
---

## Core Principle: Clean, Readable Python

**This steering document guides Kiro to write Python code that follows basic standards and avoids common syntax errors.** When Kiro generates or edits Python files, it will automatically apply these standards.

## How Kiro Will Write Python

### Indentation

**Always use 4 spaces**: Never mix tabs and spaces (this breaks Python!)

```python
# Kiro will write:
def example_function():
    if condition:
        return 'properly indented'
    else:
        return 'consistent spacing'

# Not mixed tabs/spaces or 2-space indentation
```

### Import Organization

**Group imports**: Standard library first, then third-party, then local imports

```python
# Kiro will write:
import os
import sys

import requests
import pandas as pd

from .models import User
from .utils import helper_function

# Not scattered or mixed throughout the file
```

### Naming Conventions

**Use Python naming patterns**: snake_case for functions/variables, PascalCase for classes

```python
# Kiro will write:
class UserManager:
    def __init__(self, database_url):
        self.database_url = database_url

    def create_user(self, user_data):
        user_id = self._generate_id()
        return self._save_user(user_id, user_data)

# Not camelCase or inconsistent naming
```

### Basic Error Prevention

**Simple exception handling**: Catch specific errors, avoid bare except

```python
# Kiro will write:
def process_file(filename):
    try:
        with open(filename, 'r') as file:
            return file.read()
    except FileNotFoundError:
        print(f"File {filename} not found")
        return None

# Avoid bare except: clauses
```

## What This Prevents

- **Indentation errors** that break Python code
- **Import chaos** with scattered dependencies
- **Naming inconsistencies** across functions and classes
- **Silent errors** from poor exception handling

## Simple Examples

### Function Definition

```python
# Kiro will write:
def calculate_total(items):
    total = 0
    for item in items:
        if item.get('price'):
            total += item['price']
    return total

# Clean, consistent, readable
```

### Class Definition

```python
# Kiro will write:
class Calculator:
    def __init__(self):
        self.result = 0

    def add(self, number):
        self.result += number
        return self.result

# Simple, clear structure
```

## Customization

**This is your starting point!** You can modify these rules by editing this steering document:

- Adjust indentation if your team uses a different standard
- Change import organization patterns
- Add project-specific naming conventions
- Include additional error handling patterns

## Optional: Validation with External Tools

Want to validate that generated code follows these standards? Add these tools:

### Quick Setup (Optional)

```bash
pip install black flake8
```

### Basic Usage (Optional)

```bash
# Format code
black your_file.py

# Check for issues
flake8 your_file.py
```

**Note**: These tools validate the code after Kiro writes it, but aren't required for the steering document to work.

## Integration Notes

This steering document works automatically when you:

- Ask Kiro to create Python files (.py)
- Request code modifications or refactoring
- Generate Python scripts or modules

The formatting rules apply consistently across all Python code generation in your project.
