import path from 'path';
import fs from 'fs';
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

// Converts a route path with dynamic segments into a regex that can match
// frontend calls. e.g. /api/users/:id or /api/users/[id] both become
// a pattern that matches /api/users/ (from a stripped template literal).
function routeToMatchPattern(routePath: string): RegExp {
  // Split on dynamic segments (:param or [param]) so we can escape static
  // parts independently, then reassemble with a wildcard for each dynamic part.
  const normalised = normalisePath(routePath);
  const parts = normalised.split(/:[^/]+|\[[^\]]+\]/g);
  const escaped = parts.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[^/]*');
  return new RegExp(`^${escaped}`);
}

// Checks whether a defined route path appears in any of the scanned frontend
// API calls. We do a loose contains-check rather than exact match, and also
// match dynamic segments so /api/users/:id matches /api/users/ from a
// stripped template literal fetch(`/api/users/${id}`).
function isRouteUsed(routePath: string, calledPaths: string[]): boolean {
  const normalised = normalisePath(routePath);
  const dynamicPattern = routeToMatchPattern(routePath);
  return calledPaths.some((called) => {
    const normCalled = normalisePath(called);
    return (
      normCalled.includes(normalised) ||
      normalised.includes(normCalled) ||
      dynamicPattern.test(normCalled)
    );
  });
}

// Reads vercel.json from the project root and returns the paths of any cron
// jobs defined there. Vercel calls these routes on a schedule — they'll never
// appear as fetch() calls in source code, so we auto-ignore them.
function loadVercelCronPaths(projectRoot: string): string[] {
  const vercelConfigPath = path.join(projectRoot, 'vercel.json');
  if (!fs.existsSync(vercelConfigPath)) return [];
  try {
    const raw = fs.readFileSync(vercelConfigPath, 'utf-8');
    const config = JSON.parse(raw) as { crons?: { path: string }[] };
    return (config.crons ?? []).map((c) => c.path).filter(Boolean);
  } catch {
    return [];
  }
}

export async function runScan(targetPath: string): Promise<void> {
  const projectRoot = resolvePath(targetPath);
  const config = loadConfig(projectRoot);

  logger.header('dev-audit — Dead API Detector');
  logger.info(`Scanning: ${projectRoot}`);
  logger.blank();

  // Detect the framework so we know which scanner to use
  const framework = config.framework === 'auto' ? detectFramework(projectRoot) : config.framework;

  if (framework === 'unknown') {
    logger.warn('Could not detect a supported framework (Express, Next.js, NestJS).');
    logger.warn('Set "framework" in dev-audit.config.json to run the scan manually.');
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

  // Auto-detect Vercel cron routes from vercel.json — these are called by
  // Vercel's scheduler infrastructure, never by in-code fetch(), so they
  // always appear dead without this.
  const vercelCronPaths = loadVercelCronPaths(projectRoot);
  if (vercelCronPaths.length > 0) {
    logger.info(`Vercel crons detected: ${vercelCronPaths.length} route(s) auto-ignored`);
  }

  // Endpoints the user has explicitly told us to ignore (cron jobs, webhooks,
  // manual scripts etc. that are called externally and have no in-code fetch()).
  const ignoredSet = new Set(
    [...(config.ignoreEndpoints ?? []), ...vercelCronPaths].map((p) => normalisePath(p))
  );

  const isIgnored = (routePath: string) => {
    const normalised = normalisePath(routePath);
    for (const pattern of ignoredSet) {
      // Support prefix wildcards e.g. "/api/cron/*" matches "/api/cron/sync"
      if (pattern.endsWith('*')) {
        if (normalised.startsWith(pattern.slice(0, -1))) return true;
      } else if (normalised === pattern) {
        return true;
      }
    }
    return false;
  };

  const deadRoutes = routes.filter(
    (route) => !isRouteUsed(route.path, calledPaths) && !isIgnored(route.path)
  );
  const suppressedCount = routes.filter(
    (route) => !isRouteUsed(route.path, calledPaths) && isIgnored(route.path)
  ).length;

  logger.info(`Routes found:    ${routes.length}`);
  logger.info(`Frontend calls:  ${frontendCalls.length}`);
  if (suppressedCount > 0) {
    logger.info(
      `Ignored:         ${suppressedCount} (externally-called, see ignoreEndpoints in config)`
    );
  }
  logger.blank();

  if (deadRoutes.length === 0) {
    logger.success('No dead API endpoints detected.');
    return;
  }

  logger.header(`Dead endpoints detected: ${deadRoutes.length}`);

  for (const route of deadRoutes) {
    const relative = path.relative(projectRoot, route.filePath);
    logger.listItem(`${route.method.padEnd(7)} ${route.path}  (${relative}:${route.line})`);
  }

  logger.blank();
  logger.warn('Review these endpoints — they may be legacy code that can be removed.');
}
