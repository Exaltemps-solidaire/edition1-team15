# edition1-team15 — Intranet mobile La Sauvegarde du Nord

## Overview

Application mobile-first donnant accès à l'intranet de l'association La
Sauvegarde du Nord aux professionnels terrain sans poste informatique fixe.
Ce lot livre **P1-1 seule** (Accueil intranet mobile) : grille de rubriques,
recherche, actualités — voir `adr.md` pour le détail des choix. P1-2 (Kit
nouvel arrivant) et P1-3 (Annuaire) sont des lots ultérieurs.

**Démonstration** : le contenu de l'écran d'accueil (rubriques, actualités)
est actuellement statique (`frontend/src/data/mock-home.ts`). Aucune
connexion SharePoint réelle n'est câblée dans ce lot.

## Getting started

```bash
cd frontend
bun install
bun run dev       # http://localhost:5173 en développement
bun run build     # build de production dans frontend/dist/
bun run test      # suite Vitest
```

Déploiement réel, via le pipeline de la plateforme (contrat Pipelines,
`app-builder-guidances/README.md`) :

```bash
gitlab-ci-local --force-shell-executor
# install → lint → test → audit → build → image (registry) → deploy → verify
# expose le frontend sur http://localhost:8080 (seul port ouvert par
# l'infra du hackathon pour le front, voir /srv/team15/CLAUDE.md — pas le
# bloc générique de 10 ports ; la ligne 8080-8089 → trendforge-ccoe-demo du
# contrat générique ne s'applique pas ici, cette machine ne l'héberge pas)
```

Repli manuel équivalent, une fois l'image déjà construite/poussée :

```bash
APP=edition1-team15 podman compose -p "$APP" up -d
```

## Design vocabulary

Thème `core` de la plateforme (par défaut, CCOE-RULES §7.5) : Tailwind v4 +
daisyUI, tokens copiés tels quels dans
`frontend/src/styles/core-theme.css`. Palette : bleu `#09357A` (primaire),
orange `#FE5815` (accent, un seul élément dominant par écran), vert
`#2B8800` (nominal). Voir `adr.md` (2026-09-24) pour la justification du
choix face à la palette verte du prototype cliquable.

## Code language

Français (`fr`) — identifiants, textes, tests et noms de fichiers.

## Tested critical paths

- Rendu de l'écran d'accueil : grille de rubriques + section actualités
  (`frontend/src/app.test.tsx`).
- Filtrage par mot-clé dans la barre de recherche (rubriques + actualités).
- Contrôle d'accessibilité `jest-axe` sur l'écran d'accueil (0 violation
  détectée attendue).
- Tests unitaires par composant : `search-bar`, `tile-grid`,
  `actualites-list` (rendu, état vide, interaction).

## Performance

Aucun appel réseau dans ce lot (données statiques) — sans objet.

## Personal data register

Aucune donnée personnelle collectée ou affichée dans ce lot : le contenu de
l'écran d'accueil est statique (rubriques, actualités). Rappel de portée
(`contexte/theme.md` dans `exaltemps-solidaire`) : aucune donnée de personne
accompagnée n'a sa place dans cette application, quel que soit le lot.

## External data sources

Aucune pour ce lot. L'intégration SharePoint (source réelle des rubriques,
actualités, authentification) est prévue pour un lot ultérieur — non câblée
ici, données statiques en attendant.

## Exposed interfaces

Pas de service `api/` dans ce lot (voir `adr.md`, décision KISS du
2026-09-24). Le frontend expose deux routes de contrôle (contrat Health
checks) : `GET /health` (vivacité) et `GET /ready` (disponibilité) —
identiques ici, `200` statique sans dépendance à vérifier.

## LLM FinOps

Sans objet — pas d'usage agentique dans ce lot.

## Durable workflows

Sans objet.

## Libraries outside the recommendations

- `jest-axe` — pas listé dans les bibliothèques recommandées (§8) mais
  répond directement à l'exigence d'accessibilité MUST du §7.5 (contrôle
  axe-core en test) ; coût : une dépendance de test supplémentaire, aucun
  impact sur le bundle de production.

## Structuring decisions

Voir `adr.md` — quatre décisions à ce jour : (1) lot P1-1 en frontend seul,
sans `api`/`worker`/BDD ; (2) thème `core` de la plateforme plutôt que la
palette verte du prototype ; (3) français uniquement pour ce lot (exception
KISS §7.5 pour un outil interne) ; (4) hébergement câblé via le pipeline de
la plateforme (`.gitlab-ci.yml`, `/health`+`/ready`), avec les gates `biome`
et `gitleaks` non exécutées ici faute d'outillage installé sur cette
machine — gap documenté, pas un contournement silencieux.

## CCoE waivers

Aucun waiver technique (pas de Rust, pas de bibliothèque hors
recommandations pour la partie framework). Exception documentée : i18n
FR uniquement (voir *Structuring decisions* / `adr.md`), couverte par la
clause KISS du §7.5, pas un waiver au sens strict.
