---
title: "Bash Scripting Standards"
description: "Guides Kiro to write safe, readable Bash scripts with proper error handling"
category: "code-quality"
tags: ["bash", "shell", "scripting", "linux"]
inclusion: always
---

## Core Principle

**Kiro writes safe, readable Bash scripts with proper error handling, quoting, and structure.**

## How Kiro Will Write Bash

### Script Header

**Use proper shebang and set options**: Enable strict mode for safety

```bash
# Kiro will write:
#!/usr/bin/env bash
set -euo pipefail

# Script description here
# Usage: ./script.sh [options]

# Not:
#!/bin/bash
# No error handling
```

### Variable Quoting

**Always quote variables**: Prevent word splitting and globbing issues

```bash
# Kiro will write:
name="John Doe"
echo "Hello, ${name}"

file_path="/path/to/file.txt"
if [[ -f "${file_path}" ]]; then
  cat "${file_path}"
fi

# Not:
name=John Doe
echo Hello, $name

file_path=/path/to/file.txt
if [ -f $file_path ]; then
  cat $file_path
fi
```

### Function Definition

**Clear function structure**: Use function keyword and proper naming

```bash
# Kiro will write:
function check_dependencies() {
  local required_cmd="$1"
  
  if ! command -v "${required_cmd}" &> /dev/null; then
    echo "Error: ${required_cmd} is not installed" >&2
    return 1
  fi
  
  return 0
}

function main() {
  check_dependencies "git" || exit 1
  echo "All dependencies satisfied"
}

main "$@"

# Not:
check_deps() {
  if ! command -v $1 &> /dev/null; then
    echo "Error: $1 is not installed"
    return 1
  fi
}

check_deps git
echo "All dependencies satisfied"
```

### Error Handling

**Check command success**: Handle errors explicitly

```bash
# Kiro will write:
function backup_file() {
  local source="$1"
  local dest="$2"
  
  if [[ ! -f "${source}" ]]; then
    echo "Error: Source file does not exist: ${source}" >&2
    return 1
  fi
  
  if ! cp "${source}" "${dest}"; then
    echo "Error: Failed to copy ${source} to ${dest}" >&2
    return 1
  fi
  
  echo "Successfully backed up ${source} to ${dest}"
  return 0
}

# Not:
backup_file() {
  cp $1 $2
  echo "Backed up $1 to $2"
}
```

## What This Prevents

- Script failures from unhandled errors
- Word splitting bugs from unquoted variables
- Globbing issues in file paths
- Silent failures that are hard to debug
- Unsafe script execution

## Customization

This is a starting point! You can modify these rules by editing this steering document:

- Adjust `set` options based on your needs
- Change function naming conventions
- Modify error handling patterns
- Add project-specific requirements

## Optional: Validation with External Tools

Want to validate that generated Bash scripts follow these standards? Add these tools:

### Quick Setup (Optional)

```bash
# Install shellcheck
apt-get install shellcheck  # Debian/Ubuntu
brew install shellcheck     # macOS
```

### Usage

```bash
shellcheck script.sh
```

**Note**: These tools validate the Bash scripts after Kiro writes them, but aren't required for the steering document to work.
