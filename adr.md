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
