# External requirement sources (issue tracker, wiki)

When the user names a ticket number or a wiki page/project as the source
(e.g. "Redmine #4821", "Confluence project SHOP", "SHOP-42"), pull it
directly through MCP instead of asking them to paste it — if a matching MCP
server is connected.

## Detect

Look at the available tool list for names hinting at an issue tracker or a
wiki — `redmine`, `jira`, `linear`, `github` (issues), `confluence`,
`notion`, `wiki`. There is no fixed tool name to call: every server names
its tools differently, and none is bundled with this pack.

- Found → use it.
- None found → ask the user to paste the ticket/page content, same as
  before. Do not claim a fetch that didn't happen.

## Project / space context

A bare ticket number or page title is often not enough to resolve — most
trackers need a project (Redmine) or key namespace (Jira `SHOP-42`), most
wikis need a space (Confluence). Where that comes from:

1. `.kiwi-sources.yml` at the repo root (below) — already has the
   tracker/wiki configured → use it, don't ask again.
2. Not there yet → ask once: which project (tracker) / which space (wiki).
   Then write the answer into `.kiwi-sources.yml` so the next run doesn't ask.

## `.kiwi-sources.yml`

Repo root, **committed** — this is project config, not a `.kiwi-cache/`
scratch artifact.

```yaml
issue_tracker:
  kind: redmine # redmine | jira | linear | github-issues | ...
  base_url: https://redmine.example.com
  project: acme-shop # project id/key the tracker needs to resolve a bare ticket number
wiki:
  kind: confluence # confluence | notion | github-wiki | ...
  base_url: https://wiki.example.com
  space: SHOP # space key/id
```

- Write only the section you actually needed (`issue_tracker` and/or
  `wiki`) — do not invent the other from a guess.
- **No credentials here.** Auth is the tracker/wiki MCP server's own setup
  (env vars, its own config step) — same rule as `.kiwi-explore.yml`'s
  `credentials_env`.
- User names a different project/space than what's cached → ask whether
  this run only, or update the file.

## Save what you fetched

Write the fetched ticket/page content to `docs/requirements/{topic}.md`
(kebab-case, from the ticket/page title) before moving on to the gates —
this is the same file the case's **Requirement** field points to later
([kiwi-case-format.md](../../kiwi-sync-test-cases/references/kiwi-case-format.md)).
A source pulled from the tracker/wiki still becomes a normal repo-local
requirement file; nothing downstream special-cases it.
