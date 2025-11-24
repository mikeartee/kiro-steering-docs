---
title: "JavaScript Code Quality Standards"
description: "Guides Kiro to write consistent, error-free JavaScript code"
category: "code-formatting"
tags: ["javascript", "formatting", "code-generation"]
inclusion: always
---

## Core Principle: Consistent, Clean JavaScript

**This steering document guides Kiro to write JavaScript code that follows consistent patterns and avoids common syntax errors.** When Kiro generates or edits JavaScript files, it will automatically apply these standards.

## RULES

You MUST follow these rules when creating or editing JavaScript files:

1. You MUST include semicolons at the end of all statements
2. You MUST use single quotes for strings (unless escaping is needed)
3. You MUST use 2-space indentation consistently
4. You MUST organize imports with external packages first, then local imports
5. You MUST use const/let instead of var

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
const className = 'btn-primary';

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

### Import Organization

**Group and sort imports**: External packages first, then local imports

```javascript
// Kiro will write:
import React, { useState } from 'react';
import axios from 'axios';

import { Button } from './components/Button';
import { utils } from '../utils/helpers';

// Not scattered or mixed order
```

### Function and Variable Declarations

**Consistent patterns**: Use const/let appropriately, clear function syntax

```javascript
// Kiro will write:
const API_URL = 'https://api.example.com';
let currentUser = null;

const fetchUser = async (id) => {
  const response = await axios.get(`${API_URL}/users/${id}`);
  return response.data;
};

// Avoid var, prefer const when possible
```

### Error Prevention

**Common mistake avoidance**: Kiro will avoid patterns that commonly cause errors

```javascript
// Kiro will write:
const items = [1, 2, 3];
items.forEach((item) => {
  console.log(item);
});

// Avoid missing parentheses, brackets, or trailing commas in wrong places
```

## What This Prevents

- **Syntax errors** from missing semicolons, brackets, or quotes
- **Inconsistent indentation** that makes code hard to read
- **Import chaos** with scattered and unorganized dependencies
- **Common typos** in variable names and function calls
- **Style inconsistencies** across different files

## Framework-Specific Behavior

### React Components

When writing React code, Kiro will:

```javascript
// Use consistent component structure
import React, { useState, useEffect } from 'react';

const MyComponent = ({ title, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Effect logic here
  }, []);

  return (
    <div className="my-component">
      <h1>{title}</h1>
    </div>
  );
};

export default MyComponent;
```

### TypeScript Files

For `.ts` and `.tsx` files, Kiro will:

```typescript
// Include proper type annotations
interface User {
  id: number;
  name: string;
  email: string;
}

const createUser = (userData: Partial<User>): User => {
  return {
    id: Date.now(),
    ...userData,
  } as User;
};
```

## Customization

**This is your starting point!** You can modify these rules by editing this steering document:

- Change `'single quotes'` to `"double quotes"` if preferred
- Adjust indentation from 2 spaces to 4 spaces or tabs
- Modify import organization patterns
- Add project-specific naming conventions

## Optional: Validation with External Tools

Want to validate that generated code follows these standards? Add these tools to your project:

### Quick Setup (Optional)

```bash
npm install --save-dev eslint prettier
```

### Basic ESLint Config (Optional)

Create `.eslintrc.js`:

```javascript
module.exports = {
  env: { browser: true, es2022: true, node: true },
  extends: ['eslint:recommended'],
  rules: {
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
  },
};
```

**Note**: These tools validate the code after Kiro writes it, but aren't required for the steering document to work.

## Integration Notes

This steering document works automatically when you:

- Ask Kiro to create JavaScript/TypeScript files
- Request code modifications or refactoring
- Generate React components or Node.js modules
- Work with configuration files (package.json, etc.)

The formatting rules apply consistently across all JavaScript code generation in your project.
