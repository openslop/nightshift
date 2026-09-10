<p align="center">
  <img src="../../assets/nightshift-lockup-animated.svg" alt="Nightshift" width="520">
</p>

<p align="center">
  <a href="https://github.com/openslop/nightshift"><img src="https://img.shields.io/github/stars/openslop/nightshift?style=flat&amp;label=%E2%98%85&amp;color=6b6bcf" alt="GitHub 星标"></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-6b6bcf?style=flat" alt="许可证：MIT"></a>
  <a href="https://discord.gg/zeP5482ced"><img src="https://img.shields.io/badge/Discord-5865F2?logo=discord&amp;logoColor=white" alt="加入 Nightshift 的 Discord"></a>
  <img src="https://img.shields.io/badge/macOS%20%7C%20Linux%20%7C%20Windows-1c1720?style=flat" alt="可在 macOS、Linux 和 Windows 上运行">
  <img src="https://img.shields.io/badge/works%20with-any%20coding%20agent-6b6bcf?style=flat" alt="适用于任何编码代理">
</p>

<p align="center">
  <sub>中文 · <a href="../../README.md">English</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.pt.md">Português</a></sub>
</p>

<p align="center">
  <strong>你睡觉的时候，代码在变好。</strong><br>
  一个小帮手：夜里叫醒你的编码代理，交给它一件小事，早上留下几个 pull request。
</p>

<h3 align="center"><a href="#如何开始"><ins>一句话就能装好</ins></a></h3>

<p align="center">
  <img src="../../assets/nightshift-demo.svg" alt="Nightshift 在夜里工作，早上留下 pull request" width="100%">
</p>

## 这是什么？

Nightshift 是一个在夜里干活的小帮手。

它叫醒你的编码代理，交给它一件小事。代理看一遍你的代码，把事做完。如果发现了值得修的东西，就开一个 pull request 等你来看。然后去做下一件事。

早上，你看看它做了什么。很多晚上它什么也没发现。这没关系。什么都不改，也好过改坏。

每两个小时，它还会读一遍所有打开的 pull request，留下一条简短的 review。

## 功能

<table>
<tr>
<td width="50%" valign="middle">

### 一次只做一件小事

九个任务，一个接一个跑。安全、bug、可维护性、性能、约定、架构、冒烟测试，还有 issue。每个任务都独占整个代理，只做这一件事。

