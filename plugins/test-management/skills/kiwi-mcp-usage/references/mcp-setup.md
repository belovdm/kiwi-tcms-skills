# kiwi-tcms-mcp setup

Connect an agent to an already-built `kiwi-tcms-mcp` and a running Kiwi TCMS.
Building the server is out of scope — see `kiwi-tcms-mcp/README.md`.

## Credentials

Use the same Kiwi login and password as the official [tcms-api](https://tcms-api.readthedocs.io/en/latest/modules/tcms_api.html) client (`Auth.login`).
Do not print the password in chat. Do not commit it.

## Environment / flags

| Variable | Flag | Required | Description |
| --- | --- | --- | --- |
| `KIWI_URL` | `--url` | yes | Instance base URL, no `/json-rpc/` |
| `KIWI_USERNAME` | `--username` | yes | Kiwi login |
| `KIWI_PASSWORD` | `--password` | yes | Kiwi password |
| `KIWI_PROJECT` | `--project` | no | Default Product name or id |
| `KIWI_TIMEOUT` | `--timeout` | no | RPC timeout ms (default `30000`) |
| `KIWI_DEFAULT_LIMIT` | `--limit` | no | Default list/filter page size (default `20`, max `200`) |
| `KIWI_INSECURE=1` | `--insecure` | no | Skip TLS verify (self-signed only) |

Flags win over env.

## Agent configs

**Claude Desktop** (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "kiwi-tcms": {
      "command": "npx",
      "args": ["-y", "@kiwi-tcms-ai/kiwi-tcms-mcp"],
      "env": {
        "KIWI_URL": "https://tcms.example.com",
        "KIWI_USERNAME": "<username>",
        "KIWI_PASSWORD": "<password>",
        "KIWI_PROJECT": "Payments"
      }
    }
  }
}
```

**Grok / Claude Code** (`.mcp.json` at the project root) — same `mcpServers.kiwi-tcms` block.
Prefer env from `.env`; do not put the password in a committed file.

**Cursor** (`.cursor/mcp.json`) — same shape, optional `"type": "stdio"`.

**VS Code** (`.vscode/mcp.json`) uses `"servers"` instead of `"mcpServers"`.

Do not overwrite other MCP server entries.

## Health-check

Stop at the first failure.

1. Config present — `kiwi-tcms` server entry exists.
2. Credentials present — `KIWI_USERNAME` and `KIWI_PASSWORD` set. Do not print the password.
3. Kiwi is up — `kiwi_ping` → `ok` and the configured product.
4. Handshake / "connection closed" → build and point the command at `kiwi-tcms-mcp/dist/index.js`, or `npm install -g @kiwi-tcms-ai/kiwi-tcms-mcp`.
5. `401`/`403` → check username/password. `404` on `/json-rpc/` → `KIWI_URL` is the base URL only.

## Names vs ids

Accepted **by name** (server resolves): priority, category, plan type, execution/case status, build, user login.
Pass **by id**: plan, case, run, execution.

Names are case-insensitive. Execution status is resolved in the run's context.

Full tool list: `kiwi-tcms-mcp` `tools/list`. Anything missing → `kiwi_rpc`.
