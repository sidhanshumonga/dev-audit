import { findFiles, readFile } from '../utils/fileReader';

export interface ApiCall {
  path: string;
  filePath: string;
  line: number;
}

// Patterns that cover the most common ways frontend code calls an API.
// We match fetch(), axios, and the Next.js router pattern.
const API_CALL_PATTERNS: RegExp[] = [
  // fetch('/api/...')  or  fetch(`/api/...`)
  /fetch\s*\(\s*['"`]([^'"`]+)['"`]/g,
  // axios.get('/api/...')  axios.post(...)  etc.
  /axios\.[a-z]+\s*\(\s*['"`]([^'"`]+)['"`]/g,
  // useEffect / generic string that starts with /api/
  /['"`](\/api\/[^'"`\s]+)['"`]/g,
];

// Scans all frontend source files and extracts any strings that look like
// API calls. We cast a wide net here — false positives are better than
// false negatives when deciding whether a route is "used".
export async function scanFrontendCalls(
  projectRoot: string
): Promise<ApiCall[]> {
  const files = await findFiles(projectRoot, [
    '**/*.ts',
    '**/*.tsx',
    '**/*.js',
    '**/*.jsx',
  ]);

  const calls: ApiCall[] = [];

  for (const filePath of files) {
    const content = readFile(filePath);
    if (!content) continue;

    const lines = content.split('\n');

    lines.forEach((line, index) => {
      for (const pattern of API_CALL_PATTERNS) {
        // Reset lastIndex so the pattern can match from the start of each line
        pattern.lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = pattern.exec(line)) !== null) {
          const apiPath = match[1];

          // Only record paths that look like they're hitting an API endpoint
          if (apiPath.startsWith('/api/') || apiPath.startsWith('/')) {
            calls.push({
              path: apiPath,
              filePath,
              line: index + 1,
            });
          }
        }
      }
    });
  }

  return calls;
}