[看看这些任务 →](#任务)

</td>
<td width="50%">
  <a href="#任务"><img src="../../assets/features/jobs.svg" alt="八个任务依次运行；每一行的结尾是 PR OPEN 或 NO-OP" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### 早上就有 pull request

它只会开 pull request。不会往 main 推代码。不会自己合并。你端着咖啡看一看，喜欢的就合并。

[安全吗？ →](#安全吗)

</td>
<td width="50%">
  <a href="#安全吗"><img src="../../assets/features/morning.svg" alt="时钟从 05:12 走到 07:31，四个 pull request 陆续出现" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### 每两小时来一位审阅者

第二个定时器会读你打开的 pull request，留下一条简短的 review。没发现问题时，它不出声。

[审阅者怎么做事 →](../../review/SKILL.md)

</td>
<td width="50%">
  <a href="../../review/SKILL.md"><img src="../../assets/features/review.svg" alt="一整天的时间线每两小时跳一格；大多数时候安静无事，有两次留下了备注" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### 不碍你的事

推送之前，一道守卫会把每个文件和每个打开的 pull request 对一遍。如果队友已经在改某个文件，任务就放弃那处改动，并且告诉你。

[每个任务都遵守的规则 →](../../jobs/_common.md)

</td>
<td width="50%">
  <a href="../../jobs/_common.md"><img src="../../assets/features/guard.svg" alt="守卫把一个被打开的 pull request 碰过的文件标记为禁止修改" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### 控制台

每一夜、每个任务，都在一个屏幕上。一个时钟，一个显示最近四十夜的雷达，还有一张网格，记录每个任务做了什么。只需要 Node，别的都不用。

[打开控制台 →](../../tui/README.md)

</td>
<td width="50%">
  <a href="../../tui/README.md"><img src="../../assets/features/console.svg" alt="控制台的三个面板：一个时钟、一次雷达扫描，以及按任务和夜晚排列的点阵" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### 接着聊

在任意任务上按 `c`，控制台就会重新打开那一夜的对话记录。问问代理为什么这么做。告诉它接下来做什么。

[继续一段对话 →](../../tui/README.md#continue-a-conversation)

</td>
<td width="50%">
  <a href="../../tui/README.md#continue-a-conversation"><img src="../../assets/features/resume.svg" alt="按下 c 打开一个终端，运行 claude --resume，代理从停下的地方接着做" width="100%"></a>
</td>
</tr>
</table>

**盒子里还有：**

- **[大白话写的任务](../../jobs)** — 每个任务就是一页大白话。读一读。改一改。加你自己的。
- **[学习你的口味](../../jobs/_common.md)** — 任务开始前，会先读你在以前的 pull request 上说过的话。
- **[跑你的检查](../../nightshift.conf.example)** — Lint、类型检查、测试。每个任务都得先让它们通过，才能开任何东西。
- **[跳过你的工作时间](../../nightshift.conf.example)** — 如果你的笔记本睡着了，这一夜就跳过。它绝不会在你白天工作时跑起来。
- **[日志放在仓库外面](../../SETUP.md)** — 它做的每件事都写在你电脑上的一个文件夹里，不在你的代码里。

---

## 任务

| 任务                   | 它找什么                                                                   |
| ---------------------- | -------------------------------------------------------------------------- |
| `security`             | 坏人真能利用的漏洞。不是"也许哪天会出事"的担心。                           |
| `bugs`                 | 用户会注意到的 bug。只挑明确的。                                           |
| `maintainability`      | 难以修改的代码。把它变简单。                                               |
| `performance`          | 人们能感觉到的慢。先测量，再动手。                                         |
| `conventions`          | 违反你自己写下的规则的地方。只做安全的修复。                               |
| `conventions-followup` | 那些需要真正改动才能修好的违规。一晚只做一个主题。                         |
| `architecture`         | 让代码变得更简单的那一个大方向。                                           |
| `smoke-tests`          | 几个安静的测试，检查应用还能打开。通常什么也不做。                         |
| `issues`               | 一个小而清楚的 GitHub issue。简单的留给新人。                              |
| `review`               | 每两小时读一遍打开的 pull request。没发现问题时不出声。                    |

每个任务都遵守同样的规则。规则写在 [`jobs/_common.md`](../../jobs/_common.md) 里。简单说：

- 先读仓库自己的指南文件。以它们为准。
- 读仓库主人在以前的 pull request 上说过的话。学习他的口味。
- 绝不碰别人打开的 pull request 正在改的文件。
- 跑仓库的检查。坏了就修。
- 开一个 pull request，或者说明为什么不开。绝不往 main 分支推代码。

---

## 支持的代理

适用于**任何编码代理**，只要它能在终端里不问问题地跑起来。在 [`nightshift.conf.example`](../../nightshift.conf.example) 里选对应的 `AGENT` 那一行。

<p>
  <a href="https://docs.anthropic.com/claude/docs/claude-code"><kbd><img src="https://www.google.com/s2/favicons?domain=anthropic.com&amp;sz=64" alt="Claude Code 标志" width="16" valign="middle"> Claude Code</kbd></a> &nbsp;
  <a href="https://github.com/openai/codex"><kbd><img src="https://www.google.com/s2/favicons?domain=openai.com&amp;sz=64" alt="Codex 标志" width="16" valign="middle"> Codex</kbd></a> &nbsp;
  <a href="https://cursor.com/cli"><kbd><img src="https://www.google.com/s2/favicons?domain=cursor.com&amp;sz=64" alt="Cursor 标志" width="16" valign="middle"> Cursor</kbd></a> &nbsp;
  <a href="https://github.com/google-gemini/gemini-cli"><kbd><img src="https://www.google.com/s2/favicons?domain=gemini.google.com&amp;sz=64" alt="Gemini CLI 标志" width="16" valign="middle"> Gemini CLI</kbd></a> &nbsp;
  <a href="https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli"><kbd><img src="https://www.google.com/s2/favicons?domain=github.com&amp;sz=64" alt="GitHub Copilot 标志" width="16" valign="middle"> GitHub Copilot</kbd></a> &nbsp;
  <a href="https://hermes-agent.nousresearch.com/docs/"><kbd><img src="https://www.google.com/s2/favicons?domain=nousresearch.com&amp;sz=64" alt="Hermes Agent 标志" width="16" valign="middle"> Hermes</kbd></a> &nbsp;
  <a href="https://github.com/openclaw/openclaw"><kbd><img src="https://www.google.com/s2/favicons?domain=openclaw.ai&amp;sz=64" alt="OpenClaw 标志" width="16" valign="middle"> OpenClaw</kbd></a> &nbsp;
  <a href="https://opencode.ai/docs/cli/"><kbd><img src="https://www.google.com/s2/favicons?domain=opencode.ai&amp;sz=64" alt="OpenCode 标志" width="16" valign="middle"> OpenCode</kbd></a> &nbsp;
  <a href="https://aider.chat/"><kbd><img src="https://www.google.com/s2/favicons?domain=aider.chat&amp;sz=64" alt="Aider 标志" width="16" valign="middle"> Aider</kbd></a> &nbsp;
  <a href="https://ampcode.com/manual#install"><kbd><img src="https://www.google.com/s2/favicons?domain=ampcode.com&amp;sz=64" alt="Amp 标志" width="16" valign="middle"> Amp</kbd></a> &nbsp;
  <a href="https://block.github.io/goose/docs/quickstart/"><kbd><img src="https://www.google.com/s2/favicons?domain=goose-docs.ai&amp;sz=64" alt="Goose 标志" width="16" valign="middle"> Goose</kbd></a> &nbsp;
  <a href="https://github.com/QwenLM/qwen-code"><kbd><img src="https://www.google.com/s2/favicons?domain=qwenlm.github.io&amp;sz=64" alt="Qwen Code 标志" width="16" valign="middle"> Qwen Code</kbd></a> &nbsp;
  <a href="https://docs.factory.ai/cli/getting-started/quickstart"><kbd><img src="https://www.google.com/s2/favicons?domain=factory.ai&amp;sz=64" alt="Droid 标志" width="16" valign="middle"> Droid</kbd></a> &nbsp;
  <a href="https://docs.cline.bot/cline-cli/overview"><kbd><img src="https://www.google.com/s2/favicons?domain=cline.bot&amp;sz=64" alt="Cline 标志" width="16" valign="middle"> Cline</kbd></a> &nbsp;
  <kbd>+ 任何带"全部同意"选项的代理</kbd>
</p>

---

## 如何开始

对你的编码代理说这句话：

> Get github.com/openslop/nightshift and set it up for my code at ~/code/my-app. Read SETUP.md there and follow it.

（意思是：获取 github.com/openslop/nightshift，为我在 ~/code/my-app 的代码装好它。读那里的 SETUP.md 并照着做。）

就这样。你的代理会问你几个问题，在你的电脑上设两个定时器，然后告诉你笔记放在哪里。

支持 macOS、Linux 和 Windows。如果你想自己动手，[`SETUP.md`](../../SETUP.md) 就是你的代理照着做的那一页。

### 看着它跑

<p align="center">
  <img src="../../assets/nightshift-console.png" alt="Nightshift 控制台" width="100%">
</p>

对你的编码代理说：

> Open the Nightshift console. Read ~/nightshift/tui/README.md and start it.

（意思是：打开 Nightshift 控制台。读 ~/nightshift/tui/README.md 并启动它。）

它需要 Node。在任务上按 `c`，就能和代理聊聊它做了什么。按 `?` 看其他操作。

## 里面有什么

- [`jobs/`](../../jobs) 每个任务一页，用大白话写。读一读。想改就改。
- [`jobs/_common.md`](../../jobs/_common.md) 是每个任务都遵守的规则。
- [`review/SKILL.md`](../../review/SKILL.md) 说明审阅者怎么做事。
- [`nightshift.conf.example`](../../nightshift.conf.example) 是设置页。你的代理会填一份副本。
- [`SETUP.md`](../../SETUP.md) 是你的代理照着做安装的那一页。
- [`bin/`](../../bin) 有三个小脚本，由定时器运行。你不用读它们。
- [`tui/`](../../tui) 是控制台。[`tui/README.md`](../../tui/README.md) 说明怎么打开它。

## 安全吗？

- 它只会开 pull request。合并什么，由你决定。
- 它绝不碰别的打开的 pull request 正在改的文件。
- 开任何东西之前，它都会先跑你的检查。
- 它一晚只跑一次。如果你的电脑睡着了，它就跳过那一夜，而不是在你白天工作时跑起来。
- 它做的每件事都写进你电脑上的日志里，在仓库外面。

## 改一改

- 想关掉某个任务，就把它的名字从设置里的 `JOBS` 那一行去掉。
- 想改变某个任务的思路，就编辑它在 `jobs/` 里的那一页。用词保持简单。
- 想加一个任务，就在 `jobs/` 里加一页，再把名字写进 `JOBS`。
- 想换一个代理，就在设置里选另一行 `AGENT`。

## 关掉它

对你的代理说："关掉 Nightshift。"它会删掉那两个定时器。你的代码不会被动。

---

## 社区与支持

- **Discord：** 到 **[Discord](https://discord.gg/zeP5482ced)** 加入社区。
- **想法和 bug：** 缺一个任务？有一夜出了问题？[开一个 issue](https://github.com/openslop/nightshift/issues)。
- **分享任务：** 写了一页好用的任务？开一个 pull request，把它放进 `jobs/`。
- **表示支持：** 给这个仓库点个 [Star](https://github.com/openslop/nightshift)，跟着看进展。

---

## 开发

想加任务、修脚本，或者改控制台？看 [CONTRIBUTING.md](../../CONTRIBUTING.md)。

Nightshift 就是一些 shell 脚本、几页纯文本的任务说明，加一个没有任何依赖的 Node 控制台。没有构建步骤。

<a href="https://github.com/openslop/nightshift/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=openslop/nightshift" alt="Nightshift 贡献者">
</a>

## Star 历史

<p align="center">
  <a href="https://star-history.com/#openslop/nightshift&Date">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=openslop/nightshift&amp;type=Date&amp;theme=dark">
      <img src="https://api.star-history.com/svg?repos=openslop/nightshift&amp;type=Date" alt="openslop/nightshift 的 GitHub star 历史图" width="880">
    </picture>
  </a>
</p>

## 许可证

Nightshift 是自由开源软件，采用 [MIT 许可证](../../LICENSE)。用它，复制它，改它。
