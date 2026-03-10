import fs from 'fs';
import path from 'path';

// Each stack we can detect. A project may match multiple stacks —
// that's intentional, since a Next.js project is also a Node project.
export type Stack =
  | 'node'
  | 'nextjs'
  | 'python'
  | 'docker'
  | 'terraform'
  | 'go'
  | 'rust'
  | 'java';

// Maps a stack name to a human-readable label for output.
export const STACK_LABELS: Record<Stack, string> = {
  node: 'Node.js',
  nextjs: 'Next.js',
  python: 'Python',
  docker: 'Docker',
  terraform: 'Terraform',
  go: 'Go',
  rust: 'Rust',
  java: 'Java',
};

// Checks whether a file or directory exists under the project root.
function has(projectRoot: string, ...segments: string[]): boolean {
  return fs.existsSync(path.join(projectRoot, ...segments));
}

// Reads package.json dependencies if present. Returns an empty object on failure.
function getPackageDeps(projectRoot: string): Record<string, string> {
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8')
    );
    return { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
  } catch {
    return {};
  }
}

// Detects all stacks present in a project by checking for well-known indicator
// files, directories, and package.json dependencies. Returns all matches rather
// than stopping at the first — real projects often use multiple stacks.
export function detectStacks(projectRoot: string): Stack[] {
  const stacks: Stack[] = [];
  const deps = getPackageDeps(projectRoot);

  // Next.js: check for the next package or a next.config file
  if ('next' in deps || has(projectRoot, 'next.config.js') || has(projectRoot, 'next.config.ts')) {
    stacks.push('nextjs');
  }

  // Node.js: any project with a package.json is a Node project
  if (has(projectRoot, 'package.json')) {
    stacks.push('node');
  }

  // Python: requirements.txt, Pipfile, pyproject.toml, or setup.py
  if (
    has(projectRoot, 'requirements.txt') ||
    has(projectRoot, 'Pipfile') ||
    has(projectRoot, 'pyproject.toml') ||
    has(projectRoot, 'setup.py')
  ) {
    stacks.push('python');
  }

  // Docker: Dockerfile or docker-compose file at the root
  if (
    has(projectRoot, 'Dockerfile') ||
    has(projectRoot, 'docker-compose.yml') ||
    has(projectRoot, 'docker-compose.yaml')
  ) {
    stacks.push('docker');
  }

  // Terraform: .tf files or a terraform directory
  if (has(projectRoot, 'terraform') || has(projectRoot, 'main.tf')) {
    stacks.push('terraform');
  }

  // Go: go.mod at the root
  if (has(projectRoot, 'go.mod')) {
    stacks.push('go');
  }

  // Rust: Cargo.toml at the root
  if (has(projectRoot, 'Cargo.toml')) {
    stacks.push('rust');
  }

  // Java: pom.xml (Maven) or build.gradle (Gradle)
  if (has(projectRoot, 'pom.xml') || has(projectRoot, 'build.gradle')) {
    stacks.push('java');
  }

  return stacks;
}
