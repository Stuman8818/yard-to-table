# Yard To Table marketing

Static, brand-focused website for Yard To Table Landscaping. This app contains no customer intake,
database access, GraphQL operations, or internal field-service workflows.

The service-request section embeds Trellis's public intake surface. It defaults to
`https://trellis-software.vercel.app`; set `NEXT_PUBLIC_TRELLIS_URL` to override the Trellis origin,
such as `http://localhost:3000` for local development.

Run it from the repository root with `npm run dev:ytt`.
