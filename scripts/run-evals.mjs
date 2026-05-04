import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();

const skippedDirectories = new Set([
  '.git',
  '.cursor',
  'node_modules',
  '.next',
  'dist',
  'build',
  'coverage',
  'private-notes',
  'local-planning',
]);

const skippedFiles = new Set([
  '.agent-ready-report.json',
  'knip-report.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
]);

const skippedPrefixes = ['evals/cases/'];

const textFileNames = new Set([
  '.agentignore',
  '.editorconfig',
  '.gitattributes',
  '.gitignore',
  '.node-version',
  '.nvmrc',
  'LICENSE',
]);

const textExtensions = new Set([
  '.cjs',
  '.css',
  '.html',
  '.js',
  '.json',
  '.jsonl',
  '.jsx',
  '.mjs',
  '.md',
  '.scss',
  '.ts',
  '.tsx',
  '.txt',
  '.yaml',
  '.yml',
]);

function toRepoPath(value) {
  return value.replace(/\\/g, '/');
}

function normalizeRepoPath(relativePath) {
  if (typeof relativePath !== 'string' || relativePath.trim() === '') {
    throw new Error('eval file path must be a non-empty string');
  }

  if (relativePath.includes('\0')) {
    throw new Error(`eval file path contains an invalid character: ${relativePath}`);
  }

  const portablePath = toRepoPath(relativePath);

  if (
    path.isAbsolute(relativePath) ||
    path.win32.isAbsolute(relativePath) ||
    path.posix.isAbsolute(portablePath)
  ) {
    throw new Error(`eval file path must be repo-relative: ${relativePath}`);
  }

  const normalized = path.posix.normalize(portablePath);

  if (normalized === '.' || normalized === '..' || normalized.startsWith('../')) {
    throw new Error(`eval file path must stay inside the repo: ${relativePath}`);
  }

  return normalized;
}

function absoluteFromRepoPath(repoPath) {
  return path.join(root, ...repoPath.split('/'));
}

async function readRepoFile(relativePath) {
  const repoPath = normalizeRepoPath(relativePath);

  try {
    return await readFile(absoluteFromRepoPath(repoPath), 'utf8');
  } catch (error) {
    throw new Error(`could not read ${repoPath}: ${error.code ?? error.message}`);
  }
}

async function readJsonlCases() {
  let entries;

  try {
    entries = await readdir(absoluteFromRepoPath('evals/cases'), { withFileTypes: true });
  } catch (error) {
    throw new Error(`could not read evals/cases: ${error.code ?? error.message}`);
  }

  const cases = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.jsonl')) {
      continue;
    }

    const casePath = `evals/cases/${entry.name}`;
    const body = await readRepoFile(casePath);
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

function isIgnoredEnvFile(name) {
  return name === '.env' || (name.startsWith('.env.') && name !== '.env.example');
}

function shouldSkipRepoPath(repoPath) {
  const parts = repoPath.split('/');
  const name = parts.at(-1);

  if (parts.some((part) => skippedDirectories.has(part))) {
    return true;
  }

  if (skippedPrefixes.some((prefix) => repoPath.startsWith(prefix))) {
    return true;
  }

  return skippedFiles.has(name) || isIgnoredEnvFile(name);
}

function isTextFile(repoPath) {
  const name = repoPath.split('/').at(-1);
  const extension = path.posix.extname(name).toLowerCase();

  return textFileNames.has(name) || textExtensions.has(extension);
}

async function listRepoTextFiles(parent = '') {
  let entries;

  try {
    entries = await readdir(absoluteFromRepoPath(parent || '.'), { withFileTypes: true });
  } catch (error) {
    throw new Error(`could not read ${parent || '.'}: ${error.code ?? error.message}`);
  }

  const files = [];

  for (const entry of entries) {
    const repoPath = parent ? `${parent}/${entry.name}` : entry.name;

    if (shouldSkipRepoPath(repoPath)) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...(await listRepoTextFiles(repoPath)));
      continue;
    }

    if (entry.isFile() && isTextFile(repoPath)) {
      files.push(repoPath);
    }
  }

  return files.sort();
}

function stringList(testCase, field) {
  const value = testCase[field] ?? [];

  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error(`${testCase.id} ${field} must be an array of strings`);
  }

  return value;
}

function assertContent(content, testCase, label) {
  const failures = [];

  for (const expected of stringList(testCase, 'includes')) {
    if (!content.includes(expected)) {
      failures.push(`${label} missing expected text: ${expected}`);
    }
  }

  for (const forbidden of stringList(testCase, 'excludes')) {
    if (content.includes(forbidden)) {
      failures.push(`${label} contains forbidden text: ${forbidden}`);
    }
  }

  return failures;
}

async function runFileCase(testCase) {
  if (!testCase.file) {
    throw new Error(`${testCase.id} must include file unless scope is "repo"`);
  }

  const repoPath = normalizeRepoPath(testCase.file);
  const content = normalize(await readRepoFile(repoPath));

  return assertContent(content, testCase, repoPath);
}

async function runRepoCase(testCase) {
  const files = await listRepoTextFiles();
  const snapshots = [];

  for (const file of files) {
    snapshots.push({
      file,
      content: normalize(await readRepoFile(file)),
    });
  }

  const failures = [];

  for (const expected of stringList(testCase, 'includes')) {
    if (!snapshots.some(({ content }) => content.includes(expected))) {
      failures.push(`repo missing expected text: ${expected}`);
    }
  }

  for (const forbidden of stringList(testCase, 'excludes')) {
    for (const { file, content } of snapshots) {
      if (content.includes(forbidden)) {
        failures.push(`${file} contains forbidden text: ${forbidden}`);
      }
    }
  }

  return failures;
}

async function runCase(testCase) {
  if (!testCase.id) {
    throw new Error(`${testCase.source} must include id`);
  }

  if ((testCase.scope ?? 'file') === 'repo') {
    return runRepoCase(testCase);
  }

  return runFileCase(testCase);
}

function normalize(value) {
  return value.replace(/\r\n/g, '\n');
}

const cases = await readJsonlCases();
let failureCount = 0;

for (const testCase of cases) {
  let failures;

  try {
    failures = await runCase(testCase);
  } catch (error) {
    failures = [error.message];
  }

  if (failures.length === 0) {
    console.log(`ok - ${testCase.id ?? testCase.source}`);
    continue;
  }

  failureCount += failures.length;
  console.error(`not ok - ${testCase.id ?? testCase.source}`);
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
}

if (failureCount > 0) {
  console.error(`\n${failureCount} eval assertion(s) failed.`);
  process.exit(1);
}

console.log(`\n${cases.length} eval case(s) passed.`);
