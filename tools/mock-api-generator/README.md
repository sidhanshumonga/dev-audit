# mock-api-generator

Parses TypeScript type definitions and spins up a mock REST API server with realistic fake data. Useful when the backend isn't ready yet.

## Usage

```bash
# Start a mock server from a TypeScript types file
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

## Installation

```bash
cd tools/mock-api-generator
npm install
npm run build
```

## Development

```bash
npm run dev -- serve --types ./path/to/types.ts
npm test
npm run lint
npm run format
```

Minimum coverage threshold: 80%
