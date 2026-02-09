---
title: TypeScript Code Quality Standards
description: Guides Kiro to write consistent, error-free TypeScript with proper types and formatting
category: code-quality
tags:
  - typescript
  - formatting
  - code-generation
  - types
  - react
  - components
  - best-practices
  - express
  - nodejs
  - api
inclusion: always
applicableTo:
  - web-app
  - library
  - cli-tool
  - api-server
  - vscode-extension
requiredDependencies:
  - typescript
  - react
  - express
filePatterns:
  - '**/*.ts'
  - '**/*.tsx'
  - components/**/*.jsx
  - components/**/*.tsx
  - src/components/**/*
  - routes/**/*.js
  - routes/**/*.ts
  - api/**/*
---

## Core Principle

**Kiro writes clean, consistently formatted TypeScript that leverages strong typing and prevents common type-related errors.**

## RULES

You MUST follow these rules when creating or editing TypeScript files:

1. You MUST provide explicit type annotations for function parameters and return types

2. You MUST define interfaces for all object structures

3. You MUST organize imports logically (external libraries, internal modules, type imports)

4. You MUST use meaningful generic type names (not just T, U, V)

5. You MUST NOT use `any` type unless absolutely necessary

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

### Type Guards Over Type Assertions

**Prefer type guards**: Use runtime checks instead of unsafe type assertions

```typescript
// Kiro will write:
function isUser(data: unknown): data is User {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "name" in data
  );
}

if (isUser(data)) {
  console.log(data.name); // safely narrowed to User
}

// Not:
const user = data as User;
console.log(user.name); // unsafe, no runtime check

```

### Prefer Unknown Over Any

**Use `unknown` with narrowing**: Safer alternative to `any` that forces type checking

```typescript
// Kiro will write:
function processInput(data: unknown): string {
  if (typeof data === "string") {
    return data.toUpperCase();
  }
  if (typeof data === "number") {
    return data.toString();
  }
  throw new Error("Unsupported input type");
}

// Not:
function processInput(data: any): string {
  return data.toUpperCase(); // no safety, crashes on non-strings
}

```

### Const Assertions

**Use `as const` for literal types**: Preserves exact values instead of widening to base types

```typescript
// Kiro will write:
const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
} as const;

type Route = (typeof ROUTES)[keyof typeof ROUTES];
// Type is "/" | "/about" | "/contact"

const colors = ["red", "green", "blue"] as const;
// Type is readonly ["red", "green", "blue"]

// Not:
const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
};
// Type is { HOME: string; ABOUT: string; CONTACT: string }

```

### Readonly for Immutability

**Use `readonly` to prevent mutation**: Mark properties and parameters that should not change

```typescript
// Kiro will write:
interface AppConfig {
  readonly apiUrl: string;
  readonly timeout: number;
  readonly retries: number;
}

function processItems(items: readonly string[]): string[] {
  // items.push("new"); // Error: readonly
  return items.map((item) => item.toUpperCase());
}

// Not:
interface AppConfig {
  apiUrl: string;
  timeout: number;
  retries: number;
}

function processItems(items: string[]): string[] {
  items.push("new"); // mutates the original array
  return items.map((item) => item.toUpperCase());
}

```

### Discriminated Unions

**Use tagged unions for complex state**: Enables exhaustive type checking with a shared discriminant property

```typescript
// Kiro will write:
interface LoadingState {
  status: "loading";
}

interface SuccessState<T> {
  status: "success";
  data: T;
}

interface ErrorState {
  status: "error";
  error: string;
}

type RequestState<T> = LoadingState | SuccessState<T> | ErrorState;

function handleState(state: RequestState<User[]>): string {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return `Found ${state.data.length} users`;
    case "error":
      return `Error: ${state.error}`;
  }
}

// Not:
interface RequestState {
  loading: boolean;
  data: any;
  error: string | null;
}

```

## What This Prevents

- **Runtime type errors** from missing or incorrect type annotations

- **API integration issues** from poorly defined interfaces

- **Import confusion** from disorganized module imports

- **Generic type errors** from unclear type constraints

- **Maintenance headaches** from weak typing and unclear contracts

- **Unsafe type casting** from using assertions instead of type guards

- **Hidden bugs** from untyped `any` values bypassing the type system

- **Accidental mutation** from missing `readonly` on shared data

- **Incomplete state handling** from loosely typed state objects

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
