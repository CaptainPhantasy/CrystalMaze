// CrystalMaze — one model call. All problems in a single prompt.
// Chain of thought runs inside the model; only the verdict comes back.

import { execFileSync } from 'node:child_process';

const MODEL = process.env.MAZE_MODEL || 'zai-coding-plan/glm-5.3-flash';

const SHAPES = [
  ['restaurant_kitchen', 'Workers claim tickets off a shared rail. The rail makes work visible so two people never cook the same dish.'],
  ['ant_colony', 'No leader. Each ant follows local signals left by others, and good paths get reinforced by use.'],
  ['library_system', 'One central catalogue, many copies lent out, reservations when demand exceeds supply.'],
  ['traffic_control', 'Vehicles enter a junction in timed slots so flow never gridlocks.'],
  ['hospital_triage', 'Scarce attention goes to the most severe case, not the one that arrived first.'],
  ['immune_system', 'Learns to recognise patterns of harm, remembers them, and adapts when the threat changes shape.'],
  ['immune_tolerance', 'Must also learn what is harmless, or it attacks its own body.'],
  ['apprenticeship', 'Skill passes by watching, copying and being corrected, not by reading rules.'],
  ['style_guide', 'Written conventions remove the same decision from being made over and over, and stop slow drift.'],
  ['peer_review', 'Work is checked by equals before it is accepted.'],
  ['guild_tradition', 'Standards are upheld by peers, and entry to the trade is controlled.'],
  ['jury_deliberation', 'Independent views argue it out until they are forced to converge on one answer.'],
  ['market_pricing', 'Scarcity raises the price, and the price rations who gets the thing and routes effort toward it.'],
  ['insurance', 'Many pay a little so the few who are hit can be made whole.'],
  ['supply_chain', 'Several stages with buffers between them. Small demand changes get amplified upstream.'],
  ['conveyor_belt', 'A fixed pace moves work past stations. The slowest station sets the speed for everything.'],
  ['ecological_succession', 'A system must pass through earlier stages before the stable one can take hold.'],
  ['keystone_species', 'One component holds the structure together. Remove it and the whole thing collapses.'],
  ['fire_break', 'Stop something spreading by removing whatever it travels through.'],
  ['contract_enforcement', 'Agreed terms plus a real penalty make cooperation the rational choice.'],
  ['double_entry_bookkeeping', 'Two independent records must agree. When they disagree, the disagreement points at the error.'],
  ['cartography', 'A map is useful precisely because it leaves things out. Too much detail makes it useless.'],
  ['postal_service', 'Addressing and routing carry items to destinations with different levels of delivery guarantee.'],
  ['standard_weights', 'Everyone agrees on one reference measure, so separate parties can trust each other without meeting.'],
];

const TESTS = [
  'Multiple worker agents must claim jobs from a shared queue so that no two agents process the same job',
  'I have instructed the agents to stop using technical jargon and just explain themselves plainly. If five words will suffice I do not want a long-winded explanation. I cannot get them to understand this. How can I better express how wasteful it is of my time and tokens?',
  'My website colours look bad and the text is hard to read on phones',
];

const problems = process.argv.length > 2 && process.argv[2] !== '--test'
  ? [process.argv.slice(2).join(' ')]
  : TESTS;

const prompt = `You judge whether a problem is structurally like a pattern borrowed from another field.

Structural means the same arrangement: the same kind of actors doing the same kind of thing under the same kind of limit. Topic is irrelevant.

Worked examples of the judgement:
- Two teams overwriting one shared spreadsheet vs restaurant_kitchen (workers claim tickets off a shared rail): GENUINE. One shared surface, claiming prevents collision.
- Bad website colours on phones vs traffic_control (timed slots at a junction): NOT GENUINE. Nothing contends for one shared passage and there is no timing gate. Only the vague word "flow" is alike.
- Wanting shorter team reports vs keystone_species (one component holds a structure up): NOT GENUINE. Nothing holds anything up and nothing can be removed.

MOST PROBLEMS DO NOT MATCH MOST PATTERNS. Answering NOT GENUINE is correct and expected often. Do not be agreeable. A false match is worse than no match.

PATTERNS:
${SHAPES.map(([id, text]) => `${id} — ${text}`).join('\n')}

Think through each problem in this order, silently, before answering:
1. State the arrangement: who acts, what moves between them, what is contended, what must not happen.
2. For the best three patterns, say what lines up and one way it is genuinely unlike.
3. If that difference is structural rather than topical, the score MUST be below 50. 70+ only if the arrangement truly is the same.

Then answer.

PROBLEMS:
${problems.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Reply with JSON only, no other text, no tool use:
{"results":[{"problem":"the problem, shortened","shape":"its arrangement in one or two sentences","closest":[{"id":"pattern","score":0,"lines_up":"short","does_not_line_up":"short"}],"top_is_genuine":true,"verdict":"one short sentence"}]}`;

const started = Date.now();
const raw = execFileSync('floyd-code', ['-p', prompt, '-m', MODEL, '--skills-dir', '/tmp/noskills'], {
  encoding: 'utf8',
  timeout: 600000,
  maxBuffer: 32 * 1024 * 1024,
  cwd: '/tmp',
  stdio: ['ignore', 'pipe', 'ignore'],
});
const elapsed = ((Date.now() - started) / 1000).toFixed(0);

const start = raw.indexOf('{');
const end = raw.lastIndexOf('}');
let parsed = null;
try {
  parsed = JSON.parse(raw.slice(start, end + 1));
} catch {
  console.log(`one call, ${elapsed}s — could not parse the reply`);
  console.log(raw.slice(Math.max(0, start), start + 300));
  process.exit(1);
}

console.log(`one call, ${elapsed}s, ${problems.length} problem(s)\n`);

for (const r of parsed.results || []) {
  console.log('='.repeat(74));
  console.log('PROBLEM: ' + r.problem);
  console.log('\n  ' + r.shape + '\n');
  for (const m of (r.closest || []).sort((a, b) => b.score - a.score)) {
    const band = m.score >= 70 ? 'SAME SHAPE' : m.score >= 50 ? 'partly alike' : 'stretch';
    console.log(`  ${String(m.score).padStart(3)}  ${String(m.id).padEnd(22)} ${band}`);
    console.log(`       lines up:         ${m.lines_up}`);
    console.log(`       does NOT line up: ${m.does_not_line_up}`);
  }
  console.log('\n  TOP IS GENUINE? ' + (r.top_is_genuine ? 'YES' : 'NO'));
  console.log('  verdict: ' + (r.verdict || '(none)'));
  console.log();
}
