---
title: "GraphQL Schema Standards"
description: "Guides Kiro to write well-structured GraphQL schemas with consistent naming and organization"
tags: ["graphql", "api", "schema", "formatting"]
inclusion: always
---

## Core Principle

**Kiro writes clean, well-organized GraphQL schemas with consistent naming conventions and clear type definitions.**

## How Kiro Will Write GraphQL

### Type Definitions

**Clear type structure**: Proper formatting and field organization

```graphql
# Kiro will write:
type User {
  id: ID!
  email: String!
  name: String!
  avatar: String
  createdAt: DateTime!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  published: Boolean!
  author: User!
  comments: [Comment!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

# Not:
type User {
  id: ID!
  email: String!
  name: String!
  avatar: String
  createdAt: DateTime!
  posts: [Post!]!}
type Post {id: ID!
title: String!
content: String!
published: Boolean!
author: User!
comments: [Comment!]!
createdAt: DateTime!
updatedAt: DateTime!}
```

### Query Definitions

**Organized query structure**: Group related queries logically

```graphql
# Kiro will write:
type Query {
  # User queries
  user(id: ID!): User
  users(
    limit: Int = 10
    offset: Int = 0
    filter: UserFilter
  ): [User!]!
  
  # Post queries
  post(id: ID!): Post
  posts(
    limit: Int = 10
    offset: Int = 0
    published: Boolean
  ): [Post!]!
}

# Not:
type Query {
  user(id: ID!): User
  users(limit: Int = 10, offset: Int = 0, filter: UserFilter): [User!]!
  post(id: ID!): Post
  posts(limit: Int = 10, offset: Int = 0, published: Boolean): [Post!]!
}
```

### Mutation Definitions

**Clear mutation structure**: Descriptive names and input types

```graphql
# Kiro will write:
input CreateUserInput {
  email: String!
  name: String!
  password: String!
}

input UpdateUserInput {
  name: String
  avatar: String
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
  
  createPost(input: CreatePostInput!): Post!
  updatePost(id: ID!, input: UpdatePostInput!): Post!
  deletePost(id: ID!): Boolean!
}

# Not:
type Mutation {
  createUser(email: String!, name: String!, password: String!): User!
  updateUser(id: ID!, name: String, avatar: String): User!
  deleteUser(id: ID!): Boolean!
}
```

### Naming Conventions

**Consistent naming**: Use clear, descriptive names

```graphql
# Kiro will write:
type User {
  id: ID!
  firstName: String!
  lastName: String!
  emailAddress: String!
  isActive: Boolean!
  createdAt: DateTime!
}

enum UserRole {
  ADMIN
  MODERATOR
  USER
  GUEST
}

# Not:
type User {
  id: ID!
  first_name: String!
  last_name: String!
  email: String!
  active: Boolean!
  created: DateTime!
}

enum UserRole {
  admin
  moderator
  user
  guest
}
```

## What This Prevents

- Inconsistent naming across schema
- Unreadable compressed type definitions
- Poor query organization
- Unclear mutation purposes
- Type definition confusion

## Customization

This is a starting point! You can modify these rules by editing this steering document:

- Adjust naming conventions (camelCase vs snake_case)
- Change field ordering preferences
- Modify comment style
- Add project-specific patterns

## Optional: Validation with External Tools

Want to validate that generated GraphQL follows these standards? Add these tools:

### Quick Setup (Optional)

```bash
npm install --save-dev @graphql-eslint/eslint-plugin
```

**Note**: These tools validate the GraphQL after Kiro writes it, but aren't required for the steering document to work.
