const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'because', 'by', 'for', 'from', 'i', 'is',
  'it', 'my', 'of', 'on', 'or', 'the', 'to', 'with', 'without', 'that', 'this',
]);

const ANALOGY_CATALOG = [
  {
    domain: 'biology',
    sourcePattern: 'Immune system antigen matching',
    appliesWhen: ['rate', 'limit', 'bypass', 'abuse', 'fraud', 'attack', 'identity'],
    mapping: {
      antigen: 'request fingerprint',
      antibody: 'adaptive policy response',
      immuneMemory: 'risk score history',
    },
    architectureMove: 'Identify behavior patterns across changing surface identities.',
  },
  {
    domain: 'logistics',
    sourcePattern: 'Air traffic slot coordination',
    appliesWhen: ['coordinate', 'microservice', 'workflow', 'state', 'central', 'queue'],
    mapping: {
      slot: 'bounded execution window',
      controlTower: 'local coordinator per bounded context',
      reroute: 'idempotent retry lane',
    },
    architectureMove: 'Coordinate distributed work through local slots instead of global locks.',
  },
  {
    domain: 'manufacturing',
    sourcePattern: 'Kanban pull systems',
    appliesWhen: ['backlog', 'pipeline', 'queue', 'service', 'capacity', 'throughput'],
    mapping: {
      kanbanCard: 'work token',
      workInProgressLimit: 'per-capability throttle',
      station: 'service boundary',
    },
    architectureMove: 'Make demand visible and let capacity pull work at safe limits.',
  },
  {
    domain: 'physics',
    sourcePattern: 'Wave interference resolution',
    appliesWhen: ['conflict', 'consensus', 'eventual', 'distributed', 'state', 'sync'],
    mapping: {
      wavefront: 'event stream',
      interference: 'write conflict',
      damping: 'conflict-resolution policy',
    },
    architectureMove: 'Let local signals converge through explicit conflict damping rules.',
  },
  {
    domain: 'economics',
    sourcePattern: 'Market signal pricing',
    appliesWhen: ['priority', 'scarce', 'risk', 'abuse', 'routing', 'resource'],
    mapping: {
      price: 'risk-adjusted priority',
      liquidity: 'available service capacity',
      arbitrage: 'policy bypass attempt',
    },
    architectureMove: 'Expose scarcity and risk as first-class routing signals.',
  },
  {
    domain: 'ecology',
    sourcePattern: 'Ant colony stigmergy',
    appliesWhen: ['decentralized', 'coordinate', 'central', 'database', 'microservice', 'agent'],
    mapping: {
      pheromoneTrail: 'shared event trace',
      colony: 'service fleet',
      localRule: 'bounded-context policy',
    },
    architectureMove: 'Coordinate through environmental traces rather than a central brain.',
  },
];

function normalizeProblem(problem) {
  if (typeof problem !== 'string' || problem.trim().length === 0) {
    throw new TypeError('CrystalMaze requires a non-empty problem statement.');
  }

  return problem.trim().replace(/\s+/g, ' ');
}

