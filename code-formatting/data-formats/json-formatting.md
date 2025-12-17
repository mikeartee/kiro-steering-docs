---
title: JSON Code Quality Standards
description: Guides Kiro to write consistent, error-free JSON with proper formatting
category: code-quality
tags:
  - json
  - formatting
  - code-generation
  - data
  - data-format
inclusion: always
applicableTo:
  - web-app
  - library
  - cli-tool
  - api-server
  - vscode-extension
filePatterns:
  - '**/*.json'
---

## Core Principle

**Kiro writes clean, consistently formatted JSON that prevents parsing errors and maintains readable structure.**

## RULES

You MUST follow these rules when creating or editing JSON files:

1. You MUST use 2-space indentation consistently

2. You MUST use double quotes for all keys and string values

3. You MUST organize keys logically (important fields first)

4. You MUST ensure valid JSON syntax (no trailing commas, proper brackets)

5. You MUST NOT use single quotes or unquoted keys

## How Kiro Will Write JSON

### Consistent Indentation

**2-space indentation**: Maintains readability and consistency with other formats

```json
// Kiro will write:
{
  "name": "John Doe",
  "age": 30,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "hobbies": [
    "reading",
    "coding",
    "hiking"
  ]
}

// Not:
{"name":"John Doe","age":30,"address":{"street":"123 Main St","city":"New York","zipCode":"10001"},"hobbies":["reading","coding","hiking"]}

```

### Key Ordering

**Logical grouping**: Keys are organized by importance and relationship

```json
// Kiro will write:
{
  "id": "user-123",
  "name": "John Doe",
  "email": "john@example.com",
  "profile": {
    "age": 30,
    "location": "New York"
  },
  "preferences": {
    "theme": "dark",
    "notifications": true
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:45:00Z"
}

// Not:
{
  "updatedAt": "2024-01-20T14:45:00Z",
  "preferences": {
    "notifications": true,
    "theme": "dark"
  },
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:30:00Z",
  "name": "John Doe",
  "id": "user-123"
}

```

### Quote Consistency

**Double quotes always**: Ensures JSON validity and consistency

```json
// Kiro will write:
{
  "status": "active",
  "message": "User successfully created",
  "data": {
    "userId": "12345",
    "role": "admin"
  }
}

// Not:
{
  'status': 'active',
  "message": 'User successfully created',
  data: {
    "userId": "12345",
    'role': "admin"
  }
}

```

### Array Formatting

**Consistent array structure**: Clear formatting for both simple and complex arrays

```json
// Kiro will write:
{
  "tags": ["javascript", "json", "api"],
  "users": [
    {
      "id": 1,
      "name": "Alice"
    },
    {
      "id": 2,
      "name": "Bob"
    }
  ],
  "permissions": [
    "read",
    "write",
    "delete"
  ]
}

// Not:
{
  "tags": [
    "javascript",
    "json",
    "api"
  ],
  "users": [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}],
  "permissions": ["read", "write", "delete"]
}

```

## What This Prevents

- **Parsing errors** from invalid JSON syntax

- **Readability issues** from inconsistent formatting

- **Debugging nightmares** from minified or poorly structured JSON

- **Merge conflicts** from inconsistent key ordering

- **Validation failures** from quote inconsistencies

## Simple Examples

### Before/After: API Response

```json
// Before:
{"success":true,"data":{"users":[{"id":1,"name":"Alice","email":"alice@example.com","active":true},{"id":2,"name":"Bob","email":"bob@example.com","active":false}],"total":2},"message":"Users retrieved successfully"}

// After:
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "total": 2,
    "users": [
      {
        "id": 1,
        "name": "Alice",
        "email": "alice@example.com",
        "active": true
      },
      {
        "id": 2,
        "name": "Bob",
        "email": "bob@example.com",
        "active": false
      }
    ]
  }
}

```

### Before/After: Configuration File

```json
// Before:
{"database":{"host":"localhost","port":5432,"name":"myapp"},"cache":{"enabled":true,"ttl":3600},"logging":{"level":"info","file":"app.log"}}

// After:
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "myapp"
  },
  "cache": {
    "enabled": true,
    "ttl": 3600
  },
  "logging": {
    "level": "info",
    "file": "app.log"
  }
}

```

## Customization

This is a starting point focused on the most common JSON formatting issues. You can extend these rules based on your project's specific needs, API requirements, or team preferences.

## Optional: Validation with External Tools

Want to validate that generated JSON follows these standards? Add these tools:

### Quick Setup (Optional)

```bash
npm install --save-dev prettier jq

```

**Note**: These tools validate the JSON after Kiro writes it, but aren't required for the steering document to work.
