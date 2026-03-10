# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| latest  | ✅        |

## Reporting a Vulnerability

If you discover a security vulnerability in dev-audit, please do **not** open a public GitHub issue.

Instead, report it by emailing the maintainers directly or by using GitHub's private vulnerability reporting feature on this repository.

Please include:

- A description of the vulnerability
- Steps to reproduce it
- The potential impact
- Any suggested fix if you have one

We aim to acknowledge reports within 48 hours and provide a fix or mitigation plan within 7 days for confirmed vulnerabilities.

## Security Design

dev-audit is designed with security as a core principle:

- All analysis runs **entirely locally** — no code, file contents, or repository structure is ever sent to an external server
- The tool only **reads** files — it never modifies your codebase unless you explicitly run a write command (e.g. `dev-audit gitignore --write`)
- No telemetry, analytics, or tracking of any kind
- No network requests are made by default

If you believe any of these guarantees are violated by the current implementation, that qualifies as a security issue and should be reported through this process.
