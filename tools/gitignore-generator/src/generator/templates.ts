import { Stack } from '../detector/stackDetector';

// Each stack's gitignore entries, grouped so they can be combined cleanly.
// Entries are ordered: build outputs first, then tool caches, then editor/OS noise.
const TEMPLATES: Record<Stack, string[]> = {
  node: [
    '# Node.js',
    'node_modules/',
    'npm-debug.log*',
    'yarn-debug.log*',
    'yarn-error.log*',
    '.npm',
    '.yarn/',
    '!.yarn/patches',
    '!.yarn/plugins',
    '!.yarn/releases',
    '!.yarn/sdks',
    '!.yarn/versions',
    'dist/',
    'build/',
    '*.tsbuildinfo',
    '.env',
    '.env.local',
    '.env.*.local',
  ],
  nextjs: [
    '# Next.js',
    '.next/',
    'out/',
    '.vercel',
  ],
  python: [
    '# Python',
    '__pycache__/',
    '*.py[cod]',
    '*$py.class',
    '*.so',
    '.Python',
    'venv/',
    '.venv/',
    'env/',
    '.env/',
    '*.egg-info/',
    'dist/',
    'build/',
    '.pytest_cache/',
    '.mypy_cache/',
    '.ruff_cache/',
    '*.pyc',
  ],
  docker: [
    '# Docker',
    '.dockerignore',
    'docker-compose.override.yml',
  ],
  terraform: [
    '# Terraform',
    '.terraform/',
    '*.tfstate',
    '*.tfstate.*',
    'crash.log',
    'crash.*.log',
    '*.tfvars',
    '*.tfvars.json',
    'override.tf',
    'override.tf.json',
    '*_override.tf',
    '*_override.tf.json',
    '.terraformrc',
    'terraform.rc',
  ],
  go: [
    '# Go',
    '*.exe',
    '*.exe~',
    '*.dll',
    '*.so',
    '*.dylib',
    '*.test',
    '*.out',
    'vendor/',
  ],
  rust: [
    '# Rust',
    'target/',
    'Cargo.lock',
  ],
  java: [
    '# Java',
    '*.class',
    '*.jar',
    '*.war',
    '*.ear',
    'hs_err_pid*',
    'target/',
    '.gradle/',
    'build/',
    '.classpath',
    '.project',
    '.settings/',
  ],
};

// Common OS and editor noise that applies to every project regardless of stack.
const COMMON_ENTRIES = [
  '# OS',
  '.DS_Store',
  'Thumbs.db',
  '',
  '# Editors',
  '.vscode/',
  '.idea/',
  '*.swp',
  '*.swo',
  '*~',
];

// Builds a complete .gitignore file content by combining the entries for each
// detected stack, then appending the common OS/editor entries at the bottom.
export function buildGitignore(stacks: Stack[]): string {
  const sections: string[] = [];

  for (const stack of stacks) {
    const entries = TEMPLATES[stack];
    if (entries) {
      sections.push(...entries, '');
    }
  }

  sections.push(...COMMON_ENTRIES);

  return sections.join('\n').trimEnd() + '\n';
}

// Returns the template entries for a specific stack without the common entries.
// Useful for testing individual stack output.
export function getTemplateEntries(stack: Stack): string[] {
  return TEMPLATES[stack] ?? [];
}
