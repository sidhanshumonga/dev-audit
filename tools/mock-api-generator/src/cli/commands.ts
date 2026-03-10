import path from 'path';
import { parseTypesFromFile } from '../parser/typeParser';
import { startServer } from '../server/mockServer';
import * as logger from '../utils/logger';

export async function runServe(typesPath: string, port: number): Promise<void> {
  const resolvedPath = path.isAbsolute(typesPath)
    ? typesPath
    : path.resolve(process.cwd(), typesPath);

  logger.header('dev-audit — Mock API Generator');
  logger.info(`Types file: ${resolvedPath}`);
  logger.info(`Port:       ${port}`);
  logger.blank();

  const parsedTypes = parseTypesFromFile(resolvedPath);

  if (parsedTypes.length === 0) {
    logger.warn('No type aliases or interfaces found in the provided file.');
    logger.warn('Make sure the file contains top-level type definitions with properties.');
    process.exit(1);
  }

  logger.success(`Found ${parsedTypes.length} type(s):`);
  for (const t of parsedTypes) {
    logger.listItem(`${t.name} (${t.properties.length} properties)`);
  }
  logger.blank();

  startServer({ port, parsedTypes });

  logger.success(`Mock server running at http://localhost:${port}`);
  logger.blank();

  // Print the available endpoints so the user knows what was registered
  logger.header('Available endpoints:');
  for (const t of parsedTypes) {
    const seg = t.name.toLowerCase() + 's';
    logger.listItem(`GET  /${seg}`);
    logger.listItem(`POST /${seg}`);
    logger.listItem(`GET  /${seg}/:id`);
  }
  logger.blank();
  logger.info('Press Ctrl+C to stop the server.');
}
