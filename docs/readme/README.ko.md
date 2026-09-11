<p align="center">
  <img src="../../assets/nightshift-lockup-animated.svg" alt="Nightshift" width="520">
</p>

<p align="center">
  <a href="https://github.com/openslop/nightshift"><img src="https://img.shields.io/github/stars/openslop/nightshift?style=flat&amp;label=%E2%98%85&amp;color=6b6bcf" alt="GitHub 스타"></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-6b6bcf?style=flat" alt="라이선스: MIT"></a>
  <a href="https://discord.gg/zeP5482ced"><img src="https://img.shields.io/badge/Discord-5865F2?logo=discord&amp;logoColor=white" alt="Nightshift Discord에 참여하기"></a>
  <img src="https://img.shields.io/badge/macOS%20%7C%20Linux%20%7C%20Windows-1c1720?style=flat" alt="macOS, Linux, Windows에서 실행됩니다">
  <img src="https://img.shields.io/badge/works%20with-any%20coding%20agent-6b6bcf?style=flat" alt="어떤 코딩 에이전트와도 함께 쓸 수 있습니다">
</p>

<p align="center">
  <sub><a href="../../README.md">English</a> · <a href="README.zh-CN.md">中文</a> · <a href="README.ja.md">日本語</a> · 한국어 · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.pt.md">Português</a></sub>
</p>

<p align="center">
  <strong>자는 동안 코드가 좋아집니다.</strong><br>
  밤에 코딩 에이전트를 깨워서 작은 일 하나를 맡기고, 아침이면 풀 리퀘스트를 남겨 두는 도우미입니다.
</p>

<h3 align="center"><a href="#시작하는-법"><ins>한 문장으로 설정하기</ins></a></h3>

<p align="center">
  <img src="../../assets/nightshift-demo.svg" alt="Nightshift는 밤에 일하고 아침이면 풀 리퀘스트를 남깁니다" width="100%">
</p>

## 이게 뭔가요?

Nightshift는 밤에 일하는 도우미입니다.

코딩 에이전트를 깨웁니다. 에이전트에게 작은 일 하나를 맡깁니다. 에이전트는 코드를 살펴보고 그 일을 합니다. 고칠 만한 게 있으면, 여러분이 볼 수 있도록 풀 리퀘스트를 엽니다. 그리고 다음 일로 넘어갑니다.

아침에 여러분은 에이전트가 한 일을 읽습니다. 아무것도 못 찾는 밤도 많습니다. 괜찮습니다. 나쁜 변경보다는 아무것도 없는 편이 낫습니다.

두 시간마다, 열려 있는 풀 리퀘스트도 읽고 짧은 리뷰를 남깁니다.

## 기능

<table>
<tr>
<td width="50%" valign="middle">

### 한 번에 작은 일 하나

열 가지 작업이 하나씩 차례로 돌아갑니다. 보안, 버그, 가독성, 유지보수성, 성능, 규칙, 아키텍처, 스모크 테스트, 이슈. 각 작업은 에이전트 전체를 그 일 하나에만 씁니다.

