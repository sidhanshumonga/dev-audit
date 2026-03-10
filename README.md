# dev-audit

A lightweight CLI tool for keeping your codebase clean and well-structured.

dev-audit helps developers detect dead API endpoints, generate smart `.gitignore` files, and spin up mock APIs from TypeScript types — all running entirely on your local machine.

## Features

- **Dead API Detector** — finds backend routes that are never called by your frontend
- **Smart Gitignore Generator** — generates a tailored `.gitignore` based on your project stack
- **Mock API Generator** — spins up a mock server from your TypeScript types

## Installation

```bash
npx dev-audit
```

Or install globally:

```bash
npm install -g dev-audit
```

## Usage

```bash
# Run a full scan
dev-audit scan

# Generate a .gitignore
dev-audit gitignore

# Spin up a mock API server
dev-audit mock
```

## Repository Structure

```
dev-audit/
├── tools/
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
