# Architecture Decision Record

Append-only log — chronological order, do not rewrite past entries.

## 2026-09-24 — P1-1 built as a frontend-only slice

- **Decision**: Implement P1-1 (Accueil intranet mobile) as a single
  `frontend/` service — TypeScript + React + Vite + Tailwind v4 + daisyUI,
  `core` design theme — with no `api/`, `worker/`, Postgres, Valkey or S3.
- **Context**: P1-1's acceptance criterion (a professional opens the
  intranet from their phone and finds an answer without calling anyone) is
  satisfiable with a mobile-first tile grid, a client-side search filter,
  and an actualités section, none of which need a real backend yet — no
  SharePoint OAuth wiring is in scope for this batch. Home-screen content
  is static/mock data (`frontend/src/data/mock-home.ts`).
- **Alternatives considered**: Scaffolding the full canonical 3-service
  layout (`frontend`/`api`/`worker`) up front, per the generic CCoE
  templates. Rejected for now — CCOE-RULES.md §0 (KISS-first) explicitly
  warns against introducing services a story doesn't need yet; an empty or
  pass-through `api` service would just be scaffolding debt until a real
  data source (SharePoint) or a write path (P1-2's self-registration form)
  exists.
- **Consequences**: `podman-compose.yml` declares only `frontend` on
  `8080:80` (the only frontend port this hackathon machine's infra exposes,
  per `/srv/team15/CLAUDE.md`). `.gitlab-ci.yml` and `bootstrap.sh` are not
  copied yet — nothing to provision. `api/` gets added, with its own
  Dockerfile and its own compose entry on `8081`, the moment a story needs a
  real data source or a write path — at which point the mock data module is
  replaced by real fetch calls behind the same component boundaries.

## 2026-09-24 — Design vocabulary: the platform's `core` theme, not the prototype's green palette

- **Decision**: Use the CCoE `core` design theme (daisyUI + tokens from
  `core-platform/core-platform/templates/core.theme.css`, deep blue
  `#09357A` / orange `#FE5815` / green `#2B8800`) as the app's design
  vocabulary, copied verbatim into `frontend/src/styles/core-theme.css`.
- **Context**: The squad's clickable prototype (`exaltemps-solidaire/
  prototype/index.html`) used a custom green palette (`--appui: #1F6F5C`).
  The squad's later hackathon session (`matiere/fil-des-agents.md`) walked
  that back verbally in favour of "SharePoint's existing blue/orange"
  palette, with no final token values recorded. Neither is binding: CCoE
  §7.1/§7.5 makes the `core` theme the **default, non-negotiable**
  vocabulary for platform apps — a client charter may replace token
  *values*, never introduce a parallel bespoke palette without a waiver.
- **Alternatives considered**: Reproducing the prototype's green scheme
  (fastest to eyeball-match, but not CCoE-compliant and already invalidated
  by the squad itself); asking the user to pick a shade of blue (unnecessary
  — the platform already fixes this, and re-litigating it would burn scope
  on a decision that isn't ours to make).
- **Consequences**: Visual structure (tile grid, search bar, actualités
  cards) is kept from the prototype; colours, radii, shadows and type scale
  come from the `core` tokens instead. Any future rebrand only edits token
  *values*, never component code (§7.5).

## 2026-09-24 — French only for this batch

- **Decision**: Ship P1-1 in French only, no i18n library wired yet.
- **Context**: CCoE §7.5 mandates 4 languages (FR/EN/ES/PT) for "business
  apps exposed to end users", but explicitly carves out an exception for
  "internal team tools" under KISS (§0), FR or EN alone accepted, declared
  in the README. This app serves La Sauvegarde du Nord's own staff in
  French-speaking Northern France; there is no stated multilingual need in
  the cadrage material.
- **Consequences**: No `frontend/src/locales/` yet, strings are inline in
  components. If a real multilingual need surfaces later, introducing
  `react-i18next` means extracting these strings — a mechanical, contained
  change (documented here so it isn't a surprise later).

## 2026-09-24 — Hosting wired through the platform's pipeline contract

- **Decision**: Add `/srv/team15/app/.gitlab-ci.yml` (install → lint/test/
  audit/build-frontend → image-frontend → deploy → verify), run through
  `gitlab-ci-local --force-shell-executor` per the Pipelines contract
  (`app-builder-guidances/README.md`). Add static `GET /health` and
  `GET /ready` endpoints to `frontend/nginx.conf` (both a trivial `200`,
  since a dependency-free static app has nothing to check for readiness
  beyond liveness) and a matching `healthcheck:` in `podman-compose.yml`,
  per the Health checks contract.
- **Context**: the frontend had only been build-checked locally
  (`nginx -t`, a directory listing) — it had never actually run behind a
  published port. Root cause: rootless Podman on this machine was missing
  the `pasta` binary (package `passt`), so no container could publish a
  port at all (`could not find pasta`). The core platform itself had never
  been started on this box either (`podman ps` empty, all core ports free),
  and its own `.internal` DNS was similarly broken — `aardvark-dns` was
  also missing. Both packages were installed with the user's explicit
  approval (`sudo apt-get install -y passt aardvark-dns`), confirmed with a
  throwaway `podman run -p` test and a `getent hosts` test on
  `core-network`, then the core platform's own pipeline
  (`core-platform/core-platform/.gitlab-ci.yml`) was (re-)run to bring up
  `core-network`, the registry, and the rest of the shared stack.
- **Alternatives considered**: keeping verification at the `nginx -t`
  level indefinitely — rejected, since the user explicitly asked to follow
  the hosting guidelines, and a config that has never actually bound a port
  is not "hosted". Copying the api/worker build+image jobs from the
  template "for completeness" — rejected, `.gitlab-ci.yml` only has jobs
  for what exists (`frontend`); `provision` is dropped too, since §0 KISS
  still holds (no DB/S3/Vault dependency yet).
- **Scoped gate gap**: the CCoE's mandatory pre-build gates (§13.3) include
  `lint` (biome), `test`, `audit`, `secrets` (gitleaks). `biome` and
  `gitleaks` are not installed on this machine, and installing gitleaks
  wasn't covered by the user's sudo approval (scoped to `passt`), so:
  `lint` runs `tsc --noEmit` only (no biome), `test` runs the existing
  Vitest suite (already covers the `a11y-i18n` gate's a11y half via
  `jest-axe`), `audit` runs `bun audit` (a real, blocking check — it
  initially failed on 7 vulnerabilities in `vite`/`vitest`/`esbuild`, fixed
  by `bun audit fix --latest`, which bumped `vitest` `^2.1.0` → `^4.1.11`;
  re-verified 9/9 tests green after the bump), and `secrets` is **not**
  included as a job — a documented gap, not a silent skip.
- **Consequences**: `gitlab-ci-local --force-shell-executor` from
  `/srv/team15/app` now does a real install → lint → test → audit → build →
  image push (`localhost:5000/edition1-team15/frontend:dev`) → deploy →
  verify cycle, and `curl http://localhost:8080/`,
  `/health`, `/ready` all answer for real, from a container started by the
  pipeline. `passt`/`aardvark-dns` being installed also unblocks any future
  `api`/`worker` service (needs `.internal` DNS to reach
  `postgres.internal` etc.) — not exercised by this batch, but no longer a
  blocker when P1-2 needs it.
