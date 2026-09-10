<p align="center">
  <img src="../../assets/nightshift-lockup-animated.svg" alt="Nightshift" width="520">
</p>

<p align="center">
  <a href="https://github.com/openslop/nightshift"><img src="https://img.shields.io/github/stars/openslop/nightshift?style=flat&amp;label=%E2%98%85&amp;color=6b6bcf" alt="Estrelas no GitHub"></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-6b6bcf?style=flat" alt="Licença: MIT"></a>
  <a href="https://discord.gg/nightshift"><img src="https://img.shields.io/badge/Discord-5865F2?logo=discord&amp;logoColor=white" alt="Entre no Discord do Nightshift"></a>
  <img src="https://img.shields.io/badge/macOS%20%7C%20Linux%20%7C%20Windows-1c1720?style=flat" alt="Roda no macOS, Linux e Windows">
  <img src="https://img.shields.io/badge/works%20with-any%20coding%20agent-6b6bcf?style=flat" alt="Funciona com qualquer agente de código">
</p>

<p align="center">
  <sub><a href="../../README.md">English</a> · <a href="README.zh-CN.md">中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · Português</sub>
</p>

<p align="center">
  <strong>Seu código melhora enquanto você dorme.</strong><br>
  Um ajudante que acorda seu agente de código à noite, dá a ele um trabalho pequeno e deixa pull requests prontos de manhã.
</p>

<h3 align="center"><a href="#como-começar"><ins>Configure em uma frase</ins></a></h3>

<p align="center">
  <img src="../../assets/nightshift-demo.svg" alt="O Nightshift trabalha à noite e deixa pull requests de manhã" width="100%">
</p>

## O que é isso?

Nightshift é um ajudante que trabalha à noite.

Ele acorda seu agente de código. Dá ao agente um trabalho pequeno. O agente olha seu código e faz o trabalho. Se encontra algo que vale a pena corrigir, abre um pull request para você ver. Depois passa para o próximo trabalho.

De manhã, você lê o que ele fez. Em muitas noites ele não encontra nada. Tudo bem. Nada é melhor do que uma mudança ruim.

A cada duas horas, ele também lê os pull requests abertos e deixa uma revisão curta.

## Recursos

<table>
<tr>
<td width="50%" valign="middle">

### Um trabalho pequeno de cada vez

Nove trabalhos, um depois do outro. Segurança, bugs, manutenibilidade, desempenho, convenções, arquitetura, testes de fumaça e issues. Cada um recebe o agente inteiro para um trabalho e nada mais.

