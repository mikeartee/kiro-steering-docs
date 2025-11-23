---
title: "Logging Standards and Best Practices"
description: "Guides Kiro to write consistent, secure logging code with appropriate log levels and structured output"
category: "workflows"
tags:
  ["logging", "observability", "debugging", "security", "structured-logging"]
inclusion: always
---

## Core Principle

**Kiro writes consistent logging code that uses appropriate log levels, protects sensitive data, and provides actionable information for debugging and monitoring.**

## How Kiro Will Write Logging Code

### Log Level Usage

**Appropriate log levels**: Use the right level for each situation

```javascript
// Kiro will write:
const logger = require("./logger");

// ERROR: System failures that need immediate attention
logger.error("Database connection failed", {
  error: err.message,
  host: dbHost,
});

// WARN: Unexpected situations that don't break functionality
logger.warn("API rate limit approaching", { current: 950, limit: 1000 });

// INFO: Important business events and milestones
logger.info("User registered successfully", {
  userId: user.id,
  email: user.email,
});

// DEBUG: Detailed information for troubleshooting
logger.debug("Processing payment", { orderId, amount, currency });

// Not:
logger.info("Database connection failed"); // Should be ERROR
logger.error("User logged in"); // Should be INFO
logger.debug("Critical system failure"); // Should be ERROR
```

### Structured Logging

**Consistent log format**: Use structured data instead of string concatenation

```python
# Kiro will write:
import logging

logger = logging.getLogger(__name__)

# Structured logging with context
logger.info(
    "User authentication successful",
    extra={
        "user_id": user.id,
        "email": user.email,
        "ip_address": request.remote_addr,
        "timestamp": datetime.utcnow().isoformat()
    }
)

logger.error(
    "Payment processing failed",
    extra={
        "order_id": order.id,
        "amount": order.total,
        "error_code": error.code,
        "error_message": error.message
    }
)

# Not:
logger.info(f"User {user.email} authenticated from {request.remote_addr}")
logger.error("Payment failed for order " + str(order.id) + " amount " + str(order.total))
```

### Sensitive Data Handling

**Never log sensitive information**: Redact or exclude passwords, tokens, and personal data

```javascript
// Kiro will write:
const sanitizeForLogging = (data) => {
  const sensitive = ["password", "token", "apiKey", "creditCard", "ssn"];
  const sanitized = { ...data };

  sensitive.forEach((key) => {
    if (sanitized[key]) {
      sanitized[key] = "[REDACTED]";
    }
  });

  return sanitized;
};

logger.info(
  "User login attempt",
  sanitizeForLogging({
    email: user.email,
    password: user.password, // Will be redacted
    ipAddress: req.ip,
  })
);

// Result: { email: 'user@example.com', password: '[REDACTED]', ipAddress: '192.168.1.1' }

// NEVER do this:
logger.info("User login", {
  email: user.email,
  password: user.password, // Exposed in logs!
  creditCard: user.creditCard, // Exposed in logs!
});
```

### Error Logging

**Complete error context**: Include stack traces and relevant context for errors

```typescript
// Kiro will write:
try {
  await processOrder(orderId);
} catch (error) {
  logger.error("Order processing failed", {
    orderId,
    errorMessage: error.message,
    errorStack: error.stack,
    userId: currentUser.id,
    timestamp: new Date().toISOString(),
  });

  throw error;
}

// Not:
try {
  await processOrder(orderId);
} catch (error) {
  logger.error("Error"); // No context!
  throw error;
}
```

### Contextual Logging

**Include relevant context**: Add identifiers and metadata for traceability

```python
# Kiro will write:
def process_user_order(user_id, order_id):
    logger.info(
        "Starting order processing",
        extra={
            "user_id": user_id,
            "order_id": order_id,
            "function": "process_user_order"
        }
    )

    try:
        order = get_order(order_id)
        logger.debug(
            "Order retrieved",
            extra={
                "user_id": user_id,
                "order_id": order_id,
                "order_status": order.status,
                "item_count": len(order.items)
            }
        )

        result = charge_payment(order)
        logger.info(
            "Payment processed successfully",
            extra={
                "user_id": user_id,
                "order_id": order_id,
                "transaction_id": result.transaction_id,
                "amount": order.total
            }
        )

        return result

    except PaymentError as e:
        logger.error(
            "Payment processing failed",
            extra={
                "user_id": user_id,
                "order_id": order_id,
                "error_code": e.code,
                "error_message": str(e)
            }
        )
        raise

# Not:
def process_user_order(user_id, order_id):
    logger.info("Processing order")  # No context
    order = get_order(order_id)
    result = charge_payment(order)
    logger.info("Done")  # Vague
    return result
```

