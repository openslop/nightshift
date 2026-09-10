<p align="center">
  <img src="../../assets/nightshift-lockup-animated.svg" alt="Nightshift" width="520">
</p>

<p align="center">
  <a href="https://github.com/openslop/nightshift"><img src="https://img.shields.io/github/stars/openslop/nightshift?style=flat&amp;label=%E2%98%85&amp;color=6b6bcf" alt="Étoiles GitHub"></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-6b6bcf?style=flat" alt="Licence : MIT"></a>
  <a href="https://discord.gg/nightshift"><img src="https://img.shields.io/badge/Discord-5865F2?logo=discord&amp;logoColor=white" alt="Rejoindre le Discord Nightshift"></a>
  <img src="https://img.shields.io/badge/macOS%20%7C%20Linux%20%7C%20Windows-1c1720?style=flat" alt="Fonctionne sur macOS, Linux et Windows">
  <img src="https://img.shields.io/badge/works%20with-any%20coding%20agent-6b6bcf?style=flat" alt="Fonctionne avec n'importe quel agent de code">
</p>

<p align="center">
  <sub><a href="../../README.md">English</a> · <a href="README.zh-CN.md">中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · Français · <a href="README.pt.md">Português</a></sub>
</p>

<p align="center">
  <strong>Votre code s'améliore pendant que vous dormez.</strong><br>
  Un assistant qui réveille votre agent de code la nuit, lui confie une petite tâche, et laisse des pull requests au matin.
</p>

<h3 align="center"><a href="#comment-démarrer"><ins>Installez-le en une phrase</ins></a></h3>

<p align="center">
  <img src="../../assets/nightshift-demo.svg" alt="Nightshift travaille la nuit et laisse des pull requests au matin" width="100%">
</p>

## C'est quoi ?

Nightshift est un assistant qui travaille la nuit.

Il réveille votre agent de code. Il lui donne une petite tâche. L'agent regarde votre code et fait la tâche. S'il trouve quelque chose qui vaut la peine d'être corrigé, il ouvre une pull request pour que vous y jetiez un œil. Puis il passe à la tâche suivante.

Le matin, vous lisez ce qu'il a fait. Souvent, il ne trouve rien. C'est très bien. Rien vaut mieux qu'un mauvais changement.

Toutes les deux heures, il lit aussi les pull requests ouvertes et laisse une courte revue.

## Fonctionnalités

<table>
<tr>
<td width="50%" valign="middle">

### Une petite tâche à la fois

Neuf jobs, lancés l'un après l'autre. Sécurité, bugs, maintenabilité, performance, conventions, architecture, tests de fumée et issues. Chacun a l'agent entier pour un seul job et rien d'autre.

