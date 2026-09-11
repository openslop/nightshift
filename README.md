<p align="center">
  <img src="./assets/nightshift-lockup-animated.svg" alt="Nightshift" width="520">
</p>

<p align="center">
  <a href="https://github.com/openslop/nightshift"><img src="https://img.shields.io/github/stars/openslop/nightshift?style=flat&amp;label=%E2%98%85&amp;color=6b6bcf" alt="GitHub stars"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-6b6bcf?style=flat" alt="License: MIT"></a>
  <a href="https://discord.gg/zeP5482ced"><img src="https://img.shields.io/badge/Discord-5865F2?logo=discord&amp;logoColor=white" alt="Join the Nightshift Discord"></a>
  <img src="https://img.shields.io/badge/macOS%20%7C%20Linux%20%7C%20Windows-1c1720?style=flat" alt="Runs on macOS, Linux, and Windows">
  <img src="https://img.shields.io/badge/works%20with-any%20coding%20agent-6b6bcf?style=flat" alt="Works with any coding agent">
</p>

<p align="center">
  <sub><a href="docs/readme/README.zh-CN.md">中文</a> · <a href="docs/readme/README.ja.md">日本語</a> · <a href="docs/readme/README.ko.md">한국어</a> · <a href="docs/readme/README.es.md">Español</a> · <a href="docs/readme/README.fr.md">Français</a> · <a href="docs/readme/README.pt.md">Português</a></sub>
</p>

<p align="center">
  <strong>Your code gets better while you sleep.</strong><br>
  A helper that wakes your coding agent at night, gives it one small job, and leaves pull requests by morning.
</p>

<h3 align="center"><a href="#how-to-start"><ins>Set it up in one sentence</ins></a></h3>

<p align="center">
  <img src="./assets/nightshift-demo.svg" alt="Nightshift works at night and leaves pull requests by morning" width="100%">
</p>

## What is this?

Nightshift is a helper that works at night.

It wakes up your coding agent. It gives the agent one small job. The agent looks at your code and does the job. If it finds something worth fixing, it opens a pull request for you to look at. Then it moves to the next job.

In the morning, you read what it did. Many nights it finds nothing. That is fine. Nothing is better than a bad change.

Every two hours, it also reads any open pull requests and leaves a short review.

## Features

<table>
<tr>
<td width="50%" valign="middle">

### One small job at a time

Ten jobs, run one after another. Security, bugs, readability, maintainability, performance, conventions, architecture, smoke tests, and issues. Each gets the whole agent for one job and nothing else.

