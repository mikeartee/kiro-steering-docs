# Examples: Good and Bad Steering Documents

This document provides concrete examples of well-crafted steering documents versus common mistakes. Use these as a reference when creating your own.

## Example 1: JavaScript Formatting

### Good Example

````markdown
---
title: "JavaScript Code Quality Standards"
description: "Guides Kiro to write consistent, error-free JavaScript code"
tags: ["javascript", "formatting", "code-generation"]
inclusion: always
---

## Core Principle

**Kiro writes clean, consistently formatted JavaScript that prevents common syntax errors.**

## How Kiro Will Write JavaScript

### Code Style

**Semicolons**: Always include semicolons at the end of statements

```javascript
// Kiro will write:
const name = 'John';
const age = 30;

// Not:
const name = 'John'
const age = 30
```

**Quotes**: Use single quotes for strings

```javascript
// Kiro will write:
const message = 'Hello world';

// Not:
const message = "Hello world";
```

**Indentation**: Use 2 spaces for indentation

```javascript
// Kiro will write:
function example() {
  if (condition) {
    return 'properly indented';
  }
}

// Not mixed tabs/spaces or 4-space indentation
```

## What This Prevents

- Syntax errors from missing semicolons
- Inconsistent indentation that makes code hard to read
- Import chaos with scattered dependencies
- Common typos in variable names

## Customization

This is a starting point! You can modify these rules by editing this steering document:

- Change single quotes to double quotes if preferred
- Adjust indentation from 2 spaces to 4 spaces
- Modify import organization patterns

## Optional: Validation with External Tools

Want to validate that generated code follows these standards? Add these tools:

### Quick Setup (Optional)

```bash
npm install --save-dev eslint prettier
```

**Note**: These tools validate the code after Kiro writes it, but aren't required for the steering document to work.
````

**Why this is good**:

- ✅ Focuses on 3 core rules (semicolons, quotes, indentation)
- ✅ Clear before/after examples
- ✅ Works immediately without setup
- ✅ External tools are clearly optional
- ✅ Beginner-friendly language
- ✅ Allows customization

### Bad Example

````markdown
---
title: "Complete JavaScript Reference"
description: "Everything you need to know about JavaScript"
tags: ["javascript"]
---

## Setup

Before using this steering document, you must install and configure:

```bash
npm install eslint prettier babel webpack
```

Create .eslintrc.js with these 50 rules...

## JavaScript Standards

### Variables (20 rules)

1. Always use const unless you need let
2. Never use var
3. Use descriptive names
4. Follow camelCase
5. Avoid single letter names except in loops
[15 more rules...]

### Functions (25 rules)

1. Use arrow functions for callbacks
2. Use function declarations for named functions
3. Always return a value
[22 more rules...]

### Classes (18 rules)

[18 more rules...]

### React Patterns

[React-specific content...]

### Node.js Patterns

[Node.js-specific content...]

### Vue.js Patterns

[Vue.js-specific content...]
````

**Why this is bad**:

- ❌ Requires extensive setup before working
- ❌ Tries to cover everything (60+ rules)
- ❌ Mixes multiple frameworks
- ❌ No clear before/after examples
- ❌ Overwhelming for beginners
- ❌ No clear focus

## Example 2: Python Formatting

### Good Example

````markdown
---
title: "Python Code Quality Standards"
description: "Guides Kiro to write clean, readable Python code"
tags: ["python", "formatting", "code-generation"]
inclusion: always
---

## Core Principle

**Kiro writes clean, readable Python that follows basic standards and avoids common syntax errors.**

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

## What This Prevents

- Indentation errors that break Python code
- Import chaos with scattered dependencies
- Naming inconsistencies across functions and classes
- Silent errors from poor exception handling

## Customization

This is your starting point! You can modify these rules by editing this steering document.

## Optional: Validation with External Tools

Want to validate that generated code follows these standards? Add these tools:

### Quick Setup (Optional)

```bash
pip install black flake8
```

**Note**: These tools validate the code after Kiro writes it, but aren't required for the steering document to work.
````

**Why this is good**:

- ✅ Focuses on 3 essential rules
- ✅ Emphasizes critical Python requirement (4-space indentation)
- ✅ Clear, realistic examples
- ✅ Works immediately
- ✅ External tools optional
- ✅ Beginner-friendly

### Bad Example

````markdown
---
title: "Python Best Practices"
tags: ["python"]
---

## Python Coding Standards

Use PEP 8 standards for all Python code.

### Variables

Use good variable names.

```python
x = 5  # bad
user_count = 5  # good
```

### Functions

Write good functions.

### Classes

Use classes properly.

### Django Patterns

[Django-specific content mixed in...]

### Flask Patterns

[Flask-specific content mixed in...]

### FastAPI Patterns

[FastAPI-specific content mixed in...]
````

**Why this is bad**:

