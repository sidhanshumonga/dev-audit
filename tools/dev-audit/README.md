# dev-audit

A lightweight CLI toolkit for keeping your codebase clean.

## Usage

```bash
npx dev-audit <tool> [options]
```

## Tools

| Command | Description | Package |
|---|---|---|
| `dev-audit dead` | Detect backend API routes never called by frontend code | `@dev-audit/dead-api-detector` |
| `dev-audit gitignore` | Generate a tailored `.gitignore` for your stack | `@dev-audit/gitignore-generator` |
| `dev-audit mock` | Spin up a mock REST API from TypeScript types | `@dev-audit/mock-api-generator` |

## Install a tool

Each tool is an optional peer dependency. Install only what you need:

```bash
npm install -g @dev-audit/dead-api-detector
npm install -g @dev-audit/gitignore-generator
npm install -g @dev-audit/mock-api-generator
```

Or run any tool directly without installing:

```bash
npx @dev-audit/dead-api-detector scan
npx @dev-audit/gitignore-generator generate
npx @dev-audit/mock-api-generator serve --types ./src/types.ts
```

## Examples

```bash
# Detect dead API routes
dev-audit dead scan

# Generate a .gitignore
dev-audit gitignore generate --write

# Start a mock API server on port 4000
dev-audit mock serve --types ./src/types.ts --port 4000
```

If a tool is not installed, `dev-audit` will print a friendly install hint.
