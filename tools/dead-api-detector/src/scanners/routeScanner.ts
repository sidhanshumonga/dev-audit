import path from 'path';
import { findFiles, readFile } from '../utils/fileReader';
import { Framework } from './frameworkDetector';

export interface Route {
  method: string;
  path: string;
  filePath: string;
  line: number;
}

// Regex patterns for each framework's route definition syntax.
// Each pattern captures the HTTP method and the route path string.
const EXPRESS_ROUTE_PATTERN =
  /app\.(get|post|put|patch|delete|all)\s*\(\s*['"`]([^'"`]+)['"`]/gi;

const NESTJS_DECORATOR_PATTERN =
  /@(Get|Post|Put|Patch|Delete)\s*\(\s*['"`]?([^'"`)]*)['"`]?\s*\)/gi;

// Scans backend source files and returns all defined API routes.
export async function scanRoutes(
  projectRoot: string,
  framework: Framework
): Promise<Route[]> {
  const routes: Route[] = [];

  if (framework === 'express') {
    routes.push(...(await scanExpressRoutes(projectRoot)));
  } else if (framework === 'nextjs') {
    routes.push(...(await scanNextJsRoutes(projectRoot)));
  } else if (framework === 'nestjs') {
    routes.push(...(await scanNestJsRoutes(projectRoot)));
  }

  return routes;
}

async function scanExpressRoutes(projectRoot: string): Promise<Route[]> {
  const files = await findFiles(projectRoot, ['**/*.ts', '**/*.js']);
  const routes: Route[] = [];

  for (const filePath of files) {
    const content = readFile(filePath);
    if (!content) continue;

    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Reset lastIndex between lines since we reuse the regex
      EXPRESS_ROUTE_PATTERN.lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = EXPRESS_ROUTE_PATTERN.exec(line)) !== null) {
        routes.push({
          method: match[1].toUpperCase(),
          path: match[2],
          filePath,
          line: index + 1,
        });
      }
    });
  }

  return routes;
}

async function scanNextJsRoutes(projectRoot: string): Promise<Route[]> {
  const routes: Route[] = [];

  // Pages router: files under pages/api/ map directly to routes
  const pagesApiFiles = await findFiles(projectRoot, [
    'pages/api/**/*.ts',
    'pages/api/**/*.js',
  ]);

  for (const filePath of pagesApiFiles) {
    const relative = path.relative(projectRoot, filePath);
    // Strip the "pages" prefix and file extension to get the route path.
    // relative is e.g. "pages/api/users.ts" — after removing "pages" we already
    // have a leading slash, so we don't prepend another one.
    const routePath = relative
      .replace(/^pages/, '')
      .replace(/\.(ts|js)x?$/, '')
      .replace(/\/index$/, '');

    // Next.js API routes handle all HTTP methods by default
    routes.push({ method: 'ALL', path: routePath, filePath, line: 1 });
  }

  // App router: files named route.ts/route.js under app/api/
  const appRouterFiles = await findFiles(projectRoot, [
    'app/api/**/route.ts',
    'app/api/**/route.js',
    'src/app/api/**/route.ts',
    'src/app/api/**/route.js',
  ]);

  for (const filePath of appRouterFiles) {
    const content = readFile(filePath);
    if (!content) continue;

    const relative = path.relative(projectRoot, filePath);

    // Derive the route path from the directory structure.
    // Normalise both src/app/api and app/api layouts to start with /api/.
    const routePath =
      '/' +
      relative
        .replace(/^src\//, '')
        .replace(/^app\//, '')
        .replace(/\/route\.(ts|js)x?$/, '')
        .replace(/\[([^\]]+)\]/g, ':$1'); // convert [param] → :param

    // Detect which HTTP methods are exported from this route file
    const methodMatches = content.matchAll(
      /^export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE)/gm
    );

    for (const match of methodMatches) {
      routes.push({
        method: match[1],
        path: routePath,
        filePath,
        line: content.slice(0, match.index).split('\n').length,
      });
    }
  }

  return routes;
}

async function scanNestJsRoutes(projectRoot: string): Promise<Route[]> {
  const files = await findFiles(projectRoot, [
    'src/**/*.controller.ts',
    'src/**/*.controller.js',
  ]);
  const routes: Route[] = [];

  for (const filePath of files) {
    const content = readFile(filePath);
    if (!content) continue;

    // Extract the base path from the @Controller() decorator
    const controllerMatch = content.match(
      /@Controller\s*\(\s*['"`]([^'"`]*)['"`]\s*\)/
    );
    const basePath = controllerMatch ? `/${controllerMatch[1]}` : '';

    const lines = content.split('\n');

    lines.forEach((line, index) => {
      NESTJS_DECORATOR_PATTERN.lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = NESTJS_DECORATOR_PATTERN.exec(line)) !== null) {
        const subPath = match[2] ? `/${match[2]}` : '';
        routes.push({
          method: match[1].toUpperCase(),
          path: `${basePath}${subPath}`,
          filePath,
          line: index + 1,
        });
      }
    });
  }

  return routes;
}
