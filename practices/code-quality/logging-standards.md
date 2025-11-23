---
title: "Logging Standards"
description: "Guides Kiro to write consistent, informative logging code that aids debugging without exposing sensitive data"
category: "code-quality"
tags: ["logging", "debugging", "monitoring", "security"]
inclusion: always
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

```javascript
// Kiro will write:
const sanitizeForLogging = (data) => {
  const sensitive = ['password', 'token', 'apiKey', 'ssn', 'creditCard'];
  const sanitized = { ...data };
  
  sensitive.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
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

## Optional: Validation with External Tools

Want to enhance your logging capabilities? Add these tools:

### Quick Setup (Optional)

```bash
# Node.js
npm install --save winston pino

# Python
pip install structlog python-json-logger
```

**Note**: These tools provide advanced logging features, but aren't required for the steering document to work.
