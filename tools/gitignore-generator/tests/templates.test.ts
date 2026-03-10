import { describe, it, expect } from 'vitest';
import { buildGitignore, getTemplateEntries } from '../src/generator/templates';

describe('getTemplateEntries', () => {
  it('returns Node.js entries', () => {
    const entries = getTemplateEntries('node');
    expect(entries).toContain('node_modules/');
    expect(entries).toContain('.env');
    expect(entries).toContain('dist/');
  });

  it('returns Next.js entries', () => {
    const entries = getTemplateEntries('nextjs');
    expect(entries).toContain('.next/');
    expect(entries).toContain('out/');
  });

  it('returns Python entries', () => {
    const entries = getTemplateEntries('python');
    expect(entries).toContain('__pycache__/');
    expect(entries).toContain('venv/');
    expect(entries).toContain('.pytest_cache/');
  });

  it('returns Docker entries', () => {
    const entries = getTemplateEntries('docker');
    expect(entries).toContain('.dockerignore');
  });

  it('returns Terraform entries', () => {
    const entries = getTemplateEntries('terraform');
    expect(entries).toContain('.terraform/');
    expect(entries).toContain('*.tfstate');
  });

  it('returns Go entries', () => {
    const entries = getTemplateEntries('go');
    expect(entries).toContain('vendor/');
  });

  it('returns Rust entries', () => {
    const entries = getTemplateEntries('rust');
    expect(entries).toContain('target/');
  });

  it('returns Java entries', () => {
    const entries = getTemplateEntries('java');
    expect(entries).toContain('*.class');
    expect(entries).toContain('target/');
  });
});

describe('buildGitignore', () => {
  it('includes Node.js entries when node stack is detected', () => {
    const output = buildGitignore(['node']);
    expect(output).toContain('node_modules/');
    expect(output).toContain('.env');
  });

  it('includes entries for all detected stacks', () => {
    const output = buildGitignore(['node', 'nextjs', 'docker']);
    expect(output).toContain('node_modules/');
    expect(output).toContain('.next/');
    expect(output).toContain('.dockerignore');
  });

  it('always includes common OS and editor entries', () => {
    const output = buildGitignore(['go']);
    expect(output).toContain('.DS_Store');
    expect(output).toContain('.vscode/');
    expect(output).toContain('.idea/');
  });

  it('ends with a newline', () => {
    const output = buildGitignore(['node']);
    expect(output.endsWith('\n')).toBe(true);
  });

  it('produces a non-empty string for an empty stack list', () => {
    const output = buildGitignore([]);
    // Should still contain common entries
    expect(output).toContain('.DS_Store');
  });
});
