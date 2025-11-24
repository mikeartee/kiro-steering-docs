---
title: "Testing Best Practices"
description: "Guides Kiro to write effective, maintainable tests with clear organization and meaningful assertions"
category: "practices"
tags: ["testing", "unit-tests", "test-organization", "assertions"]
inclusion: always
---

## Core Principle

**Kiro writes focused, readable tests that verify core functionality without over-testing edge cases.**

## How Kiro Will Write Tests

### Test Organization

**Clear test structure**: Group related tests and use descriptive names

```javascript
// Kiro will write:
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a user with valid data', () => {
      const userData = { name: 'John', email: 'john@example.com' };
      const user = userService.createUser(userData);
      
      expect(user.id).toBeDefined();
      expect(user.name).toBe('John');
      expect(user.email).toBe('john@example.com');
    });

    it('should throw error when email is missing', () => {
      const userData = { name: 'John' };
      
      expect(() => userService.createUser(userData)).toThrow('Email is required');
    });
  });
});

// Not:
it('test1', () => {
  // unclear what this tests
});

it('user creation', () => {
  // too vague
});
```

### Test Naming Conventions

**Descriptive test names**: Use clear, action-oriented descriptions

```python
# Kiro will write:
def test_calculate_total_returns_sum_of_item_prices():
    items = [{'price': 10}, {'price': 20}]
    total = calculate_total(items)
    assert total == 30

def test_calculate_total_ignores_items_without_price():
    items = [{'price': 10}, {'name': 'item'}]
    total = calculate_total(items)
    assert total == 10

# Not:
def test_total():
    # unclear what scenario is being tested
    pass

def test_1():
    # meaningless name
    pass
```

### Assertion Best Practices

**Specific assertions**: Use precise assertions that clearly show intent

```javascript
// Kiro will write:
test('user has correct properties', () => {
  const user = createUser({ name: 'Alice', age: 30 });
  
  expect(user.name).toBe('Alice');
  expect(user.age).toBe(30);
  expect(user.id).toBeDefined();
  expect(user.createdAt).toBeInstanceOf(Date);
});

// Not:
test('user works', () => {
  const user = createUser({ name: 'Alice', age: 30 });
  expect(user).toBeTruthy(); // too vague
});
```

### Test Coverage Guidance

**Focus on core functionality**: Test critical paths and common scenarios

```typescript
// Kiro will write:
describe('AuthService', () => {
  // Test core functionality
  it('should authenticate user with valid credentials', () => {
    const result = authService.login('user@example.com', 'password123');
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
  });

  // Test error cases
  it('should reject invalid credentials', () => {
    const result = authService.login('user@example.com', 'wrongpassword');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials');
  });

  // Test edge cases only when critical
  it('should handle empty password', () => {
    const result = authService.login('user@example.com', '');
    expect(result.success).toBe(false);
  });
});

// Avoid over-testing:
// - Don't test every possible input combination
// - Don't test framework/library functionality
// - Don't test trivial getters/setters
```

## What This Prevents

- **Unclear test failures** from vague test names and assertions
- **Maintenance burden** from over-testing edge cases
- **False confidence** from tests that don't verify actual behavior
- **Test organization chaos** from poorly structured test suites

## Simple Examples

### Before/After: API Endpoint Test

```javascript
// Before:
test('api test', () => {
  const response = api.get('/users/1');
  expect(response).toBeTruthy();
});

// After:
describe('GET /users/:id', () => {
  it('should return user data when user exists', async () => {
    const response = await api.get('/users/1');
    
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(1);
    expect(response.data.name).toBeDefined();
    expect(response.data.email).toBeDefined();
  });

  it('should return 404 when user does not exist', async () => {
    const response = await api.get('/users/99999');
    
    expect(response.status).toBe(404);
    expect(response.data.error).toBe('User not found');
  });
});
```

### Before/After: Data Processing Test

```python
# Before:
def test_process():
    result = process_data([1, 2, 3])
    assert result

# After:
def test_process_data_filters_invalid_entries():
    input_data = [
        {'value': 10, 'valid': True},
        {'value': 20, 'valid': False},
        {'value': 30, 'valid': True}
    ]
    
    result = process_data(input_data)
    
    assert len(result) == 2
    assert result[0]['value'] == 10
    assert result[1]['value'] == 30

def test_process_data_returns_empty_list_when_no_valid_entries():
    input_data = [
        {'value': 10, 'valid': False},
        {'value': 20, 'valid': False}
    ]
    
    result = process_data(input_data)
    
    assert result == []
```

## Customization

This is a starting point focused on the most common testing patterns. You can extend these rules based on your project's specific needs:

- Add framework-specific patterns (Jest, pytest, RSpec)
- Include integration test guidelines
- Add performance test standards
- Include test data management patterns

## Optional: Validation with External Tools

Want to validate test quality and coverage? Add these tools:

### Quick Setup (Optional)

```bash
# JavaScript/TypeScript
npm install --save-dev jest @testing-library/react

# Python
pip install pytest pytest-cov
```

**Note**: These tools run and validate tests after Kiro writes them, but aren't required for the steering document to work.
