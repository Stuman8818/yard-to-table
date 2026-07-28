# Yard to Table

A full-stack field-service and garden-planning platform for lawn-care and residential garden-installation businesses.

Yard to Table is designed to manage the customer lifecycle from initial service request through property assessment, estimating, approval, scheduling, and job completion.

> This project is under active development. Features and documentation will continue to evolve as the initial product is built.

## Overview

Lawn-care and garden-installation businesses often manage leads, property information, estimates, schedules, photographs, and customer communication across disconnected tools.

Yard to Table brings those workflows into one application while adding specialized functionality for residential garden planning.

## Planned Features

- Public lawn-care and garden-service request form
- Lead and customer management
- Multiple properties per customer
- Property assessments and measurements
- Consultation and job scheduling
- Garden-installation estimate builder
- Optional proposal upgrades
- Secure customer approval workflow
- Job creation and status tracking
- Property and project photo management
- Garden-area and planting-capacity calculations

## Initial User Workflow

1. A customer submits a service request.
2. The request is added to the lead-management dashboard.
3. An administrator schedules a property consultation.
4. Property measurements and assessment details are recorded.
5. An estimate is created and sent to the customer.
6. The customer approves or declines the estimate.
7. An approved estimate is converted into a scheduled job.

## Technology Stack

### Application

- Next.js
- React
- TypeScript
- Tailwind CSS

### Planned API and Data Layer

- GraphQL
- Apollo Server
- Apollo Client
- GraphQL Code Generator
- PostgreSQL
- Prisma ORM

### Planned Quality and Delivery Tools

- ESLint
- Prettier
- Vitest
- React Testing Library
- Playwright
- GitHub Actions
- Vercel

## Architecture

The application will follow a feature-oriented architecture with clear separation between presentation, API, business, and data-access concerns.

```text
Next.js interface
       ↓
GraphQL operations
       ↓
GraphQL resolvers
       ↓
Domain services
       ↓
Prisma
       ↓
PostgreSQL
```

GraphQL will support application data such as leads, customers, properties, assessments, estimates, appointments, and jobs. Specialized operations such as file uploads, authentication callbacks, and external webhooks may use dedicated Next.js route handlers.

## Project Structure

```text
src/
├── app/
├── components/
├── features/
├── graphql/
├── lib/
├── server/
└── types/
```

The structure will be expanded and documented as the application architecture is implemented.

## Local Development

### Prerequisites

- Node.js
- npm
- PostgreSQL or access to a managed PostgreSQL database

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/yard-to-table.git
cd yard-to-table
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Start the development server:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Additional testing, type-checking, formatting, GraphQL code-generation, and end-to-end scripts will be added as those tools are configured.

## Testing Strategy

The planned testing strategy includes:

- Unit tests for pricing, measurements, validation, and status rules
- Component tests for forms and interactive interfaces
- Integration tests for GraphQL resolvers and database operations
- End-to-end tests for the complete lead-to-job workflow

## CI/CD

The planned delivery workflow is:

```text
Feature branch
      ↓
Pull request
      ↓
GitHub Actions validation
      ↓
Vercel preview deployment
      ↓
Merge to main
      ↓
Production deployment
```

Pull requests will eventually run formatting, linting, TypeScript, tests, GraphQL generation checks, and production builds.

## Security

This repository must not contain:

- Production credentials
- API keys
- Authentication secrets
- Database passwords
- Real customer information
- Private addresses or property photographs

Required environment-variable names are documented in `.env.example`. Actual values must remain in ignored local environment files or deployment-platform secret storage.

## Roadmap

### Milestone 1 — Repository Foundation

- [x] Create the public repository
- [x] Add environment-variable documentation
- [ ] Add the initial application through a pull request
- [ ] Configure strict TypeScript
- [ ] Configure ESLint and Prettier
- [ ] Add continuous integration
- [ ] Connect Vercel preview deployments

### Milestone 2 — Application Foundation

- [ ] Add PostgreSQL and Prisma
- [ ] Add authentication
- [ ] Add organization and user models
- [ ] Create the administration dashboard
- [ ] Add seed data

### Milestone 3 — GraphQL Foundation

- [ ] Add Apollo Server
- [ ] Add Apollo Client
- [ ] Define the initial GraphQL schema
- [ ] Configure GraphQL Code Generator
- [ ] Add resolver tests

### Milestone 4 — Lead Management

- [ ] Build the public service-request form
- [ ] Store leads through GraphQL
- [ ] Build the lead dashboard
- [ ] Add status management
- [ ] Add activity history

### Milestone 5 — Estimates and Jobs

- [ ] Build customer and property records
- [ ] Add property assessments
- [ ] Build the estimate editor
- [ ] Add customer approval
- [ ] Convert approved estimates into jobs

## Project Status

The application is currently in active development and is not ready for production use.

## Author

**Dave Stewart**

Software Engineer specializing in front-end and full-stack web application development.

- LinkedIn: Add link
- Portfolio: Add link
- GitHub: Add link

## License

A license has not yet been selected.
