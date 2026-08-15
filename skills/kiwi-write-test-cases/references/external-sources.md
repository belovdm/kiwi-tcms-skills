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

## Setting up a Redmine MCP server (if none is connected)

If Redmine is the detected tracker (`.kiwi-sources.yml` has `issue_tracker.kind: redmine`,
or the user names a Redmine ticket) and no `redmine`-named MCP tool is in the
available tool list, install [mcp-redmine](https://github.com/runekaagaard/mcp-redmine)
rather than asking the user to paste ticket content manually.

### Install (uv — preferred)

```bash
uv --version   # install uv first if missing: https://docs.astral.sh/uv/getting-started/installation/
```

Add to the MCP config (`.mcp.json` at the repo root, or the client's own MCP
config file):

```json
{
  "mcpServers": {
    "redmine": {
      "command": "uvx",
      "args": ["--from", "mcp-redmine", "--refresh-package", "mcp-redmine", "mcp-redmine"],
      "env": {
        "REDMINE_URL": "https://your-redmine-instance.example.com",
        "REDMINE_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Install (Docker — alternative)

```bash
git clone git@github.com:runekaagaard/mcp-redmine.git
cd mcp-redmine
docker build -t mcp-redmine .
```

```json
{
  "mcpServers": {
    "redmine": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "REDMINE_URL", "-e", "REDMINE_API_KEY", "mcp-redmine"],
      "env": {
        "REDMINE_URL": "https://your-redmine-instance.example.com",
        "REDMINE_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Required env vars

| Variable | Required | Description |
| --- | --- | --- |
| `REDMINE_URL` | Yes | Base URL of the Redmine instance (subpaths OK, e.g. `http://host/redmine/`) |
| `REDMINE_API_KEY` | Yes | API key — see below |
| `REDMINE_ALLOWED_DIRECTORIES` | Only for attachments | Comma-separated dirs allowed for upload/download; disabled if unset |
| `REDMINE_DANGEROUSLY_ACCEPT_INVALID_CERTS` | No | `1` to skip TLS verification for self-signed certs |

### Getting the API key

1. Log in to Redmine → "My account" (top-right menu).
2. "API access key" on the right → "Show" (existing) or "Generate" (new).

### Tool shape

mcp-redmine exposes generic OpenAPI-driven tools (`redmine_paths_list`,
`redmine_paths_info`, `redmine_request`, upload/download helpers) — there
are no fixed per-resource tool names. Call `redmine_paths_list` first to see
what's available, then `redmine_paths_info` for the exact request shape
before calling `redmine_request`. Do not guess REST paths or params.

## Save what you fetched

Write the fetched ticket/page content to `docs/requirements/{topic}.md`
(kebab-case, from the ticket/page title) before moving on to the gates —
this is the same file the case's **Requirement** field points to later
([kiwi-case-format.md](../../kiwi-sync-test-cases/references/kiwi-case-format.md)).
A source pulled from the tracker/wiki still becomes a normal repo-local
requirement file; nothing downstream special-cases it.
