#!/usr/bin/env node

import { Command } from 'commander';
import { runScan } from './commands';

const program = new Command();

program
  .name('dev-audit-dead')
  .description('Detect backend API routes that are never called by frontend code')
  .version('0.1.0');

program
  .command('scan')
  .description('Scan a project for dead API endpoints')
  .option('-p, --path <path>', 'Path to the project root', '.')
  .action(async (options: { path: string }) => {
    try {
      await runScan(options.path);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Error: ${message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
