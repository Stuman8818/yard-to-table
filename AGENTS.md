# AGENTS.md

## Project Overview

This is a Next.js garden-planning web application.

The goal is to help homeowners plan gardens for their yard, starting locally and later scaling to county, state, and national coverage.

The app should help users:

- Choose plants based on location, sun exposure, garden size, and goals
- Plan vegetable, herb, flower, and pollinator gardens
- View plant care instructions
- Save garden plans
- Get local growing guidance based on region

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Server Components where appropriate
- Client components only when interactivity is required
- Prisma for database access
- PostgreSQL for the database

## Coding Rules

- Use TypeScript for all new code
- Use Tailwind for styling
- Keep components small and reusable
- Prefer server components unless client-side state is needed
- Do not add large dependencies without explaining why
- Keep forms accessible
- Use semantic HTML
- Add loading and error states where needed
- Do not hardcode secrets
- Use environment variables for API keys and database URLs

## Business Context

The first target market is local homeowners. SEO is important. Public pages should be easy for Google to index.

Important future pages:

- Plant detail pages
- Local gardening pages
- County-level pages
- State-level pages
- Blog/guide pages
