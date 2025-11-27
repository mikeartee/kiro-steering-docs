---
title: Code Review Standards
description: Guides Kiro to write code that follows code review best practices and common standards
category: code-quality
tags:
  - code-review
  - best-practices
  - standards
  - quality
  - code-quality
inclusion: always
applicableTo:
  - web-app
  - library
  - cli-tool
  - api-server
  - vscode-extension
version: 1.0.0
---

## Core Principle

**Kiro writes code that anticipates code review feedback and follows common review standards.** This steering document helps generate code that passes typical code review checks, reducing review cycles and improving code quality from the start.

## How Kiro Will Write Code

### Clear and Descriptive Naming

**Use meaningful names**: Variables, functions, and classes should clearly indicate their purpose

```javascript
// Kiro will write:
function calculateUserSubscriptionTotal(userId, subscriptionType) {
  const basePrice = getSubscriptionBasePrice(subscriptionType);
  const userDiscount = getUserDiscount(userId);
  return basePrice - userDiscount;
}

// Not:
function calc(u, t) {
  const p = getPrice(t);
  const d = getDisc(u);
  return p - d;
}
```

### Single Responsibility

**One function, one purpose**: Each function should do one thing well

```python
# Kiro will write:
def validate_email(email: str) -> bool:
    """Check if email format is valid."""
    return re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email) is not None

def send_welcome_email(email: str) -> None:
    """Send welcome email to user."""
    if not validate_email(email):
        raise ValueError("Invalid email format")
    email_service.send(email, "Welcome!", get_welcome_template())

# Not:
def send_welcome_email(email: str) -> None:
    """Send welcome email and validate it."""
    if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
        raise ValueError("Invalid email")
    email_service.send(email, "Welcome!", get_welcome_template())
```

### Error Handling

**Handle errors explicitly**: Don't let errors fail silently

```typescript
// Kiro will write:
async function fetchUserData(userId: string): Promise<User> {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new UserNotFoundError(`User ${userId} not found`);
    }
    throw new ApiError('Failed to fetch user data', error);
  }
}

// Not:
async function fetchUserData(userId: string): Promise<User> {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    return null;
  }
}
```

### Code Comments

**Comment the why, not the what**: Explain reasoning, not obvious operations

```python
# Kiro will write:
def process_payment(amount: float, currency: str) -> bool:
    # Convert to cents to avoid floating-point precision issues
    amount_in_cents = int(amount * 100)
    
    # Use idempotency key to prevent duplicate charges on retry
    idempotency_key = generate_idempotency_key()
    
    return payment_gateway.charge(amount_in_cents, currency, idempotency_key)

# Not:
def process_payment(amount: float, currency: str) -> bool:
    # Convert amount to cents
    amount_in_cents = int(amount * 100)
    
    # Generate key
    idempotency_key = generate_idempotency_key()
    
    # Charge the payment
    return payment_gateway.charge(amount_in_cents, currency, idempotency_key)
```

### Avoid Magic Numbers

**Use named constants**: Replace magic numbers with descriptive constants

```javascript
// Kiro will write:
const MAX_LOGIN_ATTEMPTS = 3;
const SESSION_TIMEOUT_MINUTES = 30;
const CACHE_TTL_SECONDS = 3600;

function checkLoginAttempts(attempts) {
  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    lockAccount();
  }
}

// Not:
function checkLoginAttempts(attempts) {
  if (attempts >= 3) {
    lockAccount();
  }
}
```

### Keep Functions Short

**Limit function length**: Break down complex functions into smaller, focused ones

```typescript
// Kiro will write:
function processOrder(order: Order): ProcessedOrder {
  validateOrder(order);
  const calculatedOrder = calculateOrderTotals(order);
  const paymentResult = processPayment(calculatedOrder);
  const shippingInfo = scheduleShipping(calculatedOrder);
  
  return createProcessedOrder(calculatedOrder, paymentResult, shippingInfo);
}

function validateOrder(order: Order): void {
  if (!order.items || order.items.length === 0) {
    throw new ValidationError('Order must contain items');
  }
  if (!order.customerId) {
    throw new ValidationError('Order must have a customer');
  }
}

// Not:
function processOrder(order: Order): ProcessedOrder {
  if (!order.items || order.items.length === 0) {
    throw new ValidationError('Order must contain items');
  }
  if (!order.customerId) {
    throw new ValidationError('Order must have a customer');
  }
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }
  const tax = total * 0.08;
  const shipping = calculateShipping(order);
  const grandTotal = total + tax + shipping;
  // ... 50 more lines
}
```

### Consistent Return Types

**Predictable returns**: Functions should return consistent types

```python
# Kiro will write:
def find_user_by_email(email: str) -> Optional[User]:
    """Find user by email, returns None if not found."""
    user = db.query(User).filter_by(email=email).first()
    return user

# Not:
def find_user_by_email(email: str):
    """Find user by email."""
    user = db.query(User).filter_by(email=email).first()
    if user:
        return user
    return False  # Inconsistent return type
```

## What This Prevents

- **Unclear code** that requires extensive review comments
- **Complex functions** that are hard to understand and maintain
- **Silent failures** from poor error handling
- **Magic numbers** that obscure business logic
- **Inconsistent patterns** that confuse reviewers
- **Missing context** from inadequate comments

## Simple Examples

### Before/After: API Endpoint

```javascript
// Before:
app.post('/api/users', async (req, res) => {
  const u = req.body;
  const r = await db.insert(u);
  res.json(r);
});

// After:
const MAX_USERNAME_LENGTH = 50;
const MIN_PASSWORD_LENGTH = 8;

app.post('/api/users', async (req, res) => {
  try {
    const userData = req.body;
    
    validateUserData(userData);
    
    const hashedPassword = await hashPassword(userData.password);
    const newUser = await createUser({
      ...userData,
      password: hashedPassword
    });
    
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else {
      logger.error('Failed to create user', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

function validateUserData(userData) {
  if (!userData.username || userData.username.length > MAX_USERNAME_LENGTH) {
    throw new ValidationError('Invalid username');
  }
  if (!userData.password || userData.password.length < MIN_PASSWORD_LENGTH) {
    throw new ValidationError('Password too short');
  }
  if (!isValidEmail(userData.email)) {
    throw new ValidationError('Invalid email format');
  }
}
```

### Before/After: Data Processing

```python
# Before:
def process(data):
    r = []
    for d in data:
        if d > 0:
            r.append(d * 2)
    return r

# After:
def filter_and_double_positive_values(values: List[float]) -> List[float]:
    """
    Filter positive values and double them.
    
    Used for calculating bonus points where only positive scores count
    and are doubled for the final calculation.
    """
    positive_values = [value for value in values if value > 0]
    doubled_values = [value * 2 for value in positive_values]
    return doubled_values
```

## Customization

This is a starting point for code review standards. You can customize by:

- Adding language-specific review patterns
- Including team-specific conventions
- Adding security-focused review checks
- Incorporating performance review criteria

## Related Documents

- [JavaScript Formatting](../../code-formatting/javascript-formatting.md) - JavaScript code style
- [TypeScript Formatting](../../code-formatting/typescript-formatting.md) - TypeScript patterns
- [Python Formatting](../../code-formatting/python-formatting.md) - Python conventions

## Optional: Validation with External Tools

Want to enforce these standards automatically? Consider these tools:

### Code Review Tools (Optional)

```bash
# ESLint for JavaScript/TypeScript
npm install --save-dev eslint

# Pylint for Python
pip install pylint

# SonarQube for comprehensive analysis
# See: https://www.sonarqube.org/
```

**Note**: These tools help enforce standards but aren't required for the steering document to work.
