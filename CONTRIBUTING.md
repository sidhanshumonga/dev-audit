# Contributing to dev-audit

Thanks for your interest in contributing. This guide covers everything you need to get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Running Tests](#running-tests)

---

## Code of Conduct

By participating in this project you agree to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md).

---

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/dev-audit.git
   cd dev-audit
   ```
3. Navigate to the tool you want to work on:
   ```bash
   cd tools/dead-api-detector
   npm install
   ```
4. Create a new branch for your change (see [Branch Naming](#branch-naming))
5. Make your changes
6. Run tests before submitting
7. Open a pull request against `main`

---

## Branch Naming

Use the following format:

```
<type>/<short-description>
```

Examples:

- `feat/detect-nestjs-routes`
- `fix/false-positive-on-dynamic-routes`
- `docs/update-readme`
- `chore/upgrade-typescript`

Types: `feat`, `fix`, `docs`, `chore`, `test`, `refactor`

---

## Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

Format:

```
<type>(<scope>): <short description>
```

Examples:

```
feat(dead-api): add support for NestJS route detection
fix(scanner): handle dynamic route segments correctly
docs(readme): add installation instructions
```

Keep the subject line under 72 characters. Use the body to explain _why_ a change was made if it is not obvious.

---

## Pull Request Process

1. Ensure all tests pass locally before opening a PR
2. Fill out the pull request template completely
3. Link any related issues using `Closes #<issue-number>`
4. Keep PRs focused — one feature or fix per PR
5. A maintainer will review your PR and may request changes
6. Once approved, a maintainer will merge it

---

## Coding Standards

- **Language:** TypeScript (strict mode)
- **Formatter:** Prettier — run `npm run format` before committing
- **Linter:** ESLint — run `npm run lint` to check for issues
- **Comments:** Explain _why_, not _what_. Keep comments concise and in plain English.
- **No unnecessary dependencies** — justify any new package additions in the PR description

---

## Running Tests

Each tool has its own test suite:

```bash
cd tools/dead-api-detector
npm test
```

Minimum coverage requirement is **80%**. Do not open a PR that drops coverage below this threshold.

---

## Reporting Bugs

Use the [bug report template](/.github/ISSUE_TEMPLATE/bug_report.md) when opening an issue.

## Suggesting Features

Use the [feature request template](/.github/ISSUE_TEMPLATE/feature_request.md).
