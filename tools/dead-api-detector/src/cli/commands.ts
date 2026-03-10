import path from 'path';
import { detectFramework } from '../scanners/frameworkDetector';
import { scanRoutes } from '../scanners/routeScanner';
import { scanFrontendCalls } from '../scanners/frontendScanner';
import { loadConfig } from '../utils/configLoader';
import { resolvePath } from '../utils/fileReader';
import * as logger from '../utils/logger';

// Normalises a route path for comparison by stripping trailing slashes
// and lowercasing. This prevents simple mismatches from causing false positives.
function normalisePath(routePath: string): string {
  return routePath.toLowerCase().replace(/\/$/, '');
}

// Checks whether a defined route path appears in any of the scanned frontend
// API calls. We do a loose contains-check rather than exact match to handle
// cases where the frontend uses template literals or partial paths.
function isRouteUsed(routePath: string, calledPaths: string[]): boolean {
  const normalised = normalisePath(routePath);
  return calledPaths.some((called) =>
    normalisePath(called).includes(normalised) ||
    normalised.includes(normalisePath(called))
  );
}

export async function runScan(targetPath: string): Promise<void> {
  const projectRoot = resolvePath(targetPath);
  const config = loadConfig(projectRoot);

  logger.header('dev-audit — Dead API Detector');
  logger.info(`Scanning: ${projectRoot}`);
  logger.blank();

  // Detect the framework so we know which scanner to use
  const framework =
    config.framework === 'auto'
      ? detectFramework(projectRoot)
      : config.framework;

  if (framework === 'unknown') {
    logger.warn(
      'Could not detect a supported framework (Express, Next.js, NestJS).'
    );
    logger.warn(
      'Set "framework" in dev-audit.config.json to run the scan manually.'
    );
    process.exit(1);
  }

  logger.success(`Framework detected: ${framework}`);
  logger.blank();

  // Run both scans concurrently — they read independent sets of files
  const [routes, frontendCalls] = await Promise.all([
    scanRoutes(projectRoot, framework),
    scanFrontendCalls(projectRoot),
  ]);

  const calledPaths = frontendCalls.map((c) => c.path);

  const deadRoutes = routes.filter(
    (route) => !isRouteUsed(route.path, calledPaths)
  );

  logger.info(`Routes found:    ${routes.length}`);
  logger.info(`Frontend calls:  ${frontendCalls.length}`);
  logger.blank();

  if (deadRoutes.length === 0) {
    logger.success('No dead API endpoints detected.');
    return;
  }

  logger.header(`Dead endpoints detected: ${deadRoutes.length}`);

  for (const route of deadRoutes) {
    const relative = path.relative(projectRoot, route.filePath);
    logger.listItem(
      `${route.method.padEnd(7)} ${route.path}  (${relative}:${route.line})`
    );
  }

  logger.blank();
  logger.warn(
    'Review these endpoints — they may be legacy code that can be removed.'
  );
}
