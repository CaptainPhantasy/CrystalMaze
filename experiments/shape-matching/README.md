# Shape matching experiments

Replacing word-count matching in CrystalMaze with a language model that judges the
arrangement of a problem.

- `shape-match.mjs` — one model call. States the arrangement first, then scores it
  against a library of patterns. Returns the closest three and says plainly whether
  the top one is a real match.
- `scoring-benchmark.mjs` — measures the old word-count rule against a fixed scorer
  on the live pattern library.

Run against the configured provider (the tool handles no key itself):

    node shape-match.mjs "your problem here"

Measured: one call, ~93s for three problems. A correct match scored 85 (genuine);
an unrelated problem scored 20 (not genuine); a meaningless input scored 30 (not genuine).
