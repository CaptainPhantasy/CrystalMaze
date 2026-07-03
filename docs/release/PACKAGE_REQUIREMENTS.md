# CrystalMaze Package Requirements

This document is for the maintainer choosing the release package. Its post-read action is to approve or change the package target before publication.

## Package type

CrystalMaze needs an npm package. The project is a Node.js command-line tool and ESM library with no server process and no required port.

## Runtime package

Package name: crystalmaze.

Package format: npm package with ESM exports.

CLI binary: crystalmaze.

Runtime: Node.js 20 or newer.

Runtime dependencies: none.

Development dependencies: none.

Build output: source files plus generated dist artifacts from the build script.

## Why npm is the correct release package

The public use case is a command that can be invoked by a developer or agent. Node.js provides direct CLI packaging through the package bin field and direct library reuse through ESM exports. No browser bundle, Docker image, Python wheel, or hosted service is required for the current implementation.

## Open release decisions

The final public package name must be confirmed against the npm registry before publication.

The final license must be chosen before public release. The current package metadata intentionally uses UNLICENSED until that owner decision is made.

A scoped package name can reduce collision risk if the unscoped name is unavailable.
