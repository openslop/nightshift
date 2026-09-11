<p align="center">
  <img src="../../assets/nightshift-lockup-animated.svg" alt="Nightshift" width="520">
</p>

<p align="center">
  <a href="https://github.com/openslop/nightshift"><img src="https://img.shields.io/github/stars/openslop/nightshift?style=flat&amp;label=%E2%98%85&amp;color=6b6bcf" alt="Estrellas en GitHub"></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-6b6bcf?style=flat" alt="Licencia: MIT"></a>
  <a href="https://discord.gg/zeP5482ced"><img src="https://img.shields.io/badge/Discord-5865F2?logo=discord&amp;logoColor=white" alt="Únete al Discord de Nightshift"></a>
  <img src="https://img.shields.io/badge/macOS%20%7C%20Linux%20%7C%20Windows-1c1720?style=flat" alt="Funciona en macOS, Linux y Windows">
  <img src="https://img.shields.io/badge/works%20with-any%20coding%20agent-6b6bcf?style=flat" alt="Funciona con cualquier agente de código">
</p>

<p align="center">
  <sub><a href="../../README.md">English</a> · <a href="README.zh-CN.md">中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · Español · <a href="README.fr.md">Français</a> · <a href="README.pt.md">Português</a></sub>
</p>

<p align="center">
  <strong>Tu código mejora mientras duermes.</strong><br>
  Un ayudante que despierta a tu agente de código por la noche, le da un trabajo pequeño y deja pull requests para la mañana.
</p>

<h3 align="center"><a href="#cómo-empezar"><ins>Instálalo con una sola frase</ins></a></h3>

<p align="center">
  <img src="../../assets/nightshift-demo.svg" alt="Nightshift trabaja de noche y deja pull requests para la mañana" width="100%">
</p>

## ¿Qué es esto?

Nightshift es un ayudante que trabaja de noche.

Despierta a tu agente de código. Le da un trabajo pequeño. El agente mira tu código y hace el trabajo. Si encuentra algo que vale la pena arreglar, abre un pull request para que lo revises. Luego pasa al siguiente trabajo.

Por la mañana, lees lo que hizo. Muchas noches no encuentra nada. No pasa nada. Nada es mejor que un mal cambio.

Cada dos horas, también lee los pull requests abiertos y deja una reseña corta.

## Funciones

<table>
<tr>
<td width="50%" valign="middle">

### Un trabajo pequeño a la vez

Diez trabajos, uno tras otro. Seguridad, bugs, legibilidad, mantenibilidad, rendimiento, convenciones, arquitectura, pruebas de humo e issues. Cada uno tiene al agente entero para un solo trabajo y nada más.