[Os trabalhos →](#os-trabalhos)

</td>
<td width="50%">
  <a href="#os-trabalhos"><img src="../../assets/features/jobs.svg" alt="Oito trabalhos rodam um depois do outro; cada linha termina em PR OPEN ou NO-OP" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### Pull requests de manhã

Ele só abre pull requests. Nada vai direto para a main. Nada é mesclado sozinho. Você lê com um café e mescla o que gostar.

[É seguro? →](#é-seguro)

</td>
<td width="50%">
  <a href="#é-seguro"><img src="../../assets/features/morning.svg" alt="Um relógio vai de 05:12 a 07:31 enquanto quatro pull requests aparecem" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### Um revisor a cada duas horas

Um segundo timer lê seus pull requests abertos e deixa uma revisão curta. Ele fica quieto, a não ser que encontre algo.

[Como o revisor age →](../../review/SKILL.md)

</td>
<td width="50%">
  <a href="../../review/SKILL.md"><img src="../../assets/features/review.svg" alt="Uma linha do tempo de um dia inteiro marca a cada duas horas; a maioria das marcas fica quieta, duas deixam uma nota" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### Não atrapalha você

Antes de enviar, um guarda checa cada arquivo contra cada pull request aberto. Se um colega já está mexendo em um arquivo, o trabalho descarta essa mudança e avisa.

[As regras que todo trabalho segue →](../../jobs/_common.md)

</td>
<td width="50%">
  <a href="../../jobs/_common.md"><img src="../../assets/features/guard.svg" alt="O guarda marca um arquivo tocado por um pull request aberto como proibido" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### O console

Toda noite e todo trabalho em uma só tela. Um relógio, um radar das últimas quarenta noites e uma grade do que cada trabalho fez. Precisa do Node e de mais nada.

[Abrir o console →](../../tui/README.md)

</td>
<td width="50%">
  <a href="../../tui/README.md"><img src="../../assets/features/console.svg" alt="Três painéis do console: um relógio, uma varredura de radar e uma matriz de pontos de trabalhos por noite" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### Retome a conversa

Aperte `c` em qualquer trabalho e o console reabre a transcrição daquela noite. Pergunte ao agente por que ele fez o que fez. Diga a ele o que fazer em seguida.

[Continuar uma conversa →](../../tui/README.md#continue-a-conversation)

</td>
<td width="50%">
  <a href="../../tui/README.md#continue-a-conversation"><img src="../../assets/features/resume.svg" alt="Apertar c abre um terminal com claude --resume e o agente continua de onde parou" width="100%"></a>
</td>
</tr>
</table>

**Também vem na caixa:**

- **[Trabalhos em palavras simples](../../jobs)** — Cada trabalho é uma página de palavras simples. Leia. Mude. Adicione os seus.
- **[Aprende seu gosto](../../jobs/_common.md)** — Os trabalhos leem o que você disse em pull requests antigos antes de começar.
- **[Roda suas verificações](../../nightshift.conf.example)** — Lint, typecheck, testes. Todo trabalho precisa fazer tudo passar antes de abrir qualquer coisa.
- **[Pula seu dia de trabalho](../../nightshift.conf.example)** — Se seu laptop estava dormindo, a noite é pulada. Ele nunca roda no meio do seu dia.
- **[Logs fora do seu repositório](../../SETUP.md)** — Tudo o que ele faz é gravado em uma pasta no seu computador, não no seu código.

---

## Os trabalhos

| Trabalho               | O que ele procura                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `security`             | Falhas reais que alguém mal-intencionado poderia usar. Não preocupações de "talvez um dia". |
| `bugs`                 | Bugs que um usuário notaria. Só os claros.                                         |
| `maintainability`      | Código difícil de mudar. Ele deixa mais simples.                                   |
| `performance`          | Pontos lentos que as pessoas sentem. Ele mede primeiro.                            |
| `conventions`          | Lugares que quebram suas próprias regras escritas. Só correções seguras.           |
| `conventions-followup` | As quebras de regra que precisam de uma mudança de verdade. Um tema por noite.     |
| `architecture`         | A única grande forma de o código ficar mais simples.                               |
| `smoke-tests`          | Alguns testes calmos que checam se o app ainda abre. Normalmente não faz nada.     |
| `issues`               | Uma issue do GitHub pequena e clara. Deixa as fáceis para quem está chegando.      |
| `review`               | Lê pull requests abertos a cada duas horas. Fica quieto, a não ser que encontre algo. |

Todo trabalho segue as mesmas regras. Elas estão em [`jobs/_common.md`](../../jobs/_common.md). Em resumo:

- Leia primeiro os arquivos de guia do próprio repositório. Eles mandam.
- Leia o que o dono disse em pull requests antigos. Aprenda o gosto dele.
- Nunca toque em um arquivo que o pull request aberto de outra pessoa toca.
- Rode as verificações do repositório. Corrija o que quebrar.
- Abra um pull request, ou diga por que não. Nunca envie para a branch main.

---

## Agentes suportados

Funciona com **qualquer agente de código** que rode a partir de um terminal sem fazer perguntas. Escolha a linha `AGENT` correspondente em [`nightshift.conf.example`](../../nightshift.conf.example).

<p>
  <a href="https://docs.anthropic.com/claude/docs/claude-code"><kbd><img src="https://www.google.com/s2/favicons?domain=anthropic.com&amp;sz=64" alt="Logo do Claude Code" width="16" valign="middle"> Claude Code</kbd></a> &nbsp;
  <a href="https://github.com/openai/codex"><kbd><img src="https://www.google.com/s2/favicons?domain=openai.com&amp;sz=64" alt="Logo do Codex" width="16" valign="middle"> Codex</kbd></a> &nbsp;
  <a href="https://cursor.com/cli"><kbd><img src="https://www.google.com/s2/favicons?domain=cursor.com&amp;sz=64" alt="Logo do Cursor" width="16" valign="middle"> Cursor</kbd></a> &nbsp;
  <a href="https://github.com/google-gemini/gemini-cli"><kbd><img src="https://www.google.com/s2/favicons?domain=gemini.google.com&amp;sz=64" alt="Logo do Gemini CLI" width="16" valign="middle"> Gemini CLI</kbd></a> &nbsp;
  <a href="https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli"><kbd><img src="https://www.google.com/s2/favicons?domain=github.com&amp;sz=64" alt="Logo do GitHub Copilot" width="16" valign="middle"> GitHub Copilot</kbd></a> &nbsp;
  <a href="https://hermes-agent.nousresearch.com/docs/"><kbd><img src="https://www.google.com/s2/favicons?domain=nousresearch.com&amp;sz=64" alt="Logo do Hermes Agent" width="16" valign="middle"> Hermes</kbd></a> &nbsp;
  <a href="https://github.com/openclaw/openclaw"><kbd><img src="https://www.google.com/s2/favicons?domain=openclaw.ai&amp;sz=64" alt="Logo do OpenClaw" width="16" valign="middle"> OpenClaw</kbd></a> &nbsp;
  <a href="https://opencode.ai/docs/cli/"><kbd><img src="https://www.google.com/s2/favicons?domain=opencode.ai&amp;sz=64" alt="Logo do OpenCode" width="16" valign="middle"> OpenCode</kbd></a> &nbsp;
  <a href="https://aider.chat/"><kbd><img src="https://www.google.com/s2/favicons?domain=aider.chat&amp;sz=64" alt="Logo do Aider" width="16" valign="middle"> Aider</kbd></a> &nbsp;
  <a href="https://ampcode.com/manual#install"><kbd><img src="https://www.google.com/s2/favicons?domain=ampcode.com&amp;sz=64" alt="Logo do Amp" width="16" valign="middle"> Amp</kbd></a> &nbsp;
  <a href="https://block.github.io/goose/docs/quickstart/"><kbd><img src="https://www.google.com/s2/favicons?domain=goose-docs.ai&amp;sz=64" alt="Logo do Goose" width="16" valign="middle"> Goose</kbd></a> &nbsp;
  <a href="https://github.com/QwenLM/qwen-code"><kbd><img src="https://www.google.com/s2/favicons?domain=qwenlm.github.io&amp;sz=64" alt="Logo do Qwen Code" width="16" valign="middle"> Qwen Code</kbd></a> &nbsp;
  <a href="https://docs.factory.ai/cli/getting-started/quickstart"><kbd><img src="https://www.google.com/s2/favicons?domain=factory.ai&amp;sz=64" alt="Logo do Droid" width="16" valign="middle"> Droid</kbd></a> &nbsp;
  <a href="https://docs.cline.bot/cline-cli/overview"><kbd><img src="https://www.google.com/s2/favicons?domain=cline.bot&amp;sz=64" alt="Logo do Cline" width="16" valign="middle"> Cline</kbd></a> &nbsp;
  <kbd>+ qualquer agente com uma opção de "sim para tudo"</kbd>
</p>

---

## Como começar

Diga isto ao seu agente de código:

> Get github.com/openslop/nightshift and set it up for my code at ~/code/my-app. Read SETUP.md there and follow it.

(Em português: "Baixe github.com/openslop/nightshift e configure para o meu código em ~/code/my-app. Leia o SETUP.md de lá e siga o que diz.")

É só isso. Seu agente vai fazer algumas perguntas, criar dois timers no seu computador e mostrar onde ficam as anotações.

Funciona no macOS, Linux e Windows. Se preferir fazer à mão, [`SETUP.md`](../../SETUP.md) é a página que seu agente segue.

### Veja funcionando

<p align="center">
  <img src="../../assets/nightshift-console.png" alt="O console do Nightshift" width="100%">
</p>

Diga ao seu agente de código:

> Open the Nightshift console. Read ~/nightshift/tui/README.md and start it.

(Em português: "Abra o console do Nightshift. Leia ~/nightshift/tui/README.md e inicie.")

Precisa do Node. Aperte `c` em um trabalho para conversar com o agente sobre o que ele fez. Aperte `?` para ver o resto.

## O que tem dentro

- [`jobs/`](../../jobs) tem uma página por trabalho, em palavras simples. Leia. Mude se quiser.
- [`jobs/_common.md`](../../jobs/_common.md) tem as regras que todo trabalho segue.
- [`review/SKILL.md`](../../review/SKILL.md) diz como o revisor age.
- [`nightshift.conf.example`](../../nightshift.conf.example) é a página de configurações. Seu agente preenche uma cópia.
- [`SETUP.md`](../../SETUP.md) é a página que seu agente segue para configurar tudo.
- [`bin/`](../../bin) tem três scripts pequenos que os timers rodam. Você não precisa ler.
- [`tui/`](../../tui) é o console. [`tui/README.md`](../../tui/README.md) diz como abrir.

## É seguro?

- Ele só abre pull requests. Você decide o que é mesclado.
- Ele nunca toca em um arquivo que outro pull request aberto toca.
- Ele roda suas verificações antes de abrir qualquer coisa.
- Ele roda uma vez por noite. Se seu computador estava dormindo, ele pula aquela noite em vez de rodar no meio do seu dia.
- Tudo o que ele faz é gravado em um log no seu computador, fora do seu repositório.

## Mude do seu jeito

- Desligue um trabalho tirando o nome dele da linha `JOBS` nas suas configurações.
- Mude como um trabalho pensa editando a página dele em `jobs/`. Mantenha as palavras simples.
- Adicione um trabalho criando uma nova página em `jobs/` e colocando o nome dele em `JOBS`.
- Use outro agente escolhendo outra linha `AGENT` nas suas configurações.

## Desligue

Diga ao seu agente: "Turn off Nightshift." (Em português: "Desligue o Nightshift.") Ele remove os dois timers. Seu código não é tocado.

---

## Comunidade &amp; suporte

- **Discord:** Entre na comunidade no **[Discord](https://discord.gg/nightshift)**.
- **Ideias e bugs:** Falta um trabalho? Uma noite deu errado? [Abra uma issue](https://github.com/openslop/nightshift/issues).
- **Compartilhe um trabalho:** Escreveu uma página de trabalho que funciona bem? Abra um pull request e coloque em `jobs/`.
- **Mostre apoio:** Dê uma [estrela](https://github.com/openslop/nightshift) neste repositório para acompanhar.

---

## Desenvolvendo

Quer adicionar um trabalho, corrigir um script ou trabalhar no console? Veja o [CONTRIBUTING.md](../../CONTRIBUTING.md).

Nightshift é feito de shell scripts, páginas de trabalho em texto simples e um console em Node sem dependências. Não tem etapa de build.

<a href="https://github.com/openslop/nightshift/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=openslop/nightshift" alt="Contribuidores do Nightshift">
</a>

## Histórico de estrelas

<p align="center">
  <a href="https://star-history.com/#openslop/nightshift&Date">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=openslop/nightshift&amp;type=Date&amp;theme=dark">
      <img src="https://api.star-history.com/svg?repos=openslop/nightshift&amp;type=Date" alt="Gráfico do histórico de estrelas do GitHub para openslop/nightshift" width="880">
    </picture>
  </a>
</p>

## Licença

Nightshift é livre e de código aberto sob a [Licença MIT](../../LICENSE). Use, copie, mude.
