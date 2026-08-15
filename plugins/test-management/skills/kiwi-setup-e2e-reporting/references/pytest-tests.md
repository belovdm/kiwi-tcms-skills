# Python (pytest) via kiwi-tcms-pipe

pytest has no native adapter (JS/TS only — see
[reporters-config.md](./reporters-config.md)). Route through
[kiwi-tcms-pipe](./pipe-cli.md), same as any other non-JS stack.

**Do not use `kiwitcms-pytest-plugin`** (the official Kiwi TCMS plugin) as the
default path. It auto-creates a TestCase per pytest nodeid on every run, with
no matching against curated cases and no `--dry-run` / `--create-missing`
gate — that breaks the "cases already exist, tests just link to them" model
this skillset uses everywhere else. It also reads `~/.tcms.conf` and
`TCMS_RUN_ID` / `TCMS_PLAN_ID` / `TCMS_PRODUCT` / `TCMS_BUILD`, not the
`KIWI_URL` / `KIWI_USERNAME` / `KIWI_PASSWORD` / `KIWI_PROJECT` env vars used
elsewhere in this project. Only reach for it if the user explicitly wants
that auto-provisioning behavior instead.

## The marker gotcha

The pipe extracts case ids with `\b(?:C|TC|KIWI)[-_:]?(\d{2,7})\b` against the
test **title** (and `tags`, for JSON). A pytest function name is
`[A-Za-z0-9_]+` only — `_` is a word character, so `def
test_payment_C412_card()` never produces a word boundary before `C412` and
**will not match**. This isn't a problem in JS because test titles are free
strings (`"...pay by card [C412]"`).

Two ways around it:

### Option A — marker in the docstring (recommended)

Put `[C412]` in the test's docstring instead of its name. Docstrings are free
text, so the same regex matches normally. Requires a small `conftest.py` to
turn results into the pipe's JSON shape (JUnit XML has no docstring field):

```python
# conftest.py
import json

_docstrings: dict[str, str] = {}
_results: list[dict] = []

def pytest_collection_modifyitems(items):
    for item in items:
        doc = getattr(item.function, "__doc__", None) if hasattr(item, "function") else None
        if doc:
            _docstrings[item.nodeid] = " ".join(doc.split())

def pytest_runtest_logreport(report):
    if report.when != "call" and not (report.when == "setup" and report.outcome != "passed"):
        return
    _results.append({
        "title": _docstrings.get(report.nodeid, report.nodeid),
        "fullTitle": report.nodeid,
        "status": report.outcome,  # passed | failed | skipped
        "durationMs": int(report.duration * 1000),
        "error": str(report.longrepr) if report.outcome == "failed" else None,
    })

def pytest_sessionfinish(session, exitstatus):
    with open("kiwi-results.json", "w", encoding="utf-8") as f:
        json.dump({"tests": _results}, f)
```

```python
def test_payment_card():
    """Shopper can pay by card [C412]"""
    ...
```

```bash
pytest
npx kiwi-tcms-pipe --plan 12 --build "$CI_COMMIT_TAG" --results kiwi-results.json --format json
```

### Option B — marker via parametrize id, JUnit XML (no extra code)

`[` and `]` are non-word characters, so a parametrize id survives the
boundary check once pytest appends it to the nodeid in brackets:

```python
import pytest

@pytest.mark.parametrize("kiwi_id", ["C412"])
def test_payment_card(kiwi_id):
    ...
```

```bash
pytest --junitxml=junit.xml
npx kiwi-tcms-pipe --plan 12 --build "$CI_COMMIT_TAG" --results junit.xml
```

Node id becomes `test_payment_card[C412]` — the pipe's JUnit parser reads
this as the test title and the marker matches. Awkward for tests that don't
otherwise need parametrization; prefer Option A for a real suite.

## Status mapping

Same normalization as the JSON format in [pipe-cli.md](./pipe-cli.md):
pytest's `passed` / `failed` / `skipped` outcomes map directly.

## Detecting the stack

`pytest.ini`, `conftest.py`, `pyproject.toml` with `[tool.pytest.ini_options]`,
or `test_*.py` / `*_test.py` files — see `kiwi-scan-automation-project`.
