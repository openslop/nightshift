# Job: cleanliness

Pick one tangled module and rebuild it the way you would write it today. Same behavior. Same speed. Fewer parts, plain names, and the idioms of the language and the framework.

Unlike `readability`, you may change the design: move code, merge pieces, add a small class or helper. Unlike `architecture`, stay inside one module or one call chain.

## What to look for

- A call chain you have to trace through many hops. A factory that returns a closure that returns a callback that calls another factory.
- A callback passed in only to change how another module behaves.
- Two maps, caches, or pieces of state that hold the same thing.
- Policy (when, whether) mixed into mechanism (how).
- Hand-rolled code for something the language, the framework, or a small popular library already does.
- Names that disagree with what they hold. A function named like a graph that returns a resolver. A type named `Node` that is never a node.
- Types wider than the truth. A union that includes a case nothing returns. A field that exists only to tag a variant.
- Comments that explain what the code should have made plain.

## Rules

- No behavior changes. Errors, caching, and identity guarantees stay exactly as they were.
- No slower code. If the module is on a hot path, measure the old and new code with the same throwaway benchmark. Put both numbers in the PR. Never commit the benchmark.
- One module or one call chain a night. Not a sweep. If nothing is clearly tangled, report no change.
- Mechanism lives in a plain module with a small surface: a class or a few functions. Policy lives in the caller that wires it up. Neither knows the other's insides.
- Reach for the idiom first: the framework's own primitive, a library the repo already uses, a standard term (`intern`, `visit`, `update`). You may add a dependency only when it replaces hand-rolled code and is small and widely used. Say why in the PR.
- Types tell the truth. Narrow a union to what is really returned. Tell variants apart with a named type guard, not a tag field that duplicates the shape.
- Audit every name in the diff. A name says what a thing is or does. Before you pick one, search the repo for the word. Never reuse a word that already means something else here. Rename everywhere in one go.
- Delete comments that repeat a name, a type, or the code below. Keep one only where a choice would look arbitrary without it, and keep it to one line.
- Keep guards that turn a silent wrong result into a loud error. Release guard state in `finally`.
- When policy moves, test it where it now lives, through the real code. A mock calls the shipped helper. It never copies its logic.
- Leave public APIs alone: library exports, API fields, CLI flags, environment names.

## Steps

1. Read the guide files. Find the module a new teammate would take longest to trace. Pick one.
2. Before you edit, write down what it must keep doing: each behavior, error, and caching or identity guarantee. Then write the simplest design that does exactly that, who owns policy, and who owns mechanism.
3. If it is on a hot path, write the throwaway benchmark against the old code and record the numbers.
4. Refactor. Update callers and tests. Rename a file that no longer fits what it holds.
5. Audit the diff: every name, every comment, every type. Then run the repo's own review and simplify commands and apply what holds up.
6. Run the benchmark against the new code. It must be within noise of the old. Delete it.
7. Run `$CHECKS`.
8. Commit: `refactor: nightly cleanliness pass`. PR title: `refactor: nightly cleanliness <YYYY-MM-DD>`.

## Report

The module and why you picked it. The old call chain and the new one. Each rename, old to new. Benchmark numbers before and after, or `not on a hot path`. What you skipped and why.