function wordsFor(problem) {
  return problem
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function classifyProblem(words) {
  const joined = words.join(' ');

  if (/rate|limit|bypass|abuse|fraud|attack|ip|client/.test(joined)) {
    return 'rate-limit-evasion';
  }

  if (/microservice|state|central|database|coordinate|distributed|workflow|locking/.test(joined)) {
    return 'distributed-state-coordination';
  }

  if (/scale|capacity|throughput|queue|backlog/.test(joined)) {
    return 'capacity-flow-control';
  }

  return 'architecture-discovery';
}

function slugFor(words) {
  const selected = words
    .filter((word) => !STOP_WORDS.has(word))
    .slice(0, 8);

  return selected.length > 0 ? selected.join('-') : 'problem';
}

export function createPatternKey(problem) {
  const normalized = normalizeProblem(problem);
  const words = wordsFor(normalized);
  return `${classifyProblem(words)}:${slugFor(words)}`;
}

function scoreAnalogy(analogy, words) {
  const wordSet = new Set(words);
  return analogy.appliesWhen.reduce((score, keyword) => score + (wordSet.has(keyword) ? 1 : 0), 0);
}

function selectAnalogies(words, requestedDomains) {
  const requested = Array.isArray(requestedDomains) && requestedDomains.length > 0
    ? new Set(requestedDomains.map((domain) => String(domain).toLowerCase()))
    : null;

  const scored = ANALOGY_CATALOG
    .map((analogy, index) => ({ analogy, score: scoreAnalogy(analogy, words), index }))
    .filter(({ analogy }) => (requested ? requested.has(analogy.domain) : true));

  const candidates = scored;

  return candidates
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, requested ? candidates.length : 4)
    .map(({ analogy }) => ({
      domain: analogy.domain,
      sourcePattern: analogy.sourcePattern,
      mapping: analogy.mapping,
      architectureMove: analogy.architectureMove,
    }));
}

function synthesizeArchitecture(theme, analogies) {
  if (theme === 'rate-limit-evasion') {
    return {
      name: 'Adaptive Fingerprint Defense Mesh',
      summary: 'A rate-limit architecture that follows behavior across rotating network identities and adapts policy from accumulated risk signals.',
      components: [
        'Behavioral fingerprinting gateway',
        'Shared risk-score cache',
        'Adaptive throttle policy',
        'Challenge escalation adapter',
        'Observability feedback loop',
      ],
      dataFlow: [
        'Normalize request traits into a stable behavioral fingerprint.',
        'Combine fingerprint history, velocity, and anomaly signals into a risk score.',
        'Apply throttle, challenge, or allow decisions from risk-adjusted policy.',
        'Feed outcomes back into the risk-score cache for future decisions.',
      ],
      borrowedPatterns: analogies.map((analogy) => analogy.sourcePattern),
    };
  }

  if (theme === 'distributed-state-coordination') {
    return {
      name: 'Stigmergic Coordination Ledger',
      summary: 'A distributed coordination design that replaces central locks with event traces, local policies, and deterministic conflict resolution.',
      components: [
        'Append-only event ledger',
        'Local policy coordinator',
        'Conflict-resolution policy engine',
        'Idempotent retry lane',
        'Observability feedback loop',
      ],
      dataFlow: [
        'Services publish intent and outcomes to an append-only event trace.',
        'Local coordinators pull eligible work using bounded-context rules.',
        'Conflicts resolve through deterministic policies instead of global locks.',
        'Replayable traces make recovery and audit independent of a central database.',
      ],
      borrowedPatterns: analogies.map((analogy) => analogy.sourcePattern),
    };
  }

  return {
    name: 'Cross-Domain Architecture Synthesis Loop',
    summary: 'A general-purpose architecture discovery loop that abstracts the problem, maps analogies, stress-tests the design, and stores the reasoning chain.',
    components: [
      'Problem abstraction engine',
      'Analogy selection graph',
      'Consensus review board',
      'Reasoning cache adapter',
      'Recommendation exporter',
    ],
    dataFlow: [
      'Extract structural forces from the problem statement.',
      'Map those forces to cross-domain solved patterns.',
      'Synthesize a domain-specific architecture from the strongest mappings.',
      'Review security, performance, maintainability, and user impact before storing the result.',
    ],
    borrowedPatterns: analogies.map((analogy) => analogy.sourcePattern),
  };
}

