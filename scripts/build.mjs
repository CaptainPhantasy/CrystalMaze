import { mkdir, copyFile, writeFile, chmod } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const filesToCheck = [
  'src/crystalmaze.js',
  'bin/crystalmaze.js',
  'scripts/build.mjs',
  'scripts/lint.mjs',
  'scripts/e2e.mjs',
];

for (const file of filesToCheck) {
  const result = spawnSync(process.execPath, ['--check', file], {
    cwd: root,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }
}

await mkdir(join(root, 'dist'), { recursive: true });
await copyFile(join(root, 'src', 'crystalmaze.js'), join(root, 'dist', 'crystalmaze.js'));
await copyFile(join(root, 'bin', 'crystalmaze.js'), join(root, 'dist', 'crystalmaze-cli.js'));
await chmod(join(root, 'bin', 'crystalmaze.js'), 0o755);
await writeFile(
  join(root, 'dist', 'build-manifest.json'),
  `${JSON.stringify({
    package: 'crystalmaze',
    entry: 'src/crystalmaze.js',
    cli: 'bin/crystalmaze.js',
    runtime: 'node >=20',
    dependencyCount: 0,
  }, null, 2)}\n`,
);

console.log('Build completed: syntax checked 5 files and wrote dist artifacts.');
