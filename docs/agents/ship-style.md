# Ship style: pull request

Every change reaches the default branch through a pull request — never push directly.

## Conventions

- Create a feature branch before committing if on the default branch. Branch names should reference the issue.
- Open a PR with a closing keyword referencing the issue this work resolves (e.g. `Closes #123` in the PR body). The issue closes on merge — and if it's a sub-issue, the parent auto-closes once its last child closes.
- Confirm the PR title and body with the user before creating.
- Do not merge. Leave that to the human.

## When a skill says "ship the change"

1. Create a feature branch (if on the default branch).
2. Commit and push.
3. Open a PR with `Closes #<issue>` in the body.
4. Stop — do not merge.
