import { access, readFile } from 'node:fs/promises';

const requiredFiles = [
  'package.json',
  'src/crystalmaze.js',
  'bin/crystalmaze.js',
  'test/crystalmaze.test.js',
  'test/cli.test.js',
  'README.md',
  'docs/release/README.md',
  'docs/release/RELEASE_CHECKLIST.md',
  'docs/release/PACKAGE_REQUIREMENTS.md',
  'docs/release/RELEASE_NOTES.md',
];

for (const file of requiredFiles) {
  await access(file);
}

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const failures = [];

if (pkg.type !== 'module') failures.push('package.json must declare ESM with type=module');
if (!pkg.bin?.crystalmaze) failures.push('package.json must expose the crystalmaze CLI bin');
if (!pkg.exports?.['.']) failures.push('package.json must expose the library entrypoint');
if (pkg.dependencies && Object.keys(pkg.dependencies).length > 0) failures.push('runtime dependencies must remain zero for the release package');
if (!pkg.scripts?.test || !pkg.scripts?.build || !pkg.scripts?.e2e || !pkg.scripts?.['release:pack']) {
  failures.push('package.json must include test, build, e2e, and release:pack scripts');
}

const source = await readFile('src/crystalmaze.js', 'utf8');
for (const exportName of ['analyzeArchitectureProblem', 'createPatternKey', 'formatMarkdownReport']) {
  if (!source.includes(`export function ${exportName}`)) {
    failures.push(`src/crystalmaze.js must export ${exportName}`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`lint: ${failure}`);
  process.exit(1);
}

console.log(`Lint completed: ${requiredFiles.length} required files and package metadata checks passed.`);
