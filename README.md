<p align="center">
  <img src="./assets/nightshift-lockup-animated.svg" alt="Nightshift" width="520">
</p>

<p align="center"><b>Your repo gets better while you sleep.</b></p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/runs%20on-Linux%20%C2%B7%20macOS%20%C2%B7%20Windows-6b6bcf?style=flat" alt="Linux, macOS, Windows">
  <img src="https://img.shields.io/badge/agent-any%20coding%20agent-1c1720?style=flat" alt="Works with any coding agent">
  <img src="https://img.shields.io/badge/deps-bash%20%C2%B7%20git%20%C2%B7%20gh-black?style=flat" alt="bash, git, gh">
</p>

<p align="center">
  <img src="./assets/nightshift-demo.svg" alt="Nightshift runs jobs at night and leaves pull requests by morning" width="100%">
</p>

---

## What it is

Nightshift is a set of timers and job files. Each night it wakes your coding agent (Claude Code, Codex, Cursor, Gemini, Copilot, Hermes, OpenClaw, or any other CLI agent), points it at your repo, and runs a list of jobs one by one. Each job looks for one kind of thing to fix, opens a small PR, or does nothing. Every two hours it also reviews open PRs.

You wake up to a few PRs to read. Most nights, some jobs do nothing. That is by design.

## The jobs

| Job                    | What it looks for                                                   |
| ---------------------- | ------------------------------------------------------------------- |
| `security`             | Real, usable holes. No "just in case" hardening.                    |
| `bugs`                 | Bugs a user would notice. High bar. No nits.                        |
| `maintainability`      | Code that is hard to change. Deeper modules, fewer branches.        |
| `performance`          | Slow spots users feel. Measured. No tiny memo tricks.               |
| `conventions`          | Places that break the repo's own written rules. Safe fixes only.    |
| `conventions-followup` | The rule breaks that need a real change. One theme per night.       |
| `architecture`         | The one big simplification a fresh rebuild would make.              |
| `smoke-tests`          | A few calm end-to-end tests in CI. Usually a no-op.                 |
| `issues`               | One small, clear GitHub issue. Leaves `good first issue` for people. |
| `review` (every 2h)    | Reviews open PRs. Quiet by default. One lgtm per round.             |

Every job follows the same rules in [`jobs/_common.md`](jobs/_common.md). It reads your repo's own guide files first (`CLAUDE.md`, `CONVENTIONS.md`, `AGENTS.md`). It reads your past PR comments to learn your taste. It never touches a file that an open PR touches. It runs your checks. It opens a PR, or says why not.

## Set it up

You need `bash`, `git`, `gh` (logged in), and one coding agent CLI (logged in). See the agent table below.

The fast way: paste this to your coding agent.

> Clone https://github.com/openslop/nightshift into ~/nightshift and follow its README to set up the timers for my repo at ~/code/my-app.

The hand way:

```bash
git clone https://github.com/openslop/nightshift ~/nightshift
cd ~/nightshift
cp nightshift.conf.example nightshift.conf   # then fill it in
bin/install.sh
```

`install.sh` picks the right timer for your machine and turns it on:

- **Linux:** systemd user timers, from [`install/systemd/`](install/systemd).
- **macOS:** launchd agents, from [`install/launchd/`](install/launchd).
- **Anything with cron:** copy the two lines in [`install/cron/crontab.txt`](install/cron/crontab.txt).
- **Windows:** run [`install/windows/install.ps1`](install/windows/install.ps1) in PowerShell. It runs the scripts inside WSL.

Default times: the batch at 05:12, the review at 7 past every even hour. Change them in the timer files.

## For the agent doing the setup

1. Clone this repo. Run `cp nightshift.conf.example nightshift.conf`.
2. Fill in `nightshift.conf`. Ask the user only for what you cannot find: the repo folder, the GitHub `owner/repo`, the main branch, their GitHub handle, and the checks command (look in `package.json` scripts and `.github/workflows` first).
3. Pick the user's agent in `nightshift.conf` (one of the `AGENT=` lines). Make sure `gh auth status` and the agent's own `--version` both work for this user.
4. Run `bin/install.sh`. On Windows, run `install/windows/install.ps1` from PowerShell instead.
5. Test one job by hand: `bin/nightly.sh`. If it is past 8 in the morning it will skip. Set `WINDOW_END_HOUR=24` in the conf while you test, then set it back.
6. Show the user the log folder: `$STATE_DIR/runs/<date>/`.

## How it works

```
bin/nightly.sh     runs each job in JOBS, once per night, one at a time
bin/review.sh      reviews PRs that are new or moved since last time
bin/guard.sh       fails if a branch touches a file any open PR touches
bin/install.sh     writes the timers for this machine
jobs/*.md          one file per job. Plain English. Edit them.
jobs/_common.md    rules every job follows
review/SKILL.md    how the reviewer behaves
install/           timer templates for systemd, launchd, cron, Windows
```

Each job is a prompt. The runner tells the agent your settings, points it at `_common.md` and the job file, and gets out of the way.

Safety rails, all in the scripts:

- One batch per day. A lock stops two from running at once.
- A batch that starts late (laptop was asleep) is dropped, not run at noon.
- The review and the batch share a lock, so they never fight over the working tree.
- The review never checks out a branch. It only reads through `gh`.
- Logs, locks, and ledgers live in `STATE_DIR`, outside your repo.

## Make it yours

- Turn jobs off by removing them from `JOBS` in the conf.
- Change how a job thinks by editing its file in `jobs/`. Keep the language plain.
- Add a job: add `jobs/<name>.md` and put `<name>` in `JOBS`.
- Swap the agent: pick a different `AGENT=` line in the conf.

## Agents

Nightshift runs one command and appends the job prompt as the last argument. Any agent CLI with a non-interactive mode works. These are in the conf, ready to uncomment:

| Agent                | Command                                                            |
| -------------------- | ------------------------------------------------------------------ |
| Claude Code          | `claude -p --dangerously-skip-permissions --max-turns 150`         |
| Codex CLI            | `codex exec --dangerously-bypass-approvals-and-sandbox --skip-git-repo-check` |
| Cursor CLI           | `agent -p --force` (older installs: `cursor-agent`)                |
| Gemini CLI           | `gemini --yolo -p`                                                 |
| GitHub Copilot CLI   | `copilot --allow-all-tools -p`                                     |
| Hermes Agent         | `hermes chat -q`                                                   |
| OpenClaw             | `openclaw agent --local --message`                                 |
| OpenCode             | `opencode run`                                                     |
| Aider                | `aider --yes-always --message`                                     |
| Amp                  | `amp -x --dangerously-allow-all`                                   |
| Goose                | `goose run -t` (with `GOOSE_MODE=auto`)                            |
| Qwen Code            | `qwen --yolo -p`                                                   |
| Factory Droid        | `droid exec --auto high`                                           |
| Cline                | `cline -y`                                                         |

Every line turns off permission prompts. That is required: no one is awake to click yes. Flags change often, so if a run fails, check `<agent> --help` and fix the line.

If your agent reads the prompt from stdin instead of an argument, set `AGENT_STDIN=1`.

Not listed? Add it. The rule is: the command must run one task with no prompts and exit. Open a PR with the line and we will add it to the table.

## Turn it off

```bash
bin/install.sh remove
```

## License

[MIT](LICENSE).
