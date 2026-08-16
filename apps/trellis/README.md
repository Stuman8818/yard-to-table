# Trellis

Field-service application for Yard To Table. Trellis owns customer intake and the operational
workflows for leads, consultations, assessments, estimates, customer conversion, and jobs.

The reusable customer intake surface is available at `/embed/intake`. Branded sites should embed
that route rather than copying the form or calling Trellis's GraphQL API directly.

Run it from the repository root with `npm run dev:trellis` (or `npm run dev`).
