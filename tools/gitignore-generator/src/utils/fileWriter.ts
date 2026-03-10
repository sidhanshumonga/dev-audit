import fs from 'fs';
import path from 'path';

// Resolves a path relative to cwd if it isn't already absolute.
export function resolvePath(targetPath: string): string {
  return path.isAbsolute(targetPath)
    ? targetPath
    : path.resolve(process.cwd(), targetPath);
}

// Writes content to a file at the given path.
// Creates parent directories if they don't exist.
export function writeFile(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
}

// Checks whether a file already exists at the given path.
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}
