# Roadmap Output Format

How to format the prioritized roadmap and any other advisory output.
The user reads this in chat or a terminal, so dense paragraphs are unreadable there.
Optimize for **scanning**: each item and the next action should be clear in a 3-second glance.

## Hard Rules

1. **One idea per line.** Short sentences.
2. **Mark lines with emoji markers** (see template). The eye orients by emoji, not by reading.
3. **Separator between items**: a horizontal line of 50 `-` characters between each pair, with a blank line above and below. Items must never touch.
4. **Number items with emoji digits** 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ and bold the heading.
5. **Maximum 5 items.** Default to 3–5. Offer more on request.
6. **Action** is a kiwi skill or a human action.
7. **Keep lines under ~100 characters.** One sentence per marked line.
8. **End with exactly one call-to-action line** that says what to type.

## Emoji Legend

| Marker | Meaning |
| ------ | ------- |
| 1️⃣–5️⃣  | Item number (priority order) |
| 📈     | Impact (high / medium / low) |
| ⏱️     | Effort (~1 hour / ~1 day / ongoing) |
| 🔍     | Found — a discovery fact behind the item |
| 🎯     | Goal — outcome after the item |
| ▶     | Action — concrete first step |
| 💬     | Call to action |

## Item Template

```
### N️⃣ <Action title — imperative, ≤ 8 words>

📈 Impact: <high|medium|low> · ⏱️ Effort: <rough estimate>

🔍 **Found:** <one sentence — scan / interview / Kiwi metric this item rests on>
🎯 **Goal:** <one sentence — result after the item>
▶ **Action:** <concrete action (skill or human)>

--------------------------------------------------

```

## Example Roadmap Output (follow strictly)

```
🗺️ **QA roadmap**

### 1️⃣ Send run results into Kiwi

  📈 Impact: high · ⏱️ Effort: ~1 day

  🔍 **Found:** 340 cases, automation 9%, no pass-rate — pipe is not connected.
  🎯 **Goal:** every CI run lands as a Kiwi test run with a visible pass-rate.
  ▶ **Action:** wire the reporter pipe → `kiwi-setup-e2e-reporting`

--------------------------------------------------

### 2️⃣ Clean the stale case base

  📈 Impact: high · ⏱️ Effort: ~3 days

  🔍 **Found:** 40% of cases untouched > 6 months; duplicates in plan #12.
  🎯 **Goal:** CONFIRMED cases are unique, current, and assignable.
  ▶ **Action:** dedupe then improve → `kiwi-detect-duplicate-test-cases`, `kiwi-improve-test-cases`

--------------------------------------------------

### 3️⃣ Map tests to source and cases

  📈 Impact: medium · ⏱️ Effort: ~1 week

  🔍 **Found:** 118 autotests have no C<id> / KIWI:<id> marker.
  🎯 **Goal:** a coverage.tests.yml map that can drive impact runs.
  ▶ **Action:** build the map → `kiwi-test-code-coverage`

--------------------------------------------------

💬 Type **"execute 1"** to start, **"expand 1"** for a detailed plan, **"adjust"** to change the roadmap, or **"save"** to write it to a file.
```
