# Установка kiwi-tcms-skills

Канон скиллов — [`skills/`](../skills/). Плагины в [`plugins/`](../plugins/) —
тонкие обёртки (junctions) вокруг этого дерева.

Задайте в окружении процесса `KIWI_URL`, `KIWI_USERNAME`, `KIWI_PASSWORD` и `KIWI_PROJECT`.
Пароль в коммит не класть.

- [Большинство агентов (`npx skills`)](#большинство-агентов)
- [Claude Code (маркетплейс)](#claude-code)
- [Grok (маркетплейс)](#grok)
- [Codex](#codex)
- [Cursor](#cursor)
- [VS Code / Copilot / Cline / Gemini](#vs-code--copilot--cline--gemini)
- [Junctions (Windows)](#junctions-windows)

## Большинство агентов

```bash
npx skills add /path/to/kiwi-tcms-ai/kiwi-tcms-skills
```

CLI [`skills`](https://skills.sh) копирует выбранные скиллы в каталог агента
(Claude, Cursor, Copilot, Cline, …). Обновление: `npx skills update`.

## Claude Code

В терминале Claude Code:

```text
/plugin marketplace add /path/to/kiwi-tcms-ai/kiwi-tcms-skills
/plugin install test-management@kiwi-tcms-plugins
/plugin install qa-process@kiwi-tcms-plugins
/plugin install test-automation@kiwi-tcms-plugins
/plugin install kiwi-explore@kiwi-tcms-plugins
```

Дальше: `/kiwi-write-test-cases` или квалифицированное имя
`/test-management:kiwi-write-test-cases`.

Плагин `test-management` кладёт `.mcp.json`: стартует
`@kiwi-tcms-ai/kiwi-tcms-mcp` через `npx`. Чтобы MCP подключился, плагину
нужен trust. Переменные: `KIWI_URL`, `KIWI_USERNAME`, `KIWI_PASSWORD`, `KIWI_PROJECT`.

## Grok

Grok читает `.grok-plugin/marketplace.json` (и эквивалент `.claude-plugin/`).

```bash
grok plugin marketplace add /path/to/kiwi-tcms-ai/kiwi-tcms-skills
grok plugin install test-management --trust
grok plugin install qa-process --trust
grok plugin install test-automation --trust
grok plugin install kiwi-explore --trust
```

Или источник в `~/.grok/config.toml`:

```toml
[[marketplace.sources]]
name = "kiwi-tcms-plugins"
path = "D:/source/softtailor/kiwi-tcms-ai/kiwi-tcms-skills"
```

Без маркетплейса — junctions в `.grok/skills/` скриптом ниже.

## Codex

Скажите Codex:

```text
install skills from D:\source\softtailor\kiwi-tcms-ai\kiwi-tcms-skills\skills
```

или запустите Skill Installer на этот каталог `skills/`.

Codex также читает `~/.agents/skills/` и `<репо>/.agents/skills/`:

```powershell
powershell -File ./scripts/link-agent-skills.ps1 -Vendors agents
powershell -File ./scripts/link-agent-skills.ps1 -Scope User -Vendors agents
```

## Cursor

1. Settings → Rules / Skills / Subagents → Add from folder (или GitHub, если
   пак запушен).
2. Укажите `kiwi-tcms-skills` или каталог `skills/`.

Либо junction в `.cursor/skills/`:

```powershell
powershell -File ./scripts/link-agent-skills.ps1 -Vendors cursor
```

## VS Code / Copilot / Cline / Gemini

- Copilot CLI и Gemini CLI смотрят `~/.agents/skills/` (как Codex).
- Cline / Continue: папка `skills/` как project rules или `npx skills add`.
- VS Code Claude / Copilot Chat: проектный `.claude/skills/` (скрипт его создаёт).

```powershell
powershell -File ./scripts/link-agent-skills.ps1
```

линкует все 28 скиллов в `../.claude/skills`, `../.grok/skills`,
`../.agents/skills` и `../.cursor/skills`.

## Junctions (Windows)

Git на Windows часто превращает symlink в обычные файлы. Пересоздать:

```powershell
powershell -File ./scripts/link-plugin-skills.ps1   # plugins/*/skills → skills/
powershell -File ./scripts/link-agent-skills.ps1    # каталоги агентов в воркспейсе
```

Используется `mklink /J` (админ не нужен). Перезапускайте после нового скилла.

## Плагины

| Плагин | Скиллы |
| --- | --- |
| `test-management` | `kiwi-mcp-usage`, `kiwi-sync-test-cases`, `kiwi-write-test-cases`, `kiwi-improve-test-cases`, `kiwi-detect-duplicate-test-cases`, `kiwi-split-testing-levels-pyramid`, `kiwi-test-code-coverage`, `kiwi-scan-automation-project`, `kiwi-requirement-reviewer`, `kiwi-pr-requirements-analyzer`, `kiwi-pr-diff-analyzer`, `kiwi-qa-thinking`, `kiwi-setup-e2e-reporting`, `kiwi-sprint-report` |
| `qa-process` | `kiwi-qa-lead-strategy-advisor`, `kiwi-qa-thinking`, `kiwi-split-testing-levels-pyramid`, `kiwi-testing-workflow` |
| `test-automation` | `kiwi-automate-manual-cases`, `kiwi-debug-failed-flaky-autotests`, `kiwi-automation-consolidation`, `kiwi-data-seeder`, `kiwi-run-tests-with-reporter`, `kiwi-setup-ci-automation`, `kiwi-setup-change-aware-testing`, `kiwi-allure-adapter`, `kiwi-run-triage` |
| `kiwi-explore` | `kiwi-explore-setup`, `kiwi-explore-fundamentals`, `kiwi-explore-plan` |

`kiwi-qa-thinking` и `kiwi-split-testing-levels-pyramid` входят и в
`test-management`, и в `qa-process` — как в оригинальном testomatio.
