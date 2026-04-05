# Copilot Instructions

This file provides repository-specific guidance for the agent. Do not duplicate information that can be obtained from package.json (scripts, dependencies, versions, package manager); the agent should read package.json when that information is needed. If the agent encounters non-standard or unexpected behavior, notify the user before proceeding and consider adding it to the conventions.

## Conventions
- Use the app/ directory for routes and layouts.
- Place reusable logic in lib/, and database models in db/.
- Prefer server components by default; add "use client" only when a client component is required.
- Follow ESLint rules defined in eslint.config.mjs — do not disable rules without justification.
- Keep tests alongside source files or in a __tests__ directory. Use the project's configured test runner.

