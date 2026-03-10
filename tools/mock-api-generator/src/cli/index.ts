#!/usr/bin/env node

import { Command } from 'commander';
import { runServe } from './commands';

const program = new Command();

program
  .name('dev-audit-mock')
  .description('Spin up a mock REST API server from TypeScript type definitions')
  .version('0.1.0');

program
  .command('serve')
  .description('Start a mock API server from a TypeScript types file')
  .requiredOption('-t, --types <path>', 'Path to the TypeScript file containing type definitions')
  .option('-p, --port <number>', 'Port to run the mock server on', '4000')
  .action(async (options: { types: string; port: string }) => {
    try {
      await runServe(options.types, parseInt(options.port, 10));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Error: ${message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
