import fs from 'fs';
import path from 'path';

export type Framework = 'nextjs' | 'express' | 'nestjs' | 'unknown';

// Detects the framework used in a project by checking for well-known indicator
// files and package.json dependencies. The checks are ordered by specificity —
// NestJS and Next.js are identified before falling back to Express, since both
// can coexist with an express dependency.
export function detectFramework(projectRoot: string): Framework {
  const pkgPath = path.join(projectRoot, 'package.json');

  let dependencies: Record<string, string> = {};
  let devDependencies: Record<string, string> = {};

  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      dependencies = pkg.dependencies ?? {};
      devDependencies = pkg.devDependencies ?? {};
    } catch {
      // If package.json is unreadable, fall through to file-based detection
    }
  }

  const allDeps = { ...dependencies, ...devDependencies };

  // NestJS projects always have @nestjs/core
  if ('@nestjs/core' in allDeps) {
    return 'nestjs';
  }

  // Next.js projects have `next` as a dependency and often a next.config file
  if (
    'next' in allDeps ||
    fs.existsSync(path.join(projectRoot, 'next.config.js')) ||
    fs.existsSync(path.join(projectRoot, 'next.config.ts'))
  ) {
    return 'nextjs';
  }

  // Express is the fallback — many projects use it without a dedicated config file
  if ('express' in allDeps) {
    return 'express';
  }

  return 'unknown';
}
