---
title: "Dockerfile Best Practices"
description: "Guides Kiro to write optimized, secure Dockerfiles with proper layer management"
category: "code-formatting"
tags: ["docker", "dockerfile", "containers", "devops"]
inclusion: always
---

## Core Principle

**Kiro writes efficient, secure Dockerfiles that optimize layer caching and follow container best practices.**

## How Kiro Will Write Dockerfiles

### Base Image Selection

**Use specific tags**: Always specify exact versions, never use `latest`

```dockerfile
# Kiro will write:
FROM node:18-alpine
FROM python:3.11-slim

# Not:
FROM node:latest
FROM python
```

### Layer Optimization

**Order instructions by change frequency**: Least changing first, most changing last

```dockerfile
# Kiro will write:
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]

# Not:
FROM node:18-alpine
COPY . .
RUN npm install
CMD ["node", "server.js"]
```

### Multi-line Commands

**Use backslashes for readability**: Break long RUN commands into multiple lines

```dockerfile
# Kiro will write:
RUN apt-get update && \
    apt-get install -y \
      curl \
      git \
      vim && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Not:
RUN apt-get update && apt-get install -y curl git vim && apt-get clean && rm -rf /var/lib/apt/lists/*
```

### Security Practices

**Run as non-root user**: Create and use non-privileged user

```dockerfile
# Kiro will write:
FROM node:18-alpine

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app
COPY --chown=nodejs:nodejs . .

USER nodejs

CMD ["node", "server.js"]

# Not:
FROM node:18-alpine
WORKDIR /app
COPY . .
CMD ["node", "server.js"]
```

## What This Prevents

- Large image sizes from poor layer caching
- Security vulnerabilities from running as root
- Slow builds from inefficient layer ordering
- Unpredictable behavior from using `latest` tags
- Build cache invalidation from poor COPY ordering

## Customization

This is a starting point! You can modify these rules by editing this steering document:

- Adjust base image preferences
- Change user/group IDs
- Modify security requirements
- Add project-specific build steps

## Optional: Validation with External Tools

Want to validate that generated Dockerfiles follow these standards? Add these tools:

### Quick Setup (Optional)

```bash
# Install hadolint for Dockerfile linting
docker pull hadolint/hadolint

# Or install locally
brew install hadolint  # macOS
```

### Usage

```bash
hadolint Dockerfile
```

**Note**: These tools validate the Dockerfile after Kiro writes it, but aren't required for the steering document to work.
