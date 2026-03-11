# @dev-audit/gitignore-generator

Detects your project stack and generates a tailored `.gitignore` file automatically.

## Supported Stacks

- Node.js
- Next.js
- Python
- Docker
- Terraform
- Go
- Rust
- Java / Maven / Gradle

Multi-stack projects are handled automatically — a Next.js project gets both the Next.js and Node.js entries combined.

## Usage

**Via the full dev-audit suite (recommended):**

```bash
# Preview the generated .gitignore (dry run)
npx dev-audit gitignore generate

# Write the .gitignore to disk
npx dev-audit gitignore generate --write
```

**Or run without installing:**

```bash
npx @dev-audit/gitignore-generator generate --write
```

**Or install globally:**

```bash
npm install -g @dev-audit/gitignore-generator
dev-audit-gitignore generate --write
```

## What gets generated

For a Next.js project the output includes:

```gitignore
# Next.js
.next/
out/
.vercel
next-env.d.ts
*.pem

# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
dist/
build/
coverage/
*.tsbuildinfo
.env*
!.env.example

# OS
.DS_Store
Thumbs.db

# Editors
.vscode/
.idea/
```

`.env*` covers all env files while `!.env.example` keeps your example file tracked.
OS and editor entries (`.DS_Store`, `.vscode/`, `.idea/`) are always appended regardless of stack.

## How stack detection works

The tool checks for well-known indicator files at the project root:

| Stack | Detected by |
|---|---|
| Next.js | `next` in `package.json` deps, `next.config.js/ts` |
| Node.js | `package.json` present |
| Python | `requirements.txt`, `Pipfile`, `pyproject.toml`, `setup.py` |
| Docker | `Dockerfile`, `docker-compose.yml` |
| Terraform | `main.tf`, `terraform/` directory |
| Go | `go.mod` |
| Rust | `Cargo.toml` |
| Java | `pom.xml`, `build.gradle` |

## Contributing

```bash
npm test
npm run lint
npm run format
```

Minimum coverage threshold: 80%
