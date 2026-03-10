# dead-api-detector

Detects backend API routes that are defined but never called by your frontend code.

## Supported Frameworks

- Express
- Next.js (pages/api and app/api routes)
- NestJS

## Installation

```bash
cd tools/dead-api-detector
npm install
npm run build
```

## Usage

```bash
# Run from your project root
dev-audit dead scan --path /path/to/your/project
```

## Configuration

Create a `"dev-audit.config.json"` in your project root to customize behavior:

```json
{
  "ignoreDirectories": ["node_modules", ".next", "dist"],
  "framework": "auto"
}
```

## Development

```bash
npm run dev       # run with ts-node
npm test          # run tests
npm run lint      # lint
npm run format    # format with prettier
```

## Testing

```bash
npm test
npm run test:coverage
```

Minimum coverage threshold: 80%
