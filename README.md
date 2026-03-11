# dev-audit

A lightweight CLI tool for keeping your codebase clean and well-structured.

dev-audit helps developers detect dead API endpoints, generate smart `.gitignore` files, and spin up mock APIs from TypeScript types — all running entirely on your local machine.

## Features

- **Dead API Detector** — finds backend routes that are never called by your frontend
- **Smart Gitignore Generator** — generates a tailored `.gitignore` based on your project stack
- **Mock API Generator** — spins up a mock server from your TypeScript types

## Installation

No install required — run any tool instantly with `npx`:

```bash
npx dev-audit dead scan
npx dev-audit gitignore generate --write
npx dev-audit mock serve --types ./src/types.ts
```

Or install globally:

```bash
npm install -g dev-audit
```

## Usage

```bash
# Detect dead API endpoints
dev-audit dead scan

# Generate a tailored .gitignore
dev-audit gitignore generate --write

# Spin up a mock API server from TypeScript types
dev-audit mock serve --types ./src/types.ts
```

Individual tools can also be run directly:

```bash
npx @dev-audit/dead-api-detector scan
npx @dev-audit/gitignore-generator generate --write
npx @dev-audit/mock-api-generator serve --types ./src/types.ts
```

## Repository Structure

```
dev-audit/
├── tools/
│   ├── dev-audit/           # Meta-package CLI router
│   ├── dead-api-detector/
│   ├── gitignore-generator/
│   └── mock-api-generator/
└── website/
```

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

## Security

To report a security vulnerability, see [SECURITY.md](./SECURITY.md).

## License

[MIT](./LICENSE)
