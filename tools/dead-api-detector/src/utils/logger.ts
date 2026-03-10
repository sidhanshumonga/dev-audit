import chalk from 'chalk';

// Centralised output helpers so all formatting stays consistent across the tool.
// Using chalk for colour — keeps the CLI readable at a glance.

export function info(message: string): void {
  console.log(chalk.cyan('ℹ'), message);
}

export function success(message: string): void {
  console.log(chalk.green('✓'), message);
}

export function warn(message: string): void {
  console.log(chalk.yellow('⚠'), message);
}

export function error(message: string): void {
  console.error(chalk.red('✖'), message);
}

export function header(message: string): void {
  console.log(chalk.bold('\n' + message));
}

export function listItem(message: string): void {
  console.log(chalk.gray('  →'), message);
}

export function blank(): void {
  console.log();
}
