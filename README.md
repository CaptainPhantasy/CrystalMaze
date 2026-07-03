# CrystalMaze

CrystalMaze is an analogy-driven architecture discovery CLI and library. It turns a software architecture problem into cross-domain analogies, a concrete architecture proposal, a consensus review, and a reusable reasoning envelope.

The reader for this document is an engineer or agent preparing to use or release the package. After reading it, they should be able to run a local analysis and understand the release path.

## Install for local development

Use Node.js 20 or newer. The package has no runtime dependencies.

```bash
npm test
npm run build
npm run lint
npm run e2e
```

## Use the CLI

```bash
node bin/crystalmaze.js "My API rate limiter is bypassed by distributed clients"
node bin/crystalmaze.js --json --domain biology "Coordinate services without central state"
```

The default output is a markdown report. The JSON mode returns the same analysis object that the library exports.

## Use the library

```js
import { analyzeArchitectureProblem, formatMarkdownReport } from 'crystalmaze';

const result = analyzeArchitectureProblem('Coordinate microservices without a central database');
console.log(formatMarkdownReport(result));
```

## Release documents

Release notes, package requirements, and the release checklist live in the release documentation set under the docs release section of this repository.

## Package decision

CrystalMaze is prepared as an npm package with a CLI binary named crystalmaze and an ESM library export. The package currently uses the unscoped npm name crystalmaze. Before public publication, confirm name availability and choose the final license.
