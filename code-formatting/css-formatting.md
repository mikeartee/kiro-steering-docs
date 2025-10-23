---
title: "CSS/SCSS Code Quality Standards"
description: "Guides Kiro to write consistent, error-free CSS and SCSS code"
category: "code-quality"
tags: ["css", "scss", "formatting", "code-generation"]
inclusion: always
---

## Core Principle

**Kiro writes clean, consistently formatted CSS/SCSS that prevents common styling errors and maintains readable structure.**

## How Kiro Will Write CSS/SCSS

### Property Ordering

**Logical grouping**: Properties are organized by visual impact and inheritance

```css
/* Kiro will write: */
.button {
  /* Layout */
  display: flex;
  position: relative;
  width: 100px;
  height: 40px;

  /* Visual */
  background-color: #007bff;
  border: 1px solid #0056b3;
  border-radius: 4px;

  /* Typography */
  color: white;
  font-size: 14px;
  font-weight: 500;

  /* Interaction */
  cursor: pointer;
  transition: background-color 0.2s;
}

/* Not: */
.button {
  cursor: pointer;
  background-color: #007bff;
  display: flex;
  color: white;
  width: 100px;
  border: 1px solid #0056b3;
}
```

### Consistent Indentation

**2-space indentation**: Maintains readability without excessive nesting

```css
/* Kiro will write: */
.card {
  padding: 16px;
  border-radius: 8px;
}

.card .header {
  margin-bottom: 12px;
  font-weight: bold;
}

.card .header .title {
  font-size: 18px;
  color: #333;
}

/* Not: */
.card {
  padding: 16px;
  border-radius: 8px;
}
.card .header {
  margin-bottom: 12px;
  font-weight: bold;
}
```

### Naming Conventions

**Kebab-case classes**: Consistent, readable class names

```css
/* Kiro will write: */
.primary-button {
  background-color: #007bff;
}

.user-profile-card {
  border: 1px solid #ddd;
}

.is-active {
  opacity: 1;
}

/* Not: */
.primaryButton {
  background-color: #007bff;
}

.user_profile_card {
  border: 1px solid #ddd;
}

.isActive {
  opacity: 1;
}
```

### Spacing and Formatting

**Consistent spacing**: Improves readability and prevents syntax errors

```css
/* Kiro will write: */
.navigation {
  display: flex;
  gap: 16px;
}

.navigation a {
  text-decoration: none;
  color: #333;
}

.navigation a:hover {
  color: #007bff;
}

/* Not: */
.navigation {
  display: flex;
  gap: 16px;
}
.navigation a {
  text-decoration: none;
  color: #333;
}
.navigation a:hover {
  color: #007bff;
}
```

## What This Prevents

- **Layout debugging nightmares** from inconsistent property ordering
- **Syntax errors** from missing spaces around colons and braces
- **Readability issues** from inconsistent indentation
- **Naming conflicts** from mixed naming conventions
- **Maintenance headaches** from unorganized stylesheets

## Simple Examples

### Before/After: Component Styling

```css
/* Before: */
.modal {
  background: white;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 400px;
}

/* After: */
.modal {
  /* Layout */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  z-index: 1000;

  /* Visual */
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
```

## Customization

This is a starting point focused on the most common CSS formatting issues. You can extend these rules based on your project's specific needs, framework requirements, or team preferences.

## Optional: Validation with External Tools

Want to validate that generated CSS follows these standards? Add these tools:

### Quick Setup (Optional)

```bash
npm install --save-dev prettier stylelint stylelint-config-standard
```

**Note**: These tools validate the CSS after Kiro writes it, but aren't required for the steering document to work.
