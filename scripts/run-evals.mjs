import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const casesDir = path.join(root, 'evals', 'cases');

async function readJsonlCases(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const cases = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.jsonl')) {
      continue;
    }

    const filePath = path.join(dir, entry.name);
    const body = await readFile(filePath, 'utf8');
    const lines = body.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

    for (const [index, line] of lines.entries()) {
      try {
        cases.push({ source: `${entry.name}:${index + 1}`, ...JSON.parse(line) });
      } catch (error) {
        throw new Error(`${entry.name}:${index + 1} is not valid JSON: ${error.message}`);
      }
    }
  }

  return cases;
}

function normalize(value) {
  return value.replace(/\r\n/g, '\n');
}

async function runCase(testCase) {
  const target = path.join(root, testCase.file);
  const content = normalize(await readFile(target, 'utf8'));
  const failures = [];

  for (const expected of testCase.includes ?? []) {
    if (!content.includes(expected)) {
      failures.push(`missing expected text: ${expected}`);
    }
  }

  for (const forbidden of testCase.excludes ?? []) {
    if (content.includes(forbidden)) {
      failures.push(`found forbidden text: ${forbidden}`);
    }
  }

  return failures;
}

const cases = await readJsonlCases(casesDir);
let failureCount = 0;

for (const testCase of cases) {
  if (!testCase.id || !testCase.file) {
    console.error(`not ok - ${testCase.source} must include id and file`);
    failureCount += 1;
    continue;
  }

  const failures = await runCase(testCase);

  if (failures.length === 0) {
    console.log(`ok - ${testCase.id}`);
    continue;
  }

  failureCount += failures.length;
  console.error(`not ok - ${testCase.id}`);
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
}

if (failureCount > 0) {
  console.error(`\n${failureCount} eval assertion(s) failed.`);
  process.exit(1);
}

console.log(`\n${cases.length} eval case(s) passed.`);
