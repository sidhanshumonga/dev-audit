import path from 'path';
import { detectStacks, STACK_LABELS } from '../detector/stackDetector';
import { buildGitignore } from '../generator/templates';
import { resolvePath, writeFile, fileExists } from '../utils/fileWriter';
import * as logger from '../utils/logger';

export async function runGenerate(
  targetPath: string,
  write: boolean
): Promise<void> {
  const projectRoot = resolvePath(targetPath);

  logger.header('dev-audit — Gitignore Generator');
  logger.info(`Scanning: ${projectRoot}`);
  logger.blank();

  const stacks = detectStacks(projectRoot);

  if (stacks.length === 0) {
    logger.warn('No recognisable stack detected.');
    logger.warn(
      'Try running from your project root, or check that indicator files exist.'
    );
    process.exit(1);
  }

  logger.success('Detected stack:');
  for (const stack of stacks) {
    logger.listItem(STACK_LABELS[stack]);
  }
  logger.blank();

  const content = buildGitignore(stacks);

  if (!write) {
    // Dry run — print the output so the user can review before writing
    logger.header('Generated .gitignore (preview):');
    logger.blank();
    console.log(content);
    logger.info('Run with --write to save this to disk.');
    return;
  }

  const gitignorePath = path.join(projectRoot, '.gitignore');
  const alreadyExists = fileExists(gitignorePath);

  writeFile(gitignorePath, content);

  if (alreadyExists) {
    logger.success('.gitignore updated.');
  } else {
    logger.success('.gitignore created.');
  }

  logger.info(`Saved to: ${gitignorePath}`);
}
