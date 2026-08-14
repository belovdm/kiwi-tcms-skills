# Kiwi case Markdown format

Canonical local file for a Kiwi TCMS case. Sync reads and writes this shape.
**Case content is Russian** — summary, steps, expected results. Section
headings (`Подготовка` / `Шаги` / `Ожидаемый результат`) are Russian too.
Metadata bullet keys and Kiwi's own enum values (`P1`…`P5`, `CONFIRMED`, …)
stay as Kiwi defines them.

```markdown
# TC-412: Оплата картой с 3-D Secure проходит успешно

- **Priority:** P1
- **Status:** CONFIRMED
- **Category:** Functional
- **Tags:** payments, regression
- **Automated:** false
- **Requirement:** https://github.com/acme/shop/blob/main/docs/requirements/payments.md
- **Script:** tests/checkout/pay-by-card.spec.ts

## Подготовка
Покупатель авторизован. В корзине один товар в наличии.

## Шаги
1. Открыть оформление заказа
   Ожидается: форма оплаты отображается
2. Выбрать оплату картой и ввести тестовую карту
   Ожидается: поля карты принимают значения
3. Подтвердить 3-D Secure
   Ожидается: банковская проверка завершается успешно

## Ожидаемый результат
Оплата подтверждена. Статус заказа — Paid.
```

`**Requirement:**` and `**Script:**` are optional — include them once the
link target exists. Omit either line rather than leaving it empty.

## Linking to a public repo

`requirement` and `script` are free text — a full URL works as well as a
path, and a full URL is clickable straight from the Kiwi UI. Prefer one when
the repo has a known public remote:

1. `git remote get-url origin` (fall back to the push remote / the remote the
   user names). No remote, or it isn't `github.com` / `gitlab.com` /
   `bitbucket.org` → use the repo-relative path (`docs/requirements/{topic}.md`,
   `tests/{file}`). Do not guess a URL for a private or unknown host.
2. Branch: the repo's default branch (`git remote show origin` → `HEAD
   branch`), not a feature branch — a case should keep linking to the file
   after the branch merges and is deleted.
3. Build the blob URL:
   - GitHub: `https://github.com/{org}/{repo}/blob/{branch}/{path}`
   - GitLab: `https://gitlab.com/{org}/{repo}/-/blob/{branch}/{path}`
   - Bitbucket: `https://bitbucket.org/{org}/{repo}/src/{branch}/{path}`
4. Write the full URL into `**Requirement:**` / `**Script:**` instead of the
   bare path.

## Mapping

| Markdown | Kiwi field |
| --- | --- |
| `# TC-<id>: <summary>` | `id` + `summary` |
| `# <summary>` (no `TC-`) | new case; sync writes the id back |
| `**Priority:**` | `priority` (name from `kiwi_list_priorities`) |
| `**Status:**` | case status (`CONFIRMED`, …) |
| `**Category:**` | `category` |
| `**Tags:**` | comma-separated tags |
| `**Automated:**` | `is_automated` |
| `**Requirement:**` | `requirement` — path or full URL (see [Linking to a public repo](#linking-to-a-public-repo)) to the doc in `docs/requirements/`, via `kiwi_create_case(requirement: ...)` / `kiwi_update_case(requirement: ...)`. |
| `**Script:**` | `script` — path or full URL to the automation spec, via `kiwi_update_case(script: "<path-or-url>")`. Set once the case is automated; matches `**Automated:** true`. |
| Everything from `## Подготовка` to the end of the file | `text`, verbatim — the whole block (headings included) goes into `kiwi_create_case(text: ...)` / `kiwi_update_case(text: ...)` as one string. Kiwi stores and renders it as Markdown; **the server does not parse or split it.** |

`case_text_version` and `notes` go in an HTML comment, not in visible sections.

Reading a case back (`kiwi_get_case`) returns `text` the same way — one
Markdown string, unparsed. Read the `## Подготовка` / `## Шаги` /
`## Ожидаемый результат` sections yourself; there is no separate
`setup`/`actions`/`expected` field to rely on.

## Identity

- `TC-<id>` is the Kiwi numeric case id. Never invent one.
- No id → new case. After `kiwi_create_case`, write `TC-<id>` into the heading.
- Match order: `TC-<id>` → exact `summary` → `summary__icontains` only when a single candidate remains.

## Rules

- One case = one verifiable idea.
- Steps are verbs. Expected results are observable facts.
- Metadata is a bold-key bullet list only.
- Do not write `id:` / `product:` extra keys. Product is `KIWI_PROJECT`.
- Text fields are Markdown.
- `kiwi_update_case(text: ...)` **replaces the whole field.** Changing one
  section (e.g. just Expected) still means sending the full, current body —
  all sections — as `text`, not a fragment. There is no server-side merge.

Default directory: `docs/cases/**/*.md`. Keep an existing project folder if it already has cases.
