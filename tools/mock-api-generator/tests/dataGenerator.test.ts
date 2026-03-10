import { describe, it, expect } from 'vitest';
import { generateObject, generateList } from '../src/generator/dataGenerator';
import { ParsedType } from '../src/parser/typeParser';

const userType: ParsedType = {
  name: 'User',
  properties: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'age', type: 'number' },
    { name: 'active', type: 'boolean' },
  ],
};

describe('generateObject', () => {
  it('returns an object with all properties present', () => {
    const obj = generateObject(userType);
    expect(obj).toHaveProperty('id');
    expect(obj).toHaveProperty('name');
    expect(obj).toHaveProperty('email');
    expect(obj).toHaveProperty('age');
    expect(obj).toHaveProperty('active');
  });

  it('generates a UUID for id fields', () => {
    const obj = generateObject(userType);
    expect(typeof obj.id).toBe('string');
    // UUID format check
    expect(obj.id as string).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  it('generates a string for email field', () => {
    const obj = generateObject(userType);
    expect(typeof obj.email).toBe('string');
    expect(obj.email as string).toContain('@');
  });

  it('generates a number for age field', () => {
    const obj = generateObject(userType);
    expect(typeof obj.age).toBe('number');
  });

  it('generates a boolean for active field', () => {
    const obj = generateObject(userType);
    expect(typeof obj.active).toBe('boolean');
  });

  it('uses name-based heuristics for semantic fields', () => {
    const t: ParsedType = {
      name: 'Contact',
      properties: [
        { name: 'phone', type: 'string' },
        { name: 'address', type: 'string' },
        { name: 'city', type: 'string' },
      ],
    };
    const obj = generateObject(t);
    expect(typeof obj.phone).toBe('string');
    expect(typeof obj.address).toBe('string');
    expect(typeof obj.city).toBe('string');
  });
});

describe('generateList', () => {
  it('returns the requested number of objects', () => {
    const list = generateList(userType, 3);
    expect(list).toHaveLength(3);
  });

  it('defaults to 5 objects', () => {
    const list = generateList(userType);
    expect(list).toHaveLength(5);
  });

  it('each item has all expected properties', () => {
    const list = generateList(userType, 2);
    for (const item of list) {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('email');
    }
  });
});
