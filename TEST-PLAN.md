# Test plan — reliable-engineering-agent

## Scope

The Jest suite under `src/__tests__/` covers the harness's core modules:
typed tool contracts, sandboxed execution, the deterministic plan graph
(retries and rollback), verification gates, the provider engine, internet
search, and package version consistency, including an end-to-end integration
test file. Live calls to external AI providers are out of scope — provider
behaviour is exercised through the harness's own fallback/configuration
surface.

## Suites

| Suite | Covers | Run it | Runs in CI |
|---|---|---|---|
| Jest (`src/__tests__/`: integration, internet-search, provider-engine, verification, version) | Core harness modules plus integration paths | `npm test` | Yes — `.github/workflows/tests.yml` |

## CI gates

- Full Jest suite green on every push and pull request to `master`
  (`.github/workflows/tests.yml`, Node.js 22, `npm ci` then `npm test`).
- CodeQL static analysis on push, pull request, and weekly
  (`.github/workflows/codeql.yml`).
- Per CONTRIBUTING.md: the test suite must pass before merge; merges are
  squash-only with conventional-commit titles.

## Cadence

- Every pull request: the full Jest suite (Tests workflow) and CodeQL.
- Every push to `master`: the full Jest suite and CodeQL.
- Weekly: CodeQL on its schedule.
- Every release candidate: the release-readiness run (checker + evidence
  reads), per the house Release-Readiness Standard.

## Coverage bar

No numeric floor; new functionality lands with tests per CONTRIBUTING.md
("the test suite must pass").
