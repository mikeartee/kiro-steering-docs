---
title: Database Query Patterns and Best Practices
description: Guides Kiro to write secure, efficient database queries with proper formatting and parameterization
category: code-quality
tags:
  - database
  - sql
  - query-optimization
  - security
  - parameterization
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

**Kiro writes secure, readable database queries that use parameterization to prevent SQL injection and follow consistent formatting for maintainability.**

## How Kiro Will Write Database Queries

### SQL Query Formatting

**Consistent formatting**: Use clear structure with keywords in uppercase

```sql
-- Kiro will write:
SELECT
  u.id,
  u.name,
  u.email,
  u.created_at
FROM users u
WHERE u.is_active = true
  AND u.created_at >= '2024-01-01'
ORDER BY u.created_at DESC
LIMIT 10;

-- Not:
select u.id,u.name,u.email,u.created_at from users u where u.is_active=true and u.created_at>='2024-01-01' order by u.created_at desc limit 10;
```

### Parameterized Queries

**Always use parameters**: Never concatenate user input into queries

```javascript
// Kiro will write:
const getUserById = async (userId) => {
  const query = "SELECT * FROM users WHERE id = $1";
  const result = await db.query(query, [userId]);
  return result.rows[0];
};

const searchUsers = async (searchTerm, limit) => {
  const query = `
    SELECT id, name, email
    FROM users
    WHERE name ILIKE $1
    LIMIT $2
  `;
  const result = await db.query(query, [`%${searchTerm}%`, limit]);
  return result.rows;
};

// NEVER do this (SQL injection risk):
const getUserById = async (userId) => {
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  const result = await db.query(query);
  return result.rows[0];
};
```

### Query Organization

**Readable query structure**: Break complex queries into logical sections

```python
# Kiro will write:
def get_user_orders_with_totals(user_id, start_date, end_date):
    query = """
        SELECT
            o.id,
            o.order_date,
            o.status,
            COUNT(oi.id) as item_count,
            SUM(oi.quantity * oi.price) as total_amount
        FROM orders o
        INNER JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = %s
          AND o.order_date BETWEEN %s AND %s
        GROUP BY o.id, o.order_date, o.status
        ORDER BY o.order_date DESC
    """

    cursor.execute(query, (user_id, start_date, end_date))
    return cursor.fetchall()

# Not:
def get_user_orders_with_totals(user_id, start_date, end_date):
    query = "SELECT o.id,o.order_date,o.status,COUNT(oi.id) as item_count,SUM(oi.quantity*oi.price) as total_amount FROM orders o INNER JOIN order_items oi ON o.id=oi.order_id WHERE o.user_id=%s AND o.order_date BETWEEN %s AND %s GROUP BY o.id,o.order_date,o.status ORDER BY o.order_date DESC"
    cursor.execute(query, (user_id, start_date, end_date))
    return cursor.fetchall()
```

### Transaction Handling

**Proper transaction management**: Use transactions for multi-step operations

```javascript
// Kiro will write:
const transferFunds = async (fromAccountId, toAccountId, amount) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Deduct from source account
    await client.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
      [amount, fromAccountId]
    );

    // Add to destination account
    await client.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
      [amount, toAccountId]
    );

    // Record transaction
    await client.query(
      "INSERT INTO transactions (from_account, to_account, amount) VALUES ($1, $2, $3)",
      [fromAccountId, toAccountId, amount]
    );

    await client.query("COMMIT");
    return { success: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Not:
const transferFunds = async (fromAccountId, toAccountId, amount) => {
  // No transaction - data could be inconsistent if any query fails
  await db.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [
    amount,
    fromAccountId,
  ]);
  await db.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [
    amount,
    toAccountId,
  ]);
  await db.query(
    "INSERT INTO transactions (from_account, to_account, amount) VALUES ($1, $2, $3)",
    [fromAccountId, toAccountId, amount]
  );
};
```

### Query Optimization Patterns

**Efficient queries**: Use indexes, avoid N+1 queries, and select only needed columns

