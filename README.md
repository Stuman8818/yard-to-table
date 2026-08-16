# Yard To Table platform

This repository is an npm workspace with two intentionally separate Next.js applications.

```text
apps/
├── yard-to-table/  Static marketing site for the landscaping brand
└── trellis/        Customer intake and field-service operating application
```

## Application boundaries

### Yard To Table

`apps/yard-to-table` is the public brand and marketing site. It contains service information,
company positioning, and static presentation only. It is configured with Next.js static export and
does not contain forms, API routes, GraphQL, Prisma, or operational workflow logic.

### Trellis

`apps/trellis` is the operating application. It owns customer intake and the landscaping business
domain: leads, consultations, property assessments, estimates, customer conversion, jobs, and
internal administration. Keeping intake here makes it possible to embed or reuse Trellis in future
branded customer experiences without coupling those workflows to the marketing site.

## Local development

Install dependencies from the repository root:

```bash
npm install
```

Run Trellis on port 3000:

```bash
npm run dev
```

Run the Yard To Table marketing site on port 3001:

```bash
npm run dev:ytt
```

Trellis environment files and the Prisma schema live under `apps/trellis`. Database commands remain
available from the root and are delegated to the Trellis workspace:

```bash
npm run db:generate
npm run db:validate
npm run db:migrate
npm run db:deploy
```

## Validation

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Vercel deployments

Create two Vercel projects from this repository and assign a separate root directory to each one:

- Trellis: `apps/trellis`
- Yard To Table: `apps/yard-to-table`

Each app owns its build. Trellis generates Prisma Client as part of `npm run build`; the static Yard
To Table build has no Prisma install or generation step. The root scripts remain conveniences for
local monorepo development and CI, not deployment lifecycle hooks.
