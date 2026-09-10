<p align="center">
  <img src="../../assets/nightshift-lockup-animated.svg" alt="Nightshift" width="520">
</p>

<p align="center">
  <a href="https://github.com/openslop/nightshift"><img src="https://img.shields.io/github/stars/openslop/nightshift?style=flat&amp;label=%E2%98%85&amp;color=6b6bcf" alt="GitHub スター"></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-6b6bcf?style=flat" alt="ライセンス: MIT"></a>
  <a href="https://discord.gg/zeP5482ced"><img src="https://img.shields.io/badge/Discord-5865F2?logo=discord&amp;logoColor=white" alt="Nightshift の Discord に参加"></a>
  <img src="https://img.shields.io/badge/macOS%20%7C%20Linux%20%7C%20Windows-1c1720?style=flat" alt="macOS、Linux、Windows で動きます">
  <img src="https://img.shields.io/badge/works%20with-any%20coding%20agent-6b6bcf?style=flat" alt="どのコーディングエージェントでも使えます">
</p>

<p align="center">
  <sub><a href="../../README.md">English</a> · <a href="README.zh-CN.md">中文</a> · 日本語 · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.pt.md">Português</a></sub>
</p>

<p align="center">
  <strong>寝ている間に、コードが良くなる。</strong><br>
  夜にコーディングエージェントを起こし、小さな仕事をひとつ渡し、朝までにプルリクエストを残しておく手伝い役です。
</p>

<h3 align="center"><a href="#はじめ方"><ins>ひとことで設定できます</ins></a></h3>

<p align="center">
  <img src="../../assets/nightshift-demo.svg" alt="Nightshift は夜に働き、朝までにプルリクエストを残します" width="100%">
</p>

## これは何？

Nightshift は、夜に働く手伝い役です。

コーディングエージェントを起こします。エージェントに小さな仕事をひとつ渡します。エージェントはコードを見て、その仕事をします。直す価値のあるものが見つかれば、あなたが確認できるようにプルリクエストを開きます。それから次の仕事に移ります。

朝になったら、何をしたか読みます。何も見つからない夜も多いです。それでいいのです。悪い変更より、何もしない方がましです。

2時間ごとに、開いているプルリクエストも読んで、短いレビューを残します。

## 機能

<table>
<tr>
<td width="50%" valign="middle">

### 一度にひとつの小さな仕事

9つのジョブを、順番にひとつずつ実行します。セキュリティ、バグ、保守性、パフォーマンス、規約、アーキテクチャ、スモークテスト、issue。それぞれのジョブが、エージェントをまるごと独り占めして、ほかのことはしません。

