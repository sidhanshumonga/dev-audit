# @dev-audit/mock-api-generator

Parses TypeScript type definitions and spins up a mock REST API server with realistic fake data. Useful when the backend isn't ready yet.

## Usage

**Via the full dev-audit suite (recommended):**

```bash
npx dev-audit mock serve --types ./src/types.ts
npx dev-audit mock serve --types ./src/types.ts --port 4000
```

**Or run without installing:**

```bash
npx @dev-audit/mock-api-generator serve --types ./src/types.ts
```

**Or install globally:**

```bash
npm install -g @dev-audit/mock-api-generator
dev-audit-mock serve --types ./src/types.ts --port 4000
```

Given a type like:

```ts
type User = {
  id: string;
  name: string;
  email: string;
  age: number;
  active: boolean;
};
```

The server exposes:

```
GET  /users        — list of users
POST /users        — create (echoes back a fake user)
GET  /users/:id    — single user by id
```

## Contributing

```bash
npm test
npm run lint
npm run format
```

Minimum coverage threshold: 80%
