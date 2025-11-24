---
title: "Security Best Practices"
description: "Guides Kiro to write secure code with proper input validation and vulnerability prevention"
category: "practices"
tags: ["security", "validation", "best-practices", "vulnerabilities"]
inclusion: always
---

## Core Principle

**Kiro writes secure code that validates inputs, prevents common vulnerabilities, and follows security best practices.**

## How Kiro Will Write Secure Code

### Input Validation

**Always validate and sanitize user input**: Never trust external data

```javascript
// Kiro will write:
function createUser(userData) {
  // Validate required fields
  if (!userData.email || typeof userData.email !== 'string') {
    throw new Error('Invalid email');
  }
  
  // Sanitize and validate email format
  const email = userData.email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  
  // Validate password strength
  if (!userData.password || userData.password.length < 12) {
    throw new Error('Password must be at least 12 characters');
  }
  
  return { email, password: userData.password };
}

// Not:
function createUser(userData) {
  return {
    email: userData.email,
    password: userData.password
  };
}
```

### SQL Injection Prevention

**Use parameterized queries**: Never concatenate user input into SQL

```javascript
// Kiro will write:
async function getUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await db.query(query, [email]);
  return result.rows[0];
}

// Not:
async function getUserByEmail(email) {
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  const result = await db.query(query);
  return result.rows[0];
}
```

```python
# Kiro will write:
def get_user_by_email(email):
    query = "SELECT * FROM users WHERE email = %s"
    cursor.execute(query, (email,))
    return cursor.fetchone()

# Not:
def get_user_by_email(email):
    query = f"SELECT * FROM users WHERE email = '{email}'"
    cursor.execute(query)
    return cursor.fetchone()
```

### Password Handling

**Hash passwords properly**: Use strong hashing algorithms

```javascript
// Kiro will write:
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Not:
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}
```

### Sensitive Data Protection

**Never log or expose sensitive information**: Protect credentials and tokens

```javascript
// Kiro will write:
function logUserAction(user, action) {
  console.log({
    userId: user.id,
    action: action,
    timestamp: new Date().toISOString()
  });
}

function sanitizeError(error) {
  return {
    message: 'An error occurred',
    code: error.code
  };
}

// Not:
function logUserAction(user, action) {
  console.log({
    user: user,  // Contains password, tokens, etc.
    action: action
  });
}

function sanitizeError(error) {
  return error;  // May contain sensitive stack traces
}
```

## What This Prevents

- SQL injection attacks from unsanitized input
- Cross-site scripting (XSS) vulnerabilities
- Password exposure through weak hashing
- Sensitive data leaks in logs and errors
- Authentication bypass vulnerabilities
- Command injection attacks

## Customization

This is a starting point! You can modify these rules by editing this steering document:

- Adjust password requirements
- Add framework-specific security patterns
- Modify validation rules for your use case
- Add additional security checks

## Optional: Validation with External Tools

Want to validate that generated code follows security standards? Add these tools:

### Quick Setup (Optional)

```bash
# JavaScript/Node.js
npm install --save-dev eslint-plugin-security

# Python
pip install bandit

# General
npm install -g snyk
```

### Usage

```bash
# Scan for vulnerabilities
snyk test

# Python security scan
bandit -r .

# ESLint security plugin
eslint --plugin security .
```

**Note**: These tools validate the code after Kiro writes it, but aren't required for the steering document to work.
