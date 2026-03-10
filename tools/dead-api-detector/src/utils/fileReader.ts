import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Reads all files matching a given pattern under a directory.
// Returns an array of absolute file paths.
export async function findFiles(dir: string, patterns: string[]): Promise<string[]> {
  const results: string[] = [];

  for (const pattern of patterns) {
    const matches = await glob(pattern, {
      cwd: dir,
      absolute: true,
      // Skip directories that are never relevant for source scanning
      ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/build/**'],
    });
    results.push(...matches);
  }

  // Deduplicate in case patterns overlap
  return [...new Set(results)];
}

// Reads a file and returns its content as a string.
// Returns null if the file cannot be read rather than throwing.
export function readFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

// Checks whether a path is a directory.
export function isDirectory(targetPath: string): boolean {
  try {
    return fs.statSync(targetPath).isDirectory();
  } catch {
    return false;
  }
}

// Resolves a path relative to cwd if it isn't already absolute.
export function resolvePath(targetPath: string): string {
  return path.isAbsolute(targetPath) ? targetPath : path.resolve(process.cwd(), targetPath);
}
