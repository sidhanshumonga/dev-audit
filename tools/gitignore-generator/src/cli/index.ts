#!/usr/bin/env node

import { Command } from 'commander';
import { runGenerate } from './commands';

const program = new Command();

program
  .name('dev-audit-gitignore')
  .description('Detect your project stack and generate a tailored .gitignore file')
  .version('0.1.0');

program
  .command('generate')
  .description('Generate a .gitignore based on the detected stack')
  .option('-p, --path <path>', 'Path to the project root', '.')
  .option('-w, --write', 'Write the .gitignore to disk instead of previewing', false)
  .action(async (options: { path: string; write: boolean }) => {
    try {
      await runGenerate(options.path, options.write);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Error: ${message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
