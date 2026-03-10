import { describe, it, expect, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { scanFrontendCalls } from '../src/scanners/frontendScanner';

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dev-audit-test-'));
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  }
  return dir;
}

describe('scanFrontendCalls', () => {
  let tmpDir: string;

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('detects a fetch() call', async () => {
    tmpDir = createTempProject({
      'src/app.ts': `const res = await fetch('/api/users')`,
    });

    const calls = await scanFrontendCalls(tmpDir);
    expect(calls.some((c) => c.path.includes('/api/users'))).toBe(true);
  });

  it('detects an axios.get() call', async () => {
    tmpDir = createTempProject({
      'src/service.ts': `axios.get('/api/products')`,
    });

    const calls = await scanFrontendCalls(tmpDir);
    expect(calls.some((c) => c.path.includes('/api/products'))).toBe(true);
  });

  it('detects an axios.post() call', async () => {
    tmpDir = createTempProject({
      'src/service.ts': `axios.post('/api/orders', payload)`,
    });

    const calls = await scanFrontendCalls(tmpDir);
    expect(calls.some((c) => c.path.includes('/api/orders'))).toBe(true);
  });

  it('detects multiple API calls in one file', async () => {
    tmpDir = createTempProject({
      'src/api.ts': [
        `fetch('/api/users')`,
        `fetch('/api/products')`,
        `axios.delete('/api/orders/1')`,
      ].join('\n'),
    });

    const calls = await scanFrontendCalls(tmpDir);
    // At least 3 unique paths should be captured
    const paths = calls.map((c) => c.path);
    expect(paths.some((p) => p.includes('/api/users'))).toBe(true);
    expect(paths.some((p) => p.includes('/api/products'))).toBe(true);
    expect(paths.some((p) => p.includes('/api/orders'))).toBe(true);
  });

  it('returns an empty array when no API calls exist', async () => {
    tmpDir = createTempProject({
      'src/utils.ts': `export function add(a: number, b: number) { return a + b; }`,
    });

    const calls = await scanFrontendCalls(tmpDir);
    // There should be no /api/ calls in a pure utility file
    expect(calls.filter((c) => c.path.startsWith('/api/'))).toHaveLength(0);
  });

  it('records the correct file path and line number', async () => {
    tmpDir = createTempProject({
      'src/component.tsx': [`// line 1`, `const data = await fetch('/api/dashboard')`].join('\n'),
    });

    const calls = await scanFrontendCalls(tmpDir);
    const match = calls.find((c) => c.path.includes('/api/dashboard'));
    expect(match).toBeDefined();
    expect(match?.line).toBe(2);
  });
});