[Los trabajos →](#los-trabajos)

</td>
<td width="50%">
  <a href="#los-trabajos"><img src="../../assets/features/jobs.svg" alt="Ocho trabajos corren uno tras otro; cada fila termina en PR OPEN o NO-OP" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### Pull requests para la mañana

Solo abre pull requests. Nada se sube a main. Nada se fusiona solo. Los lees con un café y fusionas lo que te guste.

[¿Es seguro? →](#es-seguro)

</td>
<td width="50%">
  <a href="#es-seguro"><img src="../../assets/features/morning.svg" alt="Un reloj avanza de 05:12 a 07:31 mientras aparecen cuatro pull requests" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### Un revisor cada dos horas

Un segundo temporizador lee tus pull requests abiertos y deja una reseña corta. Se queda callado a menos que encuentre algo.

[Cómo actúa el revisor →](../../review/SKILL.md)

</td>
<td width="50%">
  <a href="../../review/SKILL.md"><img src="../../assets/features/review.svg" alt="Una línea de tiempo de un día marca cada dos horas; la mayoría de las marcas son silenciosas, dos dejan una nota" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### No se mete en tu camino

Antes de subir nada, un guardia compara cada archivo con cada pull request abierto. Si un compañero ya está en un archivo, el trabajo descarta ese cambio y lo dice.

[Las reglas que sigue cada trabajo →](../../jobs/_common.md)

</td>
<td width="50%">
  <a href="../../jobs/_common.md"><img src="../../assets/features/guard.svg" alt="El guardia marca como prohibido un archivo tocado por un pull request abierto" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### La consola

Cada noche y cada trabajo en una sola pantalla. Un reloj, un radar de las últimas cuarenta noches y una cuadrícula de lo que hizo cada trabajo. Necesita Node y nada más.

[Abrir la consola →](../../tui/README.md)

</td>
<td width="50%">
  <a href="../../tui/README.md"><img src="../../assets/features/console.svg" alt="Tres paneles de la consola: un reloj, un barrido de radar y una matriz de puntos de trabajos por noche" width="100%"></a>
</td>
</tr>
<tr>
<td width="50%" valign="middle">

### Retoma la conversación

Pulsa `c` en cualquier trabajo y la consola vuelve a abrir la transcripción de esa noche. Pregúntale al agente por qué hizo lo que hizo. Dile qué hacer después.

[Continuar una conversación →](../../tui/README.md#continue-a-conversation)

</td>
<td width="50%">
  <a href="../../tui/README.md#continue-a-conversation"><img src="../../assets/features/resume.svg" alt="Al pulsar c se abre una terminal con claude --resume y el agente sigue donde lo dejó" width="100%"></a>
</td>
</tr>
</table>

**También en la caja:**

- **[Trabajos en palabras simples](../../jobs)** — Cada trabajo es una página de palabras sencillas. Léelas. Cámbialas. Añade las tuyas.
- **[Aprende tu gusto](../../jobs/_common.md)** — Los trabajos leen lo que dijiste en pull requests pasados antes de empezar.
- **[Corre tus comprobaciones](../../nightshift.conf.example)** — Lint, typecheck, tests. Cada trabajo debe hacer que pasen antes de abrir nada.
- **[Se salta tu jornada](../../nightshift.conf.example)** — Si tu portátil estaba dormido, la noche se salta. Nunca corre en mitad de tu día.
- **[Guarda los registros fuera de tu repo](../../SETUP.md)** — Todo lo que hace se escribe en una carpeta de tu ordenador, no en tu código.

---

## Los trabajos

| Trabajo                | Qué busca                                                                  |
| ---------------------- | -------------------------------------------------------------------------- |
| `security`             | Agujeros reales que alguien malintencionado podría usar. No preocupaciones de "quizás algún día". |
| `bugs`                 | Bugs que un usuario notaría. Solo los claros.                              |
| `readability`          | Nombres que no dicen nada. Código que hay que leer dos veces. Menos líneas, no más. |
| `maintainability`      | Código difícil de cambiar. Lo hace más simple.                             |
| `performance`          | Puntos lentos que la gente nota. Primero mide.                             |
| `conventions`          | Lugares que rompen tus propias reglas escritas. Solo arreglos seguros.     |
| `conventions-followup` | Las reglas rotas que necesitan un cambio de verdad. Un tema por noche.     |
| `architecture`         | La única gran forma en que el código podría ser más simple.                |
| `smoke-tests`          | Unas pocas pruebas tranquilas que comprueban que la app aún abre. Normalmente no hace nada. |
| `issues`               | Un issue de GitHub pequeño y claro. Deja los fáciles para gente nueva.     |
| `review`               | Lee los pull requests abiertos cada dos horas. Callado a menos que encuentre algo. |

Cada trabajo sigue las mismas reglas. Están en [`jobs/_common.md`](../../jobs/_common.md). En resumen:

- Lee primero las guías propias del repo. Ellas mandan.
- Lee lo que dijo el dueño en pull requests pasados. Aprende su gusto.
- Nunca toca un archivo que toque el pull request abierto de otra persona.
- Corre las comprobaciones del repo. Arregla lo que se rompa.
- Abre un pull request, o dice por qué no. Nunca sube a la rama main.

---

## Agentes compatibles

Funciona con **cualquier agente de código** que pueda correr desde una terminal sin hacer preguntas. Elige la línea `AGENT` que corresponda en [`nightshift.conf.example`](../../nightshift.conf.example).

<p>
  <a href="https://docs.anthropic.com/claude/docs/claude-code"><kbd><img src="https://www.google.com/s2/favicons?domain=anthropic.com&amp;sz=64" alt="Logo de Claude Code" width="16" valign="middle"> Claude Code</kbd></a> &nbsp;
  <a href="https://github.com/openai/codex"><kbd><img src="https://www.google.com/s2/favicons?domain=openai.com&amp;sz=64" alt="Logo de Codex" width="16" valign="middle"> Codex</kbd></a> &nbsp;
  <a href="https://cursor.com/cli"><kbd><img src="https://www.google.com/s2/favicons?domain=cursor.com&amp;sz=64" alt="Logo de Cursor" width="16" valign="middle"> Cursor</kbd></a> &nbsp;
  <a href="https://github.com/google-gemini/gemini-cli"><kbd><img src="https://www.google.com/s2/favicons?domain=gemini.google.com&amp;sz=64" alt="Logo de Gemini CLI" width="16" valign="middle"> Gemini CLI</kbd></a> &nbsp;
  <a href="https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli"><kbd><img src="https://www.google.com/s2/favicons?domain=github.com&amp;sz=64" alt="Logo de GitHub Copilot" width="16" valign="middle"> GitHub Copilot</kbd></a> &nbsp;
  <a href="https://hermes-agent.nousresearch.com/docs/"><kbd><img src="https://www.google.com/s2/favicons?domain=nousresearch.com&amp;sz=64" alt="Logo de Hermes Agent" width="16" valign="middle"> Hermes</kbd></a> &nbsp;
  <a href="https://github.com/openclaw/openclaw"><kbd><img src="https://www.google.com/s2/favicons?domain=openclaw.ai&amp;sz=64" alt="Logo de OpenClaw" width="16" valign="middle"> OpenClaw</kbd></a> &nbsp;
  <a href="https://opencode.ai/docs/cli/"><kbd><img src="https://www.google.com/s2/favicons?domain=opencode.ai&amp;sz=64" alt="Logo de OpenCode" width="16" valign="middle"> OpenCode</kbd></a> &nbsp;
  <a href="https://aider.chat/"><kbd><img src="https://www.google.com/s2/favicons?domain=aider.chat&amp;sz=64" alt="Logo de Aider" width="16" valign="middle"> Aider</kbd></a> &nbsp;
  <a href="https://ampcode.com/manual#install"><kbd><img src="https://www.google.com/s2/favicons?domain=ampcode.com&amp;sz=64" alt="Logo de Amp" width="16" valign="middle"> Amp</kbd></a> &nbsp;
  <a href="https://block.github.io/goose/docs/quickstart/"><kbd><img src="https://www.google.com/s2/favicons?domain=goose-docs.ai&amp;sz=64" alt="Logo de Goose" width="16" valign="middle"> Goose</kbd></a> &nbsp;
  <a href="https://github.com/QwenLM/qwen-code"><kbd><img src="https://www.google.com/s2/favicons?domain=qwenlm.github.io&amp;sz=64" alt="Logo de Qwen Code" width="16" valign="middle"> Qwen Code</kbd></a> &nbsp;
  <a href="https://docs.factory.ai/cli/getting-started/quickstart"><kbd><img src="https://www.google.com/s2/favicons?domain=factory.ai&amp;sz=64" alt="Logo de Droid" width="16" valign="middle"> Droid</kbd></a> &nbsp;
  <a href="https://docs.cline.bot/cline-cli/overview"><kbd><img src="https://www.google.com/s2/favicons?domain=cline.bot&amp;sz=64" alt="Logo de Cline" width="16" valign="middle"> Cline</kbd></a> &nbsp;
  <kbd>+ cualquier agente con una opción de "sí a todo"</kbd>
</p>

---

## Cómo empezar

Dile esto a tu agente de código:

> Get github.com/openslop/nightshift and set it up for my code at ~/code/my-app. Read SETUP.md there and follow it.

(Dice: descarga github.com/openslop/nightshift y configúralo para mi código en ~/code/my-app. Lee el SETUP.md que hay ahí y síguelo.)

Eso es todo. Tu agente te hará unas pocas preguntas, pondrá dos temporizadores en tu ordenador y te mostrará dónde van las notas.

Funciona en macOS, Linux y Windows. Si prefieres hacerlo a mano, [`SETUP.md`](../../SETUP.md) es la página que sigue tu agente.

### Míralo

<p align="center">
  <img src="../../assets/nightshift-console.png" alt="La consola de Nightshift" width="100%">
</p>

Dile a tu agente de código:

> Open the Nightshift console. Read ~/nightshift/tui/README.md and start it.

(Dice: abre la consola de Nightshift. Lee ~/nightshift/tui/README.md y arráncala.)

Necesita Node. Pulsa `c` en un trabajo para hablar con el agente sobre lo que hizo. Pulsa `?` para el resto.

## Qué hay dentro

- [`jobs/`](../../jobs) tiene una página por trabajo, en palabras simples. Léelas. Cámbialas si quieres.
- [`jobs/_common.md`](../../jobs/_common.md) tiene las reglas que sigue cada trabajo.
- [`review/SKILL.md`](../../review/SKILL.md) dice cómo actúa el revisor.
- [`nightshift.conf.example`](../../nightshift.conf.example) es la página de ajustes. Tu agente rellena una copia.
- [`SETUP.md`](../../SETUP.md) es la página que sigue tu agente para instalarlo todo.
- [`bin/`](../../bin) tiene tres scripts pequeños que corren los temporizadores. No hace falta que los leas.
- [`tui/`](../../tui) es la consola. [`tui/README.md`](../../tui/README.md) dice cómo abrirla.

## ¿Es seguro?

- Solo abre pull requests. Tú decides qué se fusiona.
- Nunca toca un archivo que toque otro pull request abierto.
- Corre tus comprobaciones antes de abrir nada.
- Corre una vez por noche. Si tu ordenador estaba dormido, se salta esa noche en vez de correr en mitad de tu día.
- Todo lo que hace se escribe en un registro en tu ordenador, fuera de tu repo.

## Cámbialo

- Apaga un trabajo quitando su nombre de la línea `JOBS` de tus ajustes.
- Cambia cómo piensa un trabajo editando su página en `jobs/`. Usa palabras simples.
- Añade un trabajo creando una página nueva en `jobs/` y poniendo su nombre en `JOBS`.
- Usa otro agente eligiendo otra línea `AGENT` en tus ajustes.

## Apágalo

Dile a tu agente: "Turn off Nightshift." (Apaga Nightshift.) Quita los dos temporizadores. Tu código no se toca.

---

## Comunidad y soporte

- **Discord:** Únete a la comunidad en **[Discord](https://discord.gg/zeP5482ced)**.
- **Ideas y bugs:** ¿Falta un trabajo? ¿Una noche salió mal? [Abre un issue](https://github.com/openslop/nightshift/issues).
- **Comparte un trabajo:** ¿Escribiste una página de trabajo que funciona bien? Abre un pull request y ponla en `jobs/`.
- **Muestra tu apoyo:** Dale una [estrella](https://github.com/openslop/nightshift) a este repo para seguirlo.

---

## Desarrollo

¿Quieres añadir un trabajo, arreglar un script o trabajar en la consola? Mira [CONTRIBUTING.md](../../CONTRIBUTING.md).

Nightshift son scripts de shell, páginas de trabajo en texto plano y una consola en Node sin dependencias. No hay paso de build.

<a href="https://github.com/openslop/nightshift/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=openslop/nightshift" alt="Colaboradores de Nightshift">
</a>

## Historial de estrellas

<p align="center">
  <a href="https://star-history.com/#openslop/nightshift&Date">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=openslop/nightshift&amp;type=Date&amp;theme=dark">
      <img src="https://api.star-history.com/svg?repos=openslop/nightshift&amp;type=Date" alt="Gráfico del historial de estrellas de GitHub para openslop/nightshift" width="880">
    </picture>
  </a>
</p>

## Licencia

Nightshift es libre y de código abierto bajo la [Licencia MIT](../../LICENSE). Úsalo, cópialo, cámbialo.
