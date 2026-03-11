# @dev-audit/dead-api-detector

Detects backend API routes that are defined but never called by your frontend code.

## Supported Frameworks

- Express
- Next.js (pages/api and app/api routes)
- NestJS

## Usage

**Via the full dev-audit suite (recommended):**

```bash
npx dev-audit dead scan
npx dev-audit dead scan --path /path/to/your/project
```

**Or run without installing:**

```bash
npx @dev-audit/dead-api-detector scan
```

**Or install globally:**

```bash
npm install -g @dev-audit/dead-api-detector
dev-audit-dead scan
```

## Configuration

Create a `dev-audit.config.json` in your project root to customise behaviour:

```json
{
  "ignoreDirectories": ["node_modules", ".next", "dist"],
  "framework": "auto"
}
```

## Contributing

```bash
npm test
npm run lint
npm run format
```

Minimum coverage threshold: 80%
