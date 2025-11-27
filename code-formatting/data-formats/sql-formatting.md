---
title: SQL Formatting Standards
description: Guides Kiro to write readable, consistent SQL queries with proper formatting
category: code-quality
tags:
  - sql
  - database
  - formatting
  - queries
inclusion: always
---

## Core Principle

**Kiro writes clean, readable SQL queries with consistent capitalization, indentation, and structure.**

## How Kiro Will Write SQL

### Keyword Capitalization

**Uppercase SQL keywords**: All SQL keywords in uppercase for clarity

```sql
-- Kiro will write:
SELECT id, name, email
FROM users
WHERE status = 'active'
ORDER BY created_at DESC;

-- Not:
select id, name, email
from users
where status = 'active'
order by created_at desc;
```

### Query Formatting

**One clause per line**: Break queries into logical lines

```sql
-- Kiro will write:
SELECT 
  u.id,
  u.name,
  u.email,
  COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
  AND u.created_at >= '2024-01-01'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 0
ORDER BY order_count DESC
LIMIT 10;

-- Not:
SELECT u.id, u.name, u.email, COUNT(o.id) AS order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.status = 'active' AND u.created_at >= '2024-01-01' GROUP BY u.id, u.name, u.email HAVING COUNT(o.id) > 0 ORDER BY order_count DESC LIMIT 10;
```

### Column Alignment

**Align columns vertically**: Indent column lists for readability

```sql
-- Kiro will write:
SELECT 
  id,
  first_name,
  last_name,
  email,
  phone_number,
  created_at
FROM customers
WHERE country = 'USA';

-- Not:
SELECT id, first_name, last_name,
email, phone_number,
created_at FROM customers
WHERE country = 'USA';
```

### JOIN Formatting

**Clear JOIN structure**: Each JOIN on its own line with proper indentation

```sql
-- Kiro will write:
SELECT 
  u.name,
  p.title,
  c.comment_text
FROM users u
INNER JOIN posts p ON u.id = p.user_id
LEFT JOIN comments c ON p.id = c.post_id
WHERE u.status = 'active'
  AND p.published = true;

-- Not:
SELECT u.name, p.title, c.comment_text FROM users u INNER JOIN posts p ON u.id = p.user_id LEFT JOIN comments c ON p.id = c.post_id WHERE u.status = 'active' AND p.published = true;
```

## What This Prevents

- Unreadable single-line queries
- Inconsistent capitalization across queries
- Difficult-to-debug complex queries
- Poor query maintainability
- Confusion between SQL keywords and column names

## Customization

This is a starting point! You can modify these rules by editing this steering document:

- Change keyword capitalization preference (some teams prefer lowercase)
- Adjust indentation style
- Modify column alignment preferences
- Add database-specific conventions (PostgreSQL, MySQL, etc.)

## Optional: Validation with External Tools

Want to validate that generated SQL follows these standards? Add these tools:

### Quick Setup (Optional)

```bash
npm install --save-dev sql-formatter
# or
pip install sqlfluff
```

### Usage

```bash
# Format SQL files
sql-formatter query.sql

# Lint SQL with sqlfluff
sqlfluff lint query.sql
```

**Note**: These tools validate the SQL after Kiro writes it, but aren't required for the steering document to work.
