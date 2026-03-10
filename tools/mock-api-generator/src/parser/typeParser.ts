import { Project, SyntaxKind, Type } from 'ts-morph';

// Represents a single property extracted from a TypeScript type or interface.
export interface ParsedProperty {
  name: string;
  type: string;
}

// Represents a fully parsed type with all its resolved properties.
export interface ParsedType {
  name: string;
  properties: ParsedProperty[];
}

// Resolves a ts-morph Type node to a plain string category we can use
// for fake data generation. We normalise union types, arrays, and primitives.
function resolveTypeName(type: Type): string {
  if (type.isString()) return 'string';
  if (type.isNumber()) return 'number';
  if (type.isBoolean()) return 'boolean';
  if (type.isArray()) return 'array';

  const text = type.getText();

  // Catch common semantic names so faker can make sensible values
  if (text.includes('Date')) return 'date';
  if (text.includes('null') || text.includes('undefined')) return 'string';

  return 'string';
}

// Parses all top-level type aliases and interfaces from a TypeScript file.
// Returns an array of ParsedType objects, each with their resolved properties.
export function parseTypesFromFile(filePath: string): ParsedType[] {
  const project = new Project({ skipAddingFilesFromTsConfig: true });
  const sourceFile = project.addSourceFileAtPath(filePath);
  const parsed: ParsedType[] = [];

  // Process type aliases (type Foo = { ... })
  for (const typeAlias of sourceFile.getTypeAliases()) {
    const typeNode = typeAlias.getTypeNode();
    if (!typeNode || typeNode.getKind() !== SyntaxKind.TypeLiteral) continue;

    const properties: ParsedProperty[] = [];

    for (const member of typeNode.getDescendantsOfKind(SyntaxKind.PropertySignature)) {
      const name = member.getName();
      const type = member.getType();
      properties.push({ name, type: resolveTypeName(type) });
    }

    if (properties.length > 0) {
      parsed.push({ name: typeAlias.getName(), properties });
    }
  }

  // Process interfaces (interface Foo { ... })
  for (const iface of sourceFile.getInterfaces()) {
    const properties: ParsedProperty[] = [];

    for (const member of iface.getProperties()) {
      const name = member.getName();
      const type = member.getType();
      properties.push({ name, type: resolveTypeName(type) });
    }

    if (properties.length > 0) {
      parsed.push({ name: iface.getName(), properties });
    }
  }

  return parsed;
}

// Parses types from raw TypeScript source string rather than a file path.
// Useful for testing without touching the filesystem.
export function parseTypesFromSource(source: string): ParsedType[] {
  const project = new Project({ skipAddingFilesFromTsConfig: true });
  const sourceFile = project.createSourceFile('__temp__.ts', source);
  const parsed: ParsedType[] = [];

  for (const typeAlias of sourceFile.getTypeAliases()) {
    const typeNode = typeAlias.getTypeNode();
    if (!typeNode || typeNode.getKind() !== SyntaxKind.TypeLiteral) continue;

    const properties: ParsedProperty[] = [];
    for (const member of typeNode.getDescendantsOfKind(SyntaxKind.PropertySignature)) {
      const name = member.getName();
      const type = member.getType();
      properties.push({ name, type: resolveTypeName(type) });
    }

    if (properties.length > 0) {
      parsed.push({ name: typeAlias.getName(), properties });
    }
  }

  for (const iface of sourceFile.getInterfaces()) {
    const properties: ParsedProperty[] = [];
    for (const member of iface.getProperties()) {
      const name = member.getName();
      const type = member.getType();
      properties.push({ name, type: resolveTypeName(type) });
    }

    if (properties.length > 0) {
      parsed.push({ name: iface.getName(), properties });
    }
  }

  return parsed;
}
