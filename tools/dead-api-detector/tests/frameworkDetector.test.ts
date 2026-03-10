import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { detectFramework } from '../src/scanners/frameworkDetector';

// Creates a temporary directory with the given files for each test,
// then cleans up afterwards so tests don't interfere with each other.
function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dev-audit-test-'));

  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  }

  return dir;
}

describe('detectFramework', () => {
  let tmpDir: string;

  afterEach(() => {
    if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('detects Next.js from package.json dependency', () => {
    tmpDir = createTempProject({
      'package.json': JSON.stringify({
        dependencies: { next: '^14.0.0', react: '^18.0.0' },
      }),
    });

    expect(detectFramework(tmpDir)).toBe('nextjs');
  });

  it('detects Next.js from next.config.js presence', () => {
    tmpDir = createTempProject({
      'next.config.js': 'module.exports = {}',
      'package.json': JSON.stringify({ dependencies: {} }),
    });

    expect(detectFramework(tmpDir)).toBe('nextjs');
  });

  it('detects NestJS from @nestjs/core dependency', () => {
    tmpDir = createTempProject({
      'package.json': JSON.stringify({
        dependencies: { '@nestjs/core': '^10.0.0' },
      }),
    });

    expect(detectFramework(tmpDir)).toBe('nestjs');
  });

  it('detects Express from package.json dependency', () => {
    tmpDir = createTempProject({
      'package.json': JSON.stringify({
        dependencies: { express: '^4.18.0' },
      }),
    });

    expect(detectFramework(tmpDir)).toBe('express');
  });

  it('returns unknown when no recognisable framework is found', () => {
    tmpDir = createTempProject({
      'package.json': JSON.stringify({ dependencies: {} }),
    });

    expect(detectFramework(tmpDir)).toBe('unknown');
  });

  it('returns unknown when package.json is missing', () => {
    tmpDir = createTempProject({
      'src/index.ts': 'console.log("hello")',
    });

    expect(detectFramework(tmpDir)).toBe('unknown');
  });

  it('prefers NestJS over Express when both are present', () => {
    tmpDir = createTempProject({
      'package.json': JSON.stringify({
        dependencies: {
          '@nestjs/core': '^10.0.0',
          express: '^4.18.0',
        },
      }),
    });

    // NestJS depends on Express internally — we should report NestJS
    expect(detectFramework(tmpDir)).toBe('nestjs');
  });
});
