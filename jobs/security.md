# Job: security

Act as a red team. Break the app the way a real attacker would, prove each hole works, then fix the worst one. Change nothing else.

The full audit runs once a week. Dependency checks, a review of what merged since the last run, and one fix run every night.

## Rules

- Attack only your own local copy: the dev server, a local database, and test accounts you make. Never send attack traffic to production, a preview deploy, a third-party API, or a real user's data.
- A finding counts only with a working proof or a concrete trace from attacker input to the harmful sink, `file:line` by `file:line`. "This might be unsafe" is not a finding.
- Fix only holes someone could really use. No "just in case" hardening.
- Auth and validation failures must fail loudly. Never keep going with a guess.
- Never weaken a check, a test, or a security header to make something pass.

## Who attacks

Think through each of these. A hole often needs two of them working together.

- **Anonymous.** No account. Hits every public route, page, and webhook.
- **Logged-in user.** Has a normal account and wants another user's data, more rights, or free paid work.
- **Malicious content.** Never touches the app directly. Plants input that the app or its AI agent reads later: an uploaded file, a file name, a shared project, a model or tool output, a fetched web page.
- **Hostile website.** A page the victim visits while logged in. Drives CSRF, clickjacking, and cross-origin reads.
- **Compromised dependency or CI.** A package, a GitHub Action, or a build script that runs code.

## What to attack

For each class, follow untrusted input from where it enters to where it does harm.

1. **Authorization.** IDOR: swap ids in every route, server action, RPC, and storage path. Row-level policies, including `WITH CHECK` on insert and update. Admin, debug, and impersonate routes. Role or flag fields a user can write. Mass assignment through unchecked body keys.
2. **Authentication and sessions.** Login, magic link, OAuth `state` and redirect, password reset, token lifetime and reuse, cookie flags (`HttpOnly`, `Secure`, `SameSite`), session fixation, logout that does not end the session.
3. **CSRF.** Every state-changing route and server action. Is it reachable by a cross-site form or `fetch`? Does it check `Origin`, rely on `SameSite`, or need a non-simple header? GET routes that change state.
4. **XSS.** `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`. `href` and `src` built from user data (`javascript:`, `data:`). Markdown, rich text, or model output rendered as HTML. SVG and HTML uploads served from an origin that shares cookies. Content-Type sniffing. Strings in `<script>` JSON. Missing or weak CSP.
5. **Injection.** SQL or RPC filters built from strings, shell commands, `child_process`, template engines, header and log injection, regex DoS, prototype pollution through merges and `key in obj` lookups.
6. **Server-side request forgery.** Every server `fetch` whose URL, host, or redirect a user can steer, including image optimizers, previews, webhooks, and import-by-URL. Check the cloud metadata IP, localhost, internal hostnames, and redirect chains.
7. **Remote code execution.** Deserialization, dynamic `import` or `require` of user paths, file upload into executable or served paths, path traversal on read or write, native parsers fed user files (images, video, archives), and dependency advisories that reach those paths.
8. **AI agent and prompt injection.** Every place the agent reads text it did not write: file names, file content, tool results, fetched pages, other users' content. Can that text make the agent call a tool, leak data, change another project, or reach a URL? Which tools act without the user confirming? What runs on the server or the user's machine when a tool is called?
9. **Secrets and data exposure.** Keys in code, git history, logs, error bodies, or client bundles (`NEXT_PUBLIC_` and the like). Stack traces sent to users. Source maps in production. Signed URLs that live too long or are guessable.
10. **Abuse and cost.** Paid or slow routes with no rate limit, quota, or size cap. Upload size and type checks done only on the client. Race conditions on credits, one-time codes, and limits.
11. **Headers and browser policy.** CSP, `frame-ancestors`, HSTS, `X-Content-Type-Options`, CORS with credentials or a reflected origin, `postMessage` without an origin check.
12. **Supply chain.** Dependabot alerts and `npm audit` (or the repo's equivalent), install scripts, unpinned GitHub Actions, `pull_request_target` workflows, CI secrets exposed to fork PRs.

## The ledger

`$STATE_DIR/security-ledger.md` is the source of truth. Make it if it is missing. It holds:

- `Last audit: YYYY-MM-DD` and `Last sweep: <base branch SHA>`.
- A short threat model: entry points, trust boundaries, the sensitive sinks, and which attacker reaches which.
- One line per finding: `id | severity | status | class | summary | entry file:line -> sink file:line`. Severity is `critical`, `high`, `medium`, or `low`, judged by what an attacker gains and how easily. Status is one of `open`, `shipped #N`, `accepted: why`, `rejected: why`, `blocked: PR #N (date)`, `needs owner: question`.

Never re-open a finding that is `accepted`, `rejected`, or `shipped` unless the code it relies on has changed. Say what changed.

## Audit (only when the last one is 7 or more days old)

1. Map the attack surface: every route, server action, webhook, RPC, table policy, upload, outbound fetch, agent tool, and CI workflow. Update the threat model in the ledger.
2. Split the attack classes above across helpers if your agent can run them in parallel. Each helper reads only, attacks only the local copy, and reports findings with proof.
3. Chain findings. A low here plus a low there can be a high: a stored XSS plus a missing CSRF check, a prompt injection plus an agent tool that fetches URLs.
4. Before you keep a finding, confirm it yourself. Re-run the proof, or walk the trace in the code. Drop anything you cannot confirm.
5. Write the date, the SHA, and the findings to the ledger, worst first.

## Nightly sweep

1. Check Dependabot alerts and `npm audit`. Note new advisories and whether the vulnerable code is reachable from our use of the package.
2. Read every change merged since `Last sweep`. Run each attack class that touches the changed code. New routes, tools, migrations, uploads, and fetches get a full pass.
3. Add new findings to the ledger. Update `Last sweep`.

## Fix

Pick the worst `open` finding that no open PR already fixes and that needs no product decision. A reachable critical or high dependency advisory with a safe upgrade counts.

1. Fix the root cause at the boundary: validate and authorize once where input enters, encode where it leaves. Do not patch one call site when the same hole is open at others.
2. Add a test that runs the attack and fails without the fix.
3. Re-run the proof. It must now fail.
4. Run `$CHECKS`. Run `$GUARD`.
5. Commit: `fix: nightly security <YYYY-MM-DD>, <finding>`. PR title: `fix: nightly security <YYYY-MM-DD>`.
6. Update the ledger: the fixed finding becomes `shipped #PR`. Skipped ones get their reason and today's date.

Several findings with one root cause can ship in one PR. Unrelated ones go in separate nights.

## Disclosure

PRs and issues on a public repo are public. Before a fix merges, an exploit written there is a gift to an attacker.

- The PR body says what class of hole is closed and how. Keep exploit steps, payloads, and proof scripts out of it.
- A `critical` or `high` finding you cannot fix tonight goes into a private GitHub security advisory (`gh api repos/$REPO_SLUG/security-advisories`) with the proof, never a public issue. If that fails, keep it in the ledger and name it in the report.
- Do not commit the ledger or proof scripts. They live outside the repo.

## Report

- Audit summary, or `no audit tonight`.
- New findings by severity and class, with the attacker who reaches each one.
- The finding fixed and the PR, or `no change` and why.
- Dependency advisories: new, fixed, and accepted as unreachable.
- What you skipped and why.
