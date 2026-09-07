<p align="center">
  <img src="./assets/nightshift-lockup-animated.svg" alt="Nightshift" width="520">
</p>

<p align="center"><b>Your code gets better while you sleep.</b></p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/runs%20on-Mac%20%C2%B7%20Linux%20%C2%B7%20Windows-6b6bcf?style=flat" alt="Mac, Linux, Windows">
  <img src="https://img.shields.io/badge/works%20with-any%20coding%20agent-1c1720?style=flat" alt="Works with any coding agent">
</p>

<p align="center">
  <img src="./assets/nightshift-demo.svg" alt="Nightshift works at night and leaves pull requests by morning" width="100%">
</p>

---

## What is this?

Nightshift is a helper that works at night.

It wakes up your coding agent. It gives the agent one small job. The agent looks at your code and does the job. If it finds something worth fixing, it opens a pull request for you to look at. Then it moves to the next job.

In the morning, you read what it did. Many nights it finds nothing. That is fine. Nothing is better than a bad change.

Every two hours, it also reads any open pull requests and leaves a short review.

## The jobs

| Job                    | What it looks for                                                          |
| ---------------------- | -------------------------------------------------------------------------- |
| `security`             | Real holes a bad actor could use. Not "maybe someday" worries.             |
| `bugs`                 | Bugs a user would notice. Only clear ones.                                 |
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

## How to start

Tell your coding agent this:

> Get github.com/openslop/nightshift and set it up for my code at ~/code/my-app. Read SETUP.md there and follow it.

That is it. Your agent will ask you a few questions, set two timers on your computer, and show you where the notes go.

Works on Mac, Linux, and Windows. Works with Claude Code, Codex, Cursor, Gemini, Copilot, Hermes, OpenClaw, and most other coding agents. The full list is in [`nightshift.conf.example`](nightshift.conf.example).

## What is inside

- [`jobs/`](jobs) has one page per job, in plain English. Read them. Change them if you want.
- [`jobs/_common.md`](jobs/_common.md) has the rules every job follows.
- [`review/SKILL.md`](review/SKILL.md) says how the reviewer acts.
- [`nightshift.conf.example`](nightshift.conf.example) is the settings page. Your agent fills in a copy.
- [`SETUP.md`](SETUP.md) is the page your agent follows to set things up.
- [`bin/`](bin) has three small scripts the timers run. You do not need to read them.

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
- Use a different agent by picking a different `AGENT` line in your settings.

## Turn it off

Tell your agent: "Turn off Nightshift." It removes the two timers. Your code is not touched.

## License

[MIT](LICENSE). Free to use, copy, and change.
