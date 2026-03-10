import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { scanRoutes } from '../src/scanners/routeScanner';

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dev-audit-test-'));
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  }
  return dir;
}

describe('scanRoutes — Express', () => {
  let tmpDir: string;

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('detects a GET route', async () => {
    tmpDir = createTempProject({
      'src/server.ts': `app.get('/api/users', handler)`,
    });

    const routes = await scanRoutes(tmpDir, 'express');
    expect(routes).toContainEqual(
      expect.objectContaining({ method: 'GET', path: '/api/users' })
    );
  });

  it('detects a POST route', async () => {
    tmpDir = createTempProject({
      'src/server.ts': `app.post('/api/payments', handler)`,
    });

    const routes = await scanRoutes(tmpDir, 'express');
    expect(routes).toContainEqual(
      expect.objectContaining({ method: 'POST', path: '/api/payments' })
    );
  });

  it('detects multiple routes in the same file', async () => {
    tmpDir = createTempProject({
      'src/routes.ts': [
        `app.get('/api/users', handler)`,
        `app.post('/api/users', handler)`,
        `app.delete('/api/users/:id', handler)`,
      ].join('\n'),
    });

    const routes = await scanRoutes(tmpDir, 'express');
    expect(routes).toHaveLength(3);
  });

  it('detects routes across different HTTP verbs', async () => {
    tmpDir = createTempProject({
      'src/routes.ts': [
        `app.get('/api/items', handler)`,
        `app.put('/api/items/:id', handler)`,
        `app.patch('/api/items/:id', handler)`,
        `app.delete('/api/items/:id', handler)`,
      ].join('\n'),
    });

    const routes = await scanRoutes(tmpDir, 'express');
    const methods = routes.map((r) => r.method);
    expect(methods).toContain('GET');
    expect(methods).toContain('PUT');
    expect(methods).toContain('PATCH');
    expect(methods).toContain('DELETE');
  });

  it('returns an empty array when no routes are defined', async () => {
    tmpDir = createTempProject({
      'src/utils.ts': `export function helper() {}`,
    });

    const routes = await scanRoutes(tmpDir, 'express');
    expect(routes).toHaveLength(0);
  });
});

describe('scanRoutes — Next.js', () => {
  let tmpDir: string;

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('detects pages router API route', async () => {
    tmpDir = createTempProject({
      'pages/api/users.ts': `export default function handler(req, res) {}`,
    });

    const routes = await scanRoutes(tmpDir, 'nextjs');
    expect(routes).toContainEqual(
      expect.objectContaining({ path: '/api/users' })
    );
  });

  it('detects app router GET route', async () => {
    tmpDir = createTempProject({
      'app/api/products/route.ts': `export async function GET(req) {}`,
    });

    const routes = await scanRoutes(tmpDir, 'nextjs');
    expect(routes).toContainEqual(
      expect.objectContaining({ method: 'GET', path: '/api/products' })
    );
  });

  it('detects multiple HTTP methods from a single app router route file', async () => {
    tmpDir = createTempProject({
      'app/api/orders/route.ts': [
        'export async function GET(req) {}',
        'export async function POST(req) {}',
      ].join('\n'),
    });

    const routes = await scanRoutes(tmpDir, 'nextjs');
    const methods = routes.map((r) => r.method);
    expect(methods).toContain('GET');
    expect(methods).toContain('POST');
  });
});
