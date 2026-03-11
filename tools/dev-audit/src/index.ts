#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const program = new Command();

program
  .name('dev-audit')
  .description('A lightweight CLI toolkit for keeping your codebase clean')
  .version('0.1.0');

// Attempts to resolve a sub-tool's CLI entry point by walking up node_modules
// directories from the current file's location. Returns the resolved bin path
// if the package is installed and its dist entry exists, or null otherwise.
function resolveToolBin(packageName: string, binName: string): string | null {
  try {
    // Walk from __dirname up through ancestor directories looking for node_modules
    const parts = __dirname.split(path.sep);
    for (let i = parts.length; i > 0; i--) {
      const candidate = path.join(
        parts.slice(0, i).join(path.sep),
        'node_modules',
        packageName,
        'package.json'
      );
      if (!fs.existsSync(candidate)) continue;
      const pkg = JSON.parse(fs.readFileSync(candidate, 'utf8')) as {
        bin?: Record<string, string>;
      };
      const binRelative = pkg.bin?.[binName];
      if (!binRelative) return null;
      const binAbsolute = path.join(path.dirname(candidate), binRelative);
      if (!fs.existsSync(binAbsolute)) return null;
      return binAbsolute;
    }
    return null;
  } catch {
    return null;
  }
}

// Delegates execution to a sub-tool, passing all remaining args through.
// Prints a friendly install hint if the sub-tool package is not installed.
function delegate(packageName: string, binName: string, installName: string, args: string[]): void {
  const binPath = resolveToolBin(packageName, binName);

  if (!binPath) {
    console.log();
    console.log(chalk.yellow('⚠'), chalk.bold(`${packageName} is not installed.`));
    console.log();
    console.log('  Install it with:');
    console.log(chalk.cyan(`    npm install -g ${installName}`));
    console.log(chalk.gray('  or run it directly with:'));
    console.log(chalk.cyan(`    npx ${installName}`));
    console.log();
    process.exit(1);
  }

  const result = spawnSync(process.execPath, [binPath, ...args], {
    stdio: 'inherit',
  });

  process.exit(result.status ?? 0);
}

program
  .command('dead [args...]')
  .description('Detect backend API routes that are never called by frontend code')
  .allowUnknownOption()
  .action((_args: string[], cmd: Command) => {
    const raw = cmd.parent?.args.slice(1) ?? [];
    delegate('@dev-audit/dead-api-detector', 'dev-audit-dead', '@dev-audit/dead-api-detector', raw);
  });

program
  .command('gitignore [args...]')
  .description('Detect your project stack and generate a tailored .gitignore file')
  .allowUnknownOption()
  .action((_args: string[], cmd: Command) => {
    const raw = cmd.parent?.args.slice(1) ?? [];
    delegate(
      '@dev-audit/gitignore-generator',
      'dev-audit-gitignore',
      '@dev-audit/gitignore-generator',
      raw
    );
  });

program
  .command('mock [args...]')
  .description('Spin up a mock REST API server from TypeScript type definitions')
  .allowUnknownOption()
  .action((_args: string[], cmd: Command) => {
    const raw = cmd.parent?.args.slice(1) ?? [];
    delegate(
      '@dev-audit/mock-api-generator',
      'dev-audit-mock',
      '@dev-audit/mock-api-generator',
      raw
    );
  });

// Show available tools and install hints when called with no subcommand
program.addHelpText(
  'after',
  `
${chalk.bold('Tools:')}
  ${chalk.cyan('dead')}      Detect dead API routes
  ${chalk.cyan('gitignore')} Generate a tailored .gitignore
  ${chalk.cyan('mock')}      Spin up a mock API server

${chalk.bold('Install a tool:')}
  ${chalk.gray('npm install -g @dev-audit/dead-api-detector')}
  ${chalk.gray('npm install -g @dev-audit/gitignore-generator')}
  ${chalk.gray('npm install -g @dev-audit/mock-api-generator')}
`
);

program.parse(process.argv);
