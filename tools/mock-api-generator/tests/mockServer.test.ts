import { describe, it, expect, afterEach } from 'vitest';
import http from 'http';
import { startServer, toRouteSegment } from '../src/server/mockServer';
import { ParsedType } from '../src/parser/typeParser';

const userType: ParsedType = {
  name: 'User',
  properties: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'email', type: 'string' },
  ],
};

// Simple helper to make an HTTP GET request and return the parsed JSON body.
function get(port: number, path: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:${port}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error('Invalid JSON: ' + data));
        }
      });
    });
    req.on('error', reject);
  });
}

describe('toRouteSegment', () => {
  it('lowercases and pluralises a type name', () => {
    expect(toRouteSegment('User')).toBe('users');
    expect(toRouteSegment('Order')).toBe('orders');
    expect(toRouteSegment('ProductVariant')).toBe('productvariants');
  });
});

describe('startServer', () => {
  let server: ReturnType<typeof startServer>;

  afterEach(() => {
    server?.close();
  });

  it('starts on the given port and responds to health check', async () => {
    server = startServer({ port: 14001, parsedTypes: [userType] });
    const result = await get(14001, '/__health');
    expect(result).toEqual({ status: 'ok' });
  });

  it('GET /<resource> returns an array', async () => {
    server = startServer({ port: 14002, parsedTypes: [userType] });
    const result = await get(14002, '/users');
    expect(Array.isArray(result)).toBe(true);
  });

  it('GET /<resource> returns 5 items by default', async () => {
    server = startServer({ port: 14003, parsedTypes: [userType] });
    const result = await get(14003, '/users') as unknown[];
    expect(result).toHaveLength(5);
  });

  it('GET /<resource>/:id returns a single object', async () => {
    server = startServer({ port: 14004, parsedTypes: [userType] });
    const result = await get(14004, '/users/abc-123') as Record<string, unknown>;
    expect(typeof result).toBe('object');
    expect(Array.isArray(result)).toBe(false);
  });

  it('returned objects contain the expected properties', async () => {
    server = startServer({ port: 14005, parsedTypes: [userType] });
    const list = await get(14005, '/users') as Record<string, unknown>[];
    expect(list[0]).toHaveProperty('id');
    expect(list[0]).toHaveProperty('name');
    expect(list[0]).toHaveProperty('email');
  });
});
