---
title: Error Handling Standards
description: Guides Kiro to implement robust error handling patterns across different languages
category: code-quality
tags:
  - error-handling
  - exceptions
  - debugging
  - best-practices
  - express
  - nodejs
  - api
  - code-quality
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

**Kiro implements comprehensive error handling that catches issues early, provides clear feedback, and maintains application stability.** This steering document ensures errors are handled gracefully across all languages and frameworks.

## How Kiro Will Write Error Handling

### Try-Catch Blocks

**Specific error handling**: Catch specific errors, not generic exceptions

```javascript
// Kiro will write:
async function fetchUserData(userId) {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new UserNotFoundError(`User ${userId} not found`);
    }
    if (error.response?.status === 403) {
      throw new UnauthorizedError('Access denied to user data');
    }
    throw new ApiError('Failed to fetch user data', error);
  }
}

// Not:
async function fetchUserData(userId) {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.log('Error:', error);
    return null;
  }
}

```

### Custom Error Classes

**Meaningful error types**: Create custom error classes for different scenarios

```javascript
// Kiro will write:
class ApplicationError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends ApplicationError {
  constructor(message, details = []) {
    super(message, 400);
    this.details = details;
  }
}

class NotFoundError extends ApplicationError {
  constructor(resource, id) {
    super(`${resource} with id ${id} not found`, 404);
    this.resource = resource;
    this.id = id;
  }
}

class UnauthorizedError extends ApplicationError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

// Usage:
function getUser(userId) {
  const user = database.findUser(userId);
  if (!user) {
    throw new NotFoundError('User', userId);
  }
  return user;
}

// Not:
function getUser(userId) {
  const user = database.findUser(userId);
  if (!user) {
    throw new Error('not found');
  }
  return user;
}

```

### Error Logging

**Comprehensive logging**: Log errors with context and stack traces

```javascript
// Kiro will write:
function handleError(error, context = {}) {
  const errorInfo = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context: {
      ...context,
      userId: context.userId,
      requestId: context.requestId,
      endpoint: context.endpoint
    }
  };

  if (error.statusCode >= 500) {
    logger.error('Server error occurred', errorInfo);
  } else if (error.statusCode >= 400) {
    logger.warn('Client error occurred', errorInfo);
  } else {
    logger.info('Error handled', errorInfo);
  }

  return errorInfo;
}

// Not:
function handleError(error) {
  console.log(error);
}

```

### User-Friendly Error Messages

**Clear communication**: Provide helpful messages to users

```javascript
// Kiro will write:
function getUserFriendlyMessage(error) {
  const messages = {
    ValidationError: 'Please check your input and try again',
    NotFoundError: 'The requested resource could not be found',
    UnauthorizedError: 'You need to log in to access this resource',
    NetworkError: 'Unable to connect to the server. Please check your internet connection',
    TimeoutError: 'The request took too long. Please try again',
    default: 'An unexpected error occurred. Please try again later'
  };

  return messages[error.name] || messages.default;
}

// API response:
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: {
      code: error.name,
      message: getUserFriendlyMessage(error),
      ...(process.env.NODE_ENV === 'development' && {
        details: error.message,
        stack: error.stack
      })
    }
  });
});

// Not:
app.use((error, req, res, next) => {
  res.status(500).json({ error: error.message });
});

```

### Python Error Handling

**Pythonic patterns**: Use Python-specific error handling

```python
# Kiro will write:
class UserNotFoundError(Exception):
    """Raised when a user cannot be found in the database."""
    def __init__(self, user_id):
        self.user_id = user_id
        super().__init__(f"User with id {user_id} not found")

def get_user(user_id: int) -> User:
    """
    Retrieve user by ID.
    
    Args:
        user_id: The ID of the user to retrieve
        
    Returns:
        User object
        
    Raises:
        UserNotFoundError: If user does not exist
        DatabaseError: If database connection fails
    """
    try:
        user = database.query(User).filter_by(id=user_id).first()
        if not user:
            raise UserNotFoundError(user_id)
        return user
    except DatabaseConnectionError as e:
        logger.error(f"Database connection failed: {e}")
        raise DatabaseError("Unable to connect to database") from e
    except Exception as e:
        logger.error(f"Unexpected error retrieving user {user_id}: {e}")
        raise

# Not:
def get_user(user_id):
    try:
        user = database.query(User).filter_by(id=user_id).first()
        return user
    except:
        return None

```

### Error Recovery

**Graceful degradation**: Implement fallback strategies

