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

## How it works

- Scans backend route definitions (Express, Next.js, NestJS)
- Scans frontend code for `fetch()`, `axios`, and template literal API calls
- Matches dynamic segments: `/api/users/:id` matches `fetch(\`/api/users/${id}\`)`
- Auto-ignores Vercel cron routes defined in `vercel.json`
- Prints inline hints for routes that look externally-called (webhooks, crons, OAuth callbacks)

## Suppressing false positives

Some routes are called externally (webhooks, cron schedulers, manual scripts) and will never appear as `fetch()` calls in your source. The tool will flag these with a hint:

```
→ POST    /api/stripe/webhook
           ↳ tip: webhooks are called by external services — add to ignoreEndpoints if intentional
```

To permanently suppress them, add to `dev-audit.config.json`:

```json
{
  "ignoreEndpoints": [
    "/api/stripe/webhook",
    "/api/cron/*"
  ]
}
```

Wildcards are supported — `/api/cron/*` suppresses all routes under that prefix.

**Vercel cron routes** are auto-ignored without any config — the tool reads `vercel.json` automatically.

## Configuration

Create a `dev-audit.config.json` in your project root:

```json
{
  "ignoreDirectories": ["node_modules", ".next", "dist"],
  "framework": "auto",
  "ignoreEndpoints": ["/api/stripe/webhook", "/api/cron/*"]
}
```

| Option | Default | Description |
|---|---|---|
| `ignoreDirectories` | `["node_modules", ".next", "dist", "build", ".git"]` | Directories to skip when scanning |
| `framework` | `"auto"` | Force a framework: `express`, `nextjs`, `nestjs` |
| `ignoreEndpoints` | `[]` | Routes to suppress — supports `*` wildcards |

## Contributing

```bash
npm test
npm run lint
npm run format
```

Minimum coverage threshold: 80%
