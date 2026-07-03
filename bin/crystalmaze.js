#!/usr/bin/env node
import {
  analyzeArchitectureProblem,
  formatMarkdownReport,
} from '../src/crystalmaze.js';

function usage() {
  return [
    'Usage: crystalmaze [--json] [--domain <name>] <problem statement>',
    '',
    'Examples:',
    '  crystalmaze "My API rate limiter is bypassed by 1000 IPs"',
    '  crystalmaze --json --domain biology "Coordinate services without central state"',
  ].join('\n');
}

function parseArgs(argv) {
  const domains = [];
  const problemParts = [];
  let json = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--json') {
      json = true;
      continue;
    }

    if (arg === '--domain') {
      const domain = argv[index + 1];
      if (!domain || domain.startsWith('--')) {
        throw new Error('--domain requires a domain name.');
      }
      domains.push(domain);
      index += 1;
      continue;
    }

    problemParts.push(arg);
  }

  return {
    json,
    domains,
    problem: problemParts.join(' ').trim(),
  };
}

try {
  const options = parseArgs(process.argv.slice(2));

  if (!options.problem) {
    console.error(usage());
    process.exitCode = 1;
  } else {
    const result = analyzeArchitectureProblem(options.problem, {
      domains: options.domains,
    });

    if (options.json) {
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } else {
      process.stdout.write(formatMarkdownReport(result));
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  console.error('');
  console.error(usage());
  process.exitCode = 1;
}
