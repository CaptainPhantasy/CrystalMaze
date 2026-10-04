import { readFileSync } from 'node:fs';

const STORE = `${process.env.HOME}/.novel-concepts-mcp/patterns.json`;
const patterns = JSON.parse(readFileSync(STORE, 'utf8')).patterns;

const STOP = new Set(
  ('a an the and or but if then than that this these those is are was were be been being to of in on at by for ' +
   'with without from as so no not can must should shall will would could have has had do does did it its their ' +
   'there they them you your we our i my me he she his her each every any all some such when where which who whom ' +
   'what how why into over under again more most other another between during before after above below up down out ' +
   'off only own same too very just also two one three new').split(' ')
);

function base(word) {
  if (word.length > 4 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && word.endsWith('ses')) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

function wordsOf(text) {
  const out = [];
  for (const raw of text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/)) {
    if (!raw || raw.length <= 3 || STOP.has(raw)) continue;
    const stem = base(raw);
    if (!out.includes(stem)) out.push(stem);
  }
  return out;
}

function relationsOf(lower) {
  const rels = [];
  if (/depend|require|wait for/.test(lower)) rels.push('depends_on');
  if (/communicate|share|send/.test(lower)) rels.push('flows_to');
  if (/compete|claim|acquire/.test(lower)) rels.push('competes_for');
  if (/coordinate|organize|synchronize/.test(lower)) rels.push('coordinates_with');
  if (/queue|waiting|pending|backlog/.test(lower)) rels.push('wait_in');
  return rels;
}

function constraintsOf(lower) {
  const out = [];
  if (/without duplicate|avoid duplicate|never twice|no two|same job/.test(lower)) out.push('no_duplication');
  if (/real-time|immediate|instant/.test(lower)) out.push('real_time');
  if (/scalable|scale|growing/.test(lower)) out.push('scalability');
  if (/unknown|dynamic|uncertain/.test(lower)) out.push('dynamic_workload');
  if (/fault|failure|resilient|retry/.test(lower)) out.push('fault_tolerance');
  return out;
}

function build(text) {
  const lower = text.toLowerCase();
  return {
    terms: wordsOf(text),
    relations: relationsOf(lower),
    constraints: constraintsOf(lower),
  };
}

// BEFORE: the live server's rule — score / fixed 30, then x0.9 for "deep"
function scoreBefore(structure, pattern) {
  let score = 0;
  let max = 0;

  const pw = new Set([...pattern.key_features, ...pattern.common_problems, ...pattern.typical_solutions]
    .join(' ').toLowerCase().split(/\s+/).filter((w) => w.length > 3));
  let overlap = 0;
  for (const w of new Set(structure.terms)) if (pw.has(w)) overlap++;
  max += 10;
  score += Math.min(overlap * 2, 10);

  max += 10;
  for (const rel of structure.relations) {
    for (const f of pattern.key_features) {
      const l = f.toLowerCase();
      if ((rel.includes('depend') && l.includes('depend')) ||
          (rel.includes('compete') && l.includes('claim')) ||
          (rel.includes('wait') && l.includes('queue'))) score += 3;
    }
  }

  max += 10;
  for (const c of structure.constraints) {
    for (const p of pattern.common_problems) if (p.toLowerCase().includes(c.replace('_', ' '))) score += 2;
  }

  return Math.min(score / max, 1) * 0.9;
}

// AFTER: every part scored against what is actually reachable, so length cannot win
function scoreAfter(structure, pattern) {
  const patternWords = new Set(wordsOf(
    [...pattern.key_features, ...pattern.common_problems, ...pattern.typical_solutions].join(' ')
  ));

  const shared = structure.terms.filter((t) => patternWords.has(t)).length;
  const termFit = structure.terms.length > 0 ? shared / structure.terms.length : 0;

  const patternText = pattern.key_features.join(' ').toLowerCase();
  const relHits = structure.relations.filter((r) =>
    (r.includes('compete') && /claim/.test(patternText)) ||
    (r.includes('wait') && /queue|ticket rail|task board/.test(patternText)) ||
    (r.includes('depend') && /depend/.test(patternText)) ||
    (r.includes('flows') && /coordina|communicat|visible/.test(patternText))
  ).length;
  const relFit = structure.relations.length > 0 ? relHits / structure.relations.length : 0;

  const conHits = structure.constraints.filter((c) =>
    pattern.common_problems.some((p) => p.toLowerCase().includes(c.replace('_', ' ')))
  ).length;
  const conFit = structure.constraints.length > 0 ? conHits / structure.constraints.length : 0;

  return 0.6 * termFit + 0.25 * relFit + 0.15 * conFit;
}

function best(structure, fn) {
  let top = { score: -1, id: 'none', shared: 0 };
  for (const p of patterns) {
    const s = fn(structure, p);
    if (s > top.score) top = { score: s, id: p.id };
  }
  return top;
}

const CASES = [
  ['your problem', 'Multiple worker agents must claim jobs from a shared queue so that no two agents process the same job'],
  ['strong match', 'Workers must claim tasks from a shared ticket rail so tasks are never done twice'],
  ['cross-region', 'Several processes coordinate updates and must avoid duplicate writes across regions'],
  ['unrelated    ', 'We need to pick a colour scheme and fonts for the new marketing site'],
];

console.log('case          | BEFORE        | AFTER         | which pattern won');
console.log('-'.repeat(84));

for (const [label, text] of CASES) {
  const s = build(text);
  const b = best(s, scoreBefore);
  const a = best(s, scoreAfter);
  console.log(
    label.padEnd(13), '|',
    `${(Math.round(b.score * 100) / 100).toFixed(2)} ${b.id.slice(0, 14).padEnd(14)}|`,
    `${(Math.round(a.score * 100) / 100).toFixed(2)} ${a.id.slice(0, 14).padEnd(14)}|`,
    a.id
  );
}
