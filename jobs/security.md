# Job: security

Find and fix real security holes. Change nothing else.

## Rules

- Fix only holes someone could really use. No "just in case" hardening.
- Auth and validation failures must fail loudly. Never keep going with a guess.

## Steps

1. Look for:
   - open Dependabot alerts and `npm audit` (or the repo's equivalent) findings with a safe upgrade
   - secrets or keys in code
   - unsafe patterns: `dangerouslySetInnerHTML`, `eval`, open redirects, path traversal
   - missing security headers or CSP
   - server secrets leaking to the client (like `NEXT_PUBLIC_` misuse)
   - API routes with no auth, CORS, or rate limit where one is clearly needed
   - database keys or row-level security exposed
2. Fix what is real. Run `$CHECKS`.
3. Commit: `fix: nightly security audit and fixes`. PR title: `fix: nightly security audit <YYYY-MM-DD>`.

## Report

Group findings by kind: dependency, headers, secrets, routes, database.
