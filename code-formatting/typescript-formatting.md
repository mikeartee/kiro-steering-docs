---
title: "TypeScript Code Quality Standards"
description: "Guides Kiro to write consistent, error-free TypeScript with proper types and formatting"
category: "code-quality"
tags: ["typescript", "formatting", "code-generation", "types"]
inclusion: always
---

## Core Principle

**Kiro writes clean, consistently formatted TypeScript that leverages strong typing and prevents common type-related errors.**

## How Kiro Will Write TypeScript

### Type Annotations

**Explicit types for clarity**: Clear type annotations that improve code readability and catch errors

```typescript
// Kiro will write:
function calculateTotal(price: number, tax: number): number {
  return price + price * tax;
}

const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
};

const items: string[] = ["apple", "banana", "orange"];

// Not:
function calculateTotal(price, tax) {
  return price + price * tax;
}

const user = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
};

const items = ["apple", "banana", "orange"];
```

### Interface Definitions

**Clear interface structure**: Well-organized interfaces with consistent naming and ordering

```typescript
// Kiro will write:
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  profile?: UserProfile;
  createdAt: Date;
}

interface UserProfile {
  avatar: string;
  bio: string;
  preferences: {
    theme: "light" | "dark";
    notifications: boolean;
  };
}

// Not:
interface User {
  createdAt: Date;
  profile?: UserProfile;
  name: string;
  isActive: boolean;
  id: number;
  email: string;
}
```

### Import Organization

**Logical import grouping**: Imports organized by source and purpose

```typescript
// Kiro will write:
// External libraries
import React from "react";
import { Router } from "express";
import axios from "axios";

// Internal modules
import { UserService } from "../services/UserService";
import { DatabaseConfig } from "../config/database";
import { Logger } from "../utils/logger";

// Type imports
import type { User, UserProfile } from "../types/user";
import type { ApiResponse } from "../types/api";

// Not:
import { Logger } from "../utils/logger";
import type { User, UserProfile } from "../types/user";
import React from "react";
import { UserService } from "../services/UserService";
import axios from "axios";
import type { ApiResponse } from "../types/api";
```

### Generic Types

**Consistent generic usage**: Clear generic type definitions with meaningful names

```typescript
// Kiro will write:
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  return axios.get<ApiResponse<T>>(url);
}

class Repository<T extends { id: number }> {
  private items: T[] = [];

  findById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }
}

// Not:
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  return axios.get(url);
}
```

### Union Types and Enums

**Clear type definitions**: Proper use of union types and enums for type safety

```typescript
// Kiro will write:
enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MODERATOR = "moderator",
}

type Status = "pending" | "approved" | "rejected";

interface Task {
  id: number;
  title: string;
  status: Status;
  assignee: User | null;
  priority: "low" | "medium" | "high";
}

// Not:
const UserRole = {
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "moderator",
} as const;

interface Task {
  id: number;
  title: string;
  status: string;
  assignee: any;
  priority: string;
}
```

## What This Prevents

- **Runtime type errors** from missing or incorrect type annotations
- **API integration issues** from poorly defined interfaces
- **Import confusion** from disorganized module imports
- **Generic type errors** from unclear type constraints
- **Maintenance headaches** from weak typing and unclear contracts

## Simple Examples

### Before/After: API Service

```typescript
// Before:
export class UserService {
  async getUser(id) {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  }

  async createUser(userData) {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    return response.json();
  }
}

// After:
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

interface CreateUserRequest {
  name: string;
  email: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export class UserService {
  async getUser(id: number): Promise<ApiResponse<User>> {
    const response = await fetch(`/api/users/${id}`);
    return response.json() as Promise<ApiResponse<User>>;
  }

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return response.json() as Promise<ApiResponse<User>>;
  }
}
```

### Before/After: React Component

```typescript
// Before:
import React from "react";

export function UserCard({ user, onEdit }) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user)}>Edit</button>
    </div>
  );
}

// After:
import React from "react";

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
}

export function UserCard({ user, onEdit }: UserCardProps): JSX.Element {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user)}>Edit</button>
    </div>
  );
}
```

## Customization

This is a starting point focused on the most common TypeScript formatting and typing issues. You can extend these rules based on your project's specific needs, framework requirements, or team preferences.

## Optional: Validation with External Tools

Want to validate that generated TypeScript follows these standards? Add these tools:

### Quick Setup (Optional)

```bash
npm install --save-dev typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier
```

**Note**: These tools validate the TypeScript after Kiro writes it, but aren't required for the steering document to work.
