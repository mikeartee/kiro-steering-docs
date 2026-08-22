---
title: "Repository Pre-Publication Audit"
description: "Guides Kiro to audit a repository for credentials, machine-specific detail, and identity leaks before it is made public — including what is only in the history"
category: "security"
tags: ["security", "secrets", "git-history", "open-source", "publishing"]
author: "ArcticFox2029"
version: "1.0.0"
kiro_version: ">=1.0.0"
dependencies: []
file_references: []
inclusion: manual
---

## Core Principle

Making a repository public is a one-way action: everything in it, including every commit that has
ever been reachable, becomes available to anyone and to every mirror bot within minutes. This
document has Kiro audit what is actually about to be published — the history as well as the working
tree — instead of glancing at the files currently checked out.

## How Kiro Will Audit a Repository

### Credentials — scan the history, not only the checkout

**Rule**: A tree-only scan reports a leaking repository as clean. A credential deleted in a later
commit is still served by the GitHub API from the commit that held it.

```bash
# Kiro will run BOTH. The tree:
grep -rInE 'AKIA[A-Z0-9]{16}|sk_live_[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{30,}|glpat-[A-Za-z0-9_-]{20,}|SG\.[A-Za-z0-9]{20,}\.|xox[baprs]-[0-9]{6,}|sk-ant-api03-|AC[0-9a-f]{32}|hooks\.slack\.com/services/T' .
grep -rIn -- '-----BEGIN [A-Z ]*PRIVATE KEY-----' .

# And every reachable commit:
REVS=$(git rev-list --all)
git grep -InE 'AKIA[A-Z0-9]{16}|sk_live_[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{30,}|glpat-[A-Za-z0-9_-]{20,}|SG\.[A-Za-z0-9]{20,}\.|xox[baprs]-[0-9]{6,}|sk-ant-api03-|AC[0-9a-f]{32}' $REVS -- .
git grep -In -- '-----BEGIN [A-Z ]*PRIVATE KEY-----' $REVS -- .

# Not: the tree scan alone, then reporting the repository clean.
```

History output is `<commit>:<path>:<line>:<match>`, so a hit names the commit to rewrite. On a large
repository this reads every revision of every file; scope it with `-- <path>` or
`git rev-list -n 500 --all` when a full sweep is too slow — and say in the report which was run. A
partial sweep described as a full one is worse than no sweep.

**Finding one is not the end of the work.** A key that has been public is burned regardless of what
happens to the history: rotate it first, then rewrite. Rewriting alone leaves a live key in every
clone and cache that already has it.

### Credential-shaped test fixtures

**Rule**: A fake key in a test fixture is treated exactly as a real one by automated scanning. "It
is not a real key" is no defence to a push-protection block, and some providers are notified of the
match regardless.

```bash
# Kiro will recommend: a placeholder in the repository, plus a seeded local generator
#   fixtures/secrets.template   →  api_key = "__PLANTED_AWS__"
#   tools/plant_secrets.py --seed 20260820  →  fills them in locally, reversible
# Not: weakening the fixture until the scanner stops noticing, which weakens the test too.
```

Two people running a seeded generator get the same fixture, so the test stays deterministic while
the published tree carries nothing that matches a credential pattern. Verify the generator is a true
inverse — plant, revert, and diff twice; a substitution that nests on each round is a real and easy
mistake.

### Machine-specific and organisation-specific detail

**Rule**: These leak quietly. Nothing blocks them and nobody notices until the repository is public.
A path like `/Users/firstname.lastname/` publishes a full legal name; an internal hostname publishes
network topology.

```bash
# Kiro will write:
grep -rInE '/Users/[a-z0-9_.-]+/|/home/[a-z0-9_.-]+/|C:\\+Users\\+' .
grep -rInE '\.(internal|corp|local|lan)\b|10\.[0-9]+\.[0-9]+\.[0-9]+|192\.168\.' .

# Not:
grep -rInE 'C:\\\\Users\\\\' .
```

The second form is wrong in a way that looks right: in an ERE `\\` is one literal backslash, so
`\\\\` matches two. It hits an already-escaped string such as `"C:\\Users\\name"` and misses the
real `C:\Users\name` the check exists to find. `\\+` matches one backslash or several, so a raw path
and a JSON-escaped one both hit.

### Author identity in the history

**Rule**: `git log` publishes every author name and email ever committed, including addresses from
a machine the author no longer uses and identities they did not mean to attach to this project.

```bash
# Kiro will write:
git log --all --format='%an <%ae>' | sort | uniq -c | sort -rn

# Not: checking `git config user.email` and assuming the history matches it.
```

Report every distinct identity and let the author decide. Changing them means rewriting history, so
it is a decision to surface before publication, not after.

## What This Prevents

- A live credential published in a commit that the working tree no longer contains
- Push protection rejecting the first push, after the repository is already created and announced
- A partner provider being notified of a key match — some scanners forward to the issuer
- A contributor's legal name or employer inferred from a home-directory path
- Internal hostnames and private address ranges disclosing network layout
- An unintended author identity permanently attached to a public history

## Customization

The credential patterns are the common shapes, not a complete set. Add the ones your organisation
issues — an internal token prefix is exactly the kind a general scanner does not know. Keep them
longest-first and anchored enough not to match ordinary prose.

For repositories that legitimately publish credential-shaped material (a scanner's own corpus, a
redaction test), invert the default: the fixtures live as placeholders and a seeded generator fills
them in locally, as above.

## Troubleshooting

**Issue**: The history scan takes many minutes on a large repository.
**Solution**: Scope it — `git grep … $REVS -- src/` or `git rev-list -n 500 --all`. State the scope
in the report rather than presenting a partial sweep as a complete one.

**Issue**: The grep flags a base64 blob or a minified bundle on every run.
**Solution**: `grep -I` already skips binary files; for text bundles exclude the path explicitly
rather than loosening the pattern, which would blind the check everywhere else.

**Issue**: A finding is a fixture, not a real credential.
**Solution**: It still blocks the push and may still notify the provider. Replace it with a
placeholder plus a seeded generator; do not add an exception to the scanner.

## Contributing

Found an improvement or issue with this steering document? Please:

1. Test your changes against a repository with a real history, not only a fresh checkout

2. Verify every command by running it — the Windows pattern above shipped broken precisely because
   it was reviewed by reading rather than by running

3. Submit a pull request with clear description of changes
