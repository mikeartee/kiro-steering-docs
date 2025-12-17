---
title: API Development Patterns
description: Guides Kiro to design and implement REST APIs following best practices and conventions
category: workflows
tags:
  - api
  - rest
  - http
  - endpoints
  - web-services
  - express
  - nodejs
  - best-practices
  - git
  - workflow
inclusion: always
applicableTo:
  - api-server
  - web-app
  - library
  - cli-tool
  - vscode-extension
requiredDependencies:
  - express
filePatterns:
  - routes/**/*.js
  - routes/**/*.ts
  - api/**/*
version: 1.0.0
---

## Core Principle

**Kiro designs and implements REST APIs that are consistent, predictable, and follow industry best practices.** This steering document ensures APIs are well-structured, properly documented, and easy to use.

## How Kiro Will Write APIs

### RESTful Resource Naming

**Consistent URL structure**: Use nouns for resources, not verbs

```javascript
// Kiro will write:
GET    /api/users              // Get all users
GET    /api/users/:id          // Get specific user
POST   /api/users              // Create new user
PUT    /api/users/:id          // Update user
DELETE /api/users/:id          // Delete user

GET    /api/users/:id/posts    // Get user's posts
POST   /api/users/:id/posts    // Create post for user

// Not:
GET    /api/getUsers
POST   /api/createUser
GET    /api/user_posts/:id

```

### HTTP Method Usage

**Proper verb selection**: Use HTTP methods according to their intended purpose

```javascript
// Kiro will write:
// GET - Retrieve data (safe, idempotent)
app.get('/api/products/:id', async (req, res) => {
  const product = await getProduct(req.params.id);
  res.json(product);
});

// POST - Create new resource
app.post('/api/products', async (req, res) => {
  const product = await createProduct(req.body);
  res.status(201).json(product);
});

// PUT - Update entire resource
app.put('/api/products/:id', async (req, res) => {
  const product = await updateProduct(req.params.id, req.body);
  res.json(product);
});

// PATCH - Partial update
app.patch('/api/products/:id', async (req, res) => {
  const product = await partialUpdateProduct(req.params.id, req.body);
  res.json(product);
});

// DELETE - Remove resource
app.delete('/api/products/:id', async (req, res) => {
  await deleteProduct(req.params.id);
  res.status(204).send();
});

// Not:
app.get('/api/deleteProduct/:id')  // Wrong method for deletion
app.post('/api/getProduct')        // Wrong method for retrieval

```

### Response Status Codes

**Meaningful status codes**: Use appropriate HTTP status codes

```javascript
// Kiro will write:
// Success responses
res.status(200).json(data);           // OK - successful GET, PUT, PATCH
res.status(201).json(newResource);    // Created - successful POST
res.status(204).send();               // No Content - successful DELETE

// Client error responses
res.status(400).json({ error: 'Invalid request data' });     // Bad Request
res.status(401).json({ error: 'Authentication required' });  // Unauthorized
res.status(403).json({ error: 'Access forbidden' });         // Forbidden
res.status(404).json({ error: 'Resource not found' });       // Not Found
res.status(409).json({ error: 'Resource already exists' });  // Conflict

// Server error responses
res.status(500).json({ error: 'Internal server error' });    // Server Error

// Not:
res.status(200).json({ error: 'User not found' });  // Wrong status for error
res.status(500).json({ message: 'Invalid input' }); // Wrong status for client error

```

### Consistent Response Format

**Standardized structure**: Use consistent response format across all endpoints

```javascript
// Kiro will write:
// Success response
{
  "success": true,
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      {
        "field": "email",
        "issue": "Must be a valid email address"
      }
    ]
  }
}

// Paginated response
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "totalItems": 100
  }
}

// Not:
{ user: {...} }  // Inconsistent structure
{ error: "bad" } // Minimal error info

```

### Request Validation

**Input validation**: Validate all incoming data

