import fs from 'fs';
import path from 'path';

export interface DevAuditConfig {
  ignoreDirectories: string[];
  framework: 'auto' | 'express' | 'nextjs' | 'nestjs';
}

const DEFAULTS: DevAuditConfig = {
  ignoreDirectories: ['node_modules', '.next', 'dist', 'build', '.git'],
  framework: 'auto',
};

// Looks for dev-audit.config.json in the given project root.
// Falls back to defaults if the file doesn't exist or can't be parsed.
export function loadConfig(projectRoot: string): DevAuditConfig {
  const configPath = path.join(projectRoot, 'dev-audit.config.json');

  if (!fs.existsSync(configPath)) {
    return DEFAULTS;
  }

  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<DevAuditConfig>;

    return {
      ignoreDirectories: parsed.ignoreDirectories ?? DEFAULTS.ignoreDirectories,
      framework: parsed.framework ?? DEFAULTS.framework,
    };
  } catch {
    // If the config file is malformed, warn and fall back to defaults
    // rather than crashing — the scan should still be useful
    console.warn('dev-audit.config.json could not be parsed. Using defaults.');
    return DEFAULTS;
  }
}
