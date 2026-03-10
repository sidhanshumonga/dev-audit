import { describe, it, expect, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { detectStacks } from '../src/detector/stackDetector';

function createTempProject(files: Record<string, string | null>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dev-audit-test-'));
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    if (content === null) {
      // Create as a directory
      fs.mkdirSync(fullPath, { recursive: true });
    } else {
      fs.writeFileSync(fullPath, content);
    }
  }
  return dir;
}

describe('detectStacks', () => {
  let tmpDir: string;

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('detects Node.js from package.json', () => {
    tmpDir = createTempProject({
      'package.json': JSON.stringify({ dependencies: {} }),
    });
    expect(detectStacks(tmpDir)).toContain('node');
  });

  it('detects Next.js from next dependency', () => {
    tmpDir = createTempProject({
      'package.json': JSON.stringify({ dependencies: { next: '^14.0.0' } }),
    });
    const stacks = detectStacks(tmpDir);
    expect(stacks).toContain('nextjs');
    expect(stacks).toContain('node');
  });

  it('detects Next.js from next.config.js', () => {
    tmpDir = createTempProject({
      'next.config.js': 'module.exports = {}',
      'package.json': JSON.stringify({ dependencies: {} }),
    });
    expect(detectStacks(tmpDir)).toContain('nextjs');
  });

  it('detects Python from requirements.txt', () => {
    tmpDir = createTempProject({ 'requirements.txt': 'flask==2.0.0' });
    expect(detectStacks(tmpDir)).toContain('python');
  });

  it('detects Python from pyproject.toml', () => {
    tmpDir = createTempProject({ 'pyproject.toml': '[tool.poetry]' });
    expect(detectStacks(tmpDir)).toContain('python');
  });

  it('detects Docker from Dockerfile', () => {
    tmpDir = createTempProject({ Dockerfile: 'FROM node:20' });
    expect(detectStacks(tmpDir)).toContain('docker');
  });

  it('detects Docker from docker-compose.yml', () => {
    tmpDir = createTempProject({ 'docker-compose.yml': 'version: "3"' });
    expect(detectStacks(tmpDir)).toContain('docker');
  });

  it('detects Terraform from main.tf', () => {
    tmpDir = createTempProject({ 'main.tf': 'terraform {}' });
    expect(detectStacks(tmpDir)).toContain('terraform');
  });

  it('detects Go from go.mod', () => {
    tmpDir = createTempProject({ 'go.mod': 'module example.com/app' });
    expect(detectStacks(tmpDir)).toContain('go');
  });

  it('detects Rust from Cargo.toml', () => {
    tmpDir = createTempProject({ 'Cargo.toml': '[package]' });
    expect(detectStacks(tmpDir)).toContain('rust');
  });

  it('detects Java from pom.xml', () => {
    tmpDir = createTempProject({ 'pom.xml': '<project/>' });
    expect(detectStacks(tmpDir)).toContain('java');
  });

  it('detects multiple stacks in the same project', () => {
    tmpDir = createTempProject({
      'package.json': JSON.stringify({ dependencies: { next: '^14.0.0' } }),
      Dockerfile: 'FROM node:20',
    });
    const stacks = detectStacks(tmpDir);
    expect(stacks).toContain('node');
    expect(stacks).toContain('nextjs');
    expect(stacks).toContain('docker');
  });

  it('returns empty array when no known stack is detected', () => {
    tmpDir = createTempProject({ 'README.md': '# hello' });
    expect(detectStacks(tmpDir)).toHaveLength(0);
  });
});