[작업 목록 →](#작업-목록)

</td>
<td width="50%">
  <a href="#작업-목록"><img src="../../assets/features/jobs.svg" alt="여덟 가지 작업이 차례로 돌아가고, 각 줄은 PR OPEN 또는 NO-OP으로 끝납니다" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### 아침이면 풀 리퀘스트

풀 리퀘스트만 엽니다. main에 아무것도 푸시하지 않습니다. 저절로 머지되는 것도 없습니다. 커피와 함께 읽고 마음에 드는 것만 머지하면 됩니다.

[안전한가요? →](#안전한가요)

</td>
<td width="50%">
  <a href="#안전한가요"><img src="../../assets/features/morning.svg" alt="시계가 05:12에서 07:31까지 가는 동안 풀 리퀘스트 네 개가 나타납니다" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### 두 시간마다 오는 리뷰어

두 번째 타이머가 열려 있는 풀 리퀘스트를 읽고 짧은 리뷰를 남깁니다. 뭔가 찾지 않는 한 조용합니다.

[리뷰어가 일하는 방식 →](../../review/SKILL.md)

</td>
<td width="50%">
  <a href="../../review/SKILL.md"><img src="../../assets/features/review.svg" alt="하루짜리 타임라인이 두 시간마다 째깍이고, 대부분은 조용하며 두 번만 메모를 남깁니다" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### 방해하지 않습니다

푸시하기 전에, 가드가 모든 파일을 열려 있는 모든 풀 리퀘스트와 대조합니다. 팀원이 이미 어떤 파일을 건드리고 있으면, 그 변경은 버리고 그렇게 했다고 알립니다.

[모든 작업이 따르는 규칙 →](../../jobs/_common.md)

</td>
<td width="50%">
  <a href="../../jobs/_common.md"><img src="../../assets/features/guard.svg" alt="가드가 열려 있는 풀 리퀘스트가 건드린 파일을 손대지 말아야 할 파일로 표시합니다" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### 콘솔

모든 밤과 모든 작업을 한 화면에. 시계, 지난 40일 밤의 레이더, 그리고 각 작업이 무엇을 했는지 보여 주는 격자. Node만 있으면 됩니다.

[콘솔 열기 →](../../tui/README.md)

</td>
<td width="50%">
  <a href="../../tui/README.md"><img src="../../assets/features/console.svg" alt="콘솔 패널 세 개: 시계, 레이더 스윕, 밤별 작업 점 행렬" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### 대화 이어가기

아무 작업에서나 `c`를 누르면 콘솔이 그날 밤의 대화 기록을 다시 엽니다. 에이전트에게 왜 그렇게 했는지 물어보세요. 다음에 뭘 할지 말해 주세요.

[대화 이어가기 →](../../tui/README.md#continue-a-conversation)

</td>
<td width="50%">
  <a href="../../tui/README.md#continue-a-conversation"><img src="../../assets/features/resume.svg" alt="c를 누르면 claude --resume이 실행된 터미널이 열리고 에이전트가 멈춘 곳에서 이어갑니다" width="100%"></a>
</td>
</tr>
</table>

**함께 들어 있는 것:**

- **[쉬운 말로 쓴 작업](../../jobs)** — 모든 작업은 쉬운 말로 쓴 한 페이지입니다. 읽어 보세요. 고쳐 보세요. 직접 추가해 보세요.
- **[취향을 배웁니다](../../jobs/_common.md)** — 작업은 시작하기 전에 여러분이 지난 풀 리퀘스트에서 한 말을 읽습니다.
- **[검사를 돌립니다](../../nightshift.conf.example)** — 린트, 타입체크, 테스트. 모든 작업은 무언가를 열기 전에 이것들을 통과해야 합니다.
- **[낮 시간은 건너뜁니다](../../nightshift.conf.example)** — 노트북이 잠들어 있었다면 그날 밤은 건너뜁니다. 한낮에 돌아가는 일은 없습니다.
- **[로그는 저장소 밖에](../../SETUP.md)** — 하는 일 전부가 코드가 아니라 컴퓨터의 폴더에 기록됩니다.

---

## 작업 목록

| 작업                   | 찾는 것                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| `security`             | 나쁜 사람이 실제로 쓸 수 있는 구멍. "언젠가 혹시" 같은 걱정은 아닙니다.    |
| `bugs`                 | 사용자가 알아챌 버그. 확실한 것만.                                         |
| `readability`          | 뜻이 없는 이름. 두 번 읽어야 하는 코드. 줄을 늘리지 않고 줄입니다.            |
| `maintainability`      | 바꾸기 어려운 코드. 더 단순하게 만듭니다.                                  |
| `performance`          | 사람이 느끼는 느린 곳. 먼저 측정합니다.                                    |
| `conventions`          | 여러분이 직접 적어 둔 규칙을 어긴 곳. 안전한 수정만.                       |
| `conventions-followup` | 진짜 변경이 필요한 규칙 위반. 하룻밤에 한 가지 주제.                       |
| `architecture`         | 코드가 더 단순해질 수 있는 가장 큰 방법 하나.                              |
| `smoke-tests`          | 앱이 여전히 열리는지 확인하는 조용한 테스트 몇 개. 보통은 아무것도 안 합니다. |
| `issues`               | 작고 분명한 GitHub 이슈 하나. 쉬운 것은 새로 온 사람들에게 남겨 둡니다.    |
| `review`               | 두 시간마다 열려 있는 풀 리퀘스트를 읽습니다. 뭔가 찾지 않는 한 조용합니다. |

모든 작업은 같은 규칙을 따릅니다. 규칙은 [`jobs/_common.md`](../../jobs/_common.md)에 있습니다. 요약하면:

- 저장소의 안내 파일을 먼저 읽습니다. 그것이 우선입니다.
- 소유자가 지난 풀 리퀘스트에서 한 말을 읽습니다. 취향을 배웁니다.
- 다른 사람의 열려 있는 풀 리퀘스트가 건드린 파일은 절대 손대지 않습니다.
- 저장소의 검사를 돌립니다. 깨지는 것은 고칩니다.
- 풀 리퀘스트를 열거나, 왜 열지 않는지 말합니다. main 브랜치에는 절대 푸시하지 않습니다.

---

## 지원하는 에이전트

터미널에서 질문 없이 돌아갈 수 있는 **어떤 코딩 에이전트**와도 함께 쓸 수 있습니다. [`nightshift.conf.example`](../../nightshift.conf.example)에서 맞는 `AGENT` 줄을 고르세요.

<p>
  <a href="https://docs.anthropic.com/claude/docs/claude-code"><kbd><img src="https://www.google.com/s2/favicons?domain=anthropic.com&amp;sz=64" alt="Claude Code 로고" width="16" valign="middle"> Claude Code</kbd></a> &nbsp;
  <a href="https://github.com/openai/codex"><kbd><img src="https://www.google.com/s2/favicons?domain=openai.com&amp;sz=64" alt="Codex 로고" width="16" valign="middle"> Codex</kbd></a> &nbsp;
  <a href="https://cursor.com/cli"><kbd><img src="https://www.google.com/s2/favicons?domain=cursor.com&amp;sz=64" alt="Cursor 로고" width="16" valign="middle"> Cursor</kbd></a> &nbsp;
  <a href="https://github.com/google-gemini/gemini-cli"><kbd><img src="https://www.google.com/s2/favicons?domain=gemini.google.com&amp;sz=64" alt="Gemini CLI 로고" width="16" valign="middle"> Gemini CLI</kbd></a> &nbsp;
  <a href="https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli"><kbd><img src="https://www.google.com/s2/favicons?domain=github.com&amp;sz=64" alt="GitHub Copilot 로고" width="16" valign="middle"> GitHub Copilot</kbd></a> &nbsp;
  <a href="https://hermes-agent.nousresearch.com/docs/"><kbd><img src="https://www.google.com/s2/favicons?domain=nousresearch.com&amp;sz=64" alt="Hermes Agent 로고" width="16" valign="middle"> Hermes</kbd></a> &nbsp;
  <a href="https://github.com/openclaw/openclaw"><kbd><img src="https://www.google.com/s2/favicons?domain=openclaw.ai&amp;sz=64" alt="OpenClaw 로고" width="16" valign="middle"> OpenClaw</kbd></a> &nbsp;
  <a href="https://opencode.ai/docs/cli/"><kbd><img src="https://www.google.com/s2/favicons?domain=opencode.ai&amp;sz=64" alt="OpenCode 로고" width="16" valign="middle"> OpenCode</kbd></a> &nbsp;
  <a href="https://aider.chat/"><kbd><img src="https://www.google.com/s2/favicons?domain=aider.chat&amp;sz=64" alt="Aider 로고" width="16" valign="middle"> Aider</kbd></a> &nbsp;
  <a href="https://ampcode.com/manual#install"><kbd><img src="https://www.google.com/s2/favicons?domain=ampcode.com&amp;sz=64" alt="Amp 로고" width="16" valign="middle"> Amp</kbd></a> &nbsp;
  <a href="https://block.github.io/goose/docs/quickstart/"><kbd><img src="https://www.google.com/s2/favicons?domain=goose-docs.ai&amp;sz=64" alt="Goose 로고" width="16" valign="middle"> Goose</kbd></a> &nbsp;
  <a href="https://github.com/QwenLM/qwen-code"><kbd><img src="https://www.google.com/s2/favicons?domain=qwenlm.github.io&amp;sz=64" alt="Qwen Code 로고" width="16" valign="middle"> Qwen Code</kbd></a> &nbsp;
  <a href="https://docs.factory.ai/cli/getting-started/quickstart"><kbd><img src="https://www.google.com/s2/favicons?domain=factory.ai&amp;sz=64" alt="Droid 로고" width="16" valign="middle"> Droid</kbd></a> &nbsp;
  <a href="https://docs.cline.bot/cline-cli/overview"><kbd><img src="https://www.google.com/s2/favicons?domain=cline.bot&amp;sz=64" alt="Cline 로고" width="16" valign="middle"> Cline</kbd></a> &nbsp;
  <kbd>+ "모두 예" 플래그가 있는 어떤 에이전트든</kbd>
</p>

---

## 시작하는 법

코딩 에이전트에게 이렇게 말하세요:

> Get github.com/openslop/nightshift and set it up for my code at ~/code/my-app. Read SETUP.md there and follow it.

(뜻: github.com/openslop/nightshift를 받아서 ~/code/my-app에 있는 내 코드에 맞게 설정해 줘. 거기 있는 SETUP.md를 읽고 따라 줘.)

그게 전부입니다. 에이전트가 몇 가지를 물어보고, 컴퓨터에 타이머 두 개를 걸고, 기록이 어디에 남는지 알려 줍니다.

macOS, Linux, Windows에서 됩니다. 직접 손으로 하고 싶다면, [`SETUP.md`](../../SETUP.md)가 에이전트가 따르는 페이지입니다.

### 지켜보기

<p align="center">
  <img src="../../assets/nightshift-console.png" alt="Nightshift 콘솔" width="100%">
</p>

코딩 에이전트에게 말하세요:

> Open the Nightshift console. Read ~/nightshift/tui/README.md and start it.

(뜻: Nightshift 콘솔을 열어 줘. ~/nightshift/tui/README.md를 읽고 시작해 줘.)

Node가 필요합니다. 작업에서 `c`를 누르면 에이전트와 그 일에 대해 이야기할 수 있습니다. 나머지는 `?`를 누르세요.

## 안에 뭐가 있나요

- [`jobs/`](../../jobs)에는 작업마다 한 페이지씩, 쉬운 말로 쓰여 있습니다. 읽어 보세요. 원하면 고치세요.
- [`jobs/_common.md`](../../jobs/_common.md)에는 모든 작업이 따르는 규칙이 있습니다.
- [`review/SKILL.md`](../../review/SKILL.md)는 리뷰어가 어떻게 일하는지 말합니다.
- [`nightshift.conf.example`](../../nightshift.conf.example)은 설정 페이지입니다. 에이전트가 복사본을 채웁니다.
- [`SETUP.md`](../../SETUP.md)는 에이전트가 설정할 때 따르는 페이지입니다.
- [`bin/`](../../bin)에는 타이머가 돌리는 작은 스크립트 세 개가 있습니다. 읽을 필요는 없습니다.
- [`tui/`](../../tui)는 콘솔입니다. [`tui/README.md`](../../tui/README.md)가 여는 법을 말합니다.

## 안전한가요?

- 풀 리퀘스트만 엽니다. 무엇을 머지할지는 여러분이 정합니다.
- 다른 열려 있는 풀 리퀘스트가 건드린 파일은 절대 손대지 않습니다.
- 무언가를 열기 전에 여러분의 검사를 돌립니다.
- 하룻밤에 한 번 돌아갑니다. 컴퓨터가 잠들어 있었다면, 한낮에 돌아가는 대신 그날 밤은 건너뜁니다.
- 하는 일 전부가 저장소 밖, 컴퓨터의 로그에 기록됩니다.

## 바꾸기

- 설정의 `JOBS` 줄에서 작업 이름을 빼면 그 작업이 꺼집니다.
- `jobs/`에 있는 페이지를 고치면 작업이 생각하는 방식이 바뀝니다. 말은 쉽게 유지하세요.
- `jobs/`에 새 페이지를 넣고 그 이름을 `JOBS`에 적으면 작업이 추가됩니다.
- 설정에서 다른 `AGENT` 줄을 고르면 다른 에이전트를 쓸 수 있습니다.

## 끄기

에이전트에게 말하세요: "Turn off Nightshift." (Nightshift를 꺼 줘.) 타이머 두 개가 지워집니다. 코드는 건드리지 않습니다.

---

## 커뮤니티 &amp; 지원

- **Discord:** **[Discord](https://discord.gg/zeP5482ced)** 커뮤니티에 참여하세요.
- **아이디어와 버그:** 빠진 작업이 있나요? 잘못된 밤을 발견했나요? [이슈를 여세요](https://github.com/openslop/nightshift/issues).
- **작업 공유:** 잘 되는 작업 페이지를 쓰셨나요? 풀 리퀘스트를 열고 `jobs/`에 넣어 주세요.
- **응원하기:** 이 저장소에 [스타](https://github.com/openslop/nightshift)를 눌러 소식을 받아 보세요.

---

## 개발하기

작업을 추가하거나, 스크립트를 고치거나, 콘솔을 만지고 싶나요? [CONTRIBUTING.md](../../CONTRIBUTING.md)를 보세요.

Nightshift는 셸 스크립트, 쉬운 말로 쓴 작업 페이지, 그리고 의존성 없는 Node 콘솔로 되어 있습니다. 빌드 단계는 없습니다.

<a href="https://github.com/openslop/nightshift/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=openslop/nightshift" alt="Nightshift 기여자">
</a>

## 스타 히스토리

<p align="center">
  <a href="https://star-history.com/#openslop/nightshift&Date">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=openslop/nightshift&amp;type=Date&amp;theme=dark">
      <img src="https://api.star-history.com/svg?repos=openslop/nightshift&amp;type=Date" alt="openslop/nightshift의 GitHub 스타 히스토리 차트" width="880">
    </picture>
  </a>
</p>

## 라이선스

Nightshift는 [MIT 라이선스](../../LICENSE)에 따라 무료이며 오픈 소스입니다. 쓰고, 복사하고, 바꾸세요.
