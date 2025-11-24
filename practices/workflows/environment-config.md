---
title: "Environment Variables and Configuration Management"
description: "Guides Kiro to write secure, maintainable configuration code with proper environment variable handling"
category: "workflows"
tags: ["configuration", "environment-variables", "secrets", "config-management"]
inclusion: always
---

## Core Principle

**Kiro writes configuration code that keeps secrets secure, uses clear naming conventions, and separates environment-specific settings from application code.**

## How Kiro Will Write Configuration

### Environment Variable Naming

**Clear, consistent naming**: Use uppercase with underscores for environment variables

```bash
# Kiro will write:
DATABASE_URL=postgresql://localhost:5432/myapp
API_KEY=your-api-key-here
JWT_SECRET=your-secret-key
NODE_ENV=development
LOG_LEVEL=info
MAX_CONNECTIONS=10

# Not:
databaseUrl=postgresql://localhost:5432/myapp
apikey=your-api-key-here
jwtSecret=your-secret-key
```

### Configuration File Structure

**Organized config files**: Group related settings and provide clear defaults

```javascript
// Kiro will write:
// config/database.js
module.exports = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  database: process.env.DATABASE_NAME || 'myapp',
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD,
  pool: {
    min: parseInt(process.env.DATABASE_POOL_MIN || '2', 10),
    max: parseInt(process.env.DATABASE_POOL_MAX || '10', 10),
  },
};

// Not:
const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  // missing defaults, inconsistent naming
};
```

### Secrets Handling

**Never hardcode secrets**: Always use environment variables for sensitive data

```python
# Kiro will write:
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    DATABASE_URL = os.environ.get('DATABASE_URL')
    API_KEY = os.environ.get('API_KEY')
    
    # Public settings can have defaults
    DEBUG = os.environ.get('DEBUG', 'False') == 'True'
    PORT = int(os.environ.get('PORT', '5000'))

# Not:
class Config:
    SECRET_KEY = 'hardcoded-secret-key-123'  # NEVER do this
    DATABASE_URL = 'postgresql://user:password@localhost/db'
    API_KEY = 'sk-1234567890abcdef'
```

### Configuration Validation

**Validate required settings**: Check for missing required environment variables

```javascript
// Kiro will write:
function validateConfig() {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'API_KEY',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

validateConfig();

// Not:
// Assuming all variables exist without validation
const config = {
  database: process.env.DATABASE_URL,  // might be undefined
  secret: process.env.JWT_SECRET,      // might be undefined
};
```

## What This Prevents

- **Security breaches** from hardcoded secrets in code
- **Configuration errors** from inconsistent naming conventions
- **Deployment issues** from missing environment variables
- **Debugging nightmares** from unclear configuration sources

## Simple Examples

### Before/After: Application Configuration

```javascript
// Before:
const express = require('express');
const app = express();

app.listen(3000, () => {
  console.log('Server running');
});

const db = require('pg').Pool({
  host: 'localhost',
  user: 'admin',
  password: 'admin123',  // hardcoded!
  database: 'myapp',
});

// After:
require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Validate required variables
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});

const { Pool } = require('pg');
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
```

### Before/After: Python Configuration

```python
# Before:
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="myapp",
    user="admin",
    password="admin123"  # hardcoded!
)

# After:
import os
import psycopg2

# Validate required environment variables
required_vars = ['DATABASE_URL']
missing = [var for var in required_vars if not os.environ.get(var)]
if missing:
    raise ValueError(f"Missing required environment variables: {', '.join(missing)}")

# Use environment variable
DATABASE_URL = os.environ['DATABASE_URL']
conn = psycopg2.connect(DATABASE_URL)
```

### .env File Template

```bash
# Kiro will create:
# Database Configuration
DATABASE_URL=postgresql://localhost:5432/myapp
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Application Settings
NODE_ENV=development
PORT=3000
LOG_LEVEL=info

# Authentication
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRATION=24h

# External APIs
API_KEY=your-api-key-here
API_BASE_URL=https://api.example.com

# Feature Flags
ENABLE_FEATURE_X=false
```

## Customization

This is a starting point focused on common configuration patterns. You can extend these rules based on your project's specific needs:

- Add framework-specific configuration patterns (Django settings, Spring Boot properties)
- Include cloud provider configuration (AWS, Azure, GCP)
- Add configuration for specific services (Redis, MongoDB, etc.)
- Include multi-environment configuration strategies

## Optional: Validation with External Tools

Want to manage environment variables more easily? Add these tools:

### Quick Setup (Optional)

```bash
# Node.js
npm install --save-dev dotenv dotenv-expand

# Python
pip install python-dotenv
```

### Basic Usage (Optional)

```javascript
// Node.js
require('dotenv').config();

// Now use process.env.YOUR_VARIABLE
```

```python
# Python
from dotenv import load_dotenv
load_dotenv()

# Now use os.environ.get('YOUR_VARIABLE')
```

**Note**: These tools help load environment variables from .env files, but aren't required for the steering document to work.
