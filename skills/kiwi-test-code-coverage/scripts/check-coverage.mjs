#!/usr/bin/env node
// Sanity-check a kiwi coverage.tests.yml mapping.
//
//   npx js-yaml coverage.tests.yml | node check-coverage.mjs
//
// Flags keys whose path is missing on disk, entries with no tests and no
// explicit empty list, and prints referenced case markers. Exits non-zero
// on a problem. Never use python.

import { existsSync, readFileSync } from "node:fs";

const raw = JSON.parse(readFileSync(0, "utf8"));
const map = raw && typeof raw === "object" && raw.coverage && typeof raw.coverage === "object"
  ? raw.coverage
  : raw;

if (!map || typeof map !== "object" || Array.isArray(map)) {
  console.error('expected { coverage: { "<path>": { tests: [...] } } } — pipe `npx js-yaml <file>`');
  process.exit(1);
}

const ids = new Set();
let problems = 0;

for (const [key, value] of Object.entries(map)) {
  const tests = value && typeof value === "object" && !Array.isArray(value) ? value.tests : value;
  const list = Array.isArray(tests) ? tests : tests == null ? [] : [tests];
  if (list.length === 0) {
    console.log("empty:  ", key);
    problems++;
  }
  for (const item of list) {
    const cases = item && typeof item === "object" ? item.cases ?? [] : [];
    for (const id of cases) ids.add(String(id));
    const file = item && typeof item === "object" ? item.file : null;
    if (file && !existsSync(file)) {
      console.log("missing:", file);
      problems++;
    }
  }

  if (key.startsWith("tag:")) continue;
  const base = key.replace(/[\/\\][^\/\\]*[*?[\]].*$/, "");
  if (base && !existsSync(base)) {
    console.log("missing:", key);
    problems++;
  }
}

console.log("\ncases:", [...ids].sort().join(", ") || "(none)");
console.log(problems ? `\n${problems} problem(s) above — fix them` : "\nall keys resolve");
process.exit(problems ? 1 : 0);
