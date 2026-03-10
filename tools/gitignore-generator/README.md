# gitignore-generator

Detects your project stack and generates a tailored `.gitignore` file.

## Supported Stack Detection

- Node.js
- Next.js
- Python
- Docker
- Terraform
- Go
- Rust
- Java / Maven / Gradle

## Installation

```bash
cd tools/gitignore-generator
npm install
npm run build
```

## Usage

```bash
# Preview the generated .gitignore (dry run)
dev-audit-gitignore generate --path /path/to/your/project

# Write the .gitignore to disk
dev-audit-gitignore generate --path /path/to/your/project --write
```

## Configuration

Create a `dev-audit.config.json` in your project root to customise behaviour:

```json
{
  "ignoreDirectories": ["node_modules", ".next", "dist"],
  "framework": "auto"
}
```

## Development

```bash
npm run dev
npm test
npm run lint
npm run format
```

Minimum coverage threshold: 80%
