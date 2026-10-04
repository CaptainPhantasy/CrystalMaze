import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

const PROTOCOL_VERSION = '2024-11-05';

// Where the shape-matching server lives. No default is baked in, so no
// machine's layout ships in the source. Set CRYSTALMAZE_MCP_SERVER to use it.
const DEFAULT_SERVER = '';

export function serverEntry() {
  return process.env.CRYSTALMAZE_MCP_SERVER || DEFAULT_SERVER;
}

function connect(child) {
  let buffer = '';
  const pending = new Map();

  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (chunk) => {
    buffer += chunk;
    let index = buffer.indexOf('\n');

    while (index !== -1) {
      const line = buffer.slice(0, index).trim();
      buffer = buffer.slice(index + 1);

      if (line) {
        let message;
        try {
          message = JSON.parse(line);
        } catch {
          message = null;
        }

        if (message && message.id != null && pending.has(message.id)) {
          const settle = pending.get(message.id);
          pending.delete(message.id);
          if (message.error) {
            settle.reject(new Error(message.error.message || 'server returned an error'));
          } else {
            settle.resolve(message.result);
          }
        }
      }

      index = buffer.indexOf('\n');
    }
  });

  child.on('error', (error) => {
    for (const settle of pending.values()) settle.reject(error);
    pending.clear();
  });

  return {
    request(id, method, params) {
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
      });
    },
    notify(method, params) {
      child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method, params })}\n`);
    },
  };
}

function readText(result) {
  const part = Array.isArray(result?.content)
    ? result.content.find((entry) => entry.type === 'text')
    : null;
  return part ? part.text : null;
}

export async function fetchServerAnalogies(problem, options = {}) {
  const entry = serverEntry();
  if (!existsSync(entry)) return null;

  const child = spawn(process.execPath, [entry], { stdio: ['pipe', 'pipe', 'pipe'] });
  const link = connect(child);
  const timeout = setTimeout(() => child.kill('SIGKILL'), options.timeoutMs || 10000);

  try {
    await link.request(1, 'initialize', {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: { name: 'crystalmaze', version: '0.1.0' },
    });
    link.notify('notifications/initialized');

    const result = await link.request(2, 'tools/call', {
      name: 'analogy_synthesizer',
      arguments: {
        problem_description: problem,
        abstraction_level: options.abstractionLevel || 'deep',
        max_results: options.maxResults || 4,
      },
    });

    const text = readText(result);
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
    child.kill();
  }
}

export function applyServerResult(result, server) {
  if (!server || !Array.isArray(server.analogies) || server.analogies.length === 0) {
    return result;
  }

  result.analogies = server.analogies.map((analogy) => ({
    domain: analogy.source_domain,
    sourcePattern: analogy.structural_match,
    mapping: Object.fromEntries(
      (analogy.mapping || []).map((pair) => [pair.source_feature, pair.target_feature]),
    ),
    architectureMove: (analogy.transferable_insights || [])[0] || 'No transferable insight returned.',
    confidence: analogy.confidence,
  }));

  const best = server.best_analogy;
  result.serverBacked = true;
  result.serverEvidence = {
    keyTerms: server.extracted_structure?.key_terms || [],
    relationshipTypes: server.extracted_structure?.relationship_types || [],
    abstractionLevel: server.abstraction_level,
  };

  if (best) {
    result.architecture.name = `${best.domain} transfer`;
    result.architecture.summary = best.suggested_approach || best.rationale || '';
    result.architecture.borrowedPatterns = result.analogies.map((a) => a.sourcePattern);
  }

  if (typeof best?.confidence === 'number') {
    result.consensusReport.confidence = best.confidence;
    result.consensusReport.confidenceSource = 'computed by analogy_synthesizer';
  }

  result.consensusReport.recommendations = [
    'This proposal came from the live analogy_synthesizer, not the built-in catalog.',
    ...(result.consensusReport.recommendations || []),
  ];

  return result;
}
