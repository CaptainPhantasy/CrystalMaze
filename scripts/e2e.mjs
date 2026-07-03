import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const markdown = spawnSync(process.execPath, [
  'bin/crystalmaze.js',
  'My API rate limiter is bypassed by distributed clients',
], {
  encoding: 'utf8',
});

assert.equal(markdown.status, 0, markdown.stderr);
assert.match(markdown.stdout, /^# CrystalMaze Analysis/m);
assert.match(markdown.stdout, /Behavioral fingerprinting gateway/);
assert.match(markdown.stdout, /Consensus Review/);

const json = spawnSync(process.execPath, [
  'bin/crystalmaze.js',
  '--json',
  '--domain',
  'biology',
  'My API rate limiter is bypassed by distributed clients',
], {
  encoding: 'utf8',
});

assert.equal(json.status, 0, json.stderr);
const parsed = JSON.parse(json.stdout);
assert.equal(parsed.analogies.length, 1);
assert.equal(parsed.analogies[0].domain, 'biology');
assert.ok(parsed.patternKey.startsWith('rate-limit-evasion:'));

console.log('E2E completed: markdown CLI and JSON CLI scenarios passed.');
