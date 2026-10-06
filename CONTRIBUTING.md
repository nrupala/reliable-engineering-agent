# Contributing to reliable-engineering-agent

## PR flow (the certification discipline)

1. Branch from `master`; open a **draft PR**. PRs are the per-update certification:
   every change is traced, versioned, and reviewed.
2. The owner merges when green. **Never push to `master` directly** (branch
   protection / retired direct pushes where the plan allows; until then,
   green-merge is manual discipline).
3. Every PR adds a `CHANGELOG.md` entry under `## [Unreleased]`.
4. Semver bump with the PR: `patch` for fixes/chores, `minor` for features,
   `major` for breaking changes. The single version source of truth is
   `package.json` `"version"`.
5. Merge commits reference the PR number. Releases are tagged `vX.Y.Z` to match
   `package.json` version.
6. No secrets, tokens, or private keys in commits — ever. API keys
   (e.g. `OPENAI_API_KEY`) stay in environment variables, never in the repo.

## Build & test

```bash
npm install
npm start        # CLI mode
npm run web      # web server mode, then open http://localhost:3000
npm test         # jest test suite
```

You need one model provider running: LM Studio (default `http://localhost:1234`),
Ollama (default `http://localhost:11434`), or an OpenAI API key exported as
`OPENAI_API_KEY`. See the README's Installation section for details.
