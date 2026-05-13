# Project AI Instructions

## Priority Order

Agents MUST read documentation in this order:

1. **docs/business/** - Business rules and domain logic
2. **docs/architecture/** - System architecture
3. **docs/frontend/** - UI system and components
4. **docs/backend/** - API endpoints
5. **docs/database/** - Database schema

---

## Developer Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Jest tests |
| `npm run cy` | Open Cypress UI |
| `npm run e2e` | Run E2E tests with dev server |
| `npm run e2e:headless` | Run E2E tests headless |

Pre-commit hook runs `lint-staged` on staged files.

---

## Quick Reference

| Need | Read |
|------|------|
| API endpoints | docs/backend/endpoints.md |
| Database schema | docs/database/schema.md |
| Business flow | docs/business/medical-leaves-flow.md |
| UI components | docs/frontend/ui-system.md |
| Frontend architecture | docs/architecture/frontend.md |
| Backend standards | docs/architecture/backend.md |

---

## Contracts (TypeScript/Zod)

All API contracts are in `contracts/`:

- `contracts/auth/` - Authentication types
- `contracts/incapacidades/` - Medical leaves types
- `contracts/documentos/` - Documents types
- `contracts/cobros/` - Payments types
- `contracts/cartera/` - Portfolio types
- `contracts/notificaciones/` - Notifications types
- `contracts/catalogos/` - Catalog types

---

## Design Reference

For design system and visual guidelines, see: **DESING.md**

---

## Naming Convention

Use consistent naming:

```
incapacidad          (NOT: leave, medical, health)
incapacidad-form
incapacidad-service
incapacidad-schema
documento            (NOT: file, attachment)
pago                 (NOT: payment, collection)
```

---

## Code Style

- ESLint rules: `prefer-const`, single quotes, no semicolons
- Prettier: 4 spaces, no semicolons, single quotes, trailing commas
- TypeScript strict mode enabled
- Path aliases: `@/components/*`, `@/hooks/*`, `@/store/*`, etc.

---

## Absolute Rules

- **Never** invent API routes not documented in docs/backend/endpoints.md
- **Never** create database fields not documented in docs/database/schema.md
- **Always** use contracts/ for API types and Zod schemas
- **Always** reuse existing components from src/components/
- **Prefer** server-first architecture
- **Do not** fetch directly inside UI components
- **Do not** use inline business logic
- **Do not** create duplicated DTOs
- **Prefer** Redux (via RTK) for global state; only use for truly global state
- **Avoid** MUI for basic layouts, buttons, typography - use custom components instead; reserve MUI for complex interactive components (datagrids, datepickers, etc.)