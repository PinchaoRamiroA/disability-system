# Frontend Architecture

## Core Stack

- **Framework**: Next.js 16, React 19, TypeScript
- **Routing**: App Router with Server Components
- **Styling**: TailwindCSS + CSS variables for theming
- **Forms**: React Hook Form + Zod

## Architecture Principles

- Server-first architecture
- Domain-oriented organization
- Modular and scalable

## Folder Structure

- accord to framewrok next js 16 


## State Management

Prefer:
- React Server Components
- Server Actions
- URL state
- Zustand for lightweight global state

Avoid:
- Redux
- Over-engineered global state

## Data Fetching

Prefer:
- Server-side fetching
- Streaming
- Suspense

Use TanStack Query only when client caching is truly necessary.

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `MedicalLeaveCard.tsx` |
| Hooks | camelCase + use | `useMedicalLeaves.ts` |
| Services | camelCase | `medicalLeaveService.ts` |
| Types | PascalCase | `MedicalLeaveType.ts` |

## Performance Rules

- Lazy load heavy components
- Optimize rendering
- Avoid unnecessary client components
- Keep bundles small
- Use memoization carefully