```python
# Kiro will write:
def get_users_with_recent_orders(limit=10):
    # Single query with JOIN instead of N+1 queries
    query = """
        SELECT
            u.id,
            u.name,
            u.email,
            COUNT(o.id) as order_count,
            MAX(o.created_at) as last_order_date
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        WHERE u.is_active = true
        GROUP BY u.id, u.name, u.email
        HAVING COUNT(o.id) > 0
        ORDER BY last_order_date DESC
        LIMIT %s
    """

    cursor.execute(query, (limit,))
    return cursor.fetchall()

# Avoid N+1 queries:
def get_users_with_recent_orders_bad(limit=10):
    # This causes N+1 queries - inefficient!
    users = db.query("SELECT * FROM users WHERE is_active = true LIMIT %s", (limit,))

    for user in users:
        # Separate query for each user
        orders = db.query("SELECT * FROM orders WHERE user_id = %s", (user['id'],))
        user['orders'] = orders

    return users
```

## What This Prevents

- **SQL injection attacks** from concatenated user input
- **Performance issues** from unoptimized queries and N+1 problems
- **Data inconsistencies** from missing transaction handling
- **Maintenance headaches** from poorly formatted queries

## Simple Examples

### Before/After: User Authentication Query

```javascript
// Before (DANGEROUS - SQL injection risk):
const authenticateUser = async (email, password) => {
  const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
  const result = await db.query(query);
  return result.rows[0];
};

// After (SECURE):
const authenticateUser = async (email, passwordHash) => {
  const query = `
    SELECT 
      id,
      email,
      name,
      password_hash
    FROM users
    WHERE email = $1
      AND is_active = true
  `;

  const result = await db.query(query, [email]);
  const user = result.rows[0];

  if (!user) {
    return null;
  }

  // Compare password hash separately
  const isValid = await bcrypt.compare(passwordHash, user.password_hash);
  return isValid ? user : null;
};
```

### Before/After: Complex Report Query

```python
# Before:
def get_sales_report(start_date, end_date):
    query = "SELECT * FROM orders WHERE order_date >= '" + start_date + "' AND order_date <= '" + end_date + "'"
    return db.execute(query)

# After:
def get_sales_report(start_date, end_date):
    query = """
        SELECT
            DATE(o.order_date) as sale_date,
            COUNT(DISTINCT o.id) as order_count,
            COUNT(oi.id) as item_count,
            SUM(oi.quantity * oi.price) as total_revenue,
            AVG(oi.quantity * oi.price) as avg_order_value
        FROM orders o
        INNER JOIN order_items oi ON o.id = oi.order_id
        WHERE o.order_date BETWEEN %s AND %s
          AND o.status = 'completed'
        GROUP BY DATE(o.order_date)
        ORDER BY sale_date DESC
    """

    cursor.execute(query, (start_date, end_date))
    return cursor.fetchall()
```

### Before/After: Batch Insert

```javascript
// Before (inefficient - multiple queries):
const createUsers = async (users) => {
  for (const user of users) {
    await db.query("INSERT INTO users (name, email) VALUES ($1, $2)", [
      user.name,
      user.email,
    ]);
  }
};

// After (efficient - single batch query):
const createUsers = async (users) => {
  const values = users
    .map((user, index) => {
      const offset = index * 2;
      return `($${offset + 1}, $${offset + 2})`;
    })
    .join(", ");

  const params = users.flatMap((user) => [user.name, user.email]);

  const query = `
    INSERT INTO users (name, email)
    VALUES ${values}
    RETURNING id, name, email
  `;

  const result = await db.query(query, params);
  return result.rows;
};
```

## Customization

This is a starting point focused on common database query patterns. You can extend these rules based on your project's specific needs:

- Add database-specific patterns (PostgreSQL, MySQL, MongoDB)
- Include ORM-specific guidelines (Sequelize, SQLAlchemy, Prisma)
- Add stored procedure patterns
- Include database migration best practices

## Optional: Validation with External Tools

Want to validate query performance and security? Add these tools:

### Quick Setup (Optional)

```bash
# Node.js
npm install --save-dev pg node-postgres-named

# Python
pip install psycopg2-binary sqlalchemy
```

### Query Analysis (Optional)

```sql
-- Use EXPLAIN to analyze query performance
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'user@example.com';

-- Check for missing indexes
SELECT * FROM pg_stat_user_tables WHERE idx_scan = 0;
```

**Note**: These tools help analyze and optimize queries after Kiro writes them, but aren't required for the steering document to work.
