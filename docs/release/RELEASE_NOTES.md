# CrystalMaze 0.1.0 Release Notes

This document is for the maintainer preparing the first packageable release. Its post-read action is to understand what changed and what remains gated before publication.

## Included

CrystalMaze now provides a deterministic architecture discovery engine that accepts a problem statement and returns cross-domain analogies, a synthesized architecture, a consensus review, and a reusable persistence envelope.

The package includes a CLI with markdown output and JSON output.

The package includes an ESM library export for programmatic use.

The package includes tests for library behavior, CLI behavior, domain filtering, empty input handling, markdown formatting, and JSON output.

The package includes local build, lint, end-to-end, and package dry-run scripts.

## Release package

The intended release artifact is an npm package named crystalmaze, exposing the crystalmaze CLI and the ESM library export.

## Known gates before public publication

The npm name must be confirmed as available or replaced with an approved scoped name.

The owner must choose the final license before public publication.

FLOYD project metadata still contains governance-template build command placeholders and should be updated through the owner-approved governance flow.