[The jobs →](#the-jobs)

</td>
<td width="50%">
  <a href="#the-jobs"><img src="./assets/features/jobs.svg" alt="Eight jobs run one after another; each row ends in PR OPEN or NO-OP" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### Pull requests by morning

It only ever opens pull requests. Nothing pushes to main. Nothing merges by itself. You read them with coffee and merge what you like.

[Is it safe? →](#is-it-safe)

</td>
<td width="50%">
  <a href="#is-it-safe"><img src="./assets/features/morning.svg" alt="A clock runs from 05:12 to 07:31 while four pull requests appear" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### A reviewer every two hours

A second timer reads your open pull requests and leaves a short review. It is quiet unless it finds something.

[How the reviewer acts →](review/SKILL.md)

</td>
<td width="50%">
  <a href="review/SKILL.md"><img src="./assets/features/review.svg" alt="A day-long timeline ticks every two hours; most ticks are quiet, two leave a note" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### Stays out of your way

Before it pushes, a guard checks every file against every open pull request. If a teammate is already in a file, the job drops that change and says so.

[The rules every job follows →](jobs/_common.md)

</td>
<td width="50%">
  <a href="jobs/_common.md"><img src="./assets/features/guard.svg" alt="The guard marks a file touched by an open pull request as off limits" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### The console

Every night and every job on one screen. A clock, a radar of the last forty nights, and a grid of what each job did. Needs Node and nothing else.

[Open the console →](tui/README.md)

</td>
<td width="50%">
  <a href="tui/README.md"><img src="./assets/features/console.svg" alt="Three console panels: a clock, a radar sweep, and a job-by-night dot matrix" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### Pick up the conversation

Press `c` on any job and the console reopens that night's transcript. Ask the agent why it did what it did. Tell it what to do next.

[Continue a conversation →](tui/README.md#continue-a-conversation)

</td>
<td width="50%">
  <a href="tui/README.md#continue-a-conversation"><img src="./assets/features/resume.svg" alt="Pressing c opens a terminal with claude --resume and the agent picks up where it stopped" width="100%"></a>
</td>
</tr>
</table>

**Also in the box:**

- **[Plain-English jobs](jobs)** — Every job is one page of plain words. Read them. Change them. Add your own.
- **[Learns your taste](jobs/_common.md)** — Jobs read what you said on past pull requests before they start.
- **[Runs your checks](nightshift.conf.example)** — Lint, typecheck, tests. Every job must make them pass before it opens anything.
- **[Skips your workday](nightshift.conf.example)** — If your laptop was asleep, the night is skipped. It never runs in the middle of your day.
- **[Logs outside your repo](SETUP.md)** — Everything it does is written to a folder on your computer, not in your code.

---

## The jobs

| Job                    | What it looks for                                                          |
| ---------------------- | -------------------------------------------------------------------------- |
| `security`             | Real holes a bad actor could use. Not "maybe someday" worries.             |
| `bugs`                 | Bugs a user would notice. Only clear ones.                                 |
| `readability`          | Names that say nothing. Code that takes a second read. Fewer lines, not more. |
| `maintainability`      | Code that is hard to change. It makes it simpler.                          |
| `performance`          | Slow spots people feel. It measures first.                                 |
| `conventions`          | Places that break your own written rules. Safe fixes only.                 |
| `conventions-followup` | The rule breaks that need a real change. One theme a night.                |
| `architecture`         | The one big way the code could be simpler.                                 |
| `smoke-tests`          | A few calm tests that check the app still opens. Usually does nothing.     |
| `issues`               | One small, clear GitHub issue. Leaves the easy ones for new people.        |
| `review`               | Reads open pull requests every two hours. Quiet unless it finds something. |

Every job follows the same rules. They are in [`jobs/_common.md`](jobs/_common.md). In short:

- Read the repo's own guide files first. They win.
- Read what the owner said on past pull requests. Learn their taste.
- Never touch a file that someone else's open pull request touches.
- Run the repo's checks. Fix what breaks.
- Open a pull request, or say why not. Never push to the main branch.

---

## Supported agents

Works with **any coding agent** that can run from a terminal without asking questions. Pick the matching `AGENT` line in [`nightshift.conf.example`](nightshift.conf.example).

<p>
  <a href="https://docs.anthropic.com/claude/docs/claude-code"><kbd><img src="https://www.google.com/s2/favicons?domain=anthropic.com&amp;sz=64" alt="Claude Code logo" width="16" valign="middle"> Claude Code</kbd></a> &nbsp;
  <a href="https://github.com/openai/codex"><kbd><img src="https://www.google.com/s2/favicons?domain=openai.com&amp;sz=64" alt="Codex logo" width="16" valign="middle"> Codex</kbd></a> &nbsp;
  <a href="https://cursor.com/cli"><kbd><img src="https://www.google.com/s2/favicons?domain=cursor.com&amp;sz=64" alt="Cursor logo" width="16" valign="middle"> Cursor</kbd></a> &nbsp;
  <a href="https://github.com/google-gemini/gemini-cli"><kbd><img src="https://www.google.com/s2/favicons?domain=gemini.google.com&amp;sz=64" alt="Gemini CLI logo" width="16" valign="middle"> Gemini CLI</kbd></a> &nbsp;
  <a href="https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli"><kbd><img src="https://www.google.com/s2/favicons?domain=github.com&amp;sz=64" alt="GitHub Copilot logo" width="16" valign="middle"> GitHub Copilot</kbd></a> &nbsp;
  <a href="https://hermes-agent.nousresearch.com/docs/"><kbd><img src="https://www.google.com/s2/favicons?domain=nousresearch.com&amp;sz=64" alt="Hermes Agent logo" width="16" valign="middle"> Hermes</kbd></a> &nbsp;
  <a href="https://github.com/openclaw/openclaw"><kbd><img src="https://www.google.com/s2/favicons?domain=openclaw.ai&amp;sz=64" alt="OpenClaw logo" width="16" valign="middle"> OpenClaw</kbd></a> &nbsp;
  <a href="https://opencode.ai/docs/cli/"><kbd><img src="https://www.google.com/s2/favicons?domain=opencode.ai&amp;sz=64" alt="OpenCode logo" width="16" valign="middle"> OpenCode</kbd></a> &nbsp;
  <a href="https://aider.chat/"><kbd><img src="https://www.google.com/s2/favicons?domain=aider.chat&amp;sz=64" alt="Aider logo" width="16" valign="middle"> Aider</kbd></a> &nbsp;
  <a href="https://ampcode.com/manual#install"><kbd><img src="https://www.google.com/s2/favicons?domain=ampcode.com&amp;sz=64" alt="Amp logo" width="16" valign="middle"> Amp</kbd></a> &nbsp;
  <a href="https://block.github.io/goose/docs/quickstart/"><kbd><img src="https://www.google.com/s2/favicons?domain=goose-docs.ai&amp;sz=64" alt="Goose logo" width="16" valign="middle"> Goose</kbd></a> &nbsp;
  <a href="https://github.com/QwenLM/qwen-code"><kbd><img src="https://www.google.com/s2/favicons?domain=qwenlm.github.io&amp;sz=64" alt="Qwen Code logo" width="16" valign="middle"> Qwen Code</kbd></a> &nbsp;
  <a href="https://docs.factory.ai/cli/getting-started/quickstart"><kbd><img src="https://www.google.com/s2/favicons?domain=factory.ai&amp;sz=64" alt="Droid logo" width="16" valign="middle"> Droid</kbd></a> &nbsp;
  <a href="https://docs.cline.bot/cline-cli/overview"><kbd><img src="https://www.google.com/s2/favicons?domain=cline.bot&amp;sz=64" alt="Cline logo" width="16" valign="middle"> Cline</kbd></a> &nbsp;
  <kbd>+ any agent with a "yes to everything" flag</kbd>
</p>

---

## How to start

Tell your coding agent this:

> Get github.com/openslop/nightshift and set it up for my code at ~/code/my-app. Read SETUP.md there and follow it.

That is it. Your agent will ask you a few questions, set two timers on your computer, and show you where the notes go.

Works on macOS, Linux, and Windows. If you would rather do it by hand, [`SETUP.md`](SETUP.md) is the page your agent follows.

### Watch it

<p align="center">
  <img src="./assets/nightshift-console.png" alt="The Nightshift console" width="100%">
</p>

Tell your coding agent:

> Open the Nightshift console. Read ~/nightshift/tui/README.md and start it.

It needs Node. Press `c` on a job to talk to the agent about what it did. Press `?` for the rest.

## What is inside

- [`jobs/`](jobs) has one page per job, in plain English. Read them. Change them if you want.
- [`jobs/_common.md`](jobs/_common.md) has the rules every job follows.
- [`review/SKILL.md`](review/SKILL.md) says how the reviewer acts.
- [`nightshift.conf.example`](nightshift.conf.example) is the settings page. Your agent fills in a copy.
- [`SETUP.md`](SETUP.md) is the page your agent follows to set things up.
- [`bin/`](bin) has three small scripts the timers run. You do not need to read them.
- [`tui/`](tui) is the console. [`tui/README.md`](tui/README.md) says how to open it.

## Is it safe?

- It only ever opens pull requests. You decide what gets merged.
- It never touches a file that another open pull request touches.
- It runs your checks before it opens anything.
- It runs once a night. If your computer was asleep, it skips that night instead of running in the middle of your day.
- Everything it does is written to a log on your computer, outside your repo.

## Change it

- Turn a job off by taking its name out of the `JOBS` line in your settings.
- Change how a job thinks by editing its page in `jobs/`. Keep the words plain.
- Add a job by adding a new page in `jobs/` and putting its name in `JOBS`.
- Run a job at its own hour by giving its name to the script from a timer of its own: `bin/nightly.sh readability`. The night batch then skips it.
- Use a different agent by picking a different `AGENT` line in your settings.

## Turn it off

Tell your agent: "Turn off Nightshift." It removes the two timers. Your code is not touched.

---

## Community &amp; support

- **Discord:** Join the community on **[Discord](https://discord.gg/zeP5482ced)**.
- **Ideas and bugs:** Missing a job? Found a night that went wrong? [Open an issue](https://github.com/openslop/nightshift/issues).
- **Share a job:** Wrote a job page that works well? Open a pull request and put it in `jobs/`.
- **Show support:** [Star](https://github.com/openslop/nightshift) this repo to follow along.

---

## Developing

Want to add a job, fix a script, or work on the console? See [CONTRIBUTING.md](CONTRIBUTING.md).

Nightshift is shell scripts, plain-text job pages, and a Node console with no dependencies. There is no build step.

<a href="https://github.com/openslop/nightshift/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=openslop/nightshift" alt="Nightshift contributors">
</a>

## Star history

<p align="center">
  <a href="https://star-history.com/#openslop/nightshift&Date">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=openslop/nightshift&amp;type=Date&amp;theme=dark">
      <img src="https://api.star-history.com/svg?repos=openslop/nightshift&amp;type=Date" alt="GitHub star history chart for openslop/nightshift" width="880">
    </picture>
  </a>
</p>

## License

Nightshift is free and open source under the [MIT License](LICENSE). Use it, copy it, change it.
