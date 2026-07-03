# CrystalMaze Release Documentation

This release set is for the maintainer preparing CrystalMaze for package publication. After reading it, the maintainer should know what is being released, which checks must pass, and what package decision remains.

## Release contents

CrystalMaze ships as a Node.js npm package. It includes a CLI, an ESM library, deterministic analysis behavior, tests, release scripts, and package documentation.

## Documents in this set

- Release notes describe what is included in the first packageable build.
- Package requirements define the package type, runtime, scripts, metadata, and open decisions.
- Release checklist gives the exact local validation steps before tagging or publishing.

## Cold-reader action

Run the release checklist from top to bottom. If every command passes and the package name and license are approved, the package is ready for an npm publication attempt.