- ❌ Too vague ("use PEP 8" without specifics)
- ❌ Incomplete examples (no before/after comparison)
- ❌ Mixes multiple frameworks
- ❌ Missing critical information (4-space indentation)
- ❌ No clear structure
- ❌ Not actionable

## Example 3: TypeScript Formatting

### Good Example

````markdown
---
title: "TypeScript Code Quality Standards"
description: "Guides Kiro to write strongly-typed, consistent TypeScript code"
tags: ["typescript", "formatting", "type-safety"]
inclusion: always
---

## Core Principle

**Kiro writes clean, consistently formatted TypeScript that leverages strong typing and prevents common type-related errors.**

## How Kiro Will Write TypeScript

### Type Annotations

**Explicit types for clarity**: Clear type annotations that improve code readability

```typescript
// Kiro will write:
function calculateTotal(price: number, tax: number): number {
  return price + price * tax;
}

const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};

// Not:
function calculateTotal(price, tax) {
  return price + price * tax;
}

const user = {
  id: 1,
  name: "John Doe"
};
```

### Interface Definitions

**Clear interface structure**: Well-organized interfaces with consistent naming

```typescript
// Kiro will write:
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
}

// Not:
interface User {
  createdAt: Date;
  name: string;
  id: number;
  isActive: boolean;
}
```

### Import Organization

**Logical import grouping**: Imports organized by source and purpose

```typescript
// Kiro will write:
import React from 'react';
import axios from 'axios';

import { UserService } from '../services/UserService';
import type { User } from '../types/user';

// Not scattered or mixed
```

## What This Prevents

- Runtime type errors from missing annotations
- API integration issues from poorly defined interfaces
- Import confusion from disorganized modules
- Maintenance headaches from weak typing

## Customization

This is a starting point focused on the most common TypeScript issues. You can extend these rules based on your project's needs.

## Optional: Validation with External Tools

Want to validate that generated TypeScript follows these standards? Add these tools:

### Quick Setup (Optional)

```bash
npm install --save-dev typescript @typescript-eslint/parser
```

**Note**: These tools validate the TypeScript after Kiro writes it, but aren't required for the steering document to work.
````

**Why this is good**:

- ✅ Focuses on 3 TypeScript-specific issues
- ✅ Clear type-related examples
- ✅ Shows realistic code patterns
- ✅ Works immediately
- ✅ External tools optional
- ✅ TypeScript-focused (not generic JavaScript)

### Bad Example

````markdown
---
title: "TypeScript Guide"
tags: ["typescript"]
---

Use TypeScript properly.

## Types

Add types to everything.

```typescript
const x: number = 5;
```

## Interfaces

Use interfaces.

## Generics

Use generics when needed.

## Advanced Types

- Union types
- Intersection types
- Conditional types
- Mapped types
- Template literal types
- Utility types
[No examples provided]
````

**Why this is bad**:

- ❌ Too vague ("use types" without showing how)
- ❌ Minimal examples
- ❌ No before/after comparisons
- ❌ Lists advanced features without explanation
- ❌ Not actionable
- ❌ Missing structure

## Key Patterns to Follow

### Pattern 1: Clear Before/After Examples

**Good**:

```javascript
// Kiro will write:
const name = 'John';

// Not:
const name = "John"
```

**Bad**:

```javascript
const name = 'John';  // Use single quotes
```

### Pattern 2: Specific, Actionable Rules

**Good**: "Always use 4 spaces for indentation in Python"

**Bad**: "Use proper indentation"

### Pattern 3: Focus on Essentials

**Good**: 3-4 core rules that solve common problems

**Bad**: 50+ rules trying to cover everything

### Pattern 4: Optional External Tools

**Good**:

```markdown
## Optional: Validation with External Tools

Want to validate? Add these tools:

**Note**: These tools validate the code after Kiro writes it, but aren't required for the steering document to work.
```

**Bad**:

```markdown
## Setup Required

First, install these tools...
```

### Pattern 5: Beginner-Friendly Language

**Good**: "Kiro will write clean, consistent code that prevents common errors"

**Bad**: "Leveraging advanced metaprogramming paradigms to optimize syntactic constructs"

## Checklist for Your Steering Document

Use this checklist to evaluate your steering document:

- [ ] Focuses on 3-4 core rules
- [ ] Includes clear before/after examples
- [ ] Works immediately without setup
- [ ] External tools are clearly optional
- [ ] Uses beginner-friendly language
- [ ] Doesn't mix multiple frameworks
- [ ] Provides realistic, practical examples
- [ ] Allows customization
- [ ] Solves real problems
- [ ] Has been tested with Kiro

## Next Steps

1. Review these examples carefully
2. Identify which patterns your document follows
3. Refine your document based on the good examples
4. Test your document with Kiro
5. Submit for review

Remember: The goal is to create immediately useful, beginner-friendly steering documents that solve real problems!
