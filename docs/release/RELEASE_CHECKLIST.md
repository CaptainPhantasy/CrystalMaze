# CrystalMaze Release Checklist

This checklist is for the maintainer doing a release candidate verification. Its post-read action is to decide whether a package can be tagged or published.

## Required local checks

Run these commands from the project root.

```bash
npm test
npm run build
npm run lint
npm run e2e
npm run release:pack
```

Each command must exit with code zero. The package dry run must list the CLI, library, tests, scripts, README, and release documentation.

## Manual release gates

Confirm the final npm package name before publication.

Confirm the license before publication. The package currently declares UNLICENSED until the owner chooses a release license.

Confirm whether the first release is internal-only or public.

## Tagging recommendation

Use version 0.1.0 for the first packageable release candidate. Increase the version only after the release checklist stays green after the final package-name and license decisions.
