import express, { Request, Response } from 'express';
import { ParsedType } from '../parser/typeParser';
import { generateList, generateObject } from '../generator/dataGenerator';

// Converts a PascalCase type name to a lowercase plural URL segment.
// e.g. "UserProfile" → "userprofiles", "Order" → "orders"
function toRouteSegment(typeName: string): string {
  return typeName.toLowerCase() + 's';
}

// Registers CRUD-style routes for a single parsed type.
// GET  /<resource>        — returns a list of fake objects
// POST /<resource>        — echoes back a freshly generated fake object
// GET  /<resource>/:id    — returns a single fake object (id is ignored, data is generated)
function registerRoutes(app: express.Application, parsedType: ParsedType): void {
  const segment = toRouteSegment(parsedType.name);

  app.get(`/${segment}`, (_req: Request, res: Response) => {
    res.json(generateList(parsedType, 5));
  });

  app.post(`/${segment}`, (_req: Request, res: Response) => {
    res.status(201).json(generateObject(parsedType));
  });

  app.get(`/${segment}/:id`, (_req: Request, res: Response) => {
    res.json(generateObject(parsedType));
  });
}

export interface ServerOptions {
  port: number;
  parsedTypes: ParsedType[];
}

// Builds and starts an Express server that mocks all the provided types.
// Returns the server instance so callers can stop it programmatically.
export function startServer(options: ServerOptions): ReturnType<express.Application['listen']> {
  const app = express();
  app.use(express.json());

  // Register a route group for every type that was parsed
  for (const parsedType of options.parsedTypes) {
    registerRoutes(app, parsedType);
  }

  // Health check endpoint so callers can verify the server is running
  app.get('/__health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  return app.listen(options.port);
}

// Exported for testing — lets tests inspect what route segments would be used
// without needing to spin up an actual server.
export { toRouteSegment };
