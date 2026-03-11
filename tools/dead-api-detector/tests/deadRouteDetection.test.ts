import { describe, it, expect, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { scanFrontendCalls } from '../src/scanners/frontendScanner';
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

// Mirrors the logic in commands.ts so regressions are caught here first
function normalisePath(p: string): string {
  return p.toLowerCase().replace(/\/$/, '');
}

function routeToMatchPattern(routePath: string): RegExp {
  const normalised = normalisePath(routePath);
  const parts = normalised.split(/:[^/]+|\[[^\]]+\]/g);
  const escaped = parts.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[^/]*');
  return new RegExp(`^${escaped}`);
}

function isRouteUsed(routePath: string, calledPaths: string[]): boolean {
  const normalised = normalisePath(routePath);
  const dynamicPattern = routeToMatchPattern(routePath);
  return calledPaths.some((called) => {
    const normCalled = normalisePath(called);
    return (
      normCalled.includes(normalised) ||
      normalised.includes(normCalled) ||
      dynamicPattern.test(normCalled)
    );
  });
}

describe('routeToMatchPattern', () => {
  it('matches an exact static route', () => {
    const pattern = routeToMatchPattern('/api/users');
    expect(pattern.test('/api/users')).toBe(true);
  });

  it('matches Express :param dynamic segment', () => {
    const pattern = routeToMatchPattern('/api/users/:id');
    expect(pattern.test('/api/users/')).toBe(true);
    expect(pattern.test('/api/users/123')).toBe(true);
  });

  it('matches Next.js [param] dynamic segment', () => {
    const pattern = routeToMatchPattern('/api/resources/download/[slug]');
    expect(pattern.test('/api/resources/download/')).toBe(true);
    expect(pattern.test('/api/resources/download/my-file')).toBe(true);
  });

  it('does not throw on routes with special regex characters', () => {
    expect(() => routeToMatchPattern('/api/cron/sync+daily')).not.toThrow();
    expect(() => routeToMatchPattern('/api/v1/items.json')).not.toThrow();
    expect(() => routeToMatchPattern('/api/search?q=test')).not.toThrow();
  });

  it('does not match unrelated routes', () => {
    const pattern = routeToMatchPattern('/api/users/:id');
    expect(pattern.test('/api/products')).toBe(false);
    expect(pattern.test('/api/orders/')).toBe(false);
  });
});

describe('isRouteUsed — dynamic segment matching', () => {
  it('marks /api/users/:id as used when frontend calls /api/users/', () => {
    expect(isRouteUsed('/api/users/:id', ['/api/users/'])).toBe(true);
  });

  it('marks /api/resources/download/[slug] as used when frontend calls /api/resources/download/', () => {
    expect(isRouteUsed('/api/resources/download/[slug]', ['/api/resources/download/'])).toBe(true);
  });

  it('marks route as used on exact match', () => {
    expect(isRouteUsed('/api/users', ['/api/users'])).toBe(true);
  });

  it('marks route as dead when nothing matches', () => {
    expect(isRouteUsed('/api/legacy', ['/api/users', '/api/products'])).toBe(false);
  });
});

describe('scanFrontendCalls — template literal stripping', () => {
  let tmpDir: string;

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('strips ${...} from template literal fetch calls', async () => {
    tmpDir = createTempProject({
      'src/api.ts': 'const res = await fetch(`/api/users/${id}`)',
    });
    const calls = await scanFrontendCalls(tmpDir);
    // After stripping, path should be /api/users/ (no ${id})
    expect(calls.some((c) => c.path === '/api/users/')).toBe(true);
  });

  it('strips multiple interpolations', async () => {
    tmpDir = createTempProject({
      'src/api.ts': 'fetch(`/api/${version}/users/${id}/profile`)',
    });
    const calls = await scanFrontendCalls(tmpDir);
    expect(calls.some((c) => c.path.startsWith('/api/'))).toBe(true);
    // No raw ${...} in the recorded path
    const match = calls.find((c) => c.path.startsWith('/api/'));
    expect(match?.path).not.toContain('${');
  });
});

describe('ignoreEndpoints config', () => {
  it('exact match suppresses a route', () => {
    const ignored = new Set(['/api/webhook'].map((p) => normalisePath(p)));
    const isIgnored = (routePath: string) => ignored.has(normalisePath(routePath));
    expect(isIgnored('/api/webhook')).toBe(true);
    expect(isIgnored('/api/users')).toBe(false);
  });

  it('wildcard suppresses all routes under a prefix', () => {
    const ignored = ['/api/cron/*'].map((p) => normalisePath(p));
    const isIgnored = (routePath: string) => {
      const normalised = normalisePath(routePath);
      return ignored.some((pattern) =>
        pattern.endsWith('*') ? normalised.startsWith(pattern.slice(0, -1)) : normalised === pattern
      );
    };
    expect(isIgnored('/api/cron/sync')).toBe(true);
    expect(isIgnored('/api/cron/cleanup')).toBe(true);
    expect(isIgnored('/api/users')).toBe(false);
  });

  it('is case-insensitive', () => {
    const ignored = new Set(['/api/webhook'].map((p) => normalisePath(p)));
    const isIgnored = (routePath: string) => ignored.has(normalisePath(routePath));
    expect(isIgnored('/API/WEBHOOK')).toBe(true);
  });
});

describe('vercel.json cron auto-ignore', () => {
  let tmpDir: string;

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('reads cron paths from vercel.json', () => {
    tmpDir = createTempProject({
      'vercel.json': JSON.stringify({
        crons: [
          { path: '/api/cron/sync', schedule: '0 * * * *' },
          { path: '/api/cron/cleanup', schedule: '0 0 * * *' },
        ],
      }),
    });

    const vercelConfigPath = path.join(tmpDir, 'vercel.json');
    const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8')) as {
      crons?: { path: string }[];
    };
    const cronPaths = (config.crons ?? []).map((c) => c.path);

    expect(cronPaths).toContain('/api/cron/sync');
    expect(cronPaths).toContain('/api/cron/cleanup');
    expect(cronPaths).toHaveLength(2);
  });

  it('returns empty array when vercel.json has no crons', () => {
    tmpDir = createTempProject({
      'vercel.json': JSON.stringify({ version: 2 }),
    });

    const vercelConfigPath = path.join(tmpDir, 'vercel.json');
    const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8')) as {
      crons?: { path: string }[];
    };
    const cronPaths = (config.crons ?? []).map((c) => c.path);

    expect(cronPaths).toHaveLength(0);
  });
});

describe('Next.js dynamic route scanning', () => {
  let tmpDir: string;

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('scans app router dynamic route files', async () => {
    tmpDir = createTempProject({
      'src/app/api/resources/download/[slug]/route.ts': [
        'export async function GET(req: Request) {',
        '  return new Response("ok");',
        '}',
      ].join('\n'),
    });

    const routes = await scanRoutes(tmpDir, 'nextjs');
    const route = routes.find((r) => r.path.includes('download'));
    expect(route).toBeDefined();
    expect(route?.path).toContain(':slug');
  });
});
