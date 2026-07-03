import test from 'node:test';
import assert from 'node:assert/strict';

import {
  analyzeArchitectureProblem,
  createPatternKey,
  formatMarkdownReport,
} from '../src/crystalmaze.js';

test('rejects empty problem statements', () => {
  assert.throws(
    () => analyzeArchitectureProblem('   '),
    /problem statement/i,
  );
});

test('creates deterministic pattern keys from normalized problems', () => {
  const first = createPatternKey(' My API rate limiter is being bypassed by 1000 IPs! ');
  const second = createPatternKey('my api rate limiter is being bypassed by 1000 ips');

  assert.equal(first, second);
  assert.match(first, /^rate-limit-evasion:[a-z0-9-]+$/);
});

test('maps rate-limit evasion to cross-domain architecture guidance', () => {
  const result = analyzeArchitectureProblem(
    'My API rate limiter is being bypassed because requests come from 1000 IPs',
  );

  assert.equal(result.problem, 'My API rate limiter is being bypassed because requests come from 1000 IPs');
  assert.ok(result.patternKey.startsWith('rate-limit-evasion:'));
  assert.ok(result.analogies.length >= 3);
  assert.ok(result.analogies.some((analogy) => analogy.domain === 'biology'));
  assert.ok(result.analogies.some((analogy) => /immune|antigen/i.test(analogy.sourcePattern)));
  assert.ok(result.architecture.components.includes('Behavioral fingerprinting gateway'));
  assert.ok(result.consensusReport.weaknesses.some((weakness) => /cache|latency|performance/i.test(weakness)));
  assert.ok(result.persistenceEnvelope.reasoningChain.length >= 4);
});

test('filters analogies to requested domains while preserving architecture synthesis', () => {
  const result = analyzeArchitectureProblem(
    'I need to coordinate 500 microservices that share state without a central database',
    { domains: ['logistics'] },
  );

  assert.deepEqual([...new Set(result.analogies.map((analogy) => analogy.domain))], ['logistics']);
  assert.ok(result.architecture.components.length >= 3);
  assert.ok(result.consensusReport.confidence >= 0.6);
});

test('formats a complete markdown report for cold readers', () => {
  const result = analyzeArchitectureProblem('My distributed workflow needs reliable coordination without central locking');
  const markdown = formatMarkdownReport(result);

  assert.match(markdown, /^# CrystalMaze Analysis/m);
  assert.match(markdown, /## Cross-Domain Analogies/);
  assert.match(markdown, /## Proposed Architecture/);
  assert.match(markdown, /## Consensus Review/);
  assert.match(markdown, /## Persistence Envelope/);
  assert.doesNotMatch(markdown, /undefined|null/);
});
