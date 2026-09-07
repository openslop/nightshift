# Job: performance

Make the app feel fast where users feel it. Change no behavior.

## Rules

- Readability first. A change that is harder to read needs a big, measured win.
- Runtime first, not bundle size. Profile real user actions: typing, dragging, playback, renders.
- Do not remove a good library just to shave bundle size.
- Do not rewrite clear library calls as hand-rolled code.
- Do not ship tiny rerender guards, one memoized callback, or a single `useMemo` as the night's result. These get closed as trivial. Fewer, bigger, proven changes.
- No dynamic import churn for a small first-load win when the app is already responsive.
- Never hide a slow path behind a silent fallback.

## Steps

1. Read the docs for the repo's hot libraries first (for example an editor or renderer's performance guide). Judge every change against them.
2. Find the real hot spots in user actions. Measure before and after.
3. Fix the biggest one well. Then the next, if it is also clearly worth it. A change with no measurement is a guess. Do not ship it.
4. Run `$CHECKS`.
5. Commit with a clear `perf:` message. PR title: `perf: nightly performance <YYYY-MM-DD>`.

## Report

For each change: what got faster, how you know, and why it matters to a user.