function reviewConsensus(theme, architecture, analogies) {
  const base = {
    strengths: [
      'Uses multiple domains so the design is not trapped in one familiar software pattern.',
      'Keeps the reasoning chain explicit enough for review and reuse.',
      `Synthesizes ${analogies.length} analogy source patterns into one architecture proposal.`,
    ],
    weaknesses: [],
    recommendations: [
      'Prototype the smallest vertical slice before adopting the full architecture.',
      'Store accepted and rejected analogies so future runs learn from reviewer feedback.',
    ],
    confidence: 0.78,
  };

  if (theme === 'rate-limit-evasion') {
    base.weaknesses.push('The shared risk-score cache must be bounded and close to the gateway to avoid latency regressions.');
    base.weaknesses.push('Behavioral fingerprinting can create false positives without appeal or challenge flows.');
    base.recommendations.push('Start with observe-only scoring, then graduate to throttles after measuring false positives.');
    base.confidence = 0.84;
  } else if (theme === 'distributed-state-coordination') {
    base.weaknesses.push('Event-ledger coordination requires strong idempotency discipline across every service boundary.');
    base.weaknesses.push('Local policies can diverge unless they are versioned and replay-tested.');
    base.recommendations.push('Introduce contract tests for replay, conflict resolution, and duplicate event handling.');
    base.confidence = 0.81;
  } else {
    base.weaknesses.push('A generic synthesis loop needs reviewer feedback before it can claim domain-specific confidence.');
  }

  base.recommendations.push(`Name the first implementation spike after ${architecture.name}.`);
  return base;
}

export function analyzeArchitectureProblem(problem, options = {}) {
  const normalized = normalizeProblem(problem);
  const words = wordsFor(normalized);
  const theme = classifyProblem(words);
  const analogies = selectAnalogies(words, options.domains);
  const architecture = synthesizeArchitecture(theme, analogies);
  const consensusReport = reviewConsensus(theme, architecture, analogies);
  const patternKey = createPatternKey(normalized);

  return {
    problem: normalized,
    patternKey,
    theme,
    analogies,
    architecture,
    consensusReport,
    persistenceEnvelope: {
      key: patternKey,
      toolChain: [
        'analogy_synthesizer',
        'concept_web_weaver',
        'consensus_protocol',
        'cache_store_reasoning',
      ],
      reasoningChain: [
        'Extract structural forces from the problem statement.',
        'Map forces to cross-domain source patterns.',
        'Synthesize architecture components from the strongest mappings.',
        'Stress-test the proposal through multi-perspective consensus review.',
        'Persist the reusable pattern key and reasoning chain for future retrieval.',
      ],
    },
  };
}

function formatMapping(mapping) {
  return Object.entries(mapping)
    .map(([source, target]) => `  - ${source}: ${target}`)
    .join('\n');
}

function formatList(items) {
  return items.map((item) => `- ${item}`).join('\n');
}

export function formatMarkdownReport(result) {
  return [
    '# CrystalMaze Analysis',
    '',
    `Problem: ${result.problem}`,
    '',
    `Pattern key: ${result.patternKey}`,
    '',
    '## Cross-Domain Analogies',
    '',
    result.analogies.map((analogy) => [
      `### ${analogy.domain}: ${analogy.sourcePattern}`,
      '',
      `Architecture move: ${analogy.architectureMove}`,
      '',
      'Mapping:',
      formatMapping(analogy.mapping),
    ].join('\n')).join('\n\n'),
    '',
    '## Proposed Architecture',
    '',
    `Name: ${result.architecture.name}`,
    '',
    result.architecture.summary,
    '',
    'Components:',
    formatList(result.architecture.components),
    '',
    'Data flow:',
    formatList(result.architecture.dataFlow),
    '',
    '## Consensus Review',
    '',
    `Confidence: ${Math.round(result.consensusReport.confidence * 100)}%`,
    '',
    'Strengths:',
    formatList(result.consensusReport.strengths),
    '',
    'Weaknesses:',
    formatList(result.consensusReport.weaknesses),
    '',
    'Recommendations:',
    formatList(result.consensusReport.recommendations),
    '',
    '## Persistence Envelope',
    '',
    `Cache key: ${result.persistenceEnvelope.key}`,
    '',
    'Tool chain:',
    formatList(result.persistenceEnvelope.toolChain),
    '',
    'Reasoning chain:',
    formatList(result.persistenceEnvelope.reasoningChain),
    '',
  ].join('\n');
}
