# Contributing

Thanks for helping. Nightshift is small on purpose. Keep it that way.

## What is here

- `jobs/` is one page per job, in plain English. The agent reads the page as its instructions.
- `jobs/_common.md` is the rules every job follows. Change it with care; every job feels it.
- `review/SKILL.md` is how the reviewer acts.
- `bin/` is three shell scripts. `nightly.sh` runs the jobs, `review.sh` runs the reviewer, `guard.sh` keeps a branch away from files that open pull requests touch. `lib.sh` is what they share.
- `tui/` is the console. Plain Node, no dependencies, no build step.
- `assets/` is the pictures. `gen-demo.py` draws the demo and `gen-features.py` draws the feature cards. Both emit SVG.

## Run it locally

You need `bash`, `git`, `gh` logged in, and one coding agent on your path.

```bash
git clone https://github.com/openslop/nightshift ~/nightshift
cd ~/nightshift
cp nightshift.conf.example nightshift.conf   # fill it in for a repo you own
WINDOW_END_HOUR=24 JOBS=security bin/nightly.sh
```

Point it at a throwaway repo the first time. Logs land in `STATE_DIR`, under `runs/` and the date.

To run the console with made-up data:

```bash
node tui/bin/nightshift-tui --demo
```

## Add or change a job

1. Copy the closest page in `jobs/` and give it a plain name, like `docs.md`.
2. Write it the way the others are written. Short sentences. Say what to look for, what to leave alone, and when to do nothing.
3. Run one night with `JOBS` set to only your job. Read the pull request it opens. Read the log when it opens nothing.
4. Add the job name to the `JOBS` comment in `nightshift.conf.example` and to the table in `README.md`.

A good job does nothing most nights. If yours opens a pull request every night, it is too eager.

## Change the scripts

- Keep them POSIX-friendly `bash`. They run on macOS, Linux, and WSL.
- Run `shellcheck bin/*.sh` before you open a pull request.
- Never let a script push to the main branch or weaken a check to make it pass.

## Change the console

- Node 18 or newer. No packages.
- `node tui/bin/nightshift-tui --frame 160x45` prints one frame and exits, which is handy for checks.
- Keep the background unpainted so see-through terminals keep working.

## Change the pictures

```bash
python3 assets/gen-features.py   # writes assets/features/*.svg
python3 assets/gen-demo.py       # writes assets/nightshift-demo.svg (needs node)
```

The SVGs must be strict XML. Check them before you commit:

```bash
for f in assets/*.svg assets/features/*.svg; do python3 -c "import xml.dom.minidom,sys; xml.dom.minidom.parse(sys.argv[1])" "$f"; done
```

## Translations

The READMEs in other languages live in `docs/readme/`. When `README.md` changes, change them too, or open an issue saying which parts moved so someone can.

## Pull requests

- One change per pull request. Say what it does in the first line.
- Plain words. The whole project reads like a note to a friend. Keep it that way.
- If a job or script behaves differently after your change, say how, and what you ran to see it.

By opening a pull request you agree your change is under the [MIT License](LICENSE).