[Les jobs →](#les-jobs)

</td>
<td width="50%">
  <a href="#les-jobs"><img src="../../assets/features/jobs.svg" alt="Huit jobs lancés l'un après l'autre ; chaque ligne finit par PR OPEN ou NO-OP" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### Des pull requests au matin

Il ne fait qu'ouvrir des pull requests. Rien ne pousse sur main. Rien ne fusionne tout seul. Vous les lisez avec votre café et vous fusionnez ce qui vous plaît.

[Est-ce sûr ? →](#est-ce-sûr-)

</td>
<td width="50%">
  <a href="#est-ce-sûr-"><img src="../../assets/features/morning.svg" alt="Une horloge va de 05:12 à 07:31 pendant que quatre pull requests apparaissent" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### Un relecteur toutes les deux heures

Un second minuteur lit vos pull requests ouvertes et laisse une courte revue. Il reste silencieux, sauf s'il trouve quelque chose.

[Comment le relecteur agit →](../../review/SKILL.md)

</td>
<td width="50%">
  <a href="../../review/SKILL.md"><img src="../../assets/features/review.svg" alt="Une frise d'une journée avance toutes les deux heures ; la plupart des tics sont silencieux, deux laissent une note" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### Il ne vous gêne pas

Avant de pousser, un garde vérifie chaque fichier contre chaque pull request ouverte. Si un collègue travaille déjà dans un fichier, le job abandonne ce changement et le dit.

[Les règles que chaque job suit →](../../jobs/_common.md)

</td>
<td width="50%">
  <a href="../../jobs/_common.md"><img src="../../assets/features/guard.svg" alt="Le garde marque un fichier touché par une pull request ouverte comme interdit" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### La console

Chaque nuit et chaque job sur un seul écran. Une horloge, un radar des quarante dernières nuits, et une grille de ce que chaque job a fait. Il faut Node et rien d'autre.

[Ouvrir la console →](../../tui/README.md)

</td>
<td width="50%">
  <a href="../../tui/README.md"><img src="../../assets/features/console.svg" alt="Trois panneaux de console : une horloge, un balayage radar, et une matrice de points job par nuit" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### Reprendre la conversation

Appuyez sur `c` sur n'importe quel job et la console rouvre la transcription de cette nuit-là. Demandez à l'agent pourquoi il a fait ce qu'il a fait. Dites-lui quoi faire ensuite.

[Continuer une conversation →](../../tui/README.md#continue-a-conversation)

</td>
<td width="50%">
  <a href="../../tui/README.md#continue-a-conversation"><img src="../../assets/features/resume.svg" alt="Appuyer sur c ouvre un terminal avec claude --resume et l'agent reprend là où il s'était arrêté" width="100%"></a>
</td>
</tr>
</table>

**Aussi dans la boîte :**

- **[Des jobs en mots simples](../../jobs)** — Chaque job est une page de mots simples. Lisez-les. Changez-les. Ajoutez les vôtres.
- **[Il apprend vos goûts](../../jobs/_common.md)** — Les jobs lisent ce que vous avez dit sur les pull requests passées avant de commencer.
- **[Il lance vos vérifications](../../nightshift.conf.example)** — Lint, typecheck, tests. Chaque job doit les faire passer avant d'ouvrir quoi que ce soit.
- **[Il évite votre journée de travail](../../nightshift.conf.example)** — Si votre portable était en veille, la nuit est sautée. Il ne tourne jamais au milieu de votre journée.
- **[Des logs hors de votre dépôt](../../SETUP.md)** — Tout ce qu'il fait est écrit dans un dossier sur votre ordinateur, pas dans votre code.

---

## Les jobs

| Job                    | Ce qu'il cherche                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `security`             | De vraies failles qu'un attaquant pourrait utiliser. Pas des « peut-être un jour ».  |
| `bugs`                 | Des bugs qu'un utilisateur remarquerait. Seulement les évidents.                    |
| `maintainability`      | Du code difficile à changer. Il le rend plus simple.                                |
| `performance`          | Des lenteurs que les gens ressentent. Il mesure d'abord.                            |
| `conventions`          | Les endroits qui cassent vos propres règles écrites. Corrections sûres uniquement.  |
| `conventions-followup` | Les règles cassées qui demandent un vrai changement. Un thème par nuit.             |
| `architecture`         | La seule grande façon dont le code pourrait être plus simple.                       |
| `smoke-tests`          | Quelques tests calmes qui vérifient que l'app s'ouvre encore. Souvent ne fait rien. |
| `issues`               | Une petite issue GitHub claire. Laisse les faciles aux nouveaux.                    |
| `review`               | Lit les pull requests ouvertes toutes les deux heures. Silencieux sauf s'il trouve. |

Chaque job suit les mêmes règles. Elles sont dans [`jobs/_common.md`](../../jobs/_common.md). En bref :

- Lire d'abord les fichiers de guide du dépôt. Ils ont le dernier mot.
- Lire ce que le propriétaire a dit sur les pull requests passées. Apprendre ses goûts.
- Ne jamais toucher un fichier qu'une pull request ouverte de quelqu'un d'autre touche.
- Lancer les vérifications du dépôt. Corriger ce qui casse.
- Ouvrir une pull request, ou dire pourquoi non. Ne jamais pousser sur la branche principale.

---

## Agents pris en charge

Fonctionne avec **n'importe quel agent de code** qui peut tourner depuis un terminal sans poser de questions. Choisissez la ligne `AGENT` qui correspond dans [`nightshift.conf.example`](../../nightshift.conf.example).

<p>
  <a href="https://docs.anthropic.com/claude/docs/claude-code"><kbd><img src="https://www.google.com/s2/favicons?domain=anthropic.com&amp;sz=64" alt="Logo Claude Code" width="16" valign="middle"> Claude Code</kbd></a> &nbsp;
  <a href="https://github.com/openai/codex"><kbd><img src="https://www.google.com/s2/favicons?domain=openai.com&amp;sz=64" alt="Logo Codex" width="16" valign="middle"> Codex</kbd></a> &nbsp;
  <a href="https://cursor.com/cli"><kbd><img src="https://www.google.com/s2/favicons?domain=cursor.com&amp;sz=64" alt="Logo Cursor" width="16" valign="middle"> Cursor</kbd></a> &nbsp;
  <a href="https://github.com/google-gemini/gemini-cli"><kbd><img src="https://www.google.com/s2/favicons?domain=gemini.google.com&amp;sz=64" alt="Logo Gemini CLI" width="16" valign="middle"> Gemini CLI</kbd></a> &nbsp;
  <a href="https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli"><kbd><img src="https://www.google.com/s2/favicons?domain=github.com&amp;sz=64" alt="Logo GitHub Copilot" width="16" valign="middle"> GitHub Copilot</kbd></a> &nbsp;
  <a href="https://hermes-agent.nousresearch.com/docs/"><kbd><img src="https://www.google.com/s2/favicons?domain=nousresearch.com&amp;sz=64" alt="Logo Hermes Agent" width="16" valign="middle"> Hermes</kbd></a> &nbsp;
  <a href="https://github.com/openclaw/openclaw"><kbd><img src="https://www.google.com/s2/favicons?domain=openclaw.ai&amp;sz=64" alt="Logo OpenClaw" width="16" valign="middle"> OpenClaw</kbd></a> &nbsp;
  <a href="https://opencode.ai/docs/cli/"><kbd><img src="https://www.google.com/s2/favicons?domain=opencode.ai&amp;sz=64" alt="Logo OpenCode" width="16" valign="middle"> OpenCode</kbd></a> &nbsp;
  <a href="https://aider.chat/"><kbd><img src="https://www.google.com/s2/favicons?domain=aider.chat&amp;sz=64" alt="Logo Aider" width="16" valign="middle"> Aider</kbd></a> &nbsp;
  <a href="https://ampcode.com/manual#install"><kbd><img src="https://www.google.com/s2/favicons?domain=ampcode.com&amp;sz=64" alt="Logo Amp" width="16" valign="middle"> Amp</kbd></a> &nbsp;
  <a href="https://block.github.io/goose/docs/quickstart/"><kbd><img src="https://www.google.com/s2/favicons?domain=goose-docs.ai&amp;sz=64" alt="Logo Goose" width="16" valign="middle"> Goose</kbd></a> &nbsp;
  <a href="https://github.com/QwenLM/qwen-code"><kbd><img src="https://www.google.com/s2/favicons?domain=qwenlm.github.io&amp;sz=64" alt="Logo Qwen Code" width="16" valign="middle"> Qwen Code</kbd></a> &nbsp;
  <a href="https://docs.factory.ai/cli/getting-started/quickstart"><kbd><img src="https://www.google.com/s2/favicons?domain=factory.ai&amp;sz=64" alt="Logo Droid" width="16" valign="middle"> Droid</kbd></a> &nbsp;
  <a href="https://docs.cline.bot/cline-cli/overview"><kbd><img src="https://www.google.com/s2/favicons?domain=cline.bot&amp;sz=64" alt="Logo Cline" width="16" valign="middle"> Cline</kbd></a> &nbsp;
  <kbd>+ tout agent avec une option « oui à tout »</kbd>
</p>

---

## Comment démarrer

Dites ceci à votre agent de code :

> Get github.com/openslop/nightshift and set it up for my code at ~/code/my-app. Read SETUP.md there and follow it.

(En français : « Récupère github.com/openslop/nightshift et installe-le pour mon code dans ~/code/my-app. Lis le SETUP.md qui s'y trouve et suis-le. »)

C'est tout. Votre agent vous posera quelques questions, réglera deux minuteurs sur votre ordinateur, et vous montrera où vont les notes.

Fonctionne sur macOS, Linux et Windows. Si vous préférez le faire à la main, [`SETUP.md`](../../SETUP.md) est la page que votre agent suit.

### Regardez-le travailler

<p align="center">
  <img src="../../assets/nightshift-console.png" alt="La console Nightshift" width="100%">
</p>

Dites à votre agent de code :

> Open the Nightshift console. Read ~/nightshift/tui/README.md and start it.

(En français : « Ouvre la console Nightshift. Lis ~/nightshift/tui/README.md et lance-la. »)

Il faut Node. Appuyez sur `c` sur un job pour parler à l'agent de ce qu'il a fait. Appuyez sur `?` pour le reste.

## Ce qu'il y a dedans

- [`jobs/`](../../jobs) contient une page par job, en mots simples. Lisez-les. Changez-les si vous voulez.
- [`jobs/_common.md`](../../jobs/_common.md) contient les règles que chaque job suit.
- [`review/SKILL.md`](../../review/SKILL.md) dit comment le relecteur agit.
- [`nightshift.conf.example`](../../nightshift.conf.example) est la page de réglages. Votre agent en remplit une copie.
- [`SETUP.md`](../../SETUP.md) est la page que votre agent suit pour tout installer.
- [`bin/`](../../bin) contient trois petits scripts que les minuteurs lancent. Vous n'avez pas besoin de les lire.
- [`tui/`](../../tui) est la console. [`tui/README.md`](../../tui/README.md) dit comment l'ouvrir.

## Est-ce sûr ?

- Il ne fait qu'ouvrir des pull requests. C'est vous qui décidez ce qui est fusionné.
- Il ne touche jamais un fichier qu'une autre pull request ouverte touche.
- Il lance vos vérifications avant d'ouvrir quoi que ce soit.
- Il tourne une fois par nuit. Si votre ordinateur était en veille, il saute cette nuit-là au lieu de tourner au milieu de votre journée.
- Tout ce qu'il fait est écrit dans un log sur votre ordinateur, hors de votre dépôt.

## Changez-le

- Désactivez un job en retirant son nom de la ligne `JOBS` de vos réglages.
- Changez la façon dont un job pense en modifiant sa page dans `jobs/`. Gardez des mots simples.
- Ajoutez un job en ajoutant une nouvelle page dans `jobs/` et en mettant son nom dans `JOBS`.
- Utilisez un autre agent en choisissant une autre ligne `AGENT` dans vos réglages.

## Éteignez-le

Dites à votre agent : « Désactive Nightshift. » Il retire les deux minuteurs. Votre code n'est pas touché.

---

## Communauté &amp; support

- **Discord :** Rejoignez la communauté sur **[Discord](https://discord.gg/nightshift)**.
- **Idées et bugs :** Il manque un job ? Une nuit a mal tourné ? [Ouvrez une issue](https://github.com/openslop/nightshift/issues).
- **Partagez un job :** Vous avez écrit une page de job qui marche bien ? Ouvrez une pull request et mettez-la dans `jobs/`.
- **Soutenez le projet :** Mettez une [étoile](https://github.com/openslop/nightshift) à ce dépôt pour suivre l'aventure.

---

## Développement

Envie d'ajouter un job, de corriger un script, ou de travailler sur la console ? Voir [CONTRIBUTING.md](../../CONTRIBUTING.md).

Nightshift, ce sont des scripts shell, des pages de job en texte brut, et une console Node sans dépendances. Il n'y a pas d'étape de build.

<a href="https://github.com/openslop/nightshift/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=openslop/nightshift" alt="Contributeurs Nightshift">
</a>

## Historique des étoiles

<p align="center">
  <a href="https://star-history.com/#openslop/nightshift&Date">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=openslop/nightshift&amp;type=Date&amp;theme=dark">
      <img src="https://api.star-history.com/svg?repos=openslop/nightshift&amp;type=Date" alt="Graphique de l'historique des étoiles GitHub pour openslop/nightshift" width="880">
    </picture>
  </a>
</p>

## Licence

Nightshift est libre et open source sous la [licence MIT](../../LICENSE). Utilisez-le, copiez-le, changez-le.
