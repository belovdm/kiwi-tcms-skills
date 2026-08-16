#!/usr/bin/env node
// Sanity-check a kiwi coverage.tests.yml mapping.
//
//   node check-coverage.mjs [coverage.tests.yml]
//   npx --yes -p js-yaml node check-coverage.mjs coverage.tests.yml
//
// Also accepts JSON on stdin (legacy):
//   npx js-yaml coverage.tests.yml | node check-coverage.mjs
//
// Flags keys whose path is missing on disk, entries with no tests and no
// explicit empty list, and prints referenced case markers. Exits non-zero
// on a problem. Never use python. Never invent a YAML parser — load via js-yaml.

import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

function readStdin() {
  try {
    if (process.stdin.isTTY) return "";
    return readFileSync(0, "utf8").trim();
  } catch {
    return "";
  }
}

function loadJsYamlFromCwd() {
  try {
    const require = createRequire(resolve(process.cwd(), "package.json"));
    return require("js-yaml");
  } catch {
    return null;
  }
}

function loadYamlFile(file) {
  const yaml = loadJsYamlFromCwd();
  if (yaml && typeof yaml.load === "function") {
    return yaml.load(readFileSync(file, "utf8"));
  }

  const script =
    "const fs=require('fs');const yaml=require('js-yaml');" +
    "process.stdout.write(JSON.stringify(yaml.load(fs.readFileSync(process.argv[1],'utf8'))));";
  const r = spawnSync(
    "npx",
    ["--yes", "-p", "js-yaml", "node", "-e", script, file],
    { encoding: "utf8", shell: true },
  );
  if (r.status !== 0) {
    console.error(
      r.stderr || r.stdout ||
        "need js-yaml: npm i -D js-yaml  then  node check-coverage.mjs coverage.tests.yml",
    );
    process.exit(1);
  }
  return JSON.parse(r.stdout);
}

const fileArg = process.argv[2];
const stdin = readStdin();
let raw;
if (fileArg) {
  raw = loadYamlFile(fileArg);
} else if (stdin) {
  raw = JSON.parse(stdin);
} else if (existsSync("coverage.tests.yml")) {
  raw = loadYamlFile("coverage.tests.yml");
} else {
  console.error("usage: node check-coverage.mjs [coverage.tests.yml]");
  process.exit(1);
}

const map = raw && typeof raw === "object" && raw.coverage && typeof raw.coverage === "object"
  ? raw.coverage
  : raw;

if (!map || typeof map !== "object" || Array.isArray(map)) {
  console.error('expected { coverage: { "<path>": { tests: [...] } } }');
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
