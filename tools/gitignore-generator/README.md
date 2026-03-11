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

## Contributing

```bash
npm test
npm run lint
npm run format
```

Minimum coverage threshold: 80%
