import { describe, it, expect } from 'vitest';
import { parseTypesFromSource } from '../src/parser/typeParser';

describe('parseTypesFromSource', () => {
  it('parses a simple type alias', () => {
    const source = `type User = { id: string; name: string; age: number; };`;
    const result = parseTypesFromSource(source);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('User');
    expect(result[0].properties).toHaveLength(3);
  });

  it('parses a simple interface', () => {
    const source = `interface Product { id: string; price: number; active: boolean; }`;
    const result = parseTypesFromSource(source);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Product');
    expect(result[0].properties).toHaveLength(3);
  });

  it('maps string properties correctly', () => {
    const source = `type Foo = { name: string; };`;
    const result = parseTypesFromSource(source);
    expect(result[0].properties[0]).toEqual({ name: 'name', type: 'string' });
  });

  it('maps number properties correctly', () => {
    const source = `type Foo = { age: number; };`;
    const result = parseTypesFromSource(source);
    expect(result[0].properties[0]).toEqual({ name: 'age', type: 'number' });
  });

  it('maps boolean properties correctly', () => {
    const source = `type Foo = { active: boolean; };`;
    const result = parseTypesFromSource(source);
    expect(result[0].properties[0]).toEqual({ name: 'active', type: 'boolean' });
  });

  it('parses multiple types from one file', () => {
    const source = `
      type User = { id: string; };
      type Order = { total: number; };
    `;
    const result = parseTypesFromSource(source);
    expect(result).toHaveLength(2);
    expect(result.map((t) => t.name)).toContain('User');
    expect(result.map((t) => t.name)).toContain('Order');
  });

  it('skips type aliases with no properties (e.g. union types)', () => {
    const source = `type Status = 'active' | 'inactive';`;
    const result = parseTypesFromSource(source);
    expect(result).toHaveLength(0);
  });

  it('returns empty array for empty source', () => {
    const result = parseTypesFromSource('');
    expect(result).toHaveLength(0);
  });
});
