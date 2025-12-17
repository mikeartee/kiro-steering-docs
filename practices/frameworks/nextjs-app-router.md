---
title: Next.js App Router Best Practices
description: Guides Kiro to write modern Next.js applications using App Router patterns and Server Components
category: code-quality
tags:
  - nextjs
  - react
  - app-router
  - server-components
inclusion: always
---

## Core Principle

**Kiro writes modern Next.js applications using App Router conventions, Server Components by default, and proper data fetching patterns.**

## RULES

You MUST follow these rules when working with Next.js App Router:

1. You MUST use Server Components by default (no 'use client' unless needed)

2. You MUST fetch data directly in Server Components using async/await

3. You MUST use proper file conventions (page.tsx, layout.tsx, loading.tsx)

4. You MUST import routing hooks from 'next/navigation' (not 'next/router')

5. You MUST use 'use client' directive only for interactivity, state, or browser APIs

## How Kiro Will Write Next.js

### Server Components (Default)

**Fetch data directly in Server Components**: No need for getServerSideProps or useEffect

```tsx
// Kiro will write:
async function getPosts() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  return posts;
}

export default async function Page() {
  const posts = await getPosts();
  
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

// Not:
'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetch('https://api.example.com/posts')
      .then(res => res.json())
      .then(setPosts);
  }, []);
  
  return <ul>...</ul>;
}

```

### Data Fetching Strategies

**Use fetch options for caching behavior**: Control static, dynamic, and revalidated data

```tsx
// Kiro will write:
export default async function Page() {
  // Static (cached until manually invalidated)
  const staticData = await fetch('https://...', { cache: 'force-cache' });
  
  // Dynamic (refetched on every request)
  const dynamicData = await fetch('https://...', { cache: 'no-store' });
  
  // Revalidated (cached with 10 second lifetime)
  const revalidatedData = await fetch('https://...', {
    next: { revalidate: 10 },
  });
  
  return <div>...</div>;
}

// Not using getServerSideProps or getStaticProps

```

### Client Components

**Use 'use client' only when necessary**: For interactivity, state, effects, or browser APIs

```tsx
// Kiro will write:
'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}

// Not:
import { useRouter } from 'next/router'; // Wrong import!

```

### Composition Pattern

**Pass data from Server to Client Components**: Server Components fetch, Client Components handle interactivity

```tsx
// Kiro will write:
// app/page.tsx (Server Component)
import ClientComponent from './client-component';

async function getData() {
  const res = await fetch('https://...');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <ClientComponent data={data} />;
}

// app/client-component.tsx (Client Component)
'use client';

export default function ClientComponent({ data }) {
  const [selected, setSelected] = useState(null);
  
  return (
    <div>
      {data.map(item => (
        <button key={item.id} onClick={() => setSelected(item)}>
          {item.name}
        </button>
      ))}
    </div>
  );
}

```

### File Conventions

**Use proper App Router file structure**: page.tsx, layout.tsx, loading.tsx, error.tsx

```text
app/
├── layout.tsx          # Root layout (required)
├── page.tsx            # Home page
├── loading.tsx         # Loading UI
├── error.tsx           # Error UI
├── dashboard/
│   ├── layout.tsx      # Dashboard layout
│   ├── page.tsx        # Dashboard page
│   └── settings/
│       └── page.tsx    # Settings page

```

```tsx
// Kiro will write:
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div>
      <nav>Dashboard Nav</nav>
      {children}
    </div>
  );
}

```

### Dynamic Routes

**Use proper folder structure for dynamic segments**: [id], [slug], [...slug]

```tsx
// Kiro will write:
// app/posts/[id]/page.tsx
export default async function PostPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  
  return <article>{post.content}</article>;
}

// Generate static params for static generation
export async function generateStaticParams() {
  const posts = await getPosts();
  
  return posts.map((post) => ({
    id: post.id,
  }));
}

```

### Environment Variables

**Use connection() for runtime environment variables**: Ensures dynamic rendering

```tsx
// Kiro will write:
import { connection } from 'next/server';

export default async function Component() {
  await connection();
  
  const apiKey = process.env.API_KEY;
  
  return <div>...</div>;
}

// Not accessing process.env without connection() in dynamic contexts

```

### Link Component

**Use Next.js Link for navigation**: Automatic prefetching and client-side transitions

```tsx
// Kiro will write:
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/settings">Settings</Link>
    </nav>
  );
}

// Not using <a> tags for internal navigation

```

## What This Prevents

- **Unnecessary client-side rendering** from overusing 'use client'

- **Poor performance** from client-side data fetching

- **Hydration errors** from mixing Server and Client Component patterns incorrectly

- **Import errors** from using Pages Router APIs in App Router

- **Build failures** from incorrect file conventions

## Migration Patterns

### From Pages Router to App Router

```tsx
// Before (Pages Router):
// pages/dashboard.tsx
export async function getServerSideProps() {
  const res = await fetch('https://...');
  const data = await res.json();
  return { props: { data } };
}

export default function Dashboard({ data }) {
  return <div>{data.title}</div>;
}

// After (App Router):
// app/dashboard/page.tsx
async function getData() {
  const res = await fetch('https://...', { cache: 'no-store' });
  return res.json();
}

export default async function Dashboard() {
  const data = await getData();
  return <div>{data.title}</div>;
}

```

## Customization

This is a starting point focused on Next.js App Router best practices. You can extend these rules based on your project's specific needs, deployment platform, or team preferences.

## Optional: Validation with External Tools

Want to validate that generated code follows these standards? Add these tools:

### Quick Setup (Optional)

```bash
npm install --save-dev eslint eslint-config-next

```

**Note**: These tools validate the code after Kiro writes it, but aren't required for the steering document to work.
