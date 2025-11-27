---
title: "React Component Patterns"
description: "Guides Kiro to write React components following modern best practices and patterns"
category: "frameworks"
tags: ["react", "components", "hooks", "typescript", "patterns"]
inclusion: always
version: "1.0.0"
---

## Core Principle

**Kiro writes clean, maintainable React components using modern patterns and hooks best practices.** This steering document ensures components are well-structured, properly typed, and follow React conventions.

## How Kiro Will Write React Components

### Component Structure

**Consistent organization**: Components follow a predictable structure

```typescript
// Kiro will write:
import React, { useState, useEffect } from 'react';

interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export function UserProfile({ userId, onUpdate }: UserProfileProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setIsLoading(false));
  }, [userId]);

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <ErrorMessage message="User not found" />;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

// Not:
export function UserProfile(props) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchUser(props.userId).then(setUser).finally(() => setIsLoading(false));
  }, [props.userId]);

  return isLoading ? <LoadingSpinner /> : !user ? <ErrorMessage message="User not found" /> : (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

### Props Interface

**Clear prop definitions**: TypeScript interfaces for all props

```typescript
// Kiro will write:
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  isLoading?: boolean;
}

export function Button({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false,
  isLoading = false 
}: ButtonProps): JSX.Element {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? <Spinner /> : label}
    </button>
  );
}

// Not:
export function Button(props) {
  return (
    <button
      className={`btn btn-${props.variant || 'primary'}`}
      onClick={props.onClick}
      disabled={props.disabled || props.isLoading}
    >
      {props.isLoading ? <Spinner /> : props.label}
    </button>
  );
}
```

### useState Hook

**Descriptive state names**: Clear naming for state variables and setters

```typescript
// Kiro will write:
function SearchForm(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Result[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    const results = await searchAPI(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  return (
    <div>
      <input 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
      />
      <button onClick={handleSearch} disabled={isSearching}>
        Search
      </button>
    </div>
  );
}

// Not:
function SearchForm() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    const r = await searchAPI(query);
    setResults(r);
    setLoading(false);
  };

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={search} disabled={loading}>Search</button>
    </div>
  );
}
```

### useEffect Hook

**Clear dependencies**: Proper dependency arrays and cleanup

```typescript
// Kiro will write:
function UserActivityTracker({ userId }: { userId: string }): JSX.Element {
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    const subscription = activityStream.subscribe(userId, (newActivity) => {
      setActivity((prev) => [...prev, newActivity]);
    });

    // Cleanup function to unsubscribe
    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return <ActivityList activities={activity} />;
}

// Not:
function UserActivityTracker({ userId }) {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    activityStream.subscribe(userId, (newActivity) => {
      setActivity([...activity, newActivity]);
    });
  }); // Missing dependencies and cleanup
}
```

### Custom Hooks

**Reusable logic**: Extract common patterns into custom hooks

```typescript
// Kiro will write:
function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, isLoading, error };
}

// Usage:
function UserList(): JSX.Element {
  const { data: users, isLoading, error } = useApi<User[]>('/api/users');

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Not:
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  return loading ? <LoadingSpinner /> : (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Component Composition

**Small, focused components**: Break down complex UIs into composable pieces

```typescript
// Kiro will write:
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className = '' }: CardProps): JSX.Element {
  return <div className={`card ${className}`}>{children}</div>;
}

function CardHeader({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="card-header">{children}</div>;
}

function CardBody({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="card-body">{children}</div>;
}

function CardFooter({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="card-footer">{children}</div>;
}

// Usage:
function UserCard({ user }: { user: User }): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <h3>{user.name}</h3>
      </CardHeader>
      <CardBody>
        <p>{user.email}</p>
        <p>{user.bio}</p>
      </CardBody>
      <CardFooter>
        <Button label="Edit" onClick={() => editUser(user.id)} />
      </CardFooter>
    </Card>
  );
}

// Not:
function UserCard({ user }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{user.name}</h3>
      </div>
      <div className="card-body">
        <p>{user.email}</p>
        <p>{user.bio}</p>
      </div>
      <div className="card-footer">
        <button onClick={() => editUser(user.id)}>Edit</button>
      </div>
    </div>
  );
}
```

### Event Handlers

**Consistent naming**: Use handle prefix for event handlers

```typescript
// Kiro will write:
function LoginForm(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={handleEmailChange} />
      <input type="password" value={password} onChange={handlePasswordChange} />
      <button type="submit">Login</button>
    </form>
  );
}

// Not:
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form onSubmit={(e) => { e.preventDefault(); login(email, password); }}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
```

## What This Prevents

- **Prop drilling** through proper component composition
- **Type errors** with TypeScript interfaces
- **Memory leaks** from missing cleanup in useEffect
- **Unnecessary re-renders** from proper dependency management
- **Inconsistent patterns** across components
- **Hard-to-test components** from poor separation of concerns

## Simple Examples

### Before/After: Data Fetching Component

```typescript
// Before:
function UserDashboard(props) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/users/${props.userId}`).then(r => r.json()).then(setUser);
    fetch(`/api/users/${props.userId}/posts`).then(r => r.json()).then(setPosts);
    setLoading(false);
  }, []);

  return loading ? <div>Loading...</div> : (
    <div>
      <h1>{user.name}</h1>
      {posts.map(p => <div key={p.id}>{p.title}</div>)}
    </div>
  );
}

// After:
interface UserDashboardProps {
  userId: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
}

function UserDashboard({ userId }: UserDashboardProps): JSX.Element {
  const { data: user, isLoading: isLoadingUser } = useApi<User>(`/api/users/${userId}`);
  const { data: posts, isLoading: isLoadingPosts } = useApi<Post[]>(`/api/users/${userId}/posts`);

  const isLoading = isLoadingUser || isLoadingPosts;

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <ErrorMessage message="User not found" />;

  return (
    <div className="user-dashboard">
      <UserHeader user={user} />
      <PostList posts={posts || []} />
    </div>
  );
}

function UserHeader({ user }: { user: User }): JSX.Element {
  return (
    <header className="user-header">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </header>
  );
}

function PostList({ posts }: { posts: Post[] }): JSX.Element {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function PostCard({ post }: { post: Post }): JSX.Element {
  return (
    <article className="post-card">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </article>
  );
}
```

## Customization

This is a starting point for React component patterns. You can customize by:

- Adding state management patterns (Redux, Zustand, etc.)
- Including routing conventions (React Router)
- Adding form handling patterns (React Hook Form, Formik)
- Incorporating testing patterns (React Testing Library)

## Related Documents

- [TypeScript Formatting](../../code-formatting/typescript-formatting.md) - TypeScript conventions
- [JavaScript Formatting](../../code-formatting/javascript-formatting.md) - JavaScript style

## Optional: Validation with External Tools

Want to enforce these patterns automatically? Consider these tools:

### React Development Tools (Optional)

```bash
# ESLint with React plugin
npm install --save-dev eslint eslint-plugin-react eslint-plugin-react-hooks

# TypeScript for type checking
npm install --save-dev typescript @types/react @types/react-dom

# React Testing Library
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

**Note**: These tools help enforce patterns but aren't required for the steering document to work.