```javascript
// Kiro will write:
async function getUserWithFallback(userId) {
  try {
    // Try primary data source
    return await primaryDatabase.getUser(userId);
  } catch (primaryError) {
    logger.warn('Primary database failed, trying cache', { userId, error: primaryError });
    
    try {
      // Fallback to cache
      const cachedUser = await cache.get(`user:${userId}`);
      if (cachedUser) {
        return cachedUser;
      }
    } catch (cacheError) {
      logger.error('Cache also failed', { userId, error: cacheError });
    }
    
    // If all else fails, throw error
    throw new ServiceUnavailableError('Unable to retrieve user data');
  }
}

// Not:
async function getUser(userId) {
  return await database.getUser(userId);  // No fallback
}

```

### Retry Logic

**Resilient operations**: Implement retry for transient failures

```javascript
// Kiro will write:
async function retryOperation(operation, maxRetries = 3, delayMs = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries && isRetryableError(error)) {
        logger.warn(`Operation failed, retrying (${attempt}/${maxRetries})`, {
          error: error.message,
          attempt
        });
        await delay(delayMs * attempt);  // Exponential backoff
      } else {
        break;
      }
    }
  }
  
  throw new RetryExhaustedError(
    `Operation failed after ${maxRetries} attempts`,
    lastError
  );
}

function isRetryableError(error) {
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  return retryableStatuses.includes(error.statusCode);
}

// Usage:
const data = await retryOperation(() => fetchFromAPI(url));

// Not:
const data = await fetchFromAPI(url);  // No retry logic

```

### Input Validation Errors

**Early validation**: Validate input before processing

```javascript
// Kiro will write:
function validateOrderData(orderData) {
  const errors = [];

  if (!orderData.customerId) {
    errors.push({
      field: 'customerId',
      message: 'Customer ID is required'
    });
  }

  if (!orderData.items || orderData.items.length === 0) {
    errors.push({
      field: 'items',
      message: 'Order must contain at least one item'
    });
  }

  if (orderData.items) {
    orderData.items.forEach((item, index) => {
      if (!item.productId) {
        errors.push({
          field: `items[${index}].productId`,
          message: 'Product ID is required for all items'
        });
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push({
          field: `items[${index}].quantity`,
          message: 'Quantity must be greater than 0'
        });
      }
    });
  }

  if (errors.length > 0) {
    throw new ValidationError('Invalid order data', errors);
  }

  return true;
}

// Not:
function processOrder(orderData) {
  // Process without validation
  const order = createOrder(orderData);
  return order;
}

```

## What This Prevents

- **Silent failures** that hide bugs

- **Unclear error messages** that frustrate users

- **Application crashes** from unhandled exceptions

- **Difficult debugging** from missing context

- **Security leaks** from exposing internal errors

- **Poor user experience** from cryptic error messages

## Simple Examples

### Before/After: API Error Handling

```javascript
// Before:
app.post('/api/orders', async (req, res) => {
  const order = await createOrder(req.body);
  res.json(order);
});

// After:
app.post('/api/orders', async (req, res) => {
  try {
    validateOrderData(req.body);
    
    const order = await createOrder(req.body);
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
          details: error.details
        }
      });
    }
    
    if (error instanceof NotFoundError) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: error.message
        }
      });
    }
    
    logger.error('Failed to create order', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create order'
      }
    });
  }
});

```

### Before/After: Database Operations

```python
# Before:
def get_user_orders(user_id):
    orders = db.query(Order).filter_by(user_id=user_id).all()
    return orders

# After:
def get_user_orders(user_id: int) -> List[Order]:
    """
    Retrieve all orders for a specific user.
    
    Args:
        user_id: The ID of the user
        
    Returns:
        List of Order objects
        
    Raises:
        UserNotFoundError: If user does not exist
        DatabaseError: If database operation fails
    """
    try:
        # Verify user exists
        user = db.query(User).filter_by(id=user_id).first()
        if not user:
            raise UserNotFoundError(user_id)
        
        # Retrieve orders
        orders = db.query(Order).filter_by(user_id=user_id).all()
        return orders
        
    except SQLAlchemyError as e:
        logger.error(f"Database error retrieving orders for user {user_id}: {e}")
        raise DatabaseError("Failed to retrieve orders") from e
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise

```

## Customization

This is a starting point for error handling standards. You can customize by:

- Adding language-specific error patterns

- Including monitoring and alerting integration

- Adding error tracking service integration (Sentry, Rollbar)

- Incorporating circuit breaker patterns

## Related Documents

- [Code Review Standards](./code-review-standards.md) - Code quality practices

- [API Development Patterns](../workflows/api-development-patterns.md) - API error responses

## Optional: Validation with External Tools

Want to enhance error handling? Consider these tools:

### Error Handling Tools (Optional)

```bash
# Error tracking
npm install --save @sentry/node

# Validation libraries
npm install --save joi express-validator

# Python error tracking
pip install sentry-sdk

# Python validation
pip install pydantic marshmallow

```

**Note**: These tools help enhance error handling but aren't required for the steering document to work.
