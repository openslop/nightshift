# The console

A screen that shows what Nightshift did, and lets you pick up any night's conversation.

<p align="center"><img src="../assets/nightshift-console.png" alt="The Nightshift console" width="100%"></p>

## Start it

Tell your coding agent:

> Open the Nightshift console at ~/nightshift/tui. Read its README and start it.

Or yourself, with Node 18 or newer installed:

```
node ~/nightshift/tui/bin/nightshift-tui            # in this terminal
node ~/nightshift/tui/bin/nightshift-tui --launch   # in a new, bigger window
node ~/nightshift/tui/bin/nightshift-tui --demo     # a made-up month, for a look around
```

It reads your `nightshift.conf` for where the logs are and which repo they belong to. No install, no dependencies.

## What you see

- **Left:** the clock, a moon that fills up as the next night gets close, a 3D field of every night and job (taller means it took longer), and one dot per night.
- **Middle:** tonight's timeline, the list of jobs with what each one did, and a grid of jobs by night.
- **Right:** a radar of the last 40 nights, the pull requests the reviewer is tracking, and the errors.
- **On a wide screen:** charts. How many pull requests, how often a job finds something, how long nights take, what the reviewer said.

Bigger windows show more. Small ones show the middle only.

## Keys

```
↑ ↓        pick a job              c    continue this night's conversation
← →        older / newer night     r    the reviewer's shifts
↵          read the report         d    the 3D field, full screen
m          the charts              t    green screen on / off
?          help                    q    quit
```

## Continue a conversation

Press `c` on a job. If the agent was Claude Code and its transcript is still on disk, the console
opens it again with `claude --resume`, in a copy, so the original stays as it was. If not, it opens a
fresh Claude Code and hands it the job's report to start from. When you leave that conversation, the
console comes back.

## Make it look the part

The console leaves the background unpainted, so a see-through terminal shows its blur behind it.
On GNOME with Ptyxis, `scripts/setup-gnome.sh` sets that up with a sci-fi font. `--revert` puts it back.
