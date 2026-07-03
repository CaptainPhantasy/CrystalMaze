import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const cliPath = join(repoRoot, 'bin', 'crystalmaze.js');

test('CLI exits non-zero and prints usage when no problem is supplied', () => {
  const result = spawnSync(process.execPath, [cliPath], {
    cwd: repoRoot,
    encoding: 'utf8',
  });

  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /Usage: crystalmaze/);
});

test('CLI prints a markdown architecture analysis by default', () => {
  const result = spawnSync(process.execPath, [cliPath, 'My API rate limiter is bypassed by distributed clients'], {
    cwd: repoRoot,
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^# CrystalMaze Analysis/m);
  assert.match(result.stdout, /Behavioral fingerprinting gateway/);
  assert.match(result.stdout, /Consensus Review/);
});

test('CLI emits parseable JSON with --json', () => {
  const result = spawnSync(process.execPath, [
    cliPath,
    '--json',
    'Coordinate microservices state without a central database',
  ], {
    cwd: repoRoot,
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(result.stdout);
  assert.ok(parsed.patternKey);
  assert.ok(Array.isArray(parsed.analogies));
  assert.ok(parsed.architecture.components.length >= 3);
});
