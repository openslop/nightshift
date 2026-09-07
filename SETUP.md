# Setup

This page is for the coding agent doing the setup. Follow it in order. Ask the person only for what you cannot find yourself.

## 1. Get the files

Clone `https://github.com/openslop/nightshift` into the person's home folder, as `~/nightshift`.

## 2. Fill in the settings

Copy `nightshift.conf.example` to `nightshift.conf`. Fill in every line. Look in the person's repo first. Ask only for what you cannot find.

- The folder where their repo lives.
- The GitHub name of the repo, like `owner/repo`.
- The main branch name.
- Their GitHub handle.
- The command that runs the repo's checks. Look at the package scripts and the CI workflow. Put the same checks CI runs.
- Which coding agent they use. Pick the matching `AGENT` line and remove the `#` in front.

Leave the rest as it is.

## 3. Check the tools

Make sure these all work for this person, not just for you:

- `gh` is logged in to GitHub.
- The agent command in `AGENT` runs and is logged in.
- `git` can push to the repo.

## 4. Make two timers

Use the normal timer tool for the computer:

- **Linux:** a systemd user timer and service.
- **Mac:** a launchd agent in `~/Library/LaunchAgents`.
- **Windows:** a Task Scheduler task that runs the script inside WSL.
- **Anything else:** two cron lines.

Name them `nightshift-nightly` and `nightshift-review` so they are easy to find later.

Timer one runs `~/nightshift/bin/nightly.sh` once a day at 5:12 in the morning. Give it up to 8 hours to finish.

Timer two runs `~/nightshift/bin/review.sh` every two hours, at 7 minutes past. Give it up to 70 minutes to finish.

Do not let the timers "catch up" on missed runs. If the computer was asleep, the run is skipped. On systemd that means leaving `Persistent` off, which is the default.

## 5. Test it once

In `nightshift.conf`, set `WINDOW_END_HOUR=24` and set `JOBS` to one job, like `security`. Run `~/nightshift/bin/nightly.sh` by hand. Watch the log in the state folder, under `runs/` and today's date. When it works, set both lines back.

## 6. Show the person

Tell them:

- Where the logs are. The state folder is in the settings, under `STATE_DIR`.
- That pull requests will show up on GitHub in the morning, on branches that start with their `BRANCH_PREFIX`.
- That they can change any job by editing its page in `jobs/`.
- How to turn it off: remove the two timers named `nightshift-nightly` and `nightshift-review`.

## Turning it off

Remove the two timers. Nothing else needs to change. The repo is not touched.
