---
title: Tailwind CSS Code Quality Standards
description: Guides Kiro to write clean, maintainable Tailwind CSS with proper utility class usage
category: code-quality
tags:
  - css
  - tailwind
  - styling
  - formatting
inclusion: always
---

## Core Principle

**Kiro writes clean, maintainable Tailwind CSS that follows utility-first principles and avoids common class detection pitfalls.**

## RULES

You MUST follow these rules when working with Tailwind CSS:

1. You MUST use complete static class names (never dynamic string interpolation)

2. You MUST use mobile-first responsive design with breakpoint prefixes

3. You MUST extract repeated utility combinations into components or loops

4. You MUST use proper variant syntax (hover:, focus:, etc.)

5. You MUST NOT concatenate class names with template literals

## How Kiro Will Write Tailwind CSS

### Static Class Names (Critical)

**Always use complete class names**: Tailwind scans files as plain text and cannot detect dynamically constructed classes

```jsx
// Kiro will write:
function Button({ color }) {
  const colorVariants = {
    blue: 'bg-blue-600 hover:bg-blue-500 text-white',
    red: 'bg-red-500 hover:bg-red-400 text-white',
    yellow: 'bg-yellow-300 hover:bg-yellow-400 text-black',
  };
  return <button className={colorVariants[color]}>{children}</button>;
}

// Not:
function Button({ color }) {
  return <button className={`bg-${color}-600 hover:bg-${color}-500`}>{children}</button>;
}

```

### Responsive Design

**Mobile-first with breakpoint prefixes**: Use sm:, md:, lg:, xl:, 2xl: prefixes

```html
<!-- Kiro will write: -->
<img class="w-16 md:w-32 lg:w-48" src="..." />
<div class="bg-blue-500 md:bg-green-500">...</div>

<!-- Not: -->
<img class="lg:w-48 md:w-32 w-16" src="..." />

```

### Component Extraction

**Use loops to avoid class duplication**: Extract repeated patterns into reusable components

```jsx
// Kiro will write:
<div className="mt-3 flex -space-x-2 overflow-hidden">
  {contributors.map((user) => (
    <img
      key={user.id}
      className="inline-block h-12 w-12 rounded-full ring-2 ring-white"
      src={user.avatarUrl}
      alt={user.handle}
    />
  ))}
</div>

// Not:
<div className="mt-3 flex -space-x-2 overflow-hidden">
  <img className="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="..." alt="" />
  <img className="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="..." alt="" />
  <img className="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="..." alt="" />
  <img className="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="..." alt="" />
</div>

```

### Conditional Classes

**Use complete class names in conditionals**: Ensure full class names are present in source

```html
<!-- Kiro will write: -->
<div class="{{ error ? 'text-red-600' : 'text-green-600' }}"></div>

<!-- Not: -->
<div class="text-{{ error ? 'red' : 'green' }}-600"></div>

```

### Utility Organization

**Logical grouping**: Layout, spacing, colors, typography, effects

```html
<!-- Kiro will write: -->
<div class="flex items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
  <img class="size-12 shrink-0" src="..." alt="..." />
  <div>
    <div class="text-xl font-medium text-black dark:text-white">Title</div>
    <p class="text-gray-500 dark:text-gray-400">Description</p>
  </div>
</div>

<!-- Not scattered or random order -->

```

### Variant Syntax

**Proper variant prefixes**: Use hover:, focus:, dark:, md: etc.

```html
<!-- Kiro will write: -->
<button class="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
  Click me
</button>

<!-- Not missing or incorrect variants -->

```

## What This Prevents

- **Missing classes** from dynamic string interpolation

- **Inconsistent responsive behavior** from incorrect breakpoint usage

- **Code duplication** from repeated utility combinations

- **Build errors** from undetected class names

- **Maintenance issues** from scattered utility organization

## Framework-Specific Patterns

### React/Next.js

```jsx
// Kiro will write:
export function Card({ variant = 'default' }) {
  const variants = {
    default: 'bg-white border border-gray-200',
    primary: 'bg-blue-50 border border-blue-200',
    danger: 'bg-red-50 border border-red-200',
  };

  return (
    <div className={`rounded-lg p-4 shadow-sm ${variants[variant]}`}>
      {/* content */}
    </div>
  );
}

```

### Vue

```vue
<!-- Kiro will write: -->
<template>
  <div :class="buttonClasses">
    <slot />
  </div>
</template>

<script setup>
const props = defineProps(['variant']);

const buttonClasses = computed(() => {
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
  };
  return variants[props.variant] || variants.primary;
});
</script>

```

## Customization

This is a starting point focused on the most common Tailwind CSS issues. You can extend these rules based on your project's specific needs, design system requirements, or team preferences.

## Optional: Validation with External Tools

Want to validate that generated code follows these standards? Add these tools:

### Quick Setup (Optional)

```bash
npm install --save-dev prettier prettier-plugin-tailwindcss

```

**Note**: These tools validate the code after Kiro writes it, but aren't required for the steering document to work.