[ジョブ一覧 →](#ジョブ一覧)

</td>
<td width="50%">
  <a href="#ジョブ一覧"><img src="../../assets/features/jobs.svg" alt="8つのジョブが順番に走り、各行は PR OPEN か NO-OP で終わる" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### 朝までにプルリクエスト

開くのはプルリクエストだけです。main には何も push しません。勝手にマージもしません。コーヒーを飲みながら読んで、気に入ったものだけマージしてください。

[安全ですか？ →](#安全ですか)

</td>
<td width="50%">
  <a href="#安全ですか"><img src="../../assets/features/morning.svg" alt="時計が 05:12 から 07:31 まで進む間に、4つのプルリクエストが現れる" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### 2時間ごとのレビュー係

2つ目のタイマーが、開いているプルリクエストを読んで、短いレビューを残します。何か見つけない限り、静かにしています。

[レビュー係の動き方 →](../../review/SKILL.md)

</td>
<td width="50%">
  <a href="../../review/SKILL.md"><img src="../../assets/features/review.svg" alt="一日分のタイムラインが2時間ごとに刻まれる。ほとんどは静かで、2回だけメモを残す" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### 邪魔をしない

push する前に、ガードがすべてのファイルを、開いているすべてのプルリクエストと照らし合わせます。仲間がすでにそのファイルを触っていたら、ジョブはその変更を捨てて、そう報告します。

[すべてのジョブが守るルール →](../../jobs/_common.md)

</td>
<td width="50%">
  <a href="../../jobs/_common.md"><img src="../../assets/features/guard.svg" alt="ガードが、開いているプルリクエストに触られているファイルを立ち入り禁止にする" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### コンソール

すべての夜と、すべてのジョブを、ひとつの画面に。時計、直近40夜のレーダー、そして各ジョブが何をしたかのグリッド。必要なのは Node だけです。

[コンソールを開く →](../../tui/README.md)

</td>
<td width="50%">
  <a href="../../tui/README.md"><img src="../../assets/features/console.svg" alt="3つのコンソールパネル: 時計、レーダーの掃引、ジョブ×夜のドットマトリクス" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### 会話の続きから

どのジョブでも `c` を押すと、コンソールがその夜のやりとりを開き直します。なぜそうしたのかエージェントに聞けます。次に何をするか指示できます。

[会話を続ける →](../../tui/README.md#continue-a-conversation)

</td>
<td width="50%">
  <a href="../../tui/README.md#continue-a-conversation"><img src="../../assets/features/resume.svg" alt="c を押すと claude --resume でターミナルが開き、エージェントが止まったところから続ける" width="100%"></a>
</td>
</tr>
</table>

**ほかにも入っています:**

- **[やさしい言葉で書かれたジョブ](../../jobs)** — どのジョブも、やさしい言葉で書かれた1ページです。読んでください。変えてください。自分のを足してください。
- **[あなたの好みを学ぶ](../../jobs/_common.md)** — ジョブは始める前に、あなたが過去のプルリクエストで言ったことを読みます。
- **[あなたのチェックを走らせる](../../nightshift.conf.example)** — Lint、型チェック、テスト。どのジョブも、何かを開く前にこれらを通さなければなりません。
- **[仕事中は飛ばす](../../nightshift.conf.example)** — ノートパソコンが寝ていたら、その夜は飛ばします。日中の真ん中で走ることはありません。
- **[ログはリポジトリの外に](../../SETUP.md)** — やったことはすべて、コードの中ではなく、あなたのコンピュータ上のフォルダに書かれます。

---

## ジョブ一覧

| ジョブ                 | 探すもの                                                                       |
| ---------------------- | ------------------------------------------------------------------------------ |
| `security`             | 悪意ある人が使える本物の穴。「いつか困るかも」という心配は対象外。               |
| `bugs`                 | ユーザーが気づくバグ。はっきりしたものだけ。                                     |
| `maintainability`      | 変えにくいコード。それを単純にします。                                           |
| `performance`          | 人が体感する遅い場所。まず計測します。                                           |
| `conventions`          | あなた自身が書いたルールを破っている場所。安全な修正だけ。                       |
| `conventions-followup` | 本格的な変更が必要なルール違反。一晩にひとつのテーマ。                           |
| `architecture`         | コードをもっと単純にできる、いちばん大きな方法をひとつ。                         |
| `smoke-tests`          | アプリがまだ開くか確かめる、静かなテストを少し。たいてい何もしません。           |
| `issues`               | 小さくてはっきりした GitHub issue をひとつ。簡単なものは新しい人のために残します。 |
| `review`               | 2時間ごとに開いているプルリクエストを読みます。何か見つけない限り静かです。      |

どのジョブも同じルールを守ります。ルールは [`jobs/_common.md`](../../jobs/_common.md) にあります。要するに:

- まずリポジトリ自身のガイドファイルを読む。そちらが優先。
- オーナーが過去のプルリクエストで言ったことを読む。好みを学ぶ。
- 他の人の開いているプルリクエストが触っているファイルには、決して触らない。
- リポジトリのチェックを走らせる。壊れたものは直す。
- プルリクエストを開くか、開かない理由を言う。main ブランチには決して push しない。

---

## 対応エージェント

質問せずにターミナルから動かせる**どのコーディングエージェント**でも使えます。[`nightshift.conf.example`](../../nightshift.conf.example) の中から、合う `AGENT` の行を選んでください。

<p>
  <a href="https://docs.anthropic.com/claude/docs/claude-code"><kbd><img src="https://www.google.com/s2/favicons?domain=anthropic.com&amp;sz=64" alt="Claude Code のロゴ" width="16" valign="middle"> Claude Code</kbd></a> &nbsp;
  <a href="https://github.com/openai/codex"><kbd><img src="https://www.google.com/s2/favicons?domain=openai.com&amp;sz=64" alt="Codex のロゴ" width="16" valign="middle"> Codex</kbd></a> &nbsp;
  <a href="https://cursor.com/cli"><kbd><img src="https://www.google.com/s2/favicons?domain=cursor.com&amp;sz=64" alt="Cursor のロゴ" width="16" valign="middle"> Cursor</kbd></a> &nbsp;
  <a href="https://github.com/google-gemini/gemini-cli"><kbd><img src="https://www.google.com/s2/favicons?domain=gemini.google.com&amp;sz=64" alt="Gemini CLI のロゴ" width="16" valign="middle"> Gemini CLI</kbd></a> &nbsp;
  <a href="https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli"><kbd><img src="https://www.google.com/s2/favicons?domain=github.com&amp;sz=64" alt="GitHub Copilot のロゴ" width="16" valign="middle"> GitHub Copilot</kbd></a> &nbsp;
  <a href="https://hermes-agent.nousresearch.com/docs/"><kbd><img src="https://www.google.com/s2/favicons?domain=nousresearch.com&amp;sz=64" alt="Hermes Agent のロゴ" width="16" valign="middle"> Hermes</kbd></a> &nbsp;
  <a href="https://github.com/openclaw/openclaw"><kbd><img src="https://www.google.com/s2/favicons?domain=openclaw.ai&amp;sz=64" alt="OpenClaw のロゴ" width="16" valign="middle"> OpenClaw</kbd></a> &nbsp;
  <a href="https://opencode.ai/docs/cli/"><kbd><img src="https://www.google.com/s2/favicons?domain=opencode.ai&amp;sz=64" alt="OpenCode のロゴ" width="16" valign="middle"> OpenCode</kbd></a> &nbsp;
  <a href="https://aider.chat/"><kbd><img src="https://www.google.com/s2/favicons?domain=aider.chat&amp;sz=64" alt="Aider のロゴ" width="16" valign="middle"> Aider</kbd></a> &nbsp;
  <a href="https://ampcode.com/manual#install"><kbd><img src="https://www.google.com/s2/favicons?domain=ampcode.com&amp;sz=64" alt="Amp のロゴ" width="16" valign="middle"> Amp</kbd></a> &nbsp;
  <a href="https://block.github.io/goose/docs/quickstart/"><kbd><img src="https://www.google.com/s2/favicons?domain=goose-docs.ai&amp;sz=64" alt="Goose のロゴ" width="16" valign="middle"> Goose</kbd></a> &nbsp;
  <a href="https://github.com/QwenLM/qwen-code"><kbd><img src="https://www.google.com/s2/favicons?domain=qwenlm.github.io&amp;sz=64" alt="Qwen Code のロゴ" width="16" valign="middle"> Qwen Code</kbd></a> &nbsp;
  <a href="https://docs.factory.ai/cli/getting-started/quickstart"><kbd><img src="https://www.google.com/s2/favicons?domain=factory.ai&amp;sz=64" alt="Droid のロゴ" width="16" valign="middle"> Droid</kbd></a> &nbsp;
  <a href="https://docs.cline.bot/cline-cli/overview"><kbd><img src="https://www.google.com/s2/favicons?domain=cline.bot&amp;sz=64" alt="Cline のロゴ" width="16" valign="middle"> Cline</kbd></a> &nbsp;
  <kbd>+ 「すべてに yes」フラグのあるエージェントなら何でも</kbd>
</p>

---

## はじめ方

コーディングエージェントにこう伝えてください:

> Get github.com/openslop/nightshift and set it up for my code at ~/code/my-app. Read SETUP.md there and follow it.

（意味: 「github.com/openslop/nightshift を取ってきて、~/code/my-app にある私のコード用に設定して。そこにある SETUP.md を読んで、その通りにして。」）

これだけです。エージェントがいくつか質問して、あなたのコンピュータにタイマーを2つ設定し、メモの置き場所を教えてくれます。

macOS、Linux、Windows で動きます。手で設定したいなら、[`SETUP.md`](../../SETUP.md) がエージェントの従うページです。

### 見てみる

<p align="center">
  <img src="../../assets/nightshift-console.png" alt="Nightshift のコンソール" width="100%">
</p>

コーディングエージェントにこう伝えてください:

> Open the Nightshift console. Read ~/nightshift/tui/README.md and start it.

（意味: 「Nightshift のコンソールを開いて。~/nightshift/tui/README.md を読んで、起動して。」）

Node が必要です。ジョブの上で `c` を押すと、何をしたかエージェントと話せます。ほかは `?` を押してください。

## 中身

- [`jobs/`](../../jobs) には、ジョブごとに1ページ、やさしい英語で書かれています。読んでください。好きなら変えてください。
- [`jobs/_common.md`](../../jobs/_common.md) には、すべてのジョブが守るルールがあります。
- [`review/SKILL.md`](../../review/SKILL.md) は、レビュー係の動き方を書いています。
- [`nightshift.conf.example`](../../nightshift.conf.example) は設定ページです。エージェントがコピーを埋めます。
- [`SETUP.md`](../../SETUP.md) は、エージェントが設定のときに従うページです。
- [`bin/`](../../bin) には、タイマーが動かす小さなスクリプトが3つあります。読む必要はありません。
- [`tui/`](../../tui) はコンソールです。[`tui/README.md`](../../tui/README.md) に開き方があります。

## 安全ですか？

- 開くのはプルリクエストだけです。何をマージするかは、あなたが決めます。
- 他の開いているプルリクエストが触っているファイルには、決して触りません。
- 何かを開く前に、あなたのチェックを走らせます。
- 一晩に一回だけ走ります。コンピュータが寝ていたら、日中の真ん中で走る代わりに、その夜を飛ばします。
- やったことはすべて、リポジトリの外の、あなたのコンピュータ上のログに書かれます。

## 変える

- ジョブを止めるには、設定の `JOBS` の行からその名前を外します。
- ジョブの考え方を変えるには、`jobs/` の中のそのページを編集します。言葉はやさしいままに。
- ジョブを足すには、`jobs/` に新しいページを足して、その名前を `JOBS` に入れます。
- 別のエージェントを使うには、設定で別の `AGENT` の行を選びます。

## 止める

エージェントに「Nightshift を止めて」と伝えてください。タイマーを2つ消します。あなたのコードには触りません。

---

## コミュニティ &amp; サポート

- **Discord:** **[Discord](https://discord.gg/zeP5482ced)** のコミュニティに参加してください。
- **アイデアとバグ:** 欲しいジョブがない？ うまくいかなかった夜があった？ [issue を開いてください](https://github.com/openslop/nightshift/issues)。
- **ジョブを共有:** よく動くジョブのページを書いた？ プルリクエストを開いて、`jobs/` に入れてください。
- **応援する:** このリポジトリに [スター](https://github.com/openslop/nightshift) をつけて、動きを追ってください。

---

## 開発

ジョブを足したい、スクリプトを直したい、コンソールをいじりたい？ [CONTRIBUTING.md](../../CONTRIBUTING.md) を見てください。

Nightshift は、シェルスクリプトと、プレーンテキストのジョブページと、依存なしの Node コンソールでできています。ビルド手順はありません。

<a href="https://github.com/openslop/nightshift/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=openslop/nightshift" alt="Nightshift のコントリビューター">
</a>

## スター履歴

<p align="center">
  <a href="https://star-history.com/#openslop/nightshift&Date">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=openslop/nightshift&amp;type=Date&amp;theme=dark">
      <img src="https://api.star-history.com/svg?repos=openslop/nightshift&amp;type=Date" alt="openslop/nightshift の GitHub スター履歴グラフ" width="880">
    </picture>
  </a>
</p>

## ライセンス

Nightshift は [MIT ライセンス](../../LICENSE) のもとで、無料でオープンソースです。使ってください、コピーしてください、変えてください。