## What This Prevents

- **Security breaches** from logging sensitive data like passwords and tokens
- **Debugging nightmares** from insufficient context in error logs
- **Alert fatigue** from inappropriate log levels
- **Performance issues** from excessive debug logging in production

## Simple Examples

### Before/After: User Authentication Logging

```javascript
// Before:
function authenticateUser(email, password) {
  console.log("Login attempt: " + email + " with password: " + password);

  const user = findUser(email);
  if (!user) {
    console.log("User not found");
    return null;
  }

  if (user.password !== password) {
    console.log("Wrong password");
    return null;
  }

  console.log("Login successful");
  return user;
}

// After:
function authenticateUser(email, password) {
  logger.info("User authentication attempt", {
    email,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const user = findUser(email);
  if (!user) {
    logger.warn("Authentication failed: user not found", {
      email,
      reason: "user_not_found",
    });
    return null;
  }

  if (!verifyPassword(password, user.passwordHash)) {
    logger.warn("Authentication failed: invalid password", {
      userId: user.id,
      email,
      reason: "invalid_password",
    });
    return null;
  }

  logger.info("User authenticated successfully", {
    userId: user.id,
    email,
    lastLogin: user.lastLoginAt,
  });

  return user;
}
```

### Before/After: API Request Logging

```python
# Before:
def handle_api_request(request):
    print(f"Request: {request.method} {request.path}")
    print(f"Body: {request.body}")  # May contain sensitive data!

    try:
        response = process_request(request)
        print("Success")
        return response
    except Exception as e:
        print(f"Error: {e}")
        raise

# After:
def handle_api_request(request):
    request_id = generate_request_id()

    logger.info(
        "API request received",
        extra={
            "request_id": request_id,
            "method": request.method,
            "path": request.path,
            "user_id": request.user.id if request.user else None,
            "ip_address": request.remote_addr
        }
    )

    try:
        response = process_request(request)

        logger.info(
            "API request completed",
            extra={
                "request_id": request_id,
                "status_code": response.status_code,
                "duration_ms": calculate_duration()
            }
        )

        return response

    except ValidationError as e:
        logger.warn(
            "API request validation failed",
            extra={
                "request_id": request_id,
                "error_type": "validation_error",
                "errors": e.errors
            }
        )
        raise

    except Exception as e:
        logger.error(
            "API request failed",
            extra={
                "request_id": request_id,
                "error_type": type(e).__name__,
                "error_message": str(e),
                "stack_trace": traceback.format_exc()
            }
        )
        raise
```

### Before/After: Database Operation Logging

```javascript
// Before:
async function updateUserProfile(userId, data) {
  console.log("Updating user");

  try {
    const result = await db.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3",
      [data.name, data.email, userId]
    );
    console.log("Updated");
    return result;
  } catch (err) {
    console.log("Error");
    throw err;
  }
}

// After:
async function updateUserProfile(userId, data) {
  logger.debug("Updating user profile", {
    userId,
    fields: Object.keys(data),
  });

  try {
    const result = await db.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3",
      [data.name, data.email, userId]
    );

    logger.info("User profile updated successfully", {
      userId,
      updatedFields: Object.keys(data),
      rowsAffected: result.rowCount,
    });

    return result;
  } catch (err) {
    logger.error("Failed to update user profile", {
      userId,
      errorMessage: err.message,
      errorCode: err.code,
      sqlState: err.sqlState,
    });

    throw err;
  }
}
```

## Customization

This is a starting point focused on common logging patterns. You can extend these rules based on your project's specific needs:

- Add framework-specific logging patterns (Winston, Bunyan, Python logging)
- Include distributed tracing integration (OpenTelemetry, Jaeger)
- Add log aggregation service patterns (ELK, Splunk, CloudWatch)
- Include performance logging and metrics

## Optional: Validation with External Tools

Want to implement structured logging with external libraries? Add these tools:

### Quick Setup (Optional)

```bash
# Node.js
npm install --save-dev winston pino

# Python
pip install structlog python-json-logger
```

### Basic Usage (Optional)

```javascript
// Node.js with Winston
const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
```

```python
# Python with structlog
import structlog

logger = structlog.get_logger()

logger.info(
    "user_registered",
    user_id=user.id,
    email=user.email
)
```

**Note**: These tools provide advanced logging features, but aren't required for the steering document to work.
