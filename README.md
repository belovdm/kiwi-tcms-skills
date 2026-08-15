# Kiwi TCMS AI Skills

AI-навыки для QA-воркфлоу с [Kiwi TCMS](https://kiwitcms.org) через
[`kiwi-tcms-mcp`](../kiwi-tcms-mcp) и
[`kiwi-tcms-reporter`](../kiwi-tcms-reporter).

Адаптация [testomatio/skills](https://github.com/testomatio/skills): та же модель
«скилл = спецификация для агента», но все вызовы идут в Kiwi (`kiwi_*`) и в
pipe `kiwi-tcms-pipe`.

29 скиллов. Тексты `SKILL.md` и `references/` — **на английском** (их читает
агент). Этот README и `docs/` — **на русском**.

- Установка по агентам: [docs/install-details.md](./docs/install-details.md)
- Как скиллы работают на примерах: [docs/examples.md](./docs/examples.md)
- Правила написания скиллов: [SKILL-GUIDE.md](./SKILL-GUIDE.md)

## Как это работает

1. Вы ставите пак (плагин, junction или `npx skills add`).
2. Пишете обычным языком: «напиши кейсы на оплату QR», «разбери ран 87».
3. Агент по `description` выбирает скилл, читает `SKILL.md` и вызывает
   инструменты `kiwi_*` / репортер.
4. Мутации (создание кейсов, смена статусов) — после вашей сводки.

Скилл можно вызвать явно: `/kiwi-write-test-cases` или
`/test-management:kiwi-write-test-cases`.

Текст кейсов — на русском: заголовок, шаги, ожидаемый результат. Заголовки
секций тоже на русском: `## Подготовка` / `## Шаги` / `## Ожидаемый результат`.
Формат: [kiwi-case-format.md](./skills/kiwi-sync-test-cases/references/kiwi-case-format.md).

## Короткий пример

> Пользователь: Напиши кейсы на оплату по QR и заведи их в план «Платежи, спринт 24».

Агент поднимает `kiwi-write-test-cases`:

1. `kiwi_ping` → проект Payments.
2. `kiwi_list_plans(query: "Платежи, спринт 24")` → план #31 (или создаёт).
3. Гейты: источники → объём (smoke / balanced) → чек-лист → подтверждение.
4. После ревизии списка — `kiwi_search_cases` (не плодить дубли) и
   `kiwi_create_case` × N.
5. В файлы `docs/cases/*.md` дописывается `TC-<id>`.

Отчёт: «создано 11 кейсов, план #31, пропущен 1 дубль».

Ещё сценарии — в [docs/examples.md](./docs/examples.md).

## Каталог (29)

### Управление тестами

| Скилл | Откуда | Что делает |
| --- | --- | --- |
| `kiwi-qa-thinking` | `qa-thinking` | Линзы риска + сверка с уже существующими кейсами Kiwi |
| `kiwi-write-test-cases` | `qa-write-test-cases` | Чек-лист → кейсы → `kiwi_create_case` |
| `kiwi-split-testing-levels-pyramid` | `qa-split-testing-levels-pyramid` | unit / integration / e2e / ручные + теги `level:*` |
| `kiwi-improve-test-cases` | `improve-test-cases` | Оценка /10, правки через `kiwi_update_case` |
| `kiwi-detect-duplicate-test-cases` | `detect-duplicate-test-cases` | Дубли; в Kiwi отключает, не удаляет |
| `kiwi-sync-test-cases` | `sync-test-cases-with-tms` | Локальный Markdown ↔ Kiwi |
| `kiwi-test-code-coverage` | `qa-test-code-coverage` | Карта `coverage.tests.yml` + impact-запуск |
| `kiwi-scan-automation-project` | `scan-automation-project` | Инвентарь стека → `automation-inventory.yml` |
| `kiwi-testing-workflow` | `testing-workflow` | Оркестратор; состояние в `.kiwi-workflow.yml` |
| `kiwi-qa-lead-strategy-advisor` | `qa-lead-strategy-advisor` | Живые метрики Kiwi, зрелость L1–L5, дорожный план |
| `kiwi-requirement-reviewer` | `qa-requirement-reviewer` | Готовность требований до разработки |
| `kiwi-sprint-report` | `qa-sprint-report-by-testomatio` | Спринт-отчёт по ранам Kiwi |

### Автоматизация

| Скилл | Откуда | Что делает |
| --- | --- | --- |
| `kiwi-setup-e2e-reporting` | `qa-e2e-tests-reporting` | Подключает `@kiwi-tcms-ai/kiwi-tcms-reporter` или `kiwi-tcms-pipe` |
| `kiwi-automate-manual-cases` | `automate-manual-test-cases` | CONFIRMED-кейсы → автотесты + `is_automated` |
| `kiwi-debug-failed-flaky-autotests` | `debug-fix-failed-flaky-autotests` | Падение: тест / продукт / окружение |
| `kiwi-automation-consolidation` | `qa-automation-test-consolidation` | Дубли автотестов (не ручных `*.md`) |
| `kiwi-data-seeder` | `qa-data-seeder` | Сбалансированные датасеты |
| `kiwi-run-tests-with-reporter` | `run-tests-with-testomatio-reporter` | Прогон так, чтобы результаты попали в TestRun |
| `kiwi-setup-ci-automation` | `setup-ci-automation` | CI-джобы + секреты `KIWI_*` + pipe |
| `kiwi-allure-adapter` | `testomat-allure-adapter` | `allure-results` → JSON → pipe |
| `kiwi-run-triage` | *(дополнительный)* | Классификация падений, ссылки на баги, сводка |

### PR / change-aware

| Скилл | Откуда | Что делает |
| --- | --- | --- |
| `kiwi-pr-diff-analyzer` | `pull-request-diff-analyzer` | Что изменилось в git diff |
| `kiwi-pr-requirements-analyzer` | `qa-pr-requirements-analyzer` | Что PR *должен* делать (тикет, описание) |
| `kiwi-setup-change-aware-testing` | `setup-change-aware-pr-testing` | В PR только затронутые тесты по карте покрытия |

### Исследовательские

| Скилл | Откуда | Что делает |
| --- | --- | --- |
| `kiwi-explore-setup` | `explorbot-setup` | `.kiwi-explore.yml`, guardrails, пробная запись |
| `kiwi-explore-fundamentals` | `explorbot-fundamentals` | Сессия: находки → кейсы / баг-ссылки / скриншоты |
| `kiwi-explore-plan` | `explorbot-plan` | Чартер: миссия, персоны, оракулы, таймбокс |

### Мета

| Скилл | Откуда | Что делает |
| --- | --- | --- |
| `kiwi-mcp-usage` | `testomatio-mcp` | Как вызывать `kiwi_*`: порядок, имена vs id, `kiwi_rpc` |
| `kiwi-skill-feedback-backlog` | *(дополнительный)* | Бэклог трения от использования скиллов/MCP в `./.kiwi-reports/` (не в гите), для разработчика скиллов |

## Требования

1. Работающий `kiwi-tcms-mcp` (`KIWI_URL`, `KIWI_USERNAME`, `KIWI_PASSWORD`, `KIWI_PROJECT`).
   См. [kiwi-tcms-mcp/README.md](../kiwi-tcms-mcp/README.md) и
   [mcp-setup.md](./skills/kiwi-mcp-usage/references/mcp-setup.md).
2. Для репортинга / CI — пакет `@kiwi-tcms-ai/kiwi-tcms-reporter` и те же
   переменные. Нативные адаптеры: Playwright, Jest, Mocha. Остальные стеки —
   JUnit/JSON-pipe.

Пароль в коммит не класть.

## Установка

Пошагово по агентам: [docs/install-details.md](./docs/install-details.md).

**Skills CLI** (большинство агентов):

```bash
npx skills add /path/to/this/repo/kiwi-tcms-skills
```

**Плагины Claude Code / Grok** — маркетплейс `kiwi-tcms-plugins`:

| Плагин | Для чего |
| --- | --- |
| `test-management` | Кейсы, синхрон, покрытие, справочник MCP |
| `qa-process` | Зрелость, дорожный план, оркестратор цикла |
| `test-automation` | Автотесты, репортер/pipe, CI, триаж |
| `kiwi-explore` | Исследовательские сессии |

```text
/plugin marketplace add /path/to/kiwi-tcms-ai/kiwi-tcms-skills
/plugin install test-management@kiwi-tcms-plugins
```

```bash
grok plugin marketplace add /path/to/kiwi-tcms-ai/kiwi-tcms-skills
grok plugin install test-management --trust
```

**Windows** (junctions плагинов и `.claude` / `.grok` / `.agents` / `.cursor`):

```powershell
powershell -File ./scripts/link-plugin-skills.ps1
powershell -File ./scripts/link-agent-skills.ps1
```

## Структура

```
skills/<skill-name>/              # канон, не зависит от агента
├── SKILL.md                      # оркестрация
├── references/                   # форматы, CLI, примеры
└── scripts/
plugins/<bundle>/                 # обёртки Claude / Grok
├── plugin.json
├── .mcp.json                     # регистрирует MCP-сервер kiwi-tcms
├── .claude-plugin/plugin.json
└── skills/ → junctions на ../../skills/* (пересобираются link-*.ps1)
.claude-plugin/marketplace.json
.grok-plugin/
├── marketplace.json
└── plugin-index.json
.codex-plugin/
└── plugin.json                   # весь skills/ как один Codex-плагин
scripts/
├── link-plugin-skills.ps1        # пересоздаёт junctions в plugins/*/skills/
└── link-agent-skills.ps1         # пересоздаёт junctions в .claude / .grok / .agents / .cursor
docs/
├── install-details.md
└── examples.md
```

Каждый `plugins/<bundle>/.mcp.json` регистрирует один и тот же MCP-сервер
`kiwi-tcms` — без него скиллы плагина не смогут вызвать `kiwi_*`, даже если
плагин установлен отдельно от `test-management`.

`plugins/<bundle>/skills/*` — не symlink (на Windows git часто превращает
symlink в обычный текстовый файл-указатель), а обычные git-отслеживаемые
файлы, продублированные из `skills/<skill-name>/`, поверх которых
`link-plugin-skills.ps1` создаёт NTFS junction локально. Правьте контент
только в `skills/<skill-name>/` и пересобирайте junctions скриптом — прямая
правка файла под `plugins/<bundle>/skills/` до пересборки создаст
рассинхронизацию между двумя git-копиями одного скилла.

Общие факты (каждое в одном месте):

- формат кейса → `kiwi-sync-test-cases/references/kiwi-case-format.md`
- раскладка репо → `kiwi-scan-automation-project/references/project-layout.md`
- репортер / pipe → `kiwi-setup-e2e-reporting/references/`
- установка MCP → `kiwi-mcp-usage/references/mcp-setup.md`