```javascript
// Kiro will write:
app.post('/api/users', async (req, res) => {
  const { error, value } = validateUserInput(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid user data',
        details: error.details
      }
    });
  }

  const user = await createUser(value);
  res.status(201).json({
    success: true,
    data: user
  });
});

function validateUserInput(data) {
  const errors = [];
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push({ field: 'email', issue: 'Valid email required' });
  }
  
  if (!data.password || data.password.length < 8) {
    errors.push({ field: 'password', issue: 'Password must be at least 8 characters' });
  }
  
  if (errors.length > 0) {
    return { error: { details: errors } };
  }
  
  return { value: data };
}

// Not:
app.post('/api/users', async (req, res) => {
  const user = await createUser(req.body);  // No validation
  res.json(user);
});

```

### Query Parameters

**Filtering and pagination**: Support common query operations

```javascript
// Kiro will write:
app.get('/api/products', async (req, res) => {
  const {
    page = 1,
    pageSize = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    category,
    minPrice,
    maxPrice,
    search
  } = req.query;

  const filters = {
    category,
    priceRange: { min: minPrice, max: maxPrice },
    searchTerm: search
  };

  const result = await getProducts({
    page: parseInt(page),
    pageSize: parseInt(pageSize),
    sortBy,
    sortOrder,
    filters
  });

  res.json({
    success: true,
    data: result.items,
    pagination: {
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
      totalItems: result.totalItems
    }
  });
});

// Example usage:
// GET /api/products?page=2&pageSize=10&category=electronics&minPrice=100&sortBy=price&sortOrder=asc

// Not:
app.get('/api/products', async (req, res) => {
  const products = await getAllProducts();  // No filtering or pagination
  res.json(products);
});

```

### API Versioning

**Version management**: Include API version in URL

```javascript
// Kiro will write:
// Version in URL path
app.get('/api/v1/users', handleGetUsersV1);
app.get('/api/v2/users', handleGetUsersV2);

// Or version in header
app.get('/api/users', (req, res) => {
  const version = req.headers['api-version'] || '1';
  
  if (version === '2') {
    return handleGetUsersV2(req, res);
  }
  
  return handleGetUsersV1(req, res);
});

// Not:
app.get('/api/users', handleGetUsers);  // No versioning
app.get('/api/users_new', handleGetUsersNew);  // Poor versioning

```

### Authentication and Authorization

**Secure endpoints**: Implement proper authentication

```javascript
// Kiro will write:
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication token required'
      }
    });
  }

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Invalid or expired token'
      }
    });
  }
};

// Protected endpoint
app.get('/api/users/me', authenticateToken, async (req, res) => {
  const user = await getUser(req.user.id);
  res.json({ success: true, data: user });
});

// Not:
app.get('/api/users/me', async (req, res) => {
  const userId = req.query.userId;  // Trusting client-provided ID
  const user = await getUser(userId);
  res.json(user);
});

```

## What This Prevents

- **Inconsistent API design** that confuses developers

- **Poor error handling** that makes debugging difficult

- **Security vulnerabilities** from missing validation

- **Scalability issues** from lack of pagination

- **Breaking changes** without proper versioning

- **Unclear documentation** from inconsistent patterns

## Simple Examples

### Before/After: User Management API

```javascript
// Before:
app.get('/getUser', (req, res) => {
  const user = users.find(u => u.id == req.query.id);
  res.json(user || { error: 'not found' });
});

app.post('/addUser', (req, res) => {
  users.push(req.body);
  res.json({ ok: true });
});

// After:
app.get('/api/v1/users/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve user'
      }
    });
  }
});

app.post('/api/v1/users', async (req, res) => {
  const { error, value } = validateUserInput(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid user data',
        details: error.details
      }
    });
  }
  
  try {
    const user = await createUser(value);
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create user'
      }
    });
  }
});

```

## Customization

This is a starting point for API development patterns. You can customize by:

- Adding GraphQL or gRPC patterns

- Including rate limiting strategies

- Adding caching headers and strategies

- Incorporating webhook patterns

## Related Documents

- [Error Handling Standards](./error-handling-standards.md) - Error handling patterns

- [Code Review Standards](../code-quality/code-review-standards.md) - Code quality practices

## Optional: Validation with External Tools

Want to enforce these patterns automatically? Consider these tools:

### API Development Tools (Optional)

```bash
# Express validator for request validation
npm install --save express-validator

# Swagger/OpenAPI for API documentation
npm install --save-dev swagger-jsdoc swagger-ui-express

# API testing
npm install --save-dev supertest jest

```

**Note**: These tools help enforce patterns but aren't required for the steering document to work.
