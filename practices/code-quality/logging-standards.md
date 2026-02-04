---
title: Logging Standards
description: Guides Kiro to write consistent, informative logging code that aids debugging without exposing sensitive data
category: code-quality
tags:
  - logging
  - debugging
  - monitoring
  - security
  - code-quality
  - best-practices
inclusion: always
applicableTo:
  - web-app
  - library
  - cli-tool
  - api-server
  - vscode-extension
---

## Core Principle

**Kiro writes logging code that provides useful debugging information, uses appropriate log levels, and protects sensitive data.**

## How Kiro Will Write Logging

### Log Levels

**Use appropriate log levels**: Choose the right level for each message

```javascript
// Kiro will write:
const logger = require('./logger');

// ERROR: System errors that need immediate attention
logger.error('Database connection failed', { error: err.message, host: dbHost });

// WARN: Potential issues that don't stop execution
logger.warn('API rate limit approaching', { current: 950, limit: 1000 });

// INFO: Important business events
logger.info('User registered', { userId: user.id, email: user.email });

// DEBUG: Detailed information for debugging
logger.debug('Processing payment', { orderId, amount, gateway });

// Not:
console.log('something happened');  // unclear severity
logger.info('ERROR: Database failed');  // wrong level
logger.error('User clicked button');  // not an error

```

### Structured Logging

**Use structured log format**: Include context as structured data

```python
# Kiro will write:
import logging

logger = logging.getLogger(__name__)

def process_order(order_id, user_id):
    logger.info(
        'Processing order',
        extra={
            'order_id': order_id,
            'user_id': user_id,
            'action': 'process_order'
        }
    )
    
    try:
        result = payment_service.charge(order_id)
        logger.info(
            'Order processed successfully',
            extra={
                'order_id': order_id,
                'transaction_id': result.transaction_id,
                'amount': result.amount
            }
        )
    except PaymentError as e:
        logger.error(
            'Payment processing failed',
            extra={
                'order_id': order_id,
                'error_code': e.code,
                'error_message': str(e)
            }
        )
        raise

# Not:
def process_order(order_id, user_id):
    print(f"Processing order {order_id}")  # unstructured
    # Missing context, hard to search logs

```

### Sensitive Data Protection

**Never log sensitive information**: Redact passwords, tokens, and personal data

#### Sensitive Fields Reference

Kiro will never log fields matching these patterns:

| Category | Fields to Never Log |
|----------|---------------------|
| **Authentication** | `password`, `passwd`, `pwd`, `pin` |
| **Tokens** | `token`, `accessToken`, `access_token`, `refreshToken`, `refresh_token`, `authToken`, `auth_token`, `sessionToken`, `session_token`, `bearer` |
| **API Credentials** | `apiKey`, `api_key`, `apikey`, `secret`, `privateKey`, `private_key`, `authorization` |
| **Financial** | `creditCard`, `credit_card`, `cardNumber`, `card_number`, `cvv`, `cvc` |
| **Personal Identity** | `ssn`, `socialSecurity`, `social_security` |

#### Sanitization Patterns

```javascript
// Kiro will write:
const SENSITIVE_FIELDS = [
  'password', 'passwd', 'pwd', 'secret', 'token',
  'accessToken', 'access_token', 'refreshToken', 'refresh_token',
  'apiKey', 'api_key', 'privateKey', 'private_key',
  'creditCard', 'credit_card', 'cardNumber', 'card_number',
  'cvv', 'cvc', 'ssn', 'socialSecurity', 'pin',
  'authToken', 'auth_token', 'sessionToken', 'session_token',
  'bearer', 'authorization'
];

const sanitizeForLogging = (data) => {
  const sanitized = { ...data };

  Object.keys(sanitized).forEach(key => {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    }
  });

  return sanitized;
};

logger.info('User login attempt', sanitizeForLogging({
  email: user.email,
  password: user.password,  // will be redacted
  ipAddress: req.ip
}));

// Not:
logger.info('User login', {
  email: user.email,
  password: user.password,  // NEVER log passwords!
  creditCard: user.creditCard  // NEVER log credit cards!
});

```

#### Common Mistakes to Avoid

```javascript
// Kiro will NOT write any of these:

// Direct sensitive field access
logger.info({ password: user.password });           // Error
console.log(user.apiKey);                           // Error
logger.debug({ token: authToken });                 // Error

// Logging entire objects that contain sensitive data
logger.info('User created', user);                  // Dangerous - may contain password
logger.debug('Request body', req.body);             // Dangerous - may contain tokens

// Kiro WILL write:
logger.info('User created', {
  userId: user.id,
  email: user.email
});
logger.debug('Request received', {
  path: req.path,
  method: req.method
});

```

### Contextual Information

**Include relevant context**: Add information that helps debugging

```typescript
// Kiro will write:
class OrderService {
  private logger: Logger;

  async createOrder(userId: string, items: OrderItem[]): Promise<Order> {
    const correlationId = generateId();
    
    this.logger.info('Creating order', {
      correlationId,
      userId,
      itemCount: items.length,
      totalAmount: calculateTotal(items)
    });

    try {
      const order = await this.orderRepository.create({
        userId,
        items,
        correlationId
      });

      this.logger.info('Order created successfully', {
        correlationId,
        orderId: order.id,
        userId
      });

      return order;
    } catch (error) {
      this.logger.error('Order creation failed', {
        correlationId,
        userId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
}

// Not:
async createOrder(userId, items) {
  console.log('creating order');  // no context
  const order = await this.orderRepository.create({ userId, items });
  console.log('done');  // no useful information
  return order;
}

```

## What This Prevents

- **Security breaches** from logging sensitive data

- **Debugging difficulties** from insufficient context

- **Log noise** from inappropriate log levels

- **Performance issues** from excessive logging

## Simple Examples

### Before/After: API Request Logging

```javascript
// Before:
app.use((req, res, next) => {
  console.log(req.url);
  next();
});

// After:
app.use((req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    logger.info('HTTP request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('user-agent'),
      ip: req.ip
    });
  });
  
  next();
});

```

### Before/After: Error Logging

```python
# Before:
try:
    result = process_data(data)
except Exception as e:
    print(f"Error: {e}")

# After:
try:
    result = process_data(data)
except ValidationError as e:
    logger.warning(
        'Data validation failed',
        extra={
            'error_type': 'ValidationError',
            'error_message': str(e),
            'data_size': len(data)
        }
    )
    raise
except Exception as e:
    logger.error(
        'Unexpected error processing data',
        extra={
            'error_type': type(e).__name__,
            'error_message': str(e),
            'stack_trace': traceback.format_exc()
        }
    )
    raise

```

### Before/After: Business Logic Logging

```javascript
// Before:
function processPayment(orderId, amount) {
  console.log('processing payment');
  const result = paymentGateway.charge(amount);
  console.log('payment done');
  return result;
}

// After:
function processPayment(orderId, amount, userId) {
  logger.info('Payment processing started', {
    orderId,
    amount,
    userId,
    gateway: 'stripe'
  });

  try {
    const result = paymentGateway.charge(amount);
    
    logger.info('Payment processed successfully', {
      orderId,
      transactionId: result.id,
      amount,
      userId
    });
    
    return result;
  } catch (error) {
    logger.error('Payment processing failed', {
      orderId,
      amount,
      userId,
      errorCode: error.code,
      errorMessage: error.message
    });
    throw error;
  }
}

```

## Customization

This is a starting point focused on common logging patterns. You can extend these rules based on your project's specific needs:

- Add framework-specific logging (Winston, Bunyan, Loguru)

- Include log aggregation patterns (ELK, Splunk, CloudWatch)

- Add performance logging and metrics

- Include audit logging for compliance

- Add domain-specific sensitive fields to the blocklist

## Optional: Validation with External Tools

Want to enhance your logging capabilities? Add these tools:

### Quick Setup (Optional)

```bash
# Node.js
npm install --save winston pino

# Python
pip install structlog python-json-logger

```

### Architectural Guardrails with ESLint (Optional)

Documentation guidelines rely on developers and AI agents following rules. Architectural guardrails enforce rules through tooling — violations fail the build rather than slip through review.

For JavaScript/TypeScript projects, create a custom ESLint rule to catch sensitive data logging at build time:

```javascript
// eslint-rules/no-sensitive-logging.js
const SENSITIVE_FIELDS = [
  'password', 'token', 'apiKey', 'secret', 'creditCard',
  'ssn', 'privateKey', 'authorization', 'bearer'
];

const LOGGING_CALLS = ['log', 'info', 'warn', 'error', 'debug'];
const LOGGING_OBJECTS = ['console', 'logger', 'winston', 'pino'];

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow logging of sensitive data',
      category: 'Security',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== 'MemberExpression') return;

        const objectName = node.callee.object.name || '';
        const methodName = node.callee.property.name || '';

        const isLoggingCall =
          LOGGING_OBJECTS.includes(objectName.toLowerCase()) &&
          LOGGING_CALLS.includes(methodName.toLowerCase());

        if (!isLoggingCall) return;

        // Check arguments for sensitive fields
        node.arguments.forEach(arg => {
          checkForSensitiveData(arg, context);
        });
      },
    };
  },
};

```

Usage in `eslint.config.js`:

```javascript
const noSensitiveLogging = require('./eslint-rules/no-sensitive-logging');

module.exports = [
  {
    plugins: {
      custom: { rules: { 'no-sensitive-logging': noSensitiveLogging } }
    },
    rules: {
      'custom/no-sensitive-logging': 'error'
    }
  }
];

```

**Note**: These tools validate the code after Kiro writes it, but aren't required for the steering document to work.